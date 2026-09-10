# Agent Robot Avatar

<p align="center">
  <img src="./assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md)

![Version](https://img.shields.io/badge/version-v0.3.0-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](./LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square) ![14 Agent States](https://img.shields.io/badge/Agent%20states-14-8B5CF6?style=flat-square) ![Pointer Following](https://img.shields.io/badge/Pointer-following-00A67E?style=flat-square) ![Jelly Drag](https://img.shields.io/badge/Drag-jelly%20physics-FF69B4?style=flat-square)

A lightweight, expressive robot avatar Web Component for AI agents and other interactive applications.

Suitable for AI assistant and agent interfaces, including products and experiences similar to ChatGPT, Claude, Codex, Cursor, Grok Bot, Gemini CLI, and OpenCode.

It can also be used for desktop pets, virtual pets, desktop companions, digital mascots, chatbot avatars, and other interactive character experiences.

Agent Robot Avatar can also be used as a visual feedback layer for AG-UI-style agent interfaces.

Agent Robot Avatar is built with SVG and vanilla JavaScript. It has no third-party animation framework dependency, works as a native custom element, and exposes a compact API for expressions, interaction states, pointer behavior, waiting feedback, and head-shape customization.

**Current public version: v0.3.0**

<p align="center">
  <img src="./assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar interactive animation demo" width="560">
</p>

## Live Demo

Try the interactive demo: [Open Agent Robot Avatar](https://cx-artlab.github.io/agent-robot-avatar/?lang=en)

## Highlights

- Pure SVG + vanilla JavaScript
- Native Web Component
- No third-party animation framework
- Automatic blinking and subtle idle gaze
- Pointer-following eyes and inertial head movement
- Jelly-style local drag deformation with elastic recovery
- Programmatically controlled Agent states and expressions
- Distinct waiting, failure, warning, review, blocked-content, and system-error semantics
- Semantic `action-state` lifecycle events for host integrations
- Reduced-motion support and visibility-aware frame pausing
- Configurable sleep wake policy
- Adjustable head roundness
- Floating antenna with optional status flashing
- Demo UI kept separate from the reusable component

## Quick start

When using the repository source directly, keep `agent-robot-avatar.js` together with the `src/` directory, then load the public entry:

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

Add the custom element:

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

The avatar enters its default idle behavior automatically. No initialization code is required.

A minimal runnable example is available at [`examples/basic.html`](./examples/basic.html). An accessibility-oriented integration example is available at [`examples/accessibility.html`](./examples/accessibility.html).

Bundler-based projects can install and use the component from npm with:

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

The package includes TypeScript declarations for actions, events, and public methods. No TypeScript setup is required beyond normal package installation.

## Basic API

Trigger an expression or state with `play()`:

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('failure');
avatar.play('warning');
avatar.play('inspect');
avatar.play('blocked');
avatar.play('error');
```

Return to the default idle state:

```js
avatar.reset();
```

`reset()` cancels the current program action, pending waits, head animations, drag/rebound state, and delayed drag reactions, then returns to idle. Cancelled animation promises continue to resolve normally rather than rejecting. Removing the element performs the same internal cleanup without emitting cleanup-only `face-state` or `action-state` notifications, and also tears down its per-instance media-query listener and observers without restarting rendering as a cleanup side effect. Reattaching starts from idle, preserves appearance and behavior attributes/settings, and installs connected runtime resources once.

A valid new action replaces the previous active action. The old semantic action receives `cancel`; it cannot resume later and overwrite the replacement. An unknown action throws before destructive cleanup. A no-op action such as `wake` while already awake leaves the current action unchanged.

## Actions and states

| State | API name | Intended use |
| --- | --- | --- |
| Idle | `idle` | Default idle state |
| Bored | `bored` | Long idle periods or no active task |
| Waiting | `waiting` | A request has been sent and a result is still pending |
| Input | `input` | The user is typing |
| Send | `send` | Content was sent / nod feedback |
| Success | `success` | A task completed successfully |
| Failure | `failure` | A task completed unsuccessfully |
| Warning | `warning` | A risky or destructive action needs confirmation |
| Inspect | `inspect` | Reviewing, checking, or verifying a result |
| Blocked | `blocked` | A request is blocked, disallowed, or cannot proceed |
| System error | `error` | Connection, service, or system failure |
| Surprise | `surprise` | An unexpected event or result |
| Sleep | `sleep` | Enter the component sleep state |
| Wake | `wake` | Wake the component from sleep |

The state names intentionally distinguish task results from system conditions. For example, `failure` means the requested task finished unsuccessfully, while `error` is reserved for connection, service, or system failures. `waiting` represents an active pending request; `bored` represents inactivity. `sleep` describes the avatar component state only and does not imply that the real Agent is offline.

Semantic aliases are also available:

```js
avatar.play('failed');           // same as failure
avatar.play('fail');             // same as failure
avatar.play('verify');           // same as inspect
avatar.play('review');           // same as inspect
avatar.play('angry');            // same visual expression as blocked
avatar.play('policy-blocked');   // same as blocked
avatar.play('system-error');     // same as error
avatar.play('connection-error'); // same as error
```

## Continuous waiting

For real Agent workflows, use the dedicated waiting lifecycle when a request is in progress:

```js
avatar.startWaiting();

// Stop when the request ends without replacing it with another action.
avatar.stopWaiting();
```

`startWaiting()` remains active until `stopWaiting()`, `reset()`, or another program action replaces it. A replacement reports `cancel`; `stopWaiting()` reports a normal `end` when waiting is active. For backward compatibility, calling `stopWaiting()` during another active program action still returns the avatar to idle; that action now receives exactly one `cancel`. Calling it with no active action does not manufacture a lifecycle event. Drag deformation remains available while waiting, but decorative drag expressions are suppressed and discarded rather than replayed after waiting ends.

A typical request lifecycle can be written as:

```js
avatar.startWaiting();
try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('error');
}
```

The visual `error` action eventually returns to idle. That visual completion does not mean the underlying request, connection, or business error has been resolved; the host application remains the source of truth.

## Semantic action event

`face-state` remains available for backward compatibility and describes visual face states. It may contain visual terms such as `happy` or `sad`, so it should not be treated as a reliable business-result event.

For semantic integration, listen to `action-state`:

```js
avatar.addEventListener('action-state', (event) => {
  const { action, phase, source } = event.detail;
  console.log(action, phase, source);
});
```

`action-state` uses this contract:

- `action`: normalized action name. Aliases such as `failed`/`fail` become `failure`; `verify`/`review` become `inspect`.
- `phase`: `start`, followed by exactly one `end` or `cancel` for each action that actually starts.
- `source`: `api`, `interaction`, or `automatic`.
- Continuous actions such as `startWaiting()` and active input do not emit `end` just because one animation cycle completes.
- Replacement or `reset()` emits `cancel`; `stopWaiting()` emits `end` for active waiting, or `cancel` for a different active action that it resets to idle.
- No-op calls emit no lifecycle event.
- Decorative drag feedback uses `action: "reaction"` and `source: "interaction"`, so it cannot be confused with an API-level task success/failure.
- The event bubbles and is `composed`, so it can be observed above the custom element/Shadow DOM boundary.
- Disconnect cleanup is silent and does not manufacture host-facing status notifications.

The event describes avatar actions, not real request outcomes. The host must decide what the underlying Agent state actually means.

## Accessibility integration

For accessible status text, map program actions to localized host text rather than announcing every visual change:

```html
<div id="agent-status" role="status" aria-live="polite"></div>
```

```js
const status = document.querySelector('#agent-status');
const messages = {
  waiting: 'Processing…',
  failure: 'Task failed.',
  error: 'Connection problem.',
};

avatar.addEventListener('action-state', ({ detail }) => {
  if (detail.source === 'interaction') return;
  if (detail.phase === 'start' && messages[detail.action]) {
    status.textContent = messages[detail.action];
  }
});
```

Use a normal `role="status"` for routine updates. Do not announce blinking, gaze changes, or decorative drag reactions, and do not automatically make every error an interruptive alert. If the host already announces the same status elsewhere, the avatar can remain decorative to avoid duplicate screen-reader output.

See [`examples/accessibility.html`](./examples/accessibility.html) for a runnable request-lifecycle example covering waiting, success, failure, connection errors, host cancellation, request replacement, and stale-result protection. Its live-region text follows host request state rather than low-level face changes.

## Wake policy

The `wake-on` attribute controls automatic wake behavior:

```html
<agent-robot-avatar wake-on="manual"></agent-robot-avatar>
```

| Value | Behavior |
| --- | --- |
| `activity` | Default. Page pointer/keyboard activity can wake a sleeping avatar, preserving previous behavior. |
| `interaction` | Only direct interaction with this avatar wakes it automatically. Activity elsewhere does not. |
| `manual` | Environment activity, including direct avatar interaction, does not automatically wake it. |

Explicit API intent remains explicit: `avatar.play('wake')` wakes the avatar in every mode, and `avatar.noteActivity()` records activity and wakes by default even when the host calls it from inside a real `keydown`, `pointerdown`, or `click` handler. Pass `false` to `noteActivity(false)` to record activity without waking. Automatic page/direct-interaction wakeups are handled separately and still obey `wake-on`; their `action-state` source is `automatic`, while an explicit host wake remains `api`. Other program actions may leave sleep when their action semantics require a new visible state. `reset()` always returns to idle.

Different avatar instances may use different `wake-on` values.

## Reduced motion

Use the `motion` attribute to control animation intensity:

```html
<agent-robot-avatar motion="auto"></agent-robot-avatar>
```

| Value | Behavior |
| --- | --- |
| `auto` | Default. Follows `prefers-reduced-motion` and responds to preference changes at runtime. |
| `reduce` | Keeps recognizable static states while suppressing continuous or elastic decorative motion. |
| `full` | Uses the normal animation style regardless of the system reduced-motion preference. |

Reduced mode suppresses continuous waiting orbits, idle wandering/blinking motion, head-follow inertia, elastic rebound, antenna spring motion, and status flashing where appropriate. Waiting/input lifecycles remain active until the host ends or replaces them, even when their visual state is static. Automatic sleep uses an independent cancellable timer rather than the draw loop, so it still works while reduced motion has paused continuous rendering; activity and runtime `auto-sleep` changes reschedule it, and active waiting/input are not overwritten. Static state changes are committed before reduced rendering pauses, including the final closed-eye sleep pose. Switching modes does not revive cancelled work or change `action-state` lifecycle semantics.

## Pointer following

Pointer following is enabled by default and can be controlled programmatically:

```js
avatar.setPointerFollow(false);
avatar.setPointerFollow(true);
```

High-frequency pointer positions are coalesced to the latest update per animation frame. Pointer following remains active in normal mode when the avatar is not being dragged or owned by another expression.

## Antenna flashing

Antenna status flashing is disabled by default and can be enabled per avatar:

```js
avatar.setAntennaFlash(true);
avatar.setAntennaFlash(false);
```

## Inspect configuration

Inspect/review timing and geometry can be customized before loading the component:

```html
<script>
  window.AgentRobotAvatarInspectConfig = {
    aperture: 24,
    scanOffset: 12,
  };
</script>
<script type="module" src="./agent-robot-avatar.js"></script>
```

The existing configuration object is preserved. Values are converted with `Number(...)`, must be finite, and are clamped to supported ranges; missing or invalid values receive defaults. `aperture` is clamped to `6–40`, `scanOffset` to `0–24`, and timing values to their supported `0/40–2400 ms` ranges. The same `window.AgentRobotAvatarInspectConfig` object can still be modified after loading; values are normalized again when an inspect action begins. Invalid input cannot enter the animation calculations as `NaN`.

Default configuration keeps the existing v0.2.1 visual timing.

## Head roundness

The head shape can be adjusted from a squarer form to a rounder form without changing the eye clipping or drag-deformation system:

```js
avatar.setHeadRoundness(0);   // squarer
avatar.setHeadRoundness(50);  // default
avatar.setHeadRoundness(100); // rounder

console.log(avatar.getHeadRoundness());
```

Values are clamped to the `0–100` range. The interactive Demo uses three presets by default and can unlock continuous adjustment.

The component emits `head-roundness-change` when the value changes:

```js
avatar.addEventListener('head-roundness-change', (event) => {
  console.log(event.detail.value);
});
```

## Visual state event

The component continues to emit `face-state` whenever its visual state changes:

```js
avatar.addEventListener('face-state', (event) => {
  console.log(event.detail.state);
});
```

Use this event for visual synchronization or legacy integrations. Prefer `action-state` for business/Agent lifecycle logic and accessibility status text.

## Attributes

```html
<agent-robot-avatar
  size="160px"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</agent-robot-avatar>
```

| Attribute | Description |
| --- | --- |
| `size` | Positive pixel size. Accepts plain numbers such as `140` and explicit pixels such as `140px`. Unsupported units, malformed strings, zero, negative, and non-finite values fall back to `112px`. |
| `color` | Main avatar color. |
| `auto-sleep` | Idle time before automatic sleep, in milliseconds; `0` disables automatic sleep. |
| `wake-on` | Automatic wake policy: `activity` (default), `interaction`, or `manual`. |
| `motion` | Motion policy: `auto` (default), `reduce`, or `full`. |

All attributes are optional. Dynamic size changes are supported; drag coordinates and pointer following use the element's current layout size.

## Default behavior

Without explicit API calls, the avatar already provides subtle ambient behavior:

- Random blinking
- Subtle gaze wandering
- Pointer following when the cursor is nearby
- Light inertial head movement
- Natural return to idle
- Optional automatic sleep

`motion="reduce"` or an active system reduced-motion preference simplifies these decorative behaviors.

## Drag interaction

The avatar supports direct mouse, pen, and touch pointer dragging. The head deforms locally around the interaction point instead of moving as a rigid object.

- Strong outward pull while idle: triggers an `angry` visual reaction after recovery
- Strong inward push toward the center while idle: triggers a `success` visual reaction after recovery
- Small drag: deformation only, with no expression trigger
- Active program actions such as waiting/input keep expression ownership; drag deformation remains available but its decorative reaction is discarded
- `pointercancel`, lost capture, reset, replacement actions, and disconnect restore drag geometry without delayed reaction

The avatar interaction region uses `touch-action: pinch-zoom`: single-pointer movement remains available to the custom drag gesture, while two-pointer pinch zoom remains allowed. Page scrolling initiated outside the avatar keeps the page's normal touch behavior. Desktop mouse interaction is unchanged.

## Rendering and visibility

The component pauses sustained frame rendering when it has no visible layout area or is outside the viewport. Parent-container hiding is covered through layout/intersection observation. When it becomes visible again, the avatar resumes the current valid state rather than replaying stale actions.

Finite action timers continue to settle while visual drawing is paused, so action promises do not depend on continuous rendering. The existing hidden-page and settled-sleep pause behavior remains in place. Observers and per-instance media-query listeners are cleaned up when an avatar is disconnected.

## Interactive Demo

`demo/index.html` contains the full interactive Demo, including:

- All public expression states
- Pointer following
- Jelly drag deformation
- Waiting lifecycle
- Head-roundness presets and continuous adjustment
- Color and behavior controls
- Simulated Agent conversation states

The interactive Demo and Demo-only JavaScript are isolated in `demo/` and are not included in the reusable package runtime.

## Project structure

```text
agent-robot-avatar.js     Public component entry
src/                      Reusable component runtime and expression modules
demo/                     Interactive Demo and Demo-only helpers
examples/                 Minimal integration examples
assets/support/           Support / payment QR assets
docs/                     Localized documentation
README.md                 English main documentation
CHANGELOG.md              Public release history
CONTRIBUTING.md           Contribution guide
package.json              Package metadata
LICENSE                   MIT License
```

## Distribution

The package is published on npm as `agent-robot-avatar`. It includes the public entry, TypeScript declarations, runtime modules, documentation, and support assets.

The npm package intentionally includes only the public entry, TypeScript declarations, `src/` runtime, documentation, and support assets; Demo-only files and test files are excluded.

## Compatibility

Agent Robot Avatar is designed for modern browsers with support for ES modules, Custom Elements, SVG, Pointer Events, the Web Animations API, `IntersectionObserver`, `ResizeObserver`, and `matchMedia`.

The automated browser suite covers Chromium, Firefox, and WebKit. Trusted touch-drag cancellation is additionally exercised through Chromium's touch emulation; see the PR/release validation notes for any real-device coverage.

## Contributing

Issues and pull requests are welcome. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) before submitting changes.

## Project status

v0.3.0 is the current public release. v0.1.0 remains available as the first public version. The public API is intentionally small so it can evolve carefully before a future `1.0.0` stability commitment.

Agent Robot Avatar is independently developed and is not affiliated with, endorsed by, or representative of any AI platform or brand.

## Character design and visual identity

The Agent Robot Avatar character, including its robot appearance and visual identity, is an original design by CX ArtLab.

The MIT License applies to the software and source code. It permits use, modification, and distribution of the software, including use of the avatar within applications, but it does not transfer ownership of the Agent Robot Avatar name, character identity, or visual identity, and does not grant the right to present them as another party's original character, trademark, or standalone brand.

References to third-party AI products describe possible use cases or product inspiration only and do not indicate affiliation, endorsement, or ownership of the character design.

## License

MIT License. See [`LICENSE`](./LICENSE).

## Buy me a coffee

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
