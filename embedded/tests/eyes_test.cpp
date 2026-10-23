#include "AgentRobotEyes.h"
#include <algorithm>
#include "AgentRobotGaze.h"
#include <assert.h>
#include <cmath>
#include <cstdio>
#include <cstdlib>
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
  assert(eyes.update(3600));
  assert(eyes.isSleeping());
  assert(lit(eyes)<open/3);
  assert(!eyes.update(100000));
  eyes.wake(100000);
  assert(eyes.update(100000));
  assert(eyes.update(101000));
  assert(eyes.action()==Action::Idle);
  assert(lit(eyes)==open);
  eyes.play("success",102000);
  eyes.update(104100);
  assert(eyes.action()==Action::Idle);
  // Completing an action must retain an explicit gaze without a one-frame snap.
  eyes.lookAt(1,0);
  eyes.reset(104000); eyes.update(105000);
  const uint32_t gaze = hash(eyes);
  eyes.play("success",106000); eyes.update(108100);
  assert(hash(eyes)==gaze);
  // Both the frame limiter and expression deadline survive 32-bit millis rollover.
  const uint32_t start = std::numeric_limits<uint32_t>::max()-100;
  assert(eyes.begin(config,pixels.data(),pixels.size(),start));
  assert(eyes.update(start));
  assert(!eyes.update(start+10));
  assert(eyes.update(start+40));
  assert(eyes.play("success",start+50));
  assert(eyes.update(start+400));
  assert(eyes.action()==Action::Success);
  assert(eyes.update(start+2100));
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

static unsigned changedPixels(const std::vector<uint8_t>& before, const Eyes& eyes) {
  unsigned count = 0;
  for (size_t i = 0; i < before.size(); ++i) {
    uint8_t bits = before[i] ^ eyes.data()[i];
    while (bits) { count += bits & 1u; bits >>= 1; }
  }
  return count;
}

static void inputExitContinuity() {
  EyesConfig config;
  config.width=480; config.height=300; config.maxFps=60; config.autoBlink=false;
  std::vector<uint8_t> pixels(Eyes::requiredBytes(config.width,config.height));
  Eyes eyes; assert(eyes.begin(config,pixels.data(),pixels.size(),0));
  assert(eyes.play(Action::Input,0));
  assert(eyes.update(700)); // Settled cursor, during its visible blink half.
  const uint32_t cursor = hash(eyes);
  assert(eyes.play(Action::Idle,700));
  assert(eyes.update(700));
  assert(hash(eyes)==cursor); // The command's first frame retains the source shape.
  std::vector<uint8_t> previous(pixels);
  for (uint32_t dt=20;dt<=240;dt+=20) {
    assert(eyes.update(700+dt));
    if (dt==240) {
      // At the end, only residual motion/rounding may remain. Keeping a square
      // until this frame removes large corner regions at once (over 20%).
      assert(changedPixels(previous,eyes)<lit(eyes)/25);
    }
    previous=pixels;
  }
  Eyes reference;std::vector<uint8_t> target(pixels.size());
  assert(reference.begin(config,target.data(),target.size(),0));reference.update(940);
  assert(hash(eyes)==hash(reference)); // Still reaches the exact original idle.

  // Leaving either cursor blink half reaches each target's unmodified pose.
  for (const uint32_t start: {700u,900u}) {
    for (const Action action: {Action::Idle,Action::Send,Action::Love,Action::Wake,Action::WaitingWave}) {
      assert(eyes.begin(config,pixels.data(),pixels.size(),0));
      eyes.play(Action::Input,0);eyes.update(start);
      const uint32_t source=hash(eyes);
      if (start==900) assert(lit(eyes)==0);
      eyes.play(action,start);eyes.update(start);assert(hash(eyes)==source);
      eyes.update(start+240);
      assert(reference.begin(config,target.data(),target.size(),start));
      reference.play(action,start);reference.update(start+240);
      assert(hash(eyes)==hash(reference));
    }
  }
  // Interrupting a partial shape morph must start from that in-between shape.
  assert(eyes.begin(config,pixels.data(),pixels.size(),0));
  eyes.play(Action::Input,0);eyes.update(700);eyes.play(Action::Idle,700);eyes.update(820);
  const uint32_t middle=hash(eyes);
  eyes.play(Action::Love,820);eyes.update(820);assert(hash(eyes)==middle);
}

