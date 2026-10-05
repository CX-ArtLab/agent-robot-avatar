import AgentRobotAvatar, { registerAvatarExtension } from './agent-robot-avatar-extension-host.js';

const proto = AgentRobotAvatar.prototype;
const clamp01 = value => Math.max(0, Math.min(1, value));
const smooth = t => {
  t = clamp01(t);
  return t * t * (3 - 2 * t);
};

// Each eye rolls over a drum that turns about a horizontal axis, like the reels
// of a slot machine. There is exactly one eye per side, projected the same way
// the wrap-waiting eyes are: position follows sin(angle) and height follows
// cos(angle), so the eye flattens to nothing as it rolls over the top or bottom
// edge instead of being cut off. Because only one eye ever exists on each
// reel, eyes can never overlap.
// The left reel slows, overshoots, bounces and settles, then the right reel
// follows. A settled reel is exactly the ordinary eye, so control returns to
// the regular eye with no visible jump.
//
// radius       drum radius; how far the eye travels above and below its resting place
// gap          extra travel, out of sight, between leaving the bottom and re-entering at the top
// squeeze      extra width removed from the eye as it turns edge-on (optical correction)
// speed        surface speed, units per millisecond
// ramp         time to reach full speed
// spin         how long the left reel spins at full speed before it starts to slow
// stagger      how much later the right reel starts to slow
// slowDist     distance covered while slowing down (larger = longer, softer stop)
// overshoot    how far the reel passes its resting place before bouncing back
// bouncePeriod duration of one bounce oscillation
// damping      0-1; lower = more bounces
const RANDOM_DEFAULTS = Object.freeze({
  radius: 50,
  gap: 0,
  squeeze: 12.5,
  speed: 0.6,
  ramp: 220,
  spin: 1000,
  stagger: 420,
  slowDist: 40,
  overshoot: 8,
  bouncePeriod: 200,
  damping: 0.3,
  prep: 120,
});

const RANDOM_BOUNDS = Object.freeze({
  radius: [50, 100],
  gap: [0, 200],
  squeeze: [0, 30],
  speed: [0.15, 1.6],
  ramp: [40, 800],
  spin: [100, 4000],
  stagger: [0, 1500],
  slowDist: [40, 400],
  overshoot: [0, 40],
  bouncePeriod: [120, 800],
  damping: [0.1, 0.9],
  prep: [0, 1200],
});

const runtimeWindow = typeof window !== 'undefined' ? window : null;
const randomConfig = (runtimeWindow?.AgentRobotAvatarRandomConfig && typeof runtimeWindow.AgentRobotAvatarRandomConfig === 'object')
  ? runtimeWindow.AgentRobotAvatarRandomConfig
  : {};

function normalizeConfigValue(key, value) {
  const fallback = RANDOM_DEFAULTS[key];
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  const [min, max] = RANDOM_BOUNDS[key];
  return Math.max(min, Math.min(max, numeric));
}

if (runtimeWindow) {
  runtimeWindow.AgentRobotAvatarRandomConfig = randomConfig;
  runtimeWindow.AgentRobotAvatarRandomDefaults = RANDOM_DEFAULTS;
  runtimeWindow.AgentRobotAvatarRandomBounds = RANDOM_BOUNDS;
}

function currentRandomConfig() {
  const config = {};
  for (const key of Object.keys(RANDOM_DEFAULTS)) config[key] = normalizeConfigValue(key, randomConfig[key]);
  return config;
}

// Reel position (in units, increasing = moving down) as a function of time.
// Phase 1: ramp up, then constant speed. Phase 2: Hermite slow-down that starts
// at the spin speed and ends at rest just past the target. Phase 3: damped
// bounce back onto the target.
function planReel(config, slowAt) {
  const { speed: v, ramp, period: P, slowDist: L, overshoot: O, bouncePeriod, damping: zeta } = config;
  const spinPos = t => (t < ramp ? v * t * t / (2 * ramp) : v * (t - ramp / 2));
  const rampEnd = v * ramp / 2;

  let n = Math.max(1, Math.round((spinPos(slowAt) + L - O) / P));
  while (n * P + O - L < rampEnd) n += 1;
  const target = n * P;
  const pStop = target + O - L;
  const tStop = pStop / v + ramp / 2;
  const D = 2 * L / v;

  const wd = 2 * Math.PI / bouncePeriod;
  const w = wd / Math.sqrt(1 - zeta * zeta);
  const decay = zeta * w;
  const bounceLength = O > 0.1 ? Math.log(O / 0.1) / decay : 0;
  const tLand = tStop + D;
  const tEnd = tLand + bounceLength;

  const position = t => {
    if (t < tStop) return spinPos(t);
    if (t < tLand) {
      const u = (t - tStop) / D;
      const h10 = u * u * u - 2 * u * u + u;
      const h01 = -2 * u * u * u + 3 * u * u;
      return pStop + L * (2 * h10 + h01);
    }
    if (t >= tEnd) return target;
    const tau = t - tLand;
    return target + O * Math.exp(-decay * tau) * (Math.cos(wd * tau) + (decay / wd) * Math.sin(wd * tau));
  };

  return { position, tEnd, tStop, tLand, period: P };
}

