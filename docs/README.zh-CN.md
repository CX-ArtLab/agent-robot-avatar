# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.6.0-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

一个轻量、富表现力的机器人头像 Web Component，适用于 AI Agent 与交互式应用。

可用于 AI 助手、Agent 界面、桌面伙伴、虚拟宠物、数字吉祥物、聊天机器人头像及其他交互角色体验。

可用于 AI 助手、Agent 界面，包括类似 ChatGPT、Claude、Codex、Cursor、Grok Bot、Gemini CLI 和 OpenCode 的产品与体验。

使用 SVG 与原生 JavaScript 构建，以原生 Custom Element 运行，运行时零依赖。

Agent Robot Avatar 还可作为 AG-UI 风格 Agent 界面的视觉反馈层。

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar 交互动画演示" width="560">
</p>

## 嵌入式眼睛版本（实验性）

独立的 C++11 眼睛表情核心，在机器人和开发板的屏幕上画出同样的 18 种表情。固件示例覆盖 26 种开发板与屏幕组合（ESP32、ESP32-S3、RP2040；ST7789、ST7735、GC9A01 圆屏、ILI9341/9342/9488、CO5300 AMOLED、ST7701S RGB 屏、SSD1306/SH1106 OLED，含 LilyGO、M5Stack、微雪、Seeed、乐鑫等开发板）。目前仍在开发中，尚未正式发布。所有示例都在 CI 中编译通过，尚未实机验证；如果你在实物上试过，欢迎提交实机验证报告。

[查看硬件接入说明](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/embedded/README.zh-CN.md)。嵌入式库与 Web 组件相互独立，不影响 Web 组件的安装和使用。

## 在线 Demo

[打开交互 Demo](https://cx-artlab.github.io/agent-robot-avatar/?lang=zh-CN)

## 特点

- 原生 Web Component
- SVG 渲染 + 原生 JavaScript
- 运行时零依赖
- 自动眨眼与轻微待机动作
- 眼睛跟随指针与头部惯性运动
- 果冻式局部拖拽形变与弹性恢复
- 按住挤压与可拖动的弹簧天线交互
- 可通过程序控制 Agent 状态与表情
- 支持 waiting、success、failure、affirm、wary、inspect、angry、refuse、love 等表情反馈
- 支持减少动态效果
- 可配置自动睡眠行为
- 可调头部圆角
- 内置 TypeScript 类型声明

## 安装

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

也可以直接加载仓库源码：

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

然后添加组件：

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

无需初始化代码，头像会自动进入默认待机状态。

## 基础用法

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('wary');
avatar.play('refuse');

avatar.reset();
```

可用动作：

`idle` · `bored` · `waiting-spin` · `waiting-wrap` · `waiting-wave` · `input` · `affirm` · `success` · `failure` · `wary` · `inspect` · `angry` · `refuse` · `surprise` · `love` · `random` · `sleep` · `wake`

`waiting-wave`（等待 · 波动）：双眼错开节奏上下起伏，每轮周期 1.1 秒、振幅 10 SVG 单位。`play('waiting-wave')` 连续播放三轮并回正；`startWaiting({ variant: 'wave' })` 持续循环，直到被其他动作替换或调用 `stopWaiting()`。支持减少动态效果设置，动作生命周期事件统一使用 `waiting`。

动作名描述的是头像做出的样子：`refuse` 是摇头，用于 Agent 不能或不会执行某个请求；`failure` 用于任务或连接没有成功；`wary` 是侧头、上下打量的警惕眼神，用于需要用户确认的操作。0.5 版的旧名字（`send`、`warning`、`error`、`blocked` 等）在 1.0 之前仍可使用，但会在控制台提示改名，详见[升级对照表](../CHANGELOG.md#upgrading-from-05x)。

`love` 用于表达喜欢或感谢：两只眼睛向中间靠拢合成一颗爱心，跳动三下后恢复。

`random` 播放老虎机式的转动：两只眼睛各自在滚筒上滚动，随后左眼减速、弹跳着停下，右眼稍后停下。`slot` 是它的别名。

一个典型的 Agent 请求流程：

```js
avatar.startWaiting();

// 第二种等待：眼睛从一侧转出，再从另一侧转入。
avatar.startWaiting({ variant: 'wrap' });

// 另一种等待动作：双眼错开节奏上下波动。
avatar.startWaiting({ variant: 'wave' });

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('failure');
}
```

## 常用选项

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
| `size` | 头像像素尺寸 |
| `color` | 头像主色 |
| `auto-sleep` | 自动睡眠前的空闲时间；`0` 为关闭 |
| `wake-on` | 自动唤醒策略：`activity`、`interaction` 或 `manual` |
| `motion` | 动态效果策略：`auto`、`reduce` 或 `full` |
| `press-squeeze` | 按住头像中心进行挤压；设为 `false` 可关闭 |
| `antenna-drag` | 拖动天线、弹簧复原并接愤怒表情；设为 `false` 可关闭 |

常用运行时控制：

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setPressSqueeze(true);
avatar.setAntennaDrag(true);
```

按住头像中心会开始挤压；移动超过 4 个 CSS 像素后，同一次指针操作会切换为原有的头部拖动。拖动天线沿用头部拖动的距离限制，复原后接原有的愤怒反应。

## 事件与集成

组件通过 `face-state` 报告视觉状态变化，通过 `action-state` 报告语义动作生命周期变化。

宿主应用集成和无障碍状态播报优先使用 `action-state`。可查看 [`examples/accessibility.html`](../examples/accessibility.html) 中的请求生命周期示例。

最小集成示例位于 [`examples/basic.html`](../examples/basic.html)。

## 兼容性

面向支持 ES Modules、Custom Elements、SVG、Pointer Events、Web Animations API、`IntersectionObserver`、`ResizeObserver` 和 `matchMedia` 的现代浏览器。

自动浏览器测试覆盖 Chromium、Firefox 和 WebKit。

## 参与贡献

欢迎提交 Issue 和 Pull Request。提交修改前请阅读 [`CONTRIBUTING.md`](../CONTRIBUTING.md)。

## 项目状态

**当前公开版本：v0.6.0**

公开 API 会在未来 `1.0.0` 稳定性承诺前继续保持精简并谨慎演进。

Agent Robot Avatar 为独立开发的开源项目，不隶属于、代表或获得任何 AI 平台或品牌的官方背书。

## 角色设计与视觉标识

Agent Robot Avatar 角色，包括机器人外观与视觉标识，均为 CX ArtLab 的原创设计。

MIT License 适用于软件和源代码，允许在应用中使用、修改和分发该头像，但不会转移 Agent Robot Avatar 名称、角色身份或视觉标识的所有权，也不授予将其作为其他方原创角色或独立品牌进行展示的权利。

本项目提及的第三方产品名称仅用于说明可能的使用场景，不代表任何关联或官方认可。

## 许可证

MIT License。详见 [`LICENSE`](../LICENSE)。

---

## 请我喝杯咖啡

如果这个项目对你有帮助，也可以请我喝杯咖啡：

| Ko-fi | 支付宝 | 微信支付 |
| --- | --- | --- |
| <a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a> | <img src="../assets/support/alipay.png" alt="支付宝收款码" width="160"> | <img src="../assets/support/wechat-pay.png" alt="微信支付收款码" width="160"> |