static void restoredWaitingWave() {
  EyesConfig config; config.autoBlink=false; config.transitionMs=0; config.maxFps=60;
  std::vector<uint8_t> pixels(Eyes::requiredBytes(config.width,config.height));
  Eyes eyes; assert(eyes.begin(config,pixels.data(),pixels.size(),0));
  assert(eyes.play("waiting-wave",0));
  assert(eyes.isWaiting());
  assert(Eyes::actionDuration(Action::WaitingWave)==0);
  uint32_t first=0;
  for (uint32_t t: {0u,350u,700u,1050u,1400u,5600u}) {
    assert(eyes.update(t));
    const double phase=(t%1400)*2*3.141592653589793/1400;
    for (unsigned side=0;side<2;++side) {
      double sum=0; unsigned count=0;
      for (unsigned y=0;y<config.height;++y)
        for (unsigned x=side*120;x<(side+1)*120;++x)
          if(pixels[y*eyes.stride()+(x>>3)]&(0x80>>(x&7))) {sum+=y+.5;count++;}
      assert(count>5000); // The restored eyes remain full ellipses.
      const double expected=80+15*std::sin(phase+side*.7);
      assert(std::fabs(sum/count-expected)<.15); // Amplitude and staggered phase.
    }
    if(!t)first=hash(eyes);
    if(t==1400||t==5600)assert(hash(eyes)==first);
  }
  // Repeating the persistent command must not reset its phase.
  assert(eyes.play("waiting-wave",5700));eyes.update(5700);
  const uint32_t repeated=hash(eyes);
  Eyes reference;std::vector<uint8_t> other(pixels.size());
  assert(reference.begin(config,other.data(),other.size(),0));
  reference.play("waiting-wave",0);reference.update(5700);
  assert(hash(reference)==repeated);
  eyes.stopWaiting(5800);assert(eyes.action()==Action::Idle);
}

static void layoutsAndProximity() {
  uint8_t pixels[7200];
  Eyes eyes;EyesConfig config;config.width=config.height=240;config.autoBlink=false;
  assert(eyes.begin(config,pixels,sizeof pixels,0));
  agent_robot::EyesLayout layout;
  layout.y=40;layout.width=240;layout.height=160;
  assert(eyes.setLayout(layout));eyes.update(0);
  for(unsigned y=0;y<240;y++)if(y<40||y>=200)
    for(unsigned x=0;x<30;x++)assert(!pixels[y*30+x]);
  const uint32_t contain=hash(eyes);
  layout.y=0;layout.height=240;layout.fit=agent_robot::FitMode::Cover;
  assert(eyes.setLayout(layout));eyes.update(1);assert(hash(eyes)!=contain);
  eyes.play("waiting",100);
  layout.shape=agent_robot::ScreenShape::Circle;layout.zoom=3;
  assert(eyes.setLayout(layout));eyes.update(500);assert(eyes.isWaiting());
  for(int y=0;y<240;y++)for(int x=0;x<240;x++) {
    const float dx=x+.5f-120,dy=y+.5f-120;
    if(dx*dx+dy*dy>120*120)assert(!(pixels[y*30+(x>>3)]&(0x80>>(x&7))));
  }
  layout.x=240;assert(!eyes.setLayout(layout));
  layout.x=0;layout.zoom=NAN;assert(!eyes.setLayout(layout));
  agent_robot::GazeTracker gaze;agent_robot::GazeConfig gc;
  assert(gaze.begin(gc,0));
  agent_robot::GazeTarget target;target.detected=true;target.x=1;target.y=-1;target.proximity=.49f;
  gaze.observe(target,0);gaze.update(100);assert(!gaze.tracking()&&gaze.x()==0);
  target.proximity=.6f;gaze.observe(target,100);gaze.update(140);
  assert(gaze.tracking()&&gaze.x()>0&&gaze.x()<1&&gaze.y()<0);
  target.proximity=.45f;gaze.observe(target,500);gaze.update(1000);
  assert(gaze.tracking()); // hysteresis preserves the current target
  target.proximity=.1f;gaze.observe(target,1000);gaze.update(1200);
  assert(!gaze.tracking());const float returning=gaze.x();
  gaze.update(2000);assert(gaze.x()<returning);
  target.proximity=.8f;target.x=NAN;gaze.observe(target,2100);assert(!gaze.tracking());
  gc.enterThreshold=.2f;gc.exitThreshold=.3f;assert(!gaze.begin(gc,0));
  gc=agent_robot::GazeConfig();const uint32_t start=0xffffff00u;
  assert(gaze.begin(gc,start));target.x=1;target.proximity=.8f;
  gaze.observe(target,start);gaze.update(start+100);assert(gaze.tracking());
  gaze.update(start+800);assert(!gaze.tracking());
  gc.movingOnly=true;assert(gaze.begin(gc,0));
  target.moving=false;gaze.observe(target,0);gaze.update(100);
  assert(!gaze.tracking()&&gaze.x()==0);
  target.moving=true;gaze.observe(target,120);gaze.update(160);assert(gaze.tracking());
  target.moving=false;gaze.observe(target,500);gaze.update(721);
  assert(!gaze.tracking()); // stationary targets don't refresh moving-only lock
  gc.movingOnly=false;gc.holdMs=1500;assert(gaze.setConfig(gc));
  gaze.observe(target,800);gaze.update(2000);assert(gaze.tracking());
}

