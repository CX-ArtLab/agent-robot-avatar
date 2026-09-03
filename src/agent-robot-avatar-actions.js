import './agent-robot-avatar-core.js';

const AgentRobotAvatar = window.AgentRobotAvatar;
const DEMO_BUILD = '0.1.1-R36';

if (!AgentRobotAvatar) {
  throw new Error('Agent Robot Avatar core failed to load.');
}

const proto = AgentRobotAvatar.prototype;
const basePlay = proto.play;
const baseReset = proto.reset;
const baseDraw = proto._draw;
const baseUpdateLook = proto._updateLook;
const baseOnPointerMove = proto._onPointerMove;

const clamp01 = value => Math.max(0, Math.min(1, value));
const lerp = (a, b, t) => a + (b - a) * t;
const outQuint = t => 1 - Math.pow(1 - t, 5);
const smooth = t => {
  t = clamp01(t);
  return t * t * (3 - 2 * t);
};

const WARNING_TIMING = Object.freeze({
  W1: 480,
  W2: 400,
  W4: 600,
  W5: 200,
  W5P: 300,
  W6: 200,
  W6P: 300,
  W7: 100,
  W8: 800,
  W9: 227,
});

function buildWarningPhases() {
  let cursor = 0;
  const phases = {};
  for (const key of ['W2', 'W4', 'W5', 'W5P', 'W6', 'W6P', 'W7', 'W8', 'W9']) {
    phases[`${key.toLowerCase()}Start`] = cursor;
    cursor += WARNING_TIMING[key];
    phases[`${key.toLowerCase()}End`] = cursor;
  }
  phases.duration = cursor;
  return Object.freeze(phases);
}

const WARNING_PHASES = buildWarningPhases();

function segment(t, a, b, from, to) {
  if (t <= a) return from;
  if (t >= b) return to;
  return lerp(from, to, smooth((t - a) / (b - a)));
}

function errorEyeSweep(t) {
  if (t < 0.16) return segment(t, 0, 0.16, 0, -1);
  if (t < 0.40) return segment(t, 0.16, 0.40, -1, 1);
  if (t < 0.64) return segment(t, 0.40, 0.64, 1, -0.88);
  if (t < 0.84) return segment(t, 0.64, 0.84, -0.88, 0.58);
  return segment(t, 0.84, 1, 0.58, 0);
}

function dispatchActionState(instance, state) {
  instance.dispatchEvent(new CustomEvent('face-state', { detail: { state, version: DEMO_BUILD } }));
}

function centerHeadTransform(instance) {
  if (!instance._headMotion) return;
  instance._headMotion.style.transformBox = 'view-box';
  instance._headMotion.style.transformOrigin = '120px 120px';
}

function cancelCustomMotion(instance) {
  instance._systemErrorShake = null;
  instance._warningFx = null;
  instance._look.x = 0;
  instance._look.y = 0;
}

function interruptRunningAction(instance) {
  ++instance._transitionToken;
  instance._inputWanted = false;
  instance._boredRoutine = null;
  instance._boredLookSpeed = null;
  instance._eyeNod = null;
  instance._eyeBob = null;
  instance._angryEyeDrop = null;
  instance._surpriseShake = null;
  cancelCustomMotion(instance);
  if (instance._headMotion?.getAnimations) {
    instance._headMotion.getAnimations().forEach(animation => animation.cancel());
  }
  if (instance._headMotion) instance._headMotion.style.transform = '';
}

proto.play = function(name) {
  const action = String(name || '').trim().toLowerCase();

  if (action === 'idle') return this.reset();
  if (action === 'input' && (this._inputWanted || this._state === 'input')) return this;
  if (action === 'wake' && !this._sleeping && this._state !== 'sleep') return this;
  if (action === 'sleep' && this._sleeping) return this;

  interruptRunningAction(this);

  if (action === 'warning') return this.warning();
  if (action === 'system-error' || action === 'connection-error') return this.error();
  if (action === 'blocked' || action === 'policy-blocked') return this.angry();
  return basePlay.call(this, action);
};

proto.reset = function() {
  interruptRunningAction(this);
  return baseReset.call(this);
};

proto.setPointerFollow = function(enabled = true) {
  this._pointerFollowEnabled = enabled !== false;
  if (!this._pointerFollowEnabled) {
    this._pointer.active = false;
    this._pointer.influence = 0;
    this._pointer.lastMove = 0;
    this._headCenteringUntil = performance.now() + 320;
  }
  return this;
};

