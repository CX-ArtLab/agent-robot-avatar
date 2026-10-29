import { restoreAppearance, saveAppearance } from './agent-robot-avatar-demo-appearance.js';
import { t } from './skins-i18n.js';
const face = document.getElementById('face');
const params = new URLSearchParams(location.search);
const storageKey = 'agentRobotAvatarDemoSkin';
const navigation = document.createElement('nav');
navigation.className = 'demo-nav';
navigation.setAttribute('aria-label', '页面导航');
navigation.innerHTML = '<a href="./index.html" aria-current="page">演示</a><a href="./skins.html" data-skin-link>皮肤</a>';
document.getElementById('canvas').append(navigation);
// A labelled way into the skins, next to the color tools.
const skinButton = document.createElement('a');
skinButton.className = 'demo-panel-toggle demo-skin-button is-new';
skinButton.href = './skins.html';
skinButton.dataset.skinLink = '';
skinButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="8" width="16" height="12.5" rx="4"/><path d="M12 8V5"/><circle cx="12" cy="4" r="1.2"/><circle class="demo-skin-eye" cx="9.4" cy="14.2" r="1.5"/><circle class="demo-skin-eye" cx="14.6" cy="14.2" r="1.5"/></svg><span></span>';
document.getElementById('demoColorsGroup').append(skinButton);

restoreAppearance();

let selected = params.get('skin');
if (!selected) try { selected = localStorage.getItem(storageKey); } catch {}
let library;
if (selected && selected !== 'classic') {
  library = await import('./skin-catalog.js');
  selected = library.skinById.has(selected) ? selected : 'classic';
  library.applySkin(face, selected);
  // The stage takes the skin's own background, as on the skin pages.
  document.getElementById('demoStage').style.background = library.skinById.get(selected)?.stage || '';
}
selected ||= 'classic';
face.dataset.skin = selected;

function updateLinks() {
  const links = navigation.querySelectorAll('a');
  links[0].textContent = t('demo');
  links[1].textContent = t('skins');
  skinButton.querySelector('span').textContent = t('skins');
  skinButton.title = t('skins');
  for (const link of document.querySelectorAll('[data-skin-link]')) {
    const url = new URL('./skins.html', location.href);
    url.searchParams.set('skin', selected);
    url.searchParams.set('lang', document.documentElement.lang);
    link.href = url.href;
  }
}
new MutationObserver(updateLinks).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
for (const link of document.querySelectorAll('[data-skin-link]')) {
  link.addEventListener('click', saveAppearance);
  // Fetch the skin page's code while the pointer is on its way to the link.
  link.addEventListener('pointerenter', warmSkinPage, { once: true });
  link.addEventListener('focus', warmSkinPage, { once: true });
}
function warmSkinPage() {
  for (const href of ['./skins.js', './skin-catalog.js', '../src/skins/paints.js', '../src/skins/native.js', '../src/skins/material-library.js']) {
    if (document.querySelector(`link[rel="modulepreload"][href="${href}"]`)) continue;
    document.head.append(Object.assign(document.createElement('link'), { rel: 'modulepreload', href }));
  }
}

// Manual color controls return to the plain surface, so a previous material
// never obscures a user's chosen head color or leaves masked eyelids behind.
function useCustomColor() {
  if (selected === 'classic') return;
  library?.applySkin(face, 'classic');
  document.getElementById('demoStage').style.background = '';
  selected = 'classic';
  face.dataset.skin = 'classic';
  try { localStorage.setItem(storageKey, 'classic'); } catch {}
  const url = new URL(location.href);
  url.searchParams.set('skin', 'classic');
  history.replaceState(null, '', url);
  updateLinks();
}
document.getElementById('demoHeadColor').addEventListener('input', useCustomColor, true);
document.getElementById('demoEyeThrough').addEventListener('change', useCustomColor, true);
document.getElementById('demoReset').addEventListener('click', useCustomColor, true);
updateLinks();

for (const id of ['demoRandomColors', 'demoSwapColors', 'demoStageReset', 'demoColorPresets']) {
  document.getElementById(id).addEventListener('click', useCustomColor, true);
}
