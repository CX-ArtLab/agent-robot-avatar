// Full-face compositions use the existing 240-unit SVG coordinate system.
// Keep dense decoration away from the eyes (roughly x 60–180, y 95–155).
const finish = (base, eye, description, options = {}) => ({base, eye, description, ...options});
export const revisions = {
  metal: finish(['#647685','#d3dce1','#ffffff','#a9b7c2','#dce4e8','#596b79'],'#1d2e3b','细密横向拉丝 · 宽幅反光 · 冷银边缘',{shine:.26,shade:.32}),
  pixel: finish(['#394b66','#253650','#17263c','#101b2d'],'#b8f9d8','像素小图标 · 暗色屏幕 · 薄荷荧光',{shine:.12,shade:.27}),
  lava: finish(['#514d4d','#353337','#23242b','#171b22'],'#fff0ba','岩壳细孔 · 边缘熔隙 · 内部橙光',{shine:.09,shade:.32}),
  cow: finish(['#fffdf5','#f4f0e6','#deded5','#bfc8c6'],'#373d4b','大片自然奶牛斑 · 奶白留白 · 水润糖衣',{shine:.62,shade:.16}),
  knit: finish(['#d8abb8','#bf8c9f','#a7748c','#845c74'],'#fff2dd','立体绞花 · 成对针脚 · 柔软莓粉',{shine:.06,shade:.23}),
  koi: finish(['#fffcf1','#f4ead9','#dfd6c3','#bcbcad'],'#344550','朱砂晕斑 · 隐约鱼鳞 · 温润白釉',{shine:.6,shade:.17}),
  tiger: finish(['#ffe0a4','#f4bd68','#e49c46','#ba7030'],'#4f392c','两侧渐尖虎纹 · 奶油下颌 · 金橘毛色',{shine:.18,shade:.23}),
  camo: finish(['#b0b594','#8e9e75','#71835e','#4c6247'],'#fff2ca','不规则大色块 · 苔绿沙色 · 柔哑表面',{shine:.06,shade:.22}),
  kiwi: finish(['#dcf09d','#b3d369','#8cb544','#638a32'],'#314a2b','整颗果肉切面 · 自然籽环 · 浅色果心',{shine:.38,shade:.19,edgeColor:'#809549'}),
  lemon: finish(['#fff1a0','#f4d459','#e5b52c','#c18c24'],'#665023','单颗柠檬切面 · 细纹果瓣 · 奶白果皮',{shine:.45,shade:.16,edgeColor:'#f7eabd'}),
  peach: finish(['#fff2ca','#f8d3b6','#f2aab2','#d37c98'],'#764d63','蜜桃柔红 · 细绒高光 · 浅浅果缝',{shine:.16,shade:.13}),
  dragonfruit: finish(['#fffefa','#f6f4ec','#e6e4df','#c4cccb'],'#4b3b57','雪白果肉 · 稀疏黑籽 · 双层粉色果皮',{shine:.42,shade:.15,edgeColor:'#d4588c'}),
  matcha: finish(['#d5dfa8','#adc17e','#849d55','#5c773b'],'#3a4c30','奶油旋涡 · 茶绿浓淡 · 湿润流纹',{shine:.43,shade:.18}),
  latte: finish(['#f5d9ab','#d9b27f','#bc8f5e','#896142'],'#55382d','奶泡心形 · 下缘叶形拉花 · 温暖咖啡色',{shine:.28,shade:.18}),
  fern: finish(['#faf6e8','#e8e9d3','#ced7bc','#a8bca0'],'#355348','舒展大蕨叶 · 细小叶脉 · 自然留白',{shine:.1,shade:.17}),
  birch: finish(['#fffdf0','#edeadc','#d8d8c8','#b2bcad'],'#39494a','横向皮孔 · 局部剥落 · 纸白树皮',{shine:.06,shade:.18}),
  malachite: finish(['#81b59c','#43836c','#256350','#154334'],'#f1e9c5','不规则矿脉 · 浓淡绿带 · 局部抛光',{shine:.52,shade:.28}),
  agate: finish(['#e4d1e7','#b99bc5','#9276a7','#644f7f'],'#42364f','偏心晶洞 · 半透明层带 · 细碎晶体',{shine:.56,shade:.23}),
  sandstone: finish(['#efd3ac','#d9b186','#c09168','#9b7253'],'#634c3e','宽缓沉积带 · 细密砂粒 · 暖灰砂岩',{shine:.08,shade:.22}),
  cloud: finish(['#d2ecf7','#9cc9e2','#75a8d0','#507da9'],'#2c4d78','柔软云团 · 大片蓝天 · 透光云边',{shine:.24,shade:.18}),
  houndstooth: finish(['#f8f2df','#e9dfca','#d0c4b0','#acaa9e'],'#66485a','细比例千鸟格 · 经编细纹 · 暖白羊毛',{shine:.05,shade:.2}),
  paisley: finish(['#4d647c','#344e67','#263c55','#1a2c43'],'#fff0ce','错落腰果纹 · 细金勾边 · 靛蓝织底',{shine:.12,shade:.27}),
  bauhaus: finish(['#faf1df','#ece1cc','#d6c9ae','#b3ad9c'],'#30454f','大块几何构成 · 三原色点缀 · 清晰留白',{shine:.12,shade:.2}),
  opart: finish(['#f9f5e9','#e7e4d8','#cccec4','#acb6b0'],'#954b58','宽缓黑白曲带 · 视觉起伏 · 柔和面部留白',{shine:.08,shade:.18}),
  chevron: finish(['#f7ead5','#e9d9bd','#d2c1a3','#b7a689'],'#4e5355','宽幅人字色带 · 复古低饱和 · 织物细纹',{shine:.1,shade:.2}),
  kintsugi: finish(['#45645b','#2b4d42','#1b382f','#102820'],'#f5eacb','墨绿深釉 · 手工金缮裂线 · 金粉细边',{shine:.67,shade:.27}),
};

