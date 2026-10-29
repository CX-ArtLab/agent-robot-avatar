import { extraSkins, extraTexture } from './more-materials.js';
import { collectionSkins, collectionTexture } from './collection-materials.js';
import { revisions, revisionTexture } from './revised-materials.js';
import { secondPass, secondPassTexture, currentRedesign } from './second-pass-materials.js';
import { sportsSkins, sportsTexture } from './sports-materials.js';
import { softSkins, softTexture, goldMetalNames, copperMetalNames, referenceMetalNames, deepSilverMetalNames, pillowMetalNames, woodNames } from './soft-materials.js';
import { glossGlazeNames, iceGlazeNames } from './glaze-variants.js';
import { layerDefaults } from './layered-texture.js';

const NS = 'http://www.w3.org/2000/svg';
// Keep the selected cloud; omit the other twelve from the latest review batch.
const removedSkins = new Set([...currentRedesign].filter(name => name !== 'cloud'));
const skins = {
  obsidian: {
    base: ['#7b8796', '#313a47', '#101722', '#05080e'],
    eye: '#f0f7ff', rim: '#c1d5f4', shine: 0.57, shade: 0.68,
    antenna: ['#c3cfdf', '#384452', '#080e19'],
  },
  porcelain: {
    base: ['#ffffff', '#f5f4ec', '#d9dad3', '#a3aaab'],
    eye: '#343b3c', rim: '#ffffff', shine: 0.95, shade: 0.18,
    antenna: ['#ffffff', '#e7e9df', '#a6afb0'],
  },
  aurora: {
    base: ['#9aebea', '#92c9f1', '#a795eb', '#e79bc7'],
    eye: '#2d3052', rim: '#fff4fe', shine: 0.82, shade: 0.30,
    antenna: ['#edffff', '#9ba7ec', '#7456a5'],
  },
  candy: {
    base: ['#ffd5df', '#f4a2bf', '#e782a7', '#c85d89'],
    eye: '#7a3058', rim: '#fff1f6', shine: .70, shade: .23,
    antenna: ['#fff8fb', '#f3a0c3', '#be507f'], pattern: 'stripes',
  },
  jelly: {
    base: ['#ddfff8', '#89e5d5', '#4bc8bb', '#259c9e'],
    eye: '#155963', rim: '#efffff', shine: .86, shade: .15,
    antenna: ['#f2fff9', '#89e5d5', '#299b9f'], translucent: true,
  },
  metal: {
    base: ['#eef3f4', '#9daab6', '#cbd3d8', '#657584'],
    eye: '#27333e', rim: '#ffffff', shine: .65, shade: .40,
    antenna: ['#ffffff', '#acb9c4', '#435262'], pattern: 'brushed', linear: true,
  },
  clay: {
    base: ['#e6b59a', '#d9997d', '#c58065', '#ad674e'],
    eye: '#573c34', rim: '#edc6ae', shine: .12, shade: .22,
    antenna: ['#e8bca1', '#cb8b6f', '#a96650'], pattern: 'grain', matte: true,
  },
  polka: {
    base: ['#af9beb', '#8c72d9', '#7860c4', '#5a469e'],
    eye: '#fff9e8', rim: '#e2d5ff', shine: .34, shade: .28,
    antenna: ['#fff2ae', '#f2d77d', '#b9963b'], pattern: 'dots',
  },
  pixel: {
    base: ['#254d5d', '#183c4b', '#12323f', '#0b2531'],
    eye: '#c5ffe5', rim: '#80e4d1', shine: .22, shade: .38,
    antenna: ['#e0fff1', '#79d9ba', '#237e7c'], pattern: 'pixels', matte: true,
  },
};

