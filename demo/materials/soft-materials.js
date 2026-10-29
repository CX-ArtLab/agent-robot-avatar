import { skin } from './more-materials.js';
import { createLayerTexture } from './layered-texture.js';
import { glazeVariants } from './glaze-variants.js';
import { metalTint, referenceMetalFinishes, deepSilverFinishes, referenceMetalTint } from './metal-tint.js';
import { woodSkins, woodTexture } from './wood-materials.js';

// Match the added inner shadow to each material's existing depth. Weighted
// glass already has a dark lower layer, so its extra reflection stays softer.
const translucentShadowStrength = {
  clearwhite:.20, clearpale:.32, clearsilver:.46,
  clearweighted:.40, clearhard:.42, clearsmoke:.68, clearink:1,
};

export const softSkins = {
  lilacglass: skin('紫晶软玻璃', 'LILAC GLASS', '通透紫晶 · 厚实亮边 · 柔软折光',
    ['#e7c9ff','#b77aee','#9160d6','#653bab'], '#fff8ff', '#f1ddff', ['#f0edf4','#d9d4e1'],
    {pattern:'lilacglass',shine:.44,shade:.18,antenna:['#fff2ff','#ba8bed','#7250b5']}),
  matcharib: skin('青芽绒绒', 'GREEN RIBBON', '嫩绿绒面 · 细软竖纹 · 蓬松明暗',
    ['#d1ef9b','#96c953','#6ba737','#3e6e29'], '#fff9de', '#d6ecb0', ['#edf0e7','#d4dbcc'],
    {pattern:'matcharib',shine:.08,shade:.28,matte:true,antenna:['#d5eeac','#96c85c','#548039']}),
  rosegel: skin('玫瑰凝胶', 'ROSE GEL', '饱满桃粉 · 湿润亮面 · 透明糖衣',
    ['#ffb8d3','#f377ad','#df458c','#a82c6d'], '#fff6f1', '#f7b6d7', ['#f5edf0','#e2d3da'],
    {pattern:'rosegel',shine:.14,shade:.25,antenna:['#ffe7f4','#f485b6','#c33d7c']}),
  apricotsoft: skin('杏橙软胶', 'APRICOT SILICONE', '温暖杏橙 · 细腻磨砂 · 柔和体积',
    ['#f8c47d','#e9a051','#cf8039','#a95f2b'], '#fff7e8', '#f2c893', ['#f1eee7','#dcd5c9'],
    {pattern:'apricotsoft',shine:.06,shade:.22,matte:true,antenna:['#f9d59b','#eaaa61','#ac703d']}),
  silverdrop: skin('液态银', 'LIQUID SILVER', '柔滑银面 · 弧面反光 · 冷暖映照',
    ['#fcfaf6','#d5dde0','#a3afb6','#71818a'], '#283c49', '#e9eff2', ['#eceff0','#ccd2d5'],
    {pattern:'silverdrop',shine:.12,shade:.26,antenna:['#fbfdff','#bcc8ce','#63757f']}),
};

// Keep 94 intact; share its reflection geometry and backdrop for tonal comparison.
Object.assign(softSkins, {
  silverbright: {...softSkins.silverdrop,
    label:'亮银', english:'BRIGHT SILVER', description:'最浅银白 · 清亮反光 · 柔和暗部',
    base:['#ffffff','#f0f3f3','#d5dee2','#a5b5bf'], shine:.16, shade:.17,
    antenna:['#ffffff','#e1e9ed','#95a8b3']},
  silverlight: {...softSkins.silverdrop,
    label:'浅银', english:'PALE SILVER', description:'浅灰银色 · 轻盈光泽 · 细腻层次',
    base:['#fffefa','#e3e9eb','#bdc9cf','#899ca7'], shine:.14, shade:.21,
    antenna:['#ffffff','#ced9df','#7b919e']},
  silverdeep: {...softSkins.silverdrop,
    label:'深银', english:'DEEP SILVER', description:'沉静钢灰 · 明亮映照 · 深色弧面',
    base:['#dce4e8','#9baab4','#657784','#3d505e'], eye:'#f2f7fa', rim:'#c7d4dd', shine:.1, shade:.29,
    antenna:['#e9f1f6','#8fa2af','#425866']},
  silvergraphite: {...softSkins.silverdrop,
    label:'石墨银', english:'GRAPHITE SILVER', description:'深石墨色 · 冷银亮面 · 浓郁阴影',
    base:['#aabac5','#647987','#3b505f','#213440'], eye:'#f3f8fc', rim:'#a8bccb', shine:.08, shade:.32,
    antenna:['#ccdbe5','#667f90','#2b4252']},
  clearsilver: {...softSkins.silverdrop,
    label:'透光液态银', english:'TRANSLUCENT SILVER', description:'清透银灰 · 内层折光 · 柔软厚度',
    base:['#fcfaf6','#d3dbdf','#98a6ae','#66767f'], pattern:'clearsilver',
    translucent:true, glassTint:'#e4f0f7', glassRim:'#edf7ff', shine:.1, shade:.18,
    antenna:['#f5fbff','#b9cbd4','#607b8b']},
});

