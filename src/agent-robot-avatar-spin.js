import AgentRobotAvatar, { registerAvatarExtension } from './agent-robot-avatar-extension-host.js';

const proto = AgentRobotAvatar.prototype;

proto.spin = async function() {
  this.noteActivity();
  ++this._transitionToken;
  this._expressionLock = true;
  this._spinFx = { start: performance.now(), duration: 900 };
  this._resumeFrames?.();

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
    const half = t < 0.5;
    const p = half ? t * 2 : (t - 0.5) * 2;

    const progress = half ? p : 1 - p;
    const eyeWidth = 27 * progress + 1.5;
    const eyeAlpha = progress;

    if (this._leftBase && this._rightBase) {
      this._leftBase.setAttribute('rx', eyeWidth.toFixed(2));
      this._rightBase.setAttribute('rx', eyeWidth.toFixed(2));
      this._leftBase.setAttribute('opacity', eyeAlpha.toFixed(3));
      this._rightBase.setAttribute('opacity', eyeAlpha.toFixed(3));
    }

    if (this._leftEye && this._rightEye) {
      const shift = half ? -p * 8 : p * 8;
      const line = 1 - progress;
      this._leftEye.setAttribute('transform', `translate(${86 + shift + line * 34} 126) scale(${progress.toFixed(3)} 1)`);
      this._rightEye.setAttribute('transform', `translate(${154 + shift - line * 34} 126) scale(${progress.toFixed(3)} 1)`);
    }

    if (t >= 1) this._spinFx = null;
  },
});
