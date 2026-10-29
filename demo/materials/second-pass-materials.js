// Current selection: twelve new compositions and the cloud-only adjustment.
export const currentRedesign = new Set(['tiger','peach','latte','fern','birch','malachite','agate','cloud','houndstooth','paisley','bauhaus','opart','kintsugi']);
export const secondPass = {
  pixel: {base:['#344354','#203143','#142332','#0c1725'],eye:'#aef9d8',shine:.32,shade:.32,description:'复古小屏幕 · 像素边框 · 荧光状态灯'},
  lava: {base:['#ffd17a','#f78d36','#d54a21','#8f251b'],eye:'#fff1ba',shine:.08,shade:.26,description:'炽热熔浆底 · 不规则岩块 · 红金裂隙'},
  knit: {base:['#d5a4b6','#b5809b','#925d7c','#70465f'],eye:'#fff2da',shine:.06,shade:.22,description:'粗线绞花 · 针织罗纹 · 莓紫毛线'},
  tiger: {base:['#f6cf8d','#e9ad59','#c9863b','#a6642b'],eye:'#fff1cd',shine:.19,description:'自然流线虎斑 · 焦糖橘色 · 细柔毛纹'},
  kiwi: {base:['#e2efb0','#bdd574','#94b94e','#627f35'],eye:'#304c29',shine:.34,edgeColor:'#8a7845',description:'鲜绿果肉 · 细密放射纤维 · 褐色薄皮'},
  lemon: {base:['#fff3ac','#f6d657','#eab62c','#c58c22'],eye:'#70501e',shine:.52,edgeColor:'#e6c84b',description:'饱满果瓣 · 浅黄果膜 · 油润柠檬皮'},
  peach: {base:['#fff1d7','#ffd6c3','#f3aeb1','#da829c'],eye:'#7b4e66',shine:.12,shade:.14,description:'奶桃双色 · 柔绒细毛 · 朦胧果粉'},
  matcha: {base:['#ece9cc','#c5d29e','#8fa866','#59763f'],eye:'#364e2f',shine:.37,description:'奶绿交融 · 宽幅流动纹 · 抹茶细粉'},
  latte: {base:['#f8e4c3','#e6c18e','#c99b68','#94683f'],eye:'#593f30',shine:.38,description:'奶泡爱心 · 焦糖流纹 · 丝滑拿铁'},
  fern: {base:['#f0f1dd','#dce6cf','#b8cdb5','#8cae98'],eye:'#365949',shine:.14,description:'整枝舒展蕨叶 · 浅绿纸面 · 羽状细脉'},
  birch: {base:['#fffdf1','#ece8dc','#d5d2c3','#afb4a6'],eye:'#414e4a',shine:.07,description:'横向薄皮剥落 · 深灰短裂纹 · 白桦哑光'},
  malachite: {base:['#80b297','#438267','#20543f','#113a2d'],eye:'#fff0cd',shine:.61,description:'宽窄矿脉交错 · 沉绿层带 · 温润石光'},
  agate: {base:['#eee4f0','#c9b6d9','#a18bbb','#745f92'],eye:'#504161',shine:.58,description:'半透明紫晶 · 柔白石脉 · 局部晶面'},
  cloud: {base:['#b5e0f2','#86bfe0','#5f9bc9','#3e73a4'],eye:'#264c76',shine:.2,description:'连绵白云帽 · 蓝天机身 · 清爽留白'},
  houndstooth: {base:['#f5edda','#e6dcc7','#cbbfa9','#a99e88'],eye:'#6c455b',shine:.08,description:'整面经典千鸟格 · 柔灰暖白 · 细密纤维'},
  paisley: {base:['#a26b57','#825043','#623d36','#432b2b'],eye:'#fff1d4',shine:.16,description:'细金腰果印花 · 温暖赭棕 · 小叶与花点'},
  bauhaus: {base:['#f8eed8','#e9ddc5','#cfc3a8','#afa48d'],eye:'#2c434a',eyeRight:'#2c434a',shine:.17,description:'蓝色圆拱 · 赭红基座 · 姜黄圆点'},
  opart: {base:['#f6f0e5','#e1e1d6','#c2cbc3','#99aba3'],eye:'#a45368',shine:.12,description:'弯曲棋盘网格 · 中央鼓起 · 黑白视觉起伏'},
  chevron: {base:['#f3e8cd','#e4d5b3','#c8b48f','#9e8e70'],eye:'#3d5052',shine:.07,description:'人字编织 · 青绿主色 · 少量赭红点缀'},
  kintsugi: {base:['#3b5a4e','#244437','#153026','#0b201a'],eye:'#f8eac8',shine:.76,description:'一线流金 · 自然分叉裂痕 · 深釉墨瓷'},
};

