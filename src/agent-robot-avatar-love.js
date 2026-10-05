import AgentRobotAvatar, { registerAvatarExtension } from './agent-robot-avatar-extension-host.js';

const proto = AgentRobotAvatar.prototype;

const clamp01 = value => Math.max(0, Math.min(1, value));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = t => {
  t = clamp01(t);
  return t * t * (3 - 2 * t);
};

// At full affection the two eyes become upright ovals that lean toward each
// other and overlap at the bottom, so together they read as one heart with a
// rounded base. Each oval is rotated about its own bottom point.
//
// rx / ry     half width / half height of each oval
// tilt        degrees each oval leans inward at the bottom (larger = lobes further apart)
// cross       how far the two bottoms overlap past the centre line
// centerY     vertical centre of the finished heart (head centre is 120)
// pulse       heartbeat swell, as a fraction of size
// swayAngle / swayLift   head lean in degrees / lift in px while the heart is held
const LOVE_DEFAULTS = Object.freeze({
  rx: 28,
  ry: 43,
  tilt: 42,
  cross: 13,
  centerY: 126,
  pulse: 0.155,
  prep: 120,
  morphIn: 240,
  beat: 760,
  beats: 3,
  morphOut: 360,
  swayAngle: 0,
  swayLift: 2,
});

const LOVE_BOUNDS = Object.freeze({
  rx: [10, 50],
  ry: [20, 70],
  tilt: [0, 60],
  cross: [-10, 20],
  centerY: [90, 150],
  pulse: [0, 0.3],
  prep: [0, 1200],
  morphIn: [40, 1500],
  beat: [200, 2000],
  beats: [1, 60],
  morphOut: [40, 1500],
  swayAngle: [0, 8],
  swayLift: [0, 8],
});

const runtimeWindow = typeof window !== 'undefined' ? window : null;
const loveConfig = (runtimeWindow?.AgentRobotAvatarLoveConfig && typeof runtimeWindow.AgentRobotAvatarLoveConfig === 'object')
  ? runtimeWindow.AgentRobotAvatarLoveConfig
  : {};

function normalizeConfigValue(key, value) {
  const fallback = LOVE_DEFAULTS[key];
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  const [min, max] = LOVE_BOUNDS[key];
  return Math.max(min, Math.min(max, numeric));
}

if (runtimeWindow) {
  runtimeWindow.AgentRobotAvatarLoveConfig = loveConfig;
  runtimeWindow.AgentRobotAvatarLoveDefaults = LOVE_DEFAULTS;
  runtimeWindow.AgentRobotAvatarLoveBounds = LOVE_BOUNDS;
}

function currentLoveConfig() {
  const config = {};
  for (const key of Object.keys(LOVE_DEFAULTS)) config[key] = normalizeConfigValue(key, loveConfig[key]);
  config.beats = Math.round(config.beats);
  return config;
}

function loveDuration(config) {
  return config.morphIn + config.beat * config.beats + config.morphOut;
}

