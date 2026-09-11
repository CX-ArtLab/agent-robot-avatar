# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.3.2-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

一個輕量、富有表現力的機器人頭像 Web Component，適用於 AI Agent 與互動式應用。

可用於 AI 助理、Agent 介面、桌面夥伴、虛擬寵物、數位吉祥物、聊天機器人頭像，以及其他互動角色體驗。

使用 SVG 與原生 JavaScript 建構，以原生 Custom Element 運作，執行階段零依賴。

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar 互動動畫示範" width="560">
</p>

## 線上 Demo

[開啟互動 Demo](https://cx-artlab.github.io/agent-robot-avatar/?lang=zh-TW)

## 特點

- 原生 Web Component
- SVG 渲染 + 原生 JavaScript
- 執行階段零依賴
- 自動眨眼與輕微待機動作
- 眼睛跟隨指標與頭部慣性移動
- 果凍式局部拖曳形變與彈性復原
- 可透過程式控制 Agent 狀態與表情
- 支援 waiting、success、failure、warning、review、blocked、system error 等回饋
- 支援減少動態效果
- 可設定自動睡眠行為
- 可調整頭部圓角
- 可選天線狀態閃爍
- 內含 TypeScript 型別宣告

## 安裝

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

也可以直接載入儲存庫原始碼：

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

接著加入元件：

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

不需要初始化程式碼，頭像會自動進入預設待機狀態。

## 基本用法

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('warning');
avatar.play('error');

avatar.reset();
```

可用動作：

`idle` · `bored` · `waiting` · `input` · `send` · `success` · `failure` · `warning` · `inspect` · `blocked` · `error` · `surprise` · `sleep` · `wake`

`failure` 用於表示任務執行完成但結果失敗；`error` 用於連線、服務或系統錯誤。

典型的 Agent 請求流程：

```js
avatar.startWaiting();

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('error');
}
```

## 常用選項

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</agent-robot-avatar>
```

| 屬性 | 用途 |
| --- | --- |
| `size` | 頭像像素尺寸 |
| `color` | 頭像主色 |
| `auto-sleep` | 自動睡眠前的閒置時間；`0` 為關閉 |
| `wake-on` | 自動喚醒策略：`activity`、`interaction` 或 `manual` |
| `motion` | 動態效果策略：`auto`、`reduce` 或 `full` |

常用執行階段控制：

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setAntennaFlash(true);
```

## 事件與整合

元件透過 `face-state` 回報視覺狀態變化，透過 `action-state` 回報語意動作生命週期變化。

宿主應用整合與無障礙狀態播報建議優先使用 `action-state`。可查看 [`examples/accessibility.html`](../examples/accessibility.html) 中的請求生命週期範例。

最小整合範例位於 [`examples/basic.html`](../examples/basic.html)。

## 相容性

面向支援 ES Modules、Custom Elements、SVG、Pointer Events、Web Animations API、`IntersectionObserver`、`ResizeObserver` 和 `matchMedia` 的現代瀏覽器。

自動瀏覽器測試涵蓋 Chromium、Firefox 和 WebKit。

## 參與貢獻

歡迎提交 Issue 和 Pull Request。提交修改前請閱讀 [`CONTRIBUTING.md`](../CONTRIBUTING.md)。

## 專案狀態

**目前公開版本：v0.3.2**

公開 API 會在未來 `1.0.0` 穩定性承諾前繼續保持精簡並謹慎演進。

Agent Robot Avatar 為獨立開發的開源專案，不隸屬、代表或獲得任何 AI 平台或品牌的官方背書。

## 角色設計與視覺識別

Agent Robot Avatar 角色，包括機器人外觀與視覺識別，均為 CX ArtLab 的原創設計。

MIT License 適用於軟體和原始碼，允許在應用中使用、修改和散布該頭像，但不會轉移 Agent Robot Avatar 名稱、角色身分或視覺識別的所有權，也不授予將其作為其他方原創角色或獨立品牌展示的權利。

本專案提及的第三方產品名稱僅用於說明可能的使用情境，不代表任何關聯或官方認可。

## License

MIT License。詳見 [`LICENSE`](../LICENSE)。

---

如果這個專案對你有幫助，也可以請我喝杯咖啡。

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>