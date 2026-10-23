# Agent Robot Eyes：嵌入式眼睛表情组件

[English / 完整接口说明](README.md) · [返回主项目](../docs/README.zh-CN.md)

这是同一项目下的**实验性硬件实现**。只绘制眼睛，提供表情、眨眼、注视、等待和休眠唤醒；由你的程序决定什么时候播放哪个动作。拖动、挤压、头部外形、天线和鼠标监听不包含在此版本中。嵌入式目录独立于 SVG 组件及其 Demo 界面，方便分别维护。

## 面向多平台

表情核心是独立的 C++11 库，不依赖 ESP32、Arduino、浏览器或具体屏幕驱动，内部不分配堆内存。ESP32 和树莓派 Pico 是首批参考接入，其他控制器可编写自己的显示适配。

| 构建环境 | 开发板 | 屏幕 |
| --- | --- | --- |
| `esp32-s3-st7789` | ESP32-S3-DevKitC-1 | ST7789，240×240，SPI |
| `pico-st7789` | Raspberry Pi Pico / RP2040 | ST7789，240×240，SPI |
| `esp32-ssd1306` | ESP32 Dev Module | SSD1306，128×64，I²C，地址 `0x3C` |
| `esp32-ssd1306-128x32` | ESP32 Dev Module | SSD1306，128×32，I²C，地址 `0x3C` |
| `esp32-sh1106` | ESP32 Dev Module | SH1106，128×64，I²C，地址 `0x3C` |
| `esp32-s3-gc9a01` | ESP32-S3-DevKitC-1 | GC9A01 圆屏，240×240，SPI（接线同 `esp32-s3-st7789`） |
| `esp32-s3-st7789-240x280` | ESP32-S3-DevKitC-1 | ST7789 1.69″，240×280，SPI（接线同上） |
| `esp32-s3-st7789-240x320` | ESP32-S3-DevKitC-1 | ST7789 2.0″，240×320，SPI（接线同上） |
| `waveshare-s3-round-128` | 微雪 ESP32-S3-Touch-LCD-1.28 | 板载 GC9A01 圆屏，无需接线 |
| `cyd-ili9341` | ESP32-2432S028（CYD 黄板） | 板载 ILI9341，无需接线 |
| `t-display-st7789` | LilyGO T-Display | 板载 ST7789 1.14″，横屏 |
| `t-display-s3` | LilyGO T-Display-S3 | 板载 ST7789 1.9″，8 位并口，横屏 |
| `m5-dial` / `m5-atoms3` / `m5-cores3` / `m5-stickc-plus2` | M5Stack 对应型号 | 板载屏幕，由 M5Unified 自动识别 |

每个配置的屏幕驱动在 `examples/arduino/boards.h` 中各占一小段，主程序共用。引脚依据厂商资料。所有配置都在 CI 中编译通过，尚未实机验证；如果你在实物上运行过，欢迎提交"实机验证报告"Issue，预览器里会标记为"社区已实机验证"。

**本版尚未进行实机测试。编译通过和电脑端测试，不代表已经确认屏幕接线、实际帧率或设备上的显示效果。** Web 与嵌入式版本共用表情名称和设计，但采用不同绘制器；嵌入式版每 20 毫秒采样原版几何参数并插值，保留原有眼部动作和时间过程；不绘制头部、天线及头部轮廓裁切，低分辨率边缘会有像素化差异。

## 不用硬件，先在电脑上看效果

下载并用浏览器打开 [`preview/agent-robot-eyes-preview.html`](preview/agent-robot-eyes-preview.html)。这是一个完整的离线文件，不需要服务器、开发板、Python、Node.js 或编译工具；请下载原始 HTML，而不是保存 GitHub 的文件查看页面。也可在克隆后的项目中直接双击这个文件。

它将**同一份嵌入式 C++ 源码编译成 WebAssembly**，不是原 Web Demo 或另一套 JavaScript 动画。支持 18 种动作（原有 17 种及新增波动等待）、自动轮播、暂停/逐帧、注视方向，以及 9 种屏幕预设和宽高 16–512 的自定义分辨率。可设置完整显示或裁切铺满、缩放、偏移与圆形裁切。命名预设使用对应参考模组的 SVG 外框，保留 PCB、玻璃、安装孔与排线的不同结构；横屏、竖屏整板旋转，自定义分辨率使用通用外框。鼠标可模拟接近目标，设置感应范围、只看移动物体、跟随速度和离开后的停留时间；真正的摄像头或传感器接入由宿主程序提供。暂停只冻结时间，仍可切换动作；慢速播放可用于检查过渡。浏览器输出不能代替真机接线、驱动、刷新率和性能测试。重建和验证方法见 [预览器说明](preview/README.md)。

