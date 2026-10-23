#include "AgentRobotEyes.h"
#include "AgentRobotWebMotion.h"

#include <math.h>
#include <string.h>

namespace agent_robot {
namespace {
constexpr float PI = 3.14159265358979323846f;
float clamp(float x, float low, float high) { return x < low ? low : (x > high ? high : x); }
float smooth(float t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
float lerp(float a, float b, float t) { return a + (b - a) * t; }
// Idle gaze reach per GazeRange, in face units: {horizontal, vertical}.
const float GAZE_REACH[][2] = {{8, 6}, {20, 18}, {30, 21}};
// The Web avatar narrows an eye as it nears the head edge (32 / 208 in its
// 240-unit drawing, i.e. -8 / 168 here): within 58 units, width shrinks by up
// to 22 % and height by 8 %, and the eye moves inward by 58 % of the lost width.
float edgeFactor(float distance) { return clamp(1 - distance / 58, 0, 1); }
const char* const NAMES[] = {
  "idle", "bored", "waiting-spin", "waiting-wrap", "input", "affirm", "success", "failure",
  "wary", "inspect", "angry", "refuse", "surprise", "love", "random", "sleep", "wake", "waiting-wave"
};

// Names that still parse, matching the Web avatar: "waiting" is the generic name
// for the default spin, the others are deprecated and removed in 1.0.
struct Alias { const char* name; Action action; };
const Alias ALIASES[] = {
  {"waiting", Action::WaitingSpin}, {"wait", Action::WaitingSpin}, {"send", Action::Affirm},
  {"failed", Action::Failure}, {"fail", Action::Failure}, {"warning", Action::Wary},
  {"verify", Action::Inspect}, {"review", Action::Inspect}, {"blocked", Action::Angry},
  {"policy-blocked", Action::Angry}, {"error", Action::Refuse}, {"system-error", Action::Refuse},
  {"connection-error", Action::Refuse}, {"slot", Action::Random},
};
static_assert(sizeof(NAMES) / sizeof(NAMES[0]) == static_cast<unsigned>(Action::Count), "Action names must stay complete");
}

size_t Eyes::requiredBytes(uint16_t width, uint16_t height) {
  if (width < 16 || height < 16 || width > 512 || height > 512) return 0;
  return ((static_cast<size_t>(width) + 7) / 8) * height;
}

Eyes::Pose Eyes::webPose(Action action, uint32_t elapsed) {
  const auto& clip = web_reference::CLIPS[static_cast<unsigned>(action)];
  const uint32_t index = elapsed / 20;
  const unsigned a = index < clip.count ? index : clip.count - 1;
  const unsigned b = a + 1 < clip.count ? a + 1 : a;
  const float t = (elapsed % 20) / 20.f;
  Pose result;
  Eye* eyes[] = {&result.left, &result.right};
  for (unsigned side = 0; side < 2; ++side) {
    float v[10];
    for (unsigned j = 0; j < 10; ++j) {
      const float scale = j == 7 || j == 8 ? 4096.f : 100.f;
      const float first = clip.values[a * 20 + side * 10 + j] / scale;
      const float second = clip.values[b * 20 + side * 10 + j] / scale;
      v[j] = j == 9 ? first : lerp(first,second,t);
    }
    const float corner = v[9] < 0 ? -1 : fminf(v[9],fminf(v[2],v[3]));
    *eyes[side] = {v[0],v[1],v[2],v[3],v[4],v[5],v[6],v[7],v[8],corner,corner};
  }
  return result;
}
Eyes::Pose Eyes::neutral() { return webPose(Action::Idle,0); }

bool Eyes::begin(const EyesConfig& config, uint8_t* buffer, size_t capacity, uint32_t now) {
  const size_t needed = requiredBytes(config.width, config.height);
  if (!needed || !buffer || capacity < needed || config.maxFps < 1 || config.maxFps > 60
      || config.transitionMs > 2000 || static_cast<unsigned>(config.gazeRange) > 2) return false;
  config_ = config;
  layout_ = EyesLayout();
  buffer_ = buffer;
  bytes_ = needed;
  stride_ = (config.width + 7) / 8;
  memset(buffer_, 0, bytes_);
  started_ = lastFrame_ = now;
  action_ = Action::Idle;
  from_ = current_ = neutral();
  crossfade_ = false;
  lookX_ = lookY_ = 0;
  force_ = true;
  sleepRendered_ = false;
  return true;
}

const char* Eyes::actionName(Action action) {
  const unsigned index = static_cast<unsigned>(action);
  return index < static_cast<unsigned>(Action::Count) ? NAMES[index] : nullptr;
}

bool Eyes::parseAction(const char* name, Action& result) {
  if (!name) return false;
  for (unsigned i = 0; i < static_cast<unsigned>(Action::Count); ++i) {
    if (strcmp(name, NAMES[i]) == 0) { result = static_cast<Action>(i); return true; }
  }
  for (const Alias& alias : ALIASES) {
    if (strcmp(name, alias.name) == 0) { result = alias.action; return true; }
  }
  return false;
}

uint32_t Eyes::duration(Action action) {
  switch (action) {
    case Action::Bored: return 4000;
    case Action::Affirm: return 1360;
    case Action::Success: return 2000;
    case Action::Failure: return 2720;
    case Action::Wary: return 3850;
    case Action::Inspect: return 6870;
    case Action::Angry: return 1980;
    case Action::Refuse: return 1840;
    case Action::Surprise: return 1770;
    case Action::Love: return 3190;
    case Action::Random: return 2260;
    case Action::Wake: return 750;
    default: return 0;
  }
}

bool Eyes::play(Action action, uint32_t now) {
  if (!buffer_ || !actionName(action)) return false;
  if (action == action_ && (isWaiting() || isSleeping() || action == Action::Input)) return true;
  // Sample at the command timestamp, even if the last display flush was delayed.
  from_ = poseAt(now);
  current_ = from_;
  const bool cursorShape = from_.left.corner >= 0 || from_.right.corner >= 0;
  crossfade_ = (action_ != Action::Idle || action == Action::WaitingWave || cursorShape)
      && (action != Action::Wake || cursorShape);
  action_ = action;
  started_ = now;
  force_ = true;
  sleepRendered_ = false;
  return true;
}

bool Eyes::play(const char* name, uint32_t now) {
  Action action;
  return parseAction(name, action) && play(action, now);
}
void Eyes::reset(uint32_t now) { play(Action::Idle, now); }
void Eyes::startWaiting(uint32_t now, bool wrap) { play(wrap ? Action::WaitingWrap : Action::WaitingSpin, now); }
void Eyes::stopWaiting(uint32_t now) { if (isWaiting()) reset(now); }
void Eyes::sleep(uint32_t now) { play(Action::Sleep, now); }
void Eyes::wake(uint32_t now) { if (isSleeping()) play(Action::Wake, now); }

void Eyes::lookAt(float x, float y) {
  const float lx = isfinite(x) ? clamp(x, -1, 1) : 0;
  const float ly = isfinite(y) ? clamp(y, -1, 1) : 0;
  if (lx == lookX_ && ly == lookY_) return;
  lookX_ = lx;
  lookY_ = ly;
  force_ = true;
}

bool Eyes::setGazeRange(GazeRange range) {
  if (range != GazeRange::Small && range != GazeRange::Medium && range != GazeRange::Large) return false;
  config_.gazeRange = range;
  force_ = true;
  return true;
}

bool Eyes::setTiming(uint8_t maxFps, bool autoBlink, uint16_t transitionMs) {
  if (!buffer_ || maxFps < 1 || maxFps > 60 || transitionMs > 2000) return false;
  config_.maxFps = maxFps;
  config_.autoBlink = autoBlink;
  config_.transitionMs = transitionMs;
  force_ = true;
  return true;
}

bool Eyes::setLayout(const EyesLayout& layout) {
  if (!buffer_ || layout.x >= config_.width || layout.y >= config_.height ||
      (layout.width && layout.width > config_.width - layout.x) ||
      (layout.height && layout.height > config_.height - layout.y) ||
      (layout.fit != FitMode::Contain && layout.fit != FitMode::Cover) ||
      (layout.shape != ScreenShape::Rectangle && layout.shape != ScreenShape::Circle) ||
      (layout.shape == ScreenShape::Circle && config_.width != config_.height) ||
      !isfinite(layout.zoom) || layout.zoom < .25f || layout.zoom > 3 ||
      !isfinite(layout.offsetX) || fabsf(layout.offsetX) > 1 ||
      !isfinite(layout.offsetY) || fabsf(layout.offsetY) > 1) return false;
  layout_ = layout;
  force_ = true;
  sleepRendered_ = false;
  return true;
}

Eyes::Eye Eyes::mixEye(const Eye& a, const Eye& b, float t) {
  if (t <= 0) return a;
  if (t >= 1) return b;
  // A full-radius rounded rectangle is an ellipse. Interpolate both corner
  // axes along with the bounds instead of holding the old primitive until
  // the final frame. Keep the ellipse fast path for ellipse-only transitions.
  const bool ellipses = a.corner < 0 && b.corner < 0;
  const float ax = a.corner < 0 ? a.rx : fminf(a.corner,a.rx);
  const float ay = a.corner < 0 ? a.ry : fminf(a.cornerY,a.ry);
  const float bx = b.corner < 0 ? b.rx : fminf(b.corner,b.rx);
  const float by = b.corner < 0 ? b.ry : fminf(b.cornerY,b.ry);
  return {lerp(a.x,b.x,t), lerp(a.y,b.y,t), lerp(a.rx,b.rx,t), lerp(a.ry,b.ry,t),
          lerp(a.angle,b.angle,t), lerp(a.top,b.top,t), lerp(a.bottom,b.bottom,t),
          lerp(a.topSlope,b.topSlope,t), lerp(a.bottomSlope,b.bottomSlope,t),
          ellipses ? -1 : lerp(ax,bx,t), ellipses ? -1 : lerp(ay,by,t)};
}
Eyes::Pose Eyes::mix(const Pose& a, const Pose& b, float t) {
  return {mixEye(a.left,b.left,t), mixEye(a.right,b.right,t)};
}

Eyes::Pose Eyes::poseAt(uint32_t now) const {
  uint32_t elapsed = now - started_;
  const uint32_t total = duration(action_);
  Action selected = total && elapsed >= total ? Action::Idle : action_;
  if (selected == Action::WaitingSpin && elapsed >= 120) elapsed = 120 + (elapsed - 120) % 3200;
  if (selected == Action::WaitingWrap && elapsed >= 120) elapsed = 120 + (elapsed - 120) % 2400;
  Pose p;
  if (selected == Action::WaitingWave) {
    // Restore the experimental v0.1 waiting motion verbatim as a NEW variant.
    // Source: e600f7e3b22dd792c3fc7b26994fa6bae39f1e66, poseAt/Waiting.
    // Legacy neutral geometry is intentional; original Web actions stay intact.
    const float phase = (elapsed % 1400) * 2 * PI / 1400;
    p = {{46, 50 + sinf(phase) * 10, 27, 29, 0, -100, 100, 0, 0, -1, -1},
         {114, 50 + sinf(phase + .7f) * 10, 27, 29, 0, -100, 100, 0, 0, -1, -1}};
  } else {
    p = webPose(selected,elapsed);
  }
  if (selected == Action::Input && p.left.corner >= 0 && ((now / 265) % 2))
    p.left.rx = p.right.rx = 0;
  if (selected == Action::Idle) {
    const float* reach = GAZE_REACH[static_cast<unsigned>(config_.gazeRange)];
    const float dx = lookX_ * reach[0], dy = lookY_ * reach[1];
    Eye* eyes[] = {&p.left, &p.right};
    for (unsigned side = 0; side < 2; ++side) {
      Eye& e = *eyes[side];
      e.y += dy;
      if (dx == 0) continue;
      const float outward = side ? 1.f : -1.f;
      const float edge = side ? 168.f : -8.f;
      // Apply only the change from the resting edge squash, so a centred gaze
      // keeps the sampled Web pose exactly.
      const float f0 = edgeFactor(outward * (edge - e.x)), f = edgeFactor(outward * (edge - e.x - dx));
      const float w0 = 1 - .22f * f0 * f0, w = 1 - .22f * f * f;
      const float rx = e.rx / w0 * w;
      e.x += dx - outward * 2 * (e.rx - rx) * .58f;
      e.rx = rx;
      e.ry = e.ry / (1 - .08f * f0 * f0) * (1 - .08f * f * f);
    }
    if (config_.autoBlink) {
      const uint32_t blink = (now - started_) % 4200;
      if (blink >= 3800 && blink < 3980) {
        const float phase = (blink - 3800) / 180.f;
        const float openness = phase < .5f ? lerp(1,.08f,phase*2) : lerp(.08f,1,(phase-.5f)*2);
        p.left.ry = fmaxf(1.3f,p.left.ry*openness);
        p.right.ry = fmaxf(1.3f,p.right.ry*openness);
        p.left.y += (58-2*p.left.ry)*.02f; p.right.y += (58-2*p.right.ry)*.02f;
      }
    }
  }
  const uint32_t commandElapsed = now - started_;
  if (crossfade_ && config_.transitionMs && commandElapsed < config_.transitionMs)
    p = mix(from_,p,smooth(commandElapsed/static_cast<float>(config_.transitionMs)));
  return p;
}

bool Eyes::update(uint32_t now) {
  if (!buffer_) return false;
  const uint32_t elapsed = now - started_;
  if (!force_ && action_ == Action::Sleep && sleepRendered_) return false;
  const uint32_t interval = (1000u + config_.maxFps - 1) / config_.maxFps;
  if (!force_ && now - lastFrame_ < interval) return false;
  if (duration(action_) && elapsed >= duration(action_)) {
    from_ = poseAt(now);
    action_ = Action::Idle;
    started_ = now;
  }
  current_ = poseAt(now);
  render(current_);
  lastFrame_ = now;
  sleepRendered_ = action_ == Action::Sleep && (now - started_) >= 3400;
  force_ = false;
  return true;
}

void Eyes::setPixel(int x, int y) {
  if (x < 0 || y < 0 || x >= config_.width || y >= config_.height) return;
  const unsigned vw = layout_.width ? layout_.width : config_.width - layout_.x;
  const unsigned vh = layout_.height ? layout_.height : config_.height - layout_.y;
  if (x < layout_.x || y < layout_.y || static_cast<unsigned>(x) >= layout_.x + vw ||
      static_cast<unsigned>(y) >= layout_.y + vh) return;
  if (layout_.shape == ScreenShape::Circle) {
    const float radius = config_.width / 2.f;
    const float dx = x + .5f - radius, dy = y + .5f - radius;
    if (dx * dx + dy * dy > radius * radius) return;
  }
  buffer_[static_cast<size_t>(y) * stride_ + (x >> 3)] |= static_cast<uint8_t>(0x80u >> (x & 7));
}

void Eyes::drawEye(const Eye& e, float scale, float ox, float oy) {
  if (e.rx < .05f || e.ry < .05f) return;
  const float rx = e.rx * scale, ry = e.ry * scale;
  const float cx = ox + e.x * scale, cy = oy + e.y * scale;
  const float angle = e.angle * PI / 180;
  const float c = cosf(angle), s = sinf(angle);
  const float ix = 1 / (rx * rx), iy = 1 / (ry * ry);
  const float a = c * c * ix + s * s * iy;
  const float extentY = e.corner >= 0 ? fabsf(rx*s)+fabsf(ry*c) : sqrtf(rx * rx * s * s + ry * ry * c * c);
  const int y0 = static_cast<int>(fmaxf(0, floorf(cy - extentY)));
  const int y1 = static_cast<int>(fminf(config_.height - 1.f, ceilf(cy + extentY)));
  const bool noClip = e.top <= -e.ry - fabsf(e.topSlope) * e.rx
      && e.bottom >= e.ry + fabsf(e.bottomSlope) * e.rx;
  const float cornerX = fminf(e.corner*scale,rx), cornerY = fminf(e.cornerY*scale,ry);
  const float cornerIx = cornerX > 0 ? 1/(cornerX*cornerX) : 0;
  const float cornerIy = cornerY > 0 ? 1/(cornerY*cornerY) : 0;
  for (int y = y0; y <= y1; ++y) {
    const float dy = y + .5f - cy;
    const float b = 2 * c * s * dy * (ix - iy);
    const float q = dy * dy * (s * s * ix + c * c * iy) - 1;
    const float discriminant = b * b - 4 * a * q;
    if (discriminant < 0 && e.corner < 0) continue;
    const float root = sqrtf(fmaxf(0,discriminant));
    const float extentX = fabsf(rx*c)+fabsf(ry*s);
    const int x0 = static_cast<int>(fmaxf(0,ceilf((e.corner >= 0 ? cx-extentX : cx+(-b-root)/(2*a))-.5f)));
    const int x1 = static_cast<int>(fminf(config_.width-1.f,floorf((e.corner >= 0 ? cx+extentX : cx+(-b+root)/(2*a))-.5f)));
    for (int x = x0; x <= x1; ++x) {
      if (e.corner >= 0) {
        const float dx = x+.5f-cx;
        const float lx = fabsf(c*dx+s*dy), ly = fabsf(-s*dx+c*dy);
        if (lx > rx || ly > ry) continue;
        const float qx = fmaxf(0,lx-(rx-cornerX)), qy = fmaxf(0,ly-(ry-cornerY));
        // Preserve the original circular-corner rasterization for the input
        // cursor, with elliptical corners used only during a shape morph.
        if (cornerX == cornerY ? qx*qx+qy*qy > cornerX*cornerX
            : qx*qx*cornerIx+qy*qy*cornerIy > 1) continue;
      }
      if (!noClip) {
        const float dx = x + .5f - cx;
        const float localX = (c * dx + s * dy) / scale;
        const float localY = (-s * dx + c * dy) / scale;
        if (localY < e.top + e.topSlope * localX || localY > e.bottom + e.bottomSlope * localX) continue;
      }
      setPixel(x,y);
    }
  }
}

void Eyes::render(const Pose& pose) {
  memset(buffer_, 0, bytes_);
  const float width = layout_.width ? layout_.width : config_.width - layout_.x;
  const float height = layout_.height ? layout_.height : config_.height - layout_.y;
  float scale = layout_.fit == FitMode::Cover ? fmaxf(width / 160.f, height / 100.f)
      : fminf(width / 160.f, height / 100.f);
  if (layout_.shape == ScreenShape::Circle && layout_.fit == FitMode::Contain)
    scale = fminf(scale, fminf(width,height) / sqrtf(160.f * 160 + 100.f * 100));
  scale *= layout_.zoom;
  const float ox = layout_.x + (width - 160 * scale) / 2 + layout_.offsetX * width / 2;
  const float oy = layout_.y + (height - 100 * scale) / 2 + layout_.offsetY * height / 2;
  drawEye(pose.left, scale, ox, oy);
  drawEye(pose.right, scale, ox, oy);
}

} // namespace agent_robot