function reducedMotion(instance) {
  const requested = String(instance.getAttribute('motion') || 'auto').trim().toLowerCase();
  if (requested === 'reduce') return true;
  if (requested === 'full') return false;
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function dispatchRandomState(instance, state) {
  instance.dispatchEvent(new CustomEvent('face-state', { detail: { state } }));
}

function buildRandomFx(config, start, extra = {}) {
  // Reel position is measured as distance along the drum surface. One pass of
  // the eye is the visible half of the drum plus the hidden gap.
  const period = Math.PI * config.radius + config.gap;
  const reel = { ...config, period };
  const plans = [planReel(reel, config.spin), planReel(reel, config.spin + config.stagger)];
  return {
    start,
    duration: Math.max(plans[0].tEnd, plans[1].tEnd),
    plans,
    period,
    radius: config.radius,
    squeeze: config.squeeze,
    ...extra,
  };
}

// Preview hook for the tuner page: renders the expression frozen at `elapsed`
// milliseconds using the live config and keeps it on screen (no timers, no
// lifecycle events). Pass null to leave the preview. Returns the duration.
proto._previewRandom = function(elapsed) {
  if (elapsed === null) {
    if (this._randomFx?.preview) {
      this._randomFx = null;
      this._releaseExpressionLock();
      dispatchRandomState(this, 'idle');
    }
    return 0;
  }
  if (!this._randomFx?.preview) {
    this.reset();
    this._expressionLock = true;
    this._look.x = 0;
    this._look.y = 0;
    dispatchRandomState(this, 'random');
  }
  this._randomFx = buildRandomFx(currentRandomConfig(), 0, { preview: true, frozenAt: elapsed, reduced: false });
  this._resumeFrames?.();
  return this._randomFx.duration;
};

proto.random = async function() {
  this.noteActivity();
  this._inputWanted = false;
  const config = currentRandomConfig();
  this.reset();
  if (!(await this._prepareExpression({ normalizePose: true, duration: 160, pause: config.prep }))) return;

  const token = this._transitionToken;
  this._expressionLock = true;
  this._look.x = 0;
  this._look.y = 0;

  this._randomFx = buildRandomFx(config, performance.now(), { reduced: reducedMotion(this) });
  const duration = this._randomFx.duration;
  dispatchRandomState(this, 'random');

  await this._wait(duration + 30);
  if (token !== this._transitionToken) return;

  this._randomFx = null;
  this._look.x = 0;
  this._look.y = 0;
  this._releaseExpressionLock();
  dispatchRandomState(this, 'idle');
};

function drawRandom(now) {
  const fx = this._randomFx;
  if (!fx) return;

  const elapsed = fx.frozenAt ?? Math.max(0, now - fx.start);
  const { period: P, radius: R, squeeze } = fx;
  const half = Math.PI * R / 2;

  fx.plans.forEach((plan, index) => {
    // Settled: leave the ordinary eye exactly as the regular draw left it.
    if (elapsed >= plan.tEnd) return;

    const base = index === 0 ? this._leftBase : this._rightBase;
    const top = index === 0 ? this._leftTop : this._rightTop;
    const bottom = index === 0 ? this._leftBottom : this._rightBottom;

    // Reduced motion holds the eye part-way round instead of spinning.
    const position = fx.reduced ? P * 0.3 : plan.position(elapsed);
    let offset = ((position % P) + P) % P;
    if (offset > P / 2) offset -= P;

    // Distance from the resting place, travelled along the drum surface. Beyond
    // the visible half the eye is behind the drum and nothing is drawn.
    const angle = Math.abs(offset) < half ? offset / R : Math.sign(offset) * Math.PI / 2;
    const front = Math.abs(offset) < half ? Math.cos(angle) : 0;

    // Same optical corrections as the wrap-waiting eyes, turned on their side:
    // the eye gets slightly narrower and drifts toward the head edge as it
    // rolls edge-on.
    const side = 1 - front;
    const width = 54 - squeeze * smooth(side);
    const y = R * Math.sin(angle) + Math.sign(angle) * 6 * side ** 3;

    base.setAttribute('cx', '0');
    base.setAttribute('cy', y.toFixed(2));
    base.setAttribute('rx', (width / 2).toFixed(2));
    base.setAttribute('ry', (29 * front).toFixed(2));
    base.setAttribute('opacity', '1');

    // Eyelid masks stay out of the way while the eye is rolling.
    top.setAttribute('y', '-240');
    top.setAttribute('height', '90');
    top.setAttribute('transform', 'rotate(0 0 -150)');
    bottom.setAttribute('y', '150');
    bottom.setAttribute('height', '90');
    bottom.setAttribute('transform', 'rotate(0 0 150)');
  });
}

registerAvatarExtension({
  name: 'random',
  actions: {
    random() { return this.random(); },
    slot() { return this.random(); },
  },
  beforePlay(action) {
    if (action === 'random' || action === 'slot') return;
    this._randomFx = null;
  },
  reset() {
    this._randomFx = null;
  },
  draw: drawRandom,
});

export { AgentRobotAvatar, RANDOM_DEFAULTS };
export default AgentRobotAvatar;