const newSkins = {
  gold: {
    label: '液态黄金', english: 'LIQUID GOLD', description: '暖金反射 · 明亮光带 · 金属光泽',
    stage: 'radial-gradient(ellipse at 35% 25%,#fff7dc,#eaddb7)', ink: '#9a8552',
    base: ['#9b631d', '#edc66a', '#fff6c2', '#b78329', '#e9c26c', '#956016'],
    eye: '#443315', rim: '#fff2b1', shine: .65, shade: .25, linear: true,
    antenna: ['#fff5bb', '#ddb653', '#96621c'],
  },
  walnut: {
    label: '胡桃木', english: 'WALNUT', description: '弯曲木纹 · 深浅年轮 · 温暖木作',
    stage: 'radial-gradient(ellipse at 35% 25%,#eee4d4,#d9c8b2)', ink: '#97816a',
    base: ['#ba8b61', '#a06e45', '#865733', '#694023'],
    eye: '#fff2d8', rim: '#d2ab7f', shine: .15, shade: .30, matte: true, pattern: 'wood',
    antenna: ['#d0ab79', '#9d6d40', '#694223'],
  },
  marble: {
    label: '青白大理石', english: 'MARBLE', description: '青白石面 · 自然脉络 · 抛光石材',
    stage: 'radial-gradient(ellipse at 35% 25%,#f3f5f1,#d6dfd8)', ink: '#82968c',
    base: ['#ffffff', '#eef4ec', '#d4e2d9', '#b6c9c0'],
    eye: '#32554f', rim: '#f7fffa', shine: .60, shade: .20, pattern: 'marble',
    antenna: ['#fff', '#cfdfd4', '#8fa99e'],
  },
  denim: {
    label: '复古牛仔', english: 'DENIM', description: '蓝色斜纹 · 金色缝线 · 织物质感',
    stage: 'radial-gradient(ellipse at 35% 25%,#e2e9ed,#c0cfd8)', ink: '#7d919e',
    base: ['#698ba3', '#456d8b', '#315775', '#244460'],
    eye: '#fff0ce', rim: '#9db2c2', shine: .12, shade: .28, matte: true, pattern: 'denim', stitched: true,
    antenna: ['#8ca6b9', '#4a718b', '#29465d'],
  },
  carbon: {
    label: '碳纤维', english: 'CARBON FIBER', description: '斜向双股编织 · 细密纤维束 · 透明树脂反光',
    stage: 'radial-gradient(ellipse at 35% 25%,#38433f,#1c2525)', ink: '#a6b7af',
    base: ['#4a5557', '#2c3639', '#1b2428', '#10191e'],
    eye: '#e1f3e9', rim: '#aabfbe', shine: .29, shade: .36, pattern: 'carbon',
    antenna: ['#d2e2de', '#647b7a', '#263d42'],
  },
  galaxy: {
    label: '口袋星空', english: 'POCKET GALAXY', description: '浓郁紫蓝星云 · 明亮星点 · 柔光星芒',
    stage: 'radial-gradient(ellipse at 35% 25%,#303046,#1d1c30)', ink: '#a49abf',
    base: ['#6545ad', '#45277f', '#193b70', '#101b3a'],
    eye: '#fff6da', rim: '#c1b0f5', shine: .21, shade: .32, pattern: 'galaxy',
    antenna: ['#f0dfff', '#ad84ed', '#57338e'],
  },
  lava: {
    label: '熔岩裂隙', english: 'LAVA', description: '深色岩面 · 橙红裂隙 · 炽热内光',
    stage: 'radial-gradient(ellipse at 35% 25%,#453132,#261f25)', ink: '#c09383',
    base: ['#4d4343', '#302d31', '#211e25', '#16151d'],
    eye: '#ffe2a2', rim: '#e29b74', shine: .12, shade: .40, matte: true, pattern: 'lava',
    antenna: ['#fff1ba', '#fb8d45', '#a83b24'],
  },
  terrazzo: {
    label: '彩色水磨石', english: 'TERRAZZO', description: '奶油石底 · 彩色碎片 · 轻快颗粒',
    stage: 'radial-gradient(ellipse at 35% 25%,#faf1e8,#e6d9c9)', ink: '#a28b76',
    base: ['#fff9ed', '#f1e7d7', '#e1d3c1', '#cab9a8'],
    eye: '#635146', rim: '#fff7e8', shine: .18, shade: .22, matte: true, pattern: 'terrazzo',
    antenna: ['#fff5e3', '#e4ceb2', '#b5987f'],
  },
  cow: {
    label: '奶牛软糖', english: 'MILK CANDY', description: '奶白底色 · 不规则黑斑 · 软糖光泽',
    stage: 'radial-gradient(ellipse at 35% 25%,#faf4ec,#e5dcd0)', ink: '#938779',
    base: ['#fffcf3', '#f1ede2', '#e2ddd0', '#c5bfb2'],
    eye: '#5f70c4', rim: '#fff7ed', shine: .48, shade: .20, pattern: 'cow',
    antenna: ['#fbd8e3', '#e8a5bc', '#bb718f'],
  },
  watermelon: {
    label: '西瓜汽水', english: 'WATERMELON', description: '西瓜红色 · 小小瓜籽 · 清新绿边',
    stage: 'radial-gradient(ellipse at 35% 25%,#f7f3d9,#dce5c2)', ink: '#8c996c',
    base: ['#ffb5ad', '#f68d8f', '#e9747f', '#cc5267'],
    eye: '#703b47', rim: '#d9edbc', shine: .55, shade: .19, pattern: 'seeds', edgeColor: '#7fa658',
    antenna: ['#eef5c4', '#a9c372', '#638744'],
  },
  honey: {
    label: '蜂蜜琥珀', english: 'HONEY AMBER', description: '金色半透明 · 六角蜂巢 · 琥珀光泽',
    stage: 'radial-gradient(ellipse at 35% 25%,#fff7d5,#f0dfaa)', ink: '#a08a4a',
    base: ['#fff0a4', '#edc266', '#d69c3f', '#b87928'],
    eye: '#614723', rim: '#fff6bc', shine: .75, shade: .17, pattern: 'honey', translucent: true,
    antenna: ['#fff7bf', '#e8bd5e', '#b77d2e'],
  },
  blueprint: {
    label: '工程蓝图', english: 'BLUEPRINT', description: '钴蓝底色 · 细线网格 · 工程手稿',
    stage: 'radial-gradient(ellipse at 35% 25%,#e1eafa,#c4d4ec)', ink: '#7f93b5',
    base: ['#6a9ed4', '#477ebc', '#2d609f', '#244a85'],
    eye: '#effbff', rim: '#c3e6ff', shine: .16, shade: .24, matte: true, pattern: 'blueprint',
    antenna: ['#d4f1ff', '#79a9d5', '#366496'],
  },
};
Object.assign(skins, newSkins, extraSkins, collectionSkins, sportsSkins, softSkins);
for (const [name, revision] of Object.entries(revisions)) {
  Object.assign(skins[name], revision, {pattern: `revised-${name}`});
}
for (const [name, revision] of Object.entries(secondPass)) {
  Object.assign(skins[name], revision, {pattern: `second-${name}`});
}

