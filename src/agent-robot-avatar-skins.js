import AgentRobotAvatar, { registerAvatarExtension } from './agent-robot-avatar-extension-host.js';

const NS = 'http://www.w3.org/2000/svg';
const proto = AgentRobotAvatar.prototype;
const baseApplyColor = proto._applyColor;

// Each skin is a base paint plus how it answers the light: a soft shine on the
// lit side, a darker edge for volume, a reflected glow on the far side, a thin
// rim, the eye color, and the antenna sphere.
const SKINS = Object.freeze({
  obsidian: Object.freeze({
    base: ['#7b8796', '#313a47', '#101722', '#05080e'],
    eye: '#f0f7ff', rim: '#c1d5f4', shine: 0.57, shade: 0.68,
    antenna: ['#c3cfdf', '#384452', '#080e19'],
  }),
  porcelain: Object.freeze({
    base: ['#ffffff', '#f5f4ec', '#d9dad3', '#a3aaab'],
    eye: '#343b3c', rim: '#ffffff', shine: 0.95, shade: 0.18,
    antenna: ['#ffffff', '#e7e9df', '#a6afb0'],
  }),
  aurora: Object.freeze({
    base: ['#9aebea', '#92c9f1', '#a795eb', '#e79bc7'],
    eye: '#2d3052', rim: '#fff4fe', shine: 0.82, shade: 0.30,
    antenna: ['#edffff', '#9ba7ec', '#7456a5'],
    linear: true,
  }),
});
const SKIN_NAMES = Object.freeze(Object.keys(SKINS));
const REST_LIGHT = Object.freeze({ x: -0.5, y: -0.5 });

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function svg(tag, attributes = {}, parent) {
  const element = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  parent?.append(element);
  return element;
}

function gradient(parent, tag, id, attributes, stops) {
  const element = svg(tag, { id, ...attributes }, parent);
  for (const [offset, color, opacity = 1] of stops) {
    svg('stop', { offset, 'stop-color': color, 'stop-opacity': opacity }, element);
  }
  return element;
}

function normalizeSkin(value) {
  const name = String(value ?? '').trim().toLowerCase();
  if (!name || name === 'none') return null;
  return Object.hasOwn(SKINS, name) ? name : undefined;
}

// The eyelids are rectangles painted in the head color over the eyes. A skin
// paints the head with gradients, so a flat lid would show as a patch. Moving
// the lids into a mask lets them cut the eyes instead, and the skin shows
// through. With a flat head color this looks exactly like the original.
function maskEyelids(instance) {
  const root = instance.shadowRoot;
  const defs = root.querySelector('defs');
  for (const side of ['left', 'right']) {
    const eye = root.getElementById(`${side}Eye`);
    const lids = root.getElementById(`${side}Top`)?.parentElement;
    if (!eye || !lids || lids.parentElement?.tagName === 'mask') continue;
    const mask = svg('mask', {
      id: `skin-${side}-lids`, maskUnits: 'userSpaceOnUse', maskContentUnits: 'userSpaceOnUse',
      x: -180, y: -240, width: 360, height: 480,
    }, defs);
    svg('rect', { x: -180, y: -240, width: 360, height: 480, fill: '#fff' }, mask);
    for (const lid of lids.children) lid.style.fill = '#000';
    mask.append(lids);
    const paint = svg('g', { mask: `url(#skin-${side}-lids)` });
    paint.append(...eye.children);
    eye.append(paint);
  }
}

