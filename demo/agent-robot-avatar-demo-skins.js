import { restoreAppearance, saveAppearance } from './agent-robot-avatar-demo-appearance.js';
import { t, settleNewDots } from './skins-i18n.js';
const face = document.getElementById('face');
const navigation = document.createElement('nav');
navigation.className = 'demo-nav';
navigation.setAttribute('aria-label', '页面导航');
navigation.innerHTML = '<a href="./index.html" aria-current="page">演示</a><a href="./skins.html" data-skin-link>皮肤</a>';
document.getElementById('canvas').append(navigation);
const skinsTab = navigation.querySelector('[data-skin-link]');
skinsTab.classList.add('is-new');
skinsTab.dataset.newKey = 'nav-skins';
// The way into the skins: its own button under the controls, apart from the
// panel toggles.
const skinButton = document.createElement('a');
skinButton.className = 'demo-skin-page-link';
skinButton.href = './skins.html';
skinButton.dataset.skinLink = '';
// The icon is a picture of skin 402, so the demo page loads no skin code for it.
skinButton.innerHTML = '<img class="demo-skin-head" src="./skin-entry.webp" width="24" height="24" alt="">'
  + '<span></span>';
document.querySelector('.demo-control-stack').append(skinButton);

restoreAppearance();

function updateLinks() {
  const links = navigation.querySelectorAll('a');
  links[0].textContent = t('demo');
  links[1].textContent = t('skins');
  skinButton.querySelector('span').textContent = t('entry');
  skinButton.title = t('openSkins');
  for (const link of document.querySelectorAll('[data-skin-link]')) {
    const url = new URL('./skins.html', location.href);
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
updateLinks();
settleNewDots();