## 接线

以下是 GPIO 编号，不是排针的物理序号。使用逻辑电平、电源均兼容 3.3 V、且引出 CS/DC/RST 的屏幕模块；带屏开发板需要按其原理图修改配置。

| ST7789 引脚 | ESP32-S3 | Pico |
| --- | --- | --- |
| SCK / SCL | GPIO12 | GP18 |
| MOSI / SDA | GPIO11 | GP19 |
| CS | GPIO10 | GP17 |
| DC | GPIO9 | GP20 |
| RST / RES | GPIO8 | GP21 |
| VCC | 3.3 V | 3.3 V |
| GND | GND | GND |

不连接 MISO。背光按屏幕模块说明接线，例程不控制背光引脚。

ESP32 OLED 例程使用：SDA → GPIO21，SCL → GPIO22，VCC → 兼容模块的 3.3 V，GND → GND；若模块地址不同，需要修改 `0x3C`。

## 编译与使用

安装 PlatformIO，在项目根目录执行对应命令：

```sh
pio run -d embedded -e esp32-s3-st7789
pio run -d embedded -e pico-st7789
pio run -d embedded -e esp32-ssd1306
```

只上传与你的开发板和接线匹配的环境。例如：

```sh
pio run -d embedded -e esp32-s3-st7789 -t upload
pio device monitor -b 115200
```

串口中发送英文动作名，末尾加换行：

- `love`：爱心。
- `waiting` / `waiting-wrap` / `waiting-wave`：持续等待，直到新动作替换。
- `success` / `failure`：任务成功或失败。
- `warning` / `inspect` / `blocked` / `error`：警告、审视、阻止、错误。
- `sleep` / `wake`：睡眠、唤醒。
- `gaze -0.5 0.2`：由程序明确指定注视方向，坐标范围 `[-1,1]`。注视幅度由 `EyesConfig::gazeRange`（或运行时 `setGazeRange()`）决定：`Small` 为原来的 8 × 6，`Medium`（默认）为 20 × 18，眼睛最远到表情区域边缘；`Large` 为 30 × 21，会稍微越过边缘。眼睛靠近边缘时按 Web 版公式变窄并向内收，看起来像在转向侧面；眼睛居中时三档画面完全相同。
- `demo`：轮流播放全部动作；有效的手动动作会退出轮播。
- `reset`：回到待机。
- `help`：列出命令。

完整动作还包括 `idle`、`bored`、`input`、`send`、`surprise`、`random`。支持与 Web 版对应的部分别名，详见英文接口说明。

## 接入自己的设备

库在 `embedded/lib/AgentRobotEyes`。Arduino 用户可将这个目录复制到自己的 `libraries` 目录；其他 C++11 平台可编译库的整个 `src` 目录。绘制核心不要求安装 Adafruit 库，例程中的显示驱动才需要它们。

你的程序负责提供持续递增的毫秒时间、调用 `eyes.update(nowMs)`，并将新生成的位图交给屏幕驱动。时间支持 32 位计数器回绕；不要混用多个时钟，也不要让多个任务同时无保护地操作同一实例。

240×160 眼睛画布需要 4,800 字节，TFT 例程另需 480 字节颜色转换行缓冲；128×64 画布需要 1,024 字节，OLED 驱动还会拥有自己的显示缓冲。上述数字不包含系统、驱动和其他实例内存；原版动作的只读几何表另占约 80 KB 闪存，不分配堆内存。例程限制最高 25 FPS，实际帧率需要实测。

输出是按行、每字节高位优先的 1 位位图，每行向上补齐到整字节。它不是 SSD1306 原生分页格式；例程通过驱动的 `drawBitmap()` 转换。颜色由宿主程序映射，因此可以用于黑白 OLED，也可以在彩屏上设置不同眼睛颜色。

**同一个产品、不同平台适配：表情属于项目本身，ESP32 只是其中一个入口。**

