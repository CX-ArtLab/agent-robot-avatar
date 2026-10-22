# Offline eyes preview / 离线眼睛预览器

Download **`agent-robot-eyes-preview.html`** and open it in a browser. The file contains its UI and compiled engine. No install or server is required to run it. On a phone, a file manager's preview may not execute HTML/WebAssembly: use a desktop browser if it only shows source or a static preview.

下载 **`agent-robot-eyes-preview.html`**，在电脑上用浏览器打开即可，不用安装、不用联网。手机文件管理器的快速预览可能不执行脚本；遇到只能看源码或无法运行时，请在电脑浏览器中打开。

## Controls / 使用

- **等待 · 波动 / `waiting-wave`** restores the earlier experimental waiting animation as an additional action: full elliptical eyes move vertically with amplitude 10 in the 160×100 face space, a 1400 ms period and a 0.7 rad right-eye phase offset. It loops until replaced; `stopWaiting()` also stops it. Existing original `waiting` and `waiting-wrap` actions are retained. The preview and C++ core now offer 18 actions. The SVG component also has a separately tuned waiting-wave variant (three 1100 ms cycles); this hardware preview retains the earlier continuous 1400 ms motion.
- **等待 · 波动**作为新增动作保留旧实验版的双眼错相上下起伏；原版等待、环绕不变。硬件版保留 1400 毫秒持续循环；SVG 版另有调校过的三个 1100 毫秒循环。
- Choose an expression; it interrupts the current action and stops cycling. / 点击表情立即切换并退出轮播。
- Pause freezes simulated time; next-frame advances one core frame interval. Commands still work while paused. With transitions enabled, an immediate switch may initially look unchanged: step forward to inspect the transition. / 暂停后可逐帧推进，也可切换表情；开启过渡时，切换瞬间可能仍是上一表情，继续逐帧即可看到变化。
- Cycling allows at least four simulated seconds per action and waits for longer actions to finish. Speed affects both animation and cycling. / 轮播每个动作至少四秒，较长动作会完整播完；播放速度同时影响动画和轮播。
- Proximity gaze uses the mouse as a simulated physical target. In settings, adjust the sensing radius, moving-target-only mode, motion sensitivity, follow response and departure hold time. Manual gaze sliders disable automatic tracking. Expression playback retains its original gaze; target tracking applies only to idle. / 鼠标模拟物体：进入虚线范围才注视。设置中可调感应扩展范围、只看移动目标、移动灵敏度、跟随速度和离开后停留。手动滑块会关闭自动注视；表情播放保留原版视线动作，目标注视只作用于待机。
- Motion-only mode stops refreshing the lock when the target becomes stationary; after the configured hold, the eyes return to center. Mouse movement uses a short 180 ms observation window and a configurable 1/3/8 CSS-pixel threshold. Hardware detectors supply their own `moving` flag. / 移动目标停住后，经过设定的停留时间回正；鼠标使用180毫秒判定窗口与1/3/8像素移动门槛，硬件端由检测器提供运动状态。
- Display mode, FPS, blink and transition changes restart the simulation at idle and center the gaze. Reset does the same, retaining display settings and pause/speed/zoom preferences. Hidden tabs freeze the clock. / 改屏幕、帧率、眨眼或过渡会重置至待机和正中注视；重置保留显示配置、暂停状态、速度与倍率。切到后台冻结时间。

| Mode / 模式 | Core mask / 核心画布 | Screen mapping / 屏幕映射 |
| --- | --- | --- |
| Eyes / 眼睛画布 | 240×160 | Direct / 直接显示 |
| ST7789 TFT | 240×160 | Centered in 240×240, 40 black rows above/below / 上下各留黑40像素 |
| SSD1306 OLED | 128×64 | Direct mask, not driver page format / 显示位图，不模拟驱动分页转换 |

The draft additionally includes SSD1306 128×32, ST7735S 128×160, ST7789V 320×240 and 240×320, GC9A01 circular 240×240, and ST7789 240×135 presets. Custom sizes support integer dimensions from 16 to 512; circles require equal width and height. These are resolution/shape previews, not added driver support. `presets.json` records the manufacturer documentation used for the specifications. The project-owned `project-demo.css` is copied from the existing `demo/index.html`; no third-party studio UI, images or branding are used.

草稿另外提供窄条 OLED、小型 TFT、横/竖屏、圆屏和宽幅屏；自定义宽高为16–512整数。预设是像素与形状预览，接入例程与实机验证状态独立标明。界面沿用本项目原 Demo 样式，屏幕外框为自绘 CSS 示意。

Layout offers preset/contain/cover, face scale and X/Y offsets. Layout and frame changes preserve animation; changing resolution restarts it. Circle clipping is performed by the C++ rasterizer, not just a CSS border. The original TFT preset retains a centered 240×160 eye viewport; contain uses the whole screen. / 布局支持预设、完整适配、铺满裁切、表情大小与位置；圆屏的可视区域直接在C++位图中裁切。

