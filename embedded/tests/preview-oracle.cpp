#include <cstdint>
#include <cstdio>
#include <cstring>

extern "C" {
int eyes_init(int, int, int, int, int, uint32_t);
int eyes_play(int, uint32_t);
void eyes_gaze(float, float);
int eyes_update(uint32_t);
int eyes_action();
const uint8_t* eyes_data();
int eyes_size();
int eyes_layout(int,int,int,int,int,int,float,float,float);
void eyes_tracking(int,uint32_t);
void eyes_target(float,float,float,int,uint32_t);
void eyes_motion_target(float,float,float,int,int,uint32_t);
int eyes_gaze_config(float,float,int,int,int);
int eyes_gaze_range(int);
}

// A tiny line protocol used ONLY by test-preview.mjs to compare native and WASM
// execution of the same command timeline, including framebuffer bytes.
int main() {
  char command[16];
  while (std::scanf("%15s", command) == 1) {
    if (!std::strcmp(command, "init")) {
      int w, h, fps, blink, transition; unsigned now;
      if (std::scanf("%d%d%d%d%d%u", &w, &h, &fps, &blink, &transition, &now) != 6) return 1;
      std::printf("%d\n", eyes_init(w,h,fps,blink,transition,now));
    } else if (!std::strcmp(command, "play")) {
      int action; unsigned now;
      if (std::scanf("%d%u", &action, &now) != 2) return 1;
      std::printf("%d\n", eyes_play(action,now));
    } else if (!std::strcmp(command, "gaze")) {
      float x,y;
      if (std::scanf("%f%f", &x, &y) != 2) return 1;
      eyes_gaze(x,y); std::puts("ok");
    } else if (!std::strcmp(command, "range")) {
      int range;
      if (std::scanf("%d", &range) != 1) return 1;
      std::printf("%d\n", eyes_gaze_range(range));
    } else if (!std::strcmp(command, "layout")) {
      int x,y,w,h,fit,shape;float zoom,ox,oy;
      if(std::scanf("%d%d%d%d%d%d%f%f%f",&x,&y,&w,&h,&fit,&shape,&zoom,&ox,&oy)!=9)return 1;
      std::printf("%d\n",eyes_layout(x,y,w,h,fit,shape,zoom,ox,oy));
    } else if (!std::strcmp(command, "tracking")) {
      int enabled;unsigned now;
      if(std::scanf("%d%u",&enabled,&now)!=2)return 1;
      eyes_tracking(enabled,now);std::puts("ok");
    } else if (!std::strcmp(command, "target")) {
      float x,y,proximity;int detected;unsigned now;
      if(std::scanf("%f%f%f%d%u",&x,&y,&proximity,&detected,&now)!=5)return 1;
      eyes_target(x,y,proximity,detected,now);std::puts("ok");
    } else if (!std::strcmp(command, "motion")) {
      float x,y,p;int detected,moving;unsigned now;
      if(std::scanf("%f%f%f%d%d%u",&x,&y,&p,&detected,&moving,&now)!=6)return 1;
      eyes_motion_target(x,y,p,detected,moving,now);std::puts("ok");
    } else if (!std::strcmp(command, "gazeconfig")) {
      float enter,exit;int hold,response,moving;
      if(std::scanf("%f%f%d%d%d",&enter,&exit,&hold,&response,&moving)!=5)return 1;
      std::printf("%d\n",eyes_gaze_config(enter,exit,hold,response,moving));
    } else if (!std::strcmp(command, "update")) {
      unsigned now;
      if (std::scanf("%u", &now) != 1) return 1;
      const int changed = eyes_update(now);
      std::printf("%d %d ", changed, eyes_action());
      for (int i=0; i<eyes_size(); ++i) std::printf("%02x", eyes_data()[i]);
      std::putchar('\n');
    } else return 1;
  }
}