const translucentNames = ['clearwhite','clearpale','clearsilver','clearweighted','clearhard','clearsmoke','clearink'];
const silverNames = ['silverbright','silverlight','silverdrop','silverdeep','silvergraphite'];
const blueGlazeNames = [...glossGlazeNames,...iceGlazeNames];
const categories = [
  { id: 'blue-glaze', label: '彩色亮釉', names: glossGlazeNames },
  { id: 'ice-glaze', label: '冰透色彩', names: iceGlazeNames },
  { id: 'translucent', label: '透光银系列', names: translucentNames },
  { id: 'silver', label: '金属银系列', names: silverNames },
  { id: 'pillow-metal', label: '厚边镜面金属', names: pillowMetalNames },
  { id: 'deep-silver-metal', label: '深银延展金属', names: deepSilverMetalNames },
  { id: 'gold-metal', label: '金属金系列', names: goldMetalNames },
  { id: 'copper-metal', label: '金属铜系列', names: copperMetalNames },
  { id: 'reference-metal', label: '古金延展金属', names: referenceMetalNames },
  { id: 'wood', label: '木质纹理', names: woodNames },
  { id: 'soft', label: '灵感软材', names: Object.keys(softSkins).filter(name => !silverNames.includes(name) && !translucentNames.includes(name) && !blueGlazeNames.includes(name) && !goldMetalNames.includes(name) && !copperMetalNames.includes(name) && !referenceMetalNames.includes(name) && !deepSilverMetalNames.includes(name) && !pillowMetalNames.includes(name) && !woodNames.includes(name)) },
  { id: 'sports', label: '球类运动', names: Object.keys(sportsSkins) },
  { id: 'material', label: '金属与陶石', names: ['obsidian','porcelain','metal','clay','gold','marble','terrazzo','copper','sandstone','ceramicblue'] },
  { id: 'gloss', label: '透明与流光', names: ['aurora','jelly','pearl','hologram','ice','soap','disco'] },
  { id: 'fabric', label: '织物与皮革', names: ['denim','leather','knit','lace','tartan','argyle','sashiko','quilt','corduroy','linen'] },
  { id: 'food', label: '甜点与水果', names: ['candy','cow','watermelon','honey','strawberry','kiwi','lemon','orangepeel','dragonfruit','chocolate','waffle','cookie','donut','matcha'] },
  { id: 'nature', label: '草木与生灵', names: ['walnut','cork','bamboo','koi','sakura','moss','cactus'] },
  { id: 'sky', label: '天空与自然', names: ['galaxy','lava','wave','moon','ocean','cloud','raindrop','snowflake','ember'] },
  { id: 'pattern', label: '图案与科技', names: ['polka','pixel','carbon','blueprint','origami','stained','circuit','checker','camo','topo','artdeco','memphis','chevron','hexbolt','rivet'] },
];
function svgElement(tag, attributes = {}, parent) {
  const element = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  parent?.append(element);
  return element;
}

function gradient(defs, tag, id, attributes, stops) {
  const element = svgElement(tag, { id, ...attributes }, defs);
  for (const [offset, color, opacity = 1] of stops) {
    svgElement('stop', { offset, 'stop-color': color, 'stop-opacity': opacity }, element);
  }
  return element;
}

