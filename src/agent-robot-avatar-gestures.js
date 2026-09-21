import AgentRobotAvatar, { registerAvatarExtension } from './agent-robot-avatar-extension-host.js';

const proto=AgentRobotAvatar.prototype;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const disabled=(face,key)=>face.getAttribute(key)==='false';
const emit=(face,state)=>face.dispatchEvent(new CustomEvent('face-state',{detail:{state}}));
const gazeTarget=(box,event)=>({
  x:clamp((event.clientX-box.left-box.width/2)*.42,-48,48),
  y:clamp((event.clientY-box.top-box.height/2)*.38,-34,34),
});

function restore(face) {
  face._headMotion.style.transform='';face._headMotion.removeAttribute('transform');
  face._dragMotion.style.transform='';face._dragMotion.style.transformOrigin='';
  face._headShape.setAttribute('d',face._baseHeadPathD);
  face._antennaDot?.removeAttribute('transform');
  if(face._antennaSpring)face._antennaSpring.initialized=false;
  face._releaseExpressionLock();
}

proto._cancelGesture=function(silent=false) {
  const fx=this._gestureFx;if(!fx)return;
  this._gestureFx=null;
  if(fx.pointerId!=null && this.hasPointerCapture(fx.pointerId))this.releasePointerCapture(fx.pointerId);
  restore(this);this._endGestureAction?.('cancel',false,silent);
};

proto.setPressSqueeze=function(enabled=true){
  this.setAttribute('press-squeeze',String(Boolean(enabled)));
  if(!enabled && this._gestureFx?.kind==='squeeze')this._cancelGesture();
  return this;
};
proto.setAntennaDrag=function(enabled=true){
  this.setAttribute('antenna-drag',String(Boolean(enabled)));
  if(!enabled && this._gestureFx?.kind==='antenna-drag')this._cancelGesture();
  return this;
};

proto._startGesture=function(event) {
  if(event.button!==0||event.isPrimary===false||this._gestureFx?.held)return false;
  const box=this.getBoundingClientRect(),dot=this._antennaDot;
  const x=(event.clientX-box.left)/box.width-.5,y=(event.clientY-box.top)/box.height-.5;
  const r=dot?.getBoundingClientRect(),radius=r?Math.max(10,Math.max(r.width,r.height)/2+3):0;
  const onAntenna=r && Number(dot.getAttribute('opacity')??1)>.01 &&
    Math.hypot(event.clientX-r.left-r.width/2,event.clientY-r.top-r.height/2)<=radius;
  const kind=onAntenna&&!disabled(this,'antenna-drag')?'antenna-drag':
    !onAntenna&&!disabled(this,'press-squeeze')&&x*x+y*y<=.32*.32?'squeeze':null;
  if(!kind)return false;
  event.preventDefault();
  const home={x:Number(dot?.getAttribute('cx')??120),y:Number(dot?.getAttribute('cy')??12)};
  const gaze=kind==='antenna-drag'?gazeTarget(box,event):null;
  const currentLook=gaze?{...this._look}:null;
  this.reset();this.noteActivity();this._expressionLock=true;
  if(currentLook){this._look.x=currentLook.x;this._look.y=currentLook.y;}
  this._gestureFx={kind,held:true,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,
    pointerType:event.pointerType,size:Math.max(1,box.width),threshold:clamp(box.width*.4,24,46),home,
    start:performance.now(),last:performance.now(),age:0,releaseAge:0,maxDist:0,react:false,
    gazeX:gaze?.x??0,gazeY:gaze?.y??0,
    q:0,v:0,pressure:0,apex:0,releaseDepth:1,x:0,y:0,vx:0,vy:0,hx:0,hy:0,hvx:0,hvy:0,tx:0,ty:0};
  this.setPointerCapture(event.pointerId);this._beginGestureAction?.(kind);emit(this,kind);
  this._resumeFrames();return true;
};

proto._moveGesture=function(event) {
  const s=this._gestureFx;if(!s?.held||s.pointerId!==event.pointerId)return;
  if(s.kind==='antenna-drag'){
    const gaze=gazeTarget(this.getBoundingClientRect(),event);s.gazeX=gaze.x;s.gazeY=gaze.y;
  }
  const dx=event.clientX-s.startX,dy=event.clientY-s.startY,dist=Math.hypot(dx,dy);
  s.maxDist=Math.max(s.maxDist,dist);
  if(s.kind==='squeeze'&&dist>4){
    this._cancelGesture();this._startHeadDragFromGesture?.(event,s);return;
  }
  if(dist>2.5)this._suppressClick=true;
  const gain=dist>s.threshold*.6 ? .24 : .19,scale=240/s.size;
  s.tx=clamp(dx*scale*gain,-25,25);s.ty=clamp(dy*scale*gain,-25,25);
  this._runtimeVisualDirty=true;this._resumeFrames();
};

proto._endGesture=function(event) {
  const s=this._gestureFx;if(!s?.held||s.pointerId!==event.pointerId)return;
  if(event.type==='pointercancel'){this._cancelGesture();return;}
  s.held=false;s.releaseAge=0;s.react=s.kind==='antenna-drag'&&s.maxDist>2.5;s.releaseDepth=Math.min(1,Math.abs(s.q));
  const id=s.pointerId;s.pointerId=null;
  if(this.hasPointerCapture(id))this.releasePointerCapture(id);
  if(s.kind==='squeeze'&&s.age>.15)this._suppressClick=true;
  this._runtimeVisualDirty=true;this._resumeFrames();
};

function finish(face,s) {
  face._gestureFx=null;restore(face);emit(face,'idle');
  face._endGestureAction?.('end',s.react);
}

