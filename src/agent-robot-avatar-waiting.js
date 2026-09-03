import AgentRobotAvatar from './agent-robot-avatar-antenna.js?v=R58';

const DEMO_BUILD = '0.1.1-R58';
const WAITING_CYCLE = 3200;
const proto = AgentRobotAvatar.prototype;
const basePlay = proto.play;
const baseReset = proto.reset;
const baseDraw = proto._draw;

const clamp01 = value => Math.max(0, Math.min(1, value));

function dispatchWaitingState(instance, state) {
  instance.dispatchEvent(new CustomEvent('face-state', {
    detail: { state, version: DEMO_BUILD }
  }));
}

function readEyeY(eye) {
  const raw = eye?.getAttribute('transform') || '';
  const match = raw.match(/translate\(\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\)/);
  return match ? Number(match[2]) : 126;
}

function setEyeOrbitTransform(eye, x, scaleX, scaleY) {
  if (!eye) return;
  const y = readEyeY(eye);
  eye.setAttribute(
    'transform',
    `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scaleX.toFixed(4)} ${scaleY.toFixed(4)})`
  );
}

async function enterWaiting(instance, continuous, source) {
  instance.noteActivity();
  instance._inputWanted = false;
  instance._waitingRequested = true;

  baseReset.call(instance);
  if (!(await instance._prepareExpression({ normalizePose: true, duration: 120, pause: 0 }))) return null;
  if (!instance._waitingRequested) return null;

  const token = instance._transitionToken;
  instance._expressionLock = true;
  instance._look.x = 0;
  instance._look.y = 0;
  instance._waitingFx = {
    start: performance.now(),
    duration: WAITING_CYCLE,
    continuous: continuous === true,
    source,
  };
  dispatchWaitingState(instance, 'waiting');
  return token;
}

proto.play = function(name) {
  const action = String(name || '').trim().toLowerCase();
  if (action === 'waiting' || action === 'wait') return this.waiting();
  this._waitingRequested = false;
  this._waitingFx = null;
  return basePlay.call(this, action);
};

proto.reset = function() {
  this._waitingRequested = false;
  this._waitingFx = null;
  return baseReset.call(this);
};

// Demo behavior: Loop off = one 3.2 s / two-orbit sample, Loop on = seamless continuous motion.
proto.waiting = async function() {
  const continuous = typeof window !== 'undefined' && window.AgentRobotAvatarDemoLoopEnabled === true;
  const token = await enterWaiting(this, continuous, 'demo');
  if (token == null) return;

  if (continuous) {
    while (this._waitingRequested && this._waitingFx && token === this._transitionToken) {
      await this._wait(120);
    }
    return;
  }

  await this._wait(WAITING_CYCLE);
  if (token !== this._transitionToken || !this._waitingRequested) return;
  this._waitingRequested = false;
  this._waitingFx = null;
  this._releaseExpressionLock();
  dispatchWaitingState(this, 'idle');
};

// Runtime/Agent behavior: call when a request has been sent and the reply has not arrived yet.
// This ignores the Demo Loop toggle and stays seamless until another action or stopWaiting() occurs.
proto.startWaiting = async function() {
  await enterWaiting(this, true, 'runtime');
  return this;
};

proto.stopWaiting = function() {
  this._waitingRequested = false;
  this._waitingFx = null;
  return baseReset.call(this);
};

proto._draw = function(now) {
  baseDraw.call(this, now);

  const fx = this._waitingFx;
  if (!fx) return;

  const elapsed = Math.max(0, now - fx.start);
  const phaseMs = fx.continuous
    ? (elapsed % fx.duration)
    : Math.min(fx.duration, elapsed);
  const t = clamp01(phaseMs / fx.duration);

  // Original R43 waiting-eye motion: two continuous horizontal orbits per 3.2 s cycle.
  const angle = t * Math.PI * 4;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  const leftX = 120 - 34 * cosA;
  const rightX = 120 + 34 * cosA;

  // Original R43 perspective/size treatment retained exactly.
  const foreshorten = 0.72 + 0.28 * Math.abs(cosA);
  const leftDepth = 1 + 0.08 * sinA;
  const rightDepth = 1 - 0.08 * sinA;

  setEyeOrbitTransform(this._leftEye, leftX, foreshorten * leftDepth, leftDepth);
  setEyeOrbitTransform(this._rightEye, rightX, foreshorten * rightDepth, rightDepth);
};

window.AgentRobotAvatarDemoBuild = DEMO_BUILD;
if (typeof document !== 'undefined') {
  const syncBuildBadge = () => {
    window.AgentRobotAvatarDemoBuild = DEMO_BUILD;
    const badge = document.getElementById('agent-demo-build');
    if (badge) badge.textContent = `Demo ${DEMO_BUILD}`;
  };
  syncBuildBadge();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncBuildBadge, { once: true });
  queueMicrotask(syncBuildBadge);
  setTimeout(syncBuildBadge, 0);
}

export { AgentRobotAvatar, DEMO_BUILD, WAITING_CYCLE };
export default AgentRobotAvatar;