function texture(defs, id, kind) {
  const extra = softTexture(defs, id, kind, svgElement, gradient) || sportsTexture(defs, id, kind, svgElement, gradient) || secondPassTexture(defs, id, kind, svgElement, gradient) || revisionTexture(defs, id, kind, svgElement, gradient) || collectionTexture(defs, id, kind, svgElement, gradient) || extraTexture(defs, id, kind, svgElement, gradient);
  if (extra) return extra;
  const tileSize = ({brushed:8, grain:48, wood:120, marble:220, denim:8, carbon:240,
    galaxy:220, lava:120, terrazzo:80, cow:160, seeds:52, honey:48, blueprint:80})[kind] || 32;
  const pattern = svgElement('pattern', {
    id, width: tileSize, height: tileSize, patternUnits: 'userSpaceOnUse',
    ...(kind === 'stripes' ? { patternTransform: 'rotate(-32)' } : {}),
  }, defs);
  if (kind === 'stripes') {
    svgElement('rect', { width: 14, height: 32, fill: '#fff4f6', opacity: .88 }, pattern);
    svgElement('rect', { x: 20, width: 3, height: 32, fill: '#fff4f6', opacity: .48 }, pattern);
  } else if (kind === 'brushed') {
    for (const [y, opacity] of [[1, .19], [3, .10], [6, .17]]) {
      svgElement('path', { d: `M0 ${y}H8`, stroke: '#fff', 'stroke-width': .45, opacity }, pattern);
    }
  } else if (kind === 'grain') {
    // A fixed small tile gives the matte finish texture without image assets.
    for (let i = 0; i < 64; i++) {
      svgElement('circle', {
        cx: (i * 17.37) % 48, cy: (i * i * 7.13) % 48,
        r: .35 + (i % 3) * .18, fill: i % 2 ? '#fff4de' : '#6f3a27', opacity: .18,
      }, pattern);
    }
  } else if (kind === 'dots') {
    for (const [cx, cy] of [[8, 8], [24, 24]]) {
      svgElement('circle', { cx, cy, r: 4.6, fill: '#f6db7b' }, pattern);
    }
  } else if (kind === 'pixels') {
    svgElement('path', { d: 'M0 0H32V32', fill: 'none', stroke: '#9bf6d2', opacity: .11 }, pattern);
    for (const [x, y, color] of [[2, 2, '#69d8ac'], [10, 2, '#69d8ac'], [10, 10, '#69d8ac'], [22, 22, '#f0d184']]) {
      svgElement('rect', { x, y, width: 6, height: 6, fill: color, opacity: .65 }, pattern);
    }
  } else if (kind === 'wood') {
    for (let i = -2; i < 18; i++) {
      const x = i * 8;
      svgElement('path', {d:`M${x} -5 C${x-22} 25 ${x+26} 42 ${x+8} 69 S${x-12} 104 ${x} 125`, fill:'none', stroke:i%3 ? '#4b2816' : '#efd1a3', 'stroke-width':i%3 ? 1.1 : .8, opacity:.22}, pattern);
    }
    for (const r of [4, 9, 15]) svgElement('ellipse', {cx:76,cy:58,rx:r*.55,ry:r,fill:'none',stroke:'#5a321b','stroke-width':1,opacity:.32}, pattern);
  } else if (kind === 'marble') {
    const veins = ['M-10 20L40 39 52 68 93 83 116 125 159 144 180 193 230 217','M52 68L22 88 10 125 -10 138','M116 125L141 94 147 63 177 42 190 -10','M159 144L198 130 230 144'];
    for (const d of veins) {
      svgElement('path',{d,fill:'none',stroke:'#8ca99c','stroke-width':4,opacity:.15,'stroke-linejoin':'round'},pattern);
      svgElement('path',{d,fill:'none',stroke:'#5c8073','stroke-width':.8,opacity:.48},pattern);
    }
  } else if (kind === 'denim') {
    svgElement('path',{d:'M-4 8L8-4M0 12L12 0',stroke:'#b9d2df','stroke-width':1,opacity:.34},pattern);
    svgElement('path',{d:'M0 1H8M0 5H8',stroke:'#0a2a49','stroke-width':.6,opacity:.23},pattern);
  } else if (kind === 'carbon') {
    gradient(defs,'linearGradient',`${id}-warp`,{x1:'0',y1:'0',x2:'1',y2:'0'},
      [[0,'#142024'],[.22,'#37464a'],[.48,'#526064'],[.72,'#354347'],[1,'#18252a']]);
    gradient(defs,'linearGradient',`${id}-weft`,{x1:'0',y1:'0',x2:'0',y2:'1'},
      [[0,'#0d191f'],[.25,'#27353b'],[.52,'#3c4c52'],[.78,'#26363c'],[1,'#101c23']]);
    const weave = svgElement('pattern',{
      id:`${id}-weave`,width:32,height:32,patternUnits:'userSpaceOnUse',
      patternTransform:'rotate(-18 120 120)',
    },defs);
    svgElement('rect',{width:32,height:32,fill:'#101b20'},weave);
    // Two over, two under; the shift in each row produces the diagonal twill.
    for(let row=0;row<4;row++) for(let col=0;col<4;col++) {
      const x=col*8,y=row*8,vertical=(row-col+4)%4<2;
      svgElement('rect',{x:x+.35,y:y+.35,width:7.3,height:7.3,rx:.65,
        fill:`url(#${id}-${vertical?'warp':'weft'})`},weave);
      for(const offset of [1.7,3.3,4.9,6.5]) {
        svgElement('path',{
          d:vertical?`M${x+offset} ${y+.7}v6.6`:`M${x+.7} ${y+offset}h6.6`,
          stroke:vertical?'#bdc8c6':'#91a6ab','stroke-width':.36,opacity:vertical?.24:.18,
        },weave);
      }
    }
    svgElement('rect',{width:240,height:240,fill:`url(#${id}-weave)`},pattern);
    gradient(defs,'linearGradient',`${id}-resin`,{x1:'.05',y1:'.1',x2:'.95',y2:'.8'},
      [[0,'#e3efec',0],[.24,'#e3efec',.02],[.42,'#e3efec',.18],
       [.55,'#e3efec',.05],[.72,'#e3efec',0],[1,'#031119',.12]]);
    svgElement('rect',{width:240,height:240,fill:`url(#${id}-resin)`},pattern);
  } else if (kind === 'galaxy') {
    // Retain the original two-nebula composition; emphasize color and starlight.
    gradient(defs,'radialGradient',`${id}-cloud`,{},[[0,'#d77cff',.83],[.35,'#ad59ed',.56],[.65,'#8452d9',.25],[1,'#8452d9',0]]);
    svgElement('ellipse',{cx:72,cy:106,rx:110,ry:51,fill:`url(#${id}-cloud)`,transform:'rotate(-35 72 106)'},pattern);
    gradient(defs,'radialGradient',`${id}-blue`,{},[[0,'#70d4ff',.68],[.4,'#4aabf0',.35],[1,'#4aabf0',0]]);
    svgElement('ellipse',{cx:150,cy:64,rx:72,ry:65,fill:`url(#${id}-blue)`},pattern);
    gradient(defs,'radialGradient',`${id}-starlight`,{},[[0,'#eef8ff',.6],[.25,'#d0e6ff',.2],[1,'#bdd9ff',0]]);
    for(let i=0;i<84;i++) {
      const cx=(i*37.13)%220,cy=(i*i*11.79)%220,bright=i%10===0;
      if(bright) svgElement('circle',{cx,cy,r:5.5,fill:`url(#${id}-starlight)`},pattern);
      svgElement('circle',{
        cx,cy,r:bright?1.85:.75+(i%3)*.22,
        fill:i%4?'#fff5e5':'#cdefff',opacity:.64+(i%4)*.11,
      },pattern);
    }
    svgElement('path',{d:'M156 164h14m-7-7v14M44 40h11m-5.5-5.5v11M177 72h9m-4.5-4.5v9',stroke:'#fff2ce','stroke-width':1,opacity:.95},pattern);
  } else if (kind === 'lava') {
    for(const d of ['M4-5L19 25 8 43 36 66 28 94 47 125','M19 25L56 16 75 33 104 19 125 32','M36 66L72 59 90 79 125 65','M90 79L77 105 84 125']) {
      svgElement('path',{d,fill:'none',stroke:'#e95128','stroke-width':5,'stroke-linejoin':'round',opacity:.82},pattern);
      svgElement('path',{d,fill:'none',stroke:'#ffcf77','stroke-width':1.25,'stroke-linejoin':'round',opacity:.92},pattern);
    }
  } else if (kind === 'terrazzo') {
    const colors=['#a47d73','#789b91','#d3a963','#a9a1b8','#e0b2a4'];
    for(let i=0;i<24;i++) {
      const x=(i*29.17)%80,y=(i*i*13.31)%80,s=3+(i%4)*1.4;
      svgElement('path',{d:`M${x} ${y}l${s} ${s*.4} ${-s*.3} ${s} ${-s*.9} ${-s*.3}Z`,fill:colors[i%colors.length],opacity:.75},pattern);
    }
  } else if (kind === 'cow') {
    for(const d of ['M-8 14C9 0 37 2 44 23S32 62 10 53-14 69-8 14Z','M96 50C119 34 151 45 154 68S136 99 116 91 84 72 96 50Z','M38 114C50 94 77 101 87 122S73 157 49 151 26 139 38 114Z']) {
      svgElement('path',{d,fill:'#252735'},pattern);
    }
  } else if (kind === 'seeds') {
    for(const [cx,cy,angle] of [[13,13,-20],[39,39,25]]) svgElement('ellipse',{cx,cy,rx:1.5,ry:3.2,fill:'#824248',opacity:.75,transform:`rotate(${angle} ${cx} ${cy})`},pattern);
  } else if (kind === 'honey') {
    for(const [x,y] of [[0,0],[24,14],[0,28],[48,0],[48,28]]) {
      svgElement('path',{d:`M${x} ${y-14}l12 7v14l-12 7-12-7v-14Z`,fill:'none',stroke:'#fff3bd','stroke-width':1.4,opacity:.45},pattern);
    }
  } else if (kind === 'blueprint') {
    for(let p=0;p<=80;p+=10) svgElement('path',{d:`M${p} 0v80M0 ${p}h80`,stroke:'#d0eeff','stroke-width':p%40===0?.7:.35,opacity:p%40===0?.37:.18},pattern);
    svgElement('circle',{cx:40,cy:40,r:21,fill:'none',stroke:'#dbf3ff','stroke-width':.6,opacity:.36},pattern);
    svgElement('path',{d:'M10 10h12m-6-6v12M60 63h12m-6-6v12',stroke:'#dbf3ff','stroke-width':.8,opacity:.55},pattern);
  }
  return pattern;
}

