import { skin } from './more-materials.js';

export const woodSkins = {
  woodmaple:skin('浅枫木','PALE MAPLE','奶油浅木 · 细密柔纹 · 温润哑光',
    ['#f7e8ca','#e4c999','#c9a575','#a87d50'],'#62492d','#f3e0b8',['#f2eee6','#e1dbcf'],
    {number:156,pattern:'woodmaple',minimalControls:true,matte:true,shine:.075,shade:.12,
      antenna:['#fff1d2','#d7b585','#997146']}),
  woodoak:skin('暖橡木','WARM OAK','蜂蜜木色 · 山形纹理 · 开放木孔',
    ['#efd3a0','#cea065','#ad7844','#82532e'],'#503522','#e7c594',['#f2eee6','#e1dbcf'],
    {number:157,pattern:'woodoak',minimalControls:true,matte:true,shine:.085,shade:.16,
      antenna:['#f6dfb4','#c99b60','#84552f']}),
  woodwalnut:skin('深胡桃木','DARK WALNUT','巧克力棕 · 弯曲木纹 · 自然木结',
    ['#b58d67','#865b3c','#5e3b28','#38251c'],'#f5e7cc','#c9a27c',['#eeeae4','#dcd6ce'],
    {number:158,pattern:'woodwalnut',minimalControls:true,matte:true,shine:.11,shade:.2,
      antenna:['#d9b28b','#8b6143','#432d21']}),
  woodrose:skin('红木','ROSEWOOD','暖红棕色 · 交错长纹 · 柔亮木蜡',
    ['#cf9376','#a65d42','#773d2c','#48251e'],'#f8e8d2','#d9a48a',['#f0e9e3','#ded3cb'],
    {number:159,pattern:'woodrose',minimalControls:true,matte:true,shine:.15,shade:.19,
      antenna:['#e2b39a','#aa674b','#582d23']}),
  woodebony:skin('黑檀木','EBONY','深黑褐底 · 金棕细纹 · 细腻缎光',
    ['#696052','#42382d','#2a221c','#171411'],'#f2e7d2','#8c7a60',['#eceae6','#d8d5ce'],
    {number:160,pattern:'woodebony',minimalControls:true,matte:true,shine:.12,shade:.23,
      antenna:['#b0a08a','#554636','#241c17']}),
};

const grainStyles = {
  woodmaple:{seed:17,dark:'#a17849',light:'#fff0cd',sway:3.5,bend:5,knotX:64,knotY:163,pores:32},
  woodoak:{seed:29,dark:'#70451e',light:'#ffe3ad',sway:5,bend:22,knotX:142,knotY:93,pores:112,cathedral:true},
  woodwalnut:{seed:43,dark:'#2e1a11',light:'#d8ac79',sway:9,bend:29,knotX:68,knotY:165,pores:78,knot:true},
  woodrose:{seed:59,dark:'#481b13',light:'#edb487',sway:6,bend:13,knotX:176,knotY:66,pores:65,slant:.09},
  woodebony:{seed:73,dark:'#090806',light:'#bb9360',sway:2,bend:3,knotX:190,knotY:135,pores:48},
};

export function woodTexture(defs,id,kind,el,gradient) {
  const grain = grainStyles[kind];
  if (!grain) return null;
  const pattern = el('pattern',{id,width:240,height:240,patternUnits:'userSpaceOnUse'},defs);
  let seed = grain.seed;
  const random = () => {
    seed = (Math.imul(seed,1664525)+1013904223) >>> 0;
    return seed/4294967296;
  };
  gradient(defs,'linearGradient',`${id}-wood-grain`,{x1:'0',y1:'0',x2:'1',y2:'.65'},
    [[0,grain.dark,.45],[.45,grain.dark,.7],[1,grain.dark,.52]]);
  gradient(defs,'linearGradient',`${id}-wood-fiber`,{x1:'.1',y1:'0',x2:'.9',y2:'1'},
    [[0,grain.light,.3],[.5,grain.light,.17],[1,grain.light,.26]]);
  const dark = `url(#${id}-wood-grain)`, light = `url(#${id}-wood-fiber)`;
  // Small deterministic warping breaks mechanical stripes without making the
  // grain move when the light, expression, or editor preview changes.
  const warp = el('filter',{id:`${id}-wood-warp`,x:'-10%',y:'-10%',width:'120%',height:'120%'},defs);
  el('feTurbulence',{type:'fractalNoise',baseFrequency:'.045 .018',numOctaves:2,seed:grain.seed,result:'grain-noise'},warp);
  el('feDisplacementMap',{in:'SourceGraphic',in2:'grain-noise',scale:1.6,xChannelSelector:'R',yChannelSelector:'G'},warp);
  const fibers = el('g',{filter:`url(#${id}-wood-warp)`},pattern);
  const stroke = (d,paint,width,opacity,target=fibers) => el('path',{
    d,fill:'none',stroke:paint,'stroke-width':width,opacity,
    'stroke-linecap':'round','stroke-linejoin':'round',
  },target);
  const flow = (x,y,phase) => {
    const distance = x-grain.knotX;
    const aroundKnot = Math.sign(distance)*grain.bend*Math.exp(-Math.abs(distance)/35)
      * Math.exp(-(((y-grain.knotY)/48)**2));
    return x + Math.sin(y*.023+phase)*grain.sway + Math.sin(y*.057+phase*.7)*grain.sway*.22
      + aroundKnot + (grain.slant || 0)*(y-120);
  };
  for (let index=0;index<122;index++) {
    const x = -26+index*2.45+random()*1.4, phase = x*.024+random()*.45;
    let d = '';
    for (let y=-24;y<=264;y+=12) d += `${y === -24 ? 'M' : 'L'}${flow(x,y,phase).toFixed(2)} ${y}`;
    if (index%9 === 0) stroke(d,dark,2.2+random()*3.5,.08+random()*.09);
    stroke(d,index%5 === 0 ? light : dark,.3+random()*.55,.18+random()*.42);
  }
  if (grain.cathedral) {
    for (let index=0;index<15;index++) {
      const width = 8+index*3.8, top = 145-index*7.3, cx = grain.knotX+Math.sin(index*.8)*2;
      stroke(`M${cx-width} 258 C${cx-width*1.18} 201 ${cx-width*.72} ${top+19} ${cx} ${top}
        C${cx+width*.7} ${top+21} ${cx+width*1.14} 202 ${cx+width} 258`,dark,
        index%4 === 0 ? 1.2 : .55,.21+random()*.18);
    }
  }
  if (grain.knot) {
    for (let index=0;index<6;index++) {
      const rx = 2+index*2.3, ry = 5+index*5.4, cx = grain.knotX, cy = grain.knotY;
      stroke(`M${cx} ${cy-ry} C${cx+rx*1.3} ${cy-ry*.5} ${cx+rx} ${cy+ry*.6} ${cx} ${cy+ry}
        C${cx-rx*.85} ${cy+ry*.55} ${cx-rx*1.2} ${cy-ry*.6} ${cx} ${cy-ry}Z`,dark,.6,.46-index*.045);
    }
  }
  for (let index=0;index<grain.pores;index++) {
    const x = 20+random()*200, y = 28+random()*180, length = 1.2+random()*5.8;
    stroke(`M${x} ${y}q${(random()-.5)*1.4} ${length/2} ${(random()-.5)*1.4} ${length}`,dark,.4+random()*.45,.12+random()*.3);
  }
  return pattern;
}
