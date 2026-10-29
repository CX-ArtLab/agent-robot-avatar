import { SKINS, SKIN_NAMES, SKIN_SERIES } from '../agent-robot-avatar.js';
import { featured, demoSkins } from './skin-catalog-data.js';

// The demo shows the component's own numbered skins. Pages here add only what a
// showcase needs: filters, stage colors, a demo-only floor shadow, and a light
// that follows the pointer over the whole stage.
export { featured };
export const catalogCategories = SKIN_SERIES.map(series => ({ id: series.id, label: series.title, labelEn: series.titleEn, names: [...series.skins] }));
export const filters = [
  ['featured', '精选'], ['all', '全部'], ['metal', '金属'], ['glaze', '釉面与透明'],
  ['soft', '柔软'], ['natural', '自然'], ['pattern', '图案'],
];

export const catalog = [
  { id: 'classic', label: '经典黑', english: 'ORIGINAL', description: '', group: 'pattern' },
  ...SKIN_NAMES.map(id => ({
    id, label: SKINS[id].title, english: SKINS[id].titleEn, description: '', base: SKINS[id].base,
    group: demoSkins[id].group, stage: demoSkins[id].stage,
  })),
];
export const publicSkins = catalog.filter(skin => skin.id !== 'classic');
export const skinById = new Map(catalog.map(skin => [skin.id, skin]));
export const SKIN_STORAGE_KEY = 'agentRobotAvatarDemoSkin';

export function storedSkin() {
  try { return localStorage.getItem(SKIN_STORAGE_KEY); } catch { return null; }
}

const FLOOR_SHADOW = 'radial-gradient(35.4% 5.8% at 50% 92.1%,rgba(10,16,32,.27),rgba(10,16,32,.1) 50%,transparent)';
const active = new WeakMap();

// Puts a skin on an avatar and returns the preview controls for it.
export function applySkin(avatar, id, { groundShadow = false } = {}) {
  active.get(avatar)?.dispose();
  const selected = skinById.has(id) ? id : 'classic';
  avatar.dataset.skin = selected;
  if (selected === 'classic') {
    avatar.setSkin(null);
    active.delete(avatar);
    return null;
  }
  let original = false;
  const shadow = () => { avatar.style.background = groundShadow && !original ? FLOOR_SHADOW : ''; };
  avatar.setSkin(selected);
  shadow();
  const controls = {
    setOriginal(value) { original = Boolean(value); avatar.setSkin(original ? null : selected); shadow(); },
    setGroundShadow(value) { groundShadow = Boolean(value); shadow(); },
    light(x, y) { avatar._skinFixedLight = { x, y }; avatar._resumeFrames?.(); },
    dispose() { avatar.setSkin(null); avatar.style.background = ''; delete avatar._skinFixedLight; active.delete(avatar); },
  };
  active.set(avatar, controls);
  return controls;
}

// Render thumbnails from the real component without starting an animation loop
// or registering hundreds of pointer listeners in the gallery.
const thumbnails = new Map();
export function skinThumbnail(id) {
  if (thumbnails.has(id)) return thumbnails.get(id);
  const avatar = document.createElement('agent-robot-avatar');
  avatar.setAttribute('motion', 'reduce');
  // The antenna and flattened geometry are initialized by the component's
  // draw extensions. Draw once while detached; no RAF or global listeners.
  avatar._draw(performance.now());
  avatar.setSkin(id === 'classic' ? null : id);
  const root = avatar.shadowRoot;
  const svg = root.querySelector('svg').cloneNode(true);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', '240');
  svg.setAttribute('height', '240');
  svg.setAttribute('style', avatar.style.cssText);
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = [...root.querySelectorAll('style')].map(node => node.textContent).join('\n');
  svg.prepend(style);
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }));
  avatar.setSkin(null);
  thumbnails.set(id, url);
  return url;
}
