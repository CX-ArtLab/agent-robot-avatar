# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md)

![Version](https://img.shields.io/badge/version-v0.2.1-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square) ![14 Agent States](https://img.shields.io/badge/Agent%20states-14-8B5CF6?style=flat-square) ![Pointer Following](https://img.shields.io/badge/Pointer-following-00A67E?style=flat-square) ![Jelly Drag](https://img.shields.io/badge/Drag-jelly%20physics-FF69B4?style=flat-square)

一个轻量、富有表现力的机器人头像 Web Component，可用于 AI Agent，也可用于其他需要交互反馈的应用。

适用于 AI 助手和 Agent 交互界面，也可用于桌面宠物、数字吉祥物、聊天机器人头像以及其他互动角色体验。

Agent Robot Avatar 基于 SVG 与原生 JavaScript 构建，不依赖第三方动画框架，作为原生自定义元素工作，并提供尽量精简的公开 API。

**当前公开版本：v0.2.1**

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar 交互动画演示" width="560">
</p>

## 在线演示

直接体验交互效果：[打开 Agent Robot Avatar 在线演示](https://cx-artlab.github.io/agent-robot-avatar/?lang=zh-CN)

## 主要特点

- 纯 SVG + 原生 JavaScript
- 原生 Web Component
- 零运行时第三方依赖
- 自动眨眼、视线与头部跟随
- 局部果冻式拖拽形变与弹性回弹
- 程序控制的 Agent 状态与表情
- 独立的 `action-state` 语义动作生命周期事件
- `wake-on` 睡眠唤醒策略
- `motion` 减少动态效果支持
- 不可见时暂停持续绘制
- 可调整头部圆角
- 悬浮式天线与可选状态闪动

## 快速开始

直接使用仓库源码时，请保持根目录的 `agent-robot-avatar.js` 与 `src/` 目录一起使用：

```html
<script type="module" src="./agent-robot-avatar.js"></script>
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

最小示例位于 [`examples/basic.html`](../examples/basic.html)，无障碍语义状态示例位于 [`examples/accessibility.html`](../examples/accessibility.html)。

通过 npm：

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

npm 包内置 TypeScript 类型声明。

## 基本 API

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('failure');
avatar.play('warning');
avatar.play('inspect');
avatar.play('blocked');
avatar.play('error');
```

恢复默认待机：

```js
avatar.reset();
```

`reset()` 会统一取消当前程序动作、待完成计时、头部动画、拖拽/回弹和尚未触发的拖拽表情，然后回到 `idle`。被取消的动画 Promise 仍按原约定正常结束，不会因为取消而产生未处理拒绝。移除组件时会执行同类内部清理，但不会额外发送用于清理的 `face-state` 或 `action-state` 通知；重新挂载后从 `idle` 开始，并保留配置。

真正开始的新动作会替换旧动作；旧动作不能在之后恢复并覆盖新动作。未知动作会在破坏性清理前抛错。已经醒着时调用 `wake`、已经处于持续输入时再次调用 `input` 等无操作调用不会破坏当前动作，也不会产生虚假的语义生命周期事件。

## 状态与表情

| 状态 | API 名称 | 典型用途 |
| --- | --- | --- |
| 默认待机 | `idle` | 正常待机状态 |
| 发呆 | `bored` | 长时间无任务或空闲 |
| 等待 | `waiting` | 请求已经发出，正在等待结果返回 |
| 输入中 | `input` | 用户正在输入 |
| 发送 | `send` | 内容已发送 / 点头反馈 |
| 成功 | `success` | 任务成功完成 |
| 失败 | `failure` | 任务完成但结果失败 |
| 警告确认 | `warning` | 高风险操作需要再次确认 |
| 审视 | `inspect` | 检查、核对或验证结果 |
| 内容阻止 | `blocked` | 请求被阻止、不允许执行或无法继续 |
| 系统错误 | `error` | 网络、服务或系统本身发生错误 |
| 惊讶 | `surprise` | 出现意外事件或结果 |
| 睡眠 | `sleep` | 组件进入睡眠姿态 |
| 唤醒 | `wake` | 从睡眠姿态恢复 |

`sleep` 只描述头像组件自身的状态，不表示真实 Agent 已离线。

语义别名：

```js
avatar.play('failed');           // failure
avatar.play('fail');             // failure
avatar.play('verify');           // inspect
avatar.play('review');           // inspect
avatar.play('angry');            // 与 blocked 使用相同视觉表情
avatar.play('policy-blocked');   // blocked
avatar.play('system-error');     // error
avatar.play('connection-error'); // error
```

## 持续等待

```js
avatar.startWaiting();

// 请求在没有被其他动作替换的情况下结束时：
avatar.stopWaiting();
```

`startWaiting()` 会一直保持到 `stopWaiting()`、`reset()` 或新的程序动作将其替换。`stopWaiting()` 对语义生命周期来说是正常 `end`；被其他动作或 reset 替换时是 `cancel`。

等待、输入或其他尚未结束的程序动作期间仍可以拖拽产生形变，但拖拽表情不会覆盖程序动作；被抑制的拖拽表情会直接丢弃，不会在动作结束后补播。

典型请求生命周期：

```js
avatar.startWaiting();
try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('error');
}
```

`error` 动画播放完并回到 `idle`，只表示头像动画结束，不表示真实连接或业务错误已经解决。真实请求状态始终由宿主应用决定。

## `action-state` 语义动作事件

现有 `face-state` 保留兼容，它描述视觉状态，可能出现 `happy`、`sad` 等视觉词，不建议直接拿它判断真实任务结果。

新增 `action-state`：

```js
avatar.addEventListener('action-state', (event) => {
  const { action, phase, source } = event.detail;
  console.log(action, phase, source);
});
```

约定：

- `action`：规范化后的动作名；`failed` / `fail` → `failure`，`verify` / `review` → `inspect`。
- `phase`：`start`，之后且仅之后一个 `end` 或 `cancel`。
- `source`：`api`、`interaction`、`automatic`。
- 持续 waiting / input 不会因为单次视觉循环完成而产生 `end`。
- `stopWaiting()` 正常结束 waiting；reset 或其他动作替换时记录 `cancel`。
- 无操作调用不产生虚假事件。
- 普通拖拽反馈使用 `action: "reaction"`、`source: "interaction"`，不会被误认为 API 发出的任务成功/失败。
- 事件会冒泡，并设置为 `composed`，可跨越组件的 Shadow DOM 边界监听。
- 卸载只清理内部工作，不额外制造宿主播报事件。

## 无障碍接入

建议宿主根据 `action-state` 将程序动作映射为本地化文字，并使用普通的 `role="status"`：

```html
<div id="agent-status" role="status" aria-live="polite"></div>
```

```js
const status = document.querySelector('#agent-status');
const messages = {
  waiting: '正在处理…',
  failure: '任务失败。',
  error: '连接异常。',
};

avatar.addEventListener('action-state', ({ detail }) => {
  if (detail.source === 'interaction') return;
  if (detail.phase === 'start' && messages[detail.action]) {
    status.textContent = messages[detail.action];
  }
});
```

不要播报眨眼、视线变化或普通拖拽反应；也不要默认把所有错误都做成打断式警报。如果宿主本身已经播报同一状态，可以把头像视为装饰，避免重复通知。

完整示例见 [`examples/accessibility.html`](../examples/accessibility.html)。

## 睡眠唤醒策略

新增属性：

```html
<agent-robot-avatar wake-on="manual"></agent-robot-avatar>
```

| 值 | 行为 |
| --- | --- |
| `activity` | 默认值；保留原行为，页面指针/键盘活动可以自动唤醒头像。 |
| `interaction` | 只有直接与这个头像交互时自动唤醒；页面其他区域活动不唤醒。 |
| `manual` | 页面活动和头像交互都不会自动唤醒，由宿主显式控制。 |

显式调用仍保持显式语义：`avatar.play('wake')` 在所有模式下都可唤醒；现有 `avatar.noteActivity()` 仍默认记录活动并唤醒，`noteActivity(false)` 只记录活动、不唤醒。其他程序动作可以按照动作语义离开睡眠；`reset()` 始终回到 `idle`。不同实例可以使用不同策略。

## 减少动态效果

新增：

```html
<agent-robot-avatar motion="auto"></agent-robot-avatar>
```

| 值 | 行为 |
| --- | --- |
| `auto` | 默认；遵循系统 `prefers-reduced-motion`，并响应运行期间的偏好变化。 |
| `reduce` | 保留可辨认的静态状态，减少持续、弹性和闪烁类动画。 |
| `full` | 始终使用普通动画，不受系统减少动态效果偏好影响。 |

reduce 模式会简化等待转圈、待机游走/眨眼、惯性跟随、弹性回弹、天线弹簧和闪烁等装饰动态，但 waiting / input 等语义生命周期仍持续存在，直到宿主结束或替换。切换 motion 不会恢复已经被取消的旧动作，也不会改变 `action-state` 的语义。

## 鼠标 / 指针跟随

```js
avatar.setPointerFollow(false);
avatar.setPointerFollow(true);
```

高频指针更新会合并为每个动画帧最多处理最新位置一次，普通模式下的视线跟随保持不变。

## 移动端拖拽

头像交互区域使用 `touch-action: pinch-zoom`：单指移动交给头像拖拽逻辑，同时保留双指缩放能力；从头像外部开始的页面滚动仍按页面正常手势处理。

`pointercancel`、指针捕获丢失、reset、动作替换或卸载都会恢复形状，并且不会把手势取消误判成 `success` / `angry`。

## 天线闪动

```js
avatar.setAntennaFlash(true);
avatar.setAntennaFlash(false);
```

状态闪动默认关闭；reduce 模式会停止不必要的持续闪烁。

## 审视表情配置

可以在加载组件前配置：

```html
<script>
  window.AgentRobotAvatarInspectConfig = {
    aperture: 24,
    scanOffset: 12,
  };
</script>
<script type="module" src="./agent-robot-avatar.js"></script>
```

加载前已经提供的有效值会被保留，只对缺失或无效项补默认值。配置通过 `Number(...)` 转换并要求有限值；`aperture` 限制在 `6–40`，`scanOffset` 限制在 `0–24`，时间参数限制在对应的 `0/40–2400 ms` 范围。加载后仍可修改同一个 `window.AgentRobotAvatarInspectConfig` 对象，每次开始 inspect 时会再次规范化。默认配置的视觉效果保持不变。

## 头部圆角

```js
avatar.setHeadRoundness(0);   // 更方
avatar.setHeadRoundness(50);  // 默认
avatar.setHeadRoundness(100); // 更圆

console.log(avatar.getHeadRoundness());
```

输入值限制在 `0–100`。天线模块和圆角模块现在复用同一套头部扁平化几何计算，避免默认形状出现实现偏差。

`head-roundness-change`：

```js
avatar.addEventListener('head-roundness-change', (event) => {
  console.log(event.detail.value);
});
```

## `face-state` 视觉事件

```js
avatar.addEventListener('face-state', (event) => {
  console.log(event.detail.state);
});
```

该事件继续用于视觉同步和旧接入；涉及真实 Agent 生命周期和无障碍播报时优先使用 `action-state`。

## 基础属性

```html
<agent-robot-avatar
  size="160px"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</agent-robot-avatar>
```

| 属性 | 说明 |
| --- | --- |
| `size` | 正像素尺寸；支持 `140` 和 `140px`。不支持的单位、非法字符串、0、负数和非有限值统一回退到 `112px`。 |
| `color` | 头像主色。 |
| `auto-sleep` | 无操作后自动睡眠的毫秒数；`0` 关闭。 |
| `wake-on` | `activity`（默认）、`interaction`、`manual`。 |
| `motion` | `auto`（默认）、`reduce`、`full`。 |

动态修改尺寸后，拖拽坐标和指针跟随会使用当前实际布局尺寸。

## 默认行为

普通模式下继续保留随机眨眼、轻微视线活动、指针跟随、头部惯性和自然回待机等既有风格。开启 reduce 后会简化这些装饰动作。

## 拖拽交互

- 空闲状态大幅向外拉：恢复后触发 `angry` 视觉反馈
- 空闲状态大幅向中心挤压：恢复后触发 `success` 视觉反馈
- 小幅拖动：只产生形变
- 程序动作活跃时：可以形变，但拖拽表情不覆盖程序动作
- reset / 新动作 / pointercancel / 丢失捕获 / 卸载：统一取消旧拖拽后续反应

## 不可见暂停与性能

组件在自身或父容器没有可见布局区域、或离开视口后暂停持续帧绘制；重新可见时按当前有效状态恢复，不补播已经失效的动作。有限动作的计时和 Promise 不依赖持续绘制，因此不会因为不可见而无限挂起。

指针移动按动画帧合并，只处理每帧最新位置。现有页面隐藏和稳定 sleep 暂停机制继续保留；实例卸载时会清理观察器与媒体查询监听。

## 交互 Demo

`demo/index.html` 是完整交互 Demo，包含全部公开表情、指针跟随、拖拽形变、等待生命周期、圆角、颜色与模拟 Agent 对话状态。Demo 专用 JavaScript 与 npm 运行时保持分离。

## 项目结构

```text
agent-robot-avatar.js     正式组件入口
src/                      可复用组件运行时与表情模块
demo/                     完整交互 Demo 与 Demo 专用辅助脚本
examples/                 最小集成与无障碍示例
assets/support/           支持项目 / 支付二维码素材
docs/                     多语言文档
README.md                 英文主文档
CHANGELOG.md              正式版本记录
CONTRIBUTING.md           贡献指南
package.json              包与分发元数据
LICENSE                   MIT License
```

## 分发

软件包以 `agent-robot-avatar` 名称发布到 npm。npm 包包含公开入口、TypeScript 类型声明、`src/` 运行时、文档和支持项目素材；Demo 专用文件和测试文件不会进入运行时包。

## 兼容性与验证

面向支持 ES Modules、Custom Elements、SVG、Pointer Events、Web Animations API、`IntersectionObserver`、`ResizeObserver` 和 `matchMedia` 的现代浏览器。

自动浏览器测试覆盖 Chromium、Firefox 和 WebKit；移动端拖拽取消另外使用 Chromium 可信触摸模拟验证。真实手机是否验证以对应 PR / 发布说明为准。

## 参与贡献

欢迎提交 Issue 和 Pull Request。提交修改前请先阅读 [`CONTRIBUTING.md`](../CONTRIBUTING.md)。

## 项目状态

v0.2.1 是当前公开版本。当前刻意保持较小的公开 API，以便在未来 `1.0.0` 稳定性承诺之前继续谨慎演进。

Agent Robot Avatar 为独立开发的开源项目，不隶属于、代表或获得任何 AI 平台或品牌的官方背书。

## License

MIT License。详见 [`LICENSE`](../LICENSE)。

## 请我喝杯咖啡

如果这个项目对你有帮助，也可以请我喝杯咖啡：

| Ko-fi | 支付宝 | 微信支付 |
| --- | --- | --- |
| <a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a> | <img src="../assets/support/alipay.png" alt="支付宝收款码" width="160"> | <img src="../assets/support/wechat-pay.png" alt="微信支付收款码" width="160"> |
