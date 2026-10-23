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
  const GROUPS = [['round','圆形'],['square','方形 / 矩形'],['bar','长条'],['kit','开发套件'],['mono','黑白 OLED'],['other','其他']];
  // Whole-frame bandwidth of the usual wiring: [label, bits per second, bits per pixel].
  const BUSES = {
    spi:['SPI 40 MHz',40e6,16], spi18:['SPI 40 MHz · 18 位色',40e6,24], qspi:['QSPI 4 线 40 MHz',160e6,16],
    i8080:['8 位并口 20 MHz',160e6,16], rgb:['RGB 并口 16 MHz 像素时钟',256e6,16], i2c:['I²C 400 kHz',400e3*8/9,1]
  };
  const PANEL_NAMES = {ips:'IPS LCD',tn:'TN LCD',amoled:'AMOLED',oled:'单色 OLED'};
  const ZOOMS = [['fit','适合窗口'],['1','实物大小'],['2','2×'],['4','4×']];
  const CSS_PX_PER_MM = 96 / 25.4, MAX_CANVAS_PX = 4096, MAX_DEVICE_CSS_PX = 6000;
  const BARE_PITCH_MM = .15; // presets without physical data (raw canvas, custom sizes)
  const DEFAULT_COLORS = {eye:'#ffffff',bg:'#000000'};
  const $ = id => document.getElementById(id);
  const store = {
    get(key,fallback){try{const v=localStorage.getItem('robotEyesPreview.'+key);return v?JSON.parse(v):fallback;}catch(_){return fallback;}},
    set(key,value){try{localStorage.setItem('robotEyesPreview.'+key,JSON.stringify(value));}catch(_){}}
  };
  const screen = $('screen'), ctx = screen.getContext('2d',{alpha:false});
  let panel = null;
  let api, image, base = SCREEN_PRESETS[0], preset = base, rotated = false, time = 0, paused = false;
  let cycling = false, cycleIndex = 0, nextCycle = 0, previous = null, active = -1;
  let pointer = {detected:false,x:0,y:0}, trackingText = '', lastMotion = -Infinity, motionAnchor = null;
  let zoom = 'fit', fit = 'preset', screenGroup = 'square';
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
    $('demo').textContent=value?'停止轮播':'自动轮播';
  }
  function updateActive() {
    const index=api.eyes_action();
    if(index===active)return;
    active=index;
    buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
    $('current').textContent=ACTIONS[index][1]+' · '+ACTIONS[index][0];
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
  function geometry() {
    const m=model(), rot=rotation()===90, framed=$('housing').checked&&!!m;
    if(framed) {
      const [x,y,dw,dh]=m.display;
      return {m,rot,framed,w:rot?m.height:m.width,h:rot?m.width:m.height,display:rot?[m.height-y-dh,x,dh,dw]:[x,y,dw,dh]};
    }
    const p=pitchMm(), w=screen.width*p, h=screen.height*p;
    return {m,rot,framed,w,h,display:[0,0,w,h]};
  }
  // "Fit" sizes the module itself; the proximity ring may extend past the
  // stage and is clipped there instead of shrinking the module.
  function pxPerMm(g) {
    if(zoom!=='fit')return CSS_PX_PER_MM*Number(zoom);
    const r=$('stage').getBoundingClientRect(), margin=40;
    return Math.max(.5,Math.min((r.width-margin)/g.w,(r.height-margin)/g.h,CSS_PX_PER_MM*16));
  }

  // Segmented button groups keep their value in data-value.
  function segValue(id) { return Number($(id).dataset.value); }
  function setSeg(id,value) {
    $(id).dataset.value=String(value);
    $(id).querySelectorAll('[data-value]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===String(value))));
  }
  function bindSeg(id,onchange) {
    setSeg(id,$(id).dataset.value);
    $(id).addEventListener('click',event=>{
      const b=event.target.closest('[data-value]');
      if(!b||b.disabled||b.dataset.value===$(id).dataset.value)return;
      setSeg(id,b.dataset.value);onchange();
    });
  }
  function busNote() {
    const bus=BUSES[base.bus];
    if(!bus)return '';
    const fps=bus[1]/(preset.width*preset.height*bus[2]);
    return bus[0]+' · 理论整屏刷新'+(fps>=60?'可达 60 FPS 以上':'约 '+Math.floor(fps)+' FPS');
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
      glow:$('panel-glow').checked,round:preset.frame==='round',corner:base.corner||0,mono});
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
    const text=!enabled?'自动注视已关闭 · 可在“手动注视”中调整方向'
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
        const c=(pixels[y*stride+(x>>3)]&(0x80>>(x&7)))?lit:unlit;
        image.data[p]=c[0];image.data[p+1]=c[1];image.data[p+2]=c[2];image.data[p+3]=255;
      }
      ctx.putImageData(image,0,0);
      if(panel){panel.upload(screen);renderPanel();}
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

  // ---------- display ----------
  let frameKey = '';
  function resizeDisplay() {
    const g=geometry(), device=$('device'), glass=$('glass');
    const key=g.framed?base.id+':'+(g.rot?90:0):'';
    if(g.framed) {
      if(frameKey!==key) {
        // The same physical module rotates as a whole; framebuffer coordinates do not.
        const svg=new DOMParser().parseFromString(g.m.svg,'image/svg+xml').documentElement;
        if(g.rot) {
          const group=document.createElementNS('http://www.w3.org/2000/svg','g');
          group.setAttribute('transform','translate('+g.m.height+' 0) rotate(90)');
          while(svg.firstChild)group.append(svg.firstChild);
          svg.append(group);svg.setAttribute('viewBox','0 0 '+g.w+' '+g.h);
        }
        $('frame-art').replaceChildren(document.importNode(svg,true));
      }
    } else if(frameKey) $('frame-art').replaceChildren();
    frameKey=key;
    $('stage').classList.toggle('fit',zoom==='fit');
    const ppm=pxPerMm(g), [x,y,dw,dh]=g.display;
    $('sensor-wrap').style.width=g.w*ppm+'px';$('sensor-wrap').style.height=g.h*ppm+'px';
    device.dataset.profile=preset.frame;
    device.dataset.module=g.framed?base.id:'';
    device.dataset.rotation=String(g.rot?90:0);
    device.classList.toggle('bare',!g.framed);
    device.classList.toggle('generic-frame',$('housing').checked&&!g.m&&preset.frame!=='eyes');
    glass.style.left=x/g.w*100+'%';glass.style.top=y/g.h*100+'%';
    glass.style.width=dw/g.w*100+'%';glass.style.height=dh/g.h*100+'%';
    glass.classList.toggle('show-area',$('show-area').checked);
    $('glare').hidden=!$('glass-glare').checked||!g.framed;
    const cw=dw*ppm, ch=dh*ppm, dpr=Math.min(window.devicePixelRatio||1,MAX_CANVAS_PX/cw,MAX_CANVAS_PX/ch);
    $('panel').width=Math.max(1,Math.round(cw*dpr));$('panel').height=Math.max(1,Math.round(ch*dpr));
    $('sense-zone').hidden=!$('tracking').checked;
    const radius=Number($('sense-radius').value);
    $('sense-zone').style.width='calc(100% + '+radius*2+'px)';
    $('sense-zone').style.height='calc(100% + '+radius*2+'px)';
    $('sense-value').value=radius+' px';
    const reference=g.m?g.m.name+(g.m.revision?' · '+g.m.revision:''):preset.name;
    $('stage-caption').textContent=reference+(g.rot!==((base.rotation||0)===90)?' · 旋转 90°':'')+' / '+screen.width+' × '+screen.height+
      ' · '+Math.round(25.4/pitchMm())+' PPI · '+(PANEL_NAMES[base.panel]||'单色位图')+
      (g.framed?(g.m.generic?' · 外框为通用示意':' · PCB '+g.w+' × '+g.h+' mm'):$('housing').checked&&preset.frame!=='eyes'?' · 通用外框':' · 仅屏幕');
    const source=$('frame-source');source.hidden=!(g.m&&g.m.source);
    if(g.m&&g.m.source)source.href=g.m.source;else source.removeAttribute('href');
    $('target-dot').hidden=true;
    const longest=Math.max(g.w,g.h);
    document.querySelectorAll('[data-zoom]').forEach(b=>{
      b.setAttribute('aria-pressed',String(b.dataset.zoom===String(zoom)));
      b.disabled=b.dataset.zoom!=='fit'&&longest*CSS_PX_PER_MM*Number(b.dataset.zoom)>MAX_DEVICE_CSS_PX;
    });
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
    $('profile-note').textContent=(preset.controller?preset.controller+' · ':'')+(preset.type||'自定义画布')+
      (preset.viewport&&fit==='preset'?' · 240 × 160 表情区域居中，与现有 TFT 例程一致'
        :fit==='cover'?' · 等比铺满，超出区域裁切':' · 按实际分辨率等比适配');
    if(save&&base.id!=='custom'){layouts[layoutKey()]={fit,scale,x:ox,y:oy};store.set('layouts',layouts);}
    draw(true);
  }
  function resetLayout() {
    delete layouts[layoutKey()];store.set('layouts',layouts);
    loadLayout();applyLayout();
  }

  // ---------- configuration ----------
  function syncControls() {
    const oled=base.panel==='oled';
    $('color-options').hidden=oled;$('mono-options').hidden=!oled;
    document.querySelectorAll('[data-mono]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mono===mono)));
    $('eye-color').value=colors.eye;$('bg-color').value=colors.bg;
    $('rotate').disabled=preset.frame==='round'||base.width===base.height;
    $('rotate').setAttribute('aria-pressed',String(rotated));
    syncColors();
  }
  function configure(next=base,keepRotation=true) {
    if(next!==base||!keepRotation)rotated=false;
    base=next;preset=logical();
    setCycling(false);time=0;previous=null;active=-1;pointer.detected=false;lastMotion=-Infinity;motionAnchor=null;
    screen.width=preset.width;screen.height=preset.height;
    image=ctx.createImageData(screen.width,screen.height);
    if(!api.eyes_init(preset.width,preset.height,segValue('fps'),
      $('blink').checked?1:0,$('transitions').checked?240:0,0))throw new Error('Core initialization failed');
    api.eyes_tracking($('tracking').checked?1:0,0);
    applyGazeConfig();
    $('gx').value=$('gy').value='0';$('gx-value').value=$('gy-value').value='0.00';
    $('screen-label').textContent=preset.width+' × '+preset.height+' · 1-bit';
    $('support-state').textContent=preset.example?'可预览 · 有参考例程 · 未实机验证':'可预览 · 未提供此配置的驱动例程';
    screenGroup=base.id==='custom'?'other':base.group||'other';
    renderProfiles();
    if(base.id!=='custom')store.set('profile',base.id);
    $('custom-size').hidden=base.id!=='custom';
    $('bus-note').textContent=busNote();$('bus-note').hidden=!base.bus;
    syncControls();loadLayout();resizeDisplay();applyLayout();setPaused(paused);
  }
  function setTracking() {
    pointer.detected=false;lastMotion=-Infinity;motionAnchor=null;
    api.eyes_tracking($('tracking').checked?1:0,now());
    applyGazeConfig();
    $('gx').value=$('gy').value='0';$('gx-value').value=$('gy-value').value='0.00';
    resizeDisplay();draw();
  }
  function applyGazeConfig() {
    if(!api.eyes_gaze_config(.5,.4,segValue('hold'),segValue('response'),$('moving-only').checked?1:0))
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
  function selectProfile(id) {
    $('size-error').textContent='';
    const next=SCREEN_PRESETS.find(item=>item.id===id);
    if(next){configure(next,false);return;}
    $('custom-width').value=preset.width;$('custom-height').value=preset.height;
    $('custom-shape').value=preset.frame==='round'?'1':'0';
    configure({...preset,id:'custom',name:'自定义屏幕',module:null,board:null,rotation:0,example:false},false);
  }
  // The picker lists one screen type at a time; the type chips switch it.
  function groupPresets(group) { return SCREEN_PRESETS.filter(item=>(item.group||'other')===group); }
  function renderProfiles() {
    const items=groupPresets(screenGroup), select=$('profile');
    select.replaceChildren(...items.map(item=>{
      const option=document.createElement('option');option.value=item.id;option.textContent=item.name;return option;
    }));
    if(screenGroup==='other'){
      const custom=document.createElement('option');custom.value='custom';custom.textContent='自定义分辨率…';select.append(custom);
    }
    select.value=base.id;
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
        const chip=document.createElement('button');chip.type='button';chip.className='chip';chip.dataset.group=group;
        chip.textContent=label+' '+items.length;$('screen-groups').append(chip);
        items.forEach(item=>{
          const row=document.createElement('div');row.className='preset-item';
          const name=document.createElement('span');name.textContent=item.name+' · '+item.width+'×'+item.height;
          const state=document.createElement('span');state.textContent=item.example?'可预览 / 有参考例程':'可预览';
          row.append(name,state);$('preset-list').append(row);
        });
      }
      $('zoom').append(...ZOOMS.map(([value,label])=>{
        const b=document.createElement('button');b.type='button';b.className='chip';b.dataset.zoom=value;b.textContent=label;
        if(value==='1')b.title='按常见电脑屏幕估算，不同显示器会有偏差';return b;
      }));
      $('mono-chips').append(...Object.entries(MONO_TINTS).map(([value,tint])=>{
        const b=document.createElement('button');b.type='button';b.className='chip';b.dataset.mono=value;b.textContent=tint.name;return b;
      }));
      document.querySelectorAll('button,select,input').forEach(el=>{el.disabled=false;});
      const saved=SCREEN_PRESETS.find(item=>item.id===store.get('profile',''));
      if(saved)base=saved;
      configure(base,false);setPaused(false);balanceActions();
      $('status').textContent='本机绘制 · C++ 核心 · 无外部请求'+(panel?'':' · 面板效果不可用');
      $('fingerprint').textContent='核心源码 SHA-256：'+CORE_SHA256.slice(0,16);
      $('pause').onclick=()=>setPaused(!paused);
      $('step').onclick=()=>{if(paused)advance(Math.ceil(1000/segValue('fps')));};
      $('demo').onclick=()=>{setCycling(!cycling);if(cycling){cycleIndex=0;nextCycle=time+4000;play(0);}};
      $('reset').onclick=()=>configure();
      $('profile').onchange=()=>selectProfile($('profile').value);
      $('prev-profile').onclick=()=>stepProfile(-1);
      $('next-profile').onclick=()=>stepProfile(1);
      $('screen-groups').onclick=event=>{
        const b=event.target.closest('[data-group]');
        if(b&&b.dataset.group!==screenGroup)selectProfile(groupPresets(b.dataset.group)[0].id);
      };
      $('apply-size').onclick=()=>{
        const width=Number($('custom-width').value),height=Number($('custom-height').value),round=$('custom-shape').value==='1';
        if(!Number.isInteger(width)||!Number.isInteger(height)||width<16||height<16||width>512||height>512||(round&&width!==height)){
          $('size-error').textContent='宽高须为 16–512 的整数；圆形须宽高相等。';return;
        }
        $('size-error').textContent='';
        configure({id:'custom',name:'自定义屏幕',controller:'CUSTOM',width,height,frame:round?'round':'tft',example:false},false);
      };
      bindSeg('fps',()=>configure());
      for(const id of ['blink','transitions'])$(id).onchange=()=>configure();
      $('housing').onchange=resizeDisplay;$('tracking').onchange=setTracking;
      $('sense-radius').oninput=resizeDisplay;
      for(const id of ['hold','response'])bindSeg(id,()=>{applyGazeConfig();updateTrackingStatus();});
      $('moving-only').onchange=()=>{applyGazeConfig();updateTrackingStatus();};
      bindSeg('motion-sensitivity',()=>{motionAnchor=null;lastMotion=-Infinity;});
      $('fit').onclick=event=>{const b=event.target.closest('[data-fit]');if(b){fit=b.dataset.fit;applyLayout(true);}};
      for(const id of ['face-scale','offset-x','offset-y'])$(id).oninput=()=>applyLayout(true);
      $('layout-reset').onclick=resetLayout;
      $('speed').onchange=()=>{previous=null;};
      $('gx').oninput=$('gy').oninput=gaze;
      $('center').onclick=()=>{$('gx').value=$('gy').value='0';gaze();};
      $('zoom').onclick=event=>{const b=event.target.closest('[data-zoom]');if(b&&!b.disabled){zoom=b.dataset.zoom==='fit'?'fit':b.dataset.zoom;resizeDisplay();}};
      $('rotate').onclick=()=>{rotated=!rotated;configure(base,true);};
      const saveColors=()=>{store.set('colors',colors);syncControls();draw(true);};
      $('eye-color').oninput=()=>{colors.eye=$('eye-color').value;saveColors();};
      $('bg-color').oninput=()=>{colors.bg=$('bg-color').value;saveColors();};
      $('color-reset').onclick=()=>{colors={...DEFAULT_COLORS};saveColors();};
      $('mono-chips').onclick=event=>{const b=event.target.closest('[data-mono]');if(b){mono=b.dataset.mono;store.set('mono',mono);syncControls();renderPanel();}};
      for(const id of ['show-area','glass-glare'])$(id).onchange=resizeDisplay;
      for(const id of ['pixel-grid','panel-glow','raw-pixels'])$(id).onchange=renderPanel;
      $('download').onclick=()=>{
        const url=URL.createObjectURL(new Blob(['<!doctype html>\n'+INITIAL_DOCUMENT],{type:'text/html;charset=utf-8'}));
        const link=document.createElement('a');link.href=url;link.download='agent-robot-eyes-preview.html';
        document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
      };
      const updatePointer=event=>{
        if(event.pointerType==='touch'&&event.buttons===0)return;
        if(!motionAnchor||Math.hypot(event.clientX-motionAnchor.x,event.clientY-motionAnchor.y)>=segValue('motion-sensitivity')){
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
        new ResizeObserver(()=>{if(api&&zoom==='fit')resizeDisplay();}).observe($('stage'));
        new ResizeObserver(()=>requestAnimationFrame(balanceActions)).observe($('actions').parentElement);
      }
      requestAnimationFrame(frame);
    }catch(error){fail(error);}
  }
  start();
})();
