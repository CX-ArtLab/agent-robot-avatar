import AgentRobotAvatar, { registerAvatarExtension } from './agent-robot-avatar-extension-host.js';

const proto = AgentRobotAvatar.prototype;

function interrupt(instance) {
  ++instance._transitionToken;
  instance._expressionLock = true;
  instance._spinFx = { start: performance.now(), duration: 900 };
  instance._resumeFrames?.();
}

proto.spin = async function() {
  this.noteActivity();
  interrupt(this);
  const token = this._transitionToken;
  this.dispatchEvent(new CustomEvent('face-state', { detail: { state: 'spin' } }));
  await new Promise(resolve => setTimeout(resolve, 980));
  if (token === this._transitionToken) {
    this._spinFx = null;
    this._expressionLock = false;
    this.reset();
  }
};

registerAvatarExtension({
  name: 'spin',
  actions: {
    spin() { return this.spin(); },
  },
  draw(now) {
    const fx = this._spinFx;
    if (!fx) return;
    const t = Math.min(1, (now - fx.start) / fx.duration);
    const phase = t < 0.5 ? t * 2 : (t - 0.5) * 2;
    const offset = t < 0.5 ? -1 : 1;
    const scale = t < 0.5 ? 1 - phase : phase;
    const eyeShift = offset * phase * 18;
    const opacity = t < 0.5 ? 1 - scale : scale;

    if (this._leftEye && this._rightEye) {
      this._leftEye.style.transform += ` translate(${eyeShift}px 0)`;
      this._rightEye.style.transform += ` translate(${eyeShift}px 0)`;
    }
    if (this._leftBase && this._rightBase) {
      this._leftBase.setAttribute('opacity', String(opacity));
      this._rightBase.setAttribute('opacity', String(opacity));
    }
    if (t >= 1) this._spinFx = null;
  },
});
