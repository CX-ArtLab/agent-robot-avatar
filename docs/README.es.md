# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.6.0-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

Un Web Component de avatar robótico ligero y expresivo para agentes de IA y aplicaciones interactivas.

Puede usarse en asistentes de IA, interfaces de agentes, compañeros de escritorio, mascotas virtuales, mascotas digitales, avatares de chatbots y otras experiencias con personajes interactivos.

Es adecuado para interfaces de asistentes de IA y agentes, incluidos productos y experiencias similares a ChatGPT, Claude, Codex, Cursor, Grok Bot, Gemini CLI y OpenCode.

Está construido con SVG y JavaScript nativo, funciona como un Custom Element y no tiene dependencias en tiempo de ejecución.

Agent Robot Avatar también puede utilizarse como capa de retroalimentación visual para interfaces de agentes de estilo AG-UI.

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
- Compresión al mantener pulsado y antena elástica arrastrable
- Estados y expresiones del Agent controlables por código
- Expresiones para waiting, success, failure, affirm, wary, inspect, angry, refuse, love y más
- Compatibilidad con movimiento reducido
- Comportamiento de sueño configurable
- Redondez de la cabeza ajustable
- Declaraciones TypeScript incluidas

## Ojos embebidos (experimental)

Un motor independiente en C++11, sin asignación dinámica de memoria, dibuja solo los ojos con las mismas 18 expresiones en pantallas de robots y placas de desarrollo. Aún está en desarrollo y todavía no se ha publicado. Los ejemplos de firmware cubren 26 combinaciones de placa y pantalla con ESP32, ESP32-S3 y RP2040. Todos se compilan en CI, pero aún no se han probado en hardware real; si pruebas alguno, envía un informe de hardware.

Consulta la [guía embebida](https://github.com/CX-ArtLab/agent-robot-avatar/tree/main/embedded). La biblioteca embebida es independiente del Web Component y no cambia cómo se instala ni cómo se usa.

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
avatar.play('wary');
avatar.play('refuse');

avatar.reset();
```

Acciones disponibles:

`idle` · `bored` · `waiting-spin` · `waiting-wrap` · `waiting-wave` · `input` · `affirm` · `success` · `failure` · `wary` · `inspect` · `angry` · `refuse` · `surprise` · `love` · `random` · `sleep` · `wake`

`waiting-wave` reproduce tres ondas de 1,1 segundos: los ojos suben y bajan con un ritmo escalonado (amplitud de 10 unidades SVG) y luego se detienen. Usa `startWaiting({ variant: 'wave' })` para una espera continua sin cortes y `stopWaiting()` para detenerla. Respeta el ajuste de movimiento reducido e informa su ciclo de vida como `waiting`.

Los nombres de acción describen lo que hace el avatar. `refuse` niega con la cabeza, para una petición que el Agent no puede o no va a realizar; `failure` es para una tarea o conexión que no salió bien; `wary` gira la cabeza y mira de arriba abajo con recelo, para una acción que requiere confirmación. Los nombres de 0.5 (`send`, `warning`, `error`, `blocked` y otros) siguen funcionando con un aviso en la consola hasta 1.0; consulta la [tabla de actualización](../CHANGELOG.md#upgrading-from-05x).

`love` expresa cariño o agradecimiento: los dos ojos se inclinan hasta formar un único corazón, laten tres veces y luego vuelven a la normalidad.

`random` reproduce un giro de tragaperras: cada ojo rueda sobre un tambor; después el ojo izquierdo frena, rebota y se detiene, seguido del derecho.

Un flujo típico para una solicitud de Agent:

```js
avatar.startWaiting();

// Segunda espera: los ojos salen por un lado y vuelven por el otro.
avatar.startWaiting({ variant: 'wrap' });

// Tercera variante de espera: ondas verticales escalonadas de los ojos.
avatar.startWaiting({ variant: 'wave' });

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('failure');
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
| `press-squeeze` | Mantener pulsado el centro para comprimir; `false` lo desactiva |
| `antenna-drag` | Arrastre y rebote de antena con reacción de enfado; `false` lo desactiva |

Controles habituales en tiempo de ejecución:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setPressSqueeze(true);
avatar.setAntennaDrag(true);
```

Mantener pulsado el centro inicia la compresión. Al mover más de 4 píxeles CSS, el mismo gesto pasa al arrastre de cabeza existente. La antena usa el mismo límite de distancia y termina con la reacción de enfado existente.

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

**Versión pública actual: v0.6.0**

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
