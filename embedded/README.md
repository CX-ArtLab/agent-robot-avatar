# Agent Robot Eyes — embedded preview

[简体中文](README.zh-CN.md) · [Main project](../README.md)

An **experimental**, portable C++11 implementation of the Agent Robot Avatar eye expressions. It renders eyes only, with no head, antenna, dragging, squeezing, pointer listeners, network client or AI model. The embedded package is independent of the SVG component and its Demo UI.

The expression engine is independent of ESP32, Arduino and the display driver. ESP32 and Raspberry Pi Pico are reference integrations, not a promise of compatibility with every board or display. **Compilation and host tests do not certify physical hardware performance, wiring or visual fidelity.** No physical-board testing has been performed for this preview.

## Architecture and scope

- `lib/AgentRobotEyes/`: standalone MIT C++11 library; no third-party runtime dependencies or heap allocations in the core.
- `examples/arduino/`: display transport and serial command example using Adafruit drivers.
- `platformio.ini`: pinned reference build configurations.
- `tests/`: native engine tests, including framebuffer guards and 32-bit clock rollover.
- `tools/render-frame.cpp`: host-only PBM frame renderer for inspecting the actual engine output.

The Web and embedded implementations share expression names and visual design. They have **separate renderers**. The embedded engine interpolates geometry sampled from the original Web actions at 20 ms intervals, preserving their eye motion and timing on a small 1-bit raster surface. Anti-aliasing, head rendering and head-dependent silhouette clipping are excluded. See preview/README.md for the source-fidelity checks.

## Offline animation preview (no hardware)

Download [`preview/agent-robot-eyes-preview.html`](preview/agent-robot-eyes-preview.html) as a raw file and open it in a current browser, or double-click it in a local checkout. No server, compiler, Python, Node.js, CDN or network is needed to run the built file. Saving GitHub's file-view page is not the same as downloading the raw HTML.

The preview runs **this exact embedded C++ engine compiled to WebAssembly**, not the separate Web avatar renderer. It offers 18 actions (17 original expressions plus the added waiting-wave variant), cycling/manual interruption, pause/step, playback speed, explicit gaze, blink/transition switches, and 33 screen presets in five groups (round, square, bar, dev kits and OLEDs) plus custom resolutions from 16 to 512 pixels per axis. Layout controls include aspect-preserving fit, crop-to-fill, zoom, offsets and circular clipping. Named presets use SVG front views of specific reference modules; see [artwork sources](preview/frames/README.md). TFT mode centers a 240×160 mask inside a 240×240 canvas, matching the Arduino example. OLED mode renders a 128×64 mask; it does not emulate the display driver's page conversion. Changing the screen restarts the simulation; timing, layout and display changes apply without restarting, and hidden tabs freeze its clock. This validates animation, not board performance or screen electronics. See [preview/README.md](preview/README.md) for rebuilding and tests.

## From the preview to your board

Tune the eyes in the preview, then build the firmware with exactly those settings, without editing code:

1. Open the preview and pick your screen. The **型号与接线 (Model and wiring)** panel shows the board, its wiring and the build command.
2. Adjust layout, colours, frame rate, blinking and transitions, and turn the module if it is mounted turned.
3. Press **导出设置 (Export settings)**, then copy or download the text as `eyes_settings.h`.
4. Put the file in `embedded/examples/arduino/`, next to `main.cpp`.
5. Build and upload the environment named in the file's first lines, for example `pio run -d embedded -e esp32-s3-st7789 -t upload`.

| Setting in `eyes_settings.h` | Preview control |
| --- | --- |
| `EYES_MAX_FPS`, `EYES_AUTO_BLINK`, `EYES_TRANSITION_MS` | Frame-rate cap, blinking, transitions |
| `EYES_FIT_COVER`, `EYES_ZOOM`, `EYES_OFFSET_X`, `EYES_OFFSET_Y` | Layout: fit or fill, size, position |
| `EYES_INK_RGB`, `EYES_BACKGROUND_RGB` | Eye and background colours, or a palette (colour panels only) |
| `EYES_TURN` | Screen rotation 90°; if the eyes appear upside down, change `3` to `1` |
| `EYES_FULL_PANEL` | On the 240×240 reference module, use the whole panel instead of the 240×160 strip |

Without the file the firmware uses its defaults, and git ignores it. Gaze following needs a camera or distance sensor on the board, so it is not part of the export: the library's `GazeTracker` (`lib/AgentRobotEyes/src/AgentRobotGaze.h`) takes the target position your sensor reports.

## Reference configurations

