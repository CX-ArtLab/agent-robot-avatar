#include "AgentRobotEyes.h"

#include <math.h>
#include <string.h>

namespace agent_robot {
namespace {
constexpr float PI = 3.14159265358979323846f;
float clamp(float x, float low, float high) { return x < low ? low : (x > high ? high : x); }
float smooth(float t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
float lerp(float a, float b, float t) { return a + (b - a) * t; }
const char* const NAMES[] = {
  "idle", "bored", "waiting", "waiting-wrap", "input", "send", "success", "failure",
  "warning", "inspect", "blocked", "error", "surprise", "love", "random", "sleep", "wake"
};
static_assert(sizeof(NAMES) / sizeof(NAMES[0]) == static_cast<unsigned>(Action::Count), "Action names must stay complete");
}

size_t Eyes::requiredBytes(uint16_t width, uint16_t height) {
  if (width < 16 || height < 16 || width > 512 || height > 512) return 0;
  return ((static_cast<size_t>(width) + 7) / 8) * height;
}

Eyes::Pose Eyes::neutral() {
  // The Web avatar's 54x58 elliptical eyes and 68-unit center spacing,
  // translated into an independent 160x100 face coordinate system.
  Pose p = {{46, 50, 27, 29, 0, -100, 100, 0, 0},
            {114, 50, 27, 29, 0, -100, 100, 0, 0}};
  return p;
}

bool Eyes::begin(const EyesConfig& config, uint8_t* buffer, size_t capacity, uint32_t now) {
  const size_t needed = requiredBytes(config.width, config.height);
  if (!needed || !buffer || capacity < needed || config.maxFps < 1 || config.maxFps > 60
      || config.transitionMs > 2000) return false;
  config_ = config;
  buffer_ = buffer;
  bytes_ = needed;
  stride_ = (config.width + 7) / 8;
  memset(buffer_, 0, bytes_);
  started_ = lastFrame_ = now;
  action_ = Action::Idle;
  from_ = current_ = neutral();
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
  if (!strcmp(name, "angry") || !strcmp(name, "policy-blocked")) result = Action::Blocked;
  else if (!strcmp(name, "system-error") || !strcmp(name, "connection-error")) result = Action::Error;
  else if (!strcmp(name, "slot")) result = Action::Random;
  else return false;
  return true;
}

uint32_t Eyes::duration(Action action) {
  switch (action) {
    case Action::Bored: return 2400;
    case Action::Send: return 1100;
    case Action::Success: return 1700;
    case Action::Failure: return 2100;
    case Action::Warning: return 3227;
    case Action::Inspect: return 2600;
    case Action::Blocked: return 1900;
    case Action::Error: return 2200;
    case Action::Surprise: return 1600;
    case Action::Love: return 2880;
    case Action::Random: return 2800;
    case Action::Wake: return 800;
    default: return 0; // Idle, waiting, input and sleep persist until the host changes them.
  }
}

bool Eyes::play(Action action, uint32_t now) {
  if (!buffer_ || !actionName(action)) return false;
  if (action == action_ && (isWaiting() || isSleeping() || action == Action::Input)) return true;
  // Sample at the command timestamp, even if the last display flush was delayed.
  from_ = poseAt(now);
  current_ = from_;
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
void Eyes::startWaiting(uint32_t now, bool wrap) { play(wrap ? Action::WaitingWrap : Action::Waiting, now); }
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

Eyes::Eye Eyes::mixEye(const Eye& a, const Eye& b, float t) {
  return {lerp(a.x,b.x,t), lerp(a.y,b.y,t), lerp(a.rx,b.rx,t), lerp(a.ry,b.ry,t),
          lerp(a.angle,b.angle,t), lerp(a.top,b.top,t), lerp(a.bottom,b.bottom,t),
          lerp(a.topSlope,b.topSlope,t), lerp(a.bottomSlope,b.bottomSlope,t)};
}
Eyes::Pose Eyes::mix(const Pose& a, const Pose& b, float t) {
  return {mixEye(a.left,b.left,t), mixEye(a.right,b.right,t)};
}

Eyes::Pose Eyes::poseAt(uint32_t now) const {
  Pose p = neutral();
  Pose idle = neutral();
  idle.left.x += lookX_ * 8; idle.right.x += lookX_ * 8;
  idle.left.y += lookY_ * 6; idle.right.y += lookY_ * 6;
  const uint32_t elapsed = now - started_; // unsigned subtraction handles millis() rollover
  const float t = static_cast<float>(elapsed);
  const uint32_t total = duration(action_);
  // A missed deadline still samples neutral before replacement or completion.
  if (total && elapsed >= total) return idle;
  switch (action_) {
    case Action::Bored: {
      const float gaze = sinf(t * PI / 1200) * 10;
      p.left.x += gaze; p.right.x += gaze;
      p.left.top = p.right.top = -8;
      break;
    }
    case Action::Waiting: {
      const float phase = t * 2 * PI / 1400;
      p.left.y += sinf(phase) * 10;
      p.right.y += sinf(phase + .7f) * 10;
      break;
    }
    case Action::WaitingWrap: {
      const float phase = t * 2 * PI / 1800;
      p.left.x = 80 - 34 * cosf(phase);
      p.right.x = 80 + 34 * cosf(phase);
      p.left.y = 50 + 10 * sinf(phase);
      p.right.y = 50 - 10 * sinf(phase);
      p.left.rx = p.right.rx = 27 * fabsf(cosf(phase));
      break;
    }
    case Action::Input:
      p.left.x = p.right.x = 80;
      p.left.rx = p.right.rx = 6;
      p.left.ry = p.right.ry = ((elapsed / 265) % 2) ? 0 : 39;
      break;
    case Action::Send: {
      const float nod = sinf(clamp(t / 760,0,1) * 2 * PI);
      p.left.y += nod * 10; p.right.y += nod * 10;
      p.left.ry *= 1 - .25f * fabsf(nod); p.right.ry = p.left.ry;
      break;
    }
    case Action::Success:
      p.left.rx = p.right.rx = 29;
      p.left.bottom = p.right.bottom = -1;
      p.left.y += sinf(t * 2 * PI / 650) * 3;
      p.right.y = p.left.y;
      break;
    case Action::Failure:
      p.left.top = p.right.top = -5;
      p.left.topSlope = -.3f; p.right.topSlope = .3f;
      p.left.y += 5; p.right.y += 5;
      break;
    case Action::Warning: {
      const float approach = smooth(t / 600);
      p.left.rx *= 1 + .37f * approach; p.left.ry *= 1 + .4f * approach;
      p.right.rx *= 1 - .32f * approach;
      p.left.x += 7 * approach; p.right.x += 9 * approach;
      p.left.angle = -6.5f * approach; p.right.angle = 7.5f * approach;
      p.left.top = -8; p.right.top = -10;
      p.left.topSlope = .47f; p.right.topSlope = -.31f;
      break;
    }
    case Action::Inspect:
      p.left.rx = 30; p.right.rx = 22;
      p.left.top = -10; p.right.top = -3;
      p.left.x += sinf(t * PI / 900) * 7;
      p.right.x += sinf(t * PI / 900) * 7;
      break;
    case Action::Blocked:
      p.left.top = p.right.top = -5;
      p.left.topSlope = .3f; p.right.topSlope = -.3f;
      break;
    case Action::Error: {
      const float shake = sinf(t * 2 * PI / 180) * 6 * (1 - t / total);
      p.left.x += shake; p.right.x += shake;
      p.left.ry = p.right.ry = 20;
      p.left.top = p.right.top = -6;
      break;
    }
    case Action::Surprise:
      p.left.rx = p.right.rx = 34;
      p.left.ry = p.right.ry = 34;
      p.left.x -= 3; p.right.x += 3;
      break;
    case Action::Love: {
      // Same inward-leaning ovals as the Web heart, without head sway.
      const float angle = 42 * PI / 180;
      const float beat = 1 + .12f * powf(fmaxf(0, sinf(t * 2 * PI / 760)), 2);
      const float dx = (40 * sinf(angle) - 13) * beat;
      p.left.x = 80 - dx; p.right.x = 80 + dx;
      p.left.y = p.right.y = 50;
      p.left.rx = p.right.rx = 28 * beat;
      p.left.ry = p.right.ry = 43 * beat;
      p.left.angle = -42; p.right.angle = 42;
      break;
    }
    case Action::Random: {
      Eye* eyes[] = {&p.left, &p.right};
      for (unsigned i = 0; i < 2; ++i) {
        const float stop = 1900 + i * 420;
        if (t >= stop) continue;
        const float remaining = (stop - t) / stop;
        const float angle = 6 * PI * (1 - remaining * remaining);
        eyes[i]->y += sinf(angle) * 20;
        eyes[i]->ry *= fabsf(cosf(angle));
      }
      break;
    }
    case Action::Sleep:
      p.left.rx = p.right.rx = 31;
      p.left.ry = p.right.ry = 5;
      break;
    case Action::Wake: {
      const float open = smooth(t / 400);
      p.left.ry = p.right.ry = lerp(5, 29, open);
      break;
    }
    default: break;
  }
  if (action_ != Action::Sleep && action_ != Action::Input && action_ != Action::Love) {
    p.left.x += lookX_ * 8; p.right.x += lookX_ * 8;
    p.left.y += lookY_ * 6; p.right.y += lookY_ * 6;
  }
  if (config_.autoBlink && (action_ == Action::Idle || action_ == Action::Bored)) {
    const uint32_t blink = elapsed % 4200;
    if (blink >= 3800 && blink < 3980) {
      const float phase = (blink - 3800) / 180.f;
      const float openness = 1 - .92f * sinf(phase * PI);
      p.left.ry *= openness; p.right.ry *= openness;
    }
  }
  if (config_.transitionMs && elapsed < config_.transitionMs) {
    p = mix(from_, p, smooth(t / config_.transitionMs));
  }
  if (total && total - elapsed < 260) p = mix(p, idle, smooth(1 - (total - elapsed) / 260.f));
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
  sleepRendered_ = action_ == Action::Sleep && (now - started_) >= config_.transitionMs;
  force_ = false;
  return true;
}

void Eyes::setPixel(int x, int y) {
  if (x < 0 || y < 0 || x >= config_.width || y >= config_.height) return;
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
  const float extentY = sqrtf(rx * rx * s * s + ry * ry * c * c);
  const int y0 = static_cast<int>(fmaxf(0, floorf(cy - extentY)));
  const int y1 = static_cast<int>(fminf(config_.height - 1.f, ceilf(cy + extentY)));
  const bool noClip = e.top <= -e.ry - fabsf(e.topSlope) * e.rx
      && e.bottom >= e.ry + fabsf(e.bottomSlope) * e.rx;
  for (int y = y0; y <= y1; ++y) {
    const float dy = y + .5f - cy;
    const float b = 2 * c * s * dy * (ix - iy);
    const float q = dy * dy * (s * s * ix + c * c * iy) - 1;
    const float discriminant = b * b - 4 * a * q;
    if (discriminant < 0) continue;
    const float root = sqrtf(discriminant);
    const int x0 = static_cast<int>(fmaxf(0, ceilf(cx + (-b - root) / (2 * a) - .5f)));
    const int x1 = static_cast<int>(fminf(config_.width - 1.f, floorf(cx + (-b + root) / (2 * a) - .5f)));
    for (int x = x0; x <= x1; ++x) {
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
  const float scale = fminf(config_.width / 160.f, config_.height / 100.f);
  const float ox = (config_.width - 160 * scale) / 2;
  const float oy = (config_.height - 100 * scale) / 2;
  drawEye(pose.left, scale, ox, oy);
  drawEye(pose.right, scale, ox, oy);
}

} // namespace agent_robot
