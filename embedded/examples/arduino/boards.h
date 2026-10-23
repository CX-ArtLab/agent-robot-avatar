#pragma once
// Display adapters for the reference firmware. Exactly one board is selected
// by a build flag in platformio.ini. Each block provides:
//   WIDTH, HEIGHT  framebuffer size in pixels (the core draws into this mask)
//   ROUND          true for circular panels (pixels outside the circle stay off)
//   OFFSET_Y       rows above the framebuffer on the panel (Adafruit SPI panels)
//   displayBegin() power, bus and panel initialization; false on failure
//   displayPresent(eyes) sends the 1-bit mask (MSB first, rows padded to bytes)
// Pin numbers come from each manufacturer's documentation, or for a few boards
// from the Arduino_GFX and ESPHome board lists (see README); none of these
// boards has been tested on real hardware yet.

#include <Arduino.h>
#include <AgentRobotEyes.h>

constexpr uint16_t INK = 0xFFFF, BACKGROUND = 0x0000;

#if defined(EYES_TFT) || defined(EYES_BOARD_GC9A01) || defined(EYES_BOARD_WAVESHARE_ROUND_128) || \
    defined(EYES_BOARD_CYD) || defined(EYES_BOARD_T_DISPLAY) || defined(EYES_BOARD_ST7789) || \
    defined(EYES_BOARD_ST7735) || defined(EYES_BOARD_XIAO_ROUND)
#define EYES_ADAFRUIT_SPITFT
#include <SPI.h>
#endif
#if defined(EYES_BOARD_T_DISPLAY_S3) || defined(EYES_BOARD_ILI9488) || defined(EYES_BOARD_S3_BOX_3) || \
    defined(EYES_BOARD_AMOLED_175) || defined(EYES_BOARD_T_RGB) || defined(EYES_BOARD_GUITION_4848)
#define EYES_ARDUINO_GFX
#include <Arduino_GFX_Library.h>
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
// reference. EYES_PANEL_W / EYES_PANEL_H give the framebuffer; a landscape
// build also gives the panel's native portrait size and EYES_ROTATION=1.
#include <Adafruit_ST7789.h>
#if !defined(EYES_ROTATION)
#define EYES_ROTATION 0
#define EYES_NATIVE_W EYES_PANEL_W
#define EYES_NATIVE_H EYES_PANEL_H
#endif
constexpr int TFT_CS = 10, TFT_DC = 9, TFT_RST = 8;
Adafruit_ST7789 display(&SPI, TFT_CS, TFT_DC, TFT_RST);
constexpr uint16_t WIDTH = EYES_PANEL_W, HEIGHT = EYES_PANEL_H, OFFSET_Y = 0;
constexpr bool ROUND = false;
bool displayBegin() {
  SPI.begin(12, -1, 11, TFT_CS);
  display.init(EYES_NATIVE_W, EYES_NATIVE_H);
  display.setRotation(EYES_ROTATION);
  display.setSPISpeed(40000000);
  display.fillScreen(BACKGROUND);
  return true;
}

// ---------------------------------------------------------------------------
#elif defined(EYES_BOARD_ST7735)
// Generic ST7735 module on an ESP32-S3-DevKitC, same wiring as the ST7789
// modules. EYES_ST7735_TAB picks Adafruit's init variant: INITR_BLACKTAB for
// 1.8" 128 x 160 boards, INITR_MINI160x80 for 0.96" 80 x 160 strips.
#include <Adafruit_ST7735.h>
#if !defined(EYES_ROTATION)
#define EYES_ROTATION 0
#endif
constexpr int TFT_CS = 10, TFT_DC = 9, TFT_RST = 8;
Adafruit_ST7735 display(&SPI, TFT_CS, TFT_DC, TFT_RST);
constexpr uint16_t WIDTH = EYES_PANEL_W, HEIGHT = EYES_PANEL_H, OFFSET_Y = 0;
constexpr bool ROUND = false;
bool displayBegin() {
  SPI.begin(12, -1, 11, TFT_CS);
  display.initR(EYES_ST7735_TAB);
  display.setRotation(EYES_ROTATION);
  display.setSPISpeed(27000000);
  display.fillScreen(BACKGROUND);
  return true;
}