// All five translucent shades use 99's transparency and inner reflections.
Object.assign(softSkins, {
  clearwhite: {...softSkins.clearsilver,
    label:'雾白透银', english:'MIST SILVER', description:'最浅雾白 · 内层折光 · 轻透厚度',
    base:['#ffffff','#eff5f7','#d8e4ea','#b3c5d0'],
    antenna:['#ffffff','#e0ebf0','#9bb2c1']},
  clearpale: {...softSkins.clearsilver,
    label:'浅银透光', english:'PALE TRANSLUCENT', description:'浅淡银灰 · 内层折光 · 柔亮透光',
    base:['#fffefa','#e3eaee','#bccbd4','#8b9faa'],
    antenna:['#fcfeff','#cddde5','#7c96a6']},
  clearsmoke: {...softSkins.clearsilver,
    label:'烟灰透银', english:'SMOKE SILVER', description:'烟灰银色 · 内层折光 · 深浅通透',
    base:['#dce5e9','#abbac3','#778e9d','#485f70'],
    antenna:['#e8f2f8','#9ab1c0','#4e697c']},
  clearink: {...softSkins.clearsilver,
    label:'墨灰透银', english:'INK SILVER', description:'浓墨银灰 · 内层折光 · 深色透光',
    base:['#bacbd6','#7e97a8','#4b687e','#2a4257'],
    antenna:['#cedfe9','#7895aa','#314f65']},
  clearweighted: {...softSkins.clearsilver,
    label:'厚底透银', english:'WEIGHTED GLASS', description:'99 号变体 · 底部加重 · 透光厚度',
    pattern:'clearweighted'},
  clearhard: {...softSkins.clearsilver,
    label:'硬光透银', english:'HARD LIGHT GLASS', description:'99 号变体 · 顶部硬光 · 明亮反射',
    pattern:'clearhard', shine:.035},
  blueglaze: skin('亮釉蓝', 'BLUE GLAZE', '玻璃亮釉 · 白瓷浮雕 · 柔软投影',
    ['#58b7eb','#2c98e2','#2674da','#2939bf'], '#f6f8ff', '#b5daef', ['#f4f5f6','#e8ebef'],
    {pattern:'blueglaze',simpleLayers:true,darkColor:'#253bb9',raisedEyes:true,shine:0,shade:0,
      antenna:['#e9faff','#58abe9','#2b52b3']}),
  iceglaze: skin('冰透蓝', 'ICE BLUE GLAZE', '冰蓝玻璃 · 白瓷浮雕 · 内层折光',
    ['#d5e4f5','#bfd2e9','#a9c2de','#8ba9cb'], '#f5f7fc', '#d8e5f3', ['#f4f5f6','#e8ebef'],
    {pattern:'iceglaze',simpleLayers:true,darkColor:'#94afd0',raisedEyes:true,shine:0,shade:0,
      antenna:['#ffffff','#c3dbef','#7d9fc2']}),
});

// Append new colors so existing material numbers remain stable.
for (const [name,variant] of Object.entries(glazeVariants)) {
  const palette = variant.palette;
  softSkins[name] = {...softSkins[variant.source],label:variant.label,english:variant.english,
    description:variant.source === 'blueglaze' ? '饱和亮釉 · 白瓷浮雕 · 弧面高光' : '柔淡冰透 · 白瓷浮雕 · 内层折光',
    pattern:name,darkColor:palette.baseColor,rim:palette.edgeColor,antenna:variant.antenna,
    base:[palette.bodyColor,palette.bodyColor,palette.bodyEndColor,palette.baseColor],
    eyeShadow:palette.baseColor,
    ...(variant.number ? {number:variant.number} : {}),
  };
}