This is a **renderer preview**, not a CPU/display emulator. Actual board speed, memory consumption, wiring, colors, bus transfer, flicker and screen initialization still require physical testing. Display scaling is pixelated intentionally. / 这只是表情绘制预览，不模拟芯片和屏幕电路；真机速度、内存、接线、颜色、传输、闪烁和屏幕初始化仍需实测。放大时保留原始像素。

## One source of truth / 同源代码

`bridge.cpp` exposes a small C ABI. The build compiles the checked-out `../lib/AgentRobotEyes/src/AgentRobotEyes.cpp`, its header and `AgentRobotGaze.h` with Zig 0.13.0 to WebAssembly. `ui.js` maps its MSB-first 1-bit mask to canvas and supplies simulated target observations; it has no expression geometry or smoothing implementation. The footer SHA-256 covers the engine source/header, gaze header, generated Web motion header and bridge.

`bridge.cpp` 仅暴露接口；表情和时间逻辑来自开发板使用的原始 C++ 源文件，没有复制成 JavaScript。页面底部的源码指纹涵盖核心头文件、实现文件及桥接代码。

### Original-expression fidelity correction

The initial experimental C++ implementation simplified the original expressions; native/WASM parity alone did not test visual fidelity. It is replaced by geometric motion data extracted from the project's actual Web action and draw methods. `sample-web-expressions.mjs` executes those original methods on a virtual clock, excluding only head/antenna rendering and the head silhouette clip, and records positions, ellipse sizes/angles, eyelid masks and the input cursor's rounded rectangle at 20 ms intervals. The device interpolates these parameters and rasterizes them at its actual resolution: these are not stored image frames. The table adds about 80 KB of read-only flash data and no heap allocation.

修正版从原项目的动作与绘制方法提取几何参数，保留等待、环绕、审视、随机转动、爱心、入睡等动作的原有形态和时间过程。只移除头部/天线及头部轮廓裁切；低分辨率仍会有正常的像素化差异。动作期间优先保留原表情，自动注视在待机时应用。“打断过渡”控制替换正在执行的动作时的衔接，以及新增波动动作的入场，不删除原表情内部的形变。

`test-web-fidelity.mjs` independently rasterizes SVGs produced by the original Web drawing methods and compares them with the C++ framebuffer. It checks 153 samples across all 17 actions, including entry, hold, movement and recovery phases. The original action source files are hashed to detect drift. Install the pinned development-only rasterizer with `npm install --no-save --package-lock=false @resvg/resvg-js@2.6.2`, then run:

```sh
node embedded/tools/sample-web-expressions.mjs
node embedded/tools/test-web-fidelity.mjs
```

This visual reference test is separate from native/WASM execution parity. The checked reference uses original default settings, disables autonomous blink/wander, and compares the eyes without the outer head motion. It does not claim pixel-identical antialiasing or bit-for-bit agreement on every physical architecture.

The bundled WASI libc has one browser-local import, `random_get`, used to initialize its stack-protection seed via `crypto.getRandomValues`. No filesystem, network, system clock or process capability is provided. The engine itself remains deterministic. A restrictive content policy blocks all connections; no CDN, telemetry or external assets are included.

## Rebuild / 重建（仅维护者需要）

Running the built HTML needs none of these tools. To rebuild after changing the core or UI, install Node.js and **Zig 0.13.0**; from the repository root:

```sh
node embedded/tools/build-preview.mjs
node embedded/tools/test-preview.mjs
```

Set the `ZIG` environment variable to the Zig executable if it is not on PATH. An optional output path may follow the build command. Both Zig and its bundled libc are build-time only; the compiled HTML remains MIT-licensed project code plus bundled permissively licensed compiler runtime/libc routines (see third-party notice below).

`test-preview.mjs` checks source freshness and compares native/WASM frames across all actions, all nine presets, non-byte-aligned rows, layout modes, circular clipping, moving-only proximity, interruption, gaze, sleep and 32-bit timer rollover. It requires a C++11 compiler (`g++`, or set `CXX`). A tolerance of eight boundary pixels accounts for compiler/libm rounding, not expression differences. The local test reports its actual frame count and differences.

To test the actual local-file UI (after installing the project's npm dev dependencies and Playwright browsers):

```sh
node embedded/tools/test-preview-ui.mjs
```

`PREVIEW_BROWSER=firefox` or `webkit` selects the engine; the default is Chromium. Optional `PREVIEW_BROWSER_PATH` selects a local executable, and `PREVIEW_BROWSER_ARGS` accepts a JSON argument array for special CI environments. Tests run with browser networking offline and verify controls, framebuffer mapping, responsive layout and no external requests. CI rebuilds the preview and checks that the committed generated file matches.

## Third-party runtime notices

The preview is built with Zig 0.13.0 and its WASI libc/math implementation. Zig is MIT-licensed; WASI libc contains Apache-2.0-with-LLVM-exception, MIT and BSD-licensed components. The distributed preview includes the bundled notice in its license disclosure. See `third-party-notices.txt` for the full notices provided with the bundled libc and compiler runtime. The project core and UI remain MIT-licensed.