| PlatformIO environment | Controller | Display | Validation scope |
| --- | --- | --- | --- |
| `esp32-s3-st7789` | ESP32-S3-DevKitC-1 | ST7789, 240×240 SPI TFT | Build target; physical verification pending |
| `pico-st7789` | Raspberry Pi Pico / RP2040 | ST7789, 240×240 SPI TFT | Build target; physical verification pending |
| `esp32-ssd1306` | ESP32 Dev Module | SSD1306, 128×64 I²C OLED, address `0x3C` | Build target; physical verification pending |
| `esp32-ssd1306-128x32` | ESP32 Dev Module | SSD1306, 128×32 I²C OLED, address `0x3C` | Build target; physical verification pending |
| `esp32-sh1106` | ESP32 Dev Module | SH1106, 128×64 I²C OLED, address `0x3C` | Build target; physical verification pending |
| `esp32-s3-gc9a01` | ESP32-S3-DevKitC-1 | GC9A01, 240×240 round SPI TFT (same wiring as `esp32-s3-st7789`) | Build target; physical verification pending |
| `esp32-s3-st7789-240x280` | ESP32-S3-DevKitC-1 | ST7789, 240×280 SPI TFT (1.69″, same wiring) | Build target; physical verification pending |
| `esp32-s3-st7789-240x320` | ESP32-S3-DevKitC-1 | ST7789, 240×320 SPI TFT (2.0″, same wiring) | Build target; physical verification pending |
| `waveshare-s3-round-128` | Waveshare ESP32-S3-Touch-LCD-1.28 | GC9A01 on board (CLK 10, MOSI 11, CS 9, DC 8, RST 14, BL 2) | Build target; physical verification pending |
| `cyd-ili9341` | ESP32-2432S028 “Cheap Yellow Display” | ILI9341 on HSPI (SCK 14, MOSI 13, MISO 12, CS 15, DC 2, BL 21) | Build target; physical verification pending |
| `t-display-st7789` | LilyGO T-Display (ESP32) | ST7789 135×240 (SCK 18, MOSI 19, CS 5, DC 16, RST 23, BL 4), landscape | Build target; physical verification pending |
| `t-display-s3` | LilyGO T-Display-S3 | ST7789 170×320, 8-bit parallel (Arduino_GFX), landscape | Build target; physical verification pending |
| `m5-dial`, `m5-atoms3`, `m5-cores3`, `m5-stickc-plus2` | M5Stack Dial / AtomS3 / CoreS3 / StickC Plus2 | Built-in panels through M5Unified, which detects the board | Build target; physical verification pending |
| `esp32-s3-st7789-240x135`, `esp32-s3-st7789-320x240` | ESP32-S3-DevKitC-1 | ST7789 1.14″ 240×135 and 2.0″ 320×240 modules, landscape (same wiring) | Build target; physical verification pending |
| `esp32-s3-st7735-128x160`, `esp32-s3-st7735-160x80` | ESP32-S3-DevKitC-1 | ST7735 1.8″ 128×160 and 0.96″ 160×80 modules (same wiring) | Build target; physical verification pending |
| `esp32-s3-ili9488` | ESP32-S3-DevKitC-1 | ILI9488 3.5″ 480×320, 18-bit SPI via Arduino_GFX (same wiring) | Build target; physical verification pending |
| `xiao-round-display` | Seeed XIAO ESP32S3 + Round Display for XIAO | GC9A01 (CS D1, DC D3, BL D6) | Build target; physical verification pending |
| `esp32-s3-box-3` | Espressif ESP32-S3-BOX-3 | ILI9342C 320×240 (pins from esp-bsp) | Build target; physical verification pending |
| `waveshare-amoled-175` | Waveshare ESP32-S3-Touch-AMOLED-1.75 | CO5300 466×466 on quad SPI (pins from the ESPHome device page) | Build target; physical verification pending |
| `t-rgb-21` | LilyGO T-RGB 2.1″ | ST7701S 480×480 RGB panel via XL9535, octal PSRAM | Build target; physical verification pending |
| `guition-4848s040` | Guition ESP32-4848S040 (86 box) | ST7701S 480×480 RGB panel, octal PSRAM | Build target; physical verification pending |
| `nucleo-f411re-st7789` | ST NUCLEO-F411RE (STM32F411) | ST7789, 240×240 SPI TFT on the Arduino header | Build target; physical verification pending |
| `blackpill-f411-ssd1306` | WeAct Black Pill STM32F411CE | SSD1306, 128×64 I²C OLED, address `0x3C` | Build target; physical verification pending |

