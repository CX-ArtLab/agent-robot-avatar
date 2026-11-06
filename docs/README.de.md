# BoopFace

<p align="center">
  <img src="../assets/readme/boopface-header.jpg" alt="BoopFace: eine leichte, ausdrucksstarke Roboter-Avatar-Komponente für KI-Bots, Agenten und interaktive Apps">
</p>

**Offizielle Website: [boopface.com](https://boopface.com/)**

[English](https://github.com/CX-ArtLab/boopface/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.8.0-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/boopface/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/boopface/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square) ![Embedded](https://img.shields.io/badge/Embedded-ESP32%20%7C%20STM32%20%7C%20Pico-E7352C?style=flat-square&logo=espressif&logoColor=white)

BoopFace ist eine leichte, ausdrucksstarke Roboter-Avatar-Komponente für KI-Bots, Agenten und interaktive Apps. Nachdenken, Warten, Fertig oder Fehler: Jeder Zustand eines Agenten lässt sich mit einem Gesichtsausdruck zeigen.

Geeignet als Gesicht und Statusanzeige für KI-Assistenten und Agenten: Chat-Assistenten wie ChatGPT, Claude, Gemini, Grok und DeepSeek, Coding-Agenten wie Codex, Claude Code, Cursor, Gemini CLI und OpenCode sowie dauerhaft laufende Agenten wie Grok Bot, ChatGPT dots, Meta Muse, OpenClaw und Hermes Agent.

Auch für Desktop-Begleiter, virtuelle Haustiere, digitale Maskottchen, Chatbot-Avatare und andere interaktive Figuren geeignet, oder als visuelle Feedback-Ebene für Agenten-Oberflächen im AG-UI-Stil.

Gebaut mit SVG und reinem JavaScript, ist es eine native Web Component ohne Laufzeitabhängigkeiten, MIT-lizenziert. 188 [Skins](#skins--neu-in-07) stehen jederzeit zum Wechseln bereit.

<p align="center">
  <img src="../assets/demo/boopface-demo.gif" alt="Interaktive Animationsdemo von BoopFace" width="560">
</p>

## Neu: [BoopFace Embedded](#boopface-embedded)

<p align="center">
  <a href="#boopface-embedded"><img src="../assets/readme/boopface-embedded.jpg" alt="Dieselben Augenausdrücke auf ESP32-, STM32- und Raspberry-Pi-Pico-Bildschirmen oder in anderen C++-Programmen. Mit Firmware-Beispielen für 28 Konfigurationen und einem Simulator samt Einstellungsexport."></a>
</p>

Dieselben Augenausdrücke auf ESP32-, STM32- und Raspberry-Pi-Pico-Bildschirmen oder in anderen C++-Programmen. Mit Firmware-Beispielen für 28 Konfigurationen und einem Simulator samt Einstellungsexport.

## Live-Demo

[Interaktive Demo öffnen](https://cx-artlab.github.io/BoopFace/?lang=de) · [Zur Skin-Galerie](https://cx-artlab.github.io/BoopFace/skins.html?lang=de)

[Embedded-Simulator öffnen](https://cx-artlab.github.io/BoopFace/hardware/?lang=de)

## Besondere Merkmale

- Native Web Component
- SVG-Rendering + Vanilla JavaScript
- Keine Runtime-Abhängigkeiten
- Automatisches Blinzeln und dezentes Idle-Verhalten
- Zeigerfolgende Augen und träge Kopfbewegung
- Lokale Jelly-Drag-Verformung mit elastischer Rückkehr
- Drücken-und-Halten-Stauchung und ziehbare Federantenne
- Programmatisch steuerbare Agent-Zustände und Ausdrücke
- Ausdrücke für waiting, success, failure, affirm, wary, inspect, angry, refuse, love und mehr
- Unterstützung für reduzierte Bewegung
- Konfigurierbares Schlafverhalten
- Einstellbare Kopfrundung
- 188 nummerierte Skins in 17 Serien, mit Licht, das dem Zeiger folgt
- Schlanke Version ohne Skins für besonders kleine Seiten
- TypeScript-Deklarationen enthalten

## Installation

```bash
npm install boopface
```

```js
import 'boopface';
```

Oder lade `boopface-x.y.z.zip` aus dem [neuesten Release](https://github.com/CX-ArtLab/boopface/releases/latest) herunter. Es enthält nur die Komponente, samt Skins. Entpacke es neben deine Seite:

```html
<script type="module" src="./boopface/boopface.js"></script>
```

Dann die Komponente hinzufügen:

```html
<boop-face id="avatar"></boop-face>
```

Es ist kein Initialisierungscode nötig. Der Avatar wechselt automatisch in seinen standardmäßigen Idle-Zustand.

### Umstieg von Agent Robot Avatar

Bis Version 0.8 hieß BoopFace Agent Robot Avatar. Funktionen und Verwendung bleiben gleich. Zum Aktualisieren genügt es, den Paketnamen auf `boopface` zu ändern:

```bash
npm uninstall agent-robot-avatar
npm install boopface
```

Das alte Tag `<agent-robot-avatar>` funktioniert bis 1.0 weiter, deine Seiten musst du also nicht sofort ändern. Das alte npm-Paket `agent-robot-avatar` erhält keine Updates mehr; neue Versionen erscheinen nur noch als `boopface`.

### Schlanke Version

Für Seiten ohne Skins ist `boopface/lite` derselbe Avatar ganz ohne Skin-Code:

```js
import 'boopface/lite';
```

Die schlanke Version ignoriert das Attribut `skin` und weist in der Konsole darauf hin, dass Skins die vollständige Version brauchen.

Größenvergleich (Übertragung über das Netz, gzip-komprimiert):

| Version | Größe |
| --- | --- |
| Schlanke Version `boopface/lite` | etwa 45 KB |
| Vollständig, Seite nutzt keine Skins | etwa 56 KB; der Code zum Zeichnen der Skins wird nicht geladen |
| Vollständig, mit Skins | etwa 113 KB; der zusätzliche Teil lädt erst, wenn zum ersten Mal ein Skin verwendet wird |

## Grundlegende Verwendung

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('wary');
avatar.play('refuse');

avatar.reset();
```

Verfügbare Aktionen:

| Aktion | Aussehen | Wann verwenden |
| --- | --- | --- |
| `idle` | Blinzelt und schaut sich um | Standardzustand |
| `bored` | Schaut langsam von einer Seite zur anderen | Länger ist nichts passiert |
| `waiting-spin` | Augen kreisen von Seite zu Seite | Warten auf eine Antwort (Standard) |
| `waiting-wrap` | Augen gleiten auf einer Seite hinaus und auf der anderen zurück | Warten auf eine Antwort |
| `waiting-wave` | Augen wippen abwechselnd auf und ab | Warten auf eine Antwort |
| `input` | Augen werden zu blinkenden Textcursorn | Nutzer tippt |
| `affirm` | Nickt | Verstanden, bestätigt |
| `success` | Fröhlich lächelnde Augen | Aufgabe erledigt |
| `failure` | Kopf und Augen sinken | Aufgabe oder Verbindung fehlgeschlagen |
| `wary` | Dreht den Kopf und mustert misstrauisch von oben bis unten | Aktion braucht eine Bestätigung |
| `inspect` | Kneift die Augen zusammen und scannt auf und ab | Etwas prüfen oder überprüfen |
| `angry` | Gesenkte, finster blickende Augen | Inhalt blockiert |
| `refuse` | Schüttelt den Kopf | Anfrage kann oder will es nicht ausführen |
| `surprise` | Weit aufgerissene Augen | Etwas Unerwartetes |
| `love` | Augen verschmelzen zu einem schlagenden Herz | Dank, Zuneigung |
| `random` | Augen drehen sich wie Spielautomatenwalzen | Zufallsauswahl, verspielter Moment |
| `sleep` | Schließt die Augen und schläft | Lange keine Aktivität |
| `wake` | Öffnet die Augen und wacht auf | Aktivität setzt wieder ein |

Warte-Aktionen spielen mit `play()` eine Runde. `startWaiting({ variant: 'spin' | 'wrap' | 'wave' })` läuft in Schleife, bis eine andere Aktion startet oder `stopWaiting()` aufgerufen wird.

Namen aus 0.5 (`send`, `warning`, `error`, `blocked`, `slot` und weitere) funktionieren bis 1.0 weiter, mit einem Hinweis in der Konsole; siehe die [Upgrade-Tabelle](../CHANGELOG.md#upgrading-from-05x).

Ein typischer Agent-Anfrageablauf:

```js
avatar.startWaiting();

// Zweite Wartebewegung: Die Augen drehen seitlich heraus und kommen von der anderen Seite zurück.
avatar.startWaiting({ variant: 'wrap' });

// Dritte Wartebewegung: versetzte Augenwellen auf und ab.
avatar.startWaiting({ variant: 'wave' });

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('failure');
}
```

## Häufige Optionen

```html
<boop-face
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</boop-face>
```

| Attribut | Zweck |
| --- | --- |
| `size` | Avatargröße in Pixeln |
| `color` | Hauptfarbe des Avatars |
| `auto-sleep` | Leerlaufzeit vor automatischem Schlaf; `0` deaktiviert ihn |
| `wake-on` | Automatische Aufwachstrategie: `activity`, `interaction` oder `manual` |
| `motion` | Bewegungsstrategie: `auto`, `reduce` oder `full` |
| `press-squeeze` | Mitte gedrückt halten und stauchen; `false` deaktiviert die Geste |
| `antenna-drag` | Antenne ziehen, federnd zurückkehren und wütend reagieren; `false` deaktiviert sie |
| `skin` | Skin-Nummer, z. B. `301`; weglassen für die flache Farbe |

Häufige Runtime-Steuerungen:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setPressSqueeze(true);
avatar.setAntennaDrag(true);
```

Gedrückthalten in der Mitte startet die Stauchung. Nach mehr als 4 CSS-Pixeln Bewegung wechselt dieselbe Zeigergeste zum vorhandenen Kopfziehen. Die Antenne verwendet dessen Distanzlimit und endet mit der vorhandenen Wutreaktion.

## Skins · Neu in 0.7

188 Skins in 17 Serien; das Licht folgt dem Zeiger. Jeder Skin hat eine feste Nummer: die Seriennummer und zwei Ziffern, 305 ist also der fünfte Skin der Serie 3. Namen können sich ändern, Nummern nie, und sie werden nicht wiederverwendet.

Alle Skins sind weiterhin reines SVG – ohne Bilder, Canvas oder WebGL. Alle Skins zusammen sind über das Netz nur etwa 70 KB groß (unkomprimiert etwa 290 KB), und das meiste davon lädt erst, wenn eine Seite einen Skin verwendet. Zum Vergleich: Der Avatar selbst (der Lite-Build, ohne Skins) ist etwa 45 KB groß.

<img src="../assets/readme/skin-gallery.jpg" alt="Skin-Galerie: Empfehlungen, Filter und Suche" width="100%">

```html
<boop-face skin="301"></boop-face>
```

```js
avatar.setSkin(102);  // oder '102'
avatar.setSkin(null); // zurück zur flachen Farbe
```

Alle Skins mit Nummer zeigt die [Seite mit allen Skins](https://cx-artlab.github.io/BoopFace/materials/?lang=de).

| Serie | Nummern | Serie | Nummern | Serie | Nummern |
| --- | --- | --- | --- | --- | --- |
| Glasur | 101–106 | Eisglas | 201–206 | Gummi | 301–312 |
| Bonbonglas | 401–406 | Acryl | 501–512 | Gelee | 601–612 |
| Verlauf | 701–712 | Milchglas | 801–806 | Metall | 901–930 |
| Edelsteine und Keramik | 1001–1012 | Holz | 1101–1106 | Bälle | 1201–1210 |
| Klar und schimmernd | 1301–1305 | Stoff und Leder | 1401–1412 | Süßes und Obst | 1501–1512 |
| Natur | 1601–1612 | Muster und Technik | 1701–1717 |  |  |

Der Code, der die Skins zeichnet, wird erst beim ersten Skin geladen; eine Seite ohne Skins lädt ihn nie. `await loadSkins()` lädt ihn vorab. `SKINS` enthält die chinesischen und englischen Namen und Farben jedes Skins, `SKIN_SERIES` die Serien und `SKIN_NAMES` alle Nummern.

Alle Ausdrücke und Gesten funktionieren mit einem Skin. Ohne Skin gilt wieder das Attribut `color`.

## Ereignisse und Integration

Die Komponente sendet `face-state` für visuelle Zustandsänderungen und `action-state` für semantische Änderungen im Aktionslebenszyklus.

Für Host-Integrationen und barrierefreie Statustexte sollte `action-state` bevorzugt werden. Ein ausführbares Anfrage-Lifecycle-Beispiel befindet sich in [`examples/accessibility.html`](../examples/accessibility.html).

Ein minimales Integrationsbeispiel ist unter [`examples/basic.html`](../examples/basic.html) verfügbar.

## Kompatibilität

Für moderne Browser mit Unterstützung für ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver` und `matchMedia`.

Automatisierte Browsertests decken Chromium, Firefox und WebKit ab.

<a id="boopface-embedded"></a>

## Neu: BoopFace Embedded

Die Augenausdrücke der Webversion laufen jetzt auf Robotern und Entwicklungsplatinen. Die kleine C++11-Engine erhält Bewegungen und Timing. Die Beispiele decken 28 Konfigurationen mit ESP32, ESP32-S3, STM32 und Raspberry Pi Pico ab: runde und rechteckige TFTs, längliche Displays, AMOLED und monochrome OLEDs. Eigene Bildschirmgrößen werden unterstützt.

| Dein Gerät | Passende Version |
| --- | --- |
| Websites, Apps, Android-Tablets und Roboter mit Browser | Webkomponente: vollständiger Avatar, Skins und Interaktionen |
| ESP32, STM32 und Raspberry Pi Pico | Embedded-Engine mit Firmware-Beispielen |
| Andere Mikrocontroller oder C++-Programme | C++-Bibliothek; eigenen Bildschirmtreiber einbinden |


<img src="../assets/readme/hardware-preview.jpg" alt="Simulator: Augenausdrücke auf rundem TFT, Anordnung, Farben und Export" width="100%">

**Ohne Platine ausprobieren.** Der [Simulator](https://cx-artlab.github.io/BoopFace/hardware/?lang=de) führt dieselbe C++-Engine im Browser auf 32 simulierten Bildschirmen aus. So kannst du Module vergleichen und die Darstellung vorab ansehen.

**Anpassen, exportieren, bauen.** Wähle Bildschirm, Anordnung, Farben und Bildrate, dann **Einstellungen exportieren**. Speichere `eyes_settings.h` neben der `main.cpp` des Beispiels und kompiliere. Siehe die [Anleitung](../embedded/README.md). Oberfläche und exportierte Kommentare folgen der gewählten Sprache.

**Per ZIP installieren.** Lade `BoopFace-Embedded-0.1.0.zip` vom [Embedded-Release](https://github.com/CX-ArtLab/boopface/releases/tag/eyes-v0.1.0) und verwende **Sketch → Bibliothek einbinden → .ZIP-Bibliothek hinzufügen** in der Arduino IDE. Die Indexierung im Arduino Library Manager steht noch aus; nutze dafür vorerst ZIP oder Quellcode. Für [PlatformIO](https://registry.platformio.org/libraries/cxlab/BoopFace) füge diese Abhängigkeit zur Umgebung in `platformio.ini` hinzu:

```ini
lib_deps = cxlab/BoopFace@^0.1.0
```

**In deinem Programm** spielst du Ausdrücke nach Namen ab:

```cpp
#include <BoopFace.h>
boopface::Eyes eyes;
uint8_t pixels[4800]; // 240 x 160, 1 bit per pixel

void setup() {
  boopface::EyesConfig config;
  eyes.begin(config, pixels, sizeof pixels, millis());
}

void loop() {
  if (eyes.update(millis())) {
    // Send eyes.data() to the display driver.
  }
}

// When needed: eyes.play("success", millis());
```

Experimentell: CI kompiliert alle Konfigurationen, auf realer Hardware sind sie noch nicht geprüft. Sende nach einem Test einen [Hardwarebericht](https://github.com/CX-ArtLab/boopface/issues/new?template=hardware_report.yml). API und Anschlüsse stehen in der [Anleitung](../embedded/README.md).

## Mitwirken

Issues und Pull Requests sind willkommen. Bitte vor Änderungen [`CONTRIBUTING.md`](../CONTRIBUTING.md) lesen.

## Projektstatus

**Aktuelle öffentliche Version: v0.8.0**\
BoopFace Embedded: v0.1.0 (experimentell)

Die öffentliche API bleibt bewusst kompakt, während sich das Projekt in Richtung einer zukünftigen Stabilitätszusage mit `1.0.0` entwickelt.

BoopFace wird unabhängig entwickelt und ist mit keiner KI-Plattform oder Marke verbunden, von ihr unterstützt oder deren offizieller Vertreter.

## Charakterdesign und visuelle Identität

Der BoopFace-Charakter einschließlich seines Roboterdesigns und seiner visuellen Identität ist ein Originaldesign von CX ArtLab.

Die MIT-Lizenz gilt für Software und Quellcode. Sie erlaubt die Nutzung, Änderung und Verteilung des Avatars als Teil von Anwendungen, überträgt jedoch nicht das Eigentum am Namen BoopFace, an der Charakteridentität oder der visuellen Identität und gewährt nicht das Recht, diese als eigenen Originalcharakter oder eigenständige Marke eines Dritten darzustellen.

In diesem Projekt genannte Produktnamen Dritter dienen nur zur Beschreibung möglicher Anwendungsfälle und bedeuten keine Verbindung oder Unterstützung.

## Lizenz

MIT License. Siehe [`LICENSE`](../LICENSE).

---

Wenn dir dieses Projekt nützlich ist, kannst du mir einen Kaffee spendieren.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