function build(instance) {
  const root = instance.shadowRoot;
  const head = root?.getElementById('head');
  const drag = root?.getElementById('dragMotion');
  if (!head || !drag) return null;
  maskEyelids(instance);

  const svgRoot = root.querySelector('svg');
  const defs = svg('g', { id: 'skinDefs' });
  root.querySelector('defs').append(defs);
  const ground = svg('ellipse', { cx: 120, cy: 221, rx: 85, ry: 14, fill: 'url(#skin-ground)', 'pointer-events': 'none' });
  svgRoot.insertBefore(ground, drag);
  const layers = svg('g', { 'pointer-events': 'none', 'aria-hidden': 'true' });
  head.after(layers);
  const shape = { href: '#headShape', transform: head.getAttribute('transform') };
  for (const paint of ['shine', 'volume', 'edge']) svg('use', { ...shape, fill: `url(#skin-${paint})` }, layers);
  svg('use', { ...shape, fill: 'none', stroke: 'url(#skin-rim)', 'stroke-width': 1.25 }, layers);
  const style = document.createElement('style');
  root.append(style);

  return { defs, ground, layers, style, name: null, parts: null, light: { ...REST_LIGHT }, shown: {} };
}

function paintSkin(skin, name) {
  const look = SKINS[name];
  skin.defs.replaceChildren();
  skin.parts = {
    base: gradient(skin.defs, look.linear ? 'linearGradient' : 'radialGradient', 'skin-base',
      look.linear ? { x1: '.05', y1: '.05', x2: '.85', y2: '.98' } : { cx: '.32', cy: '.17', r: '.95' },
      look.base.map((color, index) => [index / 3, color])),
    shine: gradient(skin.defs, 'radialGradient', 'skin-shine', { cx: '.30', cy: '.12', r: '.70' },
      [[0, '#fff', look.shine], [.23, '#fff', look.shine * .30], [.65, '#fff', .035], [1, '#fff', 0]]),
    volume: gradient(skin.defs, 'radialGradient', 'skin-volume', { cx: '.43', cy: '.30', r: '.76' },
      [[0, '#091126', 0], [.58, '#091126', 0], [.82, '#091126', look.shade * .27], [1, '#091126', look.shade]]),
    rim: gradient(skin.defs, 'linearGradient', 'skin-rim', { x1: '0', y1: '0', x2: '1', y2: '1' },
      [[0, '#fff', .95], [.28, look.rim, .60], [.52, look.rim, .06], [.82, look.rim, .13], [1, look.rim, .65]]),
    edge: gradient(skin.defs, 'radialGradient', 'skin-edge', { cx: '.88', cy: '.83', r: '.55' },
      [[0, look.rim, .25], [.65, look.rim, .035], [1, look.rim, 0]]),
    antenna: gradient(skin.defs, 'radialGradient', 'skin-antenna', { cx: '.28', cy: '.20', r: '.85' },
      [[0, look.antenna[0]], [.43, look.antenna[1]], [1, look.antenna[2]]]),
  };
  gradient(skin.defs, 'radialGradient', 'skin-ground', {},
    [[0, '#0a1020', .27], [.5, '#0a1020', .10], [1, '#0a1020', 0]]);
  skin.shown = {};
  skin.style.textContent = `
    #leftBase,#rightBase,#leftInputBase,#rightInputBase{fill:${look.eye}}
    #antennaDot{fill:url(#skin-antenna);stroke:${look.rim};stroke-width:.7px}`;
}

function set(skin, node, key, attribute, value) {
  const text = value.toFixed(3);
  const id = `${key}.${attribute}`;
  if (skin.shown[id] === text) return;
  skin.shown[id] = text;
  node.setAttribute(attribute, text);
}

function applyLight(skin, x, y) {
  const { parts, ground } = skin;
  const cx = .5 + x * .30;
  const cy = .30 + y * .17;
  if (skin.name !== 'aurora') {
    set(skin, parts.base, 'base', 'cx', cx);
    set(skin, parts.base, 'base', 'cy', cy);
  }
  set(skin, parts.shine, 'shine', 'cx', cx);
  set(skin, parts.shine, 'shine', 'cy', cy - .10);
  set(skin, parts.volume, 'volume', 'cx', .5 + x * .12);
  set(skin, parts.volume, 'volume', 'cy', .35 + y * .08);
  set(skin, parts.edge, 'edge', 'cx', .5 - x * .42);
  set(skin, parts.edge, 'edge', 'cy', .75 - y * .12);
  set(skin, parts.rim, 'rim', 'x1', .5 + x * .5);
  set(skin, parts.rim, 'rim', 'x2', .5 - x * .5);
  set(skin, parts.antenna, 'antenna', 'cx', cx);
  set(skin, parts.antenna, 'antenna', 'cy', Math.max(.1, cy));
  set(skin, ground, 'ground', 'cx', 120 - x * 11);
}

