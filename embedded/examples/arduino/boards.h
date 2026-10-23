#pragma once
// Display adapters for the reference firmware. Exactly one board is selected
// by a build flag in platformio.ini. Each block provides:
//   WIDTH, HEIGHT  framebuffer size in pixels (the core draws into this mask)
//   ROUND          true for circular panels (pixels outside the circle stay off)
//   VIEW_*         optional eye viewport inside the framebuffer (0 = whole screen)
//   displayBegin() power, bus and panel initialization; false on failure
//   displayPresent(eyes) sends the 1-bit mask (MSB first, rows padded to bytes)
// Pin numbers come from each manufacturer's documentation (see README); none of
// these boards has been tested on real hardware yet.

#include <Arduino.h>
#include <AgentRobotEyes.h>

constexpr uint16_t INK = 0xFFFF, BACKGROUND = 0x0000;

#if defined(EYES_TFT) || defined(EYES_BOARD_GC9A01) || defined(EYES_BOARD_WAVESHARE_ROUND_128) || \
    defined(EYES_BOARD_CYD) || defined(EYES_BOARD_T_DISPLAY) || defined(EYES_BOARD_ST7789)
#define EYES_ADAFRUIT_SPITFT
#include <SPI.h>
#endif

// ---------------------------------------------------------------------------
#if defined(EYES_TFT)
// Original reference: ST7789 240 x 240 module, 240 x 160 eyes centred.
#include <Adafruit_ST7789.h>
#if defined(EYES_ESP32_S3)
constexpr int TFT_CS = 10, TFT_DC = 9, TFT_RST = 8;
#else
constexpr int TFT_CS = 17, TFT_DC = 20, TFT_RST = 21;
#endif
Adafruit_ST7789 display(&SPI, TFT_CS, TFT_DC, TFT_RST);
constexpr uint16_t WIDTH = 240, HEIGHT = 160, OFFSET_Y = 40;
constexpr bool ROUND = false;
bool displayBegin() {
#if defined(EYES_ESP32_S3)
  SPI.begin(12, -1, 11, TFT_CS); // SCK, MISO (unused), MOSI, CS
#else
  SPI.begin(); // Pico defaults: SCK GP18, MOSI GP19, MISO GP16 (unused)
#endif
  display.init(240, 240);
  display.setRotation(0);
  display.setSPISpeed(24000000);
  display.fillScreen(BACKGROUND);
  return true;
}

// ---------------------------------------------------------------------------
#elif defined(EYES_BOARD_ST7789)
// Generic ST7789 module on an ESP32-S3-DevKitC, same wiring as the original
// reference. EYES_PANEL_W / EYES_PANEL_H select 240x240, 240x280 or 240x320.
#include <Adafruit_ST7789.h>
constexpr int TFT_CS = 10, TFT_DC = 9, TFT_RST = 8;
Adafruit_ST7789 display(&SPI, TFT_CS, TFT_DC, TFT_RST);
constexpr uint16_t WIDTH = EYES_PANEL_W, HEIGHT = EYES_PANEL_H, OFFSET_Y = 0;
constexpr bool ROUND = false;
bool displayBegin() {
  SPI.begin(12, -1, 11, TFT_CS);
  display.init(WIDTH, HEIGHT);
  display.setRotation(0);
  display.setSPISpeed(40000000);
  display.fillScreen(BACKGROUND);
  return true;
}

// ---------------------------------------------------------------------------
#elif defined(EYES_BOARD_GC9A01)
// Generic GC9A01 1.28" round module on an ESP32-S3-DevKitC.
#include <Adafruit_GC9A01A.h>
constexpr int TFT_CS = 10, TFT_DC = 9, TFT_RST = 8;
Adafruit_GC9A01A display(&SPI, TFT_DC, TFT_CS, TFT_RST);
constexpr uint16_t WIDTH = 240, HEIGHT = 240, OFFSET_Y = 0;
constexpr bool ROUND = true;
bool displayBegin() {
  SPI.begin(12, -1, 11, TFT_CS);
  display.begin(40000000);
  display.setRotation(0);
  display.fillScreen(BACKGROUND);
  return true;
}

