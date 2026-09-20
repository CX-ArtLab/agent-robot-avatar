# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.3.2-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

Un Web Component ligero y expresivo con un avatar de robot para agentes de IA y aplicaciones interactivas.

Adecuado para interfaces de asistentes de IA y agentes, incluidos productos y experiencias similares a ChatGPT, Claude, Codex, Cursor, Grok Bot, Gemini CLI y OpenCode.

También puede utilizarse como mascota de escritorio, mascota virtual, compañero digital, avatar de chatbot o personaje interactivo.

Agent Robot Avatar también puede funcionar como capa de respuesta visual en interfaces de agentes de estilo AG-UI.

Creado con SVG y JavaScript nativo, funciona como un elemento personalizado nativo sin dependencias en tiempo de ejecución.

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar interactive animation demo" width="560">
</p>

## Demo interactiva

[Abrir la demo interactiva](https://cx-artlab.github.io/agent-robot-avatar/)

## Características destacadas

- Web Component nativo
- Renderizado SVG y JavaScript nativo
- Sin dependencias en tiempo de ejecución
- Parpadeo automático y movimientos sutiles en reposo
- Ojos que siguen el puntero y movimientos de cabeza con inercia
- Deformación flexible al arrastrar y recuperación elástica
- Estados y expresiones de Agent controlables mediante código
- Respuestas visuales para espera, éxito, fallo, advertencia, revisión, bloqueo y errores del sistema
- Compatibilidad con movimiento reducido
- Comportamiento de suspensión configurable
- Redondez de la cabeza ajustable
- Parpadeo opcional de la antena para indicar estados
- Declaraciones de tipos TypeScript incluidas

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

Después, añade el componente:

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

No hace falta código de inicialización. El avatar inicia automáticamente su comportamiento de reposo predeterminado.

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

`failure` indica una tarea finalizada sin éxito; `error` indica un fallo de conexión, servicio o sistema.

Ejemplo del ciclo de vida de una solicitud real de Agent:

```js
avatar.startWaiting();

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('error');
}
```

## Opciones habituales

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</agent-robot-avatar>
```

| Atributo | Función |
| --- | --- |
| `size` | Tamaño del avatar en píxeles |
| `color` | Color principal del avatar |
| `auto-sleep` | Tiempo de inactividad antes de la suspensión automática; `0` la desactiva |
| `wake-on` | Política de activación automática: `activity`, `interaction` o `manual` |
| `motion` | Política de movimiento: `auto`, `reduce` o `full` |

Controles habituales en tiempo de ejecución:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setAntennaFlash(true);
```

## Eventos e integración

El componente emite `face-state` cuando cambia el estado visual y `action-state` cuando cambia el ciclo de vida semántico de una acción.

Para integrar la aplicación anfitriona y mostrar textos de estado accesibles, se recomienda `action-state`. Consulta [`examples/accessibility.html`](../examples/accessibility.html) para ver un ejemplo ejecutable del ciclo de vida de una solicitud.

Encontrarás un ejemplo mínimo de integración en [`examples/basic.html`](../examples/basic.html).

## Compatibilidad

Diseñado para navegadores modernos compatibles con ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver` y `matchMedia`.

Las pruebas automatizadas de navegador abarcan Chromium, Firefox y WebKit.

## Contribuciones

Se aceptan issues y pull requests. Consulta [`CONTRIBUTING.md`](../CONTRIBUTING.md) antes de enviar cambios.

## Estado del proyecto

**Versión pública actual: v0.3.2**

La API pública se mantiene deliberadamente compacta mientras el proyecto avanza hacia un compromiso de estabilidad previsto para `1.0.0`.

Agent Robot Avatar se desarrolla de forma independiente y no está afiliado a ninguna plataforma o marca de IA, ni cuenta con su respaldo ni las representa.

## Diseño del personaje e identidad visual

El personaje de Agent Robot Avatar, incluidos su aspecto de robot y su identidad visual, es un diseño original de CX ArtLab.

La licencia MIT se aplica al software y al código fuente. Permite utilizar, modificar y distribuir el avatar como parte de aplicaciones, pero no transfiere la propiedad del nombre Agent Robot Avatar, la identidad del personaje o su identidad visual, ni concede el derecho a presentarlos como un personaje original o una marca independiente de terceros.

Los nombres de productos de terceros mencionados en este proyecto solo ilustran posibles casos de uso y no implican afiliación ni respaldo.

## Licencia

Licencia MIT. Consulta [`LICENSE`](../LICENSE).

---

Si este proyecto te resulta útil, puedes invitarme a un café.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
