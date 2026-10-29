import { createLayerTexture } from './layered-texture.js';
import { metalTint } from './metal-tint.js';
import { woodTexture } from './wood-materials.js';

// Match the added inner shadow to each material's existing depth. Weighted
// glass already has a dark lower layer, so its extra reflection stays softer.
const translucentShadowStrength = {
  clearwhite:.20, clearpale:.32, clearsilver:.46,
  clearweighted:.40, clearhard:.42, clearsmoke:.68, clearink:1,
};

const SOFT = new Set(['blackglaze', 'blueglaze', 'jadeglaze', 'berryglaze', 'amberglaze', 'irisglaze', 'iceglaze', 'mintice', 'blushice', 'champagneice', 'lavenderice', 'whiteice', 'clearsilver', 'clearweighted', 'clearhard', 'silverdrop', 'woodmaple', 'woodoak', 'woodwalnut', 'woodrose', 'woodebony', 'matcharib']);
// Glazes are drawn as layered ribbons; wood has its own module.
const LAYERED = new Set(['blackglaze', 'blueglaze', 'jadeglaze', 'berryglaze', 'amberglaze', 'irisglaze', 'iceglaze', 'mintice', 'blushice', 'champagneice', 'lavenderice', 'whiteice']);
const WOOD = new Set(['woodmaple', 'woodoak', 'woodwalnut', 'woodrose', 'woodebony']);
// Gold and copper share silver's texture, tinted.
const METAL_FAMILY = { golddrop: 'gold', copperdeep: 'copper' };

export function softTexture(defs, id, kind, el, gradient) {
  if (!SOFT.has(kind)) return null;
  if (WOOD.has(kind)) return woodTexture(defs,id,kind,el,gradient);
  if (LAYERED.has(kind)) return createLayerTexture(defs,id,kind,el,gradient);
  const p = el('pattern', {id,width:240,height:240,patternUnits:'userSpaceOnUse'}, defs);
  const path = (d, stroke, width=1, fill='none', opacity=1) =>
    el('path', {d,stroke,'stroke-width':width,fill,opacity,'stroke-linecap':'round','stroke-linejoin':'round'}, p);
  const metalFamily = METAL_FAMILY[id.replace(/^material-/, '').replace(/-texture$/, '')];
  const radial = (name, stops, attrs={}) => {
    const palette = metalFamily ? stops.map(([offset,color,opacity=1]) => [offset,metalTint(color,metalFamily),opacity]) : stops;
    gradient(defs, 'radialGradient', `${id}-${name}`, {cx:'.35',cy:'.25',r:'.8',...attrs}, palette);
    return `url(#${id}-${name})`;
  };
  const shine = (name, stops) => {
    gradient(defs, 'linearGradient', `${id}-${name}`, {x1:'0',y1:'0',x2:'.3',y2:'1'}, stops);
    return `url(#${id}-${name})`;
  };
  if (kind === 'matcharib') {
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
