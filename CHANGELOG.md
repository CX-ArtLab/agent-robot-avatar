# Changelog

All notable user-facing changes to Agent Robot Avatar are documented here.

The project follows Semantic Versioning for public releases. Internal development build numbers are not part of the public version history.

## [Unreleased]

### Added

- Added the `love` action. The two eyes lean together into a single heart with a rounded base, beat three times, then return to normal. It is built from the existing eye ovals, so it keeps the avatar's visual language, and it shows a static heart under reduced motion.
- Added the `love` action to the TypeScript declarations (`AgentRobotAvatarAction`, `AgentRobotAvatarCanonicalAction`, and the `face-state` state `love`).
- Added `window.AgentRobotAvatarLoveConfig` (with `AgentRobotAvatarLoveDefaults` and `AgentRobotAvatarLoveBounds`) to adjust the heart's shape, heartbeat, timing, and head lift; invalid values fall back and out-of-range values are clamped.
- Added the `random` action, with `slot` as an alias. Each eye rolls over a drum like the reels of a slot machine, then the left eye slows, overshoots, bounces and settles, followed by the right eye. It uses the same rotational projection as the wrap waiting eyes (position follows the sine, height follows the cosine, so the eye flattens away at the drum edge instead of being clipped), keeps exactly one eye per side so eyes never overlap, and hands back to the ordinary eye with no visible jump. Under reduced motion it holds a static part-way eye.
- Added `random` to the TypeScript declarations (`AgentRobotAvatarAction`, `AgentRobotAvatarCanonicalAction`, and the `face-state` state `random`).
- Added `window.AgentRobotAvatarRandomConfig` (with `AgentRobotAvatarRandomDefaults` and `AgentRobotAvatarRandomBounds`) to adjust the drum radius, hidden gap, edge-on width correction, spin speed, stop timing, and bounce; invalid values fall back and out-of-range values are clamped.
- Added `demo/love-tuner.html` and `demo/random-tuner.html`, standalone pages for tuning and previewing the new expressions at several sizes. They are development tools and are not published to GitHub Pages or the npm package.
- The demo now lists the newest actions (`love`, `random`) last in the action row, each flagged with a “NEW” corner badge, with labels in all nine demo languages.

### Fixed

- The demo's action buttons now wrap automatically, on as many rows as the width needs, instead of being forced into two fixed rows that overflowed and cut buttons off on narrow screens.

## [0.4.3] - 2026-09-22

### Fixed

- Restored the existing head-drag, waiting, sleep-wake, and touch-cancel behavior alongside press-and-hold squeezing by deferring squeeze activation until the hold is confirmed.
- Refined the wrap waiting animation with shared rotational projection, optical height compensation, and edge contact so the eyes turn around the head without overlapping, clipping, or using transparency.

## [0.4.2] - 2026-09-21

### Added

- Added a second waiting choice, `startWaiting({ variant: 'wrap' })`, with the approved 2.4-second left-out/right-in eye turn and custom easing. `play('waiting-wrap')` plays one cycle; the original waiting remains available and is the default.
- Added center press-and-hold squeezing, sustained compression tremor, and spring/jelly release. Moving more than 4 CSS pixels transfers the gesture to the existing head drag.
- Added antenna dragging with the head drag's 25-unit pull cap, a localized head deformation, a firmer spring return, and the existing angry reaction after recovery.
- Added `setPressSqueeze()` and `setAntennaDrag()` opt-outs, interaction state events, and reduced-motion behavior.
- Added localized “Try” tags below the Demo status for double-clicking, head dragging, center press-and-hold squeezing, and antenna dragging.

### Changed

- Renamed and repositioned the Demo action as “Waiting · Wrap” directly after the original waiting action.

### Fixed

- Kept both eyes looking at the live pointer position throughout antenna dragging instead of returning them to center when the drag begins.

## [0.3.2] - 2026-09-10

### Fixed

- Unified synchronous `size` attribute parsing so numeric and `px` values use the same validation immediately, without a transient fallback before runtime observers run.
- Added the existing public `sleep()`, `wake()`, and `input()` convenience methods to the TypeScript declaration surface and type checks.
- Stabilized request-replacement race tests by ordering competing clicks in the same browser task instead of depending on an 80 ms wall-clock window.
- Expanded package integrity coverage to require the runtime and geometry modules explicitly.

- Prevented the accessible request lifecycle example's delayed replacement step from starting after cancellation, a newer user request, or a newer replacement flow has invalidated it.
- Made the example's business status the only automatic live region; the visible request debug log remains available for deliberate reading without `role="log"` live semantics or whole-log text rewrites.

## [0.3.1] - 2026-09-10

### Fixed

- Prevented disconnect cleanup from recreating per-instance media-query listeners and observers; reattaching now initializes connected runtime resources once without emitting cleanup-only lifecycle events.
- Decoupled automatic sleep timing from frame rendering so `motion="reduce"` can pause continuous drawing without disabling `auto-sleep`, while active waiting/input continue to take priority.
- Ensured reduced-motion state changes commit their final static SVG before rendering pauses, including the fully closed sleep pose.
- Made `stopWaiting()` terminate the action it actually resets: waiting ends normally, other active program actions are cancelled once, and idle calls emit no false terminal event.
- Separated explicit `noteActivity()` calls from ambient DOM activity so host calls inside real event handlers keep API semantics while automatic wakeups continue to obey `wake-on`.
- Restricted action alias lookup to declared keys so prototype-like names such as `constructor` and `__proto__` fail before changing waiting/action state.

## [0.3.0] - 2026-09-10

### Added

