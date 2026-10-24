# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.6.0-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

Eine leichtgewichtige, ausdrucksstarke Roboter-Avatar-Web-Component für KI-Agenten und interaktive Anwendungen.

Sie kann in KI-Assistenten, Agent-Oberflächen, Desktop-Begleitern, virtuellen Haustieren, digitalen Maskottchen, Chatbot-Avataren und anderen interaktiven Charaktererlebnissen eingesetzt werden.

Geeignet für KI-Assistenten- und Agent-Oberflächen, einschließlich Produkten und Erlebnissen ähnlich wie ChatGPT, Claude, Codex, Cursor, Grok Bot, Gemini CLI und OpenCode.

Sie basiert auf SVG und Vanilla JavaScript, läuft als natives Custom Element und hat keine Runtime-Abhängigkeiten.

Agent Robot Avatar kann außerdem als visuelle Feedback-Ebene für Agent-Oberflächen im AG-UI-Stil verwendet werden.

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Interaktive Animationsdemo von Agent Robot Avatar" width="560">
</p>

## Live-Demo

[Interaktive Demo öffnen](https://cx-artlab.github.io/agent-robot-avatar/?lang=de)

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
- TypeScript-Deklarationen enthalten

## Installation

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

Alternativ kann der Repository-Quellcode direkt geladen werden:

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

Dann die Komponente hinzufügen:

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

Es ist kein Initialisierungscode nötig. Der Avatar wechselt automatisch in seinen standardmäßigen Idle-Zustand.

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
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</agent-robot-avatar>
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

Häufige Runtime-Steuerungen:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setPressSqueeze(true);
avatar.setAntennaDrag(true);
```

Gedrückthalten in der Mitte startet die Stauchung. Nach mehr als 4 CSS-Pixeln Bewegung wechselt dieselbe Zeigergeste zum vorhandenen Kopfziehen. Die Antenne verwendet dessen Distanzlimit und endet mit der vorhandenen Wutreaktion.

## Ereignisse und Integration

Die Komponente sendet `face-state` für visuelle Zustandsänderungen und `action-state` für semantische Änderungen im Aktionslebenszyklus.

Für Host-Integrationen und barrierefreie Statustexte sollte `action-state` bevorzugt werden. Ein ausführbares Anfrage-Lifecycle-Beispiel befindet sich in [`examples/accessibility.html`](../examples/accessibility.html).

Ein minimales Integrationsbeispiel ist unter [`examples/basic.html`](../examples/basic.html) verfügbar.

## Kompatibilität

Für moderne Browser mit Unterstützung für ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver` und `matchMedia`.

Automatisierte Browsertests decken Chromium, Firefox und WebKit ab.

## Hardware-Version (in Entwicklung)

Eine C++-Version, die die Ausdrücke des Avatars auf Roboter- und Entwicklungsboard-Displays zeigt (sie zeichnet nur die Augen), ist in Entwicklung und noch nicht veröffentlicht. Siehe die [Hardware-Anleitung](https://github.com/CX-ArtLab/agent-robot-avatar/tree/main/embedded).

## Mitwirken

Issues und Pull Requests sind willkommen. Bitte vor Änderungen [`CONTRIBUTING.md`](../CONTRIBUTING.md) lesen.

## Projektstatus

**Aktuelle öffentliche Version: v0.6.0**

Die öffentliche API bleibt bewusst kompakt, während sich das Projekt in Richtung einer zukünftigen Stabilitätszusage mit `1.0.0` entwickelt.

Agent Robot Avatar wird unabhängig entwickelt und ist mit keiner KI-Plattform oder Marke verbunden, von ihr unterstützt oder deren offizieller Vertreter.

## Charakterdesign und visuelle Identität

Der Agent-Robot-Avatar-Charakter einschließlich seines Roboterdesigns und seiner visuellen Identität ist ein Originaldesign von CX ArtLab.

Die MIT-Lizenz gilt für Software und Quellcode. Sie erlaubt die Nutzung, Änderung und Verteilung des Avatars als Teil von Anwendungen, überträgt jedoch nicht das Eigentum am Namen Agent Robot Avatar, an der Charakteridentität oder der visuellen Identität und gewährt nicht das Recht, diese als eigenen Originalcharakter oder eigenständige Marke eines Dritten darzustellen.

In diesem Projekt genannte Produktnamen Dritter dienen nur zur Beschreibung möglicher Anwendungsfälle und bedeuten keine Verbindung oder Unterstützung.

## Lizenz

MIT License. Siehe [`LICENSE`](../LICENSE).

---

Wenn dir dieses Projekt nützlich ist, kannst du mir einen Kaffee spendieren.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
