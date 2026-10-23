// The UI displays the native framebuffer and supplies host inputs only.
// Expression geometry, layout clipping and proximity smoothing live in C++.
// Panel character (pixel grid, backlight, glass) is applied on display only.
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
  const GROUPS = [['round','圆形'],['square','方形'],['bar','长条'],['kit','套件'],['mono','OLED'],['other','自定义']];
  // Whole-frame bandwidth of the usual wiring: [label, bits per second, bits per pixel].
  const BUSES = {
    spi:['SPI 40 MHz',40e6,16], spi18:['SPI 40 MHz · 18 位色',40e6,24], qspi:['QSPI 4 线 40 MHz',160e6,16],
    i8080:['8 位并口 20 MHz',160e6,16], rgb:['RGB 并口',256e6,16], i2c:['I²C 400 kHz',400e3*8/9,1]
  };
  const PANEL_NAMES = {ips:'IPS',tn:'TN',amoled:'AMOLED',oled:'单色 OLED'};
  const FPS_TIERS = [30,25,15];
  const CSS_PX_PER_MM = 96 / 25.4, MAX_CANVAS_PX = 4096;
  const ZOOM_SNAPS = [1,1.5,2,3,4,5,6,8,10,12,16];
  const BARE_PITCH_MM = .15; // presets without physical data (raw canvas, custom sizes)
  const DEFAULT_COLORS = {eye:'#ffffff',bg:'#000000'};
  // What each gaze source needs on a real board.
  const GAZE_HINTS = {
    track:'开发板需要外接摄像头，或距离／人体感应传感器来提供目标位置；这里用鼠标模拟靠近的物体。',
    manual:'由你的程序指定看的方向（C++ 的 lookAt()），不需要额外硬件。',
    off:'眼睛保持正视前方。'
  };
  const $ = id => document.getElementById(id);
  const store = {
    get(key,fallback){try{const v=localStorage.getItem('robotEyesPreview.'+key);return v?JSON.parse(v):fallback;}catch(_){return fallback;}},
    set(key,value){try{localStorage.setItem('robotEyesPreview.'+key,JSON.stringify(value));}catch(_){}}
  };
  // Every option is remembered in this browser, except screen-specific frame rate.
  const CHECKBOXES = ['housing','show-area','raw-pixels','pixel-grid','glass-glare','blink','transitions','moving-only'];
  const SEGMENTS = ['gaze-mode','gaze-range','motion-sensitivity','response','hold','speed'];
  const screen = $('screen'), ctx = screen.getContext('2d',{alpha:false});
  let panel = null;
  let api, image, base = SCREEN_PRESETS[0], preset = base, rotated = false, time = 0, paused = false;
  let cycling = false, cycleIndex = 0, nextCycle = 0, previous = null, active = -1;
  let pointer = {detected:false,x:0,y:0}, trackingText = null, lastMotion = -Infinity, motionAnchor = null;
  let fit = 'preset', screenGroup = 'square', fpsChoice = 'max';
  let zoomMode = 'fit', zoomScale = 1; // 'fit' | 'real' | 'scale' (zoomScale × actual size)
  const layouts = store.get('layouts',{});
  let colors = {...DEFAULT_COLORS,...store.get('colors',{})}, mono = store.get('mono','white');
  let lit = [255,255,255], unlit = [0,0,0];
  const boards = {};
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
    $('demo').textContent=value?'轮播中':'自动轮播';
    $('demo').title=value?'点击停止轮播':'依次播放所有表情';
  }
  function updateActive() {
    const index=api.eyes_action();
    if(index===active)return;
    active=index;
    buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
    $('current').textContent=ACTIONS[index][1]+' · '+ACTIONS[index][0];
  }

  // ---------- settings ----------
  // Segmented button groups keep their value in data-value.
  function segValue(id) { return $(id).dataset.value; }
  function setSeg(id,value) {
    $(id).dataset.value=String(value);
    $(id).querySelectorAll('[data-value]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===String(value))));
  }
  function bindSeg(id,onchange) {
    setSeg(id,$(id).dataset.value);
    $(id).addEventListener('click',event=>{
      const b=event.target.closest('[data-value]');
      if(!b||b.disabled||b.dataset.value===$(id).dataset.value)return;
      setSeg(id,b.dataset.value);onchange();saveSettings();
    });
  }
  function saveSettings() {
    const saved={zoomMode,zoomScale,senseRadius:Number($('sense-radius').value)};
    for(const id of CHECKBOXES)saved[id]=$(id).checked;
    for(const id of SEGMENTS)saved[id]=segValue(id);
    store.set('settings',saved);
  }
  function restoreSettings() {
    const saved=store.get('settings',{});
    for(const id of CHECKBOXES)if(typeof saved[id]==='boolean')$(id).checked=saved[id];
    for(const id of SEGMENTS)if(saved[id]!=null&&$(id).querySelector(`[data-value="${saved[id]}"]`))setSeg(id,saved[id]);
    if(saved['gaze-range']==null)setSeg('gaze-range',store.get('gazeRange',1));
    if(saved.senseRadius)$('sense-radius').value=String(saved.senseRadius);
    if(['fit','real','scale'].includes(saved.zoomMode))zoomMode=saved.zoomMode;
    if(saved.zoomScale>0)zoomScale=saved.zoomScale;
  }

  // ---------- module geometry ----------
  // Reference frames come from DISPLAY_FRAMES; other presets draw generic
  // artwork from their board description. Both are millimetre-based.
  function model() {
    if(base.module&&DISPLAY_FRAMES[base.module])return DISPLAY_FRAMES[base.module];
    if(base.board)return boards[base.id]||(boards[base.id]=buildBoard(base));
    return null;
  }
  function rotation() { return ((base.rotation||0)+(rotated?90:0))%180; }
  function logical() { return rotated?{...base,width:base.height,height:base.width,viewport:null}:base; }
  function pitchMm() {
    const m=model();
    if(m)return (rotation()===90?m.display[3]:m.display[2])/preset.width;
    return base.diag?pitchOf(base):BARE_PITCH_MM;
  }
  // The module keeps its geometry whether or not its housing is shown, so
  // toggling the housing never moves or resizes the screen.
  function geometry() {
    const m=model(), rot=rotation()===90;
    if(m) {
      const [x,y,dw,dh]=m.display;
      return {m,rot,w:rot?m.height:m.width,h:rot?m.width:m.height,display:rot?[m.height-y-dh,x,dh,dw]:[x,y,dw,dh]};
    }
    const p=pitchMm(), w=screen.width*p, h=screen.height*p;
    return {m,rot,w,h,display:[0,0,w,h]};
  }

  // ---------- zoom ----------
  // Scale is relative to actual size and never exceeds what fits the stage,
  // so the module is always fully visible without scrollbars.
  function zoomRange(g) {
    const r=$('stage').getBoundingClientRect();
    const max=Math.max(.05,Math.min((r.width-40)/g.w,(r.height-40)/g.h)/CSS_PX_PER_MM);
    return [Math.min(max*.2,1),max];
  }
  function currentScale(g) {
    const [min,max]=zoomRange(g);
    if(zoomMode==='fit')return max;
    if(zoomMode==='real')return Math.min(1,max);
    return Math.min(Math.max(zoomScale,min),max);
  }
  function syncZoom(g,scale) {
    const [min,max]=zoomRange(g), span=Math.log(max/min);
    $('zoom').value=String(span>0?Math.round(Math.log(scale/min)/span*1000):1000);
    $('zoom-value').value=scale.toFixed(scale<10?1:0)+'×';
    $('zoom-fit').setAttribute('aria-pressed',String(zoomMode==='fit'));
    $('zoom-real').setAttribute('aria-pressed',String(Math.abs(scale-1)<.001));
    $('zoom-real').disabled=max<1;
    $('zoom-real').title=max<1?'窗口放不下实物大小':'按常见电脑屏幕估算，不同显示器会有偏差';
  }
  function zoomFromSlider() {
    const g=geometry(), [min,max]=zoomRange(g), position=Number($('zoom').value);
    if(position>=995){zoomMode='fit';resizeDisplay();saveSettings();return;}
    let scale=min*Math.exp(position/1000*Math.log(max/min));
    // Weak snapping to common ratios.
    for(const snap of ZOOM_SNAPS)if(snap>=min&&snap<=max&&Math.abs(Math.log(scale/snap))<.045)scale=snap;
    zoomMode='scale';zoomScale=scale;resizeDisplay();saveSettings();
  }

  // ---------- frame rate ----------
  // Whole-frame refresh limit of the screen's usual wiring.
  function screenLimit() {
    const bus=BUSES[base.bus];
    if(!bus)return 60;
    return Math.max(1,Math.min(60,Math.floor(bus[1]/(preset.width*preset.height*bus[2]))));
  }
  function fpsValue() { return fpsChoice==='max'?screenLimit():Number(fpsChoice); }
  function renderFps() {
    const limit=screenLimit();
    const top=document.createElement('button');top.type='button';top.className='chip';top.dataset.value='max';
    top.textContent=(base.bus?'当前屏幕上限 ':'最高 ')+limit;
    top.title=base.bus?'按'+BUSES[base.bus][0]+'带宽估算的整屏刷新上限，不含绘制时间':'没有总线数据，按 60 FPS';
    const tiers=FPS_TIERS.filter(value=>value<limit).map(value=>{
      const b=document.createElement('button');b.type='button';b.className='chip';b.dataset.value=String(value);b.textContent=String(value);return b;
    });
    $('fps').replaceChildren(top,...tiers);
    if(fpsChoice!=='max'&&!(Number(fpsChoice)<limit))fpsChoice='max';
    setSeg('fps',fpsChoice);
  }
  function applyTiming() {
    if(!api.eyes_timing(fpsValue(),$('blink').checked?1:0,$('transitions').checked?240:0))throw new Error('Invalid timing');
  }

  // ---------- drawing ----------
  function hexRGB(hex) { return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)); }
  function syncColors() {
    const oled=base.panel==='oled';
    lit=oled?[255,255,255]:hexRGB(colors.eye);
    unlit=oled?[0,0,0]:hexRGB(colors.bg);
  }
  function renderPanel() {
    if(!panel)return;
    panel.render({panel:base.panel||'ips',plain:$('raw-pixels').checked,grid:$('pixel-grid').checked,
      glow:true,round:preset.frame==='round',corner:base.corner||0,mono});
  }
  function sensorInput() {
    if(segValue('gaze-mode')!=='track')return;
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
  // Gaze feedback sits right under the screen, where the eyes are watched.
  function updateTrackingStatus() {
    const mode=segValue('gaze-mode'), locked=mode==='track'&&!!api.eyes_is_tracking();
    $('sense-zone').classList.toggle('active',locked);
    const ignored=api.eyes_action()!==0;
    const text=mode==='off'?'':mode==='manual'?'手动注视':ignored?'当前动作暂不应用注视方向'
      :'跟随物体 · '+(locked?'正在注视／离开后短暂停留':$('moving-only').checked?'等待范围内的移动目标':'鼠标进入虚线范围即注视');
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
        const c=(pixels[y*stride+(x>>3)]&(0x80>>(x&7)))?lit:unlit;
        image.data[p]=c[0];image.data[p+1]=c[1];image.data[p+2]=c[2];image.data[p+3]=255;
      }
      ctx.putImageData(image,0,0);
      if(panel){panel.upload(screen);renderPanel();}
    }
    updateActive(); updateTrackingStatus();
    $('clock').textContent='时间 '+(time/1000).toFixed(2)+' s';
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

  // ---------- display ----------
  let frameKey = '';
  function resizeDisplay() {
    const g=geometry(), device=$('device'), glass=$('glass'), housing=$('housing').checked;
    const key=g.m?base.id+':'+(g.rot?90:0):'';
    if(frameKey!==key) {
      if(g.m) {
        // The same physical module rotates as a whole; framebuffer coordinates do not.
        const svg=new DOMParser().parseFromString(g.m.svg,'image/svg+xml').documentElement;
        if(g.rot) {
          const group=document.createElementNS('http://www.w3.org/2000/svg','g');
          group.setAttribute('transform','translate('+g.m.height+' 0) rotate(90)');
          while(svg.firstChild)group.append(svg.firstChild);
          svg.append(group);svg.setAttribute('viewBox','0 0 '+g.w+' '+g.h);
        }
        $('frame-art').replaceChildren(document.importNode(svg,true));
      } else $('frame-art').replaceChildren();
    }
    frameKey=key;
    const scale=currentScale(g), ppm=scale*CSS_PX_PER_MM, [x,y,dw,dh]=g.display;
    syncZoom(g,scale);
    $('sensor-wrap').style.width=g.w*ppm+'px';$('sensor-wrap').style.height=g.h*ppm+'px';
    device.dataset.profile=preset.frame;
    device.dataset.module=g.m?base.id:'';
    device.dataset.rotation=String(g.rot?90:0);
    device.classList.toggle('bare',!housing||!g.m);
    device.classList.toggle('generic-frame',!g.m&&preset.frame!=='eyes');
    if(!g.m&&preset.frame!=='eyes')device.classList.toggle('bare',!housing);
    glass.style.left=x/g.w*100+'%';glass.style.top=y/g.h*100+'%';
    glass.style.width=dw/g.w*100+'%';glass.style.height=dh/g.h*100+'%';
    glass.classList.toggle('show-area',$('show-area').checked);
    $('glare').hidden=!$('glass-glare').checked||!g.m||!housing;
    const cw=dw*ppm, ch=dh*ppm, dpr=Math.min(window.devicePixelRatio||1,MAX_CANVAS_PX/cw,MAX_CANVAS_PX/ch);
    $('panel').width=Math.max(1,Math.round(cw*dpr));$('panel').height=Math.max(1,Math.round(ch*dpr));
    // A circular sensing zone around the module, whatever its aspect ratio.
    const radius=Number($('sense-radius').value), ring=Math.max(g.w,g.h)*ppm+radius*2;
    $('sense-zone').hidden=segValue('gaze-mode')!=='track';
    $('sense-zone').style.width=$('sense-zone').style.height=ring+'px';
    // Label just above the module, inside the ring, so the stage never clips it.
    $('sense-zone').style.setProperty('--label-top',Math.max(4,(ring-g.h*ppm)/2-26)+'px');
    $('sense-value').value=radius+' px';
    const reference=g.m?g.m.name+(g.m.revision?' · '+g.m.revision:''):preset.name;
    $('stage-caption').textContent=reference+(g.rot!==((base.rotation||0)===90)?' · 旋转 90°':'')+' · '+Math.round(25.4/pitchMm())+' PPI'+
      (g.m?(!housing?' · 外框已隐藏':g.m.generic?' · 外框为通用示意':' · PCB '+g.w+' × '+g.h+' mm'):'');
    const source=$('frame-source');source.hidden=!(g.m&&g.m.source);
    if(g.m&&g.m.source)source.href=g.m.source;else source.removeAttribute('href');
    $('target-dot').hidden=true;
    renderPanel();
  }

  // ---------- layout ----------
  function layoutKey() { return base.id+(rotated?'@90':''); }
  function loadLayout() {
    const saved=base.id==='custom'?{}:layouts[layoutKey()]||{};
    fit=saved.fit||'preset';
    $('face-scale').value=String(saved.scale??1);
    $('offset-x').value=String(saved.x??0);$('offset-y').value=String(saved.y??0);
  }
  function applyLayout(save=false) {
    const view=fit==='preset'&&preset.viewport?preset.viewport:[0,0,0,0];
    const shape=preset.frame==='round'?1:0;
    const scale=Number($('face-scale').value), ox=Number($('offset-x').value), oy=Number($('offset-y').value);
    if(!api.eyes_layout(...view,fit==='cover'?1:0,shape,scale,ox,oy))throw new Error('Invalid layout');
    $('scale-value').value=scale.toFixed(2);
    $('offset-x-value').value=ox.toFixed(2);$('offset-y-value').value=oy.toFixed(2);
    document.querySelectorAll('[data-fit]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.fit===fit)));
    $('profile-note').textContent=fit==='cover'?'等比放大铺满屏幕，超出部分裁切'
      :fit==='preset'&&preset.viewport?'240 × 160 表情区域居中，与现有 TFT 例程一致'
      :'按屏幕比例完整放下表情';
    if(save&&base.id!=='custom'){layouts[layoutKey()]={fit,scale,x:ox,y:oy};store.set('layouts',layouts);}
    draw(true);
  }
  function resetLayout() {
    delete layouts[layoutKey()];store.set('layouts',layouts);
    loadLayout();applyLayout();
  }

  // ---------- configuration ----------
  function syncScreenInfo() {
    const bus=BUSES[base.bus];
    $('spec-res').textContent=preset.width+' × '+preset.height;
    $('spec-color').textContent=base.panel==='oled'?'单色':base.panel?'彩色':'1-bit 画布';
    $('spec-fps').textContent=bus?'最高约 '+screenLimit()+' FPS':'帧率不限';
    $('screen-spec').textContent=[base.id==='custom'?'自定义尺寸':base.id==='eyes'?'原始眼睛画布':base.controller,
      PANEL_NAMES[base.panel],bus&&bus[0]].filter(Boolean).join(' · ');
    $('screen-support').textContent=base.example?'有参考例程（未实机验证）':'暂无驱动例程';
  }
  function syncControls() {
    const oled=base.panel==='oled';
    $('color-options').hidden=oled;$('mono-options').hidden=!oled;
    document.querySelectorAll('[data-mono]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mono===mono)));
    $('eye-color').value=colors.eye;$('bg-color').value=colors.bg;
    $('rotate').hidden=preset.frame==='round'||base.width===base.height;
    $('rotate').setAttribute('aria-pressed',String(rotated));
    syncColors();
  }
  // Changing the screen restarts the animation; everything else keeps it.
  function configure(next=base,keepRotation=true) {
    if(next!==base){rotated=false;fpsChoice='max';}
    else if(!keepRotation)rotated=false;
    base=next;preset=logical();
    setCycling(false);time=0;previous=null;active=-1;pointer.detected=false;lastMotion=-Infinity;motionAnchor=null;
    screen.width=preset.width;screen.height=preset.height;
    image=ctx.createImageData(screen.width,screen.height);
    renderFps();
    if(!api.eyes_init(preset.width,preset.height,fpsValue(),
      $('blink').checked?1:0,$('transitions').checked?240:0,0))throw new Error('Core initialization failed');
    api.eyes_gaze_range(Number(segValue('gaze-range')));
    applyGazeMode(false);
    screenGroup=base.id==='custom'?'other':base.group||'other';
    renderProfiles();
    if(base.id!=='custom')store.set('profile',base.id);
    if(base.id==='custom'||base.id==='eyes'){$('custom-width').value=preset.width;$('custom-height').value=preset.height;}
    syncScreenInfo();syncControls();loadLayout();resizeDisplay();applyLayout();setPaused(paused);
  }
  function applyGazeConfig() {
    if(!api.eyes_gaze_config(.5,.4,Number(segValue('hold')),Number(segValue('response')),$('moving-only').checked?1:0))
      throw new Error('Invalid gaze configuration');
  }
  // One gaze source at a time: a simulated nearby object, the manual
  // sliders, or none.
  function applyGazeMode(redraw=true) {
    const mode=segValue('gaze-mode');
    pointer.detected=false;lastMotion=-Infinity;motionAnchor=null;
    api.eyes_tracking(mode==='track'?1:0,now());
    applyGazeConfig();
    if(mode==='manual')api.eyes_gaze(Number($('gx').value),Number($('gy').value));
    $('gaze-hint').textContent=GAZE_HINTS[mode];
    $('track-options').hidden=mode!=='track';
    $('manual-options').hidden=mode!=='manual';
    $('motion-sensitivity').setAttribute('aria-disabled',String(!$('moving-only').checked));
    if(redraw){resizeDisplay();draw();}
  }
  function gaze() {
    const x=Number($('gx').value),y=Number($('gy').value);
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
      if(previous!==null&&!paused&&!document.hidden)advance(Math.max(0,timestamp-previous)*Number(segValue('speed')));
      previous=document.hidden?null:timestamp;
      requestAnimationFrame(frame);
    }catch(error){fail(error);}
  }
  function selectProfile(id) {
    $('size-error').textContent='';
    const next=SCREEN_PRESETS.find(item=>item.id===id);
    if(next)configure(next,false);
  }
  function applyCustomSize() {
    const width=Number($('custom-width').value),height=Number($('custom-height').value),round=segValue('custom-shape')==='1';
    if(!Number.isInteger(width)||!Number.isInteger(height)||width<16||height<16||width>512||height>512||(round&&width!==height)){
      $('size-error').textContent='宽高须为 16–512 的整数；圆形须宽高相等。';return;
    }
    $('size-error').textContent='';
    if(base.id==='custom'&&preset.width===width&&preset.height===height&&(preset.frame==='round')===round)return;
    configure({id:'custom',name:'自定义屏幕',controller:'CUSTOM',width,height,frame:round?'round':'tft',example:false,group:'other'},false);
  }
  // The picker lists one screen type at a time; the type tabs switch it.
  // The 自定义 tab edits a size directly instead of listing presets.
  function groupPresets(group) { return SCREEN_PRESETS.filter(item=>(item.group||'other')===group); }
  function renderProfiles() {
    const items=groupPresets(screenGroup), select=$('profile'), custom=screenGroup==='other';
    select.replaceChildren(...items.map(item=>{
      const option=document.createElement('option');option.value=item.id;option.textContent=item.name;return option;
    }));
    select.value=base.id;
    select.hidden=custom;$('custom-size').hidden=!custom;$('stepper').hidden=custom;
    document.querySelectorAll('[data-group]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.group===screenGroup)));
    const index=items.indexOf(base);
    $('profile-index').textContent=index<0?'':(index+1)+' / '+items.length;
  }
  function stepProfile(delta) {
    const items=groupPresets(screenGroup);
    const index=items.indexOf(base);
    selectProfile(items[(index+delta+items.length)%items.length].id);
  }
  // Narrows the action bar to the smallest width that keeps its row count,
  // so the buttons split evenly between rows.
  function balanceActions() {
    const bar=$('actions'), rows=()=>new Set([...bar.children].map(b=>b.offsetTop)).size;
    bar.style.width='';
    let hi=Math.min(bar.parentElement.clientWidth,860);bar.style.width=hi+'px';
    const target=rows();
    let lo=Math.max(...[...bar.children].map(b=>b.offsetWidth));
    while(hi-lo>1){const mid=Math.floor((lo+hi)/2);bar.style.width=mid+'px';if(rows()<=target)hi=mid;else lo=mid;}
    bar.style.width=hi+'px';
  }
  async function start() {
    try {
      if(!ctx||typeof WebAssembly==='undefined')throw new Error('Browser lacks Canvas or WebAssembly');
      try{panel=new PanelRenderer($('panel'));}catch(error){console.warn(error);panel=null;}
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
      for(const [group,label] of GROUPS) {
        const items=groupPresets(group);
        if(!items.length)continue;
        const tab=document.createElement('button');tab.type='button';tab.className='chip';tab.dataset.group=group;
        tab.textContent=label;$('screen-groups').append(tab);
        items.forEach(item=>{
          const row=document.createElement('div');row.className='preset-item';
          const name=document.createElement('span');name.textContent=item.name+' · '+item.width+'×'+item.height;
          const state=document.createElement('span');state.textContent=item.example?'可预览 / 有参考例程':'可预览';
          row.append(name,state);$('preset-list').append(row);
        });
      }
      $('mono-chips').append(...Object.entries(MONO_TINTS).map(([value,tint])=>{
        const b=document.createElement('button');b.type='button';b.className='chip';b.dataset.mono=value;b.textContent=tint.name;return b;
      }));
      document.querySelectorAll('button,select,input').forEach(el=>{el.disabled=false;});
      restoreSettings();
      const saved=SCREEN_PRESETS.find(item=>item.id===store.get('profile',''));
      if(saved)base=saved;
      configure(base,false);setPaused(false);balanceActions();
      $('status').textContent='本机绘制 · C++ 核心 · 无外部请求'+(panel?'':' · 面板效果不可用');
      $('fingerprint').textContent='核心源码 SHA-256：'+CORE_SHA256.slice(0,16);
      $('pause').onclick=()=>setPaused(!paused);
      $('step').onclick=()=>{if(paused)advance(Math.ceil(1000/fpsValue()));};
      $('demo').onclick=()=>{setCycling(!cycling);if(cycling){cycleIndex=0;nextCycle=time+4000;play(0);}};
      $('reset').onclick=()=>configure();
      $('profile').onchange=()=>selectProfile($('profile').value);
      $('prev-profile').onclick=()=>stepProfile(-1);
      $('next-profile').onclick=()=>stepProfile(1);
      $('screen-groups').onclick=event=>{
        const b=event.target.closest('[data-group]');
        if(b&&b.dataset.group!==screenGroup)selectProfile(groupPresets(b.dataset.group)[0].id);
      };
      for(const id of ['custom-width','custom-height']) {
        $(id).onchange=applyCustomSize;
        $(id).onkeydown=event=>{if(event.key==='Enter')applyCustomSize();};
      }
      bindSeg('custom-shape',applyCustomSize);
      $('fps').addEventListener('click',event=>{
        const b=event.target.closest('[data-value]');
        if(!b||b.dataset.value===fpsChoice)return;
        fpsChoice=b.dataset.value;setSeg('fps',fpsChoice);applyTiming();
      });
      for(const id of ['blink','transitions'])$(id).onchange=()=>{applyTiming();saveSettings();};
      $('housing').onchange=()=>{resizeDisplay();saveSettings();};
      $('sense-radius').oninput=()=>{resizeDisplay();saveSettings();};
      bindSeg('gaze-mode',()=>applyGazeMode());
      for(const id of ['hold','response'])bindSeg(id,()=>{applyGazeConfig();updateTrackingStatus();});
      $('moving-only').onchange=()=>{applyGazeMode(false);updateTrackingStatus();saveSettings();};
      bindSeg('gaze-range',()=>{api.eyes_gaze_range(Number(segValue('gaze-range')));draw();});
      bindSeg('motion-sensitivity',()=>{motionAnchor=null;lastMotion=-Infinity;});
      bindSeg('speed',()=>{previous=null;});
      $('fit').onclick=event=>{const b=event.target.closest('[data-fit]');if(b){fit=b.dataset.fit;applyLayout(true);}};
      for(const id of ['face-scale','offset-x','offset-y'])$(id).oninput=()=>applyLayout(true);
      $('layout-reset').onclick=resetLayout;
      $('gx').oninput=$('gy').oninput=gaze;
      $('center').onclick=()=>{$('gx').value=$('gy').value='0';gaze();};
      $('zoom-fit').onclick=()=>{zoomMode='fit';resizeDisplay();saveSettings();};
      $('zoom-real').onclick=()=>{zoomMode='real';resizeDisplay();saveSettings();};
      $('zoom').oninput=zoomFromSlider;
      $('rotate').onclick=()=>{rotated=!rotated;configure(base,true);};
      const saveColors=()=>{store.set('colors',colors);syncControls();draw(true);};
      $('eye-color').oninput=()=>{colors.eye=$('eye-color').value;saveColors();};
      $('bg-color').oninput=()=>{colors.bg=$('bg-color').value;saveColors();};
      $('color-reset').onclick=()=>{colors={...DEFAULT_COLORS};saveColors();};
      $('mono-chips').onclick=event=>{const b=event.target.closest('[data-mono]');if(b){mono=b.dataset.mono;store.set('mono',mono);syncControls();renderPanel();}};
      for(const id of ['show-area','glass-glare'])$(id).onchange=()=>{resizeDisplay();saveSettings();};
      for(const id of ['pixel-grid','raw-pixels'])$(id).onchange=()=>{renderPanel();saveSettings();};
      $('download').onclick=()=>{
        const url=URL.createObjectURL(new Blob(['<!doctype html>\n'+INITIAL_DOCUMENT],{type:'text/html;charset=utf-8'}));
        const link=document.createElement('a');link.href=url;link.download='agent-robot-eyes-preview.html';
        document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
      };
      const updatePointer=event=>{
        if(event.pointerType==='touch'&&event.buttons===0)return;
        if(!motionAnchor||Math.hypot(event.clientX-motionAnchor.x,event.clientY-motionAnchor.y)>=Number(segValue('motion-sensitivity'))){
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
      if(typeof ResizeObserver!=='undefined'){
        new ResizeObserver(()=>{if(api)resizeDisplay();}).observe($('stage'));
        new ResizeObserver(()=>requestAnimationFrame(balanceActions)).observe($('actions').parentElement);
      }
      requestAnimationFrame(frame);
    }catch(error){fail(error);}
  }
  start();
})();
