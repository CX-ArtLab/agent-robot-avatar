import './agent-robot-avatar-demo.js';
import { restoreAppearance, saveAppearance } from './agent-robot-avatar-demo-appearance.js';
import { publicSkins, skinById, featured, filters, applySkin, skinThumbnail, storedSkin, SKIN_STORAGE_KEY } from './skin-catalog.js';
import { t, skinTitle, copySkinNumber } from './skins-i18n.js';

// Language switching stays with the shared demo; this page relabels itself
// whenever the document language changes.
const face = document.getElementById('face');
const canvas = document.getElementById('canvas');
const overlay = document.getElementById('agentOverlay');
const grid = document.getElementById('skin-grid');
const search = document.getElementById('skin-search');
const header = document.getElementById('page-header');
header.append(document.querySelector('.title'), document.getElementById('agent-demo-build'));
// The stage title: the skin's name and a button that copies its number.
const title = document.createElement('div');
title.id = 'skin-name';
title.className = 'skin-name';
const name = document.createElement('span');
name.setAttribute('aria-live', 'polite');
const copyNumber = document.createElement('button');
copyNumber.type = 'button';
copyNumber.className = 'copy-number';
copyNumber.addEventListener('click', () => copySkinNumber(selected, copyNumber));
title.append(name, copyNumber);
document.getElementById('demoStage').append(title);
function showNumber(id) {
  copyNumber.hidden = !id;
  copyNumber.textContent = `#${id}`;
  copyNumber.title = t('copy');
  copyNumber.setAttribute('aria-label', `${t('copy')} ${id}`);
}

const skinOptions = document.createElement('div');
skinOptions.className = 'demo-options-group skin-options';
skinOptions.innerHTML = `
  <button type="button" id="compare" aria-pressed="false"></button>
  <label class="demo-option demo-toggle"><span data-label="light"></span><input type="checkbox" id="follow-light" checked><span class="demo-switch" aria-hidden="true"></span></label>
  <label class="demo-option demo-toggle"><span data-label="shadow"></span><input type="checkbox" id="ground-shadow" checked><span class="demo-switch" aria-hidden="true"></span></label>`;
document.querySelector('.demo-options').append(skinOptions);
const compare = document.getElementById('compare');
const light = document.getElementById('follow-light');
const shadow = document.getElementById('ground-shadow');
const params = new URLSearchParams(location.search);
// A link or the last visit picks the skin; otherwise the first featured one.
let selected = [params.get('skin'), storedSkin(), featured[0]].find(id => id !== 'classic' && skinById.has(id)) || publicSkins[0].id;
let category = filters.some(([id]) => id === params.get('view')) ? params.get('view') : 'featured';
search.value = params.get('q') || '';
let material;
// Reuse the demo styling and valid preview controls, not its color tools.
// Cloning the dice drops the original palette listener completely.
const randomSkin = document.getElementById('demoRandomColors').cloneNode(true);
randomSkin.id = 'random-skin';
randomSkin.classList.remove('is-new');
randomSkin.classList.add('skin-random');
const randomLabel = document.createElement('span');
randomSkin.append(randomLabel);
document.getElementById('demoColorsGroup').replaceChildren(randomSkin);
document.getElementById('demoColorPanel').remove();
document.getElementById('demoStageReset').remove();
restoreAppearance();
randomSkin.addEventListener('click', () => {
  const choices = publicSkins.filter(skin => skin.id !== selected);
  selectSkin(choices[Math.floor(Math.random() * choices.length)].id);
});

const thumbnails = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const img = entry.target;
    skinThumbnail(img.dataset.skin).then(url => { img.src = url; });
    thumbnails.unobserve(img);
  }
}, { rootMargin: '160px' });

for (const [id] of filters) {
  const button = document.createElement('button');
  button.type = 'button';
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
  const matches = list.filter(skin => `#${skin.id} ${skin.label} ${skin.english} ${skin.description}`.toLocaleLowerCase().includes(query));
  const fragment = document.createDocumentFragment();
  for (const skin of matches) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'skin-card';
    // Each card sits on the same background as the skin's stage.
    if (skin.stage) card.style.background = skin.stage;
    card.dataset.skin = skin.id;
    card.setAttribute('aria-pressed', String(skin.id === selected));
    card.setAttribute('aria-label', skinTitle(skin));
    const img = document.createElement('img');
    img.alt = '';
    img.width = 80;
    img.height = 80;
    img.dataset.skin = skin.id;
    const label = document.createElement('span');
    label.textContent = skinTitle(skin);
    card.append(img, label);
    fragment.append(card);
    thumbnails.observe(img);
  }
  grid.replaceChildren(fragment);
  grid.dataset.view = effectiveCategory === 'featured' && !query ? 'featured' : 'list';
  grid.scrollTop = 0;
  grid.hidden = !matches.length;
  document.getElementById('empty-state').hidden = !!matches.length;
  document.getElementById('results-label').textContent = query ? t('results') : t(effectiveCategory);
  document.getElementById('results-count').textContent = t('count', matches.length);
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
  compare.textContent = t('compare');
  compare.disabled = id === 'classic';
  material = applySkin(face, id);
  document.getElementById('demoStage').style.background = skin.stage || '';
  syncShadow();
  name.textContent = skinTitle(skin);
  showNumber(id);
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
  compare.textContent = original ? t('back') : t('compare');
  name.textContent = original ? t('original') : skinTitle(skinById.get(selected));
  showNumber(original ? null : selected);
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
// Every label on this page, in the current language.
function relabel() {
  skinOptions.setAttribute('aria-label', t('settings'));
  for (const node of skinOptions.querySelectorAll('[data-label]')) node.textContent = t(node.dataset.label);
  const original = compare.getAttribute('aria-pressed') === 'true';
  compare.textContent = original ? t('back') : t('compare');
  name.textContent = original ? t('original') : skinTitle(skinById.get(selected));
  showNumber(original ? null : selected);
  randomSkin.title = t('random');
  randomSkin.setAttribute('aria-label', t('random'));
  randomLabel.textContent = t('random');
  for (const button of document.querySelectorAll('[data-filter]')) button.textContent = t(button.dataset.filter);
  document.getElementById('library-title').textContent = t('skins');
  document.getElementById('skin-home').textContent = t('backFeatured');
  document.getElementById('all-skins-link').textContent = `${t('allSkins')} ↗`;
  search.placeholder = t('search');
  document.querySelector('.search-label .sr-only').textContent = t('search');
  document.querySelector('#empty-state p').textContent = t('none');
  document.getElementById('clear-search').textContent = t('showAll');
  const nav = document.querySelectorAll('.demo-nav a');
  nav[0].textContent = t('demo');
  nav[1].textContent = t('skins');
  document.title = `${t('skins')} · Agent Robot Avatar`;
  renderCards();
}
new MutationObserver(() => { relabel(); updateLinks(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
for (const link of [document.getElementById('demo-link')]) link.addEventListener('click', () => {
  saveAppearance();
  try { localStorage.setItem(SKIN_STORAGE_KEY, selected); } catch { /* URL also carries the selection. */ }
});
selectSkin(selected);
relabel();
const { balanceControls } = await import('./agent-robot-avatar-demo-layout.js');
balanceControls();
document.documentElement.classList.remove('skin-initializing');
