// Full-face compositions use the existing 240-unit SVG coordinate system.
// Keep dense decoration away from the eyes (roughly x 60–180, y 95–155).
// The compositions this module draws, by texture name without its prefix.
const REVISED = new Set(['cow', 'dragonfruit', 'camo']);

export function revisionTexture(defs,id,kind,el,gradient) {
  if (!kind.startsWith('revised-')) return null;
  const name=kind.slice(8);
  if (!REVISED.has(name)) return null;
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
  if(name==='cow') {
    for(const d of ['M-10 2H88C99 15 73 28 70 44S37 43 31 65 5 97-10 71Z','M176-5C161 17 176 35 195 39S204 76 237 86V-5Z','M-8 162C12 148 33 170 42 177S65 169 77 187 47 219 62 247H-8Z','M176 208C177 190 204 174 222 181S251 202 237 240H193Z'])path(d,'#30343c');
    ellipse(160,44,8,5,'#30343c');
  } else if(name==='camo') {
    for(const [d,c] of [
      ['M-5-5H126C113 11 87 16 81 37S43 46 44 67 2 82-5 63Z','#c1b690'],
      ['M138-5H245V96C218 90 227 60 200 65S158 43 172 27 155 17 138-5Z','#506b4c'],
      ['M-5 119C24 103 38 124 43 145S81 147 72 177 109 212 92 245H-5Z','#466149'],
      ['M137 183C138 157 163 166 180 157S195 124 225 133L245 128V245H156C176 225 133 212 137 183Z','#c0b38e'],
      ['M180 235Q198 203 220 206T245 189V245Z','#384e3b'],
    ])path(d,c,'none',0,.9);
    noise(170,['#e6dcc3','#2a4533'],.1);
  } else if(name==='dragonfruit') {
    el('use',{href:'#headShape',fill:'none',stroke:'#f2a0c0','stroke-width':11,opacity:.8},p);
    for(let i=0;i<105;i++) {
      const x=25+(i*71.71)%190,y=25+(i*i*37.17)%190;
      if(y>92&&y<159&&x>51&&x<184)continue;
      el('ellipse',{cx:x,cy:y,rx:.9,ry:1.7,fill:'#424044',opacity:.8,transform:`rotate(${i*59} ${x} ${y})`},p);
    }
    noise(140,['#fff','#bac2bc'],.13);
  }
  return p;
}
