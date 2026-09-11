# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.3.2-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

Un Web Component d’avatar robot léger et expressif pour les agents IA et les applications interactives.

Il peut être utilisé dans des assistants IA, des interfaces d’agents, des compagnons de bureau, des animaux virtuels, des mascottes numériques, des avatars de chatbot et d’autres expériences de personnages interactifs.

Construit avec SVG et JavaScript natif, il fonctionne comme un Custom Element sans dépendance d’exécution.

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Démo animée interactive de Agent Robot Avatar" width="560">
</p>

## Démo en ligne

[Ouvrir la démo interactive](https://cx-artlab.github.io/agent-robot-avatar/?lang=fr)

## Points forts

- Web Component natif
- Rendu SVG + JavaScript natif
- Zéro dépendance d’exécution
- Clignements automatiques et comportement idle discret
- Yeux suivant le pointeur et mouvement inertiel de la tête
- Déformation locale façon gelée lors du glisser, avec retour élastique
- États et expressions d’Agent contrôlables par code
- Retours pour waiting, success, failure, warning, review, blocked et system error
- Prise en charge du mouvement réduit
- Comportement de sommeil configurable
- Arrondi de la tête réglable
- Clignotement d’état optionnel de l’antenne
- Déclarations TypeScript incluses

## Installation

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

Vous pouvez aussi charger directement le code source du dépôt :

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

Puis ajouter le composant :

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

Aucun code d’initialisation n’est nécessaire. L’avatar entre automatiquement dans son état idle par défaut.

## Utilisation de base

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('warning');
avatar.play('error');

avatar.reset();
```

Actions disponibles :

`idle` · `bored` · `waiting` · `input` · `send` · `success` · `failure` · `warning` · `inspect` · `blocked` · `error` · `surprise` · `sleep` · `wake`

`failure` représente une tâche terminée sans succès, tandis que `error` est réservé aux erreurs de connexion, de service ou de système.

Exemple de cycle de requête Agent :

```js
avatar.startWaiting();

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('error');
}
```

## Options courantes

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</agent-robot-avatar>
```

| Attribut | Usage |
| --- | --- |
| `size` | Taille de l’avatar en pixels |
| `color` | Couleur principale de l’avatar |
| `auto-sleep` | Temps d’inactivité avant le sommeil automatique ; `0` le désactive |
| `wake-on` | Politique de réveil automatique : `activity`, `interaction` ou `manual` |
| `motion` | Politique d’animation : `auto`, `reduce` ou `full` |

Contrôles courants à l’exécution :

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setAntennaFlash(true);
```

## Événements et intégration

Le composant émet `face-state` pour les changements d’état visuel et `action-state` pour les changements sémantiques du cycle de vie des actions.

Pour les intégrations avec l’application hôte et les textes d’état accessibles, préférez `action-state`. Consultez [`examples/accessibility.html`](../examples/accessibility.html) pour un exemple exécutable de cycle de requête.

Un exemple minimal d’intégration est disponible dans [`examples/basic.html`](../examples/basic.html).

## Compatibilité

Conçu pour les navigateurs modernes prenant en charge ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver` et `matchMedia`.

Les tests automatisés couvrent Chromium, Firefox et WebKit.

## Contribution

Issues et Pull Requests sont les bienvenus. Consultez [`CONTRIBUTING.md`](../CONTRIBUTING.md) avant de proposer des modifications.

## État du projet

**Version publique actuelle : v0.3.2**

L’API publique reste volontairement compacte pendant l’évolution du projet vers un futur engagement de stabilité `1.0.0`.

Agent Robot Avatar est développé indépendamment et n’est affilié, approuvé ou représentatif d’aucune plateforme ou marque d’IA.

## Design du personnage et identité visuelle

Le personnage Agent Robot Avatar, y compris son apparence robotique et son identité visuelle, est une création originale de CX ArtLab.

La licence MIT s’applique au logiciel et au code source. Elle permet d’utiliser, modifier et distribuer l’avatar dans des applications, mais ne transfère pas la propriété du nom Agent Robot Avatar, de l’identité du personnage ou de son identité visuelle, et n’accorde pas le droit de les présenter comme le personnage original ou la marque autonome d’un tiers.

Les noms de produits tiers mentionnés dans ce projet servent uniquement à décrire des cas d’usage possibles et n’impliquent aucune affiliation ni approbation.

## Licence

MIT License. Voir [`LICENSE`](../LICENSE).

---

Si ce projet vous est utile, vous pouvez m’offrir un café.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>