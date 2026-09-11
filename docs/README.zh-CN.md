# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.3.2-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

一个轻量、富表现力的机器人头像 Web Component，适用于 AI Agent 与交互式应用。

可用于 AI 助手、Agent 界面、桌面伙伴、虚拟宠物、数字吉祥物、聊天机器人头像及其他交互角色体验。

使用 SVG 与原生 JavaScript 构建，以原生 Custom Element 运行，运行时零依赖。

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar 交互动画演示" width="560">
</p>

## 在线 Demo

[打开交互 Demo](https://cx-artlab.github.io/agent-robot-avatar/?lang=zh-CN)

## 特点

- 原生 Web Component
- SVG 渲染 + 原生 JavaScript
- 运行时零依赖
- 自动眨眼与轻微待机动作
- 眼睛跟随指针与头部惯性运动
- 果冻式局部拖拽形变与弹性恢复
- 可通过程序控制 Agent 状态与表情
- 支持 waiting、success、failure、warning、review、blocked、system error 等反馈
- 支持减少动态效果
- 可配置自动睡眠行为
- 可调头部圆角
- 可选天线状态闪烁
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
avatar.play('warning');
avatar.play('error');

avatar.reset();
```

可用动作：

`idle` · `bored` · `waiting` · `input` · `send` · `success` · `failure` · `warning` · `inspect` · `blocked` · `error` · `surprise` · `sleep` · `wake`

`failure` 用于表示任务执行完成但结果失败；`error` 用于连接、服务或系统错误。

一个典型的 Agent 请求流程：

```js
avatar.startWaiting();

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('error');
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

常用运行时控制：

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setAntennaFlash(true);
```

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

**当前公开版本：v0.3.2**

公开 API 会在未来 `1.0.0` 稳定性承诺前继续保持精简并谨慎演进。

Agent Robot Avatar 为独立开发的开源项目，不隶属于、代表或获得任何 AI 平台或品牌的官方背书。

## 角色设计与视觉标识

Agent Robot Avatar 角色，包括机器人外观与视觉标识，均为 CX ArtLab 的原创设计。

MIT License 适用于软件和源代码，允许在应用中使用、修改和分发该头像，但不会转移 Agent Robot Avatar 名称、角色身份或视觉标识的所有权，也不授予将其作为其他方原创角色或独立品牌进行展示的权利。

本项目提及的第三方产品名称仅用于说明可能的使用场景，不代表任何关联或官方认可。

## License

MIT License。详见 [`LICENSE`](../LICENSE)。

---

如果这个项目对你有帮助，也可以请我喝杯咖啡：

| Ko-fi | 支付宝 | 微信支付 |
| --- | --- | --- |
| <a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a> | <img src="../assets/support/alipay.png" alt="支付宝收款码" width="160"> | <img src="../assets/support/wechat-pay.png" alt="微信支付收款码" width="160"> |