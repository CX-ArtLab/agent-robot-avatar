// BoopFace Embedded in the Serial Monitor: no screen or wiring needed.
//
// Open the Serial Monitor at 115200 baud with "Newline" line endings. The eyes
// are drawn as text a few times a second. Type an action and press Enter, for
// example: love, affirm, refuse, waiting-spin, sleep, wake, idle.

#include <BoopFace.h>

const uint16_t WIDTH = 48;   // characters per line
const uint16_t HEIGHT = 24;  // lines per frame

boopface::Eyes eyes;
uint8_t pixels[((WIDTH + 7) / 8) * HEIGHT];  // 1 bit per pixel, rows padded to bytes
char command[24];
size_t commandSize = 0;

void printFrame() {
  const uint8_t* data = eyes.data();
  const uint16_t stride = eyes.stride();
  char line[WIDTH + 1];
  line[WIDTH] = '\0';
  Serial.println();
  for (uint16_t y = 0; y < HEIGHT; ++y) {
    for (uint16_t x = 0; x < WIDTH; ++x) {
      const bool lit = data[y * stride + x / 8] & (0x80 >> (x % 8));
      line[x] = lit ? '#' : '.';
    }
    Serial.println(line);
  }
  Serial.print("action: ");
  Serial.println(boopface::Eyes::actionName(eyes.action()));
}

void setup() {
  Serial.begin(115200);
  boopface::EyesConfig config;
  config.width = WIDTH;
  config.height = HEIGHT;
  config.maxFps = 4;  // text output is slow; a few frames a second is enough
  if (!eyes.begin(config, pixels, sizeof pixels, millis())) {
    Serial.println("BoopFace Embedded could not start.");
    while (true) delay(1000);
  }
  Serial.print("BoopFace Embedded ");
  Serial.println(boopface::Eyes::version());
  Serial.println("Type an action, e.g. love, affirm, refuse, waiting-spin, sleep, wake, idle.");
}

void loop() {
  const uint32_t now = millis();
  while (Serial.available()) {
    const char c = Serial.read();
    if (c == '\r') continue;
    if (c != '\n') {
      if (commandSize < sizeof command - 1) command[commandSize++] = c;
      continue;
    }
    command[commandSize] = '\0';
    commandSize = 0;
    if (!eyes.play(command, now)) {
      Serial.print("Unknown action: ");
      Serial.println(command);
    }
  }
  if (eyes.update(now)) printFrame();
}
