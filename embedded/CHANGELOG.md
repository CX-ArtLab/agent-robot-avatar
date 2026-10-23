# AgentRobotEyes changelog

Changes to the embedded eyes library for robot and dev-board screens. It is versioned and released separately from the Web component (`eyes-v*` tags, not published to npm).

## [0.1.0] - 2026-10-23

First experimental release.

### Added

- A portable, allocation-free C++11 library that draws the same 18 expressions as the Web avatar on 1-bit framebuffers from 16 to 512 pixels, with fit/fill/zoom layouts, round-screen clipping, proximity gaze with selectable range, and runtime timing changes. Action names match the Web avatar 0.6 (`affirm`, `wary`, `angry`, `refuse`, `waiting-spin`, ...); the older Web names still parse.
- Firmware examples for 26 board and screen configurations (ESP32, ESP32-S3 and RP2040; ST7789, ST7735, GC9A01, ILI9341, ILI9342C, ILI9488, CO5300 AMOLED, ST7701S RGB panels, SSD1306 and SH1106 OLEDs; LilyGO, M5Stack, Waveshare, Seeed, Espressif and Guition boards). All compile in CI; none is verified on real hardware yet, so please send a hardware report if you try one.
- The hardware preview, an offline single-file page that runs the same C++ engine compiled to WebAssembly on 33 simulated screens, with panel-accurate display, module housings, actual-size zoom, wiring tables and a proximity-gaze simulator. It is also online at https://cx-artlab.github.io/agent-robot-avatar/hardware/.
- A Hardware report issue form for confirming board examples on real hardware.

### Downloads

- `AgentRobotEyes-0.1.0.zip`: the library, ready for Arduino IDE (Sketch → Include Library → Add .ZIP Library) or PlatformIO.
- `agent-robot-eyes-preview.html`: the offline hardware preview.

[0.1.0]: https://github.com/CX-ArtLab/agent-robot-avatar/releases/tag/eyes-v0.1.0
