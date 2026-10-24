# Offline eyes preview / 离线表情预览器

Download **`agent-robot-eyes-preview.html`** and open it in a browser. The file contains its UI and compiled engine. No install or server is required to run it. On a phone, a file manager's preview may not execute HTML/WebAssembly: use a desktop browser if it only shows source or a static preview.

下载 **`agent-robot-eyes-preview.html`**，在电脑上用浏览器打开即可，不用安装、不用联网。手机文件管理器的快速预览可能不执行脚本；遇到只能看源码或无法运行时，请在电脑浏览器中打开。

## Controls / 使用

Desktop uses a two-column workspace: the module preview, expression buttons and playback (pause, step, cycling, speed) stay on the left; screen, layout, proximity and manual gaze, animation, colour and display controls are always expanded on the right, with ‹ › buttons stepping through the screen list. The settings column scrolls independently when needed. On narrow screens the same sections stack below the preview. / 桌面采用左右结构：左侧预览、表情选择和播放控制，右侧集中显示所有功能选项，‹ › 逐个切换屏幕；窄屏自动改为上下排列。

- **等待 · 波动 / `waiting-wave`** restores the earlier experimental waiting animation as an additional action: full elliptical eyes move vertically with amplitude 10 in the 160×100 face space, a 1400 ms period and a 0.7 rad right-eye phase offset. It loops until replaced; `stopWaiting()` also stops it. Existing original `waiting` and `waiting-wrap` actions are retained. The preview and C++ core now offer 18 actions. The SVG component also has a separately tuned waiting-wave variant (three 1100 ms cycles); this hardware preview retains the earlier continuous 1400 ms motion.
- **等待 · 波动**作为新增动作保留旧实验版的双眼错相上下起伏；原版等待、环绕不变。硬件版保留 1400 毫秒持续循环；SVG 版另有调校过的三个 1100 毫秒循环。
- With interruption transitions enabled, input-cursor exits smoothly interpolate the horizontal and vertical corner radii into the target eye shape. Interrupting that morph again preserves its current shape. Original expression geometry and timing remain intact. / 开启打断过渡时，输入光标会连续圆润并衔接新表情，过渡中再次切换也从当前形态继续；目标表情与原有动作时间保持不变。
- Choose an expression; it interrupts the current action and stops cycling. / 点击表情立即切换并退出轮播。
- Pause freezes simulated time; next-frame advances one core frame interval. Commands still work while paused. With transitions enabled, an immediate switch may initially look unchanged: step forward to inspect the transition. / 暂停后可逐帧推进，也可切换表情；开启过渡时，切换瞬间可能仍是上一表情，继续逐帧即可看到变化。
- Cycling allows at least four simulated seconds per action and waits for longer actions to finish. Speed affects both animation and cycling. / 轮播每个动作至少四秒，较长动作会完整播完；播放速度同时影响动画和轮播。
- Gaze has one source at a time: 跟随物体 (the mouse as a simulated nearby object), 手动 (sliders) or 关闭. Following shows only its own options: sensing radius, moving-target-only (with its sensitivity on the same row), follow speed and departure hold. Expression playback retains its original gaze; gaze applies only to idle. Gaze status appears under the screen. / 注视方式三选一：跟随物体、手动、关闭，只显示当前方式的选项；注视状态显示在屏幕下方。
- 注视幅度 (gaze range) selects the core's `GazeRange`: small (original 8 × 6 face units), medium (default, reaches the face-area edge) or large (slightly past it). It applies to proximity and manual gaze and is remembered in the browser. / 注视幅度对应核心的 `GazeRange`：小（原幅度）、中（默认，到表情区域边缘）、大（略超出边缘）。
- Motion-only mode stops refreshing the lock when the target becomes stationary; after the configured hold, the eyes return to center. Mouse movement uses a short 180 ms observation window and a configurable 1/3/8 CSS-pixel threshold. Hardware detectors supply their own `moving` flag. / 移动目标停住后，经过设定的停留时间回正；鼠标使用180毫秒判定窗口与1/3/8像素移动门槛，硬件端由检测器提供运动状态。
- Changing the screen or custom size restarts at idle. Frame rate, blink, transitions, layout, housing and display effects apply without restarting the current action (the core's `setTiming()`). The frame-rate cap defaults to 屏幕上限, the whole-frame limit estimated from the screen's bus, and resets to it on every screen change; lower tiers stay available for comparison. Every option is remembered in the browser. Hidden tabs freeze the clock. / 换屏幕会从“正常”重新开始；帧率、眨眼、过渡等更改不打断当前动作。帧率默认取“屏幕上限”，换屏幕时自动更新；所有设置保存在浏览器中。

| Mode / 模式 | Core mask / 核心画布 | Screen mapping / 屏幕映射 |
| --- | --- | --- |
| Eyes / 眼睛画布 | 240×160 | Direct / 直接显示 |
| ST7789 TFT | 240×160 | Centered in 240×240, 40 black rows above/below / 上下各留黑40像素 |
| SSD1306 OLED | 128×64 | Direct mask, not driver page format / 显示位图，不模拟驱动分页转换 |

The draft additionally includes SSD1306 128×32, ST7735S 128×160, ST7789VW 320×240 and 240×320, GC9A01 circular 240×240, and ST7789 240×135 presets. Custom sizes support integer dimensions from 16 to 512; circles require equal width and height. Each preset now names a specific reference module and uses a project-authored SVG front view with its PCB envelope, glass, mounting holes, pads and flex cable. The portrait/landscape 2-inch choices rotate the same module. `frames/README.md` records the official product photographs, dimension drawings and approximation limits. These are appearance/resolution previews, not added driver support; custom resolutions retain a generic housing. The project-owned `project-demo.css` is copied from the existing `demo/index.html`; no third-party studio UI, manufacturer logos or product photographs are bundled.

草稿另外提供窄条 OLED、小型 TFT、横/竖屏、圆屏和宽幅屏；自定义宽高为16–512整数。预设是像素与形状预览，接入例程与实机验证状态独立标明。界面沿用本项目原 Demo 样式；外框按选定模组的官方尺寸图和正面照片自绘为 SVG，保留 PCB、玻璃、孔位与排线的结构差异，来源及近似范围见 `frames/README.md`。自定义分辨率使用通用外框。

Layout offers preset/contain/cover, face scale and X/Y offsets. Layout and frame changes preserve animation; changing resolution restarts it. Circle clipping is performed by the C++ rasterizer, not just a CSS border. The original TFT preset retains a centered 240×160 eye viewport; contain uses the whole screen. / 布局支持预设、完整适配、铺满裁切、表情大小与位置；圆屏的可视区域直接在C++位图中裁切。

### Screens and display / 屏幕与显示

- Besides the reference modules, the list adds common boards and kits (round GC9A01/AMOLED, ST7789/ST7735 modules, T-Display, M5Stack, ESP32-S3-BOX-3, SSD1306/SH1106, CYD, 3.5″ and 4″ panels), grouped by shape. Their housings are drawn from typical board dimensions by `board.js` and labelled as generic outlines; boards marked 通用 are no-brand modules. None of them adds driver support. Displays above the core's 512 × 512 limit are not listed. / 在参考模组之外补充常见开发板和套件，按形状分组；外框由 `board.js` 按常见尺寸绘制，标注为通用示意，不代表新增驱动支持。超过核心 512 × 512 上限的屏幕不列出。
- Panel character is applied on display only, by `panel.js` (WebGL): pixel grid and RGB sub-pixels when enlarged, backlight black level and glow for IPS/TN LCDs, true black for AMOLED, and 1-bit OLED dots in white, blue or yellow-blue. "原始像素" shows plain enlarged pixels instead. The core framebuffer is never altered. / 面板效果（像素颗粒、子像素、背光黑位与发光、OLED 发光颜色）只作用于显示，不改变核心输出的像素；"原始像素"直接放大显示。
- Zoom is physical and never exceeds the stage: 适合窗口, 实物大小 (pixel pitch at 96 CSS px per inch; an estimate, monitors differ) and a stepless slider up to the fitted size with weak snapping at 1×, 2×, 3×, 4× and other common ratios, so no scrollbars appear. Hiding the housing keeps the screen exactly where it was. A dashed outline marks the active pixel area, useful on OLEDs whose unlit pixels match the glass. / 缩放最大到放满窗口，不会出现滚动条；隐藏外框时屏幕位置和大小不变。
- Layout is remembered per screen (and per orientation) in the browser. Rectangular modules can be rotated 90°: the framebuffer is re-rendered at the swapped resolution and the housing turns with it. Eye and background colours apply to colour panels. / 每块屏单独记住眼睛布局；矩形模组可旋转 90°，核心按新方向重新绘制；彩屏可设置眼睛和底色。

This is a **renderer preview**, not a CPU/display emulator. Actual board speed, memory consumption, wiring, colors, bus transfer, flicker and screen initialization still require physical testing. / 这只是表情绘制预览，不模拟芯片和屏幕电路；真机速度、内存、接线、颜色、传输、闪烁和屏幕初始化仍需实测。

## One source of truth / 同源代码

`bridge.cpp` exposes a small C ABI. The build compiles the checked-out `../lib/AgentRobotEyes/src/AgentRobotEyes.cpp`, its header and `AgentRobotGaze.h` with Zig 0.13.0 to WebAssembly. `ui.js` maps its MSB-first 1-bit mask to canvas and supplies simulated target observations; it has no expression geometry or smoothing implementation. `board.js` and `panel.js` only draw housings and panel appearance around that bitmap; the build inlines all three scripts. The footer SHA-256 covers the engine source/header, gaze header, generated Web motion header and bridge.

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
