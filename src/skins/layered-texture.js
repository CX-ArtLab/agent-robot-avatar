import { glazeVariants } from './glaze-variants.js';
const arcLayers = ['main','secondary','reflection'];
const defaults = {"baseColor": "#253bb9", "bodyColor": "#359ee5", "bodyEndColor": "#2451c9", "bodyGradientStrength": 50, "bodyGradientAngle": 90, "bodyGradientRange": 100, "bodyX": 129, "bodyY": 104, "bodyWidth": 190, "bodyHeight": 166, "bodyBlur": 12, "bodyOpacity": 100, "mainColor": "#ffffff", "mainInset": 10, "mainWidth": 8, "mainStart": 85, "mainLength": 12, "mainFadeRange": 35, "mainFadeStrength": 100, "mainBlur": 1, "mainOpacity": 95, "secondaryColor": "#dbf1ff", "secondaryInset": 5, "secondaryWidth": 4, "secondaryStart": 66, "secondaryLength": 17, "secondaryFadeRange": 35, "secondaryFadeStrength": 100, "secondaryBlur": 1.5, "secondaryOpacity": 30, "reflectionColor": "#a8c7ff", "reflectionInset": 7, "reflectionWidth": 16, "reflectionStart": 26, "reflectionLength": 20, "reflectionFadeRange": 35, "reflectionFadeStrength": 100, "reflectionBlur": 3, "reflectionOpacity": 60, "edgeColor": "#d5efff", "edgeWidth": 4, "edgeBlur": 1.5, "edgeOpacity": 55, "eyeColor": "#ffffff"};
export function matchingIceEyeColor(values) {
  const color = values.baseColor || values.bodyColor || '#94afd0';
  const [r,g,b] = [1,3,5].map(offset => parseInt(color.slice(offset,offset+2),16)/255);
  const max = Math.max(r,g,b), min = Math.min(r,g,b), delta = max-min;
  const lightness = (max+min)/2;
  let hue = 0;
  if (delta) hue = max === r ? ((g-b)/delta+6)%6 : max === g ? (b-r)/delta+2 : (r-g)/delta+4;
  const saturation = delta < .025 ? .08 : Math.max(.24,Math.min(.55,delta/(1-Math.abs(2*lightness-1))));
  // Keep the body's hue while lowering lightness for readable, colored eyes.
  const chroma = (1-Math.abs(2*.31-1))*saturation;
  const x = chroma*(1-Math.abs(hue%2-1)), m = .31-chroma/2;
  const rgb = [[chroma,x,0],[x,chroma,0],[0,chroma,x],[0,x,chroma],[x,0,chroma],[chroma,0,x]][Math.floor(hue)];
  return '#' + rgb.map(value => Math.round((value+m)*255).toString(16).padStart(2,'0')).join('');
}

export function layerDefaults(name) {
  const values = {...defaults};
  if ((glazeVariants[name]?.source || name) === 'iceglaze') Object.assign(values, {
    baseColor:'#94afd0',bodyColor:'#d4e3f3',bodyEndColor:'#b4cbe3',bodyGradientStrength:0,reflectionColor:'#edf7ff',edgeColor:'#f3f8ff',
  });
  Object.assign(values,glazeVariants[name]?.palette);
  if (['iceglaze','mintice','blushice','champagneice'].includes(name)) values.eyeColor = matchingIceEyeColor(values);
  return values;
}

// Build only the requested arc, with a tapered silhouette and opacity gradient.
// Short adjoining patches let the gradient follow the bend, even across 0%.
// This avoids repeated SVG dashes and a uniform bright line with blunt ends.
function drawRibbon(layer, shape, values, key) {
  const doc = layer.ownerDocument;
  const ns = 'http://www.w3.org/2000/svg';
  const fragment = doc.createDocumentFragment();
  const make = (tag,attrs,parent) => {
    const node = doc.createElementNS(ns,tag);
    for (const [name,value] of Object.entries(attrs)) node.setAttribute(name,value);
    parent.append(node);
    return node;
  };
  const span = values[`${key}Length`] / 100;
  const total = shape.getTotalLength();
  const start = values[`${key}Start`] / 100;
  const fadeRange = values[`${key}FadeRange`] / 100;
  const strength = values[`${key}FadeStrength`] / 100;
  const fade = t => {
    const distance = Math.min(t,1-t);
    const u = fadeRange > 0 ? Math.min(1,Math.max(0,distance / fadeRange)) : 1;
    return 1-strength + strength*u*u*(3-2*u);
  };
  const at = length => shape.getPointAtLength(((length % total) + total) % total);
  const point = t => at((start+t*span)*total);
  const pieces = Math.max(1,Math.ceil(span*8));
  const defs = make('defs',{},fragment);
  for (let i=0;i<pieces;i++) {
    const a = i/pieces, b = (i+1)/pieces;
    const first = point(a), last = point(b);
    const gradientId = `${layer.id}-fade-${i}`;
    const paint = make('linearGradient',{id:gradientId,gradientUnits:'userSpaceOnUse',x1:first.x,y1:first.y,x2:last.x,y2:last.y},defs);
    for (let j=0;j<=8;j++) make('stop',{offset:j/8,'stop-color':values[`${key}Color`],'stop-opacity':fade(a+(b-a)*j/8)},paint);
    const outer = [], inner = [];
    const steps = Math.max(8,Math.ceil(total*span/pieces/3));
    for (let j=0;j<=steps;j++) {
      const t = a+(b-a)*j/steps, distance = (start+t*span)*total;
      const center = point(t), before = at(distance-.4), after = at(distance+.4);
      const dx = after.x-before.x, dy = after.y-before.y;
      const magnitude = Math.hypot(dx,dy) || 1;
      const halfWidth = values[`${key}Width`] / 2 * (.15+.85*Math.sqrt(fade(t)));
      outer.push(`${center.x+dy/magnitude*halfWidth} ${center.y-dx/magnitude*halfWidth}`);
      inner.push(`${center.x-dy/magnitude*halfWidth} ${center.y+dx/magnitude*halfWidth}`);
    }
    make('path',{d:`M${outer.join('L')}L${inner.reverse().join('L')}Z`,fill:`url(#${gradientId})`},fragment);
  }
  layer.replaceChildren(fragment);
}