static bool pixelOn(const Eyes& eyes, int x, int y) {
  return (eyes.data()[y * eyes.stride() + x / 8] >> (7 - x % 8)) & 1;
}

// The left eye's extent: the first lit run along the face's middle row, and
// the lit run down that run's centre column (the right eye never interferes).
struct Bounds { int x0, x1, y0, y1; };
static Bounds leftEye(const Eyes& eyes) {
  Bounds b;
  int x = 0, y = 0;
  while (x < 160 && !pixelOn(eyes,x,50)) ++x;
  b.x0 = x;
  while (x < 160 && pixelOn(eyes,x,50)) ++x;
  b.x1 = x - 1;
  const int cx = (b.x0 + b.x1) / 2;
  while (y < 100 && !pixelOn(eyes,cx,y)) ++y;
  b.y0 = y;
  while (y < 100 && pixelOn(eyes,cx,y)) ++y;
  b.y1 = y - 1;
  return b;
}

// Idle gaze reach per range, and the Web avatar's narrowing near the edge.
static void gazeRanges() {
  EyesConfig config; config.width = 160; config.height = 100; config.autoBlink = false;
  std::vector<uint8_t> pixels(Eyes::requiredBytes(config.width,config.height));
  Eyes eyes; assert(eyes.begin(config,pixels.data(),pixels.size(),0));
  assert(!eyes.setGazeRange(static_cast<agent_robot::GazeRange>(3)));
  config.gazeRange = static_cast<agent_robot::GazeRange>(3);
  Eyes rejected; assert(!rejected.begin(config,pixels.data(),pixels.size(),0));
  const agent_robot::GazeRange ranges[] = {agent_robot::GazeRange::Small, agent_robot::GazeRange::Medium, agent_robot::GazeRange::Large};
  uint32_t t = 0, centred = 0;
  Bounds rest = {}, reach[3] = {};
  for (unsigned i=0;i<3;++i) {
    assert(eyes.setGazeRange(ranges[i]));
    eyes.lookAt(0,0); assert(eyes.update(t+=20));
    if (!i) { centred = hash(eyes); rest = leftEye(eyes); }
    assert(hash(eyes) == centred); // a centred gaze keeps the sampled Web pose
    eyes.lookAt(-1,0); assert(eyes.update(t+=20));
    reach[i] = leftEye(eyes);
  }
  const int restWidth = rest.x1 - rest.x0;
  assert(rest.x0 - reach[0].x0 <= 9);                 // small: the original reach
  assert(rest.x0 - reach[1].x0 >= 16);                // medium reaches much further...
  assert(reach[1].x0 >= 1);                           // ...without leaving the face area
  assert(reach[1].x1 - reach[1].x0 < restWidth);      // and narrows near the edge
  assert(reach[2].x1 < reach[1].x1);                  // large goes further still
  assert(reach[2].x1 - reach[2].x0 < reach[1].x1 - reach[1].x0);
  assert(eyes.setGazeRange(agent_robot::GazeRange::Medium));
  eyes.lookAt(0,-1); assert(eyes.update(t+=20));
  const Bounds up = leftEye(eyes);
  assert(up.y0 >= 1 && rest.y0 - up.y0 >= 15);        // vertical reach stays inside too
  assert(std::abs((up.x0 + up.x1) - (rest.x0 + rest.x1)) <= 2); // vertical gaze keeps x
}

int main() {
  bufferContract();
  namesAndCancellation();
  timingAndSleep();
  renderSafetyAndIdentity();
  independentInstances();
  inputExitContinuity();
  restoredWaitingWave();
  layoutsAndProximity();
  gazeRanges();
  puts("Eyes core: buffer guards, all actions, cancellation, frame limits, rollover, sleep and isolation passed.");
}

