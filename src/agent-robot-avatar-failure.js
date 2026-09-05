import AgentRobotAvatar, { registerAvatarExtension } from './agent-robot-avatar-extension-host.js';

const proto = AgentRobotAvatar.prototype;

const FAILURE_HEAD_DROP = 5.5;
const FAILURE_EYE_DROP = 4.8;

function dispatchFailureState(instance, state) {
  instance.dispatchEvent(new CustomEvent('face-state', {
    detail: { state }
  }));
}

function animateFailureHead(instance, frames, duration) {
  if (!instance._headMotion?.animate) return null;
  const token = instance._transitionToken;
  instance._headMotion.style.transformBox = 'view-box';
  instance._headMotion.style.transformOrigin = '120px 120px';
  const anim = instance._headMotion.animate(frames, {
    duration,
    easing: 'cubic-bezier(.32,0,.24,1)',
    fill: 'forwards',
  });
  anim.onfinish = () => {
    if (token === instance._transitionToken) {
      instance._headMotion.style.transform = frames[frames.length - 1].transform || '';
    }
  };
  return anim;
}

function smooth01(t) {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
}

function failureEyeDrop(fx, now) {
  const elapsed = Math.max(0, now - fx.start);
  if (elapsed < fx.headDown) {
    return FAILURE_EYE_DROP * smooth01(elapsed / Math.max(1, fx.headDown));
  }
  if (elapsed < fx.headDown + fx.hold) return FAILURE_EYE_DROP;
  const recoverElapsed = elapsed - fx.headDown - fx.hold;
  if (recoverElapsed < fx.recover) {
    return FAILURE_EYE_DROP * (1 - smooth01(recoverElapsed / Math.max(1, fx.recover)));
  }
  return 0;
}

function addEyeDrop(eye, amount) {
  if (!eye || Math.abs(amount) < 0.001) return;
  const current = eye.getAttribute('transform') || '';
  eye.setAttribute('transform', `${current} translate(0 ${amount.toFixed(2)})`);
}

proto.failure = async function() {
  this.noteActivity();
  this._inputWanted = false;
  this._failureFx = null;

  // Clear waiting/inspect/flash or any other active extension before entering failure.
  this.reset();
  if (!(await this._prepareExpression({ normalizePose: true, duration: 180, pause: 260 }))) return;
  const token = this._transitionToken;

  // First finish the sad/failure eye deformation completely.
  const eyeIn = 320;
  this.setState('sad', { duration: eyeIn, keepGazeLock: true });
  dispatchFailureState(this, 'failure');
  await this._wait(eyeIn);
  if (token !== this._transitionToken || this._state !== 'sad') return;

  // Only after the eyes have settled, lower the head and press the eyes down inside it together.
  const headDown = 720;
  const loweredHold = 720;
  const recover = 520;
  this._failureFx = {
    start: performance.now(),
    headDown,
    hold: loweredHold,
    recover,
  };

  animateFailureHead(this, [
    { transform: 'translateY(0px)' },
    { transform: `translateY(${FAILURE_HEAD_DROP}px)` },
  ], headDown);
  await this._wait(headDown);
  if (token !== this._transitionToken) return;

  // Hold the lowered, sad pose longer before recovering.
  await this._wait(loweredHold);
  if (token !== this._transitionToken) return;

  // Head, eyes and sad expression recover together.
  animateFailureHead(this, [
    { transform: `translateY(${FAILURE_HEAD_DROP}px)` },
    { transform: 'translateY(0px)' },
  ], recover);
  if (this._state === 'sad') await this._returnToIdle(recover);
  if (token !== this._transitionToken) return;
  this._failureFx = null;
};

function drawFailure(now) {
  const fx = this._failureFx;
  if (!fx) return;
  const drop = failureEyeDrop(fx, now);
  addEyeDrop(this._leftEye, drop);
  addEyeDrop(this._rightEye, drop);
}

registerAvatarExtension({
  name: 'failure',
  actions: {
    failure() { return this.failure(); },
    failed() { return this.failure(); },
    fail() { return this.failure(); },
  },
  beforePlay(action) {
    if (action === 'failure' || action === 'failed' || action === 'fail') return;
    this._failureFx = null;
  },
  reset() {
    this._failureFx = null;
  },
  draw: drawFailure,
});

export { AgentRobotAvatar };
export default AgentRobotAvatar;
