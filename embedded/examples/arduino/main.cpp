#include <Arduino.h>
#include <BoopFace.h>
#include <stdlib.h>
#include <string.h>

#include "boards.h"

// Defaults when eyes_settings.h does not set them.
#ifndef EYES_MAX_FPS
#define EYES_MAX_FPS 25 // ceiling; actual frame rate depends on the device and bus
#endif
#ifndef EYES_AUTO_BLINK
#define EYES_AUTO_BLINK 1
#endif
#ifndef EYES_TRANSITION_MS
#define EYES_TRANSITION_MS 240
#endif
#ifndef EYES_FIT_COVER
#define EYES_FIT_COVER 0
#endif
#ifndef EYES_ZOOM
#define EYES_ZOOM 1.0f
#endif
#ifndef EYES_OFFSET_X
#define EYES_OFFSET_X 0.0f
#endif
#ifndef EYES_OFFSET_Y
#define EYES_OFFSET_Y 0.0f
#endif

boopface::Eyes eyes;
uint8_t bitmap[((WIDTH + 7) / 8) * HEIGHT];
bool ready = false, cycle = false, commandOverflow = false;
char command[48];
size_t commandSize = 0;
uint32_t lastCycle = 0;
unsigned cycleIndex = 0;

void present() { displayPresent(eyes); }

void help() {
  Serial.println("BoopFace Embedded 0.1.0 (experimental)");
  Serial.println("Commands: idle bored waiting-spin waiting-wrap waiting-wave input affirm");
  Serial.println("success failure wary inspect angry refuse surprise love random sleep wake");
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
    Serial.println(boopface::Eyes::actionName(eyes.action()));
  } else Serial.println("Unknown command; type help.");
}

void setup() {
  Serial.begin(115200);
  if (!displayBegin()) { Serial.println("Display initialization failed."); return; }
  boopface::EyesConfig config;
  config.width = WIDTH;
  config.height = HEIGHT;
  config.maxFps = EYES_MAX_FPS;
  config.autoBlink = EYES_AUTO_BLINK != 0;
  config.transitionMs = EYES_TRANSITION_MS;
  ready = eyes.begin(config, bitmap, sizeof(bitmap), millis());
  if (!ready) { Serial.println("Eyes buffer/configuration is invalid."); return; }
  boopface::EyesLayout layout;
  layout.fit = EYES_FIT_COVER ? boopface::FitMode::Cover : boopface::FitMode::Contain;
  layout.zoom = EYES_ZOOM;
  layout.offsetX = EYES_OFFSET_X;
  layout.offsetY = EYES_OFFSET_Y;
  if (ROUND) layout.shape = boopface::ScreenShape::Circle; // keep the eyes inside the round glass
  if (!eyes.setLayout(layout)) Serial.println("Layout settings are out of range; using defaults.");
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
  const uint32_t actionMs = boopface::Eyes::actionDuration(
      static_cast<boopface::Action>(cycleIndex));
  const uint32_t cycleMs = actionMs + 500u > 4000u ? actionMs + 500u : 4000u;
  if (cycle && now - lastCycle >= cycleMs) {
    cycleIndex = (cycleIndex + 1) % static_cast<unsigned>(boopface::Action::Count);
    eyes.play(static_cast<boopface::Action>(cycleIndex), now);
    lastCycle = now;
    Serial.println(boopface::Eyes::actionName(eyes.action()));
  }
  if (eyes.update(now)) present();
  // No delay(): the host can handle sensors, audio or networking between frames.
}
