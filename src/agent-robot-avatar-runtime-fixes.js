import AgentRobotAvatar from './agent-robot-avatar-extension-host.js';

const proto = AgentRobotAvatar.prototype;
const baseUpdateDragJelly = proto._updateDragJelly;

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

export { AgentRobotAvatar };
export default AgentRobotAvatar;
