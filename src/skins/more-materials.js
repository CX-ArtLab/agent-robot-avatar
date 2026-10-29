// Native SVG swatches: no image files, external libraries or remote requests.
const EXTRA = new Set(['cork', 'pearl', 'hologram', 'ice', 'soap', 'leather', 'lace', 'bamboo', 'wave', 'origami', 'circuit', 'topo']);

export function extraTexture(defs, id, kind, el, gradient) {
  if (!EXTRA.has(kind)) return null;
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
  } else if (kind === 'leather') {
    path('M0 3L7 1 12 6 22 3 24 9M0 16L8 11 16 15 24 12M7 1L8 11 4 24M16 15L19 24','#402719',.6,.22);
    path('M1 4L7 3 11 7M9 12L15 16 23 13','#f0d6ad',.5,.25);
  } else if (kind === 'cork') {
    for(let i=0;i<65;i++) {
      const x=(i*23.7)%64,y=(i*i*11.3)%64,r=1+i%3;
      el('rect',{x,y,width:r*1.7,height:r,rx:.5,fill:['#76542e','#fff0c6','#aa743a'][i%3],opacity:.3,transform:`rotate(${i*31} ${x} ${y})`},p);
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
  } else if (kind === 'lace') {
    for(const [x,y] of [[0,0],[32,32],[64,0],[0,64],[64,64]]) {
      const g=el('g',{transform:`translate(${x} ${y})`},p);
      for(let i=0;i<8;i++) el('ellipse',{cx:0,cy:10,rx:4,ry:10,fill:'none',stroke:'#eee1ce','stroke-width':.7,opacity:.65,transform:`rotate(${i*45})`},g);
      circle(0,0,2,'#eee1ce',.7,g);
      for(let i=0;i<12;i++) circle(Math.cos(i*Math.PI/6)*24,Math.sin(i*Math.PI/6)*24,.7,'#eee1ce',.6,g);
    }
  } else if (kind === 'topo') {
    for(let i=0;i<11;i++) {
      const r=9+i*7;
      path(`M${80-r} 80C${80-r*1.3} ${80-r} ${80+r*.6} ${80-r*1.4} ${80+r} ${80-r*.4}S${80+r*.4} ${80+r*1.4} ${80-r*.4} ${80+r}S${80-r} 95 ${80-r} 80Z`,'#d8edc9',i%3===0?1.2:.6,.48);
    }
  } else if (kind === 'wave') {
    for(const [x,y] of [[0,24],[48,24],[24,48],[0,72],[48,72]]) for(const r of [6,12,18,24]) path(`M${x-r} ${y}a${r} ${r} 0 0 1 ${r*2} 0`,'#e7e7cf',1,.55);
  }
  return p;
}
