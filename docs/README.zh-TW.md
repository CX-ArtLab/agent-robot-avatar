# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.7.0-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

一個輕量、富有表現力的機器人頭像 Web Component，適用於 AI Agent 與互動式應用。

可用於 AI 助理、Agent 介面、桌面夥伴、虛擬寵物、數位吉祥物、聊天機器人頭像，以及其他互動角色體驗。

適用於 AI 助理與 Agent 介面，包括類似 ChatGPT、Claude、Codex、Cursor、Grok Bot、Gemini CLI 與 OpenCode 的產品與體驗。

使用 SVG 與原生 JavaScript 建構，以原生 Custom Element 運作，執行階段零依賴。

Agent Robot Avatar 也可作為 AG-UI 風格 Agent 介面的視覺回饋層。

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar 互動動畫示範" width="560">
</p>

## 線上 Demo

[開啟互動 Demo](https://cx-artlab.github.io/agent-robot-avatar/?lang=zh-TW) · [逛逛皮膚美術館](https://cx-artlab.github.io/agent-robot-avatar/skins.html?lang=zh-TW)

## 特點

- 原生 Web Component
- SVG 渲染 + 原生 JavaScript
- 執行階段零依賴
- 自動眨眼與輕微待機動作
- 眼睛跟隨指標與頭部慣性移動
- 果凍式局部拖曳形變與彈性復原
- 按住擠壓與可拖曳的彈簧天線互動
- 可透過程式控制 Agent 狀態與表情
- 支援 waiting、success、failure、affirm、wary、inspect、angry、refuse、love 等表情回饋
- 支援減少動態效果
- 可設定自動睡眠行為
- 可調整頭部圓角
- 188 款編號皮膚，分 17 個系列，光線跟隨滑鼠
- 不含皮膚的精簡版，適合對大小特別在意的頁面
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

### 精簡版

如果頁面完全用不到皮膚，可以改用 `agent-robot-avatar/lite`，頭像和所有表情都一樣，只是不含任何皮膚程式：

```js
import 'agent-robot-avatar/lite';
```

精簡版會忽略 `skin` 屬性，並在主控台提示：皮膚需要使用完整版。

## 基本用法

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('wary');
avatar.play('refuse');

avatar.reset();
```

可用動作：

| 動作 | 樣子 | 適合的情境 |
| --- | --- | --- |
| `idle` | 眨眼、四處看看 | 預設狀態 |
| `bored` | 慢慢往兩邊張望 | 一段時間沒有動靜 |
| `waiting-spin` | 雙眼左右繞圈 | 等待回覆（預設） |
| `waiting-wrap` | 雙眼從一側轉出、另一側回來 | 等待回覆 |
| `waiting-wave` | 雙眼輪流上下起伏 | 等待回覆 |
| `input` | 雙眼變成閃爍的輸入游標 | 使用者正在輸入 |
| `affirm` | 點頭 | 收到、確認 |
| `success` | 開心的笑眼 | 任務完成 |
| `failure` | 低頭、眼睛下垂 | 任務或連線失敗 |
| `wary` | 側頭、上下打量 | 操作需要使用者確認 |
| `inspect` | 瞇眼上下掃視 | 檢查、審核內容 |
| `angry` | 壓低眼睛瞪著 | 內容被攔截 |
| `refuse` | 搖頭 | 做不到或不願做 |
| `surprise` | 睜大眼睛 | 出乎意料 |
| `love` | 雙眼合成跳動的愛心 | 感謝、喜歡 |
| `random` | 雙眼像老虎機一樣滾動 | 隨機抽取、逗趣 |
| `sleep` | 閉眼睡覺 | 長時間無操作 |
| `wake` | 睜眼醒來 | 重新有動靜 |

等待類動作用 `play()` 播放一輪；用 `startWaiting({ variant: 'spin' | 'wrap' | 'wave' })` 會一直循環，直到播放其他動作或呼叫 `stopWaiting()`。

0.5 版的舊名字（`send`、`warning`、`error`、`blocked`、`slot` 等）在 1.0 之前仍可使用，但會在主控台提示改名，詳見[升級對照表](../CHANGELOG.md#upgrading-from-05x)。

典型的 Agent 請求流程：

```js
avatar.startWaiting();

// 第二種等待：眼睛從一側轉出，再從另一側轉入。
avatar.startWaiting({ variant: 'wrap' });

// 第三種等待動作：雙眼錯開節奏上下起伏。
avatar.startWaiting({ variant: 'wave' });

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('failure');
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
| `press-squeeze` | 按住頭像中心進行擠壓；設為 `false` 可關閉 |
| `antenna-drag` | 拖曳天線、彈簧復原並接憤怒表情；設為 `false` 可關閉 |
| `skin` | 皮膚編號，例如 `301`；不寫則為純色 |

常用執行階段控制：

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setPressSqueeze(true);
avatar.setAntennaDrag(true);
```

按住頭像中心會開始擠壓；移動超過 4 個 CSS 像素後，同一次指標操作會切換為原有的頭部拖曳。拖曳天線沿用頭部拖曳的距離限制，復原後接原有的憤怒反應。

## 皮膚 · 0.7 新功能

共 188 款皮膚，分 17 個系列，光線會跟隨滑鼠。每款皮膚都有固定編號：前面是系列號，後兩位是系列內序號，例如 305 是第 3 個系列的第 5 款。名稱日後可能調整，編號永遠不變，也不會重複使用。

所有皮膚仍然是純 SVG 繪製，沒有使用圖片、Canvas 或 WebGL。

<img src="../assets/readme/skin-gallery.jpg" alt="皮膚美術館：精選皮膚、分類篩選與搜尋" width="100%">

```html
<agent-robot-avatar skin="301"></agent-robot-avatar>
```

```js
avatar.setSkin(102);  // 也可以寫 '102'
avatar.setSkin(null); // 回到純色
```

所有皮膚及編號請見[全部皮膚頁](https://cx-artlab.github.io/agent-robot-avatar/materials/?lang=zh-TW)。

| 系列 | 編號 |
| --- | --- |
| 彩色玻璃 | 101–106 |
| 淡彩玻璃 | 201–206 |
| 軟糖 | 301–312 |
| 糖果玻璃 | 401–406 |
| 壓克力 | 501–512 |
| 果凍 | 601–612 |
| 漸層 | 701–712 |
| 磨砂玻璃 | 801–806 |
| 磨砂金屬 | 901–930 |
| 寶石與陶瓷 | 1001–1012 |
| 木 | 1101–1106 |
| 球類 | 1201–1210 |
| 透明與流光 | 1301–1305 |
| 織物與皮革 | 1401–1412 |
| 甜點與水果 | 1501–1512 |
| 自然 | 1601–1612 |
| 圖案與科技 | 1701–1717 |

皮膚的繪製程式在第一次用到皮膚時才下載，不用皮膚的頁面完全不載入。`await loadSkins()` 可以提前載入。`SKINS` 提供每款皮膚的中英文名稱與顏色，`SKIN_SERIES` 提供系列，`SKIN_NAMES` 提供全部編號。

所有表情和手勢都能搭配皮膚使用。移除皮膚後，`color` 屬性會重新生效。

## 事件與整合

元件透過 `face-state` 回報視覺狀態變化，透過 `action-state` 回報語意動作生命週期變化。

宿主應用整合與無障礙狀態播報建議優先使用 `action-state`。可查看 [`examples/accessibility.html`](../examples/accessibility.html) 中的請求生命週期範例。

最小整合範例位於 [`examples/basic.html`](../examples/basic.html)。

## 相容性

面向支援 ES Modules、Custom Elements、SVG、Pointer Events、Web Animations API、`IntersectionObserver`、`ResizeObserver` 和 `matchMedia` 的現代瀏覽器。

自動瀏覽器測試涵蓋 Chromium、Firefox 和 WebKit。

## 硬體表情版（開發中）

在機器人和開發板螢幕上顯示表情的 C++ 版本（只畫眼睛）正在開發中，尚未發布。詳見[硬體接入說明](https://github.com/CX-ArtLab/agent-robot-avatar/tree/main/embedded)。

## 參與貢獻

歡迎提交 Issue 和 Pull Request。提交修改前請閱讀 [`CONTRIBUTING.md`](../CONTRIBUTING.md)。

## 專案狀態

**目前公開版本：v0.6.0**

公開 API 會在未來 `1.0.0` 穩定性承諾前繼續保持精簡並謹慎演進。

Agent Robot Avatar 為獨立開發的開源專案，不隸屬、代表或獲得任何 AI 平台或品牌的官方背書。

## 角色設計與視覺識別

Agent Robot Avatar 角色，包括機器人外觀與視覺識別，均為 CX ArtLab 的原創設計。

MIT License 適用於軟體和原始碼，允許在應用中使用、修改和散布該頭像，但不會轉移 Agent Robot Avatar 名稱、角色身分或視覺識別的所有權，也不授予將其作為其他方原創角色或獨立品牌展示的權利。

本專案提及的第三方產品名稱僅用於說明可能的使用情境，不代表任何關聯或官方認可。

## 授權條款

MIT License。詳見 [`LICENSE`](../LICENSE)。

---

## 請我喝杯咖啡

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
