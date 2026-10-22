// The UI displays the native framebuffer and supplies host inputs only.
// Expression geometry, layout clipping and proximity smoothing live in C++.
(() => {
  'use strict';
  const INITIAL_DOCUMENT = document.documentElement.outerHTML;
  const ACTIONS = [
    ['idle','正常'],['bored','发呆'],['waiting','等待'],['waiting-wrap','等待 · 环绕'],
    ['input','输入'],['send','发送/点头'],['success','成功'],['failure','失败'],
    ['warning','警告'],['inspect','审视'],['blocked','内容阻止'],['error','系统错误'],
    ['surprise','惊讶'],['love','喜欢'],['random','随机'],['sleep','睡着'],['wake','醒来'],
    ['waiting-wave','等待 · 波动']
  ];
  const $ = id => document.getElementById(id);
  const screen = $('screen'), ctx = screen.getContext('2d',{alpha:false});
  let api, image, preset = SCREEN_PRESETS[0], time = 0, paused = false;
  let cycling = false, cycleIndex = 0, nextCycle = 0, previous = null, active = -1;
  let pointer = {detected:false,x:0,y:0}, trackingText = '', lastMotion = -Infinity, motionAnchor = null;
  const buttons = [];
  function now() { return Math.floor(time) >>> 0; }
  function fail(error) {
    console.error(error);
    $('error').hidden=false;
    $('error').textContent='预览无法运行，请用较新的浏览器打开完整 HTML 文件。详情：'+error.message;
    $('status').textContent='未运行';
    document.querySelectorAll('button,select,input').forEach(el=>{el.disabled=true;});
    api=null;
  }
  function setCycling(value) {
    cycling=value;
    $('demo').setAttribute('aria-pressed',String(value));
    $('demo').textContent=value?'停止轮播':'自动轮播';
  }
  function updateActive() {
    const index=api.eyes_action();
    if(index===active)return;
    active=index;
    buttons.forEach((button,i)=>{
      button.setAttribute('aria-pressed',String(i===index));
      button.classList.toggle('demo-active',i===index);
    });
    $('current').textContent=ACTIONS[index][1]+' · '+ACTIONS[index][0];
  }
  function sensorInput() {
    if(!$('tracking').checked)return;
    const rect=$('device').getBoundingClientRect();
    const zone=$('sense-zone').getBoundingClientRect();
    const dx=pointer.x-(rect.left+rect.width/2), dy=pointer.y-(rect.top+rect.height/2);
    const distance=Math.hypot(dx/(zone.width/2),dy/(zone.height/2));
    const proximity=Math.max(0,Math.min(1,1-distance/2));
    api.eyes_motion_target(dx/Math.max(1,rect.width/2),dy/Math.max(1,rect.height/2),
      proximity,pointer.detected?1:0,time-lastMotion<=180?1:0,now());
    const within=pointer.detected && distance<=1.2;
    $('target-dot').hidden=!within;
    if(within) {
      $('target-dot').style.left=(pointer.x-4)+'px';
      $('target-dot').style.top=(pointer.y-4)+'px';
    }
  }
  function updateTrackingStatus() {
    const enabled=$('tracking').checked, locked=!!api.eyes_is_tracking();
    $('sense-zone').classList.toggle('active',enabled&&locked);
    const ignored=api.eyes_action()!==0;
    const text=!enabled?'自动注视已关闭 · 可在设置中手动调整方向'
      :ignored?'当前动作暂不应用注视方向':'鼠标模拟物体 · '+(locked?'正在注视／离开后短暂停留':$('moving-only').checked?'等待范围内的移动目标':'等待目标进入虚线范围');
    if(text!==trackingText){$('tracking-note').textContent=text;trackingText=text;}
  }
  function draw(force=false) {
    sensorInput();
    const changed=api.eyes_update(now());
    if(changed||force) {
      const pixels=new Uint8Array(api.memory.buffer,api.eyes_data(),api.eyes_size());
      const stride=api.eyes_stride();
      for(let y=0;y<screen.height;y++)for(let x=0;x<screen.width;x++){
        const p=(y*screen.width+x)*4;
        const value=(pixels[y*stride+(x>>3)]&(0x80>>(x&7)))?255:0;
        image.data[p]=image.data[p+1]=image.data[p+2]=value; image.data[p+3]=255;
      }
      ctx.putImageData(image,0,0);
    }
    updateActive(); updateTrackingStatus();
    $('clock').textContent=(time/1000).toFixed(2)+' s';
  }
  function setPaused(value) {
    paused=value;previous=null;
    $('pause').textContent=value?'继续':'暂停';
    $('step').disabled=!value;
  }
  function play(index) {
    if(!api.eyes_play(index,now()))throw new Error('Invalid action');
    draw();
  }
  function resizeDisplay() {
    const framed=$('housing').checked;
    const frame=preset.frame;
    const extra=framed?(frame==='round'?44:frame==='eyes'?24:80):0;
    const width=screen.width*Number($('zoom').value)+extra;
    $('sensor-wrap').style.width=width+'px';
    $('device').style.width='100%';
    screen.style.width=(screen.width*Number($('zoom').value))+'px';
    $('device').dataset.profile=frame;
    $('device').classList.toggle('bare',!framed);
    $('sense-zone').hidden=!$('tracking').checked;
    const radius=Number($('sense-radius').value);
    $('sense-zone').style.width='calc(100% + '+radius*2+'px)';
    $('sense-zone').style.height='calc(100% + '+radius*2+'px)';
    $('sense-value').value=radius+' px';
    $('module-label').textContent=preset.controller+' · '+(frame==='oled'?'OLED':'TFT DISPLAY');
    $('pin-label').textContent=frame==='oled'?'GND  VCC  SCL  SDA':'SPI DISPLAY MODULE';
    $('stage-caption').textContent=preset.name+' / '+screen.width+' × '+screen.height+' · 通用外观示意';
    $('target-dot').hidden=true;
  }
  function applyLayout() {
    const mode=$('fit').value;
    const view=mode==='preset'&&preset.viewport?preset.viewport:[0,0,0,0];
    const shape=preset.frame==='round'?1:0;
    const scale=Number($('face-scale').value);
    if(!api.eyes_layout(...view,mode==='cover'?1:0,shape,scale,
      Number($('offset-x').value),Number($('offset-y').value)))throw new Error('Invalid layout');
    $('scale-value').value=scale.toFixed(2);
    $('profile-note').textContent=(preset.type||'自定义画布')+
      (preset.viewport&&mode==='preset'?' · 240 × 160 表情区域居中，与现有 TFT 例程一致'
        :mode==='cover'?' · 等比铺满，超出区域裁切':' · 按实际分辨率等比适配');
    draw(true);
  }
  function configure(next=preset) {
    preset=next;
    setCycling(false);time=0;previous=null;active=-1;pointer.detected=false;lastMotion=-Infinity;motionAnchor=null;
    screen.width=preset.width;screen.height=preset.height;
    image=ctx.createImageData(screen.width,screen.height);
    if(!api.eyes_init(preset.width,preset.height,Number($('fps').value),
      $('blink').checked?1:0,$('transitions').checked?240:0,0))throw new Error('Core initialization failed');
    api.eyes_tracking($('tracking').checked?1:0,0);
    applyGazeConfig();
    $('gx').value=$('gy').value='0';$('gx-value').value=$('gy-value').value='0.00';
    $('screen-label').textContent=preset.width+' × '+preset.height+' · 1-bit';
    $('support-state').textContent=preset.example?'可预览 · 有参考例程 · 未实机验证':'可预览 · 未提供此配置的驱动例程';
    $('profile-note').textContent=(preset.type||'自定义画布')+
      (preset.viewport&&$('fit').value==='preset'?' · 240 × 160 表情区域居中，与现有 TFT 例程一致':' · 按实际分辨率重新绘制');
    $('custom-size').hidden=$('profile').value!=='custom';
    resizeDisplay();applyLayout();setPaused(paused);
  }
  function resetLayout() {
    $('fit').value='preset';$('face-scale').value='1';
    $('offset-x').value=$('offset-y').value='0';
  }
  function setTracking() {
    pointer.detected=false;lastMotion=-Infinity;motionAnchor=null;
    api.eyes_tracking($('tracking').checked?1:0,now());
    applyGazeConfig();
    $('gx').value=$('gy').value='0';$('gx-value').value=$('gy-value').value='0.00';
    resizeDisplay();draw();
  }
  function applyGazeConfig() {
    if(!api.eyes_gaze_config(.5,.4,Number($('hold').value),Number($('response').value),$('moving-only').checked?1:0))
      throw new Error('Invalid gaze configuration');
  }
  function gaze() {
    const x=Number($('gx').value),y=Number($('gy').value);
    if($('tracking').checked){$('tracking').checked=false;setTracking();}
    $('gx').value=String(x);$('gy').value=String(y);
    $('gx-value').value=x.toFixed(2);$('gy-value').value=y.toFixed(2);
    api.eyes_gaze(x,y);draw();
  }
  function advance(delta) {
    time+=delta;
    if(cycling&&time>=nextCycle) {
      cycleIndex=(cycleIndex+1)%ACTIONS.length;nextCycle=time+Math.max(4000,api.eyes_duration(cycleIndex)+500);
      api.eyes_play(cycleIndex,now());
    }
    draw();
  }
  function frame(timestamp) {
    if(!api)return;
    try {
      if(previous!==null&&!paused&&!document.hidden)advance(Math.max(0,timestamp-previous)*Number($('speed').value));
      previous=document.hidden?null:timestamp;
      requestAnimationFrame(frame);
    }catch(error){fail(error);}
  }
  async function start() {
    try {
      if(!ctx||typeof WebAssembly==='undefined')throw new Error('Browser lacks Canvas or WebAssembly');
      const bytes=Uint8Array.from(atob(WASM_BASE64),c=>c.charCodeAt(0));
      const {instance}=await WebAssembly.instantiate(bytes,{
        wasi_snapshot_preview1:{random_get(pointer,length){
          const target=new Uint8Array(api.memory.buffer,pointer,length);
          for(let i=0;i<target.length;i+=65536)crypto.getRandomValues(target.subarray(i,Math.min(i+65536,target.length)));
          return 0;
        }}
      });
      api=instance.exports;api._initialize();
      ACTIONS.forEach(([name,label],index)=>{
        const button=document.createElement('button');
        button.className='action';button.dataset.action=name;button.title=label+' · '+name;
        button.textContent=label;button.setAttribute('aria-pressed','false');
        button.onclick=()=>{setCycling(false);play(index);};
        $('actions').append(button);buttons.push(button);
      });
      SCREEN_PRESETS.forEach(item=>{
        const option=document.createElement('option');option.value=item.id;
        option.textContent=item.name+' · '+item.width+'×'+item.height;
        $('profile').append(option);
        const row=document.createElement('div');row.className='preset-item';
        const label=document.createElement('span');label.textContent=option.textContent;
        const state=document.createElement('span');state.textContent=item.example?'可预览 / 有参考例程':'可预览';
        row.append(label,state);$('preset-list').append(row);
      });
      const custom=document.createElement('option');custom.value='custom';custom.textContent='自定义分辨率…';$('profile').append(custom);
      document.querySelectorAll('button,select,input').forEach(el=>{el.disabled=false;});
      configure();setPaused(false);
      $('status').textContent='本机绘制 · C++ 核心 · 无外部请求';
      $('fingerprint').textContent='核心源码 SHA-256：'+CORE_SHA256.slice(0,16);
      $('pause').onclick=()=>setPaused(!paused);
      $('step').onclick=()=>{if(paused)advance(Math.ceil(1000/Number($('fps').value)));};
      $('demo').onclick=()=>{setCycling(!cycling);if(cycling){cycleIndex=0;nextCycle=time+4000;play(0);}};
      $('reset').onclick=()=>{resetLayout();configure();};
      $('profile').onchange=()=>{
        $('size-error').textContent='';
        resetLayout();
        const next=SCREEN_PRESETS.find(item=>item.id===$('profile').value);
        if(next)configure(next);
        else{
          $('custom-width').value=preset.width;$('custom-height').value=preset.height;
          $('custom-shape').value=preset.frame==='round'?'1':'0';
          configure({...preset,id:'custom',name:'自定义屏幕',example:false});
        }
      };
      $('apply-size').onclick=()=>{
        const width=Number($('custom-width').value),height=Number($('custom-height').value),round=$('custom-shape').value==='1';
        if(!Number.isInteger(width)||!Number.isInteger(height)||width<16||height<16||width>512||height>512||(round&&width!==height)){
          $('size-error').textContent='宽高须为 16–512 的整数；圆形须宽高相等。';return;
        }
        $('size-error').textContent='';resetLayout();
        configure({id:'custom',name:'自定义屏幕',controller:'CUSTOM',width,height,frame:round?'round':'tft',example:false});
      };
      for(const id of ['fps','blink','transitions'])$(id).onchange=()=>configure();
      $('zoom').onchange=resizeDisplay;$('housing').onchange=resizeDisplay;$('tracking').onchange=setTracking;
      $('sense-radius').oninput=resizeDisplay;
      for(const id of ['hold','response','moving-only'])$(id).onchange=()=>{applyGazeConfig();updateTrackingStatus();};
      $('motion-sensitivity').onchange=()=>{motionAnchor=null;lastMotion=-Infinity;};
      for(const id of ['fit','face-scale','offset-x','offset-y'])$(id).oninput=applyLayout;
      $('settings-toggle').onclick=()=>{
        const open=$('settings-panel').hidden;$('settings-panel').hidden=!open;
        $('settings-toggle').setAttribute('aria-expanded',String(open));
        $('settings-toggle').classList.toggle('demo-panel-open',open);
      };
      $('speed').onchange=()=>{previous=null;};
      $('gx').oninput=$('gy').oninput=gaze;
      $('center').onclick=()=>{$('gx').value=$('gy').value='0';gaze();};
      $('download').onclick=()=>{
        const url=URL.createObjectURL(new Blob(['<!doctype html>\n'+INITIAL_DOCUMENT],{type:'text/html;charset=utf-8'}));
        const link=document.createElement('a');link.href=url;link.download='agent-robot-eyes-preview.html';
        document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
      };
      const updatePointer=event=>{
        if(event.pointerType==='touch'&&event.buttons===0)return;
        if(!motionAnchor||Math.hypot(event.clientX-motionAnchor.x,event.clientY-motionAnchor.y)>=Number($('motion-sensitivity').value)){
          if(motionAnchor)lastMotion=time;
          motionAnchor={x:event.clientX,y:event.clientY};
        }
        pointer={detected:true,x:event.clientX,y:event.clientY};
      };
      $('demo-canvas').addEventListener('pointermove',updatePointer);
      $('demo-canvas').addEventListener('pointerdown',updatePointer);
      $('demo-canvas').addEventListener('pointerleave',()=>{pointer.detected=false;motionAnchor=null;lastMotion=-Infinity;});
      $('demo-canvas').addEventListener('pointerup',event=>{if(event.pointerType==='touch')pointer.detected=false;});
      document.addEventListener('visibilitychange',()=>{previous=null;pointer.detected=false;});
      document.addEventListener('keydown',event=>{
        if(event.code!=='Space'||event.repeat||event.altKey||event.ctrlKey||event.metaKey||
          /^(INPUT|SELECT|BUTTON|TEXTAREA|SUMMARY)$/.test(event.target.tagName)||event.target.isContentEditable)return;
        event.preventDefault();setPaused(!paused);
      });
      requestAnimationFrame(frame);
    }catch(error){fail(error);}
  }
  start();
})();
