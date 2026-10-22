import AgentRobotAvatar, { registerAvatarExtension } from './agent-robot-avatar-extension-host.js';
import { WRAP_CYCLE, drawWrapWaiting } from './agent-robot-avatar-wrap.js';

const WAITING_CYCLE = 3200;
const WAVE_WAITING_CYCLE = 1100;
const WAVE_WAITING_REPEATS = 3;
const proto = AgentRobotAvatar.prototype;

const clamp01 = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp01(value); return t * t * (3 - 2 * t); };
const waitingDuration = variant => variant === 'wave' ? WAVE_WAITING_CYCLE * WAVE_WAITING_REPEATS : variant === 'wrap' ? WRAP_CYCLE : WAITING_CYCLE;

function dispatchWaitingState(instance, state) {
  instance.dispatchEvent(new CustomEvent('face-state', {
    detail: { state }
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

async function enterWaiting(instance, continuous, source, options = {}) {
  const variant = options?.variant ?? 'default';
  if (variant !== 'default' && variant !== 'wrap' && variant !== 'wave') throw new TypeError(`Unknown waiting variant: ${variant}`);
  instance.noteActivity();
  instance._inputWanted = false;

  instance.reset();
  instance._waitingRequested = true;
  if (!(await instance._prepareExpression({ normalizePose: true, duration: 120, pause: 0 }))) return null;
  if (!instance._waitingRequested) return null;

  const token = instance._transitionToken;
  instance._expressionLock = true;
  instance._look.x = 0;
  instance._look.y = 0;
  instance._waitingFx = {
    start: performance.now(),
    duration: waitingDuration(variant),
    variant,
    continuous: continuous === true,
    source,
  };
  dispatchWaitingState(instance, 'waiting');
  return token;
}

proto.waiting = async function(options = {}) {
  const token = await enterWaiting(this, false, 'play', options);
  if (token == null) return;

  await this._wait(waitingDuration(options?.variant));
  if (token !== this._transitionToken || !this._waitingRequested) return;
  this._waitingRequested = false;
  this._waitingFx = null;
  this._releaseExpressionLock();
  dispatchWaitingState(this, 'idle');
};

// Runtime/Agent behavior: call when a request has been sent and the reply has not arrived yet.
// It stays seamless until another action or stopWaiting() occurs.
proto.startWaiting = async function(options = {}) {
  await enterWaiting(this, true, 'runtime', options);
  return this;
};

proto.stopWaiting = function() {
  return this.reset();
};

function drawWaiting(now) {
  const fx = this._waitingFx;
  if (!fx) return;

  const elapsed = Math.max(0, now - fx.start);
  const phaseMs = fx.continuous
    ? (elapsed % fx.duration)
    : Math.min(fx.duration, elapsed);
  const t = clamp01(phaseMs / fx.duration);
  if (fx.variant === 'wrap') {
    drawWrapWaiting(this, phaseMs);
    return;
  }
  if (fx.variant === 'wave') {
    // Restore the first embedded prototype's staggered vertical eye motion.
    // Ease its entry/finite exit; continuous loops keep their phase at the seam.
    let amplitude = 10 * smooth(elapsed / 140);
    if (!fx.continuous) amplitude *= smooth((fx.duration - phaseMs) / 140);
    const angle = (elapsed % WAVE_WAITING_CYCLE) / WAVE_WAITING_CYCLE * Math.PI * 2;
    for (const [side, x, offset] of [['left', 86, 0], ['right', 154, 0.7]]) {
      this[`_${side}Base`].setAttribute('cx', '0');
      this[`_${side}Base`].setAttribute('cy', '0');
      this[`_${side}Base`].setAttribute('rx', '27');
      this[`_${side}Base`].setAttribute('ry', '29');
      this[`_${side}Eye`].setAttribute('transform',
        `translate(${x} ${(126 + Math.sin(angle + offset) * amplitude).toFixed(2)})`);
    }
    return;
  }

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
}

registerAvatarExtension({
  name: 'waiting',
  actions: {
    waiting() { return this.waiting(); },
    wait() { return this.waiting(); },
    'waiting-wrap'() { return this.waiting({ variant: 'wrap' }); },
    'waiting-wave'() { return this.waiting({ variant: 'wave' }); },
  },
  beforePlay(action) {
    if (action === 'waiting' || action === 'wait' || action === 'waiting-wrap' || action === 'waiting-wave') return;
    this._waitingRequested = false;
    this._waitingFx = null;
  },
  reset() {
    this._waitingRequested = false;
    this._waitingFx = null;
  },
  draw: drawWaiting,
});

export { AgentRobotAvatar, WAITING_CYCLE, WAVE_WAITING_CYCLE };
export default AgentRobotAvatar;

