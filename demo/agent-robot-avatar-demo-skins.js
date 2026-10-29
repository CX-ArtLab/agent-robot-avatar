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
// The way into the skins: its own button under the controls, with the usual
// "opens another page" mark so it never reads as a panel toggle.
const skinButton = document.createElement('a');
skinButton.className = 'demo-skin-page-link is-new';
skinButton.href = './skins.html';
skinButton.dataset.skinLink = '';
// The icon is a picture of skin 103, so the demo page loads no skin code for it.
skinButton.innerHTML = '<img class="demo-skin-head" src="./skin-entry.webp" width="24" height="24" alt="">'
  + '<span></span>'
  + '<svg class="demo-skin-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/></svg>';
document.querySelector('.demo-control-stack').append(skinButton);

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
  skinButton.querySelector('span').textContent = t('entry');
  skinButton.title = t('openSkins');
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