// ---------------------------------------------------------------------------
#elif defined(EYES_BOARD_WAVESHARE_ROUND_128)
// Waveshare ESP32-S3-Touch-LCD-1.28: GC9A01 on the board's own SPI pins.
#include <Adafruit_GC9A01A.h>
constexpr int TFT_SCK = 10, TFT_MOSI = 11, TFT_MISO = 12, TFT_CS = 9, TFT_DC = 8, TFT_RST = 14, TFT_BL = 2;
Adafruit_GC9A01A display(&SPI, TFT_DC, TFT_CS, TFT_RST);
constexpr uint16_t WIDTH = 240, HEIGHT = 240, OFFSET_Y = 0;
constexpr bool ROUND = true;
bool displayBegin() {
  pinMode(TFT_BL, OUTPUT); digitalWrite(TFT_BL, HIGH);
  SPI.begin(TFT_SCK, TFT_MISO, TFT_MOSI, TFT_CS);
  display.begin(40000000);
  display.setRotation(0);
  display.fillScreen(BACKGROUND);
  return true;
}

// ---------------------------------------------------------------------------
#elif defined(EYES_BOARD_CYD)
// ESP32-2432S028 "Cheap Yellow Display": ILI9341 on HSPI, reset tied to EN.
#include <Adafruit_ILI9341.h>
constexpr int TFT_SCK = 14, TFT_MISO = 12, TFT_MOSI = 13, TFT_CS = 15, TFT_DC = 2, TFT_BL = 21;
SPIClass hspi(HSPI);
Adafruit_ILI9341 display(&hspi, TFT_DC, TFT_CS, -1);
constexpr uint16_t WIDTH = 320, HEIGHT = 240, OFFSET_Y = 0;
constexpr bool ROUND = false;
bool displayBegin() {
  pinMode(TFT_BL, OUTPUT); digitalWrite(TFT_BL, HIGH);
  hspi.begin(TFT_SCK, TFT_MISO, TFT_MOSI, TFT_CS);
  display.begin(40000000);
  display.setRotation(1); // landscape, 320 x 240
  display.fillScreen(BACKGROUND);
  return true;
}

// ---------------------------------------------------------------------------
#elif defined(EYES_BOARD_T_DISPLAY)
// LilyGO T-Display (ESP32): ST7789 1.14" 135 x 240, used landscape.
#include <Adafruit_ST7789.h>
constexpr int TFT_SCK = 18, TFT_MOSI = 19, TFT_CS = 5, TFT_DC = 16, TFT_RST = 23, TFT_BL = 4;
Adafruit_ST7789 display(&SPI, TFT_CS, TFT_DC, TFT_RST);
constexpr uint16_t WIDTH = 240, HEIGHT = 135, OFFSET_Y = 0;
constexpr bool ROUND = false;
bool displayBegin() {
  pinMode(TFT_BL, OUTPUT); digitalWrite(TFT_BL, HIGH);
  SPI.begin(TFT_SCK, -1, TFT_MOSI, TFT_CS);
  display.init(135, 240);
  display.setRotation(1); // landscape, 240 x 135
  display.setSPISpeed(40000000);
  display.fillScreen(BACKGROUND);
  return true;
}

// ---------------------------------------------------------------------------
#elif defined(EYES_BOARD_T_DISPLAY_S3)
// LilyGO T-Display-S3: ST7789 170 x 320 on an 8-bit parallel bus, used landscape.
#include <Arduino_GFX_Library.h>
constexpr int EYES_LCD_POWER = 15, EYES_LCD_BL = 38;
Arduino_DataBus* bus = new Arduino_ESP32PAR8Q(7 /* DC */, 6 /* CS */, 8 /* WR */, 9 /* RD */,
    39, 40, 41, 42, 45, 46, 47, 48 /* D0-D7 */);
Arduino_GFX* display = new Arduino_ST7789(bus, 5 /* RST */, 1 /* landscape */, true /* IPS */,
    170, 320, 35, 0, 35, 0 /* column/row offsets */);
