import AgentRobotAvatar from './agent-robot-avatar-antenna-flash.js?v=R62';

const DEMO_BUILD = '0.1.1-R62';
const proto = AgentRobotAvatar.prototype;
const basePlay = proto.play;
const baseReset = proto.reset;
const baseDraw = proto._draw;

const clamp01 = value => Math.max(0, Math.min(1, value));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = t => {
  t = clamp01(t);
  return t * t * (3 - 2 * t);
};

// Finalized from the R59 tuner values supplied by the user.
const INSPECT_DEFAULTS = Object.freeze({
  aperture: 16,
  scanOffset: 16,
  prepPause: 120,
  close: 220,
  holdClosed: 880,
  down1: 400,
  holdDown1: 560,
  up1: 160,
  holdUp1: 580,
  center1: 140,
  holdCenter: 760,
  down2: 140,
  holdDown2: 620,
  up2: 180,
  holdUp2: 620,
  center2: 100,
  holdAfter: 940,
  open: 260,
});

const inspectConfig = (window.AgentRobotAvatarInspectConfig && typeof window.AgentRobotAvatarInspectConfig === 'object')
  ? window.AgentRobotAvatarInspectConfig
  : {};
for (const [key, value] of Object.entries(INSPECT_DEFAULTS)) {
  inspectConfig[key] = value;
}
window.AgentRobotAvatarInspectConfig = inspectConfig;
window.AgentRobotAvatarInspectDefaults = INSPECT_DEFAULTS;

function configNumber(key, fallback, min, max) {
  const value = Number(inspectConfig[key]);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, value));
}

function currentInspectConfig() {
  const duration = key => configNumber(key, INSPECT_DEFAULTS[key], 0, 2400);
  return {
    aperture: configNumber('aperture', INSPECT_DEFAULTS.aperture, 6, 40),
    scanOffset: configNumber('scanOffset', INSPECT_DEFAULTS.scanOffset, 0, 24),
    prepPause: duration('prepPause'),
    close: Math.max(40, duration('close')),
    holdClosed: duration('holdClosed'),
    down1: Math.max(40, duration('down1')),
    holdDown1: duration('holdDown1'),
    up1: Math.max(40, duration('up1')),
    holdUp1: duration('holdUp1'),
    center1: Math.max(40, duration('center1')),
    holdCenter: duration('holdCenter'),
    down2: Math.max(40, duration('down2')),
    holdDown2: duration('holdDown2'),
    up2: Math.max(40, duration('up2')),
    holdUp2: duration('holdUp2'),
    center2: Math.max(40, duration('center2')),
    holdAfter: duration('holdAfter'),
    open: Math.max(40, duration('open')),
  };
}

function dispatchInspectState(instance, state) {
  instance.dispatchEvent(new CustomEvent('face-state', {
    detail: { state, version: DEMO_BUILD }
  }));
}

function makeTimeline(config) {
  let cursor = 0;
  const phases = {};
  const add = key => {
    phases[`${key}Start`] = cursor;
    cursor += config[key];
    phases[`${key}End`] = cursor;
  };
  for (const key of [
    'close','holdClosed','down1','holdDown1','up1','holdUp1','center1','holdCenter',
    'down2','holdDown2','up2','holdUp2','center2','holdAfter','open'
  ]) add(key);
  phases.duration = cursor;
  return phases;
}

function move(elapsed, start, end, from, to) {
  if (elapsed <= start) return from;
  if (elapsed >= end) return to;
  const span = Math.max(1, end - start);
  return lerp(from, to, smooth((elapsed - start) / span));
}

function verticalShift(elapsed, phases, offset) {
  if (elapsed < phases.down1Start) return 0;
  if (elapsed < phases.down1End) return move(elapsed, phases.down1Start, phases.down1End, 0, offset);
  if (elapsed < phases.holdDown1End) return offset;
  if (elapsed < phases.up1End) return move(elapsed, phases.up1Start, phases.up1End, offset, -offset);
  if (elapsed < phases.holdUp1End) return -offset;
  if (elapsed < phases.center1End) return move(elapsed, phases.center1Start, phases.center1End, -offset, 0);
  if (elapsed < phases.holdCenterEnd) return 0;

  // Second pass: down to the lowest point, hold, then return directly to center.
  // Do not overshoot upward again.
  if (elapsed < phases.down2End) return move(elapsed, phases.down2Start, phases.down2End, 0, offset);
  if (elapsed < phases.holdDown2End) return offset;
  if (elapsed < phases.up2End) return move(elapsed, phases.up2Start, phases.up2End, offset, 0);
  return 0;
}

