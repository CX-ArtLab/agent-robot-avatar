# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.3.2-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

AI Agent とインタラクティブなアプリ向けの、軽量で表情豊かなロボットアバター Web Component です。

ChatGPT、Claude、Codex、Cursor、Grok Bot、Gemini CLI、OpenCode に類する製品を含め、AI アシスタントや Agent のインターフェースに利用できます。

デスクトップペット、バーチャルペット、デジタルマスコット、チャットボットのアバターなどにも利用できます。

AG-UI スタイルの Agent インターフェースにおける視覚的なフィードバックレイヤーとしても使用できます。

SVG と標準 JavaScript で構築されたネイティブなカスタム要素で、実行時の依存パッケージはありません。

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar interactive animation demo" width="560">
</p>

## ライブデモ

[インタラクティブデモを開く](https://cx-artlab.github.io/agent-robot-avatar/)

## 主な特長

- ネイティブ Web Component
- SVG レンダリング + 標準 JavaScript
- 実行時の依存パッケージなし
- 自動まばたきと控えめな待機動作
- ポインターを追う目と慣性のある頭部の動き
- ゼリーのようなドラッグ変形と弾性的な復元
- プログラムから制御できる Agent の状態と表情
- 待機、成功、失敗、警告、レビュー、ブロック、システムエラーを視覚的に通知
- 動きを抑える設定に対応
- スリープ動作を設定可能
- 頭部の丸みを調整可能
- アンテナの状態点滅を任意で有効化
- TypeScript 型定義を同梱

## インストール

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

リポジトリのソースを直接読み込むこともできます：

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

次にコンポーネントを追加します：

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

初期化コードは不要です。アバターは自動的に標準の待機動作を開始します。

## 基本的な使い方

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('warning');
avatar.play('error');

avatar.reset();
```

使用できるアクション：

`idle` · `bored` · `waiting` · `input` · `send` · `success` · `failure` · `warning` · `inspect` · `blocked` · `error` · `surprise` · `sleep` · `wake`

`failure` はタスクが正常に完了しなかった場合、`error` は接続・サービス・システムの障害を表します。

実際の Agent リクエストのライフサイクルでは、次のように使用します：

```js
avatar.startWaiting();

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('error');
}
```

## 主なオプション

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</agent-robot-avatar>
```

| 属性 | 説明 |
| --- | --- |
| `size` | アバターのサイズ（ピクセル） |
| `color` | アバターのメインカラー |
| `auto-sleep` | 自動スリープまでのアイドル時間。`0` で無効化 |
| `wake-on` | 自動復帰ポリシー：`activity`、`interaction`、`manual` |
| `motion` | モーションポリシー：`auto`、`reduce`、`full` |

よく使う実行時の制御：

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setAntennaFlash(true);
```

## イベントと連携

コンポーネントは、見た目の状態変化を `face-state`、意味を持つアクションのライフサイクル変化を `action-state` で通知します。

ホストアプリとの連携やアクセシビリティ向けの状態テキストには `action-state` を推奨します。リクエストのライフサイクルを扱う実行可能な例は [`examples/accessibility.html`](../examples/accessibility.html) を参照してください。

最小限の連携例は [`examples/basic.html`](../examples/basic.html) にあります。

## 対応環境

ES Modules、Custom Elements、SVG、Pointer Events、Web Animations API、`IntersectionObserver`、`ResizeObserver`、`matchMedia` に対応したモダンブラウザー向けです。

自動ブラウザーテストは Chromium、Firefox、WebKit を対象としています。

## コントリビューション

Issue や Pull Request を歓迎します。変更を提出する前に [`CONTRIBUTING.md`](../CONTRIBUTING.md) をご確認ください。

## プロジェクトの状況

**現在の公開バージョン：v0.3.2**

将来の `1.0.0` で安定性を約束するまで、公開 API は意図的に小さく保ちながら開発を進めています。

Agent Robot Avatar は独立して開発されており、いかなる AI プラットフォームやブランドとも提携・関係せず、それらを代表するものでも、承認を受けたものでもありません。

## キャラクターデザインとビジュアルアイデンティティ

Agent Robot Avatar のロボットの外観およびビジュアルアイデンティティは、CX ArtLab によるオリジナルデザインです。

MIT License はソフトウェアとソースコードに適用されます。アプリケーション内でアバターを使用・改変・配布できますが、Agent Robot Avatar の名称、キャラクターとしての同一性、ビジュアルアイデンティティの所有権が移転することはなく、他者のオリジナルキャラクターや独立したブランドとして表示する権利も付与されません。

本プロジェクトで言及する第三者の製品名は利用例を示すためのものであり、提携や承認を意味しません。

## ライセンス

MIT License。詳細は [`LICENSE`](../LICENSE) を参照してください。

---

このプロジェクトが役に立った場合は、コーヒーをご支援いただけます。

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
