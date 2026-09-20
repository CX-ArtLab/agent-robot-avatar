# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.3.2-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

Un Web Component léger et expressif représentant un avatar robot pour les agents IA et les applications interactives.

Convient aux interfaces d’assistants IA et d’agents, notamment aux produits et expériences comparables à ChatGPT, Claude, Codex, Cursor, Grok Bot, Gemini CLI et OpenCode.

Il peut aussi servir d’animal de bureau, de compagnon virtuel, de mascotte numérique, d’avatar de chatbot ou de personnage interactif.

Agent Robot Avatar peut également fournir une couche de retour visuel aux interfaces d’agents de type AG-UI.

Conçu en SVG et JavaScript natif, il fonctionne comme un élément personnalisé natif, sans dépendance à l’exécution.

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar interactive animation demo" width="560">
</p>

## Démo interactive

[Ouvrir la démo interactive](https://cx-artlab.github.io/agent-robot-avatar/)

## Points forts

- Web Component natif
- Rendu SVG et JavaScript natif
- Aucune dépendance à l’exécution
- Clignements des yeux automatiques et mouvements discrets au repos
- Yeux suivant le pointeur et mouvements de tête avec inertie
- Déformation souple lors du glissement, avec retour élastique
- États et expressions des agents contrôlables par programmation
- Retours visuels pour l’attente, la réussite, l’échec, les avertissements, la vérification, le blocage et les erreurs système
- Prise en charge de la réduction des animations
- Comportement de veille configurable
- Arrondi de la tête réglable
- Clignotement de l’antenne en option pour signaler un état
- Déclarations de types TypeScript incluses

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

Ajoutez ensuite le composant :

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

Aucune initialisation n’est nécessaire : l’avatar adopte automatiquement son comportement de repos par défaut.

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

`failure` indique qu’une tâche s’est terminée sans succès ; `error` indique une défaillance de connexion, de service ou du système.

Exemple de cycle de vie d’une véritable requête Agent :

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

| Attribut | Rôle |
| --- | --- |
| `size` | Taille de l’avatar en pixels |
| `color` | Couleur principale de l’avatar |
| `auto-sleep` | Durée d’inactivité avant la veille automatique ; `0` la désactive |
| `wake-on` | Politique de réveil automatique : `activity`, `interaction` ou `manual` |
| `motion` | Politique d’animation : `auto`, `reduce` ou `full` |

Contrôles courants à l’exécution :

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setAntennaFlash(true);
```

## Événements et intégration

Le composant émet `face-state` lors des changements d’état visuel et `action-state` lors des changements sémantiques du cycle de vie des actions.

Pour les intégrations hôtes et les textes d’état accessibles, privilégiez `action-state`. Un exemple exécutable du cycle de vie d’une requête figure dans [`examples/accessibility.html`](../examples/accessibility.html).

Un exemple d’intégration minimal est disponible dans [`examples/basic.html`](../examples/basic.html).

## Compatibilité

Conçu pour les navigateurs modernes prenant en charge ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver` et `matchMedia`.

Les tests automatisés couvrent Chromium, Firefox et WebKit.

## Contribuer

Les issues et pull requests sont bienvenues. Consultez [`CONTRIBUTING.md`](../CONTRIBUTING.md) avant de proposer des modifications.

## État du projet

**Version publique actuelle : v0.3.2**

L’API publique reste volontairement compacte pendant que le projet évolue vers un engagement de stabilité prévu pour `1.0.0`.

Agent Robot Avatar est développé de façon indépendante ; il n’est affilié à aucune plateforme ni marque d’IA et ne bénéficie d’aucun soutien ou statut officiel de leur part.

## Design du personnage et identité visuelle

Le personnage Agent Robot Avatar, y compris son apparence et son identité visuelle, est une création originale de CX ArtLab.

La licence MIT s’applique au logiciel et au code source. Elle autorise l’utilisation, la modification et la distribution de l’avatar dans des applications, mais ne transfère pas la propriété du nom Agent Robot Avatar, de l’identité du personnage ou de son identité visuelle, ni le droit de les présenter comme un personnage original ou une marque autonome appartenant à un tiers.

Les noms de produits tiers mentionnés dans ce projet illustrent uniquement des cas d’utilisation possibles et n’impliquent aucune affiliation ni approbation.

## Licence

Licence MIT. Voir [`LICENSE`](../LICENSE).

---

Si ce projet vous est utile, vous pouvez m’offrir un café.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