- Added `wake-on="activity|interaction|manual"` to control automatic wake behavior while preserving `activity` as the default.
- Added `motion="auto|reduce|full"`; `auto` follows `prefers-reduced-motion` and updates when the system preference changes.
- Added the semantic `action-state` event with `{ action, phase, source }` lifecycle data for host integrations and accessible status messaging.
- Added explicit `px` support for `size`, alongside existing numeric pixel values.
- Added Chromium, Firefox, and WebKit browser validation, including trusted Chromium touch-cancellation coverage.

### Changed

- Unified program-action and drag cancellation so reset, replacement actions, disconnect, and pointer cancellation cannot leave delayed drag reactions behind.
- Program-controlled actions such as waiting and input now keep ownership of their expression while drag deformation remains available; suppressed drag reactions are discarded rather than replayed.
- Invalid/no-op actions are validated before destructive extension cleanup, so an invalid `wake` or unknown action cannot tear down a running action.
- Touch interaction uses `touch-action: pinch-zoom` on the avatar interaction region so single-pointer dragging remains available while page scrolling outside the avatar is unaffected and two-finger zoom remains possible.
- Reduced-motion mode removes continuous decorative motion while preserving distinct static states and semantic action lifecycles.
- Avatars pause sustained frame rendering when hidden, without layout, or outside the viewport, then resume the current state when visible again.
- High-frequency pointer updates are coalesced to the latest update per animation frame.
- Shared the head-flattening geometry used by the antenna and roundness modules.

### Fixed

- Preserved valid `window.AgentRobotAvatarInspectConfig` values supplied before module loading and normalized missing, invalid, and out-of-range values deterministically.
- Distinguished `pointercancel` from a normal release so cancelled touch gestures recover without success/angry feedback.
- Tightened `size` parsing so unsupported units, malformed values, zero, negative, and non-finite input use the default size instead of being partially parsed as pixels.

## [0.2.1] - 2026-09-05

### Fixed

- Fixed dynamic custom-element creation failing because the constructor added a host style attribute; preserved default and explicit sizing.
- Prevented interrupted expression continuations and animation callbacks from overriding resets or newer actions.
- Fixed automatic sleep repeatedly restarting its own preparation instead of reaching sleep.
- Synchronized dynamic head colors with the eye masks and antenna, including while sleep rendering is paused.
- Cancelled pending timers, animations, waiting, and drag feedback on disconnect; reattached avatars start idle with their settings preserved.

## [0.2.0] - 2026-09-04

First stable release of the backward-compatible 0.2 series.

### Added

- Added Traditional Chinese, Japanese, Korean, Spanish, Portuguese, German, and French documentation.
- Added package, installation, server-import, and real-browser smoke tests.
- Added `setAntennaFlash(enabled)` for per-avatar antenna flashing.
- Added built-in TypeScript declarations for actions, events, and public methods.

### Changed

- Added a lightweight animated GIF preview for the README documentation.
- Moved localized README files into the `docs/` directory and added a unified language selector.
- Moved the interactive Demo and Windows launcher into the `demo/` directory.
- Removed runtime Demo badge logic and cache-busting query strings from internal module imports.
- Made the package safe to import in server-side JavaScript without browser globals.
- Corrected package side-effect metadata so bundlers preserve custom-element registration.
- Added typed package exports and automated declaration checks for npm consumers.
- Added an npm release rehearsal command and forced publishing to the official npm registry.
- Replaced four layers of runtime method wrapping with a shared extension registry.
- Routed built-in actions and antenna drawing through the same registry, leaving one lifecycle entry point.
- Shared global input listeners across avatar instances and paused frame rendering after sleep animations settle.

## [0.1.0] - 2026-09-02

First public release.

### Added

- Reusable `<agent-robot-avatar>` Web Component built with SVG and vanilla JavaScript
- Public `play(name)` and `reset()` APIs
- Idle gaze, automatic blinking, pointer following, and inertial head movement
- Jelly-style local drag deformation with elastic recovery
- `idle`, `bored`, `waiting`, `input`, `send`, `success`, `failure`, `warning`, `inspect`, `angry`, `error`, `surprise`, `sleep`, and `wake` states
- Dedicated `startWaiting()` and `stopWaiting()` lifecycle for pending Agent requests
- Distinct semantics for task failure, system error, blocked content, warning confirmation, and result inspection
- Semantic aliases for failure, review / verification, blocked-content, and system / connection-error states
- `face-state` event for host application synchronization
- `setPointerFollow(enabled)` API
- Adjustable head shape with `setHeadRoundness(value)` and `getHeadRoundness()`
- `head-roundness-change` event
- Optional `size`, `color`, and `auto-sleep` attributes
- Floating antenna with optional status flashing, disabled by default
- Full interactive Demo and a minimal integration example
- English and Simplified Chinese documentation
- npm-compatible package metadata for later package publication
- Contribution guide, issue templates, pull request template, MIT License, and Ko-fi funding metadata

[0.4.3]: https://github.com/CX-ArtLab/agent-robot-avatar/releases/tag/v0.4.3
[0.4.2]: https://github.com/CX-ArtLab/agent-robot-avatar/releases/tag/v0.4.2
[0.3.2]: https://github.com/CX-ArtLab/agent-robot-avatar/releases/tag/v0.3.2
[0.3.1]: https://github.com/CX-ArtLab/agent-robot-avatar/releases/tag/v0.3.1
[0.3.0]: https://github.com/CX-ArtLab/agent-robot-avatar/releases/tag/v0.3.0
[0.2.1]: https://github.com/CX-ArtLab/agent-robot-avatar/releases/tag/v0.2.1
[0.2.0]: https://github.com/CX-ARTLab/agent-robot-avatar/releases/tag/v0.2.0
[0.1.0]: https://github.com/CX-ARTLab/agent-robot-avatar/releases/tag/v0.1.0
