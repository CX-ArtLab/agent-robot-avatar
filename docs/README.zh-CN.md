# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.3.2-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

一个轻量、富表现力的机器人头像 Web Component，适用于 AI Agent 与交互式应用。

适用于 AI 助手和 Agent 界面，包括类似 ChatGPT、Claude、Codex、Cursor、Grok Bot、Gemini CLI 与 OpenCode 的产品和交互体验。

也可用于桌面宠物、虚拟宠物、桌面伙伴、数字吉祥物、聊天机器人头像等交互式角色体验。

Agent Robot Avatar 也可作为 AG-UI 风格 Agent 界面的视觉反馈层。

基于 SVG 和原生 JavaScript 构建，作为原生自定义元素运行，运行时零依赖。

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar interactive animation demo" width="560">
</p>

## 在线演示

[打开交互式演示](https://cx-artlab.github.io/agent-robot-avatar/)

## 主要特点

- 原生 Web Component
- SVG 渲染 + 原生 JavaScript
- 零运行时依赖
- 自动眨眼与细微待机动作
- 眼睛跟随指针移动，头部具有惯性运动效果
- 果冻式拖拽形变和弹性回弹
- 通过程序控制 Agent 状态与表情
- 提供等待、成功、失败、警告、审核、阻止及系统错误反馈
- 支持减少动态效果
- 可配置睡眠行为
- 可调节头部圆润程度
- 可选的天线状态闪烁
- 内置 TypeScript 类型声明

## 安装

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

也可直接加载仓库源文件：

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

然后添加组件：

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

无需初始化代码，头像会自动进入默认待机状态。

## 基本用法

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('warning');
avatar.play('error');

avatar.reset();
```

可用动作：

`idle` · `bored` · `waiting` · `input` · `send` · `success` · `failure` · `warning` · `inspect` · `blocked` · `error` · `surprise` · `sleep` · `wake`

`failure` 表示任务执行完成但结果失败；`error` 表示连接、服务或系统故障。

实际 Agent 请求生命周期的示例：

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
| `size` | 头像尺寸（像素） |
| `color` | 头像主色 |
| `auto-sleep` | 自动睡眠前的空闲时间；`0` 表示禁用 |
| `wake-on` | 自动唤醒策略：`activity`、`interaction` 或 `manual` |
| `motion` | 动态效果策略：`auto`、`reduce` 或 `full` |

常用运行时控制方法：

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setAntennaFlash(true);
```

## 事件与集成

组件通过 `face-state` 通知视觉状态变化，通过 `action-state` 通知具有语义的动作生命周期变化。

宿主应用集成和无障碍状态文案建议使用 `action-state`。可运行的请求生命周期示例见 [`examples/accessibility.html`](../examples/accessibility.html)。

最简集成示例见 [`examples/basic.html`](../examples/basic.html)。

## 兼容性

适用于支持 ES Modules、Custom Elements、SVG、Pointer Events、Web Animations API、`IntersectionObserver`、`ResizeObserver` 与 `matchMedia` 的现代浏览器。

自动化浏览器测试覆盖 Chromium、Firefox 和 WebKit。

## 参与贡献

欢迎提交 Issue 和 Pull Request。提交修改前请参阅 [`CONTRIBUTING.md`](../CONTRIBUTING.md)。

## 项目状态

**当前公开版本：v0.3.2**

项目持续演进，公开 API 目前有意保持精简，未来计划在 `1.0.0` 版本承诺稳定性。

Agent Robot Avatar 为独立开发项目，与任何 AI 平台或品牌均无隶属关系，也不代表其官方立场或获得其背书。

## 角色设计与视觉标识

Agent Robot Avatar 的机器人角色形象及视觉标识由 CX ArtLab 原创设计。

MIT License 适用于软件和源代码，允许在应用中使用、修改和分发该头像组件，但不转让 Agent Robot Avatar 的名称、角色身份或视觉标识的所有权，也不授予将其作为他人原创角色或独立品牌展示的权利。

本项目提及的第三方产品名称仅用于说明可能的使用场景，不代表与这些产品存在关联或获得其认可。

## 许可证

MIT License，详见 [`LICENSE`](../LICENSE)。

---

如果这个项目对你有帮助，欢迎请我喝杯咖啡。

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