export function revisionTexture(defs,id,kind,el,gradient) {
  if (!kind.startsWith('revised-')) return null;
  const name=kind.slice(8);
  if (!(name in revisions)) return null;
  const p=el('pattern',{id,width:240,height:240,patternUnits:'userSpaceOnUse'},defs);
  const path=(d,fill='none',stroke='none',width=1,opacity=1,parent=p)=>el('path',{d,fill,stroke,'stroke-width':width,opacity,'stroke-linecap':'round','stroke-linejoin':'round'},parent);
  const circle=(cx,cy,r,fill,opacity=1,parent=p)=>el('circle',{cx,cy,r,fill,opacity},parent);
  const ellipse=(cx,cy,rx,ry,fill,opacity=1,parent=p)=>el('ellipse',{cx,cy,rx,ry,fill,opacity},parent);
  const rect=(x,y,width,height,fill,opacity=1,rx=0,parent=p)=>el('rect',{x,y,width,height,fill,opacity,rx},parent);
  const noise=(n,colors,opacity=.18)=>{
    for(let i=0;i<n;i++) circle((i*73.731+13)%240,(i*i*29.379+19)%240,.25+i%3*.18,colors[i%colors.length],opacity);
  };
  const wash=(key,color,opacity,cx,cy,rx,ry)=>{
    gradient(defs,'radialGradient',`${id}-${key}`,{},[[0,color,opacity],[.5,color,opacity*.6],[1,color,0]]);
    ellipse(cx,cy,rx,ry,`url(#${id}-${key})`);
  };
  if(name==='metal') {
    for(let i=0;i<200;i++) {
      const y=i*1.2;
      path(`M0 ${y}H240`,'none',i%3?'#f3faff':'#344c60',.35,i%3?.22:.1);
    }
    path('M34-10L114 250H135L55-10Z','#fff', 'none',0,.14);
    path('M156-10L223 250H240L180-10Z','#203a51','none',0,.08);
  } else if(name==='pixel') {
    for(let y=25;y<225;y+=4) path(`M20 ${y}H220`,'none','#a6cbfa',.5,.045);
    const sprite=(x,y,rows,color,unit=4)=>rows.forEach((row,j)=>[...row].forEach((v,i)=>{if(v==='1')rect(x+i*unit,y+j*unit,unit,unit,color,.9);}));
    sprite(41,39,['00100','01110','11111','01110','00100'],'#f6d58b');
    sprite(174,45,['0110110','1111111','1111111','0111110','0011100','0001000'],'#a397df',3);
    sprite(91,182,['01100110','11111111','11111111','01111110','00111100','00011000'],'#8be5c4',3);
    path('M31 88V64H38M209 149V175H201','none','#7495b4',2,.45);
    for(let i=0;i<5;i++)rect(52+i*7,202,4,3,'#89bcbe',.5);
    rect(172,194,18,4,'#c7ddc1',.5);
  } else if(name==='lava') {
    noise(260,['#888077','#030911'],.22);
    const cracks=['M14 43L48 55 62 77 54 98 37 116 41 153 20 181','M48 55L78 40 91 12','M54 98L15 85','M170 13L173 47 196 65 185 92 204 110 220 112','M196 65L231 49','M41 153L78 175 94 202 124 211 155 198 181 175 219 168','M155 198L164 230'];
    for(const d of cracks) {
      path(d,'none','#dc4921',9,.08);path(d,'none','#ee5f29',4,.65);
      path(d,'none','#ffad50',1.7,.95);path(d,'none','#fff0a0',.5,.9);
    }
    wash('heat','#e37639',.14,40,90,65,90);
  } else if(name==='cow') {
    for(const d of ['M-10 2H88C99 15 73 28 70 44S37 43 31 65 5 97-10 71Z','M176-5C161 17 176 35 195 39S204 76 237 86V-5Z','M-8 162C12 148 33 170 42 177S65 169 77 187 47 219 62 247H-8Z','M176 208C177 190 204 174 222 181S251 202 237 240H193Z'])path(d,'#30343c');
    ellipse(160,44,8,5,'#30343c');
  } else if(name==='knit') {
    for(let x=24;x<224;x+=12)for(let y=22;y<225;y+=13){
      path(`M${x-4} ${y}Q${x-5} ${y+6} ${x} ${y+11}Q${x+5} ${y+6} ${x+4} ${y}`,'none','#75465e',3,.3);
      path(`M${x-3} ${y+1}L${x} ${y+9} ${x+3} ${y+1}`,'none','#efc4cd',1.6,.55);
    }
    for(const x of [43,197]) for(let y=16;y<240;y+=28){
      path(`M${x-6} ${y}C${x-6} ${y+10} ${x+7} ${y+16} ${x+7} ${y+28}M${x+6} ${y}C${x+6} ${y+10} ${x-7} ${y+16} ${x-7} ${y+28}`,'none','#86546b',7,.65);
      path(`M${x-5} ${y}C${x-5} ${y+10} ${x+6} ${y+16} ${x+6} ${y+28}M${x+5} ${y}C${x+5} ${y+10} ${x-6} ${y+16} ${x-6} ${y+28}`,'none','#e7b9c5',4,.8);
    }
  } else if(name==='koi') {
    for(const d of ['M0 0H139C140 23 123 26 114 42S78 38 69 62 28 67 9 51Z','M190 141C210 129 234 142 240 165V240H144C146 213 169 218 171 190S171 157 190 141Z','M-5 163C12 151 36 168 42 187S18 209-5 202Z'])path(d,'#c84a36','none',0,.9);
    for(const d of ['M31 75q17-16 22-1t-20 13Z','M196 32q12-6 17 7t-16 12Z','M104 205q11-10 18-1t-14 13Z'])path(d,'#343a3c','none',0,.8);
    for(let y=15;y<240;y+=17)for(let x=8;x<240;x+=24)path(`M${x+(y%2)*12} ${y}q12 16 24 0`,'none','#bc9a6e',.55,.13);
  } else if(name==='tiger') {
    wash('muzzle','#fff4db',.9,120,204,88,59);
    for(const side of [1,-1]) {
      const g=el('g',{transform:side===1?'':'translate(240 0) scale(-1 1)'},p);
      for(const d of ['M8 46Q49 37 90 60Q56 51 46 65Q27 60 8 66Z','M4 94Q40 77 63 91Q39 94 31 111L4 118Z','M7 146Q40 133 56 150Q34 148 26 170L7 176Z','M25 201Q45 177 73 182Q58 192 48 218Z'])path(d,'#58402c','none',0,.93,g);
    }
    path('M108 15L116 55 120 66 125 48 131 15Z','#58402c');
  } else if(name==='camo') {
    for(const [d,c] of [
      ['M-5-5H126C113 11 87 16 81 37S43 46 44 67 2 82-5 63Z','#c1b690'],
      ['M138-5H245V96C218 90 227 60 200 65S158 43 172 27 155 17 138-5Z','#506b4c'],
      ['M-5 119C24 103 38 124 43 145S81 147 72 177 109 212 92 245H-5Z','#466149'],
      ['M137 183C138 157 163 166 180 157S195 124 225 133L245 128V245H156C176 225 133 212 137 183Z','#c0b38e'],
      ['M180 235Q198 203 220 206T245 189V245Z','#384e3b'],
    ])path(d,c,'none',0,.9);
    noise(170,['#e6dcc3','#2a4533'],.1);
  } else if(name==='kiwi') {
    for(let i=0;i<80;i++) {
      const a=i*Math.PI/40,r=68+(i%5)*3;
      path(`M${120+Math.cos(a)*32} ${119+Math.sin(a)*35}Q${120+Math.cos(a+.04)*64} ${119+Math.sin(a+.04)*68} ${120+Math.cos(a)*107} ${119+Math.sin(a)*108}`,'none',i%2?'#ebf2bf':'#538637',.7,.28);
      if(i%2===0)el('ellipse',{cx:120+Math.cos(a)*r,cy:119+Math.sin(a)*(r+3),rx:1.6,ry:3,fill:'#3e4e28',transform:`rotate(${i*4.5-90} ${120+Math.cos(a)*r} ${119+Math.sin(a)*(r+3)})`},p);
    }
    path('M115 75C134 65 142 91 139 114S143 155 124 165 101 151 103 131 93 92 115 75Z','#f0ecc7','none',0,.86);
    noise(100,['#eff6c1'],.2);
  } else if(name==='lemon') {
    circle(120,120,101,'#fff5cc',.95);circle(120,120,94,'#edc544',.9);
    for(let i=0;i<10;i++) {
      const a=i*Math.PI/5+.06,b=a+.52,pt=(r,t)=>`${120+Math.cos(t)*r} ${120+Math.sin(t)*r}`;
      path(`M${pt(10,a)}L${pt(88,a)}Q${pt(98,(a+b)/2)} ${pt(88,b)}L${pt(10,b)}Z`,i%2?'#f7d966':'#fbe080','#fff5c9',1.5,.95);
      for(let j=0;j<4;j++){const t=a+.08+j*.1;path(`M${pt(25,t)}L${pt(80-j%2*7,t)}`,'none','#fff7d4',.65,.44);}
    }
    circle(120,120,9,'#fff7d3');
  } else if(name==='peach') {
    wash('blush-left','#e37791',.42,39,132,81,108);wash('blush-right','#ea7891',.48,203,139,70,110);
    wash('gold','#fff2ba',.55,103,44,86,70);
    path('M125 19C113 47 123 72 123 83M128 168Q137 201 124 224','none','#bd718b',1.5,.2);
    path('M128 20Q118 47 126 73M132 174Q141 201 127 219','none','#fff5d7',1,.5);
    noise(500,['#fff8e8','#f2a8b2'],.24);
  } else if(name==='dragonfruit') {
    el('use',{href:'#headShape',fill:'none',stroke:'#f2a0c0','stroke-width':11,opacity:.8},p);
    for(let i=0;i<105;i++) {
      const x=25+(i*71.71)%190,y=25+(i*i*37.17)%190;
      if(y>92&&y<159&&x>51&&x<184)continue;
      el('ellipse',{cx:x,cy:y,rx:.9,ry:1.7,fill:'#424044',opacity:.8,transform:`rotate(${i*59} ${x} ${y})`},p);
    }
    noise(140,['#fff','#bac2bc'],.13);
  } else if(name==='matcha') {
    for(const [d,w,o] of [
      ['M-20 40C55-15 214 1 223 80S92 211 30 168 82 38 147 65 190 135 153 157',15,.76],
      ['M-5 212C56 243 179 237 229 174S236 44 189 18',7,.66],
      ['M-5 91C20 48 66 31 110 37',3,.65],
    ])path(d,'none','#f0e8c6',w,o);
    path('M30 165C-3 125 48 61 86 52','none','#557c3d',5,.3);
    noise(180,['#4e7034','#f4edcc'],.17);
  } else if(name==='latte') {
    wash('foam','#fff0d5',.78,115,115,120,130);
    path('M120 75C90 56 100 39 114 47L120 54 126 47C141 38 151 56 120 75Z','#fff6df','none',0,.96);
    for(let i=0;i<6;i++) {
      const y=163+i*7,w=34-i*4;
      path(`M120 ${y+6}Q${120-w-16} ${y-9} ${120-w} ${y+2}Q120 ${y+21} ${120+w} ${y+2}Q${120+w+16} ${y-9} 120 ${y+6}Z`,'#fff3d9','none',0,.92);
    }
    path('M120 159Q116 184 122 213','none','#fff6df',2,.9);
    for(let i=0;i<24;i++){const a=i*.27;circle(120+Math.cos(a)*92,120+Math.sin(a)*92,.6+i%3*.4,'#fff0d1',.5);}
  } else if(name==='fern') {
    for(const [x,y,a,scale] of [[32,228,24,1],[218,15,198,.85]]) {
      const g=el('g',{transform:`translate(${x} ${y}) rotate(${a}) scale(${scale})`},p);
      path('M0 0Q-10-65 4-145','none','#4e7156',1.2,.8,g);
      for(let i=0;i<12;i++)for(const side of [-1,1]) {
        const y=-12-i*10,w=20*Math.sin((i+1)/13*Math.PI)+2;
        path(`M-2 ${y}Q${side*w} ${y-2} ${side*(w+4)} ${y-15}Q${side*w*.5} ${y-15}-2 ${y}Z`,side<0?'#6d9271':'#8ca881','none',0,.8,g);
        path(`M-2 ${y}l${side*(w+1)}-12`,'none','#ced8af',.4,.5,g);
      }
    }
  } else if(name==='birch') {
    path('M18 20Q32 65 24 106T31 221','none','#a2a89a',7,.16);
    path('M205 12Q199 64 212 102T209 227','none','#848e82',5,.16);
    for(let i=0;i<52;i++) {
      const x=17+(i*67.71)%206,y=22+(i*i*29.13)%198,w=3+i%5*2;
      if(x>54&&x<182&&y>92&&y<157)continue;
      path(`M${x} ${y}q${w*.5}-2 ${w}-.5l-1 ${1+i%2}q${-w*.6} 1 ${-w+1}-.5Z`,'#5b665f','none',0,.6);
      path(`M${x} ${y+2}h${w}`,'none','#fffdf1',.8,.7);
    }
    noise(120,['#fff','#7d8876'],.12);
  } else if(name==='malachite' || name==='agate') {
    const isGreen=name==='malachite', colors=isGreen?['#81ae8f','#255f49','#b4c8a0','#3d7d5b','#19503e']:['#dfcadb','#aa87b6','#efe1df','#8e6d9f','#c8aacb'];
    for(const [cx,cy,scale] of (isGreen?[[15,42,1],[208,220,.8]]:[[182,53,1]])) {
      for(let i=25;i>0;i--) {
        const r=i*7*scale,points=[];
        for(let j=0;j<96;j++) {
          const a=j*Math.PI/48;
          const rr=r*(1+.055*Math.sin(a*3+.6)+.045*Math.sin(a*5)+.013*Math.sin(a*13+i*.15));
          points.push(`${cx+Math.cos(a)*rr},${cy+Math.sin(a)*rr*.82}`);
        }
        path(`M${points.join('L')}Z`,colors[i%5],'none',0,isGreen?.72:.7);
      }
      if(!isGreen) {
        ellipse(cx,cy,21,16,'#6c567f',.65);
        for(let i=0;i<30;i++) {const a=i*2.4,r=3+i%5*3;path(`M${cx+Math.cos(a)*r} ${cy+Math.sin(a)*r}l3-3 2 5-4 1Z`,i%2?'#f9edfa':'#b69cc5','none',0,.8);}
      }
    }
    wash('quiet-face',isGreen?'#37745b':'#bf9fcd',.48,120,128,83,65);
  } else if(name==='sandstone') {
    const colors=['#c19a76','#e7c5a0','#a78062','#eed7b5','#d0ad87'];
    for(let i=-2;i<13;i++) {
      const y=i*23;
      path(`M-10 ${y}C60 ${y-32} 120 ${y+37} 250 ${y-2}`,'none',colors[((i%5)+5)%5],10+i%3,.38);
      path(`M-10 ${y+7}C60 ${y-25} 120 ${y+44} 250 ${y+5}`,'none','#f9e6c9',.8,.5);
    }
    noise(650,['#684d38','#fff1d9'],.22);
  } else if(name==='cloud') {
    gradient(defs,'radialGradient',`${id}-cloud`,{cx:'.4',cy:'.22',r:'.82'},[[0,'#fff',.98],[.55,'#f3faff',.93],[1,'#c6deec',0]]);
    for(const [x,y,r] of [[30,65,25],[53,49,27],[78,61,22],[18,79,19],[183,188,29],[210,172,33],[238,187,27],[161,204,25],[204,211,32]])circle(x,y,r,`url(#${id}-cloud)`);
    wash('mist','#effbff',.38,36,195,60,32);
  } else if(name==='houndstooth') {
    const tile=el('pattern',{id:`${id}-weave`,width:20,height:20,patternUnits:'userSpaceOnUse'},defs);
    path('M0 5H5V0H10V5H15V10H20V15H15V20H10V15H5V10H0ZM0 0H5L0 5ZM15 0H20V5ZM0 15V20H5ZM15 20H20V15Z','#515756','none',0,.8,tile);
    rect(0,0,240,240,`url(#${id}-weave)`);
    wash('face','#eee2cb',.55,120,128,83,57);
    for(let i=0;i<240;i+=3)path(`M0 ${i}H240`,'none','#fff7e6',.5,.14);
  } else if(name==='paisley') {
    for(const [x,y,a,s] of [[61,60,-25,.7],[176,60,25,.65],[58,190,-50,.7],[178,190,145,.7]]) {
      const g=el('g',{transform:`translate(${x} ${y}) rotate(${a}) scale(${s})`},p);
      path('M0 32C-29 21-23-16-3-21Q16-26 10-46C41-20 42 6 23 25Q11 36 0 32Z','#9f7564','#d7ba85',1.2,.9,g);
      path('M1 23C-17 14-14-11 0-13Q17-15 16-30Q35-3 18 17Q9 27 1 23Z','none','#f0d5a3',.8,.9,g);
      for(let i=0;i<12;i++){const a=i*Math.PI/6;circle(3+Math.cos(a)*11,3+Math.sin(a)*16,1,'#f5dba6',.9,g);}
      for(let i=0;i<6;i++)el('ellipse',{cx:3,cy:-3,rx:2,ry:5,fill:'#d3b58c',transform:`rotate(${i*60} 3 3)`},g);
    }
    noise(80,['#c1a990'],.14);
  } else if(name==='bauhaus') {
    rect(18,17,76,51,'#b95646',.9);circle(188,51,30,'#d9b24d',.95);
    path('M20 177A62 62 0 0 1 82 239H20Z','#3f6981','none',0,.94);
    rect(143,181,80,43,'#bd5c49',.92);circle(145,181,23,'#dfbd64',.98);
    for(let x=107;x<148;x+=8)path(`M${x} 24v40`,'none','#3a4a50',2,.7);
    for(let y=181;y<218;y+=8)path(`M94 ${y}h25`,'none','#3a4a50',2,.7);
  } else if(name==='opart') {
    for(let i=-5;i<20;i++) {
      const x=i*18;
      path(`M${x} -10C${x+16} 42 ${x-32} 59 ${x-14} 115S${x+49} 180 ${x+28} 250`,'none','#354449',8,.88);
    }
    wash('face','#eee9dd',.72,120,128,85,66);
  } else if(name==='chevron') {
    const colors=['#9b6865','#f0dfbe','#6f938c','#d3af6f','#f0dfbe','#7b8798'];
    for(let i=-1;i<12;i++) {
      const y=i*27;
      path(`M-30 ${y}L45 ${y+29} 120 ${y} 195 ${y+29} 270 ${y}`,'none',colors[((i%6)+6)%6],17,.8);
    }
    for(let i=0;i<240;i+=3)path(`M0 ${i}H240`,'none','#fff4da',.5,.14);
  } else if(name==='kintsugi') {
    const cracks=['M21 28L49 48 61 53 65 73 57 87 44 96 47 117 28 142','M61 53L93 45 105 29 116 20','M219 69L193 83 190 102 199 113 185 133 193 156 210 172','M28 142L55 164 66 170 75 193 99 204 128 196 143 204 166 189 193 156','M143 204L148 221'];
    for(const d of cracks){path(d,'none','#132e26',4,.7);path(d,'none','#b69a55',2.4,.95);path(d,'none','#f5dc96',.9,.85);}
    for(let i=0;i<70;i++) {
      const x=58+(i*31.37)%112,y=191+Math.sin(i*2.7)*9;
      circle(x,y,.25+i%3*.16,'#e1c479',.42);
    }
    noise(180,['#88a58b','#152f26'],.08);
  }
  return p;
}
