#include "AgentRobotEyes.h"
#include <assert.h>
#include <cmath>
#include <cstdio>
#include <cstring>
#include <limits>
#include <set>
#include <string>
#include <vector>

using agent_robot::Action;
using agent_robot::Eyes;
using agent_robot::EyesConfig;

static unsigned lit(const Eyes& eyes) {
  unsigned count = 0;
  for (size_t i = 0; i < eyes.bufferSize(); ++i) {
    uint8_t byte = eyes.data()[i];
    while (byte) { count += byte & 1; byte >>= 1; }
  }
  return count;
}
static uint32_t hash(const Eyes& eyes) {
  uint32_t value = 2166136261u;
  for (size_t i = 0; i < eyes.bufferSize(); ++i) value = (value ^ eyes.data()[i]) * 16777619u;
  return value;
}

static void bufferContract() {
  Eyes eyes;
  assert(!eyes.update(0));
  assert(!eyes.play("success",0));
  assert(Eyes::requiredBytes(240,160) == 4800);
  assert(Eyes::requiredBytes(128,64) == 1024);
  assert(Eyes::requiredBytes(41,23) == 138);
  assert(!Eyes::requiredBytes(0,240));
  assert(!Eyes::requiredBytes(513,240));
  EyesConfig config;
  uint8_t tiny[8] = {};
  assert(!eyes.begin(config,tiny,sizeof tiny,0));
  assert(!eyes.begin(config,nullptr,5000,0));
  assert(!eyes.data());
  assert(!eyes.update(100));
  std::vector<uint8_t> pixels(Eyes::requiredBytes(240,160));
  assert(eyes.begin(config,pixels.data(),pixels.size(),0));
  assert(eyes.update(0));
  assert(lit(eyes)>0);
  const uint32_t before = hash(eyes);
  config.maxFps = 0;
  assert(!eyes.begin(config,tiny,sizeof tiny,0));
  assert(hash(eyes)==before); // rejected reconfiguration leaves the active instance intact
  assert(eyes.update(100));
}

static void namesAndCancellation() {
  EyesConfig config; config.autoBlink = false;
  std::vector<uint8_t> pixels(Eyes::requiredBytes(config.width,config.height));
  Eyes eyes; assert(eyes.begin(config,pixels.data(),pixels.size(),0));
  for (unsigned i=0;i<static_cast<unsigned>(Action::Count);++i) {
    Action parsed = Action::Count;
    assert(Eyes::parseAction(Eyes::actionName(static_cast<Action>(i)),parsed));
    assert(parsed==static_cast<Action>(i));
  }
  Action parsed = Action::Idle;
  assert(Eyes::parseAction("angry",parsed) && parsed==Action::Blocked);
  assert(Eyes::parseAction("slot",parsed) && parsed==Action::Random);
  assert(Eyes::parseAction("connection-error",parsed) && parsed==Action::Error);
  eyes.startWaiting(0);
  assert(!eyes.play("not-an-action",100));
  assert(!eyes.play(nullptr,100));
  assert(!eyes.play(Action::Count,100));
  assert(eyes.isWaiting());
  assert(eyes.update(50000));
  assert(eyes.isWaiting());
  eyes.play("success",50100);
  eyes.stopWaiting(50200); // stopping waiting must not cancel a different action
  assert(eyes.action()==Action::Success);
  eyes.startWaiting(50300,true);
  assert(eyes.update(60000));
  assert(eyes.action()==Action::WaitingWrap); // earlier success cannot complete this action
  eyes.stopWaiting(60100);
  assert(eyes.action()==Action::Idle);
  eyes.play("warning",60200);
  eyes.reset(60300);
  eyes.update(70000);
  assert(eyes.action()==Action::Idle);
}

