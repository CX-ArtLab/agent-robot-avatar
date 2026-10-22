import assert from 'node:assert/strict';
import test from 'node:test';
import AgentRobotAvatar from '../src/agent-robot-avatar-actions.js';
import { WAVE_WAITING_CYCLE } from '../src/agent-robot-avatar-waiting.js';

let clock = 0;
Object.defineProperty(globalThis, 'performance', { value: { now: () => clock }, configurable: true });
class SvgNode {
  attrs = new Map(); style = {};
  setAttribute(name, value) { this.attrs.set(name, String(value)); }
  getAttribute(name) { return this.attrs.get(name) ?? null; }
  getAnimations() { return []; }
}
function instance() {
  clock = 0;
  const face = Object.create(AgentRobotAvatar.prototype), waits = [], events = [];
  const pose = {w:54,h:58,rx:27,topY:-36,bottomY:36,topAL:0,topAR:0,bottomAL:0,bottomAR:0,scale:1};
  Object.assign(face, {
    _state:'idle', _pose:{...pose}, _fromPose:{...pose}, _toPose:{...pose},
    _morphStart:0, _morphDuration:0, _morphEase:t=>t, _look:{x:0,y:0},
    _eyeMicro:{lX:0,lY:0,rX:0,rY:0}, _blink:1, _transitionToken:0,
    _wander:{x:0,y:0}, _wanderTarget:{x:0,y:0}, _nextWanderAt:Infinity,
    _pointer:{active:false,lastMove:0,x:0,y:0,influence:0}, _pendingWaits:new Map(),
    _dragJelly:{pullX:0,pullY:0,active:false,returning:false}, _sleeping:false,
    _headMotion:new SvgNode(), _resumeFrames(){}, noteActivity(){}, _animateHead(){},
    dispatchEvent(event){ events.push(event.detail.state); },
    _wait(ms){ return new Promise(resolve => waits.push({at:clock+ms,resolve})); },
    _cancelPendingWaits(){ for(const wait of waits.splice(0))wait.resolve(); },
  });
  for(const side of ['left','right'])for(const part of ['Eye','Base','InputBase','Top','Bottom'])
    face['_'+side+part] = new SvgNode();
  async function at(time) {
    clock=time;
    let index;
    while((index=waits.findIndex(wait=>wait.at<=time))>=0) {
      waits.splice(index,1)[0].resolve();
      for(let i=0;i<12;i++)await Promise.resolve();
    }
    face._updateMorph(time); face._draw(time);
  }
  const position = side => face['_'+side+'Eye'].getAttribute('transform');
  return {face,events,at,position};
}

test('wave preserves the restored amplitude, staggered phase and seamless loop', async () => {
  const {face,at,position}=instance();
  const ready=face.startWaiting({variant:'wave'});
  await at(120);await ready;
  assert.equal(WAVE_WAITING_CYCLE,1100);
  assert.equal(face._waitingFx.duration,3300);
  for(const elapsed of [275,550,825,1100,1375,2200,3300,4400]) {
    await at(120+elapsed);
    for(const [side,x,offset] of [['left',86,0],['right',154,.7]]) {
      const expected=126+10*Math.sin(elapsed%1100/1100*2*Math.PI+offset);
      assert.equal(position(side),`translate(${x} ${expected.toFixed(2)})`);
      assert.equal(face['_'+side+'Base'].getAttribute('rx'),'27');
      assert.equal(face['_'+side+'Base'].getAttribute('ry'),'29');
    }
  }
  const before=position('right');face.stopWaiting();await at(4800);
  assert.equal(face._waitingFx,null);assert.notEqual(position('right'),before);
});

test('play completes three faster wave cycles at the original amplitude, then settles and releases its lock', async () => {
  const {face,at,events,position}=instance();
  const done=face.play('waiting-wave');
  await at(120);await at(400);
  assert.equal(face._waitingFx.variant,'wave');
  for (const elapsed of [275,1375,2475]) {
    await at(120+elapsed);
    assert.equal(position('left'),'translate(86 136.00)');
    assert.equal(face._waitingFx.variant,'wave');
  }
  await at(3419);
  assert.equal(position('left'),'translate(86 126.00)');
  await at(3420);await done;
  assert.equal(face._waitingFx,null);assert.equal(face._expressionLock,false);
  assert.deepEqual(events.filter(state=>state==='waiting'||state==='idle').slice(-2),['waiting','idle']);
});

test('replacement and cancellation during preparation cannot revive wave motion', async () => {
  const {face,at}=instance();
  const pending=face.play('waiting-wave');
  face.reset();await at(120);await pending;
  assert.equal(face._waitingFx,null);assert.equal(face._waitingRequested,false);
  const ready=face.startWaiting({variant:'wave'});await at(240);await ready;
  assert.equal(face._waitingFx.variant,'wave');
  face.play('input');assert.equal(face._waitingFx,null);
});

test('default and wrap timings remain intact and invalid variants preserve the action', async () => {
  for(const [variant,duration] of [['default',3200],['wrap',2400]]) {
    const {face,at}=instance();
    const ready=face.startWaiting({variant});await at(120);await ready;
    assert.equal(face._waitingFx.duration,duration);
    await assert.rejects(face.startWaiting({variant:'invalid'}),TypeError);
    assert.equal(face._waitingFx.variant,variant);
  }
});