proto._onPointerMove = function(event) {
  if (this._pointerFollowEnabled === false) return;
  return baseOnPointerMove.call(this, event);
};

proto._returnToIdle = async function(duration = 320, ease = outQuint) {
  const token = this._transitionToken;
  this.setState('idle', { duration, ease, keepGazeLock: true });
  this._headCenteringUntil = Math.max(this._headCenteringUntil || 0, performance.now() + duration);
  await this._wait(duration);
  if (token === this._transitionToken && this._state === 'idle') this._releaseExpressionLock();
};

proto.send = async function() {
  this.noteActivity();
  this._inputWanted = false;
  if (!(await this._prepareExpression({ normalizePose: true, duration: 180, pause: 320 }))) return;
  const token = this._transitionToken;
  this._eyeNod = { start: performance.now(), duration: 760 };
  this._animateHead([
    { transform: 'translateY(0px)' },
    { transform: 'translateY(5px)', offset: .52 },
    { transform: 'translateY(0px)' }
  ], 920);
  await this._wait(860);
  if (token !== this._transitionToken) return;
  this._eyeNod = null;
  this._releaseExpressionLock();
};

proto.wake = async function() {
  if (!this._sleeping && this._state !== 'sleep') return;
  const token = ++this._transitionToken;
  this._expressionLock = true;
  this._sleeping = false;
  this._animateHead([
    { transform: 'translateY(4px) scale(1)' },
    { transform: 'translateY(-2px) scale(1.015)', offset: .55 },
    { transform: 'translateY(0) scale(1)' }
  ], 500);
  this.setState('sleepy', { duration: 240, keepGazeLock: true });
  await this._wait(260);
  if (token !== this._transitionToken) return;
  this.setState('surprise', { duration: 120, keepGazeLock: true });
  await this._wait(190);
  if (token !== this._transitionToken) return;
  await this._returnToIdle(300);
  if (token !== this._transitionToken) return;
  this._lastActivity = performance.now();
};

proto.error = async function() {
  this.noteActivity();
  this._inputWanted = false;
  cancelCustomMotion(this);
  if (!(await this._prepareExpression({ normalizePose: true, duration: 180, pause: 240 }))) return;

  const token = this._transitionToken;
  const eyeDuration = 980;
  const headDuration = 1380;
  this._systemErrorShake = { start: performance.now(), duration: eyeDuration };
  dispatchActionState(this, 'error');

  centerHeadTransform(this);
  if (this._headMotion?.animate) {
    const anim = this._headMotion.animate([
      { transform: 'translateX(0px)', offset: 0, easing: 'cubic-bezier(.38,0,.28,1)' },
      { transform: 'translateX(-4px)', offset: 0.34, easing: 'cubic-bezier(.35,0,.22,1)' },
      { transform: 'translateX(4px)', offset: 0.72, easing: 'cubic-bezier(.35,0,.22,1)' },
      { transform: 'translateX(0px)', offset: 1 }
    ], { duration: headDuration, easing: 'linear', fill: 'forwards' });
    anim.onfinish = () => { this._headMotion.style.transform = 'translateX(0px)'; };
  }

  await this._wait(headDuration + 40);
  if (token !== this._transitionToken) return;
  this._systemErrorShake = null;
  this._look.x = 0;
  this._look.y = 0;
  this._releaseExpressionLock();
  dispatchActionState(this, 'idle');
};

proto.warning = async function() {
  this.noteActivity();
  this._inputWanted = false;
  cancelCustomMotion(this);
  if (!(await this._prepareExpression({ normalizePose: true, duration: 200, pause: WARNING_TIMING.W1 - 200 }))) return;

  const token = this._transitionToken;
  const duration = WARNING_PHASES.duration;
  this._warningFx = { start: performance.now(), duration };
  dispatchActionState(this, 'warning');

  centerHeadTransform(this);
  if (this._headMotion?.animate) {
    const anim = this._headMotion.animate([
      { transform: 'translateY(0px)', offset: 0 },
      { transform: 'translateY(0px)', offset: WARNING_PHASES.w5Start / duration, easing: 'cubic-bezier(.38,0,.25,1)' },
      { transform: 'translateY(5px)', offset: WARNING_PHASES.w5End / duration, easing: 'cubic-bezier(.35,0,.22,1)' },
      { transform: 'translateY(5px)', offset: WARNING_PHASES.w5pEnd / duration, easing: 'cubic-bezier(.35,0,.22,1)' },
      { transform: 'translateY(-4px)', offset: WARNING_PHASES.w6End / duration },
      { transform: 'translateY(-4px)', offset: WARNING_PHASES.w6pEnd / duration, easing: 'cubic-bezier(.35,0,.22,1)' },
      { transform: 'translateY(0px)', offset: WARNING_PHASES.w7End / duration },
      { transform: 'translateY(0px)', offset: 1 }
    ], { duration, easing: 'linear', fill: 'forwards' });
    anim.onfinish = () => { this._headMotion.style.transform = 'translateY(0px)'; };
  }

  await this._wait(duration + 40);
  if (token !== this._transitionToken) return;
  this._warningFx = null;
  this._look.x = 0;
  this._look.y = 0;
  this._releaseExpressionLock();
  dispatchActionState(this, 'idle');
};

