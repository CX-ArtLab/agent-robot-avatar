# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.3.2-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

一個輕量、富有表現力的機器人頭像 Web Component，適用於 AI Agent 與各類互動式應用。

適用於 AI 助理與 Agent 介面，包括類似 ChatGPT、Claude、Codex、Cursor、Grok Bot、Gemini CLI 和 OpenCode 的產品及互動體驗。

也可用於桌面寵物、虛擬寵物、桌面夥伴、數位吉祥物、聊天機器人頭像及其他互動式角色體驗。

Agent Robot Avatar 也可作為 AG-UI 風格 Agent 介面的視覺回饋層。

以 SVG 和原生 JavaScript 建構，作為原生自訂元素執行，無任何執行階段相依套件。

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar interactive animation demo" width="560">
</p>

## 線上展示

[開啟互動式展示](https://cx-artlab.github.io/agent-robot-avatar/)

## 主要特色

- 原生 Web Component
- SVG 渲染 + 原生 JavaScript
- 零執行階段相依套件
- 自動眨眼及細微待機動作
- 眼睛跟隨指標移動，頭部具有慣性動作效果
- 果凍式拖曳形變與彈性回復
- 可透過程式控制 Agent 狀態與表情
- 提供等待、成功、失敗、警告、審核、阻擋及系統錯誤回饋
- 支援減少動態效果
- 可設定睡眠行為
- 可調整頭部圓潤程度
- 可選擇開啟天線狀態閃爍
- 內附 TypeScript 型別宣告

## 安裝

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

也可以直接載入儲存庫中的原始碼：

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

`failure` 表示工作已執行但未成功；`error` 表示連線、服務或系統故障。

實際 Agent 請求生命週期範例：

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
| `size` | 頭像尺寸（像素） |
| `color` | 頭像主色 |
| `auto-sleep` | 自動睡眠前的閒置時間；`0` 表示停用 |
| `wake-on` | 自動喚醒策略：`activity`、`interaction` 或 `manual` |
| `motion` | 動態效果策略：`auto`、`reduce` 或 `full` |

常用執行階段控制方法：

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setAntennaFlash(true);
```

## 事件與整合

元件透過 `face-state` 通知視覺狀態變化，透過 `action-state` 通知具有語意的動作生命週期變化。

主應用程式整合和無障礙狀態文字建議使用 `action-state`。可執行的請求生命週期範例請參閱 [`examples/accessibility.html`](../examples/accessibility.html)。

最精簡的整合範例請參閱 [`examples/basic.html`](../examples/basic.html)。

## 相容性

適用於支援 ES Modules、Custom Elements、SVG、Pointer Events、Web Animations API、`IntersectionObserver`、`ResizeObserver` 與 `matchMedia` 的現代瀏覽器。

自動化瀏覽器測試涵蓋 Chromium、Firefox 和 WebKit。

## 參與貢獻

歡迎提交 Issue 與 Pull Request。提交變更前請先閱讀 [`CONTRIBUTING.md`](../CONTRIBUTING.md)。

## 專案狀態

**目前公開版本：v0.3.2**

專案持續演進，公開 API 目前刻意維持精簡，未來預計在 `1.0.0` 版本承諾穩定性。

Agent Robot Avatar 為獨立開發的專案，與任何 AI 平台或品牌均無從屬關係，也不代表其官方立場或獲得其背書。

## 角色設計與視覺識別

Agent Robot Avatar 的機器人角色造型與視覺識別由 CX ArtLab 原創設計。

MIT License 適用於軟體與原始碼，允許將頭像元件用於應用程式、修改及散布，但不移轉 Agent Robot Avatar 名稱、角色身分或視覺識別的所有權，也不授予將其宣稱為他人原創角色或獨立品牌的權利。

本專案提及的第三方產品名稱僅用於說明可能的使用情境，不代表與其存在關聯或獲得其認可。

## 授權條款

MIT License，詳見 [`LICENSE`](../LICENSE)。

---

如果這個專案對你有幫助，歡迎請我喝杯咖啡。

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
