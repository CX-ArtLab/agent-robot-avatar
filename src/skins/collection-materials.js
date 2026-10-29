import { skin } from './more-materials.js';

// Palettes share lighting settings; each entry below has its own SVG artwork.
const palettes = {
  berry: [['#ffbcc7','#ef899e','#d86383','#b34364'],'#613449','#ffe5df',['#fff0ee','#efd5db']],
  green: [['#d4e6a0','#a9c568','#7f9d47','#597538'],'#354b30','#edf6bf',['#f2f3df','#d9e3bf']],
  citrus: [['#fff2a4','#efcf61','#d9a438','#b97b25'],'#665024','#fff9cb',['#fff8e0','#eee1b5']],
  orange: [['#ffd5a0','#f5b267','#de8941','#b5672d'],'#68402e','#ffedc2',['#fff0df','#efdabd']],
  pink: [['#ffe7db','#f3bfb9','#df969f','#bd738c'],'#754e62','#fff5e6',['#fcf0eb','#eddae1']],
  milk: [['#fffaf0','#eee5d3','#d5c5aa','#b5a58b'],'#615246','#fff9e6',['#f8f3e8','#e7ddcb']],
  cocoa: [['#b38a69','#8a6046','#6a4334','#493027'],'#fff0cb','#d5b58e',['#f1e6d8','#dcc7b2']],
  forest: [['#72967a','#4b765c','#30573e','#203f30'],'#f3efc9','#bcd4a1',['#eaf0e0','#c7d8bf']],
  teal: [['#9bd4c8','#64b2a3','#3c8e86','#286b6b'],'#214e57','#d4f7e5',['#edf7ee','#cde4dc']],
  blue: [['#aacde5','#78a6ce','#507fae','#355c89'],'#233e65','#e9f7ff',['#eff5fa','#d6e2ed']],
  navy: [['#546b8b','#394f71','#273b5b','#1a2a43'],'#fff1cf','#bccfe1',['#e9eef4','#cbd6e3']],
  lilac: [['#e4d6ef','#bcabd5','#9a88bc','#776397'],'#4e4168','#fff0fe',['#f6f0fa','#e0d6e9']],
  stone: [['#dbd9d0','#b9bbb4','#919a97','#6b7b7c'],'#334b52','#f4f0de',['#edf0e9','#d4dcd4']],
};
const entries = [
  ['strawberry','草莓奶冻','STRAWBERRY','细小黄籽 · 莓红果肉 · 奶冻光泽','berry',{shine:.6}],
  ['kiwi','奇异果切片','KIWI','浅色果心 · 放射果纹 · 黑色小籽','green',{shine:.45}],
  ['lemon','柠檬切片','LEMON','半透明果瓣 · 奶白果皮 · 清爽柠黄','citrus',{shine:.6}],
  ['orangepeel','橘皮软糖','ORANGE PEEL','细密凹点 · 橙色果皮 · 温暖亮边','orange',{shine:.4}],
  ['peach','蜜桃绒绒','PEACH','轻柔绒毛 · 甜桃粉色 · 细弯果缝','pink',{matte:true,shine:.08}],
  ['dragonfruit','火龙果点点','DRAGON FRUIT','乳白果肉 · 黑色籽粒 · 玫红边缘','milk',{edgeColor:'#d45b8e',shine:.45}],
  ['chocolate','巧克力方砖','CHOCOLATE','压模方块 · 浅色棱边 · 可可光泽','cocoa',{shine:.5}],
  ['waffle','蜂格华夫','WAFFLE','方形凹槽 · 烘烤金黄 · 厚实边框','orange',{matte:true,shine:.18}],
  ['cookie','曲奇碎碎','COOKIE','巧克力碎 · 烘焙气孔 · 黄油底色','citrus',{matte:true,shine:.12}],
  ['donut','糖针甜甜圈','SPRINKLES','彩色糖针 · 草莓糖霜 · 甜点装饰','berry',{shine:.68}],
  ['matcha','抹茶漩涡','MATCHA','奶油流线 · 抹茶绿底 · 茶粉细点','green',{shine:.32}],
  ['latte','拿铁拉花','LATTE','奶白心叶 · 咖啡底色 · 层叠拉花','cocoa',{shine:.42,eye:'#83c8cc'}],
  ['moss','森林苔藓','MOSS','深浅绒团 · 柔软颗粒 · 森林绿意','forest',{matte:true,shine:.06}],
  ['fern','蕨叶标本','FERN','舒展叶轴 · 成对叶片 · 植物印花','milk',{matte:true,shine:.12}],
  ['cactus','仙人掌球','CACTUS','纵向棱线 · 奶白短刺 · 肉质绿皮','green',{shine:.22}],
  ['birch','白桦树皮','BIRCH','灰白树皮 · 横向暗纹 · 小小树节','milk',{matte:true,shine:.08}],
  ['malachite','孔雀石环','MALACHITE','深绿同心纹 · 弯曲色带 · 抛光矿石','forest',{shine:.65}],
  ['agate','紫晶玛瑙','AGATE','紫色层纹 · 锯齿晶带 · 浅色石心','lilac',{shine:.6}],
  ['sandstone','沙丘岩层','SANDSTONE','起伏沉积纹 · 暖沙颗粒 · 风化石面','orange',{matte:true,shine:.09}],
  ['ocean','泳池水光','CAUSTICS','交错亮纹 · 碧蓝水面 · 浅池折光','teal',{shine:.7}],
  ['cloud','云朵棉花','CLOUDS','圆圆云团 · 浅蓝天空 · 柔软阴影','blue',{shine:.24}],
  ['raindrop','雨窗水滴','RAINDROPS','椭圆水珠 · 细白高光 · 蓝灰雨窗','stone',{shine:.7}],
  ['snowflake','雪花毛毯','SNOWFLAKE','六角冰花 · 蓝白配色 · 冬日织纹','navy',{matte:true,shine:.15}],
  ['ember','余烬火花','EMBERS','橙金光点 · 深褐余烬 · 细长火星','cocoa',{shade:.5,shine:.15}],
  ['tartan','苏格兰格纹','TARTAN','深红织底 · 金绿交线 · 经典格纹','berry',{matte:true,shine:.08,eye:'#fff0cb'}],
  ['argyle','菱格背心','ARGYLE','深浅菱形 · 细线交叉 · 学院针织','lilac',{matte:true,shine:.1}],
  ['houndstooth','千鸟格纹','HOUNDSTOOTH','黑白断格 · 错落尖角 · 经典织物','milk',{matte:true,shine:.1}],
  ['paisley','佩斯利腰果','PAISLEY','弯曲水滴 · 小花点饰 · 复古印花','navy',{matte:true,shine:.13}],
  ['sashiko','靛蓝刺子绣','SASHIKO','白色虚线 · 交叠圆弧 · 手工针脚','navy',{matte:true,shine:.1}],
  ['quilt','拼布小被','PATCHWORK','多色布块 · 交错针脚 · 手作拼贴','pink',{matte:true,shine:.1}],
  ['corduroy','灯芯绒衣','CORDUROY','平行绒脊 · 深色细槽 · 柔和棕金','orange',{matte:true,shine:.08}],
  ['linen','亚麻布袋','LINEN','经纬纤维 · 自然麻点 · 米灰织物','milk',{matte:true,shine:.05}],
  ['artdeco','金线扇影','ART DECO','放射金线 · 墨蓝底色 · 复古扇形','navy',{shine:.4}],
  ['bauhaus','几何积木','BAUHAUS','红黄蓝块 · 圆弧半圆 · 几何拼搭','milk',{matte:true,shine:.16}],
  ['memphis','孟菲斯派对','MEMPHIS','波浪涂鸦 · 彩色圆点 · 自由小图形','lilac',{matte:true,shine:.18}],
  ['opart','视错觉涡流','OP ART','黑白曲带 · 弯曲棋纹 · 平面幻觉','milk',{matte:true,shine:.08}],
  ['chevron','彩色人字纹','CHEVRON','连续折线 · 复古彩条 · 起伏节奏','milk',{matte:true,shine:.14}],
  ['hexbolt','六角装甲','HEX ARMOR','六角金属片 · 深色接缝 · 块面反射','stone',{shine:.55}],
  ['rivet','铆钉机甲','RIVET','深色钢板 · 亮面铆钉 · 分层拼接','navy',{shine:.6}],
  ['disco','迪斯科镜球','DISCO','银彩镜片 · 棋格反射 · 闪亮小星','lilac',{shine:.8}],
  ['ceramicblue','青花小瓷','BLUE FLORAL','蓝色花枝 · 温润白釉 · 细笔陶彩','milk',{shine:.7}],
  ['kintsugi','金缮墨瓷','KINTSUGI','不规则裂纹 · 金色修补 · 墨绿瓷釉','forest',{shine:.6}],
];
export const collectionSkins = Object.fromEntries(entries.map(([key,label,en,description,palette,options]) =>
  [key, skin(label,en,description,...palettes[palette],{...options,pattern:key})]));

