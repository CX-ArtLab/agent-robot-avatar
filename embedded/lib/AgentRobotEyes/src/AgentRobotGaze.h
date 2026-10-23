#pragma once
#include <stdint.h>
#include <math.h>

namespace agent_robot {

// Host supplies the target position and a normalized proximity score. This
// helper owns no camera or sensor; one selected target is supplied by the host.
struct GazeTarget {
  bool detected = false;
  float x = 0, y = 0; // normalized [-1, 1]
  float proximity = 0; // 0 = far/absent, 1 = close; calibration belongs to host
  bool moving = true; // supplied by the detector; used only in movingOnly mode
};
struct GazeConfig {
  float enterThreshold = .5f, exitThreshold = .4f;
  uint16_t holdMs = 600, responseMs = 140;
  bool movingOnly = false;
};
class GazeTracker {
 public:
  bool begin(const GazeConfig& config, uint32_t now) {
    if (!setConfig(config)) return false;
    x_ = y_ = tx_ = ty_ = 0;
    active_ = false; last_ = seen_ = now;
    return true;
  }
  bool setConfig(const GazeConfig& config) {
    if (!isfinite(config.enterThreshold) || !isfinite(config.exitThreshold) ||
        config.exitThreshold < 0 || config.enterThreshold > 1 ||
        config.exitThreshold >= config.enterThreshold || config.holdMs > 5000 ||
        config.responseMs > 2000) return false;
    config_ = config;
    return true;
  }
  void observe(const GazeTarget& target, uint32_t now) {
    if (!target.detected || (config_.movingOnly && !target.moving) || !isfinite(target.x) || !isfinite(target.y) ||
        !isfinite(target.proximity) || target.proximity < 0 || target.proximity > 1) return;
    // An old target cannot preserve the lower exit threshold indefinitely.
    if (active_ && now - seen_ > config_.holdMs) active_ = false;
    if (target.proximity < (active_ ? config_.exitThreshold : config_.enterThreshold)) return;
    active_ = true; seen_ = now;
    tx_ = limit(target.x); ty_ = limit(target.y);
  }
  bool update(uint32_t now) {
    const uint32_t dt = now - last_;
    last_ = now;
    if (active_ && now - seen_ > config_.holdMs) active_ = false;
    if (!active_) tx_ = ty_ = 0;
    const float blend = config_.responseMs ? dt / (config_.responseMs + static_cast<float>(dt)) : 1;
    const float oldX=x_, oldY=y_;
    x_ += (tx_-x_) * blend; y_ += (ty_-y_) * blend;
    if (fabsf(tx_-x_) < .001f) x_=tx_;
    if (fabsf(ty_-y_) < .001f) y_=ty_;
    return oldX != x_ || oldY != y_;
  }
  float x() const { return x_; }
  float y() const { return y_; }
  bool tracking() const { return active_; }
 private:
  static float limit(float value) { return value < -1 ? -1 : value > 1 ? 1 : value; }
  GazeConfig config_;
  float x_=0, y_=0, tx_=0, ty_=0;
  uint32_t last_=0, seen_=0;
  bool active_=false;
};
} // namespace agent_robot
