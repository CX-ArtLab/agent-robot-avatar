# Agent Robot Avatar

<p align="center">
  <img src="./assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.3.2-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](./LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

A lightweight, expressive robot avatar Web Component for AI agents and interactive applications.

It can be used in AI assistants, agent interfaces, desktop companions, virtual pets, digital mascots, chatbot avatars, and other interactive character experiences.

Built with SVG and vanilla JavaScript, it works as a native custom element with zero runtime dependencies.

<p align="center">
  <img src="./assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar interactive animation demo" width="560">
</p>

## Live Demo

[Open the interactive demo](https://cx-artlab.github.io/agent-robot-avatar/?lang=en)

## Highlights

- Native Web Component
- SVG rendering + vanilla JavaScript
- Zero runtime dependencies
- Automatic blinking and subtle idle behavior
- Pointer-following eyes and inertial head movement
- Jelly-style drag deformation with elastic recovery
- Programmatically controlled Agent states and expressions
- Waiting, success, failure, warning, review, blocked, and system-error feedback
- Reduced-motion support
- Configurable sleep behavior
- Adjustable head roundness
- Optional antenna status flashing
- TypeScript declarations included

## Install

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

Or load the repository source directly:

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

Then add the component:

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

No initialization code is required. The avatar enters its default idle behavior automatically.

## Basic usage

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('warning');
avatar.play('error');

avatar.reset();
```

Available actions:

`idle` · `bored` · `waiting` · `input` · `send` · `success` · `failure` · `warning` · `inspect` · `blocked` · `error` · `surprise` · `sleep` · `wake`

`failure` is intended for a task that completed unsuccessfully, while `error` is intended for connection, service, or system failures.

For a real Agent request lifecycle:

```js
avatar.startWaiting();

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('error');
}
```

## Common options

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</agent-robot-avatar>
```

| Attribute | Purpose |
| --- | --- |
| `size` | Avatar size in pixels |
| `color` | Main avatar color |
| `auto-sleep` | Idle time before automatic sleep; `0` disables it |
| `wake-on` | Automatic wake policy: `activity`, `interaction`, or `manual` |
| `motion` | Motion policy: `auto`, `reduce`, or `full` |

Common runtime controls:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setAntennaFlash(true);
```

## Events and integration

The component emits `face-state` for visual state changes and `action-state` for semantic action lifecycle changes.

For host integrations and accessibility status text, prefer `action-state`. See [`examples/accessibility.html`](./examples/accessibility.html) for a runnable request-lifecycle example.

A minimal integration example is available at [`examples/basic.html`](./examples/basic.html).

## Compatibility

Designed for modern browsers with support for ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver`, and `matchMedia`.

Automated browser tests cover Chromium, Firefox, and WebKit.

## Contributing

Issues and pull requests are welcome. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) before submitting changes.

## Project status

**Current public version: v0.3.2**

The public API is intentionally kept compact while the project evolves toward a future `1.0.0` stability commitment.

Agent Robot Avatar is independently developed and is not affiliated with, endorsed by, or representative of any AI platform or brand.

## Character design and visual identity

The Agent Robot Avatar character, including its robot appearance and visual identity, is an original design by CX ArtLab.

The MIT License applies to the software and source code. It allows the avatar to be used, modified, and distributed as part of applications, but it does not transfer ownership of the Agent Robot Avatar name, character identity, or visual identity, or grant the right to present them as another party's original character or standalone brand.

Third-party product names mentioned in this project describe possible use cases only and do not indicate affiliation or endorsement.

## License

MIT License. See [`LICENSE`](./LICENSE).

---

If this project is useful to you, you can buy me a coffee.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>