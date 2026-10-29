import AgentRobotAvatar, { registerAvatarExtension } from './agent-robot-avatar-extension-host.js';
import { SKIN_CATALOG, SKIN_SERIES } from './skins/catalog.js';

// The painters are large, so they load the first time a skin needs them. A page
// that never uses a skin never downloads them.
const painters = {};
const loading = {};
function loadPainter(kind) {
  loading[kind] ??= Promise.all([
    import('./skins/paints.js'),
    kind === 'native' ? import('./skins/native.js') : import('./skins/material-library.js'),
    import('./skins/eyelids.js'),
  ]).then(([paints, painter, eyelids]) => {
    painters.paints = paints.SKIN_PAINTS;
    painters.maskEyelids = eyelids.maskEyelids;
    painters[kind] = painter;
  });
  return loading[kind];
}

/** Loads every skin painter now, so later skins show on the same frame they are set. */
function loadSkins() {
  return Promise.all([loadPainter('native'), loadPainter('material')]).then(() => undefined);
}

const proto = AgentRobotAvatar.prototype;
const baseApplyColor = proto._applyColor;

// Skins are numbered. The number is the permanent public name; the Chinese and
// English titles are for display and may be reworded later. SKIN_NAMES lists
// them in display order, series by series.
const SKIN_NAMES = Object.freeze(SKIN_SERIES.flatMap(series => series.skins));
const SKINS = Object.freeze(Object.fromEntries(Object.entries(SKIN_CATALOG).map(([id, skin]) => [id,
  Object.freeze({ series: skin.series, title: skin.zh, titleEn: skin.en, base: Object.freeze([...skin.base]) })])));
const SERIES = Object.freeze(SKIN_SERIES.map(series => Object.freeze({
  id: series.id, number: series.number, title: series.zh, titleEn: series.en, skins: Object.freeze([...series.skins]),
})));

const REST_LIGHT = Object.freeze({ x: -0.5, y: -0.5 });
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function normalizeSkin(value) {
  const text = String(value ?? '').trim().toLowerCase();
  if (!text || text === 'none') return null;
  const name = /^\d+$/.test(text) ? String(Number(text)) : text;
  return Object.hasOwn(SKIN_CATALOG, name) ? name : undefined;
}

// Hand adjustments from the skin workshop, applied after a skin is painted.
// A record names an element by id or selector, optionally a child path, and the
// attributes to set on it.
function findPainted(root, record) {
  let node = record.id ? root.getElementById(record.id) : root.querySelector(record.selector);
  for (const index of record.path || []) node = node?.children[index];
  return node;
}

// Some adjustments touch layers every skin shares, so each change is recorded
// and undone before the next skin is painted.
function paintAdjustments(instance, name) {
  const records = painters.paints[name]?.paint || [];
  const root = instance.shadowRoot;
  const undo = instance._skinUndo ??= [];
  for (const record of records) {
    const node = findPainted(root, record);
    if (!node) continue;
    for (const [attribute, value] of Object.entries(record.attributes)) {
      undo.push(() => {
        if (old === null) node.removeAttribute(attribute);
        else node.setAttribute(attribute, old);
      });
      const old = node.getAttribute(attribute);
      node.setAttribute(attribute, value);
    }
  }
  for (const [property, value] of Object.entries(painters.paints[name]?.properties || {})) {
    const old = instance.style.getPropertyValue(property);
    undo.push(() => old ? instance.style.setProperty(property, old) : instance.style.removeProperty(property));
    instance.style.setProperty(property, value);
  }
}

function undoAdjustments(instance) {
  const undo = instance._skinUndo;
  while (undo?.length) undo.pop()();
}

// Adjustments to light-driven attributes were made with the light at rest. They
// become offsets so they move with the light instead of being overwritten.
function adjustNative(instance, skin, name) {
  const { lightNative } = painters.native;
  const { x, y } = skin.light;
  lightNative(instance, REST_LIGHT.x, REST_LIGHT.y);
  const resting = Object.entries(skin.nodes).map(([key, node]) => {
    const attribute = key.slice(key.lastIndexOf('.') + 1);
    return { key, node, attribute, value: parseFloat(node.getAttribute(attribute)) };
  });
  paintAdjustments(instance, name);
  for (const { key, node, attribute, value } of resting) {
    const adjusted = parseFloat(node.getAttribute(attribute));
    if (Number.isFinite(adjusted) && Number.isFinite(value) && adjusted !== value) skin.offsets[key] = adjusted - value;
  }
  skin.shown = {};
  lightNative(instance, x, y);
}

function adjustMaterial(instance, material, name) {
  const records = painters.paints[name]?.paint || [];
  const root = instance.shadowRoot;
  const key = SKIN_CATALOG[name].material;
  const offsets = [];
  for (const lightKey of material.lightKeys || []) {
    const [suffix, attribute] = lightKey.split(':');
    const record = records.find(r => r.id === `material-${key}-${suffix}` && !r.path?.length);
    const node = record && findPainted(root, record);
    const value = record?.attributes[attribute];
    if (node && value != null) offsets.push({ node, attribute, delta: parseFloat(value) - parseFloat(node.getAttribute(attribute)) });
  }
  paintAdjustments(instance, name);
  const light = material.light.bind(material);
  material.light = (x, y) => {
    light(x, y);
    for (const { node, attribute, delta } of offsets) node.setAttribute(attribute, parseFloat(node.getAttribute(attribute)) + delta);
  };
}

