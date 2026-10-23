#include <Arduino.h>
#include <AgentRobotEyes.h>
#include <stdlib.h>
#include <string.h>

#include "boards.h"

agent_robot::Eyes eyes;
uint8_t bitmap[((WIDTH + 7) / 8) * HEIGHT];
bool ready = false, cycle = false, commandOverflow = false;
char command[48];
size_t commandSize = 0;
uint32_t lastCycle = 0;
unsigned cycleIndex = 0;

void present() { displayPresent(eyes); }

void help() {
  Serial.println("Agent Robot Eyes 0.1.0 (experimental)");
  Serial.println("Commands: idle bored waiting waiting-wrap input send success failure");
  Serial.println("warning inspect blocked error surprise love random sleep wake waiting-wave");
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
  if (!displayBegin()) { Serial.println("Display initialization failed."); return; }
  agent_robot::EyesConfig config;
  config.width = WIDTH;
  config.height = HEIGHT;
  config.maxFps = 25; // ceiling; actual frame rate depends on the device and bus
  ready = eyes.begin(config, bitmap, sizeof(bitmap), millis());
  if (!ready) { Serial.println("Eyes buffer/configuration is invalid."); return; }
  if (ROUND) {
    agent_robot::EyesLayout layout;
    layout.shape = agent_robot::ScreenShape::Circle; // keep the eyes inside the round glass
    eyes.setLayout(layout);
  }
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
  const uint32_t actionMs = agent_robot::Eyes::actionDuration(
      static_cast<agent_robot::Action>(cycleIndex));
  const uint32_t cycleMs = actionMs + 500u > 4000u ? actionMs + 500u : 4000u;
  if (cycle && now - lastCycle >= cycleMs) {
    cycleIndex = (cycleIndex + 1) % static_cast<unsigned>(agent_robot::Action::Count);
    eyes.play(static_cast<agent_robot::Action>(cycleIndex), now);
    lastCycle = now;
    Serial.println(agent_robot::Eyes::actionName(eyes.action()));
  }
  if (eyes.update(now)) present();
  // No delay(): the host can handle sensors, audio or networking between frames.
}