// Keep the R60 head motion unchanged: down, up past center, then back to center.
function animateInspectHead(instance, phases) {
  if (!instance._headMotion?.animate) return;
  const start = phases.down1Start;
  const end = phases.center1End;
  const duration = Math.max(1, end - start);
  const offset = time => Math.max(0, Math.min(1, (time - start) / duration));

  instance._headMotion.style.transformBox = 'view-box';
  instance._headMotion.style.transformOrigin = '120px 120px';
  const anim = instance._headMotion.animate([
    { transform: 'translateY(0px)', offset: 0, easing: 'cubic-bezier(.38,0,.25,1)' },
    { transform: 'translateY(5px)', offset: offset(phases.down1End) },
    { transform: 'translateY(5px)', offset: offset(phases.holdDown1End), easing: 'cubic-bezier(.35,0,.22,1)' },
    { transform: 'translateY(-4px)', offset: offset(phases.up1End) },
    { transform: 'translateY(-4px)', offset: offset(phases.holdUp1End), easing: 'cubic-bezier(.35,0,.22,1)' },
    { transform: 'translateY(0px)', offset: 1 },
  ], {
    duration,
    delay: start,
    easing: 'linear',
    fill: 'forwards',
  });
  anim.onfinish = () => { instance._headMotion.style.transform = 'translateY(0px)'; };
}

proto.play = function(name) {
  const action = String(name || '').trim().toLowerCase();
  if (action === 'inspect' || action === 'verify' || action === 'review') return this.inspect();
  this._inspectFx = null;
  return basePlay.call(this, name);
};

proto.reset = function() {
  this._inspectFx = null;
  return baseReset.call(this);
};

proto.inspect = async function() {
  this.noteActivity();
  this._inputWanted = false;

  const config = currentInspectConfig();
  baseReset.call(this);
  if (!(await this._prepareExpression({ normalizePose: true, duration: 160, pause: config.prepPause }))) return;

  const token = this._transitionToken;
  this._expressionLock = true;
  this._look.x = 0;
  this._look.y = 0;

  const phases = makeTimeline(config);
  this._inspectFx = { start: performance.now(), duration: phases.duration, config, phases };
  dispatchInspectState(this, 'inspect');
  animateInspectHead(this, phases);

  await this._wait(phases.duration + 30);
  if (token !== this._transitionToken) return;

  this._inspectFx = null;
  this._look.x = 0;
  this._look.y = 0;
  this._releaseExpressionLock();
  dispatchInspectState(this, 'idle');
};

proto._draw = function(now) {
  baseDraw.call(this, now);

  const fx = this._inspectFx;
  if (!fx) return;

  const config = fx.config || currentInspectConfig();
  const phases = fx.phases || makeTimeline(config);
  const elapsed = Math.max(0, Math.min(phases.duration, now - fx.start));

  let lidBlend = 1;
  if (elapsed < phases.closeEnd) {
    lidBlend = smooth(elapsed / Math.max(1, config.close));
  } else if (elapsed >= phases.openStart) {
    lidBlend = 1 - smooth((elapsed - phases.openStart) / Math.max(1, config.open));
  }

  const yShift = verticalShift(elapsed, phases, config.scanOffset);

  // Keep the original eye geometry. The squint is made only by the top/bottom masks.
  this._leftEye.setAttribute('transform', `translate(86 ${(126 + yShift).toFixed(2)}) scale(1 1)`);
  this._rightEye.setAttribute('transform', `translate(154 ${(126 + yShift).toFixed(2)}) scale(1 1)`);

  const apertureHalf = config.aperture / 2;
  const topEdge = lerp(-36, -apertureHalf, lidBlend);
  const bottomEdge = lerp(36, apertureHalf, lidBlend);

  for (const top of [this._leftTop, this._rightTop]) {
    top.setAttribute('y', (topEdge - 90).toFixed(2));
    top.setAttribute('height', '90');
    top.setAttribute('transform', `rotate(0 0 ${topEdge.toFixed(2)})`);
  }
  for (const bottom of [this._leftBottom, this._rightBottom]) {
    bottom.setAttribute('y', bottomEdge.toFixed(2));
    bottom.setAttribute('height', '90');
    bottom.setAttribute('transform', `rotate(0 0 ${bottomEdge.toFixed(2)})`);
  }
};

export { AgentRobotAvatar, DEMO_BUILD, INSPECT_DEFAULTS };
export default AgentRobotAvatar;