constexpr uint16_t WIDTH = 320, HEIGHT = 170, OFFSET_Y = 0;
constexpr bool ROUND = false;
bool displayBegin() {
  pinMode(EYES_LCD_POWER, OUTPUT); digitalWrite(EYES_LCD_POWER, HIGH);
  pinMode(EYES_LCD_BL, OUTPUT); digitalWrite(EYES_LCD_BL, HIGH);
  if (!display->begin()) return false;
  display->fillScreen(BACKGROUND);
  return true;
}
void displayPresent(const agent_robot::Eyes& eyes) {
  display->drawBitmap(0, 0, eyes.data(), WIDTH, HEIGHT, INK, BACKGROUND);
}

// ---------------------------------------------------------------------------
#elif defined(EYES_BOARD_M5)
// M5Stack boards through M5Unified, which knows each board's pins. The build
// flag gives the framebuffer size; the display is turned to match it.
#include <M5Unified.h>
constexpr uint16_t WIDTH = EYES_PANEL_W, HEIGHT = EYES_PANEL_H, OFFSET_Y = 0;
#if defined(EYES_PANEL_ROUND)
constexpr bool ROUND = true;
#else
constexpr bool ROUND = false;
#endif
bool displayBegin() {
  M5.begin();
  if (M5.Display.width() != WIDTH) M5.Display.setRotation(M5.Display.getRotation() ^ 1);
  if (M5.Display.width() != WIDTH || M5.Display.height() != HEIGHT) return false;
  M5.Display.fillScreen(BACKGROUND);
  return true;
}
void displayPresent(const agent_robot::Eyes& eyes) {
  M5.Display.drawBitmap(0, 0, eyes.data(), WIDTH, HEIGHT, INK, BACKGROUND);
}

// ---------------------------------------------------------------------------
#elif defined(EYES_BOARD_SH1106)
// SH1106 1.3" 128 x 64 OLED on I2C (ESP32 default pins 21/22).
#include <Wire.h>
#include <Adafruit_SH110X.h>
Adafruit_SH1106G display(128, 64, &Wire, -1);
constexpr uint16_t WIDTH = 128, HEIGHT = 64, OFFSET_Y = 0;
constexpr bool ROUND = false;
bool displayBegin() {
  Wire.begin(21, 22);
  if (!display.begin(0x3C, true)) return false;
  Wire.setClock(400000);
  return true;
}
void displayPresent(const agent_robot::Eyes& eyes) {
  display.clearDisplay();
  display.drawBitmap(0, 0, eyes.data(), WIDTH, HEIGHT, SH110X_WHITE);
  display.display();
}

// ---------------------------------------------------------------------------
#else
// SSD1306 OLED on I2C (ESP32 default pins 21/22). EYES_PANEL_H selects the
// 0.96" 128 x 64 (default, original reference) or the 0.91" 128 x 32 panel.
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#if !defined(EYES_PANEL_H)
#define EYES_PANEL_H 64
#endif
Adafruit_SSD1306 display(128, EYES_PANEL_H, &Wire, -1);
constexpr uint16_t WIDTH = 128, HEIGHT = EYES_PANEL_H, OFFSET_Y = 0;
constexpr bool ROUND = false;
bool displayBegin() {
  Wire.begin(21, 22);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) return false;
  Wire.setClock(400000);
  return true;
}
void displayPresent(const agent_robot::Eyes& eyes) {
  display.clearDisplay();
  display.drawBitmap(0, 0, eyes.data(), WIDTH, HEIGHT, SSD1306_WHITE);
  display.display();
}
#endif

#if defined(EYES_ADAFRUIT_SPITFT)
// Stream one RGB565 row at a time: no full-screen 16-bit framebuffer needed.
uint16_t rowPixels[WIDTH];
void displayPresent(const agent_robot::Eyes& eyes) {
  display.startWrite();
  display.setAddrWindow(0, OFFSET_Y, WIDTH, HEIGHT);
  for (uint16_t y = 0; y < HEIGHT; ++y) {
    const uint8_t* source = eyes.data() + y * eyes.stride();
    for (uint16_t x = 0; x < WIDTH; ++x) {
      rowPixels[x] = source[x >> 3] & (0x80u >> (x & 7)) ? INK : BACKGROUND;
    }
    display.writePixels(rowPixels, WIDTH, true);
  }
  display.endWrite();
}
#endif
