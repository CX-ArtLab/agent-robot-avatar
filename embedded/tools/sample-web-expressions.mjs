// Extract geometric keyframes from the actual project Web action/draw methods.
// No browser, screenshot, AI redraw or bitmap animation is used by the device.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';

const root=fileURLToPath(new URL('../../',import.meta.url));
const sourceNames=['core','extension-host','actions','waiting','wrap','failure','inspect','love','random'];
const hash=createHash('sha256');
for(const name of sourceNames)hash.update(await readFile(join(root,`src/agent-robot-avatar-${name}.js`)));
const sourceHash=hash.digest('hex');
let clock=0;
Object.defineProperty(globalThis,'performance',{value:{now:()=>clock},configurable:true});
globalThis.CustomEvent=class {constructor(type,options){this.type=type;this.detail=options?.detail;}};
const {default:Avatar}=await import('../../src/agent-robot-avatar-core.js');
for(const name of ['actions','waiting','failure','inspect','love','random'])await import(`../../src/agent-robot-avatar-${name}.js`);
const NEUTRAL={w:54,h:58,rx:27,topY:-36,bottomY:36,topAL:0,topAR:0,bottomAL:0,bottomAR:0,scale:1};
class Node {
  attrs=new Map();style={};
  setAttribute(name,value){this.attrs.set(name,String(value));}
  getAttribute(name){return this.attrs.get(name)??null;}
  getAnimations(){return [];}
}
function identity(){return [1,0,0,1,0,0];}
function multiply(a,b){return [a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]];}
function transform(text){
  let matrix=identity();
  for(const match of text.matchAll(/(translate|scale|rotate)\(([^)]+)\)/g)){
    const v=match[2].trim().split(/[ ,]+/).map(Number);let next;
    if(match[1]==='translate')next=[1,0,0,1,v[0],v[1]||0];
    if(match[1]==='scale')next=[v[0],0,0,v[1]??v[0],0,0];
    if(match[1]==='rotate'){
      const angle=v[0]*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle);
      next=[c,s,-s,c,0,0];
      if(v.length===3)next=multiply(multiply([1,0,0,1,v[1],v[2]],next),[1,0,0,1,-v[1],-v[2]]);
    }
    matrix=multiply(matrix,next);
  }return matrix;
}
function makeInstance(){
  const face=Object.create(Avatar.prototype),waits=[];
  Object.assign(face,{
    _state:'idle',_pose:{...NEUTRAL},_fromPose:{...NEUTRAL},_toPose:{...NEUTRAL},_morphStart:0,_morphDuration:0,
    _morphEase:t=>t,_look:{x:0,y:0},_eyeMicro:{lX:0,lY:0,rX:0,rY:0},_blink:1,_transitionToken:0,
    _wander:{x:0,y:0},_wanderTarget:{x:0,y:0},_nextWanderAt:Infinity,
    _pointer:{active:false,lastMove:0,x:0,y:0,influence:0},_pendingWaits:new Map(),
    _dragJelly:{pullX:0,pullY:0,active:false,returning:false},_sleeping:false,
    _headMotion:new Node(),_resumeFrames(){},noteActivity(){},dispatchEvent(){},getAttribute(){return 'full';},
    _wait(ms){return new Promise(resolve=>waits.push({at:clock+ms,resolve}));},_cancelPendingWaits(){},
  });
  // Only head animation is omitted: it is not part of the eye-only product.
  face._animateHead=()=>null;
  for(const side of ['left','right'])for(const part of ['Eye','Base','InputBase','Top','Bottom'])face['_'+side+part]=new Node();
  return {face,waits};
}
function eyeParameters(face,side){
  const eye=face['_'+side+'Eye'],base=face['_'+side+'Base'],input=face['_'+side+'InputBase'];
  const isInput=Number(input.getAttribute('opacity'))>0;
  const selected=isInput?input:base;
  const read=(node,key,fallback=0)=>Number(node.getAttribute(key)??fallback);
  const m=transform(eye.getAttribute('transform')||'');
  const sx=Math.hypot(m[0],m[1]),sy=Math.hypot(m[2],m[3]);
  const cx=isInput?read(input,'x')+read(input,'width')/2:read(base,'cx');
  const cy=isInput?read(input,'y')+read(input,'height')/2:read(base,'cy');
  let rx=isInput?read(input,'width')/2:read(base,'rx');
  let ry=isInput?read(input,'height')/2:read(base,'ry');
  // Preserve cursor blinking through a separate native on/off flag at runtime.
  if(face._state==='input'&&!isInput){rx=face._pose.w/2;ry=face._pose.h/2;}
  const top=face['_'+side+'Top'],bottom=face['_'+side+'Bottom'];
  const angle=node=>Number((node.getAttribute('transform')||'').match(/rotate\(([^ ]+)/)?.[1]||0)*Math.PI/180;
  const topEdge=read(top,'y')+read(top,'height'),bottomEdge=read(bottom,'y');
  const inputShape=face._state==='input';
  return [m[0]*cx+m[2]*cy+m[4]-40,m[1]*cx+m[3]*cy+m[5]-76,rx*sx,ry*sy,
    Math.atan2(m[1],m[0])*180/Math.PI,(topEdge-cy)*sy,(bottomEdge-cy)*sy,
    Math.tan(angle(top))*sy/(sx||1),Math.tan(angle(bottom))*sy/(sx||1),inputShape?3*sx:-1];
}
const actions=['idle','bored','waiting','waiting-wrap','input','send','success','failure','warning','inspect','blocked','error','surprise','love','random','sleep','wake'];
// Fixed-rate GEOMETRY samples (20 ms), not image frames. Keep source delays,
// poses and timing intact; host gaze and automatic blinking remain procedural.
const limits=[0,4000,3320,2520,800,1400,2000,2800,3900,7300,2000,1850,1800,3200,2600,3400,800];
const scales=[100,100,100,100,100,100,100,4096,4096,100];
const clips=[];
const visual=[];
const checkpoints=new Set([0,100,300,600,900,1200,1500,1800,2200,2500,3000,3300,4000,5000,6000,6500]);
function sourceSVG(face) {
  const attributes=node=>[...node.attrs].map(([name,value])=>`${name}="${value}"`).join(' ');
  const group=side=>`<g ${attributes(face['_'+side+'Eye'])}><ellipse fill="white" ${attributes(face['_'+side+'Base'])}/><rect fill="white" ${attributes(face['_'+side+'InputBase'])}/><g clip-path="url(#mask)"><rect x="-70" width="140" fill="black" ${attributes(face['_'+side+'Top'])}/><rect x="-70" width="140" fill="black" ${attributes(face['_'+side+'Bottom'])}/></g></g>`;
  // Eye geometry is the actual original DOM output. Only the head/antenna and
  // their outer head silhouette clip are omitted for the eye-only product.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" fill="black"/><defs><clipPath id="mask"><rect x="-40" y="-54" width="80" height="108"/></clipPath></defs><g transform="translate(-60 -109) scale(1.5)">${group('left')}${group('right')}</g></svg>`;
}
for(let action=0;action<actions.length;action++){
  clock=0;const {face,waits}=makeInstance();
  if(actions[action]==='wake'){
    face._state='sleep';face._sleeping=true;
    face._pose={...NEUTRAL,w:62,h:10,rx:2,topY:-20,bottomY:20};
    face._fromPose={...face._pose};face._toPose={...face._pose};
  }
  if(actions[action]==='waiting')face.startWaiting();
  else if(actions[action]==='waiting-wrap')face.startWaiting({variant:'wrap'});
  else face.play(actions[action]);
  for(let i=0;i<12;i++)await Promise.resolve();
  const samples=[];let last=0,endedAt=null;
  for(let t=0;t<=limits[action];t+=10){
    clock=t;face._updateMorph(t);face._updateLook(t,t-last);last=t;
    let due;
    while((due=waits.findIndex(wait=>wait.at<=t))>=0){const [wait]=waits.splice(due,1);wait.resolve();for(let i=0;i<12;i++)await Promise.resolve();}
    face._updateMorph(t);face._draw(t);
    if(checkpoints.has(t))visual.push({action:actions[action],elapsed:t,svg:sourceSVG(face)});
    if(t%20===0)samples.push([...eyeParameters(face,'left'),...eyeParameters(face,'right')]);
    if(t>0&&!waits.length&&!face._boredRoutine&&face._state==='idle'&&!face._loveFx&&!face._randomFx&&!face._warningFx&&!face._inspectFx&&endedAt===null)endedAt=t;
  }
  clips.push({action:actions[action],duration:limits[action],endedAt,samples});
}
const lines=['// Generated by sample-web-expressions.mjs from the project Web source.','// Geometric parameters only; no bitmaps or external assets.','#pragma once','#include <stdint.h>','namespace agent_robot { namespace web_reference {',`static const char SOURCE_SHA256[] = "${sourceHash}";`,'struct Clip { const int16_t* values; uint16_t count; };'];
for(let i=0;i<clips.length;i++){
  const values=clips[i].samples.flatMap(frame=>frame.map((value,index)=>Math.round(value*scales[index%10])));
  if(values.some(value=>!Number.isFinite(value)||value<-32768||value>32767))throw new Error('Invalid sample '+actions[i]);
  lines.push(`static const int16_t ACTION_${i}[] = {`,...Array.from({length:Math.ceil(values.length/20)},(_,row)=>'  '+values.slice(row*20,row*20+20).join(',')+','),'};');
}
lines.push('static const Clip CLIPS[] = {',...clips.map((clip,i)=>`  {ACTION_${i}, ${clip.samples.length}}, // ${clip.action}; idle at ${clip.endedAt}`),'};','} }');
await writeFile(join(root,'embedded/lib/AgentRobotEyes/src/AgentRobotWebMotion.h'),lines.join('\n')+'\n');
// Round to 1e-9 so the committed reference does not depend on the last bits of
// a Node/V8 version's Math functions (CI regenerates it and compares).
const stable=(key,value)=>typeof value==='number'&&!Number.isInteger(value)?Math.round(value*1e9)/1e9:value;
await writeFile(join(root,'embedded/tests/web-reference.json'),JSON.stringify({sourceHash,interval:20,scales,clips},stable)+'\n');
await writeFile(join(root,'embedded/tests/web-visual-reference.json'),JSON.stringify({sourceHash,frames:visual})+'\n');
console.log(clips.map(clip=>`${clip.action}: ${clip.samples.length} poses, idle=${clip.endedAt}`).join('\n'));
