// Native SVG swatches: no image files, external libraries or remote requests.
export function skin(label, english, description, base, eye, rim, background, options = {}) {
  return {label, english, description, base, eye, rim,
    stage: `radial-gradient(ellipse at 35% 25%,${background[0]},${background[1]})`,
    ink: background[2] || '#8c918b', shine: .35, shade: .25,
    antenna: [rim, base[1], base.at(-1)], ...options};
}

export const extraSkins = {
  pearl: skin('贝壳珍珠', 'NACRE', '贝壳细纹 · 柔粉珠光 · 温润反射',
    ['#fff8eb','#ecd8e6','#c6ddd8','#b5afcf'], '#615e79', '#fff6e8', ['#faf6f1','#e5dce6'], {pattern:'pearl',shine:.82}),
  hologram: skin('镭射糖纸', 'HOLOGRAPHIC', '彩虹色带 · 折射亮片 · 镭射光泽',
    ['#88e9df','#c5b6f5','#f6b8d0','#f5ebad','#9adce0'], '#393e75', '#f5ffff', ['#f0f0fc','#d8dcec'], {pattern:'hologram',linear:true,shine:.7}),
  ice: skin('冰川水晶', 'GLACIER', '冰蓝切面 · 细小气泡 · 清透冰纹',
    ['#f0ffff','#b6e9f2','#71b9d4','#437baf'], '#214f7d', '#efffff', ['#edfaff','#d2e7f0'], {pattern:'ice',translucent:true,shine:.8}),
  soap: skin('彩虹泡泡', 'SOAP BUBBLE', '透明薄膜 · 彩色弧光 · 轻盈水泡',
    ['#f9eafa','#bfe6ed','#ded1f0','#bad9e6'], '#635077', '#fff4fa', ['#f8edf6','#d5e9df'], {pattern:'soap',translucent:true,shine:.92,shade:.13}),
  copper: skin('铜绿古物', 'PATINA', '斑驳铜色 · 青绿氧化 · 岁月痕迹',
    ['#d1a276','#aa754c','#815b42','#4e6759'], '#fff3d4', '#e1c09a', ['#eee6d8','#cbd7cd'], {pattern:'copper',matte:true,shine:.2}),
  leather: skin('焦糖皮革', 'LEATHER', '压纹皮面 · 暖棕包边 · 细密缝线',
    ['#c79665','#ab784c','#8f5d38','#6a432b'], '#ffedd0', '#e8c095', ['#f3e6d6','#dfc8b2'], {pattern:'leather',stitched:true,matte:true,shine:.16}),
  cork: skin('软木积木', 'CORK', '细碎木粒 · 蜂窝孔隙 · 自然浅棕',
    ['#e8cb99','#cfad76','#b99159','#9c7646'], '#604831', '#efdab6', ['#f6eedb','#e4d5b8'], {pattern:'cork',matte:true,shine:.1}),
  knit: skin('莓果毛衣', 'KNIT', '交错针脚 · 蓬松线圈 · 温暖织物',
    ['#cf9ead','#b67e95','#995e79','#79435f'], '#fff3df', '#ebc9d2', ['#f6e8e9','#e2cbd2'], {pattern:'knit',matte:true,shine:.09}),
  bamboo: skin('竹编小篮', 'BAMBOO', '斜向竹篾 · 疏密编织 · 浅金竹色',
    ['#e7d49b','#ceb574','#b79b5b','#937a40'], '#574f2b', '#f4e5b5', ['#f4efdb','#d9ddbe'], {pattern:'bamboo',matte:true,shine:.13}),
  origami: skin('折纸山谷', 'ORIGAMI', '多边折面 · 清晰折痕 · 柔彩纸张',
    ['#f5e5d3','#e6c7b0','#b9c7c1','#a0a8bb'], '#4a535a', '#fff0e2', ['#f4f0e8','#e2dcd5'], {pattern:'origami',matte:true,shine:.07}),
  stained: skin('彩绘玻璃', 'STAINED GLASS', '彩色拼片 · 深色镶边 · 透亮窗花',
    ['#d7cde8','#91bfc3','#878bb8','#5b668c'], '#fffce7', '#efe3ff', ['#ece8f4','#cdd7e3'], {pattern:'stained',shine:.65}),
  circuit: skin('电路精灵', 'CIRCUIT', '金色走线 · 圆形焊点 · 深绿电路',
    ['#3c6c61','#235347','#163b34','#102b29'], '#e8ffbd', '#abd5a7', ['#dbe9dd','#bdcfc4'], {pattern:'circuit',shine:.3}),
  koi: skin('锦鲤白釉', 'KOI', '雪白釉面 · 朱红色斑 · 东方陶彩',
    ['#fffaf0','#ece7da','#d7d4c8','#b5b9b3'], '#343e4c', '#fffae9', ['#f8eee5','#e5d4c4'], {pattern:'koi',shine:.7}),
  sakura: skin('樱花信笺', 'SAKURA', '柔粉花瓣 · 深红花蕊 · 浅绿叶片',
    ['#fff3f3','#f6dbdf','#e7bfc9','#c698ad'], '#714d68', '#fff6f3', ['#fcf0f3','#e8d6e1'], {pattern:'sakura',matte:true,shine:.2}),
  lace: skin('午夜蕾丝', 'LACE', '花瓣圆纹 · 米白细线 · 深蓝底色',
    ['#4d526f','#353a57','#252b46','#1c2138'], '#fff0d6', '#d6d5df', ['#ecebf1','#d5d4df'], {pattern:'lace',matte:true,shine:.15}),
  checker: skin('棋盘派对', 'CHECKER', '奶油方格 · 珊瑚橙色 · 复古玩具',
    ['#fff0d7','#efdcbf','#d8bfa2','#ba987f'], '#4f526b', '#fff4df', ['#faf0df','#eedac3'], {pattern:'checker',shine:.45}),
  tiger: skin('小虎橘子', 'TIGER', '橘黄底色 · 弯曲虎纹 · 活泼野趣',
    ['#f8cb7d','#e9a84e','#cc7e31','#a45b24'], '#fff5df', '#ffe5ae', ['#fbefd7','#ead3b1'], {pattern:'tiger',shine:.28}),
  camo: skin('森林迷彩', 'CAMOUFLAGE', '苔绿块面 · 沙色斑块 · 户外气息',
    ['#a3ae80','#7c8c5c','#5c7046','#405237'], '#fff2c7', '#d7dfb7', ['#ebedde','#cfd7bf'], {pattern:'camo',matte:true,shine:.08}),
  topo: skin('等高线地图', 'TOPOGRAPHY', '层层曲线 · 湖蓝底色 · 山川起伏',
    ['#7dbbb6','#519a98','#347b80','#235d68'], '#efffe4', '#bcebd6', ['#e9f3e9','#cadfd8'], {pattern:'topo',matte:true,shine:.15}),
  wave: skin('青海波纹', 'SEIGAIHA', '半圆水纹 · 靛蓝瓷色 · 层叠波浪',
    ['#5b7fa5','#3f648e','#2b4c77','#20395d'], '#fff1d4', '#c6dded', ['#edf1f2','#d1dce5'], {pattern:'wave',shine:.46}),
  moon: skin('月球漫游', 'MOON', '圆形陨坑 · 灰白月壤 · 浮雕阴影',
    ['#e1e0d7','#bbbdb6','#979e9b','#737e80'], '#374750', '#f1eee1', ['#333d4a','#1c2633','#a4b0ba'], {pattern:'moon',matte:true,shine:.1}),
};