export function secondPassTexture(defs,id,kind,el,gradient) {
  if (!kind.startsWith('second-')) return null;
  const name=kind.slice(7);
  if (!(name in secondPass)) return null;
  const p=el('pattern',{id,width:240,height:240,patternUnits:'userSpaceOnUse'},defs);
  const path=(d,fill='none',stroke='none',width=1,opacity=1,parent=p)=>el('path',{d,fill,stroke,'stroke-width':width,opacity,'stroke-linejoin':'round','stroke-linecap':'round'},parent);
  const circle=(cx,cy,r,fill,opacity=1,parent=p)=>el('circle',{cx,cy,r,fill,opacity},parent);
  const rect=(x,y,width,height,fill,rx=0,opacity=1,parent=p)=>el('rect',{x,y,width,height,rx,fill,opacity},parent);
  const ellipse=(cx,cy,rx,ry,fill,opacity=1,parent=p)=>el('ellipse',{cx,cy,rx,ry,fill,opacity},parent);
  const noise=(count,colors,opacity=.2)=>{
    for(let i=0;i<count;i++)circle((i*71.731+13)%240,(i*i*29.37+9)%240,.25+i%3*.2,colors[i%colors.length],opacity);
  };
  const glow=(key,color,opacity,cx,cy,rx,ry)=>{
    gradient(defs,'radialGradient',`${id}-${key}`,{},[[0,color,opacity],[.6,color,opacity*.5],[1,color,0]]);
    ellipse(cx,cy,rx,ry,`url(#${id}-${key})`);
  };
  if(name==='pixel') {
    rect(33,39,174,154,'#0c1c29',25,.88);
    path('M57 45H183L199 61V172L183 187H57L41 171V61Z','none','#65968b',1.3,.75);
    for(let y=50;y<184;y+=4)path(`M45 ${y}H195`,'none','#93debb',.55,.1);
    for(const [x,y] of [[47,51],[185,51],[47,173],[185,173]])rect(x,y,7,7,'#a3dfb6',0,.7);
    for(let i=0;i<4;i++)rect(79+i*10,202,6,4,i<3?'#a9ebc7':'#42625b',0,.8);
    path('M159 201h14m-7-7v14','none','#d9c58e',3,.9);
    rect(104,24,32,3,'#779f9d',1,.65);
    glow('screen','#39ce9d',.09,120,120,95,80);
  } else if(name==='lava') {
    const plates=[
      'M15 14L89 13 80 42 63 68 26 77 10 48Z',
      'M97 9L174 12 184 49 157 73 101 65 86 43Z',
      'M184 13L231 24 235 92 202 83 188 54Z',
      'M14 90L59 79 78 93 68 143 24 160 5 131Z',
      'M87 81L158 84 178 111 162 151 103 164 79 140Z',
      'M174 88L207 94 235 111 226 166 184 152 187 113Z',
      'M12 173L67 154 95 177 98 222 28 237Z',
      'M107 179L165 164 191 190 175 235 109 232Z',
      'M184 164L230 177 236 233 187 234 202 193Z',
    ];
    plates.forEach((d,i)=>{path(d,['#272930','#363332','#22272c'][i%3],'#a64f2d',1.6);path(d,'none','#f5a34e',.45,.5);});
    noise(440,['#f6ba70','#6d6962','#11191f'],.2);
    glow('hot','#ffcf6e',.28,90,179,55,40);
  } else if(name==='knit') {
    for(let x=23;x<220;x+=10)for(let y=24;y<198;y+=10){
      path(`M${x-3} ${y}L${x} ${y+7} ${x+3} ${y}`,'none','#613c57',3,.4);
      path(`M${x-2} ${y}L${x} ${y+6} ${x+2} ${y}`,'none','#ddb4c9',1.3,.6);
    }
    for(const x of [49,120,191]) for(let y=17;y<202;y+=32){
      path(`M${x-9} ${y}C${x-10} ${y+14} ${x+9} ${y+17} ${x+9} ${y+32}M${x+9} ${y}C${x+10} ${y+14} ${x-9} ${y+17} ${x-9} ${y+32}`,'none','#6f4261',9,.9);
      path(`M${x-9} ${y}C${x-10} ${y+14} ${x+9} ${y+17} ${x+9} ${y+32}M${x+9} ${y}C${x+10} ${y+14} ${x-9} ${y+17} ${x-9} ${y+32}`,'none','#d6a5bf',5,.9);
      path(`M${x-10} ${y}C${x-11} ${y+14} ${x+8} ${y+17} ${x+8} ${y+32}`,'none','#f0cddd',1,.65);
    }
    rect(0,199,240,41,'#9b6787',0,.9);
    for(let x=20;x<222;x+=6)path(`M${x} 200v28`,'none','#d7aac2',2,.65);
    path('M20 199H220','none','#673d57',2,.45);
  } else if(name==='tiger') {
    glow('warm-fur','#ffedc7',.6,144,180,110,75);
    const marks=['M-10 35C23 17 51 20 76 47S116 73 142 68C104 88 76 71 57 53S15 53-10 67Z','M102-10C111 17 136 26 165 28S207 55 213 76C195 52 173 48 146 47S100 29 85-10Z','M249 98C222 80 203 76 185 89S159 107 145 101C155 123 177 113 193 105S223 116 249 127Z','M-10 112C13 91 32 98 48 118S77 145 99 138C78 161 47 147 34 131S9 134-10 145Z','M250 166C216 144 194 147 176 172S139 194 126 186C134 207 168 209 190 185S225 189 250 196Z','M2 191C33 176 53 181 66 201S93 225 109 224C82 239 61 224 47 210S18 215 2 223Z'];
    marks.forEach(d=>path(d,'#4c392d','none',0,.91));
    for(let i=0;i<320;i++){
      const x=(i*71.3)%240,y=(i*i*17.9)%240;
      path(`M${x} ${y}l1.2 2.1`,'none',i%2?'#f7d79f':'#ac7946',.4,.14);
    }
  } else if(name==='kiwi') {
    glow('pulp','#e7f4b3',.9,115,111,105,108);
    for(let i=0;i<130;i++){
      const a=i*Math.PI/65,t=(r)=>`${120+Math.cos(a)*r} ${120+Math.sin(a)*r}`;
      path(`M${t(29+i%5)}L${t(103)}`,'none',i%3?'#e3edaf':'#739535',.6,.38);
    }
    ellipse(120,120,27,36,'#f1edca',.95);
    for(let i=0;i<35;i++){
      const a=i*Math.PI*2/35,r=67+(i%4)*3,x=120+Math.cos(a)*r,y=120+Math.sin(a)*(r+4);
      el('ellipse',{cx:x,cy:y,rx:1.5,ry:3.1,fill:'#374c2a',transform:`rotate(${i*360/35-90} ${x} ${y})`},p);
      circle(x-1,y-1,.55,'#d3dfa2',.8);
    }
    noise(180,['#e8efba','#6e9239'],.18);
  } else if(name==='lemon') {
    const colors=['#f8d254','#f9df77','#f1c544','#ffe88c'];
    for(let i=0;i<8;i++){
      const a=i*Math.PI/4+.04,b=a+.67,point=(r,t)=>`${120+Math.cos(t)*r} ${120+Math.sin(t)*r}`;
      path(`M${point(12,a+.05)}Q${point(57,a-.05)} ${point(102,a)}Q${point(118,(a+b)/2)} ${point(102,b)}Q${point(58,b+.05)} ${point(12,b-.05)}Z`,colors[i%4],'#fff0b5',2,.97);
      for(let j=0;j<7;j++){
        const t=a+.08+j*.08,r=76+j%3*6;
        path(`M${point(23+j%3*3,t)}Q${point(54,t+.015)} ${point(r,t)}`,'none','#fff4c6',.65,.64);
      }
    }
    circle(120,120,9,'#fff2c5');
    for(const [x,y,a] of [[112,59,18],[166,167,-35]])el('ellipse',{cx:x,cy:y,rx:2.6,ry:5.3,fill:'#fff5cf',transform:`rotate(${a} ${x} ${y})`},p);
  } else if(name==='peach') {
    glow('left-lobe','#fff2c9',.88,76,85,83,123);
    glow('right-lobe','#ed8fa6',.66,173,128,84,119);
    glow('peach-bloom','#fff0e0',.35,111,163,97,70);
    path('M124 24Q112 42 119 68M122 184Q127 207 120 222','none','#d48c9b',2,.15);
    path('M128 25Q117 44 124 67M126 185Q131 206 125 219','none','#fff6dd',1.4,.45);
    for(let i=0;i<720;i++){
      const x=(i*79.13)%240,y=(i*i*23.7)%240;
      path(`M${x} ${y}l.4-1.5`,'none',i%4?'#fff3e6':'#db8e9c',.45,.28);
    }
  } else if(name==='matcha') {
    const streams=[['M-10 29C80 71 95-5 177 31S268 104 228 138',29,'#f4edd4'],['M-10 91C63 151 74 28 154 78S231 185 256 162',18,'#dce2b6'],['M-12 156C67 224 118 103 169 154S224 241 258 203',26,'#f0e8cc'],['M-10 213C38 253 72 199 116 218',11,'#dce2b6']];
    streams.forEach(([d,w,c])=>path(d,'none',c,w,.87));
    path('M-10 153C67 221 118 100 169 151S224 238 258 200','none','#6c8c48',3,.45);
    for(const [x,y,r] of [[45,53,3],[189,184,5],[73,195,2],[155,44,3]])circle(x,y,r,'#dce3b8',.75);
    noise(250,['#547436','#fff6db'],.15);
  } else if(name==='latte') {
    glow('crema','#fff1d2',.75,119,113,105,108);
    path('M-15 48C48 8 105 12 149 29S215 45 248 19','none','#9c6439',13,.35);
    path('M-15 59C48 19 105 23 149 40S215 56 248 30','none','#fff0d2',5,.76);
    path('M-12 190C66 239 145 154 203 186S238 225 254 212','none','#a77547',16,.5);
    path('M-12 183C66 232 145 147 203 179S238 218 254 205','none','#fff2d7',6,.85);
    path('M120 89C80 72 89 47 107 51Q117 52 120 61Q126 46 139 51C161 60 147 79 120 89Z','#fff7e4','none',0,.96);
    path('M120 83C94 71 100 56 112 63M125 63Q135 53 141 63','none','#d4ac7a',.8,.4);
    for(let i=0;i<34;i++){
      const a=i*.37,x=120+Math.cos(a)*92,y=120+Math.sin(a)*96;
      circle(x,y,.6+i%3*.4,'#fff4d9',.55);
    }
  } else if(name==='fern') {
    const stem=el('g',{transform:'translate(32 221) rotate(26)'},p);
    path('M0 0C-12-54 13-135 17-191','none','#6a8c65',1.5,.9,stem);
    for(let i=0;i<14;i++)for(const side of [-1,1]){
      const y=-14-i*12,x=5+i*.7,w=8+Math.sin((i+1)/15*Math.PI)*24;
      path(`M${x} ${y}Q${x+side*w} ${y-1} ${x+side*(w+7)} ${y-18}Q${x+side*w*.4} ${y-17} ${x} ${y}Z`,side<0?'#83a276':'#a1b58b','none',0,.78,stem);
      path(`M${x} ${y}l${side*(w+4)}-16`,'none','#e0e6bc',.7,.8,stem);
      for(let j=1;j<5;j++)path(`M${x+side*w*j/5} ${y-j*3}l${side*4}-5`,'none','#57774e',.35,.45,stem);
    }
    noise(160,['#fff7d9','#829c76'],.13);
  } else if(name==='birch') {
    for(const [y,w] of [[46,85],[80,46],[174,73],[207,125]]){
      const x=y%3===0?18:240-w-12;
      path(`M${x} ${y}q${w*.4}-7 ${w} 0l-5 9q${-w*.5}-6 ${-w+5}-2Z`,'#c0baaa','none',0,.36);
      path(`M${x} ${y}q${w*.4}-7 ${w} 0`,'none','#7f8476',1,.42);
      path(`M${x+3} ${y+3}q${w*.4}-5 ${w-7} 1`,'none','#fffcf0',1.5,.87);
    }
    for(let i=0;i<70;i++){
      const x=12+(i*67.37)%216,y=19+(i*i*31.17)%204,w=2+i%5*2.5;
      path(`M${x} ${y}l${w*.3}-.7 ${w*.7} .3-.8 ${.7+i%3*.4} ${-w*.7} .5Z`,'#53594f','none',0,.42+i%3*.09);
    }
    noise(420,['#fffdf1','#9d9e90'],.14);
  } else if(name==='malachite') {
    const colors=['#a3c4a2','#174a36','#619775','#2a6a4d','#87af8c'];
    for(let i=-6;i<20;i++){
      const x=i*17;
      path(`M${x} -20C${x+90} 26 ${x-54} 88 ${x+7} 139S${x+105} 210 ${x+39} 260`,'none',colors[((i%5)+5)%5],9+(i%3+3)%3*2,.69);
      path(`M${x+5} -20C${x+95} 26 ${x-49} 88 ${x+12} 139S${x+110} 210 ${x+44} 260`,'none','#c0d3aa',.9,.34);
    }
    glow('deepstone','#154833',.37,169,154,95,105);
    glow('polish','#ebefd0',.22,70,56,77,32);
    noise(180,['#b7c8a3','#0e382a'],.09);
  } else if(name==='agate') {
    for(let i=-1;i<10;i++){
      const y=i*29;
      path(`M-15 ${y}C53 ${y+31} 67 ${y-19} 118 ${y+4}S185 ${y+62} 255 ${y+30}`,'none',i%3?'#f5e7ef':'#8c71aa',i%3?5:13,i%3?.38:.24);
      path(`M-15 ${y+8}C53 ${y+39} 67 ${y-11} 118 ${y+12}S185 ${y+70} 255 ${y+38}`,'none','#fff2f4',.8,.6);
    }
    for(const [d,c] of [['M12 17L88 23 53 71Z','#f8eff8'],['M12 17L53 71 18 114Z','#c0a9d4'],['M211 151L236 182 193 216Z','#e6d6ee'],['M193 216L236 182 229 240Z','#8d74a8']])path(d,c,'#f6edf9',.45,.33);
    glow('quartz','#fff7f5',.4,112,88,84,90);
  } else if(name==='cloud') {
    gradient(defs,'linearGradient',`${id}-cloudcap`,{x1:'0',y1:'0',x2:'0',y2:'1'},[[0,'#fff',1],[.55,'#f6fcff',1],[1,'#cbdfed',.95]]);
    path('M-5-5H245V60C227 76 209 74 197 62C184 87 154 81 148 65C129 88 107 82 101 67C80 91 52 82 49 66C28 80 7 72-5 62Z',`url(#${id}-cloudcap)`);
    glow('haze','#e9f8ff',.37,35,204,69,23);
  } else if(name==='houndstooth') {
    const tile=el('pattern',{id:`${id}-cloth`,width:28,height:28,patternUnits:'userSpaceOnUse',patternTransform:'rotate(-8 120 120)'},defs);
    path('M0 7H7V0H14V7H21V14H28V21H21V28H14V21H7V14H0ZM0 0H7L0 7ZM21 0H28V7ZM0 21V28H7ZM21 28H28V21Z','#76766e','none',0,.72,tile);
    rect(0,0,240,240,`url(#${id}-cloth)`);
    for(let y=0;y<240;y+=2)path(`M0 ${y}H240`,'none','#fff7df',.5,.2);
    for(let x=0;x<240;x+=3)path(`M${x} 0V240`,'none','#7e796c',.4,.08);
    glow('cloth-light','#f7eddb',.2,74,65,106,73);
  } else if(name==='paisley') {
    for(const [x,y,a,s] of [[48,47,-35,.48],[118,51,25,.48],[189,58,-12,.5],[42,128,15,.48],[196,137,155,.5],[66,202,-30,.5],[140,197,150,.5],[205,214,20,.46]]){
      const g=el('g',{transform:`translate(${x} ${y}) rotate(${a}) scale(${s})`},p);
      path('M0 34C-29 24-28-9-9-23Q9-36 9-53C45-30 49-3 25 25Q12 39 0 34Z','#a3755d','#e2c294',1.8,.86,g);
      path('M0 25C-20 16-20-5-4-15Q16-23 17-37C34-17 33 3 17 20Z','none','#f0d4a5',1.1,.88,g);
      for(let i=0;i<12;i++){const a=i*Math.PI/6;circle(3+Math.cos(a)*10,3+Math.sin(a)*15,1.5,'#e4c591',.9,g);}
      for(let i=0;i<5;i++)el('ellipse',{cx:3,cy:-2,rx:2.5,ry:6,fill:'#cfb17e',transform:`rotate(${i*72} 3 4)`},g);
    }
    noise(90,['#dfc392'],.2);
  } else if(name==='bauhaus') {
    path('M18 240V102A48 48 0 0 1 114 102V240Z','#86aeb9','none',0,.96);
    rect(0,181,240,59,'#bc6653',0,.94);
    circle(167,58,35,'#d8b45c',.97);
    path('M150 180V212H210','none','#efdfbf',8,.9);
    for(let y=35;y<63;y+=7)path(`M32 ${y}H91`,'none','#40585c',1.7,.8);
    circle(67,191,21,'#e4cd95',.95);
  } else if(name==='opart') {
    const point=(x,y)=>{
      const dx=x-120,dy=y-120,f=1+.32*Math.exp(-(dx*dx+dy*dy)/11000);
      return `${120+dx*f},${120+dy*f}`;
    };
    for(let row=-1;row<9;row++)for(let col=-1;col<9;col++){
      if((row+col)%2===0)continue;
      const x=col*30,y=row*30,points=[];
      for(let i=0;i<=6;i++)points.push(point(x+i*5,y));
      for(let i=1;i<=6;i++)points.push(point(x+30,y+i*5));
      for(let i=1;i<=6;i++)points.push(point(x+30-i*5,y+30));
      for(let i=1;i<6;i++)points.push(point(x,y+30-i*5));
      path(`M${points.join('L')}Z`,'#4c5a5b','none',0,.79);
    }
    glow('bulge','#f4f0e6',.22,100,86,100,90);
  } else if(name==='chevron') {
    for(let y=-30;y<270;y+=24)for(let x=-30;x<270;x+=60){
      const row=Math.round((y+30)/24),c=row%6===0?'#ac7865':row%3===0?'#c6a76c':'#678e86';
      path(`M${x} ${y}l30 16v15l-30-16Z`,c,'none',0,.9);
      path(`M${x+30} ${y+16}l30-16v15l-30 16Z`,row%6===0?'#c4937c':'#9db3a2','none',0,.9);
    }
    for(let y=0;y<240;y+=2.5)path(`M0 ${y}H240`,'none','#f9eccd',.45,.18);
  } else if(name==='kintsugi') {
    const cracks=['M47 13L61 40 87 49 96 69 118 84 116 103 127 121 122 145 146 162 151 185 175 200 184 229','M87 49L110 39 132 42 145 26','M122 145L98 160 85 160 69 178 41 183 20 203','M151 185L171 171 191 175 220 161'];
    for(const [i,d] of cracks.entries()){
      path(d,'none','#0c241b',i?3.3:4.7,.65);
      path(d,'none','#be964b',i?1.8:2.7,.98);
      path(d,'none','#f6df9d',i?.65:1,.9);
    }
    for(const [x,y] of [[87,49],[118,84],[122,145],[151,185]])for(let i=0;i<9;i++)circle(x+Math.cos(i*2.4)*(1+i%3),y+Math.sin(i*2.4)*(1+i%3),.35,'#dfbd73',.75);
    glow('glaze','#dce5c4',.18,75,53,70,31);
  }
  return p;
}