// ---------------------------------------------------------------------------
#elif defined(EYES_BOARD_XIAO_ROUND)
// Seeed Round Display for XIAO on a XIAO ESP32S3: GC9A01, CS D1, DC D3,
// backlight D6, SPI on the XIAO's default SCK/MOSI pins (D8/D10).
#include <Adafruit_GC9A01A.h>
Adafruit_GC9A01A display(&SPI, D3, D1, -1);
constexpr uint16_t WIDTH = 240, HEIGHT = 240, OFFSET_Y = 0;
constexpr bool ROUND = true;
bool displayBegin() {
  pinMode(D6, OUTPUT); digitalWrite(D6, HIGH);
  SPI.begin();
  display.begin(40000000);
  display.setRotation(0);
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

// ---------------------------------------------------------------------------
#elif defined(EYES_BOARD_ILI9488)
// Generic 3.5" ILI9488 480 x 320 SPI module on an ESP32-S3-DevKitC (same
// wiring as the ST7789 modules). Over SPI the ILI9488 takes 18-bit colour.
Arduino_DataBus* bus = new Arduino_ESP32SPI(9 /* DC */, 10 /* CS */, 12 /* SCK */, 11 /* MOSI */, GFX_NOT_DEFINED /* MISO */);
Arduino_GFX* display = new Arduino_ILI9488_18bit(bus, 8 /* RST */, 1 /* landscape */, false /* IPS */);
constexpr uint16_t WIDTH = 480, HEIGHT = 320, OFFSET_Y = 0;
constexpr bool ROUND = false;
bool displayBegin() {
  if (!display->begin()) return false;
  display->fillScreen(BACKGROUND);
  return true;
}

// ---------------------------------------------------------------------------
#elif defined(EYES_BOARD_S3_BOX_3)
// Espressif ESP32-S3-BOX-3: ILI9342C 320 x 240 (pins from esp-bsp).
constexpr int BOX_BL = 47;
Arduino_DataBus* bus = new Arduino_ESP32SPI(4 /* DC */, 5 /* CS */, 7 /* SCK */, 6 /* MOSI */, GFX_NOT_DEFINED /* MISO */);
Arduino_GFX* display = new Arduino_ILI9342(bus, 48 /* RST */, 0 /* rotation */);
constexpr uint16_t WIDTH = 320, HEIGHT = 240, OFFSET_Y = 0;
constexpr bool ROUND = false;
bool displayBegin() {
  pinMode(BOX_BL, OUTPUT); digitalWrite(BOX_BL, HIGH);
  if (!display->begin()) return false;
  display->fillScreen(BACKGROUND);
  return true;
}

// ---------------------------------------------------------------------------
#elif defined(EYES_BOARD_AMOLED_175)
// Waveshare ESP32-S3-Touch-AMOLED-1.75: CO5300 466 x 466 on quad SPI. Pins
// from the ESPHome device page; the panel may need a small column offset.
Arduino_DataBus* bus = new Arduino_ESP32QSPI(12 /* CS */, 38 /* SCK */, 4 /* D0 */, 5 /* D1 */, 6 /* D2 */, 7 /* D3 */);
Arduino_GFX* display = new Arduino_CO5300(bus, 39 /* RST */, 0 /* rotation */, false /* IPS */, 466, 466);
constexpr uint16_t WIDTH = 466, HEIGHT = 466, OFFSET_Y = 0;
constexpr bool ROUND = true;
bool displayBegin() {
  if (!display->begin()) return false;
  display->fillScreen(BACKGROUND);
  return true;
}

// ---------------------------------------------------------------------------
#elif defined(EYES_BOARD_T_RGB)
// LilyGO T-RGB 2.1" round: ST7701S 480 x 480 RGB panel, initialised over an
// XL9535 I/O expander. Configuration from Arduino_GFX's LILYGO_T_RGB device.
#include <Wire.h>
constexpr int TRGB_BL = 46;
Arduino_DataBus* bus = new Arduino_XL9535SWSPI(8 /* SDA */, 48 /* SCL */, 2 /* XL PWD */, 3 /* XL CS */, 5 /* XL SCK */, 4 /* XL MOSI */);
Arduino_ESP32RGBPanel* rgbpanel = new Arduino_ESP32RGBPanel(
    45 /* DE */, 41 /* VSYNC */, 47 /* HSYNC */, 42 /* PCLK */,
    21, 18, 17, 16, 15 /* R0-R4 */, 14, 13, 12, 11, 10, 9 /* G0-G5 */, 7, 6, 5, 3, 2 /* B0-B4 */,
    1, 50, 1, 30 /* hsync polarity, front porch, pulse, back porch */,
    1, 20, 1, 30 /* vsync polarity, front porch, pulse, back porch */, 1 /* pclk_active_neg */);
Arduino_GFX* display = new Arduino_RGB_Display(480, 480, rgbpanel, 0 /* rotation */, true /* auto flush */,
    bus, GFX_NOT_DEFINED /* RST */, st7701_type4_init_operations, sizeof(st7701_type4_init_operations));
constexpr uint16_t WIDTH = 480, HEIGHT = 480, OFFSET_Y = 0;
constexpr bool ROUND = true;
bool displayBegin() {
  Wire.begin(8, 48, 800000L);
  if (!display->begin()) return false;
  pinMode(TRGB_BL, OUTPUT); digitalWrite(TRGB_BL, HIGH);
  display->fillScreen(BACKGROUND);
  return true;
}

// ---------------------------------------------------------------------------
#elif defined(EYES_BOARD_GUITION_4848)
// Guition ESP32-4848S040 4" 86-box panel: ST7701S 480 x 480 RGB panel,
// initialised over software SPI. Configuration from Arduino_GFX's
// ESP32_4848S040_86BOX_GUITION device.
constexpr int GUITION_BL = 38;
Arduino_DataBus* bus = new Arduino_SWSPI(GFX_NOT_DEFINED /* DC */, 39 /* CS */, 48 /* SCK */, 47 /* MOSI */, GFX_NOT_DEFINED /* MISO */);
Arduino_ESP32RGBPanel* rgbpanel = new Arduino_ESP32RGBPanel(
    18 /* DE */, 17 /* VSYNC */, 16 /* HSYNC */, 21 /* PCLK */,
    11, 12, 13, 14, 0 /* R0-R4 */, 8, 20, 3, 46, 9, 10 /* G0-G5 */, 4, 5, 6, 7, 15 /* B0-B4 */,
    1, 10, 8, 50 /* hsync polarity, front porch, pulse, back porch */,
    1, 10, 8, 20 /* vsync polarity, front porch, pulse, back porch */);
Arduino_GFX* display = new Arduino_RGB_Display(480, 480, rgbpanel, 1 /* rotation */, true /* auto flush */,
    bus, GFX_NOT_DEFINED /* RST */, st7701_type9_init_operations, sizeof(st7701_type9_init_operations));
constexpr uint16_t WIDTH = 480, HEIGHT = 480, OFFSET_Y = 0;
constexpr bool ROUND = false;
bool displayBegin() {
  if (!display->begin()) return false;
  pinMode(GUITION_BL, OUTPUT); digitalWrite(GUITION_BL, HIGH);
  display->fillScreen(BACKGROUND);
  return true;
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

#if defined(EYES_ARDUINO_GFX)
// Stream one RGB565 row at a time through Arduino_GFX.
uint16_t rowPixels[WIDTH];
void displayPresent(const agent_robot::Eyes& eyes) {
  for (uint16_t y = 0; y < HEIGHT; ++y) {
    const uint8_t* source = eyes.data() + y * eyes.stride();
    for (uint16_t x = 0; x < WIDTH; ++x) {
      rowPixels[x] = source[x >> 3] & (0x80u >> (x & 7)) ? INK : BACKGROUND;
    }
    display->draw16bitRGBBitmap(0, y, rowPixels, WIDTH, 1);
  }
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
