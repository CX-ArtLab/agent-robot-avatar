# Changelog

All notable user-facing changes to Agent Robot Avatar are documented here.

The project follows Semantic Versioning for public releases. Internal development build numbers are not part of the public version history.

## [Unreleased]

### Added

- Added Traditional Chinese, Japanese, Korean, Spanish, Portuguese, German, and French documentation.

### Changed

- Added a lightweight animated GIF preview for the README documentation.
- Moved localized README files into the `docs/` directory and added a unified language selector.
- Moved the interactive Demo and Windows launcher into the `demo/` directory.

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

[0.1.0]: https://github.com/CX-ARTLab/agent-robot-avatar/releases/tag/v0.1.0
