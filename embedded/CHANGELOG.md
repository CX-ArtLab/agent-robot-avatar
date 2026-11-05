# BoopFace Embedded changelog

Changes to the embedded eyes library for robot and dev-board screens. It is versioned and released separately from the Web component (`eyes-v*` tags, not published to npm).

## [0.1.0] - 2026-11-05

First experimental release. All reference configurations compile in CI; physical verification is pending. Install the standalone ZIP until registry listings are available.

### Added

- A portable, allocation-free C++11 library that draws the same 18 expressions as the Web avatar on 1-bit framebuffers from 16 to 512 pixels, with fit/fill/zoom layouts, round-screen clipping, proximity gaze with selectable range, and runtime timing changes. Action names match the Web avatar 0.8 (`affirm`, `wary`, `angry`, `refuse`, `waiting-spin`, ...); the older Web names still parse.
- Firmware examples for 28 board and screen configurations (ESP32, ESP32-S3, STM32 and RP2040; ST7789, ST7735, GC9A01, ILI9341, ILI9342C, ILI9488, CO5300 AMOLED, ST7701S RGB panels, SSD1306 and SH1106 OLEDs; LilyGO, M5Stack, Waveshare, Seeed, Espressif, Guition, ST and WeAct boards). All compile in CI; none is verified on real hardware yet, so please send a hardware report if you try one.
- The hardware preview, an offline single-file page that runs the same C++ engine compiled to WebAssembly on 32 simulated screens, with panel-accurate display, module housings, actual-size zoom, wiring tables and a proximity-gaze simulator.
- Two Arduino IDE examples inside the library: SerialEyes (text eyes in the Serial Monitor, no screen needed) and OledSSD1306 (0.96″ I²C OLED). CI compiles them for ESP32 and RP2040.
- A Hardware report issue form for confirming board examples on real hardware.

- BoopFace Embedded naming: `<BoopFace.h>`, `boopface::Eyes`, and a standalone Arduino ZIP with examples and MIT license.
- Simulator language selector: English, Simplified/Traditional Chinese, Japanese, Korean, Spanish, Portuguese, German, French and Russian. Exported `eyes_settings.h` comments follow the selected language.
- Per-screen settings export for layout, colours, frame rate, blinking, transitions and screen rotation.