export function extraTexture(defs, id, kind, el, gradient) {
  if (!(kind in extraSkins)) return null;
  const size = {pearl:240,hologram:120,ice:240,soap:240,copper:100,leather:24,cork:64,knit:18,bamboo:32,origami:120,stained:80,circuit:80,koi:200,sakura:72,lace:64,checker:48,tiger:120,camo:120,topo:160,wave:48,moon:160}[kind];
  const p = el('pattern', {id,width:size,height:size,patternUnits:'userSpaceOnUse'}, defs);
  const path = (d,stroke,width=1,opacity=1,fill='none',parent=p) => el('path',{d,stroke,'stroke-width':width,opacity,fill,'stroke-linejoin':'round','stroke-linecap':'round'},parent);
  const circle = (cx,cy,r,fill,opacity=1,parent=p) => el('circle',{cx,cy,r,fill,opacity},parent);
  if (kind === 'pearl') {
    for(let i=0;i<20;i++) path(`M-20 ${i*15}Q90 ${i*15-100} 260 ${i*15-22}`,i%2?'#d5c1e2':'#fff9e4',2,.35);
  } else if (kind === 'hologram') {
    const colors=['#fff7bc','#96ffe6','#d9bcff','#ffb8de'];
    for(let i=0;i<4;i++) path(`M${i*30-60} 0l60 120h18L${i*30-42} 0Z`,'none',0,.28,colors[i]);
    for(const [x,y] of [[25,26],[91,83]]) path(`M${x-6} ${y}h12m-6-6v12`,'#fff',1,.85);
  } else if (kind === 'ice') {
    const facets=['M0 0L110 30 42 119Z','M110 30L240 0 195 143Z','M42 119L195 143 121 240Z','M195 143L240 0 240 240Z'];
    facets.forEach((d,i)=>path(d,'#f3ffff',.8,.18+i*.035,i%2?'#efffff':'#5b9fc2'));
    path('M110 30L99 80 131 107 121 162M42 119L63 167 50 210','#f4ffff',1.1,.7);
    for(let i=0;i<22;i++) circle((i*43.7)%240,(i*i*19.3)%240,.8+i%3*.5,'#fff',.35);
  } else if (kind === 'soap') {
    ['#efb4e5','#94ddd9','#faf0b4','#b9b1e9'].forEach((c,i)=>{
      path(`M${25+i*3} ${155-i*5}C${-5+i*3} 80 40 ${20+i*4} ${133+i*3} ${20+i*4}`,c,3,.55);
      path(`M${210-i*3} 82Q${253-i*4} 190 ${120-i*2} ${213-i*3}`,c,2,.5);
    });
    for(const [x,y,r] of [[58,173,9],[181,43,5],[193,168,13]]) el('circle',{cx:x,cy:y,r,fill:'none',stroke:'#fff','stroke-width':1.4,opacity:.5},p);
  } else if (kind === 'copper') {
    for(let i=0;i<32;i++) {
      const x=(i*37.2)%100,y=(i*i*17.1)%100,r=3+i%6*2;
      path(`M${x-r} ${y}q${r*.3} ${-r*2} ${r*1.5} ${-r}t${r*.2} ${r*1.6}q${-r} ${r} ${-r*1.7} ${-r*.6}Z`,'none',0,.35,['#428c7e','#8ab99c','#315f52'][i%3]);
    }
  } else if (kind === 'leather') {
    path('M0 3L7 1 12 6 22 3 24 9M0 16L8 11 16 15 24 12M7 1L8 11 4 24M16 15L19 24','#402719',.6,.22);
    path('M1 4L7 3 11 7M9 12L15 16 23 13','#f0d6ad',.5,.25);
  } else if (kind === 'cork') {
    for(let i=0;i<65;i++) {
      const x=(i*23.7)%64,y=(i*i*11.3)%64,r=1+i%3;
      el('rect',{x,y,width:r*1.7,height:r,rx:.5,fill:['#76542e','#fff0c6','#aa743a'][i%3],opacity:.3,transform:`rotate(${i*31} ${x} ${y})`},p);
    }
  } else if (kind === 'knit') {
    for(const x of [4,13]) for(const y of [-2,7,16]) {
      path(`M${x-3} ${y}Q${x-4} ${y+5} ${x} ${y+8}Q${x+4} ${y+5} ${x+3} ${y}`,'#65324d',2.5,.4);
      path(`M${x-2} ${y}L${x} ${y+6} ${x+2} ${y}`,'#edc4d2',1.5,.6);
    }
  } else if (kind === 'bamboo') {
    for(let i=-2;i<4;i++) {
      path(`M${i*16} -16l64 64`,'#796335',6,.3);
      path(`M${i*16+2} -16l64 64`,'#f1dfad',3,.65);
      path(`M${i*16} 48l64-64`,'#c6a76c',6,.8);
      path(`M${i*16+2} 48l64-64`,'#f9eac0',1,.55);
    }
  } else if (kind === 'origami' || kind === 'stained') {
    const s=size, m=s*.43;
    const shapes=[`M0 0H${s}L${m} ${m}Z`,`M${s} 0V${s}L${m} ${m}Z`,`M${s} ${s}H0L${m} ${m}Z`,`M0 ${s}V0L${m} ${m}Z`];
    const colors=kind==='stained'?['#c29a57','#508e8d','#9279a7','#698bb0']:['#fff5dc','#8ca6ae','#b5b7d5','#eab69d'];
    shapes.forEach((d,i)=>path(d,kind==='stained'?'#303951':'#fff7ef',kind==='stained'?2.7:.7,kind==='stained'?.85:.6,colors[i]));
  } else if (kind === 'circuit') {
    for(const d of ['M0 12H22L38 28H80','M8 80V53L24 37V0','M44 80V57L63 38H80','M52 0V12L68 28']) path(d,'#d1bc73',1.3,.7);
    for(const [x,y] of [[38,28],[24,37],[44,57],[68,28]]) {
      circle(x,y,3,'#dac98c',.9);circle(x,y,1.3,'#285348');
    }
    el('rect',{x:47,y:7,width:14,height:10,rx:2,fill:'#102f2c',stroke:'#819d76','stroke-width':.7},p);
  } else if (kind === 'koi') {
    for(const d of ['M-8 0H65Q90 18 61 36T9 83Q-15 55-8 0Z','M148 45Q192 31 208 81T171 124Q144 104 148 45Z','M40 143Q61 114 87 139T108 200H57Q28 177 40 143Z']) path(d,'none',0,.9,'#cb5744');
    path('M116 10q20-10 21 10t-21 14q-12-9 0-24M127 150q22-9 28 5t-20 18Z','none',0,.75,'#3c444c');
  } else if (kind === 'sakura') {
    for(const [x,y,r] of [[18,20,9],[56,54,7]]) {
      const g=el('g',{transform:`translate(${x} ${y})`},p);
      for(let i=0;i<5;i++) el('ellipse',{cx:0,cy:-r*.65,rx:r*.42,ry:r*.7,fill:'#fff4ed',stroke:'#d897ab','stroke-width':.5,transform:`rotate(${i*72})`},g);
      circle(0,0,2,'#b46084',.8,g);
    }
    path('M35 50q-10-14-14-4q8 9 14 4M49 12q13-6 11-12q-13 0-11 12','none',0,.5,'#91ad86');
  } else if (kind === 'lace') {
    for(const [x,y] of [[0,0],[32,32],[64,0],[0,64],[64,64]]) {
      const g=el('g',{transform:`translate(${x} ${y})`},p);
      for(let i=0;i<8;i++) el('ellipse',{cx:0,cy:10,rx:4,ry:10,fill:'none',stroke:'#eee1ce','stroke-width':.7,opacity:.65,transform:`rotate(${i*45})`},g);
      circle(0,0,2,'#eee1ce',.7,g);
      for(let i=0;i<12;i++) circle(Math.cos(i*Math.PI/6)*24,Math.sin(i*Math.PI/6)*24,.7,'#eee1ce',.6,g);
    }
  } else if (kind === 'checker') {
    for(const [x,y] of [[0,0],[24,24]]) el('rect',{x,y,width:24,height:24,fill:'#cf775e',opacity:.85},p);
  } else if (kind === 'tiger') {
    for(const d of ['M0 4Q37 13 55 1Q47 23 0 21Z','M120 30Q76 29 53 52Q88 42 120 48Z','M0 66Q30 64 54 90Q32 78 0 84Z','M120 91Q93 83 74 120H94Q96 108 120 107Z']) path(d,'none',0,.88,'#44332c');
  } else if (kind === 'camo') {
    for(const [d,c] of [['M-10 6Q23-8 42 19T78 31Q92 57 54 61T6 44Z','#d0c394'],['M93-9Q67 14 89 32T128 66V-9Z','#3d5037'],['M-5 91Q21 59 44 88T88 99L84 132H-5Z','#526348'],['M101 64Q70 64 80 87T121 104V70Z','#b4a573']]) path(d,'none',0,.9,c);
  } else if (kind === 'topo') {
    for(let i=0;i<11;i++) {
      const r=9+i*7;
      path(`M${80-r} 80C${80-r*1.3} ${80-r} ${80+r*.6} ${80-r*1.4} ${80+r} ${80-r*.4}S${80+r*.4} ${80+r*1.4} ${80-r*.4} ${80+r}S${80-r} 95 ${80-r} 80Z`,'#d8edc9',i%3===0?1.2:.6,.48);
    }
  } else if (kind === 'wave') {
    for(const [x,y] of [[0,24],[48,24],[24,48],[0,72],[48,72]]) for(const r of [6,12,18,24]) path(`M${x-r} ${y}a${r} ${r} 0 0 1 ${r*2} 0`,'#e7e7cf',1,.55);
  } else if (kind === 'moon') {
    gradient(defs,'radialGradient',`${id}-crater`,{cx:'.35',cy:'.25',r:'.8'},[[0,'#46575e',.55],[.55,'#697979',.22],[.79,'#f6f3e1',.4],[1,'#d9ddd3',0]]);
    for(const [x,y,r] of [[29,30,17],[104,45,28],[62,112,23],[137,128,12],[14,136,7],[144,12,8]]) circle(x,y,r,`url(#${id}-crater)`);
    for(let i=0;i<50;i++) circle((i*41.7)%160,(i*i*13.1)%160,.4+i%2*.3,i%2?'#fff8dc':'#455b63',.25);
  }
  return p;
}
