import './agent-robot-avatar-demo.js';
import { restoreAppearance, saveAppearance } from './agent-robot-avatar-demo-appearance.js';
import { publicSkins, skinById, featured, filters, applySkin, skinThumbnail, storedSkin, SKIN_STORAGE_KEY } from './skin-catalog.js';

// New skin copy is reviewed in Chinese first. Existing demo strings and language
// switching remain owned by the shared demo, including all chat messages.
const face = document.getElementById('face');
const canvas = document.getElementById('canvas');
const overlay = document.getElementById('agentOverlay');
const grid = document.getElementById('skin-grid');
const search = document.getElementById('skin-search');
const header = document.getElementById('page-header');
header.append(document.querySelector('.title'), document.getElementById('agent-demo-build'));
const name = document.createElement('p');
name.id = 'skin-name';
name.className = 'skin-name';
name.setAttribute('aria-live', 'polite');
document.getElementById('demoStage').append(name);

const skinOptions = document.createElement('div');
skinOptions.className = 'demo-options-group skin-options';
skinOptions.setAttribute('aria-label', '皮肤预览设置');
skinOptions.innerHTML = `
  <button type="button" id="compare" aria-pressed="false">对比原版</button>
  <label class="demo-option demo-toggle"><span>光线跟随</span><input type="checkbox" id="follow-light" checked><span class="demo-switch" aria-hidden="true"></span></label>
  <label class="demo-option demo-toggle"><span>地面阴影</span><input type="checkbox" id="ground-shadow" checked><span class="demo-switch" aria-hidden="true"></span></label>`;
document.querySelector('.demo-options').append(skinOptions);
const applyLink = document.createElement('a');
applyLink.id = 'apply-skin';
applyLink.className = 'demo-skin-entry';
applyLink.textContent = '在演示中查看';
applyLink.href = './index.html';
document.querySelector('.library-footer').prepend(applyLink);
const compare = document.getElementById('compare');
const light = document.getElementById('follow-light');
const shadow = document.getElementById('ground-shadow');
const params = new URLSearchParams(location.search);
let selected = [params.get('skin'), storedSkin(), '2'].find(id => id !== 'classic' && skinById.has(id));
let category = filters.some(([id]) => id === params.get('view')) ? params.get('view') : 'featured';
search.value = params.get('q') || '';
let material;
document.getElementById('collection-count').textContent = `${publicSkins.length} 款`;
// Reuse the demo styling and valid preview controls, not its color tools.
// Cloning the dice drops the original palette listener completely.
const randomSkin = document.getElementById('demoRandomColors').cloneNode(true);
randomSkin.id = 'random-skin';
randomSkin.classList.remove('is-new');
randomSkin.classList.add('skin-random');
randomSkin.title = '随机皮肤';
randomSkin.setAttribute('aria-label', '随机皮肤');
const randomLabel = document.createElement('span');
randomLabel.textContent = '随机皮肤';
randomSkin.append(randomLabel);
document.getElementById('demoColorsGroup').replaceChildren(randomSkin);
document.getElementById('demoColorPanel').remove();
document.getElementById('demoStageReset').remove();
document.querySelector('.controls [data-action="random"]')?.remove();
restoreAppearance();
randomSkin.addEventListener('click', () => {
  const choices = publicSkins.filter(skin => skin.id !== selected);
  selectSkin(choices[Math.floor(Math.random() * choices.length)].id);
});

const thumbnails = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const img = entry.target;
    img.src = skinThumbnail(img.dataset.skin);
    thumbnails.unobserve(img);
  }
}, { rootMargin: '160px' });

for (const [id, name] of filters) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = name;
  button.dataset.filter = id;
  button.setAttribute('aria-pressed', String(id === category));
  button.addEventListener('click', () => { category = id; search.value = ''; writeRoute(true); renderCards(); });
  document.getElementById('skin-filters').append(button);
}

function renderCards() {
  document.getElementById('skin-home').hidden = category === 'featured' && !search.value.trim();
  thumbnails.disconnect();
  const query = search.value.trim().toLocaleLowerCase();
  const effectiveCategory = category === 'featured' && query ? 'all' : category;
  const list = effectiveCategory === 'featured'
    ? featured.map(id => skinById.get(id)).filter(Boolean)
    : publicSkins.filter(skin => effectiveCategory === 'all' || skin.group === effectiveCategory);
  const matches = list.filter(skin => `${skin.label} ${skin.english} ${skin.description}`.toLocaleLowerCase().includes(query));
  const fragment = document.createDocumentFragment();
  for (const skin of matches) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'skin-card';
    card.dataset.skin = skin.id;
    card.setAttribute('aria-pressed', String(skin.id === selected));
    card.setAttribute('aria-label', skin.label);
    const img = document.createElement('img');
    img.alt = '';
    img.width = 80;
    img.height = 80;
    img.dataset.skin = skin.id;
    const label = document.createElement('span');
    label.textContent = skin.label;
    card.append(img, label);
    fragment.append(card);
    thumbnails.observe(img);
  }
  grid.replaceChildren(fragment);
  grid.scrollTop = 0;
  grid.hidden = !matches.length;
  document.getElementById('empty-state').hidden = !!matches.length;
  document.getElementById('results-label').textContent = query ? '搜索结果' : filters.find(([id]) => id === effectiveCategory)[1];
  document.getElementById('results-count').textContent = `${matches.length} 款`;
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === effectiveCategory)));
}

