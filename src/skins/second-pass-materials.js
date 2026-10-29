// The compositions this module draws, by texture name without its prefix.
const SECOND = new Set(['knit', 'kiwi', 'lemon', 'cloud', 'chevron']);

export function secondPassTexture(defs,id,kind,el,gradient) {
  if (!kind.startsWith('second-')) return null;
  const name=kind.slice(7);
  if (!SECOND.has(name)) return null;
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
  if(name==='knit') {
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
  } else if(name==='cloud') {
    gradient(defs,'linearGradient',`${id}-cloudcap`,{x1:'0',y1:'0',x2:'0',y2:'1'},[[0,'#fff',1],[.55,'#f6fcff',1],[1,'#cbdfed',.95]]);
    path('M-5-5H245V60C227 76 209 74 197 62C184 87 154 81 148 65C129 88 107 82 101 67C80 91 52 82 49 66C28 80 7 72-5 62Z',`url(#${id}-cloudcap)`);
    glow('haze','#e9f8ff',.37,35,204,69,23);
  } else if(name==='chevron') {
    for(let y=-30;y<270;y+=24)for(let x=-30;x<270;x+=60){
      const row=Math.round((y+30)/24),c=row%6===0?'#ac7865':row%3===0?'#c6a76c':'#678e86';
      path(`M${x} ${y}l30 16v15l-30-16Z`,c,'none',0,.9);
      path(`M${x+30} ${y+16}l30-16v15l-30 16Z`,row%6===0?'#c4937c':'#9db3a2','none',0,.9);
    }
    for(let y=0;y<240;y+=2.5)path(`M0 ${y}H240`,'none','#f9eccd',.45,.18);
  }
  return p;
}
