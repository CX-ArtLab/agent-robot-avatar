# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md)

![Versión de desarrollo](https://img.shields.io/badge/version-v0.2.0-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square) ![14 Agent States](https://img.shields.io/badge/Agent%20states-14-8B5CF6?style=flat-square) ![Pointer Following](https://img.shields.io/badge/Pointer-following-00A67E?style=flat-square) ![Jelly Drag](https://img.shields.io/badge/Drag-jelly%20physics-FF69B4?style=flat-square)

Un Web Component ligero y expresivo de avatar robótico para agentes de IA y otras aplicaciones interactivas.

Agent Robot Avatar está construido con SVG y JavaScript nativo, sin depender de frameworks de animación de terceros. Funciona como un Custom Element nativo y ofrece una API compacta para expresiones, estados de interacción, seguimiento del puntero, espera y forma de la cabeza.

**Versión pública actual: v0.2.0**

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Demostración animada interactiva de Agent Robot Avatar" width="560">
</p>

## Características principales

- SVG + JavaScript nativo
- Web Component nativo
- Sin dependencias de frameworks de animación
- Parpadeo automático y mirada sutil
- Seguimiento del puntero y movimiento de cabeza con inercia
- Deformación local tipo gelatina al arrastrar y recuperación elástica
- Estados y expresiones de Agent controlables por código
- Semántica separada para espera, fallo, advertencia, revisión, bloqueo y error del sistema
- Redondez de la cabeza ajustable
- Antena flotante con parpadeo de estado opcional
- Demo separado del componente reutilizable

## Inicio rápido

Si usas directamente el código del repositorio, conserva `agent-robot-avatar.js` junto con `src/` y carga la entrada pública:

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

El avatar entra automáticamente en el estado idle. Hay un ejemplo mínimo en [`examples/basic.html`](../examples/basic.html).

## API básica

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('failure');
avatar.play('warning');
avatar.play('inspect');
avatar.play('angry');
avatar.play('error');

avatar.reset();
```

## Estados y expresiones

| Estado | API | Uso previsto |
| --- | --- | --- |
| Idle | `idle` | Estado normal de reposo |
| Bored | `bored` | Periodos largos sin tarea activa |
| Waiting | `waiting` | Solicitud enviada, esperando resultado |
| Input | `input` | El usuario está escribiendo |
| Send | `send` | Envío / gesto de asentir |
| Success | `success` | Tarea completada correctamente |
| Failure | `failure` | La tarea terminó sin éxito |
| Warning | `warning` | Acción arriesgada o destructiva que requiere confirmación |
| Inspect | `inspect` | Revisar, comprobar o verificar un resultado |
| Blocked | `angry` | Solicitud bloqueada o que no puede continuar |
| System error | `error` | Error de conexión, servicio o sistema |
| Surprise | `surprise` | Resultado o evento inesperado |
| Sleep | `sleep` | Entrar en reposo |
| Wake | `wake` | Despertar |

`failure` representa un fallo de la tarea; `error` se reserva para problemas de conexión, servicio o sistema. `waiting` indica una solicitud pendiente y `bored` indica inactividad.

También hay alias semánticos:

```js
avatar.play('failed');
avatar.play('fail');
avatar.play('verify');
avatar.play('review');
avatar.play('blocked');
avatar.play('policy-blocked');
avatar.play('system-error');
avatar.play('connection-error');
```

## Espera continua

```js
avatar.startWaiting();
// Detener cuando llegue la respuesta o el resultado.
avatar.stopWaiting();
```

Cualquier otra acción también interrumpe el estado waiting activo.

## Seguimiento del puntero

```js
avatar.setPointerFollow(false);
avatar.setPointerFollow(true);
```

## Redondez de la cabeza

```js
avatar.setHeadRoundness(0);   // más cuadrada
avatar.setHeadRoundness(50);  // predeterminado
avatar.setHeadRoundness(100); // más redonda

console.log(avatar.getHeadRoundness());
```

Los valores se limitan a `0–100`. Al cambiar se emite `head-roundness-change`.

```js
avatar.addEventListener('head-roundness-change', (event) => {
  console.log(event.detail.value);
});
```

## Evento de estado

Cada cambio visual emite `face-state`:

```js
avatar.addEventListener('face-state', (event) => {
  console.log(event.detail.state);
});
```

## Atributos

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000">
</agent-robot-avatar>
```

| Atributo | Descripción |
| --- | --- |
| `size` | Tamaño del componente en píxeles |
| `color` | Color principal del avatar |
| `auto-sleep` | Tiempo de inactividad antes de dormir, en ms; `0` lo desactiva |

## Comportamiento predeterminado

Sin llamadas explícitas a la API, el avatar ya ofrece parpadeo aleatorio, movimiento sutil de la mirada, seguimiento del puntero cercano, movimiento inercial de la cabeza, retorno natural a idle y suspensión automática opcional.

## Interacción de arrastre

Al arrastrar, la cabeza se deforma localmente alrededor del punto de interacción en lugar de moverse como un objeto rígido.

- Tirón fuerte hacia fuera: activa `angry` después de recuperarse
- Empuje fuerte hacia el centro: activa `success` después de recuperarse
- Arrastre pequeño: solo deformación

## Demo interactiva

`demo/index.html` incluye todos los estados públicos, seguimiento del puntero, arrastre tipo gelatina, ciclo de waiting, ajuste de redondez, controles de color y comportamiento y una simulación de conversación con Agent. El JavaScript exclusivo de la Demo está aislado en `demo/` y no forma parte del runtime reutilizable de npm.

## Estructura del proyecto

```text
agent-robot-avatar.js     Entrada pública del componente
src/                      Runtime reutilizable y módulos de expresiones
demo/                     Demo interactiva y scripts exclusivos
examples/                 Ejemplos mínimos de integración
assets/support/           Recursos QR de apoyo / pago
docs/                     Documentación multilingüe
README.md                 Documento principal en inglés
CHANGELOG.md              Historial público de versiones
CONTRIBUTING.md           Guía de contribución
package.json              Metadatos del paquete
LICENSE                   Licencia MIT
```

## Distribución y compatibilidad

El paquete está publicado en npm como `agent-robot-avatar` e incluye declaraciones TypeScript para acciones, eventos y métodos públicos. Está pensado para navegadores modernos compatibles con ES Modules, Custom Elements, SVG, Pointer Events y Web Animations API.

## Contribuir

Se aceptan Issues y Pull Requests. Consulta [`CONTRIBUTING.md`](../CONTRIBUTING.md) antes de enviar cambios.

## Estado del proyecto

v0.1.0 es la primera línea de versión pública. La API pública se mantiene deliberadamente pequeña para poder evolucionar con cuidado antes de un futuro compromiso de estabilidad `1.0.0`.

Agent Robot Avatar es un proyecto independiente de código abierto y no está afiliado, respaldado ni representa a ninguna plataforma o marca de IA.

## Licencia

MIT License. Consulta [`LICENSE`](../LICENSE).

## Invítame a un café

Si el proyecto te resulta útil, puedes apoyarlo con el método que prefieras:

| Ko-fi | Alipay | WeChat Pay |
| --- | --- | --- |
| <a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a> | <img src="../assets/support/alipay.png" alt="Código QR de Alipay" width="160"> | <img src="../assets/support/wechat-pay.png" alt="Código QR de WeChat Pay" width="160"> |
