// Paints the material skins: glazes, frosted glass, metals, wood, fabrics,
// sweets and the rest. Each material is a base paint, light layers and an
// optional texture drawn by one of the texture modules.
import { MATERIALS as skins } from './material-data.js';
import { extraTexture } from './more-materials.js';
import { collectionTexture } from './collection-materials.js';
import { revisionTexture } from './revised-materials.js';
import { secondPassTexture } from './second-pass-materials.js';
import { sportsTexture } from './sports-materials.js';
import { softTexture } from './soft-materials.js';
import { layerDefaults } from './layered-texture.js';

const NS = 'http://www.w3.org/2000/svg';

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
  } else if (kind === 'terrazzo') {
    const colors=['#a47d73','#789b91','#d3a963','#a9a1b8','#e0b2a4'];
    for(let i=0;i<24;i++) {
      const x=(i*29.17)%80,y=(i*i*13.31)%80,s=3+(i%4)*1.4;
      svgElement('path',{d:`M${x} ${y}l${s} ${s*.4} ${-s*.3} ${s} ${-s*.9} ${-s*.3}Z`,fill:colors[i%colors.length],opacity:.75},pattern);
    }
  } else if (kind === 'seeds') {
    for(const [cx,cy,angle] of [[13,13,-20],[39,39,25]]) svgElement('ellipse',{cx,cy,rx:1.5,ry:3.2,fill:'#824248',opacity:.75,transform:`rotate(${angle} ${cx} ${cy})`},pattern);
  } else if (kind === 'blueprint') {
    for(let p=0;p<=80;p+=10) svgElement('path',{d:`M${p} 0v80M0 ${p}h80`,stroke:'#d0eeff','stroke-width':p%40===0?.7:.35,opacity:p%40===0?.37:.18},pattern);
    svgElement('circle',{cx:40,cy:40,r:21,fill:'none',stroke:'#dbf3ff','stroke-width':.6,opacity:.36},pattern);
    svgElement('path',{d:'M10 10h12m-6-6v12M60 63h12m-6-6v12',stroke:'#dbf3ff','stroke-width':.8,opacity:.55},pattern);
  }
  return pattern;
}

// Paints one material over the avatar and returns how to light and remove it.
// The skin module masks the eyelids beforehand, so they already cut the eyes.
export function applyMaterial(avatar, name) {
  const skin = skins[name];
  const root = avatar.shadowRoot;
  const defs = root.querySelector('svg defs');
  const head = root.getElementById('head');
  const originalDefs = new Set(defs.children);
  const originalFill = head.getAttribute('fill');
  const originalOpacity = head.getAttribute('fill-opacity');
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
  const antenna = gradient(defs, 'radialGradient', `${id}-antenna`, { cx: '.28', cy: '.20', r: '.85' },
    [[0, skin.antenna[0]], [.43, skin.antenna[1]], [1, skin.antenna[2]]]);
  if (skin.pattern) texture(defs, `${id}-texture`, skin.pattern);

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

  const material = {
    dispose() {
      if (disposed) return;
      disposed = true;
      avatar.removeEventListener('face-state', onFaceState);
      avatar.removeEventListener('action-state', onActionState);
      eyeParent.style.opacity = originalEyeOpacity;
      mergedSurface?.remove();
      for (const node of addedDefs) node.remove();
      layers.remove();
      style.remove();
      if (originalFill === null) head.removeAttribute('fill');
      else head.setAttribute('fill', originalFill);
      if (originalOpacity === null) head.removeAttribute('fill-opacity');
      else head.setAttribute('fill-opacity', originalOpacity);
      for (const [key, value] of originalProperties) {
        if (value) avatar.style.setProperty(key, value);
        else avatar.style.removeProperty(key);
      }
    },
    // Only these coordinates are driven by light(), not the saved material.
    lightKeys: [
      ...(!linear ? ['base:cx','base:cy'] : skin.linear ? ['base:x1','base:x2'] : []),
      'shine:cx','shine:cy','volume:cx','volume:cy','edge:cx','edge:cy',
      'rim:x1','rim:x2','antenna:cx','antenna:cy',
    ],
    light(x, y) {
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
    },
  };
  head.setAttribute('fill', fill('base'));
  head.setAttribute('fill-opacity', skin.translucent ? (skin.bodyOpacity ?? .58) : 1);
  avatar.style.setProperty('--material-eye', skin.raisedEyes ? fill('eye-porcelain') : skin.eye);
  avatar.style.setProperty('--material-eye-right', skin.raisedEyes ? fill('eye-porcelain') : skin.eyeRight || skin.eye);
  if (skin.raisedEyes) avatar.style.setProperty('--material-eye-relief', fill('eye-relief'));
  avatar.style.setProperty('--material-antenna', fill('antenna'));
  avatar.style.setProperty('--material-antenna-rim', skin.rim);
  material.light(-.5, -.5);
  return material;
}


export { skins };
