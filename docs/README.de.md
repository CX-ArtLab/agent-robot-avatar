# Agent Robot Avatar

[English](../README.md) | [简体中文](./README.zh-CN.md) | [繁體中文](./README.zh-TW.md) | [日本語](./README.ja.md) | [한국어](./README.ko.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [Deutsch](./README.de.md) | [Français](./README.fr.md)

Eine leichte, ausdrucksstarke Roboter-Avatar-Web-Component für KI-Agenten und andere interaktive Anwendungen.

Agent Robot Avatar basiert auf SVG und Vanilla JavaScript und benötigt kein externes Animationsframework. Die Komponente funktioniert als natives Custom Element und stellt eine kompakte API für Ausdrücke, Interaktionszustände, Pointer-Following, Wartefeedback und Kopfform bereit.

**Aktuelle öffentliche Version: v0.1.0**

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar animated demo" width="560">
</p>

## Highlights

- SVG + Vanilla JavaScript
- Native Web Component
- Keine externe Animations-Framework-Abhängigkeit
- Automatisches Blinzeln und subtile Blickbewegung
- Pointer-Following und träge Kopfbewegung
- Lokale Jelly-Drag-Verformung mit elastischer Rückkehr
- Programmatisch steuerbare Agent-Zustände und Ausdrücke
- Getrennte Semantik für waiting, failure, warning, inspect, blocked und system error
- Einstellbare Kopfrundung
- Schwebende Antenne mit optionalem Statusblinken
- Demo klar vom wiederverwendbaren Component-Runtime getrennt

## Schnellstart

```html
<script type="module" src="./agent-robot-avatar.js"></script>
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

Ein minimales Beispiel befindet sich unter [`examples/basic.html`](../examples/basic.html).

## Basis-API

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

## Zustände und Ausdrücke

| Zustand | API | Typische Verwendung |
| --- | --- | --- |
| Idle | `idle` | Normaler Bereitschaftszustand |
| Bored | `bored` | Längere Zeit ohne aktive Aufgabe |
| Waiting | `waiting` | Anfrage gesendet, Ergebnis steht noch aus |
| Input | `input` | Benutzer tippt |
| Send | `send` | Senden / Nicken als Feedback |
| Success | `success` | Aufgabe erfolgreich abgeschlossen |
| Failure | `failure` | Aufgabe wurde erfolglos abgeschlossen |
| Warning | `warning` | Eine wichtige Aktion benötigt Bestätigung |
| Inspect | `inspect` | Ergebnis prüfen oder verifizieren |
| Blocked | `angry` | Anfrage blockiert oder kann nicht fortgesetzt werden |
| System error | `error` | Verbindungs-, Dienst- oder Systemfehler |
| Surprise | `surprise` | Unerwartetes Ereignis oder Ergebnis |
| Sleep | `sleep` | Schlafzustand aktivieren |
| Wake | `wake` | Aus dem Schlafzustand zurückkehren |

`failure` beschreibt einen Fehlschlag der Aufgabe selbst; `error` ist für Verbindungs-, Dienst- oder Systemprobleme reserviert. `waiting` bezeichnet eine laufende Anfrage, `bored` dagegen Inaktivität.

```js
avatar.startWaiting();
avatar.stopWaiting();
avatar.setPointerFollow(false);
avatar.setPointerFollow(true);
avatar.setHeadRoundness(0);
avatar.setHeadRoundness(50);
avatar.setHeadRoundness(100);
```

`setHeadRoundness()` akzeptiert Werte von `0–100`. Änderungen lösen `head-roundness-change` aus. Visuelle Zustandsänderungen lösen `face-state` aus.

## Attribute

```html
<agent-robot-avatar size="160" color="#08090b" auto-sleep="30000"></agent-robot-avatar>
```

| Attribut | Beschreibung |
| --- | --- |
| `size` | Component-Größe in Pixeln |
| `color` | Hauptfarbe des Avatars |
| `auto-sleep` | Inaktivitätszeit bis zum automatischen Schlaf in ms; `0` deaktiviert |

## Standardverhalten und Drag

Ohne explizite API-Aufrufe bietet der Avatar zufälliges Blinzeln, subtile Blickbewegungen, Pointer-Following, leichte Trägheit und optionalen Auto-Sleep. Beim Ziehen verformt sich der Kopf lokal um den Interaktionspunkt und kehrt elastisch zurück.

- Stark nach außen ziehen: nach der Rückkehr `angry`
- Stark zur Mitte drücken: nach der Rückkehr `success`
- Kleine Bewegung: nur Verformung

## Interaktive Demo

`demo/index.html` enthält alle öffentlichen Zustände, Pointer-Following, Jelly-Drag, den waiting-Lebenszyklus, Kopfrundung, Farb- und Verhaltenssteuerung sowie eine simulierte Agent-Unterhaltung. Demo-spezifisches JavaScript liegt unter `demo/` und ist nicht Teil des wiederverwendbaren npm-Runtimes.

## Projektstruktur

```text
agent-robot-avatar.js     Öffentlicher Component-Einstieg
src/                      Wiederverwendbarer Runtime und Ausdrucksmodule
demo/                     Interaktive Demo und Demo-spezifische Skripte
examples/                 Minimale Integrationsbeispiele
assets/support/           Support-/Zahlungs-QR-Ressourcen
docs/                     Mehrsprachige Dokumentation
README.md                 Englische Hauptdokumentation
CHANGELOG.md              Öffentliche Versionshistorie
CONTRIBUTING.md           Beitragsleitfaden
package.json              Paket-Metadaten
LICENSE                   MIT License
```

## Distribution und Kompatibilität

Das Repository enthält npm-kompatible Metadaten, das npm-Paket ist jedoch noch nicht veröffentlicht. Bis zu einer entsprechenden Ankündigung ist das GitHub-Repository die kanonische Quelle für v0.1.0. Unterstützt werden moderne Browser mit ES Modules, Custom Elements, SVG, Pointer Events und Web Animations API.

## Beitragen

Issues und Pull Requests sind willkommen. Bitte vor Änderungen [`CONTRIBUTING.md`](../CONTRIBUTING.md) lesen.

## Projektstatus

v0.1.0 ist die erste öffentliche Release-Linie. Die öffentliche API bleibt bewusst klein, damit sie vor einer späteren Stabilitätszusage mit `1.0.0` sorgfältig weiterentwickelt werden kann.

Agent Robot Avatar ist ein unabhängig entwickeltes Open-Source-Projekt und steht in keiner offiziellen Verbindung zu einer KI-Plattform oder Marke.

## Lizenz

MIT License. Siehe [`LICENSE`](../LICENSE).

## Unterstütze mich mit einem Kaffee

| Ko-fi | Alipay | WeChat Pay |
| --- | --- | --- |
| <a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a> | <img src="../assets/support/alipay.png" alt="Alipay QR-Code" width="160"> | <img src="../assets/support/wechat-pay.png" alt="WeChat Pay QR-Code" width="160"> |
