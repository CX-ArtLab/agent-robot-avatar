# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md)

![Version](https://img.shields.io/badge/version-v0.2.1-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

Un Web Component léger et expressif d’avatar robot pour les agents IA et d’autres applications interactives.

Il convient aux interfaces d’assistants IA et d’Agents, notamment aux produits et expériences similaires à ChatGPT, Claude, Codex, Cursor, Grok Bot, Gemini CLI et OpenCode.

Il peut également être utilisé pour les desktop pets, animaux virtuels, compagnons de bureau, mascottes numériques, avatars de chatbots et autres expériences de personnages interactifs.

Agent Robot Avatar peut également servir de couche de retour visuel pour les interfaces d’Agents de style AG-UI.

Agent Robot Avatar est construit avec SVG et JavaScript natif, sans framework d’animation tiers. Il fonctionne comme un Custom Element natif et propose une API compacte pour les expressions, les états d’interaction, le suivi du pointeur, l’attente et la forme de la tête.

**Version publique actuelle : v0.2.1**

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Démonstration animée interactive d’Agent Robot Avatar" width="560">
</p>

## Démo en ligne

Essayez la démo interactive : [Ouvrir Agent Robot Avatar](https://cx-artlab.github.io/agent-robot-avatar/?lang=fr)

## Points forts

- SVG + JavaScript natif
- Web Component natif
- Aucune dépendance à un framework d’animation
- Clignement automatique et mouvements subtils du regard
- Suivi du pointeur et mouvement de tête avec inertie
- Déformation locale type gelée lors du glisser et retour élastique
- États et expressions d’Agent pilotables par code
- Sémantique distincte pour waiting, failure, warning, inspect, blocked et system error
- Arrondi de la tête réglable
- Antenne flottante avec clignotement d’état optionnel
- Demo séparée du composant réutilisable

## Démarrage rapide

Si vous utilisez directement le code du dépôt, conservez `agent-robot-avatar.js` avec le dossier `src/`, puis chargez l’entrée publique :

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

L’avatar passe automatiquement à l’état idle. Un exemple minimal est disponible dans [`examples/basic.html`](../examples/basic.html).

## API de base

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('failure');
avatar.play('warning');
avatar.play('inspect');
avatar.play('blocked');
avatar.play('error');

avatar.reset();
```

## États et expressions

| État | API | Usage |
| --- | --- | --- |
| Idle | `idle` | État d’attente normal |
| Bored | `bored` | Longue période sans tâche active |
| Waiting | `waiting` | Requête envoyée, résultat en attente |
| Input | `input` | L’utilisateur saisit du texte |
| Send | `send` | Envoi / retour par hochement |
| Success | `success` | Tâche terminée avec succès |
| Failure | `failure` | Tâche terminée sans succès |
| Warning | `warning` | Action importante nécessitant confirmation |
| Inspect | `inspect` | Examiner, contrôler ou vérifier un résultat |
| Blocked | `blocked` | Requête bloquée ou impossible à poursuivre |
| System error | `error` | Erreur de connexion, de service ou système |
| Surprise | `surprise` | Événement ou résultat inattendu |
| Sleep | `sleep` | Entrer en veille |
| Wake | `wake` | Sortir de veille |

`failure` correspond à l’échec de la tâche elle-même ; `error` est réservé aux problèmes de connexion, de service ou de système. `waiting` indique une requête en cours et `bored` une période d’inactivité.

Des alias sémantiques sont également disponibles :

```js
avatar.play('failed');
avatar.play('fail');
avatar.play('verify');
avatar.play('review');
avatar.play('angry'); // même expression visuelle que blocked
avatar.play('policy-blocked');
avatar.play('system-error');
avatar.play('connection-error');
```

## Attente continue

```js
avatar.startWaiting();
// Arrêter lorsque la réponse ou le résultat arrive.
avatar.stopWaiting();
```

Toute autre action interrompt aussi l’état waiting actif.

## Suivi du pointeur

```js
avatar.setPointerFollow(false);
avatar.setPointerFollow(true);
```

## Arrondi de la tête

```js
avatar.setHeadRoundness(0);   // plus carrée
avatar.setHeadRoundness(50);  // valeur par défaut
avatar.setHeadRoundness(100); // plus ronde

console.log(avatar.getHeadRoundness());
```

Les valeurs sont limitées à `0–100`. Les changements déclenchent `head-roundness-change`.

```js
avatar.addEventListener('head-roundness-change', (event) => {
  console.log(event.detail.value);
});
```

## Événement d’état

Chaque changement visuel déclenche `face-state` :

```js
avatar.addEventListener('face-state', (event) => {
  console.log(event.detail.state);
});
```

## Attributs

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000">
</agent-robot-avatar>
```

| Attribut | Description |
| --- | --- |
| `size` | Taille du composant en pixels |
| `color` | Couleur principale de l’avatar |
| `auto-sleep` | Temps d’inactivité avant veille automatique, en ms ; `0` désactive la fonction |

## Comportement par défaut

Sans appel explicite à l’API, l’avatar propose déjà des clignements aléatoires, de petits mouvements du regard, le suivi du pointeur proche, une légère inertie de la tête, un retour naturel à idle et une veille automatique optionnelle.

## Interaction par glisser

Lors du glisser, la tête se déforme localement autour du point d’interaction au lieu de se déplacer comme un objet rigide.

- Forte traction vers l’extérieur : déclenche `angry` après le retour
- Forte poussée vers le centre : déclenche `success` après le retour
- Petit glisser : déformation uniquement

## Demo interactive

`demo/index.html` contient tous les états publics, le suivi du pointeur, le glisser type gelée, le cycle waiting, le réglage de l’arrondi, les contrôles de couleur et de comportement et une simulation de conversation Agent. Le JavaScript propre à la Demo reste dans `demo/` et n’est pas inclus dans le runtime npm réutilisable.

## Structure du projet

```text
agent-robot-avatar.js     Entrée publique du composant
src/                      Runtime réutilisable et modules d’expression
demo/                     Demo interactive et scripts dédiés
examples/                 Exemples minimaux d’intégration
assets/support/           Ressources QR de soutien / paiement
docs/                     Documentation multilingue
README.md                 Documentation principale en anglais
CHANGELOG.md              Historique public des versions
CONTRIBUTING.md           Guide de contribution
package.json              Métadonnées du paquet
LICENSE                   Licence MIT
```

## Distribution et compatibilité

Le paquet est publié sur npm sous le nom `agent-robot-avatar` et inclut des déclarations TypeScript pour les actions, les événements et les méthodes publiques. Le composant cible les navigateurs modernes prenant en charge ES Modules, Custom Elements, SVG, Pointer Events et Web Animations API.

## Contribuer

Issues et Pull Requests sont les bienvenus. Consultez [`CONTRIBUTING.md`](../CONTRIBUTING.md) avant de proposer des changements.

## État du projet

v0.2.1 est la version publique actuelle. v0.1.0 reste disponible comme première version publique. L’API publique reste volontairement limitée afin d’évoluer avec prudence avant un futur engagement de stabilité `1.0.0`.

Agent Robot Avatar est un projet open source développé indépendamment ; il n’est affilié, approuvé ni représentatif d’aucune plateforme ou marque d’IA.

## Licence

MIT License. Voir [`LICENSE`](../LICENSE).

## Offrez-moi un café

Si ce projet vous est utile, vous pouvez le soutenir avec la méthode qui vous convient :

| Ko-fi | Alipay | WeChat Pay |
| --- | --- | --- |
| <a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a> | <img src="../assets/support/alipay.png" alt="QR code Alipay" width="160"> | <img src="../assets/support/wechat-pay.png" alt="QR code WeChat Pay" width="160"> |
