# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.6.0-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

AI Agent やインタラクティブなアプリケーション向けの、軽量で表情豊かなロボットアバター Web Component です。

AI アシスタント、Agent インターフェース、デスクトップコンパニオン、バーチャルペット、デジタルマスコット、チャットボットのアバターなど、さまざまなインタラクティブキャラクター体験に利用できます。

ChatGPT、Claude、Codex、Cursor、Grok Bot、Gemini CLI、OpenCode に似た製品や体験を含む、AI アシスタントおよび Agent インターフェースに適しています。

SVG と Vanilla JavaScript で構築され、ネイティブ Custom Element として動作し、ランタイム依存はありません。

Agent Robot Avatar は、AG-UI スタイルの Agent インターフェースにおける視覚的なフィードバック層としても利用できます。

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar インタラクティブアニメーションデモ" width="560">
</p>

## ライブデモ

[インタラクティブデモを開く](https://cx-artlab.github.io/agent-robot-avatar/?lang=ja)

## 特長

- ネイティブ Web Component
- SVG レンダリング + Vanilla JavaScript
- ランタイム依存なし
- 自動まばたきと控えめな idle 動作
- ポインター追従する目と慣性のある頭部モーション
- ゼリー風の局所ドラッグ変形と弾性復帰
- 長押しによる圧縮と、ドラッグ可能なばね式アンテナ
- Agent の状態や表情をプログラムから制御可能
- waiting、success、failure、affirm、wary、inspect、angry、refuse、love などの表情
- Reduced Motion 対応
- 設定可能なスリープ動作
- 頭部の丸みを調整可能
- TypeScript 型定義を同梱

## 組み込み向けの目（実験的）

独立した C++11 エンジンがメモリの動的確保なしで目だけを描画し、ロボットや開発ボードの画面で同じ 18 種類の表情を表示します。現在開発中で、まだリリースされていません。ファームウェア例は ESP32、ESP32-S3、RP2040 による 26 種類のボードと画面の組み合わせをカバーしています。すべて CI でコンパイルされていますが、実機ではまだ検証されていません。試した場合はハードウェアレポートを送ってください。

[組み込みガイド](https://github.com/CX-ArtLab/agent-robot-avatar/tree/main/embedded)をご覧ください。組み込みライブラリは Web Component とは独立しており、そのインストール方法や使い方は変わりません。

## インストール

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

リポジトリのソースを直接読み込むこともできます。

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

続いてコンポーネントを追加します。

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

初期化コードは不要です。アバターは自動的にデフォルトの idle 状態になります。

## 基本的な使い方

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('wary');
avatar.play('refuse');

avatar.reset();
```

利用可能なアクション：

| アクション | 見た目 | 使う場面 |
| --- | --- | --- |
| `idle` | まばたきし、あたりを見回す | デフォルト状態 |
| `bored` | ゆっくり左右を見る | しばらく何も起きていない |
| `waiting-spin` | 目が左右に回る | 返信待ち（デフォルト） |
| `waiting-wrap` | 目が片側から出て反対側から戻る | 返信待ち |
| `waiting-wave` | 目が交互に上下に揺れる | 返信待ち |
| `input` | 目が点滅する入力カーソルになる | ユーザーが入力中 |
| `affirm` | うなずく | 了解・確認 |
| `success` | うれしそうな笑顔の目 | タスク完了 |
| `failure` | 頭と目が下がる | タスクや接続の失敗 |
| `wary` | 首をかしげ、上下に見定める | ユーザーの確認が必要な操作 |
| `inspect` | 目を細めて上下にスキャンする | 内容の確認・レビュー |
| `angry` | 目を伏せてにらむ | コンテンツがブロックされた |
| `refuse` | 首を横に振る | できない、またはしない依頼 |
| `surprise` | 目を大きく見開く | 予想外のこと |
| `love` | 両目が鼓動するハートになる | 感謝・好意 |
| `random` | 目がスロットのリールのように回る | ランダムな選択、遊び心 |
| `sleep` | 目を閉じて眠る | 長時間操作がない |
| `wake` | 目を開けて起きる | 操作が再開した |

待機系のアクションは `play()` で 1 回再生されます。`startWaiting({ variant: 'spin' | 'wrap' | 'wave' })` は、別のアクションを再生するか `stopWaiting()` を呼ぶまでループします。

0.5 の旧名（`send`、`warning`、`error`、`blocked`、`slot` など）は 1.0 まで使えますが、コンソールに名前変更の通知が出ます。[移行表](../CHANGELOG.md#upgrading-from-05x)を参照してください。

典型的な Agent リクエストの流れ：

```js
avatar.startWaiting();

// 2 つ目の待機動作：目が片側へ抜け、反対側から戻ります。
avatar.startWaiting({ variant: 'wrap' });

// 3 つ目の待機モーション：時間差で上下する目の波。
avatar.startWaiting({ variant: 'wave' });

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('failure');
}
```

## よく使うオプション

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</agent-robot-avatar>
```

| 属性 | 用途 |
| --- | --- |
| `size` | アバターのサイズ（px） |
| `color` | アバターのメインカラー |
| `auto-sleep` | 自動スリープまでの待機時間。`0` で無効 |
| `wake-on` | 自動ウェイク方針：`activity`、`interaction`、`manual` |
| `motion` | モーション方針：`auto`、`reduce`、`full` |
| `press-squeeze` | 中央を長押しして圧縮。`false` で無効化 |
| `antenna-drag` | アンテナのドラッグ、ばね復帰、怒り反応。`false` で無効化 |

よく使うランタイム制御：

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setPressSqueeze(true);
avatar.setAntennaDrag(true);
```

中央の長押しで圧縮が始まり、4 CSS ピクセルを超えて動かすと、同じポインタージェスチャーが従来の頭部ドラッグへ切り替わります。アンテナには頭部ドラッグと同じ距離制限が適用され、復帰後に従来の怒り反応が続きます。

## イベントと統合

コンポーネントは視覚状態の変化を `face-state`、意味的なアクションライフサイクルの変化を `action-state` で通知します。

ホストアプリとの統合やアクセシビリティ向けステータステキストには `action-state` を推奨します。実行可能なリクエストライフサイクル例は [`examples/accessibility.html`](../examples/accessibility.html) を参照してください。

最小構成の統合例は [`examples/basic.html`](../examples/basic.html) にあります。

## 互換性

ES Modules、Custom Elements、SVG、Pointer Events、Web Animations API、`IntersectionObserver`、`ResizeObserver`、`matchMedia` をサポートするモダンブラウザ向けです。

自動ブラウザテストは Chromium、Firefox、WebKit を対象にしています。

## コントリビューション

Issue と Pull Request を歓迎します。変更を送る前に [`CONTRIBUTING.md`](../CONTRIBUTING.md) を確認してください。

## プロジェクト状況

**現在の公開バージョン：v0.6.0**

公開 API は、将来の `1.0.0` における安定性コミットメントに向けて、意図的にコンパクトなまま慎重に進化させています。

Agent Robot Avatar は独立して開発されたプロジェクトであり、いかなる AI プラットフォームやブランドとも提携・承認・公式な関係はありません。

## キャラクターデザインとビジュアルアイデンティティ

Agent Robot Avatar のキャラクター、ロボットの外観、ビジュアルアイデンティティは CX ArtLab によるオリジナルデザインです。

MIT License はソフトウェアとソースコードに適用されます。アプリケーションの一部としてアバターを使用・変更・配布できますが、Agent Robot Avatar の名称、キャラクターアイデンティティ、ビジュアルアイデンティティの所有権を移転するものではなく、他者のオリジナルキャラクターや独立ブランドとして提示する権利を付与するものでもありません。

本プロジェクト内で言及する第三者製品名は、想定される使用例を説明するためのものであり、提携や承認を示すものではありません。

## ライセンス

MIT License。詳しくは [`LICENSE`](../LICENSE) を参照してください。

---

このプロジェクトが役に立ったら、コーヒーを一杯ごちそうしていただけます。

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