function render(instance) {
  const name = instance._skinName ?? null;
  if (instance._skinShown === name || !instance._head) return;
  const entry = name ? SKIN_CATALOG[name] : null;
  const kind = entry ? (entry.native ? 'native' : 'material') : null;
  if (kind && !painters[kind]) {
    // Draw it once the painter arrives, unless another skin was chosen meanwhile.
    if (instance._skinPending !== name) {
      instance._skinPending = name;
      loadPainter(kind).then(() => {
        instance._skinPending = undefined;
        if ((instance._skinName ?? null) === name) render(instance);
      });
    }
    return;
  }
  const { showNative } = painters.native || {};
  undoAdjustments(instance);
  instance._material?.dispose();
  instance._material = null;
  if (!entry?.native) showNative?.(instance, null);
  instance._skinShown = name;
  // Without a skin the head takes the current color attribute again.
  if (!entry) {
    baseApplyColor.call(instance, instance.getAttribute('color'));
    return;
  }
  if (entry.native) {
    // Frames may stop as soon as love ends, so the joined heart is split here.
    if (!instance._skinLoveEnd) {
      instance._skinLoveEnd = event => {
        if (event.detail?.state !== 'love') painters.native?.separateNativeEyes(instance);
      };
      instance.addEventListener('face-state', instance._skinLoveEnd);
    }
    const skin = showNative(instance, entry.native);
    if (skin) {
      const light = instance._skinLight;
      if (light) { skin.light.x = light.x; skin.light.y = light.y; }
      adjustNative(instance, skin, name);
    }
  } else {
    // The lids cut the eyes through a mask, so the head paint shows behind them.
    painters.maskEyelids(instance);
    const material = painters.material.applyMaterial(instance, entry.material);
    adjustMaterial(instance, material, name);
    instance._material = material;
    instance._materialLight = null;
  }
}

// The light follows the pointer the same way the eyes do, and rests at the
// upper left when the pointer is away, following is off, or motion is reduced.
function updateLight(instance) {
  const name = instance._skinShown;
  if (!name) return;
  const pointer = instance._pointer;
  const reduced = instance._isReducedMotion?.();
  const follows = instance._pointerFollowEnabled !== false && !reduced && pointer?.active && pointer.lastMove > 0;
  const pull = follows ? Math.pow(clamp(pointer.influence || 0, 0, 1), .7) : 0;
  // Pages can pin the light with _skinFixedLight = { x, y } in [-1, 1].
  const fixed = instance._skinFixedLight;
  const tx = fixed ? fixed.x : REST_LIGHT.x + (clamp(pointer?.x / 48, -1, 1) - REST_LIGHT.x) * pull;
  const ty = fixed ? fixed.y : REST_LIGHT.y + (clamp(pointer?.y / 34, -1, 1) - REST_LIGHT.y) * pull;
  const light = instance._skinLight ??= { ...REST_LIGHT };
  if (reduced) {
    light.x = tx;
    light.y = ty;
  } else {
    light.x += ((Number.isFinite(tx) ? tx : REST_LIGHT.x) - light.x) * .18;
    light.y += ((Number.isFinite(ty) ? ty : REST_LIGHT.y) - light.y) * .18;
  }
  if (SKIN_CATALOG[name].native) {
    painters.native.joinNativeEyes(instance);
    painters.native.lightNative(instance, light.x, light.y);
  } else if (instance._material) {
    const last = instance._materialLight;
    if (last && Math.abs(last.x - light.x) < .0005 && Math.abs(last.y - light.y) < .0005) return;
    instance._materialLight = { x: light.x, y: light.y };
    instance._material.light(light.x, light.y);
  }
}

// The runtime's attribute observer calls this when the skin attribute changes
// and once on connect. An unknown name in markup falls back to no skin with a
// console notice, so an invalid attribute never breaks the page; setSkin()
// throws instead.
proto._applySkinAttribute = function() {
  const value = this.getAttribute('skin');
  if (normalizeSkin(value) === undefined) {
    console.warn(`agent-robot-avatar: unknown skin "${value}". Use a skin number such as ${SKIN_NAMES[0]}, or none.`);
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
  const entry = this._skinShown ? SKIN_CATALOG[this._skinShown] : null;
  if (!entry || !this._head) return;
  this._head.setAttribute('fill', entry.native ? 'url(#skin-base)' : `url(#material-${entry.material}-base)`);
};

registerAvatarExtension({
  name: 'skins',
  draw() {
    // A skin set before the avatar was ready is shown on its first frame.
    if ((this._skinName ?? null) !== (this._skinShown ?? null)) render(this);
    updateLight(this);
  },
});

export { AgentRobotAvatar, SKINS, SKIN_NAMES, SERIES as SKIN_SERIES, loadSkins };
export default AgentRobotAvatar;