`examples/arduino/boards.h` holds one small display adapter per configuration; the main program is shared. Pin numbers follow the vendors' documentation (Waveshare wiki, LilyGO `pin_config.h`, the CYD community pin list). The Dial and StickC Plus2 build on the StampS3 and M5Stick-C board definitions of the pinned PlatformIO platform; M5Unified identifies the actual board at runtime. Round panels enable the core's circular layout. T-RGB, the Guition panel and the BOX-3 follow the device configurations bundled with Arduino_GFX 1.4.9; the AMOLED pins come from the ESPHome device page rather than a vendor file. Known things to check on real hardware: ST7735 boards come in several variants (try `INITR_GREENTAB` if the picture is offset or garbled); the CO5300 may need a small column offset; T-RGB revisions differ in their ST7701 init sequence. The eyes are white on black, so a swapped red/blue order does not show. If you run one of these on real hardware, please open a *Hardware report* issue so the preview can mark it as community-verified.

The TFT example reserves a centered 240×160 eye viewport. Its mask is 4,800 bytes plus a 480-byte RGB565 conversion row. The OLED mask is 1,024 bytes; its driver also owns a display buffer. These numbers exclude the engine, driver and framework overhead. No PSRAM is required by the core. Actual frame rate depends on the CPU, screen and bus; the example's 25 FPS setting is a ceiling, not a measured throughput claim.

### Wiring

Use the **GPIO names**, not the physical header pin numbers. This example assumes a 3.3 V-compatible screen module with exposed CS, DC and reset. Built-in screens and other module revisions need their own pin configuration and initialization.

| ST7789 connection | ESP32-S3 GPIO | Pico GPIO | NUCLEO-F411RE |
| --- | --- | --- | --- |
| SCK / SCL | 12 | GP18 | D13 (PA5) |
| MOSI / SDA | 11 | GP19 | D11 (PA7) |
| CS | 10 | GP17 | D10 (PB6) |
| DC | 9 | GP20 | D9 (PC7) |
| RST / RES | 8 | GP21 | D8 (PA9) |
| GND | GND | GND | GND |
| VCC | 3.3 V | 3.3 V | 3V3 |

MISO is unused. Backlight wiring depends on the screen module; follow its specification. The example does not drive a backlight pin. For the ESP32 OLED reference, connect SDA to GPIO21, SCL to GPIO22, GND to GND and the compatible module's VCC to 3.3 V. Change `0x3C` if the OLED uses another address. On the Black Pill, connect the OLED's SDA to PB7 and SCL to PB6; upload over USB in DFU mode (hold BOOT0 and tap NRST), and the serial commands arrive over the same USB cable. The NUCLEO uploads and talks serial through its ST-LINK USB port.

### Build and run