function setLayers(get, values, shape) {
  const body = get('body');
  const sx = values.bodyWidth / 200, sy = values.bodyHeight / 200;
  body.setAttribute('transform',`translate(${values.bodyX-120*sx} ${values.bodyY-120*sy}) scale(${sx} ${sy})`);
  const paint = get('body-paint');
  const angle = values.bodyGradientAngle * Math.PI / 180;
  const radius = values.bodyGradientRange / 200;
  paint.setAttribute('x1',.5-Math.cos(angle)*radius);
  paint.setAttribute('y1',.5-Math.sin(angle)*radius);
  paint.setAttribute('x2',.5+Math.cos(angle)*radius);
  paint.setAttribute('y2',.5+Math.sin(angle)*radius);
  const strength = values.bodyGradientStrength / 100;
  const endColor = '#' + [1,3,5].map(offset => {
    const from = parseInt(values.bodyColor.slice(offset,offset+2),16);
    const to = parseInt(values.bodyEndColor.slice(offset,offset+2),16);
    return Math.round(from+(to-from)*strength).toString(16).padStart(2,'0');
  }).join('');
  paint.firstElementChild.setAttribute('stop-color',values.bodyColor);
  paint.lastElementChild.setAttribute('stop-color',endColor);
  body.setAttribute('opacity',values.bodyOpacity / 100);
  get('body-blur').firstElementChild.setAttribute('stdDeviation',values.bodyBlur);
  for (const key of arcLayers) {
    const layer = get(key);
    const scale = 1 - values[`${key}Inset`] / 100;
    const offset = 120 * (1 - scale);
    const length = values[`${key}Length`];
    layer.setAttribute('transform',`translate(${offset} ${offset}) scale(${scale})`);
    layer.setAttribute('opacity',length <= 0 ? 0 : values[`${key}Opacity`] / 100);
    drawRibbon(layer,shape,values,key);
    get(`${key}-blur`).firstElementChild.setAttribute('stdDeviation',values[`${key}Blur`]);
  }
  const edge = get('edge');
  edge.setAttribute('stroke',values.edgeColor);
  edge.setAttribute('stroke-width',values.edgeWidth);
  edge.setAttribute('opacity',values.edgeOpacity / 100);
  get('edge-blur').firstElementChild.setAttribute('stdDeviation',values.edgeBlur);
}

export function createLayerTexture(defs,id,name,el,gradient) {
  const values = layerDefaults(name);
  const shape = defs.querySelector('#headShape');
  const p = el('pattern',{id,width:240,height:240,patternUnits:'userSpaceOnUse'},defs);
  const nodes = new Map();
  const add = (key,tag,attrs,parent) => {
    const node = el(tag,{id:`${id}-${key}`,...attrs},parent);
    nodes.set(key,node);
    return node;
  };
  const blur = key => {
    const filter = add(`${key}-blur`,'filter',{filterUnits:'userSpaceOnUse',x:-200,y:-200,width:640,height:640,'color-interpolation-filters':'sRGB'},defs);
    el('feGaussianBlur',{stdDeviation:0},filter);
    return `url(#${id}-${key}-blur)`;
  };
  const bodyPaint = gradient(defs,'linearGradient',`${id}-body-paint`,{},[[0,values.bodyColor],[1,values.bodyEndColor]]);
  nodes.set('body-paint',bodyPaint);
  add('body','use',{href:'#headShape',fill:`url(#${id}-body-paint)`,filter:blur('body')},p);
  for (const key of arcLayers) {
    add(key,'g',{filter:blur(key)},p);
  }
  add('edge','use',{href:'#headShape',fill:'none',filter:blur('edge')},p);
  setLayers(key => nodes.get(key),values,shape);
  p._layerValues = values;
  // Keep the curved highlights attached to the animated head during squeezing.
  const observer = new MutationObserver(() => {
    if (!p.isConnected) { observer.disconnect(); return; }
    for (const key of arcLayers) drawRibbon(nodes.get(key),shape,p._layerValues,key);
  });
  observer.observe(shape,{attributes:true,attributeFilter:['d']});
  return p;
}
