#pragma once

#include <stddef.h>
#include <stdint.h>

// Portable C++11 core. No Arduino, ESP-IDF, browser, display or allocator dependency.
namespace agent_robot {

enum class Action : uint8_t {
  Idle, Bored, Waiting, WaitingWrap, Input, Send, Success, Failure,
  Warning, Inspect, Blocked, Error, Surprise, Love, Random, Sleep, Wake,
  WaitingWave, Count // Append new actions to preserve existing numeric IDs.
};

// How far idle gaze moves the eyes in the 160 x 100 face area. Small is the
// original reach (8 x 6). Medium reaches the edge of the face area. Large goes
// slightly past it, narrowing the eyes near the edge like the Web avatar does.
enum class GazeRange : uint8_t { Small, Medium, Large };

struct EyesConfig {
  uint16_t width = 240;
  uint16_t height = 160;
  uint8_t maxFps = 30;
  bool autoBlink = true;
  uint16_t transitionMs = 240;
  GazeRange gazeRange = GazeRange::Medium;
};

enum class FitMode : uint8_t { Contain, Cover };
enum class ScreenShape : uint8_t { Rectangle, Circle };
struct EyesLayout {
  // Zero width/height uses the remaining framebuffer area from x/y.
  uint16_t x = 0, y = 0, width = 0, height = 0;
  FitMode fit = FitMode::Contain;
  ScreenShape shape = ScreenShape::Rectangle;
  float zoom = 1; // [0.25, 3], applied after automatic aspect-ratio fit
  float offsetX = 0, offsetY = 0; // [-1, 1], relative to half the viewport
};

class Eyes {
 public:
  // Caller owns the buffer for the entire lifetime of this instance.
  // Format: row-major 1 bit/pixel, MSB first, each row padded to a whole byte.
  static size_t requiredBytes(uint16_t width, uint16_t height);
  bool begin(const EyesConfig& config, uint8_t* buffer, size_t capacity, uint32_t now);
  bool play(Action action, uint32_t now);
  bool play(const char* action, uint32_t now);
  void reset(uint32_t now);
  void startWaiting(uint32_t now, bool wrap = false);
  void stopWaiting(uint32_t now);
  void sleep(uint32_t now);
  void wake(uint32_t now);
  // Explicit host-controlled gaze. This never installs pointer/touch listeners.
  void lookAt(float x, float y); // normalized [-1, 1]
  // Changes how far lookAt() moves the eyes; keeps the current animation.
  bool setGazeRange(GazeRange range);
  // Changes frame rate, blinking and transition time without restarting the
  // current action (begin() resets everything). Same limits as begin().
  bool setTiming(uint8_t maxFps, bool autoBlink, uint16_t transitionMs);
  // Layout changes preserve the current animation. Circle requires a square
  // framebuffer; pixels outside the visible circle are cleared in the bitmap.
  bool setLayout(const EyesLayout& layout);
  static uint32_t actionDuration(Action action) { return duration(action); }
  // Non-blocking; returns true only when a new bitmap is available to flush.
  bool update(uint32_t now);

  Action action() const { return action_; }
  bool isWaiting() const { return action_ == Action::Waiting || action_ == Action::WaitingWrap || action_ == Action::WaitingWave; }
  bool isSleeping() const { return action_ == Action::Sleep; }
  const uint8_t* data() const { return buffer_; }
  uint16_t width() const { return config_.width; }
  uint16_t height() const { return config_.height; }
  uint16_t stride() const { return stride_; }
  size_t bufferSize() const { return bytes_; }
  static const char* actionName(Action action);
  static bool parseAction(const char* name, Action& result);
  static const char* version() { return "0.1.0"; }

 private:
  struct Eye {
    float x, y, rx, ry, angle, top, bottom, topSlope, bottomSlope, corner, cornerY;
  };
  struct Pose { Eye left, right; };
  static Pose neutral();
  static Pose webPose(Action action, uint32_t elapsed);
  static Eye mixEye(const Eye& a, const Eye& b, float t);
  static Pose mix(const Pose& a, const Pose& b, float t);
  static uint32_t duration(Action action);
  Pose poseAt(uint32_t now) const;
  void render(const Pose& pose);
  void drawEye(const Eye& eye, float scale, float ox, float oy);
  void setPixel(int x, int y);

  EyesConfig config_;
  EyesLayout layout_;
  uint8_t* buffer_ = nullptr;
  size_t bytes_ = 0;
  uint16_t stride_ = 0;
  Action action_ = Action::Idle;
  uint32_t started_ = 0, lastFrame_ = 0;
  Pose from_ = neutral(), current_ = neutral();
  float lookX_ = 0, lookY_ = 0;
  bool force_ = true, sleepRendered_ = false;
  bool crossfade_ = false;
};

} // namespace agent_robot