export function collectionTexture(defs,id,kind,el,gradient) {
  if (!(kind in collectionSkins)) return null;
  const sizes = {kiwi:240,lemon:120,peach:240,chocolate:48,waffle:32,latte:240,malachite:160,agate:160,sandstone:160,ocean:120,cloud:120,tartan:80,houndstooth:32,sashiko:48,corduroy:12,linen:24,hexbolt:48,disco:80,kintsugi:160,opart:160};
  const s=sizes[kind] || 80;
  const p=el('pattern',{id,width:s,height:kind==='hexbolt'?42:s,patternUnits:'userSpaceOnUse'},defs);
  const path=(d,fill='none',stroke='none',width=1,opacity=1,parent=p)=>el('path',{d,fill,stroke,'stroke-width':width,opacity,'stroke-linecap':'round','stroke-linejoin':'round'},parent);
  const circle=(x,y,r,fill,opacity=1,parent=p)=>el('circle',{cx:x,cy:y,r,fill,opacity},parent);
  const rect=(x,y,w,h,fill,opacity=1,rx=0)=>el('rect',{x,y,width:w,height:h,fill,opacity,rx},p);
  const ellipse=(x,y,rx,ry,fill,angle=0,opacity=1,parent=p)=>el('ellipse',{cx:x,cy:y,rx,ry,fill,opacity,transform:`rotate(${angle} ${x} ${y})`},parent);
  const specks=(count,colors,radius=.6)=>{
    for(let i=0;i<count;i++) circle((i*31.71+7)%s,(i*i*13.37+11)%s,radius+(i%3)*.3,colors[i%colors.length],.3);
  };
  if(kind==='strawberry') {
    for(const [x,y] of [[16,18],[55,58],[58,13],[13,57]]) {
      ellipse(x,y,2.1,4,'#9d4d57',-18,.55);ellipse(x-1,y-1,1.3,2.5,'#ffe7a3',-18,.95);
    }
  } else if(kind==='kiwi') {
    ellipse(120,120,26,43,'#f4efc3',0,.9);
    for(let i=0;i<40;i++) {
      const a=i*Math.PI/20, x=120+Math.cos(a)*58,y=120+Math.sin(a)*69;
      path(`M${120+Math.cos(a)*28} ${120+Math.sin(a)*42}L${120+Math.cos(a)*135} ${120+Math.sin(a)*135}`,'none','#e6edb1',1,.4);
      ellipse(x,y,1.6,3.5,'#384c29',i*9,.88);
    }
  } else if(kind==='lemon') {
    circle(60,60,57,'#fff6d4',.85);circle(60,60,51,'#e9bd44',.8);
    for(let i=0;i<9;i++) {
      const a=i*Math.PI*2/9,b=a+.58;
      path(`M60 60L${60+Math.cos(a)*48} ${60+Math.sin(a)*48}A48 48 0 0 1 ${60+Math.cos(b)*48} ${60+Math.sin(b)*48}Z`,'#ffeaa0','#fff7d2',1.5,.9);
    }
    circle(60,60,6,'#fff9e0');
  } else if(kind==='orangepeel') {
    for(let i=0;i<85;i++) {
      const x=(i*21.3)%s,y=(i*i*17.7)%s;
      circle(x,y,1.4,'#b97129',.3);path(`M${x-1} ${y+1}h1.5`,'none','#fff0b9',.7,.5);
    }
  } else if(kind==='peach') {
    specks(230,['#fff5e6','#e7b2bd'],.35);
    path('M145-10Q115 62 135 132T135 250','none','#c8798e',2,.25);
    path('M149-10Q119 62 139 132T139 250','none','#fff2dc',2,.45);
  } else if(kind==='dragonfruit') {
    for(let i=0;i<36;i++) ellipse((i*29.3)%s,(i*i*15.7)%s,.8,1.8,'#354146',i*41,.8);
  } else if(kind==='chocolate') {
    rect(1,1,46,46,'#432a20',.5,5);rect(5,5,38,38,'#a57652',.5,4);
    path('M7 40V7H40','none','#d4a97d',1.5,.5);path('M41 8V41H8','none','#3d241c',2,.65);
    path('M13 16L24 11 35 16V31L24 36 13 31Z','none','#603b2d',1,.3);
  } else if(kind==='waffle') {
    rect(4,4,24,24,'#a4642e',.5,3);rect(7,7,18,18,'#cc8d42',.7,2);
    path('M4 28V4H28','none','#ffe2a1',3,.75);path('M28 4V28H4','none','#9f602d',2,.55);
  } else if(kind==='cookie') {
    specks(45,['#9f702e','#fff3bb']);
    for(let i=0;i<8;i++) {
      const x=(i*29+8)%s,y=(i*i*17+6)%s;
      path(`M${x} ${y}l6-2 4 5-3 5-7-2Z`,'#604030','none',0,.9);
      path(`M${x+1} ${y}l4-1`,'none','#ac7b56',1,.6);
    }
  } else if(kind==='donut') {
    const colors=['#fff3b2','#8dd4ce','#f6f0ec','#8e82c1','#b64b69'];
    for(let i=0;i<18;i++) {
      const x=(i*31.7)%s,y=(i*i*17.1)%s,a=i*2.3;
      path(`M${x} ${y}l${Math.cos(a)*5} ${Math.sin(a)*5}`,'none',colors[i%5],2.5,.95);
    }
  } else if(kind==='matcha') {
    for(let i=-1;i<6;i++) path(`M-10 ${i*20}C25 ${i*20-28} 40 ${i*20+30} 90 ${i*20-3}`,'none','#f1edcf',4,.65);
    specks(25,['#596c32'],.4);
  } else if(kind==='latte') {
    for(let i=0;i<9;i++) {
      const y=49+i*16,w=14+i*8;
      path(`M120 ${y+17}Q${120-w*1.7} ${y-14} ${120-w} ${y+10}Q120 ${y+36} ${120+w} ${y+10}Q${120+w*1.7} ${y-14} 120 ${y+17}Z`,'#fff0cf','none',0,.8);
    }
    path('M120 40Q113 150 124 228','none','#fff8e1',3,.85);
  } else if(kind==='moss') {
    for(let i=0;i<90;i++) {
      const x=(i*29.7)%s,y=(i*i*11.3)%s,r=1.5+i%4;
      circle(x,y,r,['#a9b676','#233c2d','#6f9a64'][i%3],.55);
      path(`M${x} ${y}l-1-3m1 3 2-2`,'none','#d1d29b',.6,.35);
    }
  } else if(kind==='fern') {
    for(const [x,y,a] of [[24,43,-25],[66,74,30]]) {
      const g=el('g',{transform:`translate(${x} ${y}) rotate(${a})`},p);
      path('M0 29Q-5 0 0-34','none','#547e60',1,1,g);
      for(let i=0;i<6;i++) for(const side of [-1,1]) path(`M0 ${22-i*9}q${side*(17-i*1.8)}-2 ${side*(12-i)}-12q${-side*5} 1 ${-side*(12-i)} 12Z`,'#6e9670','none',0,.75,g);
    }
  } else if(kind==='cactus') {
    for(const x of [9,36,63]) {
      path(`M${x} 0q-5 20 0 40t0 40`,'none','#547435',5,.3);
      path(`M${x+4} 0q-5 20 0 40t0 40`,'none','#edf2b6',1.5,.6);
      for(const y of [14,54]) path(`M${x-3} ${y-3}l6 6m-6 0 6-6m-3-1v8`,'none','#fff5cc',1,.85);
    }
  } else if(kind==='birch') {
    for(let i=0;i<12;i++) {
      const x=(i*23)%s,y=i*7;
      path(`M${x} ${y}q8 2 ${8+i%4*3} 0`,'none','#555c58',1+i%3*.7,.6);
    }
    ellipse(54,38,10,3,'#73776a',-8,.55);ellipse(54,37,6,1,'#c7c6b5',-8,.8);
  } else if(kind==='malachite' || kind==='agate') {
    const colors=kind==='malachite'?['#b4d0a0','#183f30','#568b65']:['#f5e6f4','#7c579b','#c49dd6'];
    for(let i=18;i>0;i--) {
      const r=i*5.7,points=[];
      for(let j=0;j<48;j++) {
        const a=j*Math.PI/24,rr=r*(1+(kind==='malachite' ? .08*Math.sin(a*3)+.04*Math.cos(a*5) : .08*Math.sin(j*2.7)+.05*Math.cos(j*1.2)));
        points.push(`${80+Math.cos(a)*rr},${80+Math.sin(a)*rr*.8}`);
      }
      path(`M${points.join('L')}Z`,colors[i%3],'none',0,.8);
    }
  } else if(kind==='sandstone') {
    for(let i=-2;i<20;i++) path(`M-10 ${i*11}Q35 ${i*11-22} 88 ${i*11}T170 ${i*11-5}`,'none',['#fff1ca','#ad733e','#dcab6d'][((i%3)+3)%3],2+i%2,.4);
    specks(100,['#86552f','#fff3d2'],.35);
  } else if(kind==='ocean') {
    for(const d of ['M0 18Q28-1 45 28T91 26 120 18','M0 89Q25 110 50 83T96 86 120 89','M20 0Q-5 30 25 55T20 120','M87 0Q111 28 82 60T87 120','M25 55Q56 38 82 60']) {
      path(d,'none','#d4ffff',6,.13);path(d,'none','#edffff',1.4,.65);
    }
  } else if(kind==='cloud') {
    for(const [x,y] of [[24,30],[88,86]]) {
      path(`M${x-22} ${y+9}a10 10 0 0 1 4-19a15 15 0 0 1 29-3a11 11 0 0 1 12 22Z`,'#edf7ff','none',0,.8);
      path(`M${x-18} ${y+9}h35`,'none','#b6cfdf',2,.55);
    }
  } else if(kind==='raindrop') {
    gradient(defs,'radialGradient',`${id}-drop`,{cx:'.65',cy:'.7'},[[0,'#f4ffff',.65],[.6,'#7d9ba6',.05],[1,'#213d51',.4]]);
    for(const [x,y,r] of [[18,20,8],[55,58,11],[65,12,4],[16,65,4]]) {
      ellipse(x,y,r*.75,r,`url(#${id}-drop)`,-15);
      path(`M${x-r*.4} ${y-r*.4}l1-2`,'none','#fff',1.4,.8);
    }
  } else if(kind==='snowflake') {
    for(const [x,y,r] of [[20,20,16],[60,60,10]]) for(let i=0;i<6;i++) {
      const g=el('g',{transform:`translate(${x} ${y}) rotate(${i*60})`},p);
      path(`M0 0V${-r}M0 ${-r*.5}l${-r*.25} ${-r*.25}M0 ${-r*.5}l${r*.25} ${-r*.25}`,'none','#e5f4f8',1,.8,g);
    }
    specks(12,['#fff'],.5);
  } else if(kind==='ember') {
    gradient(defs,'radialGradient',`${id}-glow`,{},[[0,'#ffd177',.9],[.25,'#f3863b',.55],[1,'#e95e25',0]]);
    for(let i=0;i<14;i++) {
      const x=(i*29+11)%s,y=(i*i*17+7)%s;
      circle(x,y,5+i%3,`url(#${id}-glow)`);path(`M${x} ${y}l2-5`,'none','#ffcd76',1,.9);
    }
  } else if(kind==='tartan') {
    rect(0,0,s,s,'#782f42',.65);
    for(const n of [13,53]) {rect(n,0,15,s,'#224f48',.65);rect(0,n,s,15,'#224f48',.65);}
    for(const n of [8,33,48,73]) path(`M${n} 0v80M0 ${n}h80`,'none','#ead39d',.8,.7);
  } else if(kind==='argyle') {
    path('M20 0L40 40 20 80 0 40Z','#6d5b8e','none',0,.7);path('M60 0L80 40 60 80 40 40Z','#ead6de','none',0,.75);
    path('M0 0L40 80 80 0M0 80L40 0 80 80','none','#fff2d9',1,.75);
  } else if(kind==='houndstooth') {
    path('M0 8H8V0H16V8H24V16H32V24H24V32H16V24H8V16H0Z','#343e43','none',0,.88);
    path('M0 0H8L0 8ZM24 0H32V8ZM0 24V32H8ZM24 32H32V24Z','#343e43','none',0,.88);
  } else if(kind==='paisley') {
    for(const [x,y,a] of [[20,17,-20],[60,58,160]]) {
      const g=el('g',{transform:`translate(${x} ${y}) rotate(${a})`},p);
      path('M0 25C-28 14-14-13 3-12Q25-15 13-30Q42-10 20 17Q10 30 0 25Z','#bf8c6d','#efcf9d',1,.9,g);
      path('M1 17C-15 10-9-5 3-5Q16-7 14-16Q28 0 13 13Z','none','#f9e5bd',1,.8,g);
      for(let i=0;i<7;i++) circle(Math.cos(i)*8,5+Math.sin(i)*8,1,'#f8e1b4',.9,g);
    }
  } else if(kind==='sashiko') {
    for(const [x,y] of [[0,0],[48,0],[24,24],[0,48],[48,48]]) el('circle',{cx:x,cy:y,r:24,fill:'none',stroke:'#f4ecdc','stroke-width':1,'stroke-dasharray':'3 2',opacity:.8},p);
  } else if(kind==='quilt') {
    for(const [x,y,c] of [[0,0,'#a6b5b5'],[40,0,'#e3c393'],[0,40,'#d18f94'],[40,40,'#9298b9']]) {
      rect(x,y,40,40,c,.8);
      el('rect',{x:x+3,y:y+3,width:34,height:34,fill:'none',stroke:'#fff4de','stroke-width':1,'stroke-dasharray':'2 2',opacity:.8},p);
      for(const n of [12,28]) circle(x+n,y+n,1.5,'#fff5dd',.7);
    }
  } else if(kind==='corduroy') {
    rect(0,0,3,12,'#73482e',.35);rect(4,0,3,12,'#ffe1aa',.4);
    for(let y=0;y<12;y+=2) path(`M4 ${y}h5`,'none','#fff0c6',.5,.28);
  } else if(kind==='linen') {
    for(let i=1;i<24;i+=3) {
      path(`M${i} 0v24`,'none',i%2?'#8b806a':'#fff8e6',.65,.38);
      path(`M0 ${i}h24`,'none',i%2?'#fff8e6':'#8b806a',.65,.35);
    }
    specks(8,['#716a59'],.4);
  } else if(kind==='artdeco') {
    for(const [x,y] of [[0,80],[80,80],[40,40]]) for(let i=0;i<=8;i++) {
      const a=Math.PI+i*Math.PI/8;
      path(`M${x} ${y}L${x+Math.cos(a)*40} ${y+Math.sin(a)*40}`,'none','#dfc185',.9,.8);
    }
    path('M0 80A40 40 0 0 1 80 80M0 40A40 40 0 0 1 80 40','none','#e5c589',1.5,.8);
  } else if(kind==='bauhaus') {
    rect(0,0,40,40,'#c75749',.9);circle(60,20,17,'#d4ad47',.95);
    path('M0 80V40A40 40 0 0 1 40 80Z','#3d6480','none',0,.9);
    for(let i=0;i<5;i++) path(`M${47+i*7} 46v28`,'none','#394a50',2,.8);
  } else if(kind==='memphis') {
    path('M4 18q6-10 12 0t12 0','none','#795c9b',3,.9);
    path('M48 10l16 4-10 13Z','#f2cd79');circle(19,59,7,'#88bcb3');
    path('M46 57l5-5 5 10 5-10 5 5','none','#b36284',2.5,.9);
    for(const [x,y] of [[38,35],[71,41],[6,35]]) circle(x,y,1.5,'#46526d');
  } else if(kind==='opart') {
    for(let i=-4;i<16;i++) path(`M${i*16} -10Q${i*16+44} 40 ${i*16} 80T${i*16} 170`,'none','#35434a',7,.88);
  } else if(kind==='chevron') {
    for(let i=-1;i<6;i++) path(`M-20 ${i*18}L0 ${i*18-12} 20 ${i*18} 40 ${i*18-12} 60 ${i*18} 80 ${i*18-12} 100 ${i*18}`,'none',['#a86c6b','#6b9992','#c9aa65'][((i%3)+3)%3],8,.8);
  } else if(kind==='hexbolt') {
    for(const [x,y] of [[0,0],[24,0],[48,0],[12,21],[36,21],[0,42],[24,42],[48,42]]) {
      path(`M${x} ${y-14}l12 7v14l-12 7-12-7v-14Z`,'#748786','#354e53',1.5,.7);
      path(`M${x-9} ${y-5}l9-5 9 5`,'none','#e3e9d9',1,.6);
    }
  } else if(kind==='rivet') {
    path('M0 0H80V80H0Z','none','#132235',3,.65);path('M3 77V3H77','none','#9cb0c0',1,.55);
    for(const [x,y] of [[9,9],[71,9],[9,71],[71,71]]) {
      circle(x,y,3.5,'#172b3d',.8);circle(x-1,y-1,2.5,'#afbec5',.85);
      path(`M${x-2} ${y-2}h2`,'none','#f2f6ee',.8,.9);
    }
  } else if(kind==='disco') {
    const colors=['#e8edf5','#b8c4dc','#e7d5e5','#a0a9c9','#d4e8dd'];
    for(let y=0;y<8;y++) for(let x=0;x<8;x++) {
      rect(x*10,y*10,9,9,colors[(x*7+y*3+x*y)%5],.8);
      path(`M${x*10} ${y*10+8}v-8h8`,'none','#fff',.6,.55);
    }
    path('M23 10v16m-8-8h16M64 55v12m-6-6h12','none','#fff',1.5,.95);
  } else if(kind==='ceramicblue') {
    for(const [x,y] of [[20,22],[61,61]]) {
      const g=el('g',{transform:`translate(${x} ${y})`},p);
      for(let i=0;i<6;i++) el('ellipse',{cx:0,cy:-6,rx:3,ry:7,fill:'#4c7097',opacity:.8,transform:`rotate(${i*60})`},g);
      circle(0,0,2,'#e5ebdf',1,g);
      path('M5 14Q22 28 18 40M10 22q10-13 15-3q-3 8-15 3','none','#416d94',1.2,.9,g);
    }
  } else if(kind==='kintsugi') {
    for(const d of ['M12-5L31 32 18 62 52 84 47 128 71 166','M31 32L78 20 105 41 166 25','M52 84L100 73 127 96 166 83','M100 73L105 41','M127 96L111 134 122 166']) {
      path(d,'none','#172e28',4,.6);path(d,'none','#cfaa61',2.4,.95);path(d,'none','#fff0b2',.55,.8);
    }
  }
  return p;
}
