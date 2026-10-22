#include <Arduino.h>
#include <AgentRobotEyes.h>
#include <stdlib.h>
#include <string.h>

#if defined(EYES_TFT)
#include <SPI.h>
#include <Adafruit_ST7789.h>
#if defined(EYES_ESP32_S3)
constexpr int TFT_CS = 10, TFT_DC = 9, TFT_RST = 8;
#else
constexpr int TFT_CS = 17, TFT_DC = 20, TFT_RST = 21;
#endif
Adafruit_ST7789 display(&SPI, TFT_CS, TFT_DC, TFT_RST);
constexpr uint16_t WIDTH = 240, HEIGHT = 160;
constexpr uint16_t INK = 0xFFFF, BACKGROUND = 0x0000;
uint16_t rowPixels[WIDTH];
#else
#include <Wire.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 display(128, 64, &Wire, -1);
constexpr uint16_t WIDTH = 128, HEIGHT = 64;
#endif

agent_robot::Eyes eyes;
uint8_t bitmap[((WIDTH + 7) / 8) * HEIGHT];
bool ready = false, cycle = false, commandOverflow = false;
char command[48];
size_t commandSize = 0;
uint32_t lastCycle = 0;
unsigned cycleIndex = 0;

void present() {
#if defined(EYES_TFT)
  // Stream one RGB565 row at a time: no full-screen 16-bit framebuffer needed.
  display.startWrite();
  display.setAddrWindow(0, 40, WIDTH, HEIGHT);
  for (uint16_t y = 0; y < HEIGHT; ++y) {
    const uint8_t* source = eyes.data() + y * eyes.stride();
    for (uint16_t x = 0; x < WIDTH; ++x) {
      rowPixels[x] = source[x >> 3] & (0x80u >> (x & 7)) ? INK : BACKGROUND;
    }
    display.writePixels(rowPixels, WIDTH, true);
  }
  display.endWrite();
#else
  display.clearDisplay();
  display.drawBitmap(0, 0, eyes.data(), WIDTH, HEIGHT, SSD1306_WHITE);
  display.display();
#endif
}

void help() {
  Serial.println("Agent Robot Eyes 0.1.0 (experimental)");
  Serial.println("Commands: idle bored waiting waiting-wrap input send success failure");
  Serial.println("warning inspect blocked error surprise love random sleep wake");
  Serial.println("Also: reset | demo | gaze -1..1 -1..1 | help");
}

void executeCommand(uint32_t now) {
  if (!strcmp(command, "help")) { help(); return; }
  if (!strcmp(command, "demo")) {
    cycle = true; cycleIndex = 0; lastCycle = now;
    eyes.reset(now); return;
  }
  if (!strncmp(command, "gaze ", 5)) {
    char* endX;
    char* endY;
    const float x = strtof(command + 5, &endX);
    const float y = strtof(endX, &endY);
    const bool missingY = endY == endX;
    while (*endY == ' ') ++endY;
    if (endX == command + 5 || missingY || *endY) {
      Serial.println("Use: gaze -1..1 -1..1"); return;
    }
    cycle = false;
    eyes.lookAt(x,y);
    return;
  }
  const bool reset = !strcmp(command, "reset");
  if (reset || eyes.play(command, now)) {
    cycle = false;
    if (reset) eyes.reset(now);
    Serial.println(agent_robot::Eyes::actionName(eyes.action()));
  } else Serial.println("Unknown command; type help.");
}

void setup() {
  Serial.begin(115200);
#if defined(EYES_TFT)
#if defined(EYES_ESP32_S3)
  SPI.begin(12, -1, 11, TFT_CS); // SCK, MISO (unused), MOSI, CS
#else
  SPI.begin(); // Pico defaults: SCK GP18, MOSI GP19, MISO GP16 (unused)
#endif
  display.init(240, 240);
  display.setRotation(0);
  display.setSPISpeed(24000000);
  display.fillScreen(BACKGROUND);
#else
  Wire.begin(21, 22);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("SSD1306 initialization failed."); return;
  }
  Wire.setClock(400000);
#endif
  agent_robot::EyesConfig config;
  config.width = WIDTH;
  config.height = HEIGHT;
  config.maxFps = 25; // ceiling; actual frame rate depends on the device and bus
  ready = eyes.begin(config, bitmap, sizeof(bitmap), millis());
  if (!ready) { Serial.println("Eyes buffer/configuration is invalid."); return; }
  help();
}

void loop() {
  if (!ready) return;
  const uint32_t now = millis();
  while (Serial.available()) {
    const char c = static_cast<char>(Serial.read());
    if (c == '\r') continue;
    if (c == '\n') {
      if (commandOverflow) Serial.println("Command too long; discarded.");
      else if (commandSize) {
        command[commandSize] = '\0';
        executeCommand(now);
      }
      commandSize = 0; commandOverflow = false;
    } else if (!commandOverflow) {
      if (commandSize < sizeof(command) - 1) command[commandSize++] = c;
      else commandOverflow = true;
    }
  }
  if (cycle && now - lastCycle >= 4000) {
    cycleIndex = (cycleIndex + 1) % static_cast<unsigned>(agent_robot::Action::Count);
    eyes.play(static_cast<agent_robot::Action>(cycleIndex), now);
    lastCycle = now;
    Serial.println(agent_robot::Eyes::actionName(eyes.action()));
  }
  if (eyes.update(now)) present();
  // No delay(): the host can handle sensors, audio or networking between frames.
}
