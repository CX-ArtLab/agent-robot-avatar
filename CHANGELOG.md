# Changelog

All notable user-facing changes to Agent Robot Avatar are documented here.

The project follows Semantic Versioning for public releases. Internal development build numbers are not part of the public version history.

## [Unreleased]

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

[0.2.1]: https://github.com/CX-ArtLab/agent-robot-avatar/releases/tag/v0.2.1
[0.2.0]: https://github.com/CX-ARTLab/agent-robot-avatar/releases/tag/v0.2.0
[0.1.0]: https://github.com/CX-ARTLab/agent-robot-avatar/releases/tag/v0.1.0
