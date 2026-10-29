import { VERSION } from '../../agent-robot-avatar.js';
import { publicSkins, skinById, skinThumbnail, catalogCategories as materialCategories } from '../skin-catalog.js';
import { t, skinLanguage, skinTitle, seriesTitle } from '../skins-i18n.js';

const params = new URLSearchParams(location.search);
document.getElementById('catalog-build').textContent = `Demo ${VERSION}`;
const language = params.get('lang') || 'zh-CN';
const lang = skinLanguage(language);
document.documentElement.lang = lang;
document.title = `${t('allSkins', 0, lang)} · Agent Robot Avatar`;
for (const [selector, key] of [['#nav-demo', 'demo'], ['#nav-skins', 'skins'], ['#back-to-skins', 'backHome'], ['.library-header h1', 'allSkins'], ['.search-label .sr-only', 'search'], ['#empty-state p', 'none'], ['#clear-search', 'showAll']]) {
  document.querySelector(selector).textContent = t(key, 0, lang);
}
document.getElementById('skin-search').placeholder = t('search', 0, lang);
const home = new URL('../skins.html', location.href);
home.searchParams.set('lang', language);
if (skinById.has(params.get('skin'))) home.searchParams.set('skin', params.get('skin'));
document.getElementById('back-to-skins').href = home.href;
document.getElementById('nav-skins').href = home.href;
const demoPage = new URL('../index.html', location.href);
demoPage.searchParams.set('lang', language);
document.getElementById('nav-demo').href = demoPage.href;
document.getElementById('catalog-count').textContent = t('count', publicSkins.length, lang);
const grid = document.getElementById('skin-grid');
const search = document.getElementById('skin-search');
const categories = [{id:'all', label:t('all', 0, lang), labelEn:t('all', 0, lang), names:publicSkins.map(skin => skin.id)}, ...materialCategories];
let category = categories.some(({id}) => id === params.get('view')) ? params.get('view') : 'all';
search.value = params.get('q') || '';
const observer = new IntersectionObserver(entries => {
  for (const {isIntersecting, target} of entries) if (isIntersecting) {
    target.src = skinThumbnail(target.dataset.skin);
    observer.unobserve(target);
  }
}, {rootMargin:'160px'});
for (const {id, label, labelEn, names} of categories) {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.filter = id;
  const text=document.createElement('span');text.textContent=seriesTitle({label, labelEn}, lang);
  const count=document.createElement('span');count.className='filter-count';count.textContent=names.length;
  button.append(text,count);
  button.addEventListener('click', () => { category = id; search.value = ''; render(); });
  document.getElementById('skin-filters').append(button);
}
function render() {
  const query = search.value.trim().toLowerCase();
  const skins = publicSkins.filter(skin => (category === 'all' || categories.find(({id}) => id === category).names.includes(skin.id))
    && `${skin.id} ${skin.label} ${skin.english} ${skin.description}`.toLowerCase().includes(query));
  const matches = new Set(skins.map(skin => skin.id));
  observer.disconnect();
  const fragment = document.createDocumentFragment();
  for (const group of materialCategories) {
    const members = group.names.filter(id => matches.has(id)).map(id => skinById.get(id));
    if (!members.length) continue;
    const section=document.createElement('section');
    section.className='catalog-category';section.dataset.category=group.id;
    const cards=document.createElement('div');cards.className='category-cards';
    const heading = document.createElement('h2');
    heading.className = 'category-heading';
    heading.textContent = seriesTitle(group, lang);
    const count = document.createElement('span');
    count.textContent = t('count', members.length, lang);
    heading.append(count);
    heading.id=`category-${group.id}`;section.setAttribute('aria-labelledby',heading.id);
    section.append(heading,cards);fragment.append(section);
    for (const skin of members) {
      const card = document.createElement('a');
      card.className = 'skin-card';
      card.dataset.skin = skin.id;
      const url = new URL(home);
      url.searchParams.set('skin', skin.id);
      card.href = url.href;
      card.setAttribute('aria-label', t('preview', skinTitle(skin, lang), lang));
      // The same card as the skin page: the skin's stage color, its picture,
      // its name and its number.
      if (skin.stage) card.style.background = skin.stage;
      const img = document.createElement('img');
      img.alt = '';
      img.width = img.height = 120;
      img.dataset.skin = skin.id;
      const label = document.createElement('span');
      label.className = 'skin-label';
      label.textContent = skinTitle(skin, lang);
      const number = document.createElement('span');
      number.className = 'skin-number';
      number.textContent = `#${skin.id}`;
      card.append(img, label, number);
      cards.append(card);
      observer.observe(img);
    }
  }
  grid.replaceChildren(fragment);
  document.getElementById('empty-state').hidden = !!skins.length;
  const shown = categories.find(({id}) => id === category);
  document.getElementById('catalog-summary').textContent = `${query ? t('results', 0, lang) : seriesTitle(shown, lang)} · ${t('count', skins.length, lang)}`;
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  const url = new URL(location.href);
  if (category === 'all') url.searchParams.delete('view'); else url.searchParams.set('view', category);
  if (query) url.searchParams.set('q', search.value.trim()); else url.searchParams.delete('q');
  history.replaceState(null, '', url);
}
search.addEventListener('input', render);
document.getElementById('clear-search').addEventListener('click', () => { category = 'all'; search.value = ''; render(); search.focus(); });
render();
