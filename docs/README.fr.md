# BoopFace

<p align="center">
  <img src="../assets/readme/boopface-header.jpg" alt="BoopFace : un composant d’avatar robot léger et expressif pour les bots IA, les agents et les applications interactives">
</p>

[English](https://github.com/CX-ArtLab/boopface/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.8.0-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/boopface/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/boopface/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square) ![Embedded](https://img.shields.io/badge/Embedded-ESP32%20%7C%20STM32%20%7C%20Pico-E7352C?style=flat-square&logo=espressif&logoColor=white)

BoopFace est un composant d’avatar robot léger et expressif pour les bots IA, les agents et les applications interactives. Réflexion, attente, réussite ou erreur : chaque état d’un agent peut s’afficher sous forme d’expression.

Utilisez-le comme visage et retour d’état pour les assistants et agents IA : assistants de chat comme ChatGPT, Claude, Gemini, Grok et DeepSeek, agents de code comme Codex, Claude Code, Cursor, Gemini CLI et OpenCode, et agents toujours actifs comme Grok Bot, ChatGPT dots, Meta Muse, OpenClaw et Hermes Agent.

Il convient aussi aux compagnons de bureau, animaux virtuels, mascottes numériques, avatars de chatbot et autres personnages interactifs, ou comme couche de retour visuel pour les interfaces d’agents de style AG-UI.

Construit avec SVG et JavaScript natif, c’est un Web Component natif sans dépendance à l’exécution, sous licence MIT. 188 [skins](#skins--nouveau-dans-la-07) sont prêts à être enfilés à tout moment.

<p align="center">
  <img src="../assets/demo/boopface-demo.gif" alt="Démo animée interactive de BoopFace" width="560">
</p>

<p align="center">
  <a href="#boopface-embedded"><img src="../assets/readme/boopface-embedded.jpg" alt="Les mêmes expressions sur les écrans ESP32, STM32 et Raspberry Pi Pico, ou dans d’autres programmes C++. Avec des exemples de firmware pour 28 configurations et un simulateur avec export des réglages."></a>
</p>

**[Nouveau : BoopFace Embedded](#boopface-embedded)**\
Les mêmes expressions sur les écrans ESP32, STM32 et Raspberry Pi Pico, ou dans d’autres programmes C++. Avec des exemples de firmware pour 28 configurations et un simulateur avec export des réglages.

## Démo en ligne

[Ouvrir la démo interactive](https://cx-artlab.github.io/boopface/?lang=fr) · [Voir la galerie de skins](https://cx-artlab.github.io/boopface/skins.html?lang=fr)

[Ouvrir le simulateur embarqué](https://cx-artlab.github.io/boopface/hardware/?lang=fr)

## Points forts

- Web Component natif
- Rendu SVG + JavaScript natif
- Zéro dépendance d’exécution
- Clignements automatiques et comportement idle discret
- Yeux suivant le pointeur et mouvement inertiel de la tête
- Déformation locale façon gelée lors du glisser, avec retour élastique
- Compression par appui prolongé et antenne ressort déplaçable
- États et expressions d’Agent contrôlables par code
- Expressions pour waiting, success, failure, affirm, wary, inspect, angry, refuse, love et plus
- Prise en charge du mouvement réduit
- Comportement de sommeil configurable
- Arrondi de la tête réglable
- 188 skins numérotés en 17 séries, avec une lumière qui suit le pointeur
- Version légère sans skins pour les pages les plus sobres
- Déclarations TypeScript incluses

## Installation

```bash
npm install boopface
```

```js
import 'boopface';
```

Ou téléchargez `boopface-x.y.z.zip` depuis la [dernière version](https://github.com/CX-ArtLab/boopface/releases/latest). Il ne contient que le composant, skins comprises. Décompressez-le à côté de votre page :

```html
<script type="module" src="./boopface/boopface.js"></script>
```

Puis ajouter le composant :

```html
<boop-face id="avatar"></boop-face>
```

Aucun code d’initialisation n’est nécessaire. L’avatar entre automatiquement dans son état idle par défaut.

### Passer d’Agent Robot Avatar à BoopFace

Avant la version 0.8, BoopFace s’appelait Agent Robot Avatar. Les fonctionnalités et l’utilisation ne changent pas. Pour mettre à jour, remplacez le nom du paquet par `boopface` :

```bash
npm uninstall agent-robot-avatar
npm install boopface
```

L’ancienne balise `<agent-robot-avatar>` fonctionne encore jusqu’à la 1.0 : rien ne presse pour modifier vos pages. L’ancien paquet npm `agent-robot-avatar` ne reçoit plus de mises à jour ; les nouvelles versions sont publiées uniquement sous `boopface`.

### Version légère

Pour les pages qui n’utilisent jamais de skins, `boopface/lite` est le même avatar sans le code des skins :

```js
import 'boopface/lite';
```

La version légère ignore l’attribut `skin` et indique dans la console que les skins nécessitent la version complète.

Comparaison des tailles (transfert réseau, compression gzip) :

| Version | Taille |
| --- | --- |
| Légère `boopface/lite` | environ 45 Ko |
| Complète, page sans skin | environ 56 Ko ; le code qui dessine les skins n’est pas téléchargé |
| Complète, avec skins | environ 113 Ko ; la partie supplémentaire n’est téléchargée qu’à la première utilisation d’un skin |

## Utilisation de base

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('wary');
avatar.play('refuse');

avatar.reset();
```

Actions disponibles :

| Action | Apparence | Quand l’utiliser |
| --- | --- | --- |
| `idle` | Cligne des yeux et regarde autour | État par défaut |
| `bored` | Regarde lentement d’un côté puis de l’autre | Rien ne se passe depuis un moment |
| `waiting-spin` | Les yeux tournent d’un côté à l’autre | En attente d’une réponse (par défaut) |
| `waiting-wrap` | Les yeux sortent d’un côté et reviennent par l’autre | En attente d’une réponse |
| `waiting-wave` | Les yeux montent et descendent à tour de rôle | En attente d’une réponse |
| `input` | Les yeux deviennent des curseurs clignotants | L’utilisateur tape |
| `affirm` | Hoche la tête | Compris, confirmé |
| `success` | Yeux joyeux et souriants | Tâche terminée |
| `failure` | Baisse la tête et les yeux | Échec d’une tâche ou d’une connexion |
| `wary` | Tourne la tête et toise de haut en bas avec méfiance | L’action demande une confirmation |
| `inspect` | Plisse les yeux et balaie de haut en bas | Vérifier ou relire quelque chose |
| `angry` | Yeux baissés et furieux | Contenu bloqué |
| `refuse` | Secoue la tête | Ne peut pas ou ne veut pas faire la demande |
| `surprise` | Yeux grands ouverts | Quelque chose d’inattendu |
| `love` | Les yeux forment un cœur qui bat | Remerciement, affection |
| `random` | Les yeux tournent comme des rouleaux de machine à sous | Tirage au sort, moment ludique |
| `sleep` | Ferme les yeux et dort | Longue inactivité |
| `wake` | Ouvre les yeux et se réveille | L’activité reprend |

Les actions d’attente jouent un tour avec `play()`. `startWaiting({ variant: 'spin' | 'wrap' | 'wave' })` boucle jusqu’à une autre action ou un appel à `stopWaiting()`.

Les noms de 0.5 (`send`, `warning`, `error`, `blocked`, `slot` et d’autres) fonctionnent encore jusqu’à 1.0, avec un avis dans la console ; voir le [tableau de mise à niveau](../CHANGELOG.md#upgrading-from-05x).

Exemple de cycle de requête Agent :

```js
avatar.startWaiting();

// Deuxième attente : les yeux sortent d'un côté et reviennent par l'autre.
avatar.startWaiting({ variant: 'wrap' });

// Troisième mouvement d’attente : vagues verticales décalées des yeux.
avatar.startWaiting({ variant: 'wave' });

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('failure');
}
```

## Options courantes

```html
<boop-face
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</boop-face>
```

| Attribut | Usage |
| --- | --- |
| `size` | Taille de l’avatar en pixels |
| `color` | Couleur principale de l’avatar |
| `auto-sleep` | Temps d’inactivité avant le sommeil automatique ; `0` le désactive |
| `wake-on` | Politique de réveil automatique : `activity`, `interaction` ou `manual` |
| `motion` | Politique d’animation : `auto`, `reduce` ou `full` |
| `press-squeeze` | Maintenir le centre pour comprimer ; `false` désactive le geste |
| `antenna-drag` | Glisser et faire rebondir l’antenne avec réaction de colère ; `false` désactive le geste |
| `skin` | Numéro de skin, par exemple `301` ; à omettre pour la couleur unie |

Contrôles courants à l’exécution :

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setPressSqueeze(true);
avatar.setAntennaDrag(true);
```

Maintenir le centre lance la compression. Après plus de 4 pixels CSS de déplacement, le même geste bascule vers le glisser de tête existant. L’antenne reprend sa limite de distance et se termine par la réaction de colère existante.

## Skins · Nouveau dans la 0.7

188 skins en 17 séries, avec une lumière qui suit le pointeur. Chaque skin a un numéro permanent : le numéro de série suivi de deux chiffres, donc 305 est le cinquième skin de la série 3. Les noms peuvent changer ; les numéros jamais, et ils ne sont pas réutilisés.

Tous les skins restent en SVG pur : sans images, canvas ni WebGL. Tous les skins réunis pèsent environ 70 Ko sur le réseau (environ 290 Ko non compressés), et l’essentiel ne se charge que lorsqu’une page utilise un skin. À titre de comparaison, l’avatar lui-même (la version lite, sans skins) pèse environ 45 Ko.

<img src="../assets/readme/skin-gallery.jpg" alt="Galerie de skins : sélection, filtres et recherche" width="100%">

```html
<boop-face skin="301"></boop-face>
```

```js
avatar.setSkin(102);  // ou '102'
avatar.setSkin(null); // retour à la couleur unie
```

Retrouvez tous les skins et leur numéro dans la [page de tous les skins](https://cx-artlab.github.io/boopface/materials/?lang=fr).

| Série | Numéros | Série | Numéros | Série | Numéros |
| --- | --- | --- | --- | --- | --- |
| Émail | 101–106 | Verre glacé | 201–206 | Gomme | 301–312 |
| Verre bonbon | 401–406 | Acrylique | 501–512 | Gelée | 601–612 |
| Dégradé | 701–712 | Verre dépoli | 801–806 | Métal | 901–930 |
| Pierres et céramique | 1001–1012 | Bois | 1101–1106 | Balles | 1201–1210 |
| Transparent et chatoyant | 1301–1305 | Tissu et cuir | 1401–1412 | Douceurs et fruits | 1501–1512 |
| Nature | 1601–1612 | Motifs et tech | 1701–1717 |  |  |

Le code qui dessine les skins est téléchargé la première fois qu’un skin est utilisé : une page sans skin ne le charge jamais. `await loadSkins()` le charge à l’avance. `SKINS` donne les noms chinois et anglais et les couleurs de chaque skin, `SKIN_SERIES` les séries et `SKIN_NAMES` tous les numéros.

Toutes les expressions et tous les gestes fonctionnent avec un skin. Sans skin, l’attribut `color` s’applique de nouveau.

## Événements et intégration

Le composant émet `face-state` pour les changements d’état visuel et `action-state` pour les changements sémantiques du cycle de vie des actions.

Pour les intégrations avec l’application hôte et les textes d’état accessibles, préférez `action-state`. Consultez [`examples/accessibility.html`](../examples/accessibility.html) pour un exemple exécutable de cycle de requête.

Un exemple minimal d’intégration est disponible dans [`examples/basic.html`](../examples/basic.html).

## Compatibilité

Conçu pour les navigateurs modernes prenant en charge ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver` et `matchMedia`.

Les tests automatisés couvrent Chromium, Firefox et WebKit.

<a id="boopface-embedded"></a>

## Nouveau : BoopFace Embedded

Les expressions des yeux de la version web fonctionnent désormais sur les écrans des robots et cartes. Le petit moteur C++11 conserve les mouvements et le rythme. Les exemples couvrent 28 configurations ESP32, ESP32-S3, STM32 et Raspberry Pi Pico : TFT ronds et rectangulaires, écrans allongés, AMOLED et OLED monochromes. Les dimensions personnalisées sont prises en charge.

| Votre appareil | Version à utiliser |
| --- | --- |
| Sites, apps, tablettes Android et robots avec navigateur | Composant web : avatar complet, habillages et interactions |
| ESP32, STM32 et Raspberry Pi Pico | Moteur embarqué avec exemples de firmware |
| Autres microcontrôleurs ou programmes C++ | Bibliothèque C++ ; fournissez votre pilote d’écran |


<img src="../assets/readme/hardware-preview.jpg" alt="Simulateur : expressions sur un TFT rond, disposition, couleurs et export" width="100%">

**Essayez sans carte.** Le [simulateur](https://cx-artlab.github.io/boopface/hardware/?lang=fr) exécute le même moteur C++ dans le navigateur sur 32 écrans simulés. Il permet de prévisualiser le résultat et de comparer les modules.

**Réglez, exportez, compilez.** Choisissez l’écran, la disposition, les couleurs et la cadence, puis **Exporter les réglages**. Placez `eyes_settings.h` à côté du `main.cpp` de l’exemple et compilez. Voir les [étapes](../embedded/README.md). L’interface et les commentaires exportés suivent la langue choisie.

**Installation par ZIP.** Téléchargez `BoopFace-Embedded-0.1.0.zip` depuis la [version embarquée](https://github.com/CX-ArtLab/boopface/releases/tag/eyes-v0.1.0), puis utilisez **Croquis → Inclure une bibliothèque → Ajouter la bibliothèque .ZIP** dans Arduino IDE. L’installation par Arduino Library Manager et le registre PlatformIO viendra après référencement ; utilisez le ZIP ou les sources pour le moment.

**Dans votre programme**, lancez les expressions par leur nom :

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

Expérimental : le CI compile toutes les configurations, mais aucune n’a encore été vérifiée sur du matériel réel. Envoyez un [rapport matériel](https://github.com/CX-ArtLab/boopface/issues/new?template=hardware_report.yml) après essai. Le [guide](../embedded/README.md) décrit l’API et le câblage.

## Contribution

Issues et Pull Requests sont les bienvenus. Consultez [`CONTRIBUTING.md`](../CONTRIBUTING.md) avant de proposer des modifications.

## État du projet

**Version publique actuelle : v0.8.0**\
BoopFace Embedded : v0.1.0 (expérimental)

L’API publique reste volontairement compacte pendant l’évolution du projet vers un futur engagement de stabilité `1.0.0`.

BoopFace est développé indépendamment et n’est affilié, approuvé ou représentatif d’aucune plateforme ou marque d’IA.

## Design du personnage et identité visuelle

Le personnage BoopFace, y compris son apparence robotique et son identité visuelle, est une création originale de CX ArtLab.

La licence MIT s’applique au logiciel et au code source. Elle permet d’utiliser, modifier et distribuer l’avatar dans des applications, mais ne transfère pas la propriété du nom BoopFace, de l’identité du personnage ou de son identité visuelle, et n’accorde pas le droit de les présenter comme le personnage original ou la marque autonome d’un tiers.

Les noms de produits tiers mentionnés dans ce projet servent uniquement à décrire des cas d’usage possibles et n’impliquent aucune affiliation ni approbation.

## Licence

MIT License. Voir [`LICENSE`](../LICENSE).

---

Si ce projet vous est utile, vous pouvez m’offrir un café.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
