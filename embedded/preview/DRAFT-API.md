# Draft layout and proximity API

Development draft saved on the `dev/expressions` branch. No release, deployment or physical-board verification has been performed. The implementation lives in `embedded/`; the offline entry point is `embedded/preview/agent-robot-eyes-preview.html`. SVG component and color UI changes are maintained separately outside this directory.

## Layout

```cpp
#include <AgentRobotEyes.h>
agent_robot::EyesLayout layout;
layout.x = 0;
layout.y = 40;
layout.width = 240;
layout.height = 160;
layout.fit = agent_robot::FitMode::Contain; // or Cover
layout.zoom = 1; // valid 0.25..3
layout.offsetX = layout.offsetY = 0; // valid -1..1
eyes.setLayout(layout); // returns false on invalid configuration
```

The viewport must fit inside the framebuffer. Zero viewport dimensions use its remaining width/height. `setLayout()` preserves the action timeline and requests a redraw. The default layout matches the previous engine's aspect-preserving fit. `ScreenShape::Circle` requires a square framebuffer, clips pixels to its circular visible area and uses an inscribed design rectangle in Contain mode. Cover may crop expressions intentionally. Framebuffer dimensions remain in `EyesConfig` and are applied by `begin()`; a resolution change restarts the instance and requires adequate caller-owned memory.

## Configurable target gaze

```cpp
#include <AgentRobotGaze.h>
agent_robot::GazeTracker gaze;
agent_robot::GazeConfig config;
config.enterThreshold = 0.5f;
config.exitThreshold = 0.4f; // lower threshold avoids boundary flicker
config.holdMs = 600;
config.responseMs = 140;
config.movingOnly = false;
gaze.begin(config, nowMs);

// The host selects a target and supplies fresh observations.
agent_robot::GazeTarget target;
target.detected = true;
target.x = 0.7f; target.y = -0.2f; // right and slightly above
target.proximity = 0.8f; // normalized by the host's calibrated sensor range
target.moving = true; // supplied by motion detector, not inferred by this helper
gaze.observe(target, nowMs);

// In the animation loop, using the same monotonic uint32 millisecond clock:
gaze.update(nowMs);
eyes.lookAt(gaze.x(), gaze.y());
if (eyes.update(nowMs)) { /* flush eyes.data() through your display adapter */ }
```

`setConfig(config)` changes validated thresholds/timing/motion policy without resetting the current gaze. `begin()` also resets gaze. A selected target in range refreshes the lock; missing, out-of-range or stationary targets (in moving-only mode) do not. After `holdMs` without an eligible observation, gaze smoothly returns to center. The helper handles uint32 timer rollover and clamps target directions. NaN/invalid samples are rejected. `holdMs` accepts 0..5000 and `responseMs` 0..2000. A zero response time applies gaze immediately. A zero hold expires on the next later clock tick without an eligible sample.

The preview host applies gaze at the chosen frame interval and applies target motion only while idle, preserving each expression’s original eye motion. For firmware, choose an update rate compatible with the screen. `Eyes::lookAt()` explicitly requests a frame; calling it at high rates can exceed ordinary idle frame pacing.

The helper has no camera or sensor dependency and does not detect or select objects. Hardware integration still needs to supply position, presence, calibrated proximity and motion status. A host can map distance into proximity, e.g. `clamp((farDistance - measuredDistance)/(farDistance - nearDistance),0,1)` for `farDistance > nearDistance`; direction must come from a sensor that supplies it. The Demo sensing radius and motion threshold use CSS pixels only; they are not centimetres or hardware detection accuracy.

No automatic wake is imposed: active expressions retain their original eye motion. Target priority and switching between multiple objects remain the host detector's responsibility.

## Added waiting variant

`eyes.play("waiting-wave", nowMs)` selects the restored experimental double-eye wave. It persists until replaced, is included in `isWaiting()` and can be stopped with `stopWaiting()`. Its ID is appended at 17; existing action IDs 0–16 remain unchanged. The hardware variant keeps its continuous 1400 ms motion. The SVG variant is independently tuned to three 1100 ms cycles.