// This page decorates the existing component only. Its production source and
// animation code remain the source of all expressions, gestures and geometry.
const activeMaterials = new WeakMap();

export function clearMaterial(avatar) {
  activeMaterials.get(avatar)?.dispose();
}

function applyMaterial(avatar, name, { groundShadow = false } = {}) {
  const skin = skins[name];
  if (!skin) throw new Error(`Unknown material: ${name}`);
  clearMaterial(avatar);
  const root = avatar.shadowRoot;
  const svg = root.querySelector('svg');
  const defs = svg.querySelector('defs');
  const head = root.getElementById('head');
  const originalDefs = new Set(defs.children);
  const originalFill = head.getAttribute('fill');
  const originalOpacity = head.getAttribute('fill-opacity');
  const originalEyes = [];
  const properties = ['--material-eye', '--material-eye-right', '--material-eye-relief', '--material-separate-eye-relief', '--material-antenna', '--material-antenna-rim'];
  const originalProperties = properties.map(key => [key, avatar.style.getPropertyValue(key)]);
  const id = `material-${name}`;
  const fill = suffix => `url(#${id}-${suffix})`;

  let eyeShadowOffset;
  if (skin.raisedEyes) {
    // The workshop tints the porcelain relief with each design's eye color.
    // Keep that paint in the public renderer as well as the authoring tool.
    const eyeColor = skin.simpleLayers ? layerDefaults(name).eyeColor : '#ffffff';
    const tintEye = original => '#' + [1,3,5].map(offset =>
      Math.round(parseInt(original.slice(offset,offset+2),16) * parseInt(eyeColor.slice(offset,offset+2),16) / 255).toString(16).padStart(2,'0')
    ).join('');
    gradient(defs, 'radialGradient', `${id}-eye-porcelain`, {cx:'.32',cy:'.22',r:'.88'},
      [[0,tintEye('#ffffff')],[.66,tintEye('#f2f3f8')],[.88,tintEye('#e3e8f1')],[1,tintEye('#b5c4d9')]]);
    const relief = svgElement('filter', {id:`${id}-eye-relief`,x:'-60%',y:'-60%',width:'240%',height:'250%','color-interpolation-filters':'sRGB'}, defs);
    svgElement('feGaussianBlur', {in:'SourceAlpha',stdDeviation:4,result:'soft-shadow'}, relief);
    eyeShadowOffset = svgElement('feOffset', {in:'soft-shadow',dx:5,dy:8,result:'offset-shadow'}, relief);
    svgElement('feFlood', {'flood-color':skin.eyeShadow || (name==='blueglaze'?'#102674':'#53759f'),'flood-opacity':.34,result:'shadow-color'}, relief);
    svgElement('feComposite', {in:'shadow-color',in2:'offset-shadow',operator:'in',result:'shadow'}, relief);
    svgElement('feOffset', {in:'SourceAlpha',dx:1,dy:2,result:'raised-edge'}, relief);
    svgElement('feFlood', {'flood-color':tintEye('#a9bad1'),result:'edge-color'}, relief);
    svgElement('feComposite', {in:'edge-color',in2:'raised-edge',operator:'in',result:'edge'}, relief);
    const merge = svgElement('feMerge', {}, relief);
    for (const source of ['shadow','edge','SourceGraphic']) svgElement('feMergeNode', {in:source}, merge);
  }

  const linear = name === 'aurora' || skin.linear;
  const base = gradient(defs, linear ? 'linearGradient' : 'radialGradient', `${id}-base`,
    linear
      ? { x1: '.05', y1: '.05', x2: '.85', y2: '.98' }
      : { cx: '.32', cy: '.17', r: '.95' },
      skin.simpleLayers ? [[0,skin.darkColor],[1,skin.darkColor]] : skin.base.map((color, index) => [index / (skin.base.length - 1), color]));
  const specular = gradient(defs, 'radialGradient', `${id}-shine`, { cx: '.30', cy: '.12', r: '.70' },
    [[0, '#fff', skin.shine], [.23, '#fff', skin.shine * .30], [.65, '#fff', .035], [1, '#fff', 0]]);
  const volume = gradient(defs, 'radialGradient', `${id}-volume`, { cx: '.43', cy: '.30', r: '.76' },
    [[0, '#091126', 0], [.58, '#091126', 0], [.82, '#091126', skin.shade * .27], [1, '#091126', skin.shade]]);
  const rim = gradient(defs, 'linearGradient', `${id}-rim`, { x1: '0', y1: '0', x2: '1', y2: '1' },
    [[0, '#fff', .95], [.28, skin.rim, .60], [.52, skin.rim, .06], [.82, skin.rim, .13], [1, skin.rim, .65]]);
  const edge = gradient(defs, 'radialGradient', `${id}-edge`, { cx: '.88', cy: '.83', r: '.55' },
    [[0, skin.rim, .25], [.65, skin.rim, .035], [1, skin.rim, 0]]);
  gradient(defs, 'radialGradient', `${id}-ground`, {},
    [[0, '#0a1020', .27], [.5, '#0a1020', .10], [1, '#0a1020', 0]]);
  const antenna = gradient(defs, 'radialGradient', `${id}-antenna`, { cx: '.28', cy: '.20', r: '.85' },
    [[0, skin.antenna[0]], [.43, skin.antenna[1]], [1, skin.antenna[2]]]);
  if (skin.pattern) texture(defs, `${id}-texture`, skin.pattern);
  const pillowFace = root.getElementById(`${id}-texture-pillow-face`);
  const pillowHighlight = root.getElementById(`${id}-texture-pillow-highlight`);
  const pillowReflection = root.getElementById(`${id}-texture-pillow-reflection`);

  const ground = svgElement('ellipse', { cx: 120, cy: 221, rx: 85, ry: 14, fill: fill('ground'), 'pointer-events': 'none' });
  svg.insertBefore(ground, root.getElementById('dragMotion'));
  const layers = svgElement('g', { 'pointer-events': 'none', 'aria-hidden': 'true' });
  head.after(layers);
  const shape = { href: '#headShape', transform: head.getAttribute('transform') };
  if (skin.pattern) svgElement('use', { ...shape, fill: fill('texture') }, layers);
  if (!skin.simpleLayers) {
  if (skin.translucent) {
    gradient(defs, 'linearGradient', `${id}-glass`, { x1: '0', y1: '0', x2: '.6', y2: '1' },
      [[0, '#fff', .6], [.14, '#fff', .03], [.77, '#fff', .02], [1, skin.glassTint || '#c5fff2', .3]]);
    svgElement('use', { ...shape, fill: fill('glass'), stroke: skin.glassRim || '#d6fff5', 'stroke-width': 5, 'stroke-opacity': skin.glassEdgeOpacity ?? .25 }, layers);
  }
  svgElement('use', { ...shape, fill: fill('shine') }, layers);
  svgElement('use', { ...shape, fill: fill('volume') }, layers);
  svgElement('use', { ...shape, fill: fill('edge') }, layers);
  svgElement('use', { ...shape, fill: 'none', stroke: fill('rim'), 'stroke-width': 1.25, opacity: skin.rimOpacity ?? (skin.matte ? .3 : 1) }, layers);
  }
  if(skin.stitched) svgElement('use',{href:'#headShape',transform:'translate(18 18) scale(.85)',fill:'none',stroke:'#ead09d','stroke-width':3,'stroke-dasharray':'6 6','stroke-linecap':'round',opacity:.9},layers);
  if(skin.edgeColor) svgElement('use',{...shape,fill:'none',stroke:skin.edgeColor,'stroke-width':7,opacity:.9},layers);

  // Existing eyelids are solid face-colored rectangles. Move the real animated
  // rectangles into luminance masks so they cut the eyes without covering paint.
  for (const side of ['left', 'right']) {
    const eye = root.getElementById(`${side}Eye`);
    const lidGroup = root.getElementById(`${side}Top`).parentElement;
    originalEyes.push({ eye, children: [...eye.children], lids: [...lidGroup.children].map(node => [node, node.style.fill]) });
    const mask = svgElement('mask', {
      id: `${id}-${side}-mask`, maskUnits: 'userSpaceOnUse', maskContentUnits: 'userSpaceOnUse',
      x: -180, y: -240, width: 360, height: 480, 'mask-type': 'luminance',
    }, defs);
    svgElement('rect', { x: -180, y: -240, width: 360, height: 480, fill: 'white' }, mask);
    for (const rect of lidGroup.children) rect.style.fill = '#000';
    mask.append(lidGroup);
    // Mask the local contents, rather than the transformed eye group itself.
    const eyePaint = svgElement('g', { mask: `url(#${id}-${side}-mask)` });
    eyePaint.append(...eye.children);
    eye.append(eyePaint);
  }

  // Love intentionally overlaps the two animated eyes into one heart. Paint
  // that union once: independent porcelain gradients and drop shadows otherwise
  // leave a seam and make one half look stacked on top of the other.
  const eyeParent = root.getElementById('leftEye').parentElement;
  const originalEyeOpacity = eyeParent.style.opacity;
  let mergedSurface;
  if (skin.raisedEyes) {
    const silhouette = svgElement('mask', {
      id: `${id}-joined-eyes`, maskUnits: 'userSpaceOnUse', maskContentUnits: 'userSpaceOnUse',
      x: 0, y: 0, width: 240, height: 240, 'mask-type': 'alpha',
    }, defs);
    for (const side of ['left', 'right']) svgElement('use', { href: `#${side}Eye` }, silhouette);
    mergedSurface = svgElement('g', { id: `${id}-joined-eye-surface`, 'pointer-events': 'none', 'aria-hidden': 'true',
      'clip-path': eyeParent.getAttribute('clip-path') || 'none' });
    eyeParent.after(mergedSurface);
    const reliefSurface = svgElement('g', { style: 'filter:var(--material-eye-relief,none)' }, mergedSurface);
    svgElement('rect', { x: 0, y: 0, width: 240, height: 240,
      fill: 'var(--material-eye,#fff)', mask: `url(#${id}-joined-eyes)` }, reliefSurface);
  }
  function mergeEyes(merged) {
    if (!mergedSurface) return;
    // Opacity on the parent hides the original paint without hiding the eye
    // nodes referenced by the union mask. Their live transforms still animate.
    eyeParent.style.opacity = merged ? '0' : originalEyeOpacity;
    mergedSurface.style.display = merged ? '' : 'none';
    if (merged) avatar.style.setProperty('--material-separate-eye-relief', 'none');
    else avatar.style.removeProperty('--material-separate-eye-relief');
  }
  const onFaceState = event => mergeEyes(event.detail?.state === 'love');
  const onActionState = event => {
    if (event.detail?.action === 'love' && event.detail.phase !== 'start') mergeEyes(false);
  };
  if (mergedSurface) {
    avatar.addEventListener('face-state', onFaceState);
    avatar.addEventListener('action-state', onActionState);
    mergeEyes(Boolean(avatar._loveFx));
  }

  const style = document.createElement('style');
  style.textContent = `
    #leftBase,#rightBase,#leftInputBase,#rightInputBase{fill:var(--material-eye,#fff)}
    #rightBase,#rightInputBase{fill:var(--material-eye-right,var(--material-eye,#fff))}
    #antennaDot{fill:var(--material-antenna);stroke:var(--material-antenna-rim);stroke-width:.7px}
    ${skin.raisedEyes ? '#leftEye,#rightEye{filter:var(--material-separate-eye-relief,var(--material-eye-relief,none))}' : ''}
  `;
  root.append(style);
  const addedDefs = [...defs.children].filter(node => !originalDefs.has(node));
  let disposed = false;
  let showOriginal = false;

  const material = {
    dispose() {
      if (disposed) return;
      disposed = true;
      avatar.removeEventListener('face-state', onFaceState);
      avatar.removeEventListener('action-state', onActionState);
      eyeParent.style.opacity = originalEyeOpacity;
      mergedSurface?.remove();
      for (const { eye, children, lids } of originalEyes) {
        eye.replaceChildren(...children);
        for (const [node, fill] of lids) node.style.fill = fill;
      }
      for (const node of addedDefs) node.remove();
      layers.remove();
      ground.remove();
      style.remove();
      if (originalFill === null) head.removeAttribute('fill');
      else head.setAttribute('fill', originalFill);
      if (originalOpacity === null) head.removeAttribute('fill-opacity');
      else head.setAttribute('fill-opacity', originalOpacity);
      for (const [key, value] of originalProperties) {
        if (value) avatar.style.setProperty(key, value);
        else avatar.style.removeProperty(key);
      }
      activeMaterials.delete(avatar);
    },
    // Only these coordinates are driven by light(), not the saved material.
    lightKeys: [
      ...(!linear ? ['base:cx','base:cy'] : skin.linear ? ['base:x1','base:x2'] : []),
      'shine:cx','shine:cy','volume:cx','volume:cy','edge:cx','edge:cy',
      'rim:x1','rim:x2','antenna:cx','antenna:cy',
      ...(skin.pillowMetal ? ['texture-pillow-face:cx','texture-pillow-face:cy',
        'texture-pillow-highlight:cx','texture-pillow-highlight:cy',
        'texture-pillow-reflection:cx','texture-pillow-reflection:cy'] : []),
    ],
    setGroundShadow(enabled) {
      groundShadow = Boolean(enabled);
      ground.style.display = !showOriginal && groundShadow ? '' : 'none';
    },
    setOriginal(original) {
      showOriginal = original;
      head.setAttribute('fill', original ? '#08090b' : fill('base'));
      head.setAttribute('fill-opacity', !original && skin.translucent ? (skin.bodyOpacity ?? .58) : 1);
      layers.style.display = original ? 'none' : '';
      ground.style.display = !original && groundShadow ? '' : 'none';
      avatar.style.setProperty('--material-eye', original ? '#fff' : skin.raisedEyes ? fill('eye-porcelain') : skin.eye);
      avatar.style.setProperty('--material-eye-right', original ? '#fff' : skin.raisedEyes ? fill('eye-porcelain') : skin.eyeRight || skin.eye);
      if (skin.raisedEyes) avatar.style.setProperty('--material-eye-relief', original ? 'none' : fill('eye-relief'));
      avatar.style.setProperty('--material-antenna', original ? '#08090b' : fill('antenna'));
      avatar.style.setProperty('--material-antenna-rim', original ? 'none' : skin.rim);
    },
    light(x, y) {
      if (pillowFace) {
        pillowFace.setAttribute('cx',.8+(x+.5)*.1);
        pillowFace.setAttribute('cy',.24+(y+.5)*.1);
        pillowHighlight.setAttribute('cx',.01+(x+.5)*.12);
        pillowHighlight.setAttribute('cy',.44+(y+.5)*.12);
        pillowReflection.setAttribute('cx',.5-(x+.5)*.15);
        pillowReflection.setAttribute('cy',.5+(y+.5)*.1);
      }
      if (eyeShadowOffset) {
        eyeShadowOffset.setAttribute('dx', -x * 8);
        eyeShadowOffset.setAttribute('dy', 5 - y * 6);
      }
      const cx = .5 + x * .30;
      const cy = .30 + y * .17;
      if (!linear) {
        base.setAttribute('cx', cx);
        base.setAttribute('cy', cy);
      } else if (skin.linear) {
        base.setAttribute('x1', .1 + x * .2);
        base.setAttribute('x2', .9 + x * .2);
      }
      specular.setAttribute('cx', cx);
      specular.setAttribute('cy', cy - .10);
      volume.setAttribute('cx', .5 + x * .12);
      volume.setAttribute('cy', .35 + y * .08);
      edge.setAttribute('cx', .5 - x * .42);
      edge.setAttribute('cy', .75 - y * .12);
      rim.setAttribute('x1', .5 + x * .5);
      rim.setAttribute('x2', .5 - x * .5);
      antenna.setAttribute('cx', cx);
      antenna.setAttribute('cy', Math.max(.1, cy));
      ground.setAttribute('cx', 120 - x * 11);
    },
  };
  material.setOriginal(false);
  material.light(-.5, -.5);
  activeMaterials.set(avatar, material);
  return material;
}


export { skins, newSkins, extraSkins, collectionSkins, sportsSkins, softSkins, revisions, removedSkins, categories, blueGlazeNames, applyMaterial };