proto._startBoredRoutine = function(now) {
  this._boredRoutine = {
    index: 0,
    nextAt: now,
    steps: [
      { x: -18, y: -16, hold: 1400, lookSpeed: 0.5 },
      { x: 18, y: -16, hold: 1400, lookSpeed: 0.5 },
      { x: 0, y: 0, hold: 320, lookSpeed: 0.5 },
    ]
  };
};

proto._updateLook = function(now, dt) {
  baseUpdateLook.call(this, now, dt);

  if (this._systemErrorShake) {
    const t = clamp01((now - this._systemErrorShake.start) / this._systemErrorShake.duration);
    this._look.x = errorEyeSweep(t) * 30;
    this._look.y = 0;
    if (t >= 1) this._systemErrorShake = null;
  }
};

proto._draw = function(now) {
  baseDraw.call(this, now);

  const fx = this._warningFx;
  if (!fx) return;

  const elapsed = Math.max(0, Math.min(fx.duration, now - fx.start));

  let proximity = elapsed < WARNING_PHASES.w2End
    ? smooth(elapsed / WARNING_TIMING.W2)
    : 1;

  let lids = elapsed < WARNING_PHASES.w2End
    ? smooth(elapsed / WARNING_TIMING.W2)
    : 1;

  const release = elapsed > WARNING_PHASES.w8End
    ? 1 - smooth((elapsed - WARNING_PHASES.w8End) / WARNING_TIMING.W9)
    : 1;
  proximity *= release;
  lids *= release;

  let lidShift = 0;
  const lightPress = 4.2;
  const w4PressEnd = Math.min(WARNING_PHASES.w4Start + 120, WARNING_PHASES.w4End);
  if (elapsed >= WARNING_PHASES.w4Start && elapsed < WARNING_PHASES.w4End) {
    lidShift = elapsed < w4PressEnd
      ? segment(elapsed, WARNING_PHASES.w4Start, w4PressEnd, 0, lightPress)
      : lightPress;
  } else if (elapsed >= WARNING_PHASES.w5Start && elapsed < WARNING_PHASES.w5End) {
    lidShift = segment(elapsed, WARNING_PHASES.w5Start, WARNING_PHASES.w5End, lightPress, 20.5);
  } else if (elapsed >= WARNING_PHASES.w5pStart && elapsed < WARNING_PHASES.w5pEnd) {
    lidShift = 20.5;
  } else if (elapsed >= WARNING_PHASES.w6Start && elapsed < WARNING_PHASES.w6End) {
    lidShift = segment(elapsed, WARNING_PHASES.w6Start, WARNING_PHASES.w6End, 20.5, -6.5);
  } else if (elapsed >= WARNING_PHASES.w6pStart && elapsed < WARNING_PHASES.w6pEnd) {
    lidShift = -6.5;
  } else if (elapsed >= WARNING_PHASES.w7Start && elapsed < WARNING_PHASES.w7End) {
    lidShift = segment(elapsed, WARNING_PHASES.w7Start, WARNING_PHASES.w7End, -6.5, lightPress);
  } else if (elapsed >= WARNING_PHASES.w8Start && elapsed < WARNING_PHASES.w8End) {
    lidShift = lightPress;
  }

  let farLowOffset = 0;
  if (elapsed >= WARNING_PHASES.w5Start && elapsed < WARNING_PHASES.w5End) {
    farLowOffset = segment(elapsed, WARNING_PHASES.w5Start, WARNING_PHASES.w5End, 0, 2.4);
  } else if (elapsed >= WARNING_PHASES.w5pStart && elapsed < WARNING_PHASES.w5pEnd) {
    farLowOffset = 2.4;
  } else if (elapsed >= WARNING_PHASES.w6Start && elapsed < WARNING_PHASES.w6End) {
    farLowOffset = segment(elapsed, WARNING_PHASES.w6Start, WARNING_PHASES.w6End, 2.4, 0);
  }

  let farDeepLidDrop = 0;
  if (elapsed >= WARNING_PHASES.w5Start && elapsed < WARNING_PHASES.w5End) {
    farDeepLidDrop = segment(elapsed, WARNING_PHASES.w5Start, WARNING_PHASES.w5End, 0, 3.5);
  } else if (elapsed >= WARNING_PHASES.w5pStart && elapsed < WARNING_PHASES.w5pEnd) {
    farDeepLidDrop = 3.5;
  } else if (elapsed >= WARNING_PHASES.w6Start && elapsed < WARNING_PHASES.w6End) {
    farDeepLidDrop = segment(elapsed, WARNING_PHASES.w6Start, WARNING_PHASES.w6End, 3.5, 0);
  }

  const nearSX = lerp(1, 1.48, proximity);
  const nearSY = lerp(1, 1.40, proximity);
  const farSX = lerp(1, 0.78, proximity);
  const farSY = lerp(1, 0.97, proximity);

  const nearX = lerp(86, 102.0, proximity);
  const farX = lerp(154, 178.5, proximity);
  const nearY = lerp(126, 125.5, proximity);
  const farY = lerp(126, 134.0, proximity) + farLowOffset;

  this._leftEye.setAttribute(
    'transform',
    `translate(${nearX.toFixed(2)} ${nearY.toFixed(2)}) scale(${nearSX.toFixed(3)} ${nearSY.toFixed(3)})`
  );
  this._rightEye.setAttribute(
    'transform',
    `translate(${farX.toFixed(2)} ${farY.toFixed(2)}) scale(${farSX.toFixed(3)} ${farSY.toFixed(3)})`
  );

  const nearTopY = lerp(-36, -10.0, lids) + lidShift;
  const farTopY = lerp(-36, -18.0, lids) + lidShift * 0.95 + farDeepLidDrop;
  const nearTopRot = lerp(0, 10.0, lids);
  const farTopRot = lerp(0, -7.5, lids);

  this._leftTop.setAttribute('y', (nearTopY - 90).toFixed(2));
  this._leftTop.setAttribute('height', '90');
  this._leftTop.setAttribute('transform', `rotate(${nearTopRot.toFixed(2)} 0 ${nearTopY.toFixed(2)})`);

  this._rightTop.setAttribute('y', (farTopY - 90).toFixed(2));
  this._rightTop.setAttribute('height', '90');
  this._rightTop.setAttribute('transform', `rotate(${farTopRot.toFixed(2)} 0 ${farTopY.toFixed(2)})`);

  const nearBottomY = lerp(36, 35.3, lids);
  const farBottomY = lerp(36, 35.6, lids);
  this._leftBottom.setAttribute('y', nearBottomY.toFixed(2));
  this._leftBottom.setAttribute('height', '90');
  this._leftBottom.setAttribute('transform', `rotate(0 0 ${nearBottomY.toFixed(2)})`);
  this._rightBottom.setAttribute('y', farBottomY.toFixed(2));
  this._rightBottom.setAttribute('height', '90');
  this._rightBottom.setAttribute('transform', `rotate(0 0 ${farBottomY.toFixed(2)})`);
};

window.AgentRobotAvatarDemoBuild = DEMO_BUILD;
if (typeof document !== 'undefined' && document.title.includes('Interactive Demo')) {
  const showBuild = () => {
    if (document.getElementById('agent-demo-build')) return;
    const badge = document.createElement('div');
    badge.id = 'agent-demo-build';
    badge.textContent = `Demo ${DEMO_BUILD}`;
    badge.style.cssText = 'position:fixed;right:18px;top:16px;z-index:9999;padding:5px 9px;border:1px solid #e1e3e5;border-radius:999px;background:rgba(255,255,255,.88);color:#91959b;font:600 10px/1.2 Inter,system-ui,sans-serif;letter-spacing:.03em;pointer-events:none;backdrop-filter:blur(8px)';
    document.body.appendChild(badge);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showBuild, { once: true });
  else showBuild();
}

export { AgentRobotAvatar, DEMO_BUILD };
export default AgentRobotAvatar;