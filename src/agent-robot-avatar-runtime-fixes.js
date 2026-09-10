import AgentRobotAvatar from './agent-robot-avatar-extension-host.js';

const proto = AgentRobotAvatar.prototype;
const baseUpdateDragJelly = proto._updateDragJelly;
const baseResumeFrames = proto._resumeFrames;
const baseCanPauseFrames = proto._canPauseFrames;
const baseDraw = proto._draw;
const baseIsReducedMotion = proto._isReducedMotion;

let currentEnvironmentEvent = null;
let clearEnvironmentTimer = 0;

function rememberEnvironmentEvent(event) {
  currentEnvironmentEvent = event;
  if (clearEnvironmentTimer) clearTimeout(clearEnvironmentTimer);
  clearEnvironmentTimer = setTimeout(() => {
    currentEnvironmentEvent = null;
    clearEnvironmentTimer = 0;
  }, 0);
}

if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', rememberEnvironmentEvent, true);
  document.addEventListener('keydown', rememberEnvironmentEvent, true);
}

function wakePolicy(instance) {
  const value = String(instance.getAttribute('wake-on') || 'activity').trim().toLowerCase();
  return value === 'manual' || value === 'interaction' ? value : 'activity';
}

function eventTargetsAvatar(event, instance) {
  const path = event?.composedPath?.();
  if (Array.isArray(path)) return path.includes(instance);
  return event?.target === instance || instance.contains?.(event?.target);
}

// Keep the public noteActivity(wake?) contract, but distinguish calls made by
// the shared environment listeners from explicit API calls. Environment input
// follows wake-on; an explicit noteActivity() remains an intentional wake.
proto.noteActivity = function(wake = true) {
  this._lastActivity = performance.now();
  this._resumeFrames?.();
  if (!wake || (!this._sleeping && this._state !== 'sleep')) return;

  const event = currentEnvironmentEvent;
  if (!event) {
    this.wake();
    return;
  }

  const policy = wakePolicy(this);
  const shouldWake = policy === 'activity' || (policy === 'interaction' && eventTargetsAvatar(event, this));
  if (!shouldWake) return;

  const previousSource = this._runtimeActionSource;
  this._runtimeActionSource = 'automatic';
  try {
    this.wake();
  } finally {
    this._runtimeActionSource = previousSource;
  }
};

function dragAtRest(drag) {
  if (!drag || drag.active || drag.returning || drag.pendingReaction) return false;
  return Math.abs(drag.x) < 0.0001 && Math.abs(drag.y) < 0.0001 &&
    Math.abs(drag.vx) < 0.0001 && Math.abs(drag.vy) < 0.0001 &&
    Math.abs(drag.stretch) < 0.0001 && Math.abs(drag.shear) < 0.0001 &&
    Math.abs(drag.pullX) < 0.0001 && Math.abs(drag.pullY) < 0.0001;
}

// Core's original jelly renderer writes an identity transform every frame even
// after reset. Clear that identity transform once the interaction is fully at
// rest so reset/disconnect leave no visual residue or unnecessary style churn.
proto._updateDragJelly = function(dt) {
  const result = baseUpdateDragJelly.call(this, dt);
  if (dragAtRest(this._dragJelly)) {
    if (this._dragMotion) {
      this._dragMotion.style.transform = '';
      this._dragMotion.style.transformOrigin = '';
    }
    if (this._headShape && this._baseHeadPathD) {
      this._headShape.setAttribute('d', this._baseHeadPathD);
    }
  }
  return result;
};

function cancelContinuousMotion(instance) {
  const animations = instance._headMotion?.getAnimations?.() || [];
  for (const animation of animations) animation.cancel();
  if (instance._headMotion) instance._headMotion.style.transform = '';
  instance._blinkAnim = null;
  instance._blink = 1;
  instance._boredRoutine = null;
  instance._boredLookSpeed = null;
  if (instance._wanderTarget) instance._wanderTarget.x = instance._wanderTarget.y = 0;
  if (instance._look) instance._look.x = instance._look.y = 0;
}

function syncMotionPreference(instance) {
  const reduced = baseIsReducedMotion.call(instance);
  if (instance._runtimeLastReducedMotion === reduced) return reduced;
  instance._runtimeLastReducedMotion = reduced;
  instance._runtimeVisualDirty = true;
  if (reduced) cancelContinuousMotion(instance);
  return reduced;
}

// Some engines deliver matchMedia change events later than the next animation
// frame. Also sample the effective preference while frames are active so a
// runtime switch cannot leave an old Web Animation running until that event.
proto._isReducedMotion = function() {
  return syncMotionPreference(this);
};

// Reduced motion should render each newly reached static state once, then stop
// scheduling frames. The effect accessors mark a visual change without keeping
// continuous waiting/error/review loops alive.
for (const property of ['_waitingFx', '_inspectFx', '_failureFx', '_warningFx', '_systemErrorShake']) {
  const slot = Symbol(property);
  Object.defineProperty(proto, property, {
    configurable: true,
    get() { return this[slot]; },
    set(value) {
      this[slot] = value;
      this._runtimeVisualDirty = true;
      if (this.isConnected && this._isReducedMotion?.()) this._resumeFrames?.();
    },
  });
}

proto._resumeFrames = function() {
  if (this._isReducedMotion?.()) this._runtimeVisualDirty = true;
  return baseResumeFrames.call(this);
};

proto._draw = function(now) {
  syncMotionPreference(this);
  const result = baseDraw.call(this, now);
  this._runtimeVisualDirty = false;
  return result;
};

proto._canPauseFrames = function(now) {
  syncMotionPreference(this);
  if (this._isReducedMotion?.() && this._runtimeVisualDirty) return false;
  return baseCanPauseFrames.call(this, now);
};

export { AgentRobotAvatar };
export default AgentRobotAvatar;