export const goldMetalNames = ['goldbright','goldlight','golddrop','golddeep','goldgraphite'];
export const copperMetalNames = ['copperbright','copperlight','copperdrop','copperdeep','coppergraphite'];
const metalSources = ['silverbright','silverlight','silverdrop','silverdeep','silvergraphite'];
for (const [family,names] of [['gold',goldMetalNames],['copper',copperMetalNames]]) {
  const labels = family === 'gold' ? ['亮金','浅金','液态金','深金','古金'] : ['亮铜','浅铜','液态铜','深铜','古铜'];
  names.forEach((name,index) => {
    const source = softSkins[metalSources[index]];
    const base = source.base.map(color => metalTint(color,family));
    softSkins[name] = {...source,label:labels[index],
      english:`${['BRIGHT','PALE','LIQUID','DEEP','ANTIQUE'][index]} ${family.toUpperCase()}`,
      description:`${family === 'gold' ? '暖金金属' : '红铜金属'} · 弧面反光 · ${index < 2 ? '轻盈亮面' : index === 2 ? '柔滑映照' : '深色层次'}`,
      base,pattern:'silverdrop',metalFamily:family,metalSource:metalSources[index],
      eye:metalTint(source.eye,family),rim:metalTint(source.rim,family),
      antenna:source.antenna.map(color => metalTint(color,family)),
    };
  });
}

export const referenceMetalNames = Object.keys(referenceMetalFinishes);
for (const [name,finish] of Object.entries(referenceMetalFinishes)) {
  const source = softSkins.goldgraphite;
  softSkins[name] = {...source,label:finish.label,english:finish.english,
    description:'古金母版 · 柔和反射 · 立体天线',
    base:source.base.map(color => referenceMetalTint(color,name)),
    antenna:source.antenna.map(color => referenceMetalTint(color,name)),
    eye:source.eye,rim:referenceMetalTint(source.rim,name),
    metalSource:undefined,metalFamily:undefined,referenceSource:'goldgraphite',referenceFinish:name,
  };
}

export const deepSilverMetalNames = Object.keys(deepSilverFinishes);
for (const [name,finish] of Object.entries(deepSilverFinishes)) {
  const source = softSkins.silverdeep;
  softSkins[name] = {...source,label:finish.label,english:finish.english,
    description:finish.description || '深银母版 · 柔和映照 · 深色弧面',
    base:source.base.map(color => referenceMetalTint(color,name)),
    antenna:source.antenna.map(color => referenceMetalTint(color,name)),
    eye:finish.eye || source.eye,rim:referenceMetalTint(source.rim,name),
    referenceSource:'silverdeep',referenceFinish:name,
    ...(finish.number ? {number:finish.number} : {}),
  };
}

export const pillowMetalNames = ['pillowgold','pillowsilver'];
Object.assign(softSkins, {
  pillowgold:skin('厚边金','ROUNDED GOLD','饱满圆边 · 内侧暗带 · 暖金镜面',
    ['#fff0b8','#d5ae55','#b38131','#79521d'],'#65461f','#f8e6b0',['#f3f2ef','#dfe2e2'],
    {number:145,pattern:'pillowgold',pillowMetal:true,minimalControls:true,shine:.025,shade:.06,rimOpacity:.25,
      antenna:['#fff8dc','#dbb867','#79531f']}),
  pillowsilver:skin('厚边银','ROUNDED SILVER','饱满圆边 · 内侧暗带 · 冷银镜面',
    ['#f9fcff','#c3cbd1','#929ea8','#4f606d'],'#364752','#f1f6fa',['#f3f2ef','#dfe2e2'],
    {number:146,pattern:'pillowsilver',pillowMetal:true,minimalControls:true,shine:.025,shade:.06,rimOpacity:.25,
      antenna:['#ffffff','#c5d0d8','#536672']}),
});

export const woodNames = Object.keys(woodSkins);
Object.assign(softSkins,woodSkins);

