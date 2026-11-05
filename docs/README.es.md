# BoopFace

<p align="center">
  <img src="../assets/readme/boopface-header.jpg" alt="BoopFace: un componente de avatar robot ligero y expresivo para bots de IA, agentes y apps interactivas">
</p>

[English](https://github.com/CX-ArtLab/boopface/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.8.0-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/boopface/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/boopface/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

BoopFace es un componente de avatar robot ligero y expresivo para bots de IA, agentes y apps interactivas. Pensando, esperando, terminado o con error: cada estado de un agente se puede mostrar con una expresión.

Úsalo como rostro y respuesta de estado de asistentes y agentes de IA: asistentes de chat como ChatGPT, Claude, Gemini, Grok y DeepSeek, agentes de programación como Codex, Claude Code, Cursor, Gemini CLI y OpenCode, y agentes siempre activos como Grok Bot, ChatGPT dots, Meta Muse, OpenClaw y Hermes Agent.

También sirve para compañeros de escritorio, mascotas virtuales, mascotas digitales de marca, avatares de chatbot y otros personajes interactivos, o como capa de respuesta visual para interfaces de agentes al estilo AG-UI.

Está hecho con SVG y JavaScript puro, es un Web Component nativo sin dependencias en tiempo de ejecución y tiene licencia MIT. Hay 188 [skins](#skins--novedad-en-07) listas para ponérselas en cualquier momento.

<p align="center">
  <img src="../assets/demo/boopface-demo.gif" alt="Demostración animada interactiva de BoopFace" width="560">
</p>

## Demo en vivo

[Abrir la demo interactiva](https://cx-artlab.github.io/boopface/?lang=es) · [Visita la galería de pieles](https://cx-artlab.github.io/boopface/skins.html?lang=es)

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
- 188 skins numerados en 17 series, con luz que sigue al puntero
- Versión ligera sin skins para las páginas más pequeñas
- Declaraciones TypeScript incluidas

## Instalación

```bash
npm install boopface
```

```js
import 'boopface';
```

O descarga `boopface-x.y.z.zip` desde la [última versión](https://github.com/CX-ArtLab/boopface/releases/latest). Contiene solo el componente, con las skins. Descomprímelo junto a tu página:

```html
<script type="module" src="./boopface/boopface.js"></script>
```

Después añade el componente:

```html
<boop-face id="avatar"></boop-face>
```

No hace falta código de inicialización. El avatar entra automáticamente en su estado idle predeterminado.

### Actualizar desde Agent Robot Avatar

BoopFace se llamaba Agent Robot Avatar antes de la versión 0.8. Las funciones y el uso no cambian. Para actualizar, cambia el nombre del paquete a `boopface`:

```bash
npm uninstall agent-robot-avatar
npm install boopface
```

La etiqueta antigua `<agent-robot-avatar>` sigue funcionando hasta la 1.0, así que no hay prisa por cambiar tus páginas. El paquete npm antiguo `agent-robot-avatar` ya no recibe actualizaciones; las nuevas versiones se publican solo como `boopface`.

### Versión ligera

Para páginas que nunca usan skins, `boopface/lite` es el mismo avatar sin el código de los skins:

```js
import 'boopface/lite';
```

La versión ligera ignora el atributo `skin` y avisa en la consola de que los skins necesitan la versión completa.

Comparación de tamaño (transferencia por la red, con compresión gzip):

| Versión | Tamaño |
| --- | --- |
| Ligera `boopface/lite` | unos 45 KB |
| Completa, la página no usa skins | unos 56 KB; el código que dibuja las skins no se descarga |
| Completa, con skins | unos 113 KB; la parte extra se descarga la primera vez que se usa una skin |

## Uso básico

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('wary');
avatar.play('refuse');

avatar.reset();
```

Acciones disponibles:

| Acción | Aspecto | Cuándo usarla |
| --- | --- | --- |
| `idle` | Parpadea y mira alrededor | Estado predeterminado |
| `bored` | Mira despacio a un lado y al otro | No ha pasado nada en un rato |
| `waiting-spin` | Los ojos giran de lado a lado | Esperando respuesta (predeterminado) |
| `waiting-wrap` | Los ojos salen por un lado y vuelven por el otro | Esperando respuesta |
| `waiting-wave` | Los ojos suben y bajan por turnos | Esperando respuesta |
| `input` | Los ojos se convierten en cursores parpadeantes | El usuario está escribiendo |
| `affirm` | Asiente | Entendido, confirmado |
| `success` | Ojos felices y sonrientes | Tarea completada |
| `failure` | Baja la cabeza y los ojos | Fallo de tarea o conexión |
| `wary` | Gira la cabeza y mira de arriba abajo con recelo | La acción necesita confirmación |
| `inspect` | Entrecierra los ojos y escanea arriba y abajo | Revisar o comprobar algo |
| `angry` | Ojos bajos y fulminantes | Contenido bloqueado |
| `refuse` | Niega con la cabeza | No puede o no quiere hacer la petición |
| `surprise` | Ojos muy abiertos | Algo inesperado |
| `love` | Los ojos se unen en un corazón que late | Agradecimiento, cariño |
| `random` | Los ojos giran como rodillos de tragaperras | Elección al azar, momento lúdico |
| `sleep` | Cierra los ojos y duerme | Mucho tiempo sin actividad |
| `wake` | Abre los ojos y despierta | Vuelve la actividad |

Las acciones de espera reproducen una ronda con `play()`. `startWaiting({ variant: 'spin' | 'wrap' | 'wave' })` se repite hasta que empiece otra acción o se llame a `stopWaiting()`.

Los nombres de 0.5 (`send`, `warning`, `error`, `blocked`, `slot` y otros) siguen funcionando hasta 1.0 con un aviso en la consola; consulta la [tabla de actualización](../CHANGELOG.md#upgrading-from-05x).

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
<boop-face
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</boop-face>
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
| `skin` | Número de skin, por ejemplo `301`; omítelo para el color plano |

Controles habituales en tiempo de ejecución:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setPressSqueeze(true);
avatar.setAntennaDrag(true);
```

Mantener pulsado el centro inicia la compresión. Al mover más de 4 píxeles CSS, el mismo gesto pasa al arrastre de cabeza existente. La antena usa el mismo límite de distancia y termina con la reacción de enfado existente.

## Skins · Novedad en 0.7

188 skins en 17 series, con una luz que sigue al puntero. Cada skin tiene un número permanente: el número de serie seguido de dos cifras, así que 305 es el quinto skin de la serie 3. Los nombres pueden cambiar; los números nunca cambian ni se reutilizan.

Todas las skins siguen siendo SVG puro: sin imágenes, canvas ni WebGL. Todas las skins juntas ocupan unos 70 KB por la red (unos 290 KB sin comprimir), y la mayor parte solo se carga cuando una página usa una skin. Como referencia, el avatar en sí (la versión lite, sin skins) ocupa unos 45 KB.

<img src="../assets/readme/skin-gallery.jpg" alt="Galería de skins: destacados, filtros y búsqueda" width="100%">

```html
<boop-face skin="301"></boop-face>
```

```js
avatar.setSkin(102);  // o '102'
avatar.setSkin(null); // vuelve al color plano
```

Consulta todos los skins con su número en la [página de todos los skins](https://cx-artlab.github.io/boopface/materials/?lang=es).

| Serie | Números | Serie | Números | Serie | Números |
| --- | --- | --- | --- | --- | --- |
| Esmalte | 101–106 | Vidrio hielo | 201–206 | Gominola | 301–312 |
| Vidrio caramelo | 401–406 | Acrílico | 501–512 | Gelatina | 601–612 |
| Degradado | 701–712 | Vidrio esmerilado | 801–806 | Metal | 901–930 |
| Gemas y cerámica | 1001–1012 | Madera | 1101–1106 | Pelotas | 1201–1210 |
| Transparente y brillo | 1301–1305 | Tela y cuero | 1401–1412 | Dulces y fruta | 1501–1512 |
| Naturaleza | 1601–1612 | Estampados y tecnología | 1701–1717 |  |  |

El código que pinta los skins se descarga la primera vez que se usa uno, así que una página sin skins nunca lo carga. `await loadSkins()` lo carga por adelantado. `SKINS` contiene los nombres en chino e inglés y los colores de cada skin, `SKIN_SERIES` las series y `SKIN_NAMES` todos los números.

Todas las expresiones y gestos funcionan con un skin. Al quitar el skin, el atributo `color` vuelve a aplicarse.

## Eventos e integración

El componente emite `face-state` para cambios de estado visual y `action-state` para cambios semánticos del ciclo de vida de las acciones.

Para integraciones con la aplicación anfitriona y texto de estado accesible, usa preferentemente `action-state`. Consulta [`examples/accessibility.html`](../examples/accessibility.html) para ver un ejemplo ejecutable del ciclo de vida de una solicitud.

Hay un ejemplo mínimo de integración en [`examples/basic.html`](../examples/basic.html).

## Compatibilidad

Diseñado para navegadores modernos con soporte para ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver` y `matchMedia`.

Las pruebas automatizadas cubren Chromium, Firefox y WebKit.

## BoopFace Embedded (en desarrollo)

Una versión en C++ que muestra las expresiones del avatar en pantallas de robots y placas de desarrollo (solo dibuja los ojos) está en desarrollo y aún no se ha publicado. Consulta la [guía de hardware](https://github.com/CX-ArtLab/boopface/tree/main/embedded).

## Contribuir

Se aceptan Issues y Pull Requests. Consulta [`CONTRIBUTING.md`](../CONTRIBUTING.md) antes de enviar cambios.

## Estado del proyecto

**Versión pública actual: v0.8.0**

La API pública se mantiene deliberadamente compacta mientras el proyecto evoluciona hacia un futuro compromiso de estabilidad `1.0.0`.

BoopFace se desarrolla de forma independiente y no está afiliado, respaldado ni representa a ninguna plataforma o marca de IA.

## Diseño del personaje e identidad visual

El personaje BoopFace, incluido su aspecto robótico y su identidad visual, es un diseño original de CX ArtLab.

La licencia MIT se aplica al software y al código fuente. Permite usar, modificar y distribuir el avatar como parte de aplicaciones, pero no transfiere la propiedad del nombre BoopFace, la identidad del personaje o su identidad visual, ni concede el derecho a presentarlos como personaje original o marca independiente de otra parte.

Los nombres de productos de terceros mencionados en este proyecto se usan únicamente para describir posibles casos de uso y no implican afiliación ni respaldo.

## Licencia

MIT License. Consulta [`LICENSE`](../LICENSE).

---

Si este proyecto te resulta útil, puedes invitarme a un café.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
