import '../../agent-robot-avatar.js';
import { publicSkins, skinById, skinThumbnail, catalogCategories as materialCategories } from '../skin-catalog.js';

const params = new URLSearchParams(location.search);
const language = params.get('lang') || 'zh-CN';
const home = new URL('../skins.html', location.href);
home.searchParams.set('lang', language);
if (skinById.has(params.get('skin'))) home.searchParams.set('skin', params.get('skin'));
document.getElementById('back-to-skins').href = home.href;
document.getElementById('catalog-count').textContent = `${publicSkins.length} 款`;
const grid = document.getElementById('skin-grid');
const search = document.getElementById('skin-search');
const categories = [{id:'all', label:'全部', names:publicSkins.map(skin => skin.id)}, ...materialCategories];
let category = categories.some(({id}) => id === params.get('view')) ? params.get('view') : 'all';
search.value = params.get('q') || '';
const observer = new IntersectionObserver(entries => {
  for (const {isIntersecting, target} of entries) if (isIntersecting) {
    target.src = skinThumbnail(target.dataset.skin);
    observer.unobserve(target);
  }
}, {rootMargin:'160px'});
for (const {id, label, names} of categories) {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.filter = id;
  const text=document.createElement('span');text.textContent=label;
  const count=document.createElement('span');count.className='filter-count';count.textContent=names.length;
  button.append(text,count);
  button.addEventListener('click', () => { category = id; search.value = ''; render(); });
  document.getElementById('skin-filters').append(button);
}
function render() {
  const query = search.value.trim().toLowerCase();
  const skins = publicSkins.filter(skin => (category === 'all' || categories.find(({id}) => id === category).names.includes(skin.id))
    && `${skin.label} ${skin.english} ${skin.description}`.toLowerCase().includes(query));
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
    heading.textContent = group.label;
    const count = document.createElement('span');
    count.textContent = `${members.length} 款`;
    heading.append(count);
    heading.id=`category-${group.id}`;section.setAttribute('aria-labelledby',heading.id);
    section.append(heading,cards);fragment.append(section);
    for (const skin of members) {
      const card = document.createElement('a');
      card.className = `skin-card material ${skin.id}`;
      card.dataset.skin = skin.id;
      const url = new URL(home);
      url.searchParams.set('skin', skin.id);
      card.href = url.href;
      card.setAttribute('aria-label', `预览${skin.label}`);
      const stage = document.createElement('div');
      stage.className = 'stage';
      if (skin.stage) stage.style.background = skin.stage;
      const img = document.createElement('img');
      img.alt = '';
      img.width = img.height = 120;
      img.dataset.skin = skin.id;
      const caption = document.createElement('div');
      caption.className = 'caption';
      const label = document.createElement('h3');
      label.textContent = skin.label;
      const swatch = document.createElement('span');
      swatch.className = 'swatch';
      swatch.style.background = skin.base[1];
      swatch.setAttribute('aria-hidden', 'true');
      label.prepend(swatch);
      caption.append(label);
      stage.append(img);
      card.append(stage, caption);
      cards.append(card);
      observer.observe(img);
    }
  }
  grid.replaceChildren(fragment);
  document.getElementById('empty-state').hidden = !!skins.length;
  document.getElementById('catalog-summary').textContent = `${query ? '搜索结果' : categories.find(({id}) => id === category).label} · ${skins.length} 款`;
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  const url = new URL(location.href);
  if (category === 'all') url.searchParams.delete('view'); else url.searchParams.set('view', category);
  if (query) url.searchParams.set('q', search.value.trim()); else url.searchParams.delete('q');
  history.replaceState(null, '', url);
}
search.addEventListener('input', render);
document.getElementById('clear-search').addEventListener('click', () => { category = 'all'; search.value = ''; render(); search.focus(); });
render();
window.addEventListener('storage',event=>{
  if(event.key==='robot-public-catalog-revision')location.reload();
});