export function softTexture(defs, id, kind, el, gradient) {
  if (!(kind in softSkins)) return null;
  if (kind in woodSkins) return woodTexture(defs,id,kind,el,gradient);
  if (softSkins[kind].simpleLayers) return createLayerTexture(defs,id,kind,el,gradient);
  const p = el('pattern', {id,width:240,height:240,patternUnits:'userSpaceOnUse'}, defs);
  const path = (d, stroke, width=1, fill='none', opacity=1) =>
    el('path', {d,stroke,'stroke-width':width,fill,opacity,'stroke-linecap':'round','stroke-linejoin':'round'}, p);
  const metalFamily = softSkins[id.replace(/^material-/, '').replace(/-texture$/, '')]?.metalFamily;
  const radial = (name, stops, attrs={}) => {
    const palette = metalFamily ? stops.map(([offset,color,opacity=1]) => [offset,metalTint(color,metalFamily),opacity]) : stops;
    gradient(defs, 'radialGradient', `${id}-${name}`, {cx:'.35',cy:'.25',r:'.8',...attrs}, palette);
    return `url(#${id}-${name})`;
  };
  const shine = (name, stops) => {
    gradient(defs, 'linearGradient', `${id}-${name}`, {x1:'0',y1:'0',x2:'.3',y2:'1'}, stops);
    return `url(#${id}-${name})`;
  };
  if (pillowMetalNames.includes(kind)) {
    const gold = kind === 'pillowgold';
    const colors = gold ? {
      face:['#fff0bc','#e6cb84','#c99d50','#a67631'],
      bevel:['#a47934','#ecce86','#f6e3ac','#c89d50','#ead092'],
      shadow:'#81551d',light:'#fff5c6',reflection:'#fff9d9',
    } : {
      face:['#ffffff','#dce3e7','#aab6bf','#768894'],
      bevel:['#72838e','#d4dfe6','#f5fbff','#9caeb9','#dce7ee'],
      shadow:'#4a5c69',light:'#ffffff',reflection:'#f6fcff',
    };
    const makeGradient = (name,tag,attributes,stops) => {
      const node = gradient(defs,tag,`${id}-pillow-${name}`,attributes,stops);
      return `url(#${node.id})`;
    };
    for (const [name,blur] of [['soft',5.5],['glint',2],['bottom',3.2]]) {
      const filter = el('filter',{id:`${id}-pillow-${name}`,x:'-30%',y:'-30%',width:'160%',height:'160%',
        'color-interpolation-filters':'sRGB'},defs);
      el('feGaussianBlur',{stdDeviation:blur},filter);
    }
    // Every band uses the real head outline, so rounded reflections remain
    // aligned with the silhouette during the existing squash animations.
    const contour = (scale,attrs,y=120) => el('use',{
      href:'#headShape',transform:`translate(120 ${y}) scale(${scale}) translate(-120 -120)`,
      fill:'none','stroke-linejoin':'round',...attrs,
    },p);
    // One continuous face replaces the smaller opaque inset panel. The
    // side roll and lower return are soft reflections on this same surface.
    const face = makeGradient('face','radialGradient',{cx:'.8',cy:'.24',r:'1.02'},
      colors.face.map((color,index) => [[0,.34,.7,1][index],color]));
    el('rect',{width:240,height:240,fill:face},p);
    const depth = makeGradient('depth','linearGradient',{x1:'0',y1:'.15',x2:'1',y2:'.65'},
      [[0,colors.shadow,.7],[.25,colors.shadow,.5],[.55,colors.shadow,.08],[1,colors.shadow,.12]]);
    contour(.87,{stroke:depth,'stroke-width':22,filter:`url(#${id}-pillow-soft)`},118);
    const bottom = makeGradient('bottom','linearGradient',{x1:'.5',y1:'0',x2:'.5',y2:'1'},
      [[0,colors.shadow,0],[.65,colors.shadow,0],[.82,colors.shadow,.18],[.95,colors.shadow,.78],[1,colors.shadow,.48]]);
    contour(.90,{stroke:bottom,'stroke-width':14,filter:`url(#${id}-pillow-bottom)`},122);
    const reflection = makeGradient('reflection','radialGradient',{cx:'.5',cy:'.5',r:'.5'},
      [[0,colors.reflection,.82],[.3,colors.reflection,.69],[.65,colors.reflection,.27],[1,colors.reflection,0]]);
    el('ellipse',{cx:184,cy:108,rx:39,ry:77,fill:reflection,filter:`url(#${id}-pillow-soft)`},p);
    const lip = makeGradient('lip','linearGradient',{x1:'.5',y1:'0',x2:'.5',y2:'1'},
      [[0,colors.light,0],[.73,colors.light,0],[.87,colors.light,.22],[.96,colors.light,.78],[1,colors.light,.6]]);
    contour(.84,{stroke:lip,'stroke-width':5.5,filter:`url(#${id}-pillow-glint)`},116);
    const bevel = makeGradient('bevel','linearGradient',{x1:'.22',y1:'0',x2:'.7',y2:'1'},
      colors.bevel.map((color,index) => [[0,.23,.52,.8,1][index],color]));
    contour(.98,{stroke:bevel,'stroke-width':5,filter:`url(#${id}-pillow-glint)`});
    const highlight = makeGradient('highlight','radialGradient',{cx:'.01',cy:'.44',r:'.64'},
      [[0,colors.light,.94],[.24,colors.light,.78],[.58,colors.light,.2],[1,colors.light,0]]);
    contour(.91,{stroke:highlight,'stroke-width':9,filter:`url(#${id}-pillow-glint)`});
  } else if (kind === 'lilacglass') {
    const inner = radial('inner', [[0,'#fae9ff',.43],[.45,'#c1a1ff',.15],[.8,'#7433bd',.21],[1,'#eacfff',.58]]);
    el('rect', {width:240,height:240,fill:inner}, p);
    const edge = shine('edge', [[0,'#fff5ff',.92],[.36,'#ebcdff',.28],[.7,'#7145b5',.12],[1,'#e4cbff',.78]]);
    path('M120 29C53 29 29 48 29 117S43 211 117 211S211 192 211 120S190 29 120 29Z', edge, 7);
    path('M43 85C47 52 68 43 101 42', '#ffffff', 5, 'none', .6);
    path('M53 77C58 57 73 51 87 49', '#fff5ff', 2, 'none', .7);
    path('M44 165C53 190 85 203 111 201C151 198 168 183 197 174', '#e9bfff', 8, 'none', .28);
    path('M163 202Q196 199 204 166', '#f5dcff', 3, 'none', .68);
    path('M37 109Q31 145 40 159', '#f5dcff', 2, 'none', .48);
  } else if (kind === 'matcharib') {
    const rib = el('pattern', {id:`${id}-ribs`,width:9,height:240,patternUnits:'userSpaceOnUse'}, defs);
    gradient(defs, 'linearGradient', `${id}-rib-light`, {x1:'0',y1:'0',x2:'1',y2:'0'},
      [[0,'#244d1b',.32],[.25,'#bfe47b',.1],[.48,'#edffc4',.26],[.72,'#5e912e',.06],[1,'#244d1b',.32]]);
    el('rect', {width:9,height:240,fill:`url(#${id}-rib-light)`}, rib);
    el('rect', {width:240,height:240,fill:`url(#${id}-ribs)`}, p);
    for (let i=0;i<240;i++) {
      const x=22+(i*31.17)%196, y=22+(i*i*7.73)%196;
      path(`M${x} ${y}l${i%2?1:-1} -2`, i%3?'#e5f9b6':'#345c23', .6, 'none', .2);
    }
    const glow = radial('nap', [[0,'#eaffb5',.3],[.6,'#ceec95',.07],[1,'#eaffb5',0]]);
    el('ellipse', {cx:83,cy:58,rx:91,ry:64,fill:glow}, p);
  } else if (kind === 'rosegel') {
    const glaze = radial('glaze', [[0,'#fff8fc',.91],[.28,'#ffeaf4',.68],[.58,'#ffd9ed',.17],[1,'#ffd0e7',0]], {cx:'.5',cy:'.5',r:'.5'});
    el('ellipse', {cx:80,cy:53,rx:45,ry:18,fill:glaze,transform:'rotate(-16 80 53)'}, p);
    const transmitted = radial('transmitted', [[0,'#ffadd5',.7],[.4,'#ff9dcd',.32],[1,'#ff96c8',0]], {cx:'.5',cy:'.5',r:'.5'});
    el('ellipse', {cx:139,cy:184,rx:76,ry:32,fill:transmitted,transform:'rotate(-12 139 184)'}, p);
    const side = radial('side', [[0,'#ffe3f3',.6],[.3,'#ffcee8',.22],[1,'#ffc5e3',0]], {cx:'.5',cy:'.5',r:'.5'});
    el('ellipse', {cx:202,cy:104,rx:13,ry:43,fill:side}, p);
  } else if (kind === 'apricotsoft') {
    const bloom = radial('bloom', [[0,'#fff1d5',.2],[.5,'#ffe2ba',.09],[1,'#ffd5a0',0]]);
    el('ellipse', {cx:85,cy:66,rx:92,ry:70,fill:bloom}, p);
    for (let i=0;i<190;i++) {
      el('circle', {cx:20+(i*37.29)%200,cy:20+(i*i*9.31)%200,r:i%3?.45:.7,fill:i%2?'#fff3d9':'#a56527',opacity:.09}, p);
    }
    const bounce = radial('bounce', [[0,'#ffd1a1',.25],[1,'#ffd1a1',0]], {cx:'.5',cy:'.5',r:'.5'});
    el('ellipse', {cx:179,cy:151,rx:45,ry:63,fill:bounce}, p);
  } else if (['clearsilver','clearweighted','clearhard'].includes(kind)) {
    // Restore the earlier glass-like depth. The inner reflection follows the
    // right-hand curve rather than cutting diagonally into the middle of the face.
    const softEdge = el('filter', {id:`${id}-soft-edge`,x:'-40%',y:'-40%',width:'180%',height:'180%'}, defs);
    el('feGaussianBlur', {stdDeviation:5}, softEdge);
    const innerShade = shine('inner-shade', [[0,'#4d6573',.08],[.24,'#344f60',.52],[.6,'#4b687b',.37],[1,'#829ca9',0]]);
    const innerShadeShape = 'M181 39C210 55 216 87 213 117C212 145 202 166 190 180L182 169C196 139 200 117 196 90C194 69 189 51 181 39Z';
    const curve = path(innerShadeShape, 'none', 0, innerShade);
    curve.setAttribute('filter', `url(#${id}-soft-edge)`);
    const depth = radial('inner-depth', [[0,'#3c5869',.34],[.4,'#658391',.18],[1,'#9cb1bd',0]], {cx:'.5',cy:'.5',r:'.5'});
    el('ellipse', {cx:126,cy:209,rx:88,ry:23,fill:depth,transform:'rotate(-5 126 209)'}, p);
    if (kind === 'clearweighted') {
      // A continuous lower layer adds weight without making a dark dent.
      gradient(defs, 'linearGradient', `${id}-weight`, {x1:'0',y1:'0',x2:'0',y2:'1'},
        [[0,'#567180',0],[.3,'#567180',.04],[.6,'#3e5b6d',.24],[.84,'#2e495c',.5],[1,'#253e50',.57]]);
      el('rect', {x:0,y:144,width:240,height:96,fill:`url(#${id}-weight)`}, p);
    }
    const transmitted = radial('transmitted', [[0,'#f6fdff',.75],[.3,'#e8f7ff',.46],[.68,'#cbe3ee',.15],[1,'#cbe3ee',0]], {cx:'.5',cy:'.5',r:'.5'});
    el('ellipse', {cx:194,cy:157,rx:25,ry:57,fill:transmitted,transform:'rotate(17 194 157)'}, p);
    el('ellipse', {cx:126,cy:214,rx:73,ry:14,fill:transmitted,opacity:kind==='clearweighted'?.55:1}, p);
    if (kind === 'clearhard') {
      const hard = radial('hard-light', [[0,'#ffffff',1],[.68,'#ffffff',1],[.86,'#ffffff',.94],[.95,'#f4fbff',.55],[1,'#f4fbff',0]], {cx:'.5',cy:'.5',r:'.5'});
      el('ellipse', {cx:79,cy:51,rx:43,ry:12,fill:hard,transform:'rotate(-18 79 51)'}, p);
    } else {
      const white = radial('softbox', [[0,'#ffffff',.96],[.3,'#ffffff',.78],[.63,'#f4fbff',.28],[1,'#e8f3ff',0]], {cx:'.5',cy:'.5',r:'.5'});
      el('ellipse', {cx:76,cy:55,rx:59,ry:27,fill:white,transform:'rotate(-18 76 55)'}, p);
    }
    const warm = radial('warm-transmission', [[0,'#fff1da',.25],[1,'#fff1da',0]], {cx:'.5',cy:'.5',r:'.5'});
    el('ellipse', {cx:49,cy:140,rx:33,ry:68,fill:warm}, p);
    {
      // The flattened head ends at y=210. Keep this broad inner crescent above
      // that edge, and above the floor reflection so the light cannot erase it.
      // New parameter IDs replace only the rejected bottom-shadow experiment.
      const bottomShade = gradient(defs,'linearGradient',`${id}-bottom-shade-v2`,
        {x1:'.5',y1:'0',x2:'.5',y2:'1'},
        [[0,'#476171',0],[.24,'#344e60',.34],[.56,'#213b4d',.86],[.8,'#294455',.84],[1,'#58717f',.22]]);
      const bottomSoft = el('filter', {id:`${id}-bottom-soft-v2`,x:'-30%',y:'-100%',width:'160%',height:'300%'}, defs);
      el('feGaussianBlur', {stdDeviation:3.5}, bottomSoft);
      const materialName = id.replace(/^material-/, '').replace(/-texture$/, '');
      const bottom = el('g', {id:`${id}-bottom-shadow`,opacity:translucentShadowStrength[materialName] ?? 1,
        'data-x':0,'data-y':0,'data-width':100,'data-height':100}, p);
      el('path', {
        d:'M39 172C55 186 80 189 120 189C159 189 184 185 201 172C197 188 181 199 158 202C137 205 103 205 81 202C58 199 43 189 39 172Z',
        fill:`url(#${bottomShade.id})`,filter:`url(#${id}-bottom-soft-v2)`,
      }, bottom);
    }
  } else if (kind === 'silverdrop') {
    // Put the reflected dark studio edge outside the face, so it rolls around
    // the silhouette instead of reading as an isolated dent in the surface.
    const dark = radial('studio-dark', [[0,'#43545f',.64],[.35,'#586b76',.43],[.7,'#86969f',.14],[1,'#a6b3bb',0]], {cx:'.5',cy:'.5',r:'.5'});
    el('ellipse', {cx:222,cy:105,rx:65,ry:115,fill:dark,transform:'rotate(-12 222 105)'}, p);
    const underside = radial('underside', [[0,'#4d5d67',.44],[.45,'#63747e',.22],[1,'#94a4ac',0]], {cx:'.5',cy:'.5',r:'.5'});
    el('ellipse', {cx:126,cy:237,rx:128,ry:70,fill:underside}, p);
    const white = radial('studio-white', [[0,'#ffffff',.94],[.28,'#ffffff',.76],[.6,'#f4faff',.26],[1,'#e5f3ff',0]], {cx:'.5',cy:'.5',r:'.5'});
    el('ellipse', {cx:78,cy:57,rx:67,ry:35,fill:white,transform:'rotate(-18 78 57)'}, p);
    const rimLight = radial('rim-light', [[0,'#f6fbff',.72],[.3,'#edf6ff',.4],[.65,'#d8e8f2',.12],[1,'#d8e8f2',0]], {cx:'.5',cy:'.5',r:'.5'});
    el('ellipse', {cx:216,cy:145,rx:28,ry:78,fill:rimLight,transform:'rotate(9 216 145)'}, p);
    const floorBounce = radial('floor-bounce', [[0,'#e2ebee',.36],[.45,'#d8e3e8',.14],[1,'#d8e3e8',0]], {cx:'.5',cy:'.5',r:'.5'});
    el('ellipse', {cx:120,cy:222,rx:92,ry:24,fill:floorBounce}, p);
    const warm = radial('warm-room', [[0,'#e8ceac',.22],[1,'#e8ceac',0]], {cx:'.5',cy:'.5',r:'.5'});
    el('ellipse', {cx:39,cy:137,rx:35,ry:75,fill:warm}, p);
  }
  return p;
}