function render(instance) {
  const name = instance._skinName ?? null;
  if (!name && !instance._skin) return;
  if (!instance._skin) instance._skin = build(instance);
  const skin = instance._skin;
  if (!skin || skin.name === name) return;
  skin.name = name;
  const head = instance._head;
  if (name) {
    paintSkin(skin, name);
    head.setAttribute('fill', 'url(#skin-base)');
    skin.layers.style.display = '';
    skin.ground.style.display = '';
    applyLight(skin, skin.light.x, skin.light.y);
  } else {
    skin.style.textContent = '';
    skin.layers.style.display = 'none';
    skin.ground.style.display = 'none';
    baseApplyColor.call(instance, instance.getAttribute('color'));
  }
}

// The light follows the pointer the same way the eyes do, and rests at the
// upper left when the pointer is away, following is off, or motion is reduced.
function updateLight(instance) {
  const skin = instance._skin;
  if (!skin?.name) return;
  const pointer = instance._pointer;
  const follows = instance._pointerFollowEnabled !== false && !instance._isReducedMotion?.()
    && pointer?.active && pointer.lastMove > 0;
  const pull = follows ? Math.pow(clamp(pointer.influence || 0, 0, 1), .7) : 0;
  const tx = REST_LIGHT.x + (clamp(pointer?.x / 48, -1, 1) - REST_LIGHT.x) * pull;
  const ty = REST_LIGHT.y + (clamp(pointer?.y / 34, -1, 1) - REST_LIGHT.y) * pull;
  if (instance._isReducedMotion?.()) {
    skin.light.x = tx;
    skin.light.y = ty;
  } else {
    skin.light.x += ((Number.isFinite(tx) ? tx : REST_LIGHT.x) - skin.light.x) * .18;
    skin.light.y += ((Number.isFinite(ty) ? ty : REST_LIGHT.y) - skin.light.y) * .18;
  }
  applyLight(skin, skin.light.x, skin.light.y);
}

// The runtime's attribute observer calls this when the skin attribute changes
// and once on connect. An unknown name in markup falls back to no skin with a
// console notice, so an invalid attribute never breaks the page; setSkin()
// throws instead.
proto._applySkinAttribute = function() {
  const value = this.getAttribute('skin');
  if (normalizeSkin(value) === undefined) {
    console.warn(`agent-robot-avatar: unknown skin "${value}". Use ${SKIN_NAMES.join(', ')} or none.`);
    this.setSkin(null);
  } else {
    this.setSkin(value);
  }
};

proto.setSkin = function(value = null) {
  const name = normalizeSkin(value);
  if (name === undefined) throw new Error(`Unknown Agent Robot Avatar skin: ${value}`);
  this._skinName = name;
  render(this);
  this._resumeFrames?.();
  return this;
};

proto.getSkin = function() {
  return this._skinName ?? null;
};

// A skin keeps the head paint even when the color attribute changes; removing
// the skin brings the color back.
proto._applyColor = function(value) {
  baseApplyColor.call(this, value);
  if (this._skinName && this._head) {
    this._head.setAttribute('fill', 'url(#skin-base)');
  }
};

registerAvatarExtension({
  name: 'skins',
  draw() {
    updateLight(this);
  },
});

export { AgentRobotAvatar, SKINS, SKIN_NAMES };
export default AgentRobotAvatar;