function drawSqueeze(face,s,dt,reduced) {
  if(reduced){s.q=s.held?1:0;s.v=0;}
  else {
    const omega=6/.57,k=s.held?omega*omega:190,d=s.held?2*omega:9,oldV=s.v;
    for(let remaining=dt;remaining>0;){const h=Math.min(1/240,remaining);remaining-=h;s.v+=((s.held?1:0)-s.q)*k*h-s.v*d*h;s.q+=s.v*h;}
    if(!s.held&&!s.apex&&oldV<0&&s.v>=0&&s.q<0)s.apex=s.age;
  }
  const pressure=s.held?clamp((s.q-.94)/.06,0,1):s.pressure*Math.exp(-s.releaseAge*20);
  if(s.held)s.pressure=pressure;
  const phase=s.age*2*Math.PI,jitter=reduced?0:2*pressure;
  const ripple=s.apex ? .012*Math.exp(-(s.age-s.apex)*12)*Math.sin((s.age-s.apex)*72)*s.releaseDepth : 0;
  const jelly=jitter*.005*Math.sin(phase*11)+ripple,scale=1-.29*s.q;
  face._headFollow.setAttribute('transform','');
  face._headMotion.style.transform=`translate(${jitter*(.7*Math.sin(phase*13)+.3*Math.sin(phase*19))}px,${jitter*.45*Math.sin(phase*17)}px) scale(${scale+jelly},${scale-jelly})`;
  for(const [side,home,delta] of [['left',86,24],['right',154,-24]]) {
    face['_'+side+'Eye'].setAttribute('transform',`translate(${home+delta*s.q} 126)`);
    const eye=face['_'+side+'Base'];eye.setAttribute('rx',Math.max(0,54-31*s.q)/2);eye.setAttribute('ry',Math.max(.1,58-20*s.q)/2);eye.setAttribute('opacity','1');
    face['_'+side+'InputBase'].setAttribute('opacity','0');
    face['_'+side+'Top'].setAttribute('y','-126');face['_'+side+'Top'].setAttribute('height','90');
    face['_'+side+'Bottom'].setAttribute('y','36');
  }
  if(face._antennaDot){face._antennaDot.setAttribute('cx',s.home.x+jitter*.6*Math.sin(phase*11-.5));face._antennaDot.setAttribute('cy',s.home.y+(1-scale+jelly)*78-s.v*.5);}
  return !s.held&&(reduced||(s.releaseAge>.35&&Math.abs(s.q)<.0015&&Math.abs(s.v)<.018));
}

function drawAntennaDrag(face,s,dt,reduced) {
  const settle=clamp((s.releaseAge-.45)/.35,0,1);
  if(reduced){s.x=s.held?s.tx:0;s.y=s.held?s.ty:0;s.hx=s.x*.45;s.hy=s.y*.45;}
  else for(let remaining=dt;remaining>0;){
    const h=Math.min(1/240,remaining);remaining-=h;
    if(s.held){const b=1-Math.exp(-45*h);s.x+=(s.tx-s.x)*b;s.y+=(s.ty-s.y)*b;s.vx=s.vy=0;}
    else {const d=10+14*settle;s.vx+=(-460*s.x-d*s.vx)*h;s.vy+=(-460*s.y-d*s.vy)*h;s.x+=s.vx*h;s.y+=s.vy*h;}
    const k=s.held?118:330,d=s.held?7.1:10+12*settle;
    s.hvx+=(k*((s.held?s.x*.45:0)-s.hx)-d*s.hvx)*h;s.hvy+=(k*((s.held?s.y*.45:0)-s.hy)-d*s.hvy)*h;
    s.hx+=s.hvx*h;s.hy+=s.hvy*h;
  }
  const pullX=clamp(s.hx,-25,25),pullY=clamp(s.hy,-25,25),radius=(50+Math.hypot(pullX,pullY)*.8)*.92;
  const points=face._baseHeadPoints.map(p=>{const w=Math.exp(-((p.x-s.home.x)**2+(p.y-clamp(s.home.y,20,220))**2)/(2*radius*radius));return{x:p.x+pullX*w,y:p.y+pullY*w};});
  face._headShape.setAttribute('d',face._pointsToPath(points));face._headFollow.setAttribute('transform','');
  face._headMotion.style.transform=`translate(${s.hx*.12}px,${s.hy*.12}px) rotate(${s.hx*.08}deg)`;
  const dot=face._antennaDot;
  if(dot){const x=s.home.x+s.x,y=s.home.y+s.y,stretch=clamp(s.vy*.0004,-.06,.06);dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('transform',`translate(${x} ${y}) scale(${1+stretch} ${1-stretch}) translate(${-x} ${-y})`);}
  return !s.held&&(reduced||(Math.max(Math.abs(s.x),Math.abs(s.y),Math.abs(s.hx),Math.abs(s.hy))<.025&&Math.max(Math.abs(s.vx),Math.abs(s.vy),Math.abs(s.hvx),Math.abs(s.hvy))<.06));
}

registerAvatarExtension({name:'gestures',reset(){this._cancelGesture(this._runtimeResetNotify===false);},draw(now){
  const s=this._gestureFx;if(!s)return;
  const dt=Math.min(.034,Math.max(0,(now-s.last)/1000));s.last=now;s.age+=dt;if(!s.held)s.releaseAge+=dt;
  const done=s.kind==='squeeze'?drawSqueeze(this,s,dt,this._isReducedMotion?.()):drawAntennaDrag(this,s,dt,this._isReducedMotion?.());
  if(done)finish(this,s);
}});