static void timingAndSleep() {
  EyesConfig config; config.autoBlink=false;
  std::vector<uint8_t> pixels(Eyes::requiredBytes(config.width,config.height));
  Eyes eyes; assert(eyes.begin(config,pixels.data(),pixels.size(),0));
  assert(eyes.update(0));
  assert(!eyes.update(10));
  assert(eyes.update(34));
  const unsigned open = lit(eyes);
  eyes.sleep(100);
  assert(eyes.update(100));
  assert(eyes.update(400));
  assert(eyes.isSleeping());
  assert(lit(eyes)<open/3);
  assert(!eyes.update(100000));
  eyes.wake(100000);
  assert(eyes.update(100000));
  assert(eyes.update(101000));
  assert(eyes.action()==Action::Idle);
  assert(lit(eyes)==open);
  eyes.play("success",102000);
  eyes.update(103800);
  assert(eyes.action()==Action::Idle);
  // Both the frame limiter and expression deadline survive 32-bit millis rollover.
  const uint32_t start = std::numeric_limits<uint32_t>::max()-100;
  assert(eyes.begin(config,pixels.data(),pixels.size(),start));
  assert(eyes.update(start));
  assert(!eyes.update(start+10));
  assert(eyes.update(start+40));
  assert(eyes.play("success",start+50));
  assert(eyes.update(start+400));
  assert(eyes.action()==Action::Success);
  assert(eyes.update(start+1900));
  assert(eyes.action()==Action::Idle);
}

static void renderSafetyAndIdentity() {
  const uint16_t sizes[][2]={{16,16},{41,23},{128,64},{240,160},{240,240},{320,240},{512,512}};
  std::set<uint32_t> expressionFrames;
  for (const auto& size:sizes) {
    EyesConfig config;
    config.width=size[0]; config.height=size[1]; config.autoBlink=false;
    const size_t bytes=Eyes::requiredBytes(config.width,config.height);
    std::vector<uint8_t> storage(bytes+32,0xA5);
    Eyes eyes;
    assert(eyes.begin(config,storage.data()+16,bytes,0));
    for (unsigned i=0;i<static_cast<unsigned>(Action::Count);++i) {
      const uint32_t start=10000*i;
      eyes.play(static_cast<Action>(i),start);
      for (uint32_t dt: {0u,100u,300u,600u,1200u,2400u,4000u}) {
        eyes.update(start+dt);
        for (size_t j=0;j<16;++j) {
          assert(storage[j]==0xA5);
          assert(storage[16+bytes+j]==0xA5);
        }
        if (config.width % 8) {
          const uint8_t padding=(1u << (8-config.width%8))-1;
          for (unsigned y=0;y<config.height;++y)
            assert(!(eyes.data()[y*eyes.stride()+eyes.stride()-1]&padding));
        }
        if (config.width==240 && dt==600) expressionFrames.insert(hash(eyes));
      }
    }
    eyes.reset(200000); eyes.update(201000);
    assert(lit(eyes)>0);
    const uint32_t neutral=hash(eyes);
    eyes.lookAt(1,1); eyes.update(201001);
    assert(hash(eyes)!=neutral);
    eyes.lookAt(INFINITY,NAN); eyes.update(201002);
    assert(hash(eyes)==neutral);
  }
  assert(expressionFrames.size()>=12); // expressions must not collapse into a single generic eye
}

static void independentInstances() {
  uint8_t a[1024],b[1024];
  EyesConfig config; config.width=128;config.height=64;config.autoBlink=false;
  Eyes first,second;
  assert(first.begin(config,a,sizeof a,0));
  assert(second.begin(config,b,sizeof b,0));
  first.update(0); second.update(0);
  const uint32_t idle=hash(second);
  first.play("love",100); first.update(1000);
  assert(hash(first)!=idle);
  assert(hash(second)==idle);
  assert(second.action()==Action::Idle);
}

int main() {
  bufferContract();
  namesAndCancellation();
  timingAndSleep();
  renderSafetyAndIdentity();
  independentInstances();
  puts("Eyes core: buffer guards, all actions, cancellation, frame limits, rollover, sleep and isolation passed.");
}