function reducedMotion(instance) {
  const requested = String(instance.getAttribute('motion') || 'auto').trim().toLowerCase();
  if (requested === 'reduce') return true;
  if (requested === 'full') return false;
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function dispatchLoveState(instance, state) {
  instance.dispatchEvent(new CustomEvent('face-state', { detail: { state } }));
}

function animateLoveHead(instance, config, duration) {
  if (!instance._headMotion?.animate) return;
  const token = instance._transitionToken;
  const { swayAngle, swayLift } = config;
  instance._headMotion.style.transformBox = 'view-box';
  instance._headMotion.style.transformOrigin = '120px 120px';
  const anim = instance._headMotion.animate([
    { transform: 'translateY(0px) rotate(0deg)', offset: 0, easing: 'cubic-bezier(.38,0,.25,1)' },
    { transform: `translateY(${-swayLift}px) rotate(${-swayAngle}deg)`, offset: 0.3, easing: 'cubic-bezier(.35,0,.22,1)' },
    { transform: `translateY(${-swayLift / 2}px) rotate(${swayAngle}deg)`, offset: 0.68, easing: 'cubic-bezier(.35,0,.22,1)' },
    { transform: 'translateY(0px) rotate(0deg)', offset: 1 },
  ], { duration, easing: 'linear', fill: 'forwards' });
  anim.onfinish = () => {
    if (token === instance._transitionToken) instance._headMotion.style.transform = 'translateY(0px)';
  };
}

proto.love = async function() {
  this.noteActivity();
  this._inputWanted = false;
  const config = currentLoveConfig();
  this.reset();
  if (!(await this._prepareExpression({ normalizePose: true, duration: 160, pause: config.prep }))) return;

  const token = this._transitionToken;
  this._expressionLock = true;
  this._look.x = 0;
  this._look.y = 0;

  const reduced = reducedMotion(this);
  const duration = loveDuration(config);
  this._loveFx = { start: performance.now(), duration, timing: config, reduced };
  dispatchLoveState(this, 'love');
  if (!reduced) animateLoveHead(this, config, duration);

  await this._wait(duration + 30);
  if (token !== this._transitionToken) return;

  this._loveFx = null;
  this._look.x = 0;
  this._look.y = 0;
  this._releaseExpressionLock();
  dispatchLoveState(this, 'idle');
};

function drawLove(now) {
  const fx = this._loveFx;
  if (!fx) return;

  // Timing is fixed when the action starts; shape and pulse follow the live
  // config so they can be tuned while the heart is on screen.
  const timing = fx.timing;
  const shape = currentLoveConfig();
  const elapsed = Math.max(0, Math.min(fx.duration, now - fx.start));
  const holdEnd = timing.morphIn + timing.beat * timing.beats;

  // 0 = idle eyes, 1 = full heart.
  let morph = 1;
  if (elapsed < timing.morphIn) morph = smooth(elapsed / timing.morphIn);
  else if (elapsed > holdEnd) morph = 1 - smooth((elapsed - holdEnd) / timing.morphOut);

  // Heartbeat: two soft swells per beat ("lub-dub"), only while held.
  let pulse = 0;
  if (!fx.reduced && elapsed >= timing.morphIn && elapsed <= holdEnd) {
    const phase = ((elapsed - timing.morphIn) % timing.beat) / timing.beat;
    const swell = (centre, width) => Math.max(0, 1 - Math.abs(phase - centre) / width);
    pulse = Math.max(smooth(swell(0.12, 0.12)), 0.6 * smooth(swell(0.36, 0.12)));
  }
  const scale = 1 + shape.pulse * pulse;

  const tiltRad = shape.tilt * Math.PI / 180;
  const baseY = shape.centerY + (shape.ry - 3) * Math.cos(tiltRad);
  const beat = `translate(120 ${shape.centerY}) scale(${scale.toFixed(3)}) translate(-120 -${shape.centerY})`;

  const eyes = [
    [this._leftEye, this._leftBase, this._leftTop, this._leftBottom, 86, -1],
    [this._rightEye, this._rightBase, this._rightTop, this._rightBottom, 154, 1],
  ];
  for (const [eye, base, top, bottom, restX, side] of eyes) {
    const x = lerp(restX, 120 - side * shape.cross, morph);
    const y = lerp(126, baseY, morph);
    const tilt = side * shape.tilt * morph;
    eye.setAttribute('transform', `${beat} translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${tilt.toFixed(2)})`);

    base.setAttribute('cx', '0');
    base.setAttribute('cy', lerp(0, -(shape.ry - 3), morph).toFixed(2));
    base.setAttribute('rx', lerp(27, shape.rx, morph).toFixed(2));
    base.setAttribute('ry', lerp(29, shape.ry, morph).toFixed(2));
    base.setAttribute('opacity', '1');

    // Lids slide out of the way so they never cut the heart.
    const topY = lerp(-36, -150, morph);
    const bottomY = lerp(36, 150, morph);
    top.setAttribute('y', (topY - 90).toFixed(2));
    top.setAttribute('height', '90');
    top.setAttribute('transform', `rotate(0 0 ${topY.toFixed(2)})`);
    bottom.setAttribute('y', bottomY.toFixed(2));
    bottom.setAttribute('height', '90');
    bottom.setAttribute('transform', `rotate(0 0 ${bottomY.toFixed(2)})`);
  }
}

registerAvatarExtension({
  name: 'love',
  actions: {
    love() { return this.love(); },
  },
  beforePlay(action) {
    if (action === 'love') return;
    this._loveFx = null;
  },
  reset() {
    this._loveFx = null;
  },
  draw: drawLove,
});

export { AgentRobotAvatar, LOVE_DEFAULTS };
export default AgentRobotAvatar;
