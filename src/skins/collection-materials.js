// Each texture here has its own SVG artwork.
const COLLECTION = new Set(['ceramicblue', 'tartan', 'argyle', 'sashiko', 'quilt', 'corduroy', 'linen', 'strawberry', 'orangepeel', 'chocolate', 'waffle', 'cookie', 'donut', 'cactus', 'raindrop', 'snowflake', 'artdeco', 'memphis', 'hexbolt', 'rivet']);

export function collectionTexture(defs,id,kind,el,gradient) {
  if (!COLLECTION.has(kind)) return null;
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
  } else if(kind==='orangepeel') {
    for(let i=0;i<85;i++) {
      const x=(i*21.3)%s,y=(i*i*17.7)%s;
      circle(x,y,1.4,'#b97129',.3);path(`M${x-1} ${y+1}h1.5`,'none','#fff0b9',.7,.5);
    }
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
  } else if(kind==='cactus') {
    for(const x of [9,36,63]) {
      path(`M${x} 0q-5 20 0 40t0 40`,'none','#547435',5,.3);
      path(`M${x+4} 0q-5 20 0 40t0 40`,'none','#edf2b6',1.5,.6);
      for(const y of [14,54]) path(`M${x-3} ${y-3}l6 6m-6 0 6-6m-3-1v8`,'none','#fff5cc',1,.85);
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
  } else if(kind==='tartan') {
    rect(0,0,s,s,'#782f42',.65);
    for(const n of [13,53]) {rect(n,0,15,s,'#224f48',.65);rect(0,n,s,15,'#224f48',.65);}
    for(const n of [8,33,48,73]) path(`M${n} 0v80M0 ${n}h80`,'none','#ead39d',.8,.7);
  } else if(kind==='argyle') {
    path('M20 0L40 40 20 80 0 40Z','#6d5b8e','none',0,.7);path('M60 0L80 40 60 80 40 40Z','#ead6de','none',0,.75);
    path('M0 0L40 80 80 0M0 80L40 0 80 80','none','#fff2d9',1,.75);
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
  } else if(kind==='memphis') {
    path('M4 18q6-10 12 0t12 0','none','#795c9b',3,.9);
    path('M48 10l16 4-10 13Z','#f2cd79');circle(19,59,7,'#88bcb3');
    path('M46 57l5-5 5 10 5-10 5 5','none','#b36284',2.5,.9);
    for(const [x,y] of [[38,35],[71,41],[6,35]]) circle(x,y,1.5,'#46526d');
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
  } else if(kind==='ceramicblue') {
    for(const [x,y] of [[20,22],[61,61]]) {
      const g=el('g',{transform:`translate(${x} ${y})`},p);
      for(let i=0;i<6;i++) el('ellipse',{cx:0,cy:-6,rx:3,ry:7,fill:'#4c7097',opacity:.8,transform:`rotate(${i*60})`},g);
      circle(0,0,2,'#e5ebdf',1,g);
      path('M5 14Q22 28 18 40M10 22q10-13 15-3q-3 8-15 3','none','#416d94',1.2,.9,g);
    }
  }
  return p;
}
