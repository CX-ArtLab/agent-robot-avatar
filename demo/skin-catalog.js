import { applyMaterial, clearMaterial } from './materials/material-library.js';
import {approvedCategories,approvedSkins} from './materials/approved-catalog.js';
import {applyApprovedPaint,applyCatalogMaterial} from './materials/catalog-appearance.js';
export {approvedCategories as catalogCategories};

const originals = {
  obsidian: ['曜石黑', 'OBSIDIAN', '深色石面 · 柔亮边缘'],
  porcelain: ['白瓷', 'PORCELAIN', '温润白釉 · 深色眼眸'],
  aurora: ['流光彩色', 'AURORA', '青紫渐变 · 珠光边缘'],
  candy: ['糖果条纹', 'CANDY', '奶油粉色 · 斜纹糖衣'],
  jelly: ['薄荷果冻', 'JELLY', '半透明机身 · 水润亮边'],
  metal: ['拉丝金属', 'BRUSHED METAL', '银灰反光 · 细密拉丝'],
  clay: ['磨砂陶土', 'TERRACOTTA', '暖陶土色 · 柔和哑光'],
  polka: ['奶油波点', 'POLKA DOTS', '葡萄紫色 · 奶油圆点'],
  pixel: ['像素电玩', 'PIXEL ARCADE', '深青机身 · 像素花纹'],
};
const groups = {
  metal: ['translucent', 'silver', 'pillow-metal', 'deep-silver-metal', 'gold-metal', 'copper-metal', 'reference-metal'],
  glaze: ['blue-glaze', 'ice-glaze', 'gloss'],
  soft: ['soft', 'fabric'],
  natural: ['wood', 'nature'],
};
export const filters = [
  ['featured', '精选'], ['all', '全部'], ['metal', '金属'], ['glaze', '釉面与透明'],
  ['soft', '柔软'], ['natural', '自然'], ['pattern', '图案'],
];
// One representative per visual treatment, interleaved across families.
export const featured = ['blueglaze','woodmaple','denim','silverdrop',
  'gallery-soccer-grooves','porcelain','gallery-glow-blue','gallery-pixel','knit','gallery-ruby','candy',
  'gallery-marble','leather','galaxy','bamboo'];

export const catalog = [
  { id: 'classic', label: '经典黑', english: 'ORIGINAL', description: '', group: 'pattern' },
  ...Object.entries(approvedSkins).map(([id, skin]) => {
    const fallback = originals[id];
    const category = approvedCategories.find(item => item.names.includes(id))?.id;
    let group = Object.entries(groups).find(([, names]) => names.includes(category))?.[0] || 'pattern';
    if (['metal', 'gold', 'copper', 'carbon'].includes(id)) group = 'metal';
    if (['porcelain', 'marble', 'clay', 'sandstone', 'ceramicblue'].includes(id)) group = 'natural';
    return { ...skin, id, label: skin.label || fallback?.[0] || id,
      english: skin.english || fallback?.[1] || id.toUpperCase(), description: skin.description || fallback?.[2] || '', group };
  }),
];
export const publicSkins = catalog.filter(skin => skin.id !== 'classic');
export const skinById = new Map(catalog.map(skin => [skin.id, skin]));
export const SKIN_STORAGE_KEY = 'agentRobotAvatarDemoSkin';

export function storedSkin() {
  try { return localStorage.getItem(SKIN_STORAGE_KEY); } catch { return null; }
}

export function applySkin(avatar, id, options) {
  activeSkins.get(avatar)?.dispose();
  clearMaterial(avatar);
  const selected = skinById.has(id) ? id : 'classic';
  avatar.dataset.skin = selected;
  if(selected==='classic'){activeSkins.delete(avatar);return null;}
  const skin=skinById.get(selected);
  const material=applyApprovedPaint(avatar,selected,skin.nativeSkin?applyCatalogMaterial(avatar,skin,options):applyMaterial(avatar,selected,options));
  activeSkins.set(avatar,material);
  return material;
}
const activeSkins=new WeakMap();

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
  const material = applySkin(avatar, id);
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
  material?.dispose();
  thumbnails.set(id, url);
  return url;
}
