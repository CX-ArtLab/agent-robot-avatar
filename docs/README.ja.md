# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md)

![Version](https://img.shields.io/badge/version-v0.2.0-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square) ![14 Agent States](https://img.shields.io/badge/Agent%20states-14-8B5CF6?style=flat-square) ![Pointer Following](https://img.shields.io/badge/Pointer-following-00A67E?style=flat-square) ![Jelly Drag](https://img.shields.io/badge/Drag-jelly%20physics-FF69B4?style=flat-square)

AI エージェントやその他のインタラクティブなアプリケーションで使える、軽量で表情豊かなロボットアバター Web Component です。

Agent Robot Avatar は SVG と Vanilla JavaScript だけで構築され、サードパーティー製アニメーションフレームワークに依存しません。ネイティブ Custom Element として動作し、表情、状態、ポインター追従、待機フィードバック、頭部形状をシンプルな API で制御できます。

**現在の公開バージョン：v0.2.0**

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar インタラクティブアニメーションデモ" width="560">
</p>

## ライブデモ

インタラクティブデモを試す：[Agent Robot Avatar を開く](https://cx-artlab.github.io/agent-robot-avatar/?lang=ja)

## 特長

- SVG + Vanilla JavaScript
- ネイティブ Web Component
- 外部アニメーション依存なし
- 自動まばたきと自然な視線移動
- ポインター追従と慣性のある頭部モーション
- 局所的なゼリー風ドラッグ変形と弾性復帰
- Agent の状態や表情をプログラムから制御可能
- waiting / failure / warning / inspect / blocked / system error を意味的に分離
- 頭部の丸みを調整可能
- オプションで点滅するフローティングアンテナ
- Demo と再利用可能なコンポーネント本体を分離

## クイックスタート

リポジトリのソースを直接使う場合は、ルートの `agent-robot-avatar.js` と `src/` を同じ構成で保ち、公開エントリを読み込みます。

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

読み込み後は自動的に idle 状態になります。最小サンプルは [`examples/basic.html`](../examples/basic.html) にあります。

## 基本 API

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

## 状態と表情

| 状態 | API 名 | 用途 |
| --- | --- | --- |
| Idle | `idle` | 通常の待機状態 |
| Bored | `bored` | 長時間タスクがない状態 |
| Waiting | `waiting` | リクエスト送信後、結果待ち |
| Input | `input` | ユーザー入力中 |
| Send | `send` | 送信 / うなずきフィードバック |
| Success | `success` | タスク成功 |
| Failure | `failure` | タスク自体が失敗 |
| Warning | `warning` | 危険・破壊的な操作の確認 |
| Inspect | `inspect` | 結果の確認・検証 |
| Blocked | `blocked` | リクエストが拒否・停止された状態 |
| System error | `error` | 接続・サービス・システム障害 |
| Surprise | `surprise` | 予期しない結果 |
| Sleep | `sleep` | スリープへ移行 |
| Wake | `wake` | スリープから復帰 |

`failure` はタスク結果の失敗、`error` は接続・サービス・システム側の障害を表します。`waiting` は進行中の待機、`bored` はアクティブなタスクがない状態です。

セマンティックエイリアスも利用できます。

```js
avatar.play('failed');
avatar.play('fail');
avatar.play('verify');
avatar.play('review');
avatar.play('angry'); // blocked と同じ表情
avatar.play('policy-blocked');
avatar.play('system-error');
avatar.play('connection-error');
```

## 継続待機

```js
avatar.startWaiting();
// 結果が返ったら停止します。
avatar.stopWaiting();
```

別のアクションを再生した場合も waiting は解除されます。

## ポインター追従

```js
avatar.setPointerFollow(false);
avatar.setPointerFollow(true);
```

## 頭部の丸み

```js
avatar.setHeadRoundness(0);   // より角ばった形
avatar.setHeadRoundness(50);  // デフォルト
avatar.setHeadRoundness(100); // より丸い形

console.log(avatar.getHeadRoundness());
```

値は `0–100` に制限されます。変更時には `head-roundness-change` イベントが発火します。

```js
avatar.addEventListener('head-roundness-change', (event) => {
  console.log(event.detail.value);
});
```

## 状態イベント

表示状態が変化すると `face-state` イベントが発火します。

```js
avatar.addEventListener('face-state', (event) => {
  console.log(event.detail.state);
});
```

## 属性

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000">
</agent-robot-avatar>
```

| 属性 | 説明 |
| --- | --- |
| `size` | コンポーネントのサイズ（px） |
| `color` | アバターのメインカラー |
| `auto-sleep` | 自動スリープまでのアイドル時間（ms）。`0` で無効 |

## デフォルト動作

API を呼ばなくても、ランダムなまばたき、視線移動、近くのポインターへの追従、軽い慣性モーション、自然な idle 復帰、オプションの自動スリープが動作します。

## ドラッグ操作

ドラッグ時は頭全体を剛体として動かすのではなく、操作点の周辺が局所的に変形します。

- 強く外側へ引く：復帰後に `angry`
- 強く中心へ押す：復帰後に `success`
- 小さなドラッグ：変形のみ

## インタラクティブ Demo

`demo/index.html` には全公開状態、ポインター追従、ゼリー風ドラッグ、waiting ライフサイクル、頭部丸み調整、色・挙動設定、Agent 会話シミュレーションが含まれます。Demo 専用 JavaScript は `demo/` に分離され、再利用用 npm runtime には含まれません。

## プロジェクト構成

```text
agent-robot-avatar.js     公開コンポーネントのエントリ
src/                      再利用可能な runtime / 表情モジュール
demo/                     インタラクティブ Demo と専用スクリプト
examples/                 最小統合サンプル
assets/support/           支援 / 決済 QR アセット
docs/                     多言語ドキュメント
README.md                 英語メインドキュメント
CHANGELOG.md              公開リリース履歴
CONTRIBUTING.md           コントリビューションガイド
package.json              パッケージ情報
LICENSE                   MIT License
```

## 配布と互換性

パッケージは `agent-robot-avatar` として npm に公開され、アクション、イベント、公開メソッドの TypeScript 型定義を含みます。ES Modules、Custom Elements、SVG、Pointer Events、Web Animations API をサポートするモダンブラウザーを対象とします。

## コントリビューション

Issue と Pull Request を歓迎します。提出前に [`CONTRIBUTING.md`](../CONTRIBUTING.md) を確認してください。

## プロジェクトの状態

v0.2.0 は現在の公開バージョンです。v0.1.0 は最初の公開バージョンとして引き続き利用できます。将来の `1.0.0` に向けて慎重に進化できるよう、公開 API は意図的に小さく保っています。

Agent Robot Avatar は独立して開発されたオープンソースプロジェクトであり、特定の AI プラットフォームやブランドとは提携・公式承認関係にありません。

## License

MIT License。詳細は [`LICENSE`](../LICENSE) を参照してください。

## コーヒーで支援

このプロジェクトが役立った場合は、使いやすい方法で支援できます。

| Ko-fi | Alipay | WeChat Pay |
| --- | --- | --- |
| <a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a> | <img src="../assets/support/alipay.png" alt="Alipay QR code" width="160"> | <img src="../assets/support/wechat-pay.png" alt="WeChat Pay QR code" width="160"> |
