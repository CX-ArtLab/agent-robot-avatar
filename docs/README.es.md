# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.3.2-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

Un Web Component de avatar robótico ligero y expresivo para agentes de IA y aplicaciones interactivas.

Puede usarse en asistentes de IA, interfaces de agentes, compañeros de escritorio, mascotas virtuales, mascotas digitales, avatares de chatbots y otras experiencias con personajes interactivos.

Está construido con SVG y JavaScript nativo, funciona como un Custom Element y no tiene dependencias en tiempo de ejecución.

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Demostración animada interactiva de Agent Robot Avatar" width="560">
</p>

## Demo en vivo

[Abrir la demo interactiva](https://cx-artlab.github.io/agent-robot-avatar/?lang=es)

## Características

- Web Component nativo
- Renderizado SVG + JavaScript nativo
- Cero dependencias en tiempo de ejecución
- Parpadeo automático y comportamiento idle sutil
- Ojos que siguen el puntero y movimiento inercial de la cabeza
- Deformación local tipo gelatina al arrastrar, con recuperación elástica
- Estados y expresiones del Agent controlables por código
- Feedback para waiting, success, failure, warning, review, blocked y system error
- Compatibilidad con movimiento reducido
- Comportamiento de sueño configurable
- Redondez de la cabeza ajustable
- Parpadeo opcional de estado en la antena
- Declaraciones TypeScript incluidas

## Instalación

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

También puedes cargar directamente el código fuente del repositorio:

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

Después añade el componente:

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

No hace falta código de inicialización. El avatar entra automáticamente en su estado idle predeterminado.

## Uso básico

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('warning');
avatar.play('error');

avatar.reset();
```

Acciones disponibles:

`idle` · `bored` · `waiting` · `input` · `send` · `success` · `failure` · `warning` · `inspect` · `blocked` · `error` · `surprise` · `sleep` · `wake`

`failure` indica una tarea que terminó sin éxito; `error` se reserva para fallos de conexión, servicio o sistema.

Un flujo típico para una solicitud de Agent:

```js
avatar.startWaiting();

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('error');
}
```

## Opciones comunes

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</agent-robot-avatar>
```

| Atributo | Uso |
| --- | --- |
| `size` | Tamaño del avatar en píxeles |
| `color` | Color principal del avatar |
| `auto-sleep` | Tiempo de inactividad antes del sueño automático; `0` lo desactiva |
| `wake-on` | Política de activación automática: `activity`, `interaction` o `manual` |
| `motion` | Política de movimiento: `auto`, `reduce` o `full` |

Controles habituales en tiempo de ejecución:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setAntennaFlash(true);
```

## Eventos e integración

El componente emite `face-state` para cambios de estado visual y `action-state` para cambios semánticos del ciclo de vida de las acciones.

Para integraciones con la aplicación anfitriona y texto de estado accesible, usa preferentemente `action-state`. Consulta [`examples/accessibility.html`](../examples/accessibility.html) para ver un ejemplo ejecutable del ciclo de vida de una solicitud.

Hay un ejemplo mínimo de integración en [`examples/basic.html`](../examples/basic.html).

## Compatibilidad

Diseñado para navegadores modernos con soporte para ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver` y `matchMedia`.

Las pruebas automatizadas cubren Chromium, Firefox y WebKit.

## Contribuir

Se aceptan Issues y Pull Requests. Consulta [`CONTRIBUTING.md`](../CONTRIBUTING.md) antes de enviar cambios.

## Estado del proyecto

**Versión pública actual: v0.3.2**

La API pública se mantiene deliberadamente compacta mientras el proyecto evoluciona hacia un futuro compromiso de estabilidad `1.0.0`.

Agent Robot Avatar se desarrolla de forma independiente y no está afiliado, respaldado ni representa a ninguna plataforma o marca de IA.

## Diseño del personaje e identidad visual

El personaje Agent Robot Avatar, incluido su aspecto robótico y su identidad visual, es un diseño original de CX ArtLab.

La licencia MIT se aplica al software y al código fuente. Permite usar, modificar y distribuir el avatar como parte de aplicaciones, pero no transfiere la propiedad del nombre Agent Robot Avatar, la identidad del personaje o su identidad visual, ni concede el derecho a presentarlos como personaje original o marca independiente de otra parte.

Los nombres de productos de terceros mencionados en este proyecto se usan únicamente para describir posibles casos de uso y no implican afiliación ni respaldo.

## Licencia

MIT License. Consulta [`LICENSE`](../LICENSE).

---

Si este proyecto te resulta útil, puedes invitarme a un café.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>