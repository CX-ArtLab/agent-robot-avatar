# BoopFace

<p align="center">
  <img src="../assets/readme/boopface-header.jpg" alt="BoopFace：AI ボット、エージェント、インタラクティブなアプリのための、軽量で表情豊かなロボットアバターコンポーネント">
</p>

[English](https://github.com/CX-ArtLab/boopface/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.8.0-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/boopface/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/boopface/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

BoopFace は、AI ボット、エージェント、インタラクティブなアプリのための、軽量で表情豊かなロボットアバターコンポーネントです。考え中、待機中、完了、エラー。エージェントのあらゆる状態を表情で伝えられます。

AI アシスタントやエージェントの顔と状態表示に使えます。ChatGPT、Claude、Gemini、Grok、DeepSeek のようなチャットアシスタント、Codex、Claude Code、Cursor、Gemini CLI、OpenCode のようなコーディングエージェント、Grok Bot、ChatGPT dots、Meta Muse、OpenClaw、Hermes Agent のような常駐型エージェントに向いています。

デスクトップコンパニオン、バーチャルペット、デジタルマスコット、チャットボットのアバターなどのインタラクティブなキャラクターや、AG-UI スタイルのエージェント UI の視覚フィードバック層としても使えます。

SVG と素の JavaScript で作られたネイティブ Web Component で、実行時の依存関係はゼロ、MIT ライセンスです。188 種類の[スキン](#スキン--07-の新機能)にいつでも着せ替えられます。

<p align="center">
  <img src="../assets/demo/boopface-demo.gif" alt="BoopFace インタラクティブアニメーションデモ" width="560">
</p>

## ライブデモ

[インタラクティブデモを開く](https://cx-artlab.github.io/boopface/?lang=ja) · [スキンギャラリーを見る](https://cx-artlab.github.io/boopface/skins.html?lang=ja)

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
- 17 シリーズ・188 種類の番号付きスキン。光はポインターを追います
- スキンを含まない軽量版も用意
- TypeScript 型定義を同梱

## インストール

```bash
npm install boopface
```

```js
import 'boopface';
```

または[最新リリース](https://github.com/CX-ArtLab/boopface/releases/latest)から `boopface-x.y.z.zip` をダウンロードします。中身はコンポーネントだけ（スキンを含む）です。ページと同じ場所に展開してください。

```html
<script type="module" src="./boopface/boopface.js"></script>
```

続いてコンポーネントを追加します。

```html
<boop-face id="avatar"></boop-face>
```

初期化コードは不要です。アバターは自動的にデフォルトの idle 状態になります。

### Agent Robot Avatar からのアップグレード

BoopFace は 0.8 より前は Agent Robot Avatar という名前でした。機能も使い方も変わりません。パッケージ名を `boopface` に変えるだけでアップグレードできます：

```bash
npm uninstall agent-robot-avatar
npm install boopface
```

古いタグ `<agent-robot-avatar>` は 1.0 まで引き続き使えるので、ページを急いで書き換える必要はありません。古い npm パッケージ `agent-robot-avatar` は今後更新されず、新しいバージョンは `boopface` としてのみ公開されます。

### 軽量版

スキンを使わないページでは `boopface/lite` を使えます。アバターとすべての表情は同じで、スキンのコードだけを含みません：

```js
import 'boopface/lite';
```

軽量版では `skin` 属性は無視され、スキンにはフル版が必要だとコンソールに表示されます。

サイズ比較（ネットワーク転送量、gzip 圧縮後）：

| 版 | サイズ |
| --- | --- |
| 軽量版 `boopface/lite` | 約 45 KB |
| フル版、ページでスキンを使わない | 約 56 KB。スキンの描画コードはダウンロードされません |
| フル版、スキンを使う | 約 113 KB。増えた分は最初にスキンを使ったときにダウンロードされます |

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
<boop-face
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</boop-face>
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
| `skin` | スキン番号（例：`301`）。省略すると単色 |

よく使うランタイム制御：

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setPressSqueeze(true);
avatar.setAntennaDrag(true);
```

中央の長押しで圧縮が始まり、4 CSS ピクセルを超えて動かすと、同じポインタージェスチャーが従来の頭部ドラッグへ切り替わります。アンテナには頭部ドラッグと同じ距離制限が適用され、復帰後に従来の怒り反応が続きます。

## スキン · 0.7 の新機能

17 シリーズ・188 種類のスキン。光はポインターを追いかけます。各スキンの番号は固定です：シリーズ番号のあとに 2 桁が続き、305 はシリーズ 3 の 5 番目です。名前は今後変わることがありますが、番号は変わらず、再利用もされません。

スキンもすべて純粋な SVG で描かれており、画像・Canvas・WebGL は使っていません。全スキン合わせても通信量は約 70 KB（非圧縮で約 290 KB）で、その大部分はページがスキンを使うときにだけ読み込まれます。比較として、アバター本体（スキンを含まない lite 版）は約 45 KB です。

<img src="../assets/readme/skin-gallery.jpg" alt="スキンギャラリー：おすすめ、絞り込み、検索" width="100%">

```html
<boop-face skin="301"></boop-face>
```

```js
avatar.setSkin(102);  // '102' でも可
avatar.setSkin(null); // 単色に戻す
```

すべてのスキンと番号は[スキン一覧ページ](https://cx-artlab.github.io/boopface/materials/?lang=ja)で確認できます。

| シリーズ | 番号 | シリーズ | 番号 | シリーズ | 番号 |
| --- | --- | --- | --- | --- | --- |
| グレーズ | 101–106 | アイスガラス | 201–206 | グミ | 301–312 |
| キャンディガラス | 401–406 | アクリル | 501–512 | ゼリー | 601–612 |
| グラデーション | 701–712 | すりガラス | 801–806 | メタル | 901–930 |
| 宝石と陶磁器 | 1001–1012 | 木 | 1101–1106 | ボール | 1201–1210 |
| 透明・きらめき | 1301–1305 | 布と革 | 1401–1412 | スイーツとフルーツ | 1501–1512 |
| 自然 | 1601–1612 | 柄とテック | 1701–1717 |  |  |

スキンの描画コードは初めてスキンを使うときに読み込まれ、スキンを使わないページでは読み込まれません。`await loadSkins()` で事前に読み込めます。`SKINS` は各スキンの中国語・英語名と色、`SKIN_SERIES` はシリーズ、`SKIN_NAMES` は全番号です。

すべての表情とジェスチャーはスキンと一緒に使えます。スキンを外すと `color` 属性が再び適用されます。

## イベントと統合

コンポーネントは視覚状態の変化を `face-state`、意味的なアクションライフサイクルの変化を `action-state` で通知します。

ホストアプリとの統合やアクセシビリティ向けステータステキストには `action-state` を推奨します。実行可能なリクエストライフサイクル例は [`examples/accessibility.html`](../examples/accessibility.html) を参照してください。

最小構成の統合例は [`examples/basic.html`](../examples/basic.html) にあります。

## 互換性

ES Modules、Custom Elements、SVG、Pointer Events、Web Animations API、`IntersectionObserver`、`ResizeObserver`、`matchMedia` をサポートするモダンブラウザ向けです。

自動ブラウザテストは Chromium、Firefox、WebKit を対象にしています。

## BoopFace Embedded（開発中）

ロボットや開発ボードの画面にアバターの表情を表示する C++ 版（目だけを描画）を開発中です。まだリリースされていません。[ハードウェアガイド](https://github.com/CX-ArtLab/boopface/tree/main/embedded)をご覧ください。

## コントリビューション

Issue と Pull Request を歓迎します。変更を送る前に [`CONTRIBUTING.md`](../CONTRIBUTING.md) を確認してください。

## プロジェクト状況

**現在の公開バージョン：v0.8.0**

公開 API は、将来の `1.0.0` における安定性コミットメントに向けて、意図的にコンパクトなまま慎重に進化させています。

BoopFace は独立して開発されたプロジェクトであり、いかなる AI プラットフォームやブランドとも提携・承認・公式な関係はありません。

## キャラクターデザインとビジュアルアイデンティティ

BoopFace のキャラクター、ロボットの外観、ビジュアルアイデンティティは CX ArtLab によるオリジナルデザインです。

MIT License はソフトウェアとソースコードに適用されます。アプリケーションの一部としてアバターを使用・変更・配布できますが、BoopFace の名称、キャラクターアイデンティティ、ビジュアルアイデンティティの所有権を移転するものではなく、他者のオリジナルキャラクターや独立ブランドとして提示する権利を付与するものでもありません。

本プロジェクト内で言及する第三者製品名は、想定される使用例を説明するためのものであり、提携や承認を示すものではありません。

## ライセンス

MIT License。詳しくは [`LICENSE`](../LICENSE) を参照してください。

---

このプロジェクトが役に立ったら、コーヒーを一杯ごちそうしていただけます。

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
