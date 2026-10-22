// Host-only diagnostic: render a deterministic frame to a PBM file on stdout.
#include "AgentRobotEyes.h"
#include <cstdio>
#include <cstdlib>
#include <vector>
int main(int argc, char** argv) {
  if (argc != 3) { std::fputs("Usage: render-frame ACTION ELAPSED_MS > frame.pbm\n",stderr); return 1; }
  agent_robot::Action action;
  if (!agent_robot::Eyes::parseAction(argv[1],action)) return 1;
  agent_robot::EyesConfig config;
  config.autoBlink = false;
  std::vector<uint8_t> buffer(agent_robot::Eyes::requiredBytes(config.width,config.height));
  agent_robot::Eyes eyes;
  if (!eyes.begin(config,buffer.data(),buffer.size(),0)) return 1;
  eyes.play(action,0);
  eyes.update(static_cast<uint32_t>(std::strtoul(argv[2],nullptr,10)));
  std::printf("P4\n%u %u\n",config.width,config.height);
  return std::fwrite(eyes.data(),1,eyes.bufferSize(),stdout)==eyes.bufferSize() ? 0 : 1;
}