function writeRoute(push = false) {
  const url = new URL(location.href);
  url.searchParams.set('skin', selected);
  url.searchParams.set('lang', document.documentElement.lang);
  if (category === 'featured') url.searchParams.delete('view');
  else url.searchParams.set('view', category);
  if (search.value.trim()) url.searchParams.set('q', search.value.trim());
  else url.searchParams.delete('q');
  if (url.href !== location.href) history[push ? 'pushState' : 'replaceState'](null, '', url);
  updateLinks();
}

function updateLinks() {
  const destination = new URL('./index.html', location.href);
  destination.searchParams.set('skin', selected);
  destination.searchParams.set('lang', document.documentElement.lang);
  applyLink.href = destination.href;
  document.getElementById('demo-link').href = destination.href;
  const home = new URL('./skins.html', location.href);
  home.search = destination.search;
  document.querySelector('.demo-nav [aria-current="page"]').href = home.href;
  document.getElementById('skin-home').href = home.href;
  const gallery = new URL('./materials/index.html', location.href);
  gallery.search = destination.search;
  document.getElementById('all-skins-link').href = gallery.href;
}

function goHome(event) {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  category = 'featured';
  search.value = '';
  writeRoute(true);
  renderCards();
}
document.getElementById('skin-home').addEventListener('click', goHome);
document.querySelector('.demo-nav [aria-current="page"]').addEventListener('click', goHome);
window.addEventListener('popstate', () => {
  const route = new URLSearchParams(location.search);
  category = filters.some(([id]) => id === route.get('view')) ? route.get('view') : 'featured';
  search.value = route.get('q') || '';
  selectSkin(route.get('skin') !== 'classic' && skinById.has(route.get('skin')) ? route.get('skin') : selected, false);
  renderCards();
});

function syncShadow() {
  const enabled = shadow.checked && !overlay.classList.contains('open');
  material?.setGroundShadow(enabled);
  face.dataset.shadow = enabled ? 'on' : 'off';
}

function selectSkin(id, updateUrl = true) {
  const skin = skinById.get(id);
  if (!skin) return;
  if (selected !== id) face.reset();
  selected = id;
  compare.setAttribute('aria-pressed', 'false');
  compare.textContent = '对比原版';
  compare.disabled = id === 'classic';
  material = applySkin(face, id);
  syncShadow();
  name.textContent = skin.label;
  for (const card of grid.querySelectorAll('.skin-card')) card.setAttribute('aria-pressed', String(card.dataset.skin === id));
  if (updateUrl) writeRoute();
  updateLinks();
}

grid.addEventListener('click', event => {
  const card = event.target.closest('.skin-card');
  if (card) selectSkin(card.dataset.skin);
});
search.addEventListener('input', () => { writeRoute(); renderCards(); });
document.getElementById('clear-search').addEventListener('click', () => {
  search.value = '';
  category = 'all';
  writeRoute(true);
  renderCards();
  search.focus();
});
compare.addEventListener('click', () => {
  const original = compare.getAttribute('aria-pressed') !== 'true';
  material?.setOriginal(original);
  compare.setAttribute('aria-pressed', String(original));
  compare.textContent = original ? '返回皮肤' : '对比原版';
  name.textContent = original ? '原版（对比）' : skinById.get(selected).label;
});
canvas.addEventListener('pointermove', event => {
  if (!light.checked) return;
  const bounds = canvas.getBoundingClientRect();
  material?.light((event.clientX - bounds.left) / bounds.width * 2 - 1, (event.clientY - bounds.top) / bounds.height * 2 - 1);
});
function resetLight() { material?.light(-.5, -.5); }
canvas.addEventListener('pointerleave', resetLight);
light.addEventListener('change', resetLight);
shadow.addEventListener('change', syncShadow);
new MutationObserver(syncShadow).observe(overlay, { attributes: true, attributeFilter: ['class'] });
new MutationObserver(updateLinks).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
for (const link of [applyLink, document.getElementById('demo-link')]) link.addEventListener('click', () => {
  saveAppearance();
  try { localStorage.setItem(SKIN_STORAGE_KEY, selected); } catch { /* URL also carries the selection. */ }
});
selectSkin(selected);
renderCards();
const { balanceControls } = await import('./agent-robot-avatar-demo-layout.js');
balanceControls();
document.documentElement.classList.remove('skin-initializing');
