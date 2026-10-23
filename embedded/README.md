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

The preview runs **this exact embedded C++ engine compiled to WebAssembly**, not the separate Web avatar renderer. It offers 18 actions (17 original expressions plus the added waiting-wave variant), cycling/manual interruption, pause/step, playback speed, explicit gaze, blink/transition switches, and nine screen presets plus custom resolutions from 16 to 512 pixels per axis. Layout controls include aspect-preserving fit, crop-to-fill, zoom, offsets and circular clipping. Named presets use SVG front views of specific reference modules; see [artwork sources](preview/frames/README.md). TFT mode centers a 240×160 mask inside a 240×240 canvas, matching the Arduino example. OLED mode renders a 128×64 mask; it does not emulate the display driver's page conversion. Configuration changes restart the simulation, and hidden tabs freeze its clock. This validates animation, not board performance or screen electronics. See [preview/README.md](preview/README.md) for rebuilding and tests.

## Reference configurations

| PlatformIO environment | Controller | Display | Validation scope |
| --- | --- | --- | --- |
| `esp32-s3-st7789` | ESP32-S3-DevKitC-1 | ST7789, 240×240 SPI TFT | Build target; physical verification pending |
| `pico-st7789` | Raspberry Pi Pico / RP2040 | ST7789, 240×240 SPI TFT | Build target; physical verification pending |
| `esp32-ssd1306` | ESP32 Dev Module | SSD1306, 128×64 I²C OLED, address `0x3C` | Build target; physical verification pending |

The TFT example reserves a centered 240×160 eye viewport. Its mask is 4,800 bytes plus a 480-byte RGB565 conversion row. The OLED mask is 1,024 bytes; its driver also owns a display buffer. These numbers exclude the engine, driver and framework overhead. No PSRAM is required by the core. Actual frame rate depends on the CPU, screen and bus; the example's 25 FPS setting is a ceiling, not a measured throughput claim.

### Wiring

Use the **GPIO names**, not the physical header pin numbers. This example assumes a 3.3 V-compatible screen module with exposed CS, DC and reset. Built-in screens and other module revisions need their own pin configuration and initialization.

| ST7789 connection | ESP32-S3 GPIO | Pico GPIO |
| --- | --- | --- |
| SCK / SCL | 12 | GP18 |
| MOSI / SDA | 11 | GP19 |
| CS | 10 | GP17 |
| DC | 9 | GP20 |
| RST / RES | 8 | GP21 |
| GND | GND | GND |
| VCC | 3.3 V | 3.3 V |

MISO is unused. Backlight wiring depends on the screen module; follow its specification. The example does not drive a backlight pin. For the ESP32 OLED reference, connect SDA to GPIO21, SCL to GPIO22, GND to GND and the compatible module's VCC to 3.3 V. Change `0x3C` if the OLED uses another address.

### Build and run

Install [PlatformIO Core](https://docs.platformio.org/en/latest/core/installation/index.html), then from the repository root:

```sh
pio run -d embedded -e esp32-s3-st7789
pio run -d embedded -e pico-st7789
pio run -d embedded -e esp32-ssd1306
```

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

Copy `lib/AgentRobotEyes` into an Arduino `libraries` folder, or compile its source directory into your C++11 application. For non-Arduino projects, no Arduino library is needed.

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

`idle`, `bored`, `waiting`, `waiting-wrap`, `input`, `send`, `success`, `failure`, `warning`, `inspect`, `blocked`, `error`, `surprise`, `love`, `random`, `sleep`, `wake`, `waiting-wave`.

`waiting-wave` is an additional persistent waiting variant restored from the first experimental C++ implementation: two elliptical eyes bob with a 1400 ms period and staggered phase. The original waiting variants remain available. The SVG waiting-wave variant is separately tuned to three 1100 ms cycles; this hardware variant retains its earlier continuous 1400 ms motion. Its numeric ID is appended after `wake` to retain existing command IDs.

Aliases: `angry` / `policy-blocked` → `blocked`; `system-error` / `connection-error` → `error`; `slot` → `random`.

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

