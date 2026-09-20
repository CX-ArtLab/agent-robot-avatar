# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.3.2-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

Eine schlanke, ausdrucksstarke Roboter-Avatar-Web-Component für KI-Agenten und interaktive Anwendungen.

Geeignet für KI-Assistenten und Agent-Oberflächen, einschließlich Produkten und Anwendungen wie ChatGPT, Claude, Codex, Cursor, Grok Bot, Gemini CLI und OpenCode.

Auch für Desktop-Haustiere, virtuelle Begleiter, digitale Maskottchen, Chatbot-Avatare und andere interaktive Charaktere einsetzbar.

Agent Robot Avatar kann außerdem als visuelle Feedback-Ebene für Agent-Oberflächen im AG-UI-Stil dienen.

Die Komponente basiert auf SVG und nativem JavaScript, arbeitet als natives Custom Element und benötigt keine Laufzeitabhängigkeiten.

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar interactive animation demo" width="560">
</p>

## Live-Demo

[Interaktive Demo öffnen](https://cx-artlab.github.io/agent-robot-avatar/)

## Highlights

- Native Web Component
- SVG-Rendering und natives JavaScript
- Keine Laufzeitabhängigkeiten
- Automatisches Blinzeln und dezente Leerlaufbewegungen
- Augen folgen dem Mauszeiger, Kopfbewegungen mit Trägheit
- Gelartige Verformung beim Ziehen mit elastischer Rückstellung
- Programmatisch steuerbare Agent-Zustände und Gesichtsausdrücke
- Visuelles Feedback für Warten, Erfolg, Fehlschlag, Warnung, Prüfung, Blockierung und Systemfehler
- Unterstützung für reduzierte Bewegung
- Konfigurierbares Schlafverhalten
- Einstellbare Kopfrundung
- Optionales Statusblinken der Antenne
- TypeScript-Typdeklarationen enthalten

## Installation

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

Alternativ lässt sich der Quellcode des Repositorys direkt laden:

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

Anschließend die Komponente einfügen:

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

Initialisierungscode ist nicht nötig. Der Avatar wechselt automatisch in sein standardmäßiges Leerlaufverhalten.

## Grundlegende Verwendung

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('warning');
avatar.play('error');

avatar.reset();
```

Verfügbare Aktionen:

`idle` · `bored` · `waiting` · `input` · `send` · `success` · `failure` · `warning` · `inspect` · `blocked` · `error` · `surprise` · `sleep` · `wake`

`failure` steht für eine erfolglos abgeschlossene Aufgabe; `error` für Verbindungs-, Dienst- oder Systemfehler.

Beispiel für den Ablauf einer echten Agent-Anfrage:

```js
avatar.startWaiting();

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('error');
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
| `size` | Größe des Avatars in Pixeln |
| `color` | Hauptfarbe des Avatars |
| `auto-sleep` | Leerlaufzeit bis zum automatischen Schlaf; `0` deaktiviert ihn |
| `wake-on` | Automatische Aufwachregel: `activity`, `interaction` oder `manual` |
| `motion` | Bewegungsregel: `auto`, `reduce` oder `full` |

Häufige Steuerungsmethoden zur Laufzeit:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setAntennaFlash(true);
```

## Ereignisse und Integration

Die Komponente sendet `face-state` bei Änderungen des visuellen Zustands und `action-state` bei semantischen Änderungen im Lebenszyklus einer Aktion.

Für die Integration in die Host-Anwendung und barrierefreie Statustexte ist `action-state` vorzuziehen. Ein ausführbares Beispiel zum Anfrage-Lebenszyklus steht in [`examples/accessibility.html`](../examples/accessibility.html).

Ein einfaches Integrationsbeispiel steht in [`examples/basic.html`](../examples/basic.html).

## Kompatibilität

Entwickelt für moderne Browser mit Unterstützung für ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver` und `matchMedia`.

Automatisierte Browsertests decken Chromium, Firefox und WebKit ab.

## Mitwirken

Issues und Pull Requests sind willkommen. Bitte vor dem Einreichen von Änderungen [`CONTRIBUTING.md`](../CONTRIBUTING.md) lesen.

## Projektstatus

**Aktuelle öffentliche Version: v0.3.2**

Die öffentliche API wird bewusst kompakt gehalten, während sich das Projekt auf eine Stabilitätszusage für `1.0.0` zubewegt.

Agent Robot Avatar wird unabhängig entwickelt und ist mit keiner KI-Plattform oder Marke verbunden, wird von keiner unterstützt und vertritt keine davon.

## Charakterdesign und visuelle Identität

Die Figur Agent Robot Avatar einschließlich ihres Roboterdesigns und ihrer visuellen Identität ist ein Originalentwurf von CX ArtLab.

Die MIT-Lizenz gilt für die Software und den Quellcode. Sie erlaubt die Nutzung, Änderung und Verbreitung des Avatars als Teil von Anwendungen, überträgt aber weder die Rechte am Namen Agent Robot Avatar noch an der Identität der Figur oder ihrer visuellen Identität. Auch das Recht, diese als eigene Originalfigur oder eigenständige Marke einer anderen Partei auszugeben, wird nicht eingeräumt.

Die in diesem Projekt erwähnten Produktnamen Dritter dienen nur zur Veranschaulichung möglicher Einsatzfälle und bedeuten keine Verbindung oder Billigung.

## Lizenz

MIT-Lizenz. Siehe [`LICENSE`](../LICENSE).

---

Wenn dir dieses Projekt hilft, kannst du mir einen Kaffee spendieren.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
