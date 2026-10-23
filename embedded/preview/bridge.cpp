#include "AgentRobotEyes.h"
#include "AgentRobotGaze.h"

// Only the host ABI lives here. All expression geometry/timing is compiled
// directly from the same unmodified source file used by the firmware.
namespace {
agent_robot::Eyes eyes;
uint8_t pixels[32768]; // largest supported 512 x 512 one-bit canvas
agent_robot::GazeTracker gaze;
bool tracking = false;
uint32_t lastTracking = 0;
uint32_t trackingInterval = 40;
}

extern "C" {
int eyes_init(int width, int height, int fps, int blink, int transition, uint32_t now) {
  if (width < 16 || width > 512 || height < 16 || height > 512 ||
      fps < 1 || fps > 60 || transition < 0 || transition > 2000) return 0;
  agent_robot::EyesConfig config;
  config.width = static_cast<uint16_t>(width);
  config.height = static_cast<uint16_t>(height);
  config.maxFps = static_cast<uint8_t>(fps);
  config.autoBlink = blink != 0;
  config.transitionMs = static_cast<uint16_t>(transition);
  tracking = false;
  lastTracking=now;
  trackingInterval=(1000u+fps-1)/fps;
  gaze.begin(agent_robot::GazeConfig(),now);
  return eyes.begin(config, pixels, sizeof(pixels), now);
}
int eyes_layout(int x, int y, int width, int height, int fit, int shape,
                float zoom, float offsetX, float offsetY) {
  if (x < 0 || y < 0 || width < 0 || height < 0 || x > 512 || y > 512 ||
      width > 512 || height > 512 || fit < 0 || fit > 1 || shape < 0 || shape > 1) return 0;
  agent_robot::EyesLayout layout;
  layout.x=x; layout.y=y; layout.width=width; layout.height=height;
  layout.fit=static_cast<agent_robot::FitMode>(fit);
  layout.shape=static_cast<agent_robot::ScreenShape>(shape);
  layout.zoom=zoom; layout.offsetX=offsetX; layout.offsetY=offsetY;
  return eyes.setLayout(layout);
}
void eyes_tracking(int enabled, uint32_t now) {
  tracking=enabled != 0;
  lastTracking=now;
  gaze.begin(agent_robot::GazeConfig(),now);
  eyes.lookAt(0,0);
}
void eyes_target(float x, float y, float proximity, int detected, uint32_t now) {
  agent_robot::GazeTarget target;
  target.x=x; target.y=y; target.proximity=proximity; target.detected=detected != 0;
  if (tracking) gaze.observe(target,now);
}
void eyes_motion_target(float x, float y, float proximity, int detected, int moving, uint32_t now) {
  agent_robot::GazeTarget target;
  target.x=x;target.y=y;target.proximity=proximity;
  target.detected=detected!=0;target.moving=moving!=0;
  if (tracking) gaze.observe(target,now);
}
int eyes_gaze_config(float enter, float exit, int holdMs, int responseMs, int movingOnly) {
  if (holdMs<0 || holdMs>5000 || responseMs<0 || responseMs>2000) return 0;
  agent_robot::GazeConfig config;
  config.enterThreshold=enter;config.exitThreshold=exit;
  config.holdMs=holdMs;config.responseMs=responseMs;config.movingOnly=movingOnly!=0;
  return gaze.setConfig(config);
}
int eyes_is_tracking() { return tracking && gaze.tracking(); }
int eyes_play(int action, uint32_t now) {
  if (action < 0 || action >= static_cast<int>(agent_robot::Action::Count)) return 0;
  return eyes.play(static_cast<agent_robot::Action>(action), now);
}
void eyes_gaze(float x, float y) { eyes.lookAt(x, y); }
int eyes_gaze_range(int range) {
  if (range < 0 || range > 2) return 0;
  return eyes.setGazeRange(static_cast<agent_robot::GazeRange>(range));
}
int eyes_update(uint32_t now) {
  if (tracking && now-lastTracking >= trackingInterval) {
    gaze.update(now); lastTracking=now;
    const auto action=eyes.action();
    if (action == agent_robot::Action::Idle) eyes.lookAt(gaze.x(),gaze.y());
  }
  return eyes.update(now);
}
int eyes_action() { return static_cast<int>(eyes.action()); }
int eyes_duration(int action) {
  if (action < 0 || action >= static_cast<int>(agent_robot::Action::Count)) return 0;
  return static_cast<int>(agent_robot::Eyes::actionDuration(static_cast<agent_robot::Action>(action)));
}
const uint8_t* eyes_data() { return eyes.data(); }
int eyes_size() { return static_cast<int>(eyes.bufferSize()); }
int eyes_stride() { return eyes.stride(); }
}
