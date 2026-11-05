// BoopFace Embedded on a 0.96" SSD1306 OLED (128 x 64, I2C address 0x3C).
//
// Needs the "Adafruit SSD1306" library (Library Manager installs Adafruit GFX
// with it). Wire the display to the board's default I2C pins: SDA/SCL, 3.3 V
// and GND. On an ESP32 DevKit those are GPIO 21 (SDA) and 22 (SCL).
//
// The eyes cycle through the expressions. Type an action in the Serial Monitor
// (115200 baud, "Newline" endings) to play it, or "demo" to resume the cycle.

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <BoopFace.h>

const uint16_t WIDTH = 128;
const uint16_t HEIGHT = 64;

Adafruit_SSD1306 display(WIDTH, HEIGHT, &Wire, -1);
boopface::Eyes eyes;
uint8_t pixels[((WIDTH + 7) / 8) * HEIGHT];

const char* const DEMO[] = {
  "idle", "affirm", "success", "love", "wary", "inspect", "surprise",
  "angry", "refuse", "failure", "random", "waiting-spin", "sleep", "wake",
};
const size_t DEMO_COUNT = sizeof DEMO / sizeof DEMO[0];
bool cycling = true;
size_t demoIndex = 0;
uint32_t lastChange = 0;
char command[24];
size_t commandSize = 0;

void setup() {
  Serial.begin(115200);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("SSD1306 not found at 0x3C; check the wiring and address.");
    while (true) delay(1000);
  }
  boopface::EyesConfig config;
  config.width = WIDTH;
  config.height = HEIGHT;
  config.maxFps = 25;
  if (!eyes.begin(config, pixels, sizeof pixels, millis())) {
    Serial.println("BoopFace Embedded could not start.");
    while (true) delay(1000);
  }
  Serial.println("Type an action (love, affirm, refuse, ...) or demo.");
}

void readCommand(uint32_t now) {
  while (Serial.available()) {
    const char c = Serial.read();
    if (c == '\r') continue;
    if (c != '\n') {
      if (commandSize < sizeof command - 1) command[commandSize++] = c;
      continue;
    }
    command[commandSize] = '\0';
    commandSize = 0;
    if (!strcmp(command, "demo")) {
      cycling = true;
      lastChange = now;
    } else if (eyes.play(command, now)) {
      cycling = false;
    } else {
      Serial.print("Unknown action: ");
      Serial.println(command);
    }
  }
}

void loop() {
  const uint32_t now = millis();
  readCommand(now);
  if (cycling && now - lastChange >= 3500) {
    lastChange = now;
    eyes.play(DEMO[demoIndex], now);
    demoIndex = (demoIndex + 1) % DEMO_COUNT;
  }
  if (eyes.update(now)) {
    display.clearDisplay();
    display.drawBitmap(0, 0, eyes.data(), WIDTH, HEIGHT, SSD1306_WHITE);
    display.display();
  }
}