Install [PlatformIO Core](https://docs.platformio.org/en/latest/core/installation/index.html), then from the repository root:

```sh
pio run -d embedded -e esp32-s3-st7789
pio run -d embedded -e pico-st7789
pio run -d embedded -e esp32-ssd1306
```

To build with settings tuned in the preview, see [From the preview to your board](#from-the-preview-to-your-board).

Upload **only the environment matching your board and wiring**:

```sh
pio run -d embedded -e esp32-s3-st7789 -t upload
pio device monitor -b 115200
```

Pico USB upload/serial behavior and ESP32 USB versus UART port selection depend on the board, boot mode and host. Specify your upload or monitor port when needed. The firmware initializes into idle without waiting for a serial connection. Send newline-terminated commands at 115200 baud:

```text
help
love
waiting
success
sleep
wake
gaze -0.5 0.2
demo
reset
```

`demo` cycles the expressions. A valid manual action stops the cycle. `reset` returns to idle. Commands are bounded to 47 bytes; an overlong line is discarded rather than interpreted partially. Gaze coordinates are normalized to `[-1,1]` and are explicit host input, not mouse following.

## Embed the engine in another product

Copy `lib/AgentRobotEyes` into an Arduino `libraries` folder (or, once released, add its ZIP with *Sketch → Include Library → Add .ZIP Library*), or compile its source directory into your C++11 application. For non-Arduino projects, no Arduino library is needed.

The library ships two Arduino IDE examples under *File → Examples → AgentRobotEyes*: **SerialEyes** draws the eyes as text in the Serial Monitor and needs no screen, and **OledSSD1306** runs them on a 0.96″ 128×64 I²C OLED (install *Adafruit SSD1306* first). Both take action names typed in the Serial Monitor. CI compiles them for ESP32 and RP2040.

```cpp
#include <AgentRobotEyes.h>
agent_robot::Eyes eyes;
uint8_t pixels[4800]; // 240 x 160, 1 bit per pixel

bool initEyes(uint32_t nowMs) {
  agent_robot::EyesConfig config;
  if (!eyes.begin(config, pixels, sizeof pixels, nowMs)) return false;
  eyes.startWaiting(nowMs);
  return true;
}

void tick(uint32_t nowMs) {
  if (eyes.update(nowMs)) {
    // Send eyes.data() to your display adapter.
  }
}

void taskFinished(uint32_t nowMs, bool ok) {
  eyes.play(ok ? "success" : "failure", nowMs);
}
```

The application provides an advancing `uint32_t` millisecond clock. A clock rollover is supported; do not change clock domains or send backwards timestamps. Call the engine from one task or serialize access yourself. Every frame is a complete opaque 1-bit mask: rows are MSB-first, each row occupies `(width + 7) / 8` bytes, and padding bits stay zero. Map 1 to an eye color and 0 to the background. Drivers with another packing scheme must convert it; do not copy it directly into SSD1306 native page memory. The example uses the driver's `drawBitmap()` conversion.

`begin()` validates dimensions (16–512 per axis), caller-owned buffer capacity, FPS (1–60), and transition duration (0–2000 ms). The buffer must outlive the engine and must not overlap its object. A failed `begin()` leaves an existing valid configuration intact. There is no buffer allocation or screen-driver initialization inside the engine.

## Actions and lifecycle

`idle`, `bored`, `waiting-spin`, `waiting-wrap`, `input`, `affirm`, `success`, `failure`, `wary`, `inspect`, `angry`, `refuse`, `surprise`, `love`, `random`, `sleep`, `wake`, `waiting-wave`.

`waiting-wave` is an additional persistent waiting variant restored from the first experimental C++ implementation: two elliptical eyes bob with a 1400 ms period and staggered phase. The original waiting variants remain available. The SVG waiting-wave variant is separately tuned to three 1100 ms cycles; this hardware variant retains its earlier continuous 1400 ms motion. Its numeric ID is appended after `wake` to retain existing command IDs.

The names match the Web avatar and describe what the eyes do. `waiting` also starts `waiting-spin`. Names from 0.5 still parse until 1.0: `wait` → `waiting-spin`; `send` → `affirm`; `warning` → `wary`; `blocked` / `policy-blocked` → `angry`; `error` / `system-error` / `connection-error` → `refuse`; `failed` / `fail` → `failure`; `verify` / `review` → `inspect`; `slot` → `random`. `Action::Affirm`, `Wary`, `Angry`, `Refuse` and `WaitingSpin` keep the numeric IDs of the old enumerators.

- `play(name, nowMs)` returns false for an invalid command and leaves the active action unchanged.
- One-shot expressions return to idle. Idle, waiting, input and sleep persist until another command.
- A new action replaces the previous action; there are no deferred callbacks that can finish an older action later.
- Repeating the current waiting, input or sleep action does not restart it.
- `stopWaiting(nowMs)` only stops waiting; it leaves other actions alone.
- Settled sleep stops drawing. `wake(nowMs)` only acts when sleeping.
- `lookAt(x,y)` clamps finite coordinates, normalizes non-finite input to zero, and does not wake sleeping eyes. Gaze applies only to idle, preserving the original eye motion of active expressions.
- `setTiming(maxFps, autoBlink, transitionMs)` changes frame rate, blinking and transition time without restarting the current action; it accepts the same ranges as `begin()`.
- `EyesConfig::gazeRange` (or `setGazeRange()` at runtime) sets how far `lookAt(±1, ±1)` moves the eyes in the 160 × 100 face area: `Small` 8 × 6 (the original reach), `Medium` 20 × 18 (default; reaches the edge of the face area) and `Large` 30 × 21 (slightly past it). Near the edge the eyes narrow and shift inward with the Web avatar's formula, so a sideways look reads as turning. A centred gaze draws exactly the same pose at every range.
- Dragging, head deformation, antenna controls and Web DOM events are not part of this API.

## Checks

```sh
bash embedded/tools/test-native.sh
```

The host test uses GCC/Clang address and undefined-behavior sanitizers. CI separately compiles all three reference environments. Hardware-specific acceptance still requires checking boot, screen orientation, reset/backlight behavior, every expression, actual FPS and coexistence with the host application's other work.

For a host-rendered frame:

```sh
g++ -std=c++11 -I embedded/lib/AgentRobotEyes/src \
  embedded/lib/AgentRobotEyes/src/AgentRobotEyes.cpp \
  embedded/tools/render-frame.cpp -o /tmp/render-eyes
/tmp/render-eyes love 900 > /tmp/love.pbm
```

### Technical references

- [ESP32-S3-DevKitC-1](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/index.html)
- [PlatformIO ESP32-S3 target](https://docs.platformio.org/en/latest/boards/espressif32/esp32-s3-devkitc-1.html)
- [PlatformIO Pico target](https://docs.platformio.org/en/latest/boards/raspberrypi/pico.html)
- [Adafruit GFX canvas and bitmap formats](https://learn.adafruit.com/adafruit-gfx-graphics-library/minimizing-redraw-flicker)

The library is an original adaptation of this project's own expressions. Third-party display drivers remain under their own licenses; they are not copied into this library. Project support: [Ko-fi](https://ko-fi.com/P0E625WIOI).

