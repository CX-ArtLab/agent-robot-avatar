# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md)

![Version](https://img.shields.io/badge/version-v0.2.0-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square) ![14 Agent States](https://img.shields.io/badge/Agent%20states-14-8B5CF6?style=flat-square) ![Pointer Following](https://img.shields.io/badge/Pointer-following-00A67E?style=flat-square) ![Jelly Drag](https://img.shields.io/badge/Drag-jelly%20physics-FF69B4?style=flat-square)

一個輕量、富有表現力的機器人頭像 Web Component，可用於 AI Agent，也可用於其他需要互動回饋的應用。

Agent Robot Avatar 以 SVG 與原生 JavaScript 建構，不依賴第三方動畫框架。它作為原生自訂元素運作，並提供精簡 API 來控制表情、互動狀態、指標跟隨、等待回饋與頭部造型。

**目前公開版本：v0.2.0**

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar 互動動畫展示" width="560">
</p>

## 主要特色

- 純 SVG + 原生 JavaScript
- 原生 Web Component
- 無第三方動畫框架依賴
- 自動眨眼與細微隨機視線活動
- 滑鼠 / 指標跟隨與帶慣性的頭部運動
- 局部果凍式拖曳形變與彈性回彈
- 可由程式觸發的 Agent 狀態與表情
- 明確區分等待、失敗、警告、審視、內容阻止與系統錯誤
- 可調整頭部圓角
- 懸浮式天線，可選擇啟用狀態閃動
- Demo 與可重複使用的元件本體分離

## 快速開始

直接使用倉庫原始碼時，請讓根目錄的 `agent-robot-avatar.js` 與 `src/` 一起使用，並載入公開入口：

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

加入自訂元素：

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

元件載入後會自動進入預設待機狀態，不需要額外初始化。最小可執行範例位於 [`examples/basic.html`](../examples/basic.html)。

## 基本 API

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('failure');
avatar.play('warning');
avatar.play('inspect');
avatar.play('angry');
avatar.play('error');

avatar.reset();
```

## 狀態與表情

| 狀態 | API 名稱 | 典型用途 |
| --- | --- | --- |
| 預設待機 | `idle` | 正常待機 |
| 發呆 | `bored` | 長時間沒有任務或閒置 |
| 等待 | `waiting` | 請求已送出，等待結果 |
| 輸入中 | `input` | 使用者正在輸入 |
| 傳送 | `send` | 內容已送出 / 點頭回饋 |
| 成功 | `success` | 任務成功完成 |
| 失敗 | `failure` | 任務完成，但結果失敗 |
| 警告確認 | `warning` | 高風險或破壞性操作需要確認 |
| 審視 | `inspect` | 檢查、核對或驗證結果 |
| 內容阻止 | `angry` | 請求被阻止、不允許或無法繼續 |
| 系統錯誤 | `error` | 連線、服務或系統錯誤 |
| 驚訝 | `surprise` | 意外事件或結果 |
| 睡眠 | `sleep` | 進入睡眠 |
| 喚醒 | `wake` | 從睡眠恢復 |

`failure` 代表任務本身執行失敗；`error` 專門表示連線、服務或系統故障。`waiting` 是仍在等待已送出請求，而 `bored` 代表目前沒有活躍任務。

語意別名：

```js
avatar.play('failed');
avatar.play('fail');
avatar.play('verify');
avatar.play('review');
avatar.play('blocked');
avatar.play('policy-blocked');
avatar.play('system-error');
avatar.play('connection-error');
```

## 持續等待

```js
avatar.startWaiting();
// 收到回覆或結果後停止。
avatar.stopWaiting();
```

呼叫其他動作也會中斷目前等待狀態。

## 滑鼠跟隨

```js
avatar.setPointerFollow(false);
avatar.setPointerFollow(true);
```

## 頭部圓角

```js
avatar.setHeadRoundness(0);   // 更方
avatar.setHeadRoundness(50);  // 預設
avatar.setHeadRoundness(100); // 更圓

console.log(avatar.getHeadRoundness());
```

值會限制在 `0–100`。變更時會觸發 `head-roundness-change`：

```js
avatar.addEventListener('head-roundness-change', (event) => {
  console.log(event.detail.value);
});
```

## 狀態事件

視覺狀態變更時會觸發 `face-state`：

```js
avatar.addEventListener('face-state', (event) => {
  console.log(event.detail.state);
});
```

## 基礎屬性

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000">
</agent-robot-avatar>
```

| 屬性 | 說明 |
| --- | --- |
| `size` | 元件尺寸（像素） |
| `color` | 頭像主色 |
| `auto-sleep` | 閒置多久後自動睡眠（毫秒）；`0` 關閉自動睡眠 |

## 預設行為

即使不呼叫 API，頭像也會隨機眨眼、輕微移動視線、在指標靠近時自然跟隨、產生帶慣性的頭部運動，並可選擇自動睡眠。

## 拖曳互動

拖曳時，頭部會在受力位置附近局部變形，而不是整體剛性移動。

- 強力向外拉：回彈後觸發 `angry`
- 強力向中心推：回彈後觸發 `success`
- 小幅拖曳：只變形，不觸發表情

## 互動 Demo

`demo/index.html` 包含全部公開表情、指標跟隨、果凍拖曳、等待生命週期、頭部圓角調整、顏色 / 行為控制，以及模擬 Agent 對話。Demo 專用 JavaScript 全部集中在 `demo/`，不會進入可重複使用的 npm runtime。

## 專案結構

```text
agent-robot-avatar.js     正式元件入口
src/                      可重複使用的元件 runtime 與表情模組
demo/                     完整互動 Demo 與 Demo 專用程式
examples/                 最小整合範例
assets/support/           支持專案 / 付款 QR 圖片
docs/                     多語言文件
README.md                 英文主文件
CHANGELOG.md              正式版本記錄
CONTRIBUTING.md           貢獻指南
package.json              套件與發佈資訊
LICENSE                   MIT License
```

## 發佈與相容性

套件已以 `agent-robot-avatar` 名稱發佈至 npm，並內建動作、事件與公開方法的 TypeScript 型別宣告。元件面向支援 ES Modules、Custom Elements、SVG、Pointer Events 與 Web Animations API 的現代瀏覽器。

## 參與貢獻

歡迎 Issue 與 Pull Request。提交前請閱讀 [`CONTRIBUTING.md`](../CONTRIBUTING.md)。

## 專案狀態

v0.1.0 是第一個公開版本線。公開 API 目前刻意保持精簡，讓專案能在未來 `1.0.0` 穩定性承諾前持續謹慎演進。

Agent Robot Avatar 是獨立開發的開源專案，不隸屬、代表或獲得任何 AI 平台或品牌的官方背書。

## License

MIT License。詳見 [`LICENSE`](../LICENSE)。

## 請我喝杯咖啡

如果這個專案對你有幫助，也可以請我喝杯咖啡。選擇你方便的方式即可：

| Ko-fi | 支付寶 | 微信支付 |
| --- | --- | --- |
| <a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a> | <img src="../assets/support/alipay.png" alt="支付寶收款碼" width="160"> | <img src="../assets/support/wechat-pay.png" alt="微信支付收款碼" width="160"> |
