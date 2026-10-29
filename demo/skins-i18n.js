// Labels for the skin pages in every demo language. Skin titles come from the
// component: Chinese titles for Chinese, English titles for the others.
const LABELS = Object.freeze({
  'zh-CN': {
    demo: '演示', skins: '皮肤', search: '搜索皮肤', count: n => `${n} 款`, results: '搜索结果',
    featured: '精选', all: '全部', metal: '金属', glaze: '釉面与透明', soft: '柔软', natural: '自然', pattern: '图案',
    compare: '对比原版', back: '返回皮肤', original: '原版（对比）', light: '光线跟随', shadow: '地面阴影',
    random: '随机皮肤', inDemo: '在演示中查看', allSkins: '全部皮肤', backFeatured: '← 返回精选',
    backHome: '← 返回皮肤首页', none: '未找到皮肤', showAll: '查看全部', settings: '皮肤预览设置', copy: '复制编号', copied: '已复制', entry: '皮肤美术馆', openSkins: '打开皮肤美术馆', preview: name => `预览${name}`,
  },
  'zh-TW': {
    demo: '演示', skins: '皮膚', search: '搜尋皮膚', count: n => `${n} 款`, results: '搜尋結果',
    featured: '精選', all: '全部', metal: '金屬', glaze: '釉面與透明', soft: '柔軟', natural: '自然', pattern: '圖案',
    compare: '對比原版', back: '返回皮膚', original: '原版（對比）', light: '光線跟隨', shadow: '地面陰影',
    random: '隨機皮膚', inDemo: '在演示中查看', allSkins: '全部皮膚', backFeatured: '← 返回精選',
    backHome: '← 返回皮膚首頁', none: '找不到皮膚', showAll: '查看全部', settings: '皮膚預覽設定', copy: '複製編號', copied: '已複製', entry: '皮膚美術館', openSkins: '開啟皮膚美術館', preview: name => `預覽${name}`,
  },
  en: {
    demo: 'Demo', skins: 'Skins', search: 'Search skins', count: n => `${n}`, results: 'Search results',
    featured: 'Featured', all: 'All', metal: 'Metal', glaze: 'Glaze & clear', soft: 'Soft', natural: 'Natural', pattern: 'Patterns',
    compare: 'Compare original', back: 'Back to skin', original: 'Original (compare)', light: 'Follow light', shadow: 'Floor shadow',
    random: 'Random skin', inDemo: 'View in demo', allSkins: 'All skins', backFeatured: '← Back to featured',
    backHome: '← Back to skins', none: 'No skins found', showAll: 'Show all', settings: 'Skin preview settings', copy: 'Copy number', copied: 'Copied', entry: 'Skin Gallery', openSkins: 'Open the Skin Gallery', preview: name => `Preview ${name}`,
  },
  ja: {
    demo: 'デモ', skins: 'スキン', search: 'スキンを検索', count: n => `${n} 種`, results: '検索結果',
    featured: 'おすすめ', all: 'すべて', metal: 'メタル', glaze: '釉薬・透明', soft: 'ソフト', natural: 'ナチュラル', pattern: '柄',
    compare: '元と比較', back: 'スキンに戻る', original: 'オリジナル（比較）', light: '光が追従', shadow: '床の影',
    random: 'ランダムスキン', inDemo: 'デモで見る', allSkins: 'すべてのスキン', backFeatured: '← おすすめに戻る',
    backHome: '← スキンに戻る', none: 'スキンが見つかりません', showAll: 'すべて表示', settings: 'スキンのプレビュー設定', copy: '番号をコピー', copied: 'コピーしました', entry: 'スキンギャラリー', openSkins: 'スキンのページを開く', preview: name => `${name}をプレビュー`,
  },
  ko: {
    demo: '데모', skins: '스킨', search: '스킨 검색', count: n => `${n}개`, results: '검색 결과',
    featured: '추천', all: '전체', metal: '메탈', glaze: '유약·투명', soft: '부드러움', natural: '자연', pattern: '패턴',
    compare: '원본과 비교', back: '스킨으로 돌아가기', original: '원본(비교)', light: '빛 따라가기', shadow: '바닥 그림자',
    random: '랜덤 스킨', inDemo: '데모에서 보기', allSkins: '전체 스킨', backFeatured: '← 추천으로 돌아가기',
    backHome: '← 스킨으로 돌아가기', none: '스킨을 찾을 수 없습니다', showAll: '전체 보기', settings: '스킨 미리보기 설정', copy: '번호 복사', copied: '복사됨', entry: '스킨 갤러리', openSkins: '스킨 페이지 열기', preview: name => `${name} 미리보기`,
  },
  es: {
    demo: 'Demo', skins: 'Pieles', search: 'Buscar pieles', count: n => `${n}`, results: 'Resultados',
    featured: 'Destacadas', all: 'Todas', metal: 'Metal', glaze: 'Esmalte y transparente', soft: 'Suave', natural: 'Natural', pattern: 'Estampados',
    compare: 'Comparar original', back: 'Volver a la piel', original: 'Original (comparación)', light: 'Seguir la luz', shadow: 'Sombra en el suelo',
    random: 'Piel aleatoria', inDemo: 'Ver en la demo', allSkins: 'Todas las pieles', backFeatured: '← Volver a destacadas',
    backHome: '← Volver a pieles', none: 'No se encontraron pieles', showAll: 'Ver todas', settings: 'Ajustes de vista previa', copy: 'Copiar número', copied: 'Copiado', entry: 'Galería de pieles', openSkins: 'Abrir la página de pieles', preview: name => `Ver ${name}`,
  },
  pt: {
    demo: 'Demo', skins: 'Skins', search: 'Pesquisar skins', count: n => `${n}`, results: 'Resultados',
    featured: 'Destaques', all: 'Todas', metal: 'Metal', glaze: 'Esmalte e transparente', soft: 'Macio', natural: 'Natural', pattern: 'Padrões',
    compare: 'Comparar original', back: 'Voltar à skin', original: 'Original (comparação)', light: 'Seguir a luz', shadow: 'Sombra no chão',
    random: 'Skin aleatória', inDemo: 'Ver na demo', allSkins: 'Todas as skins', backFeatured: '← Voltar aos destaques',
    backHome: '← Voltar às skins', none: 'Nenhuma skin encontrada', showAll: 'Ver todas', settings: 'Configurações da pré-visualização', copy: 'Copiar número', copied: 'Copiado', entry: 'Galeria de skins', openSkins: 'Abrir a página de skins', preview: name => `Ver ${name}`,
  },
  de: {
    demo: 'Demo', skins: 'Skins', search: 'Skins suchen', count: n => `${n}`, results: 'Suchergebnisse',
    featured: 'Empfohlen', all: 'Alle', metal: 'Metall', glaze: 'Glasur & klar', soft: 'Weich', natural: 'Natur', pattern: 'Muster',
    compare: 'Mit Original vergleichen', back: 'Zurück zum Skin', original: 'Original (Vergleich)', light: 'Licht folgt', shadow: 'Bodenschatten',
    random: 'Zufälliger Skin', inDemo: 'In der Demo ansehen', allSkins: 'Alle Skins', backFeatured: '← Zurück zu Empfohlen',
    backHome: '← Zurück zu Skins', none: 'Keine Skins gefunden', showAll: 'Alle anzeigen', settings: 'Skin-Vorschau', copy: 'Nummer kopieren', copied: 'Kopiert', entry: 'Skin-Galerie', openSkins: 'Skin-Seite öffnen', preview: name => `${name} ansehen`,
  },
  fr: {
    demo: 'Démo', skins: 'Skins', search: 'Rechercher des skins', count: n => `${n}`, results: 'Résultats',
    featured: 'Sélection', all: 'Tous', metal: 'Métal', glaze: 'Émail et transparent', soft: 'Doux', natural: 'Naturel', pattern: 'Motifs',
    compare: 'Comparer à l’original', back: 'Revenir au skin', original: 'Original (comparaison)', light: 'La lumière suit', shadow: 'Ombre au sol',
    random: 'Skin aléatoire', inDemo: 'Voir dans la démo', allSkins: 'Tous les skins', backFeatured: '← Revenir à la sélection',
    backHome: '← Revenir aux skins', none: 'Aucun skin trouvé', showAll: 'Tout afficher', settings: 'Réglages de l’aperçu', copy: 'Copier le numéro', copied: 'Copié', entry: 'Galerie de skins', openSkins: 'Ouvrir la page des skins', preview: name => `Aperçu de ${name}`,
  },
});

export function skinLanguage(value = document.documentElement.lang) {
  const lang = String(value || 'en');
  if (LABELS[lang]) return lang;
  if (lang.toLowerCase().startsWith('zh')) return /tw|hk|hant/i.test(lang) ? 'zh-TW' : 'zh-CN';
  return LABELS[lang.slice(0, 2).toLowerCase()] ? lang.slice(0, 2).toLowerCase() : 'en';
}

export function t(key, value, lang = skinLanguage()) {
  const label = LABELS[lang][key];
  return typeof label === 'function' ? label(value) : label;
}

export function skinTitle(skin, lang = skinLanguage()) {
  return lang.startsWith('zh') ? skin.label : skin.english;
}

export function seriesTitle(series, lang = skinLanguage()) {
  return lang.startsWith('zh') ? series.label : series.labelEn;
}

// Copies a skin number, and briefly says so on the button.
export async function copySkinNumber(id, button, lang = skinLanguage()) {
  try { await navigator.clipboard.writeText(id); }
  catch {
    const field = Object.assign(document.createElement('textarea'), { value: id });
    document.body.append(field);
    field.select();
    document.execCommand('copy');
    field.remove();
  }
  button.dataset.copied = 'true';
  button.setAttribute('aria-label', t('copied', 0, lang));
  clearTimeout(button._copyTimer);
  button._copyTimer = setTimeout(() => {
    delete button.dataset.copied;
    button.setAttribute('aria-label', `${t('copy', 0, lang)} ${id}`);
  }, 1400);
}

// Red dots mark what is new. Each one goes away for good once it is clicked;
// the browser remembers which ones were seen.
const SEEN_KEY = 'agentRobotAvatarDemoSeen';
function seenDots() {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')); } catch { return new Set(); }
}
export function markDotSeen(key) {
  const seen = seenDots();
  if (seen.has(key)) return;
  seen.add(key);
  try { localStorage.setItem(SEEN_KEY, JSON.stringify([...seen])); } catch { /* the dot just shows again next time */ }
}
const dotKey = element => element.dataset.newKey || (element.dataset.action ? `action:${element.dataset.action}` : element.id);
export function settleNewDots(root = document) {
  const seen = seenDots();
  for (const element of root.querySelectorAll('.is-new')) {
    if (seen.has(dotKey(element))) element.classList.remove('is-new');
  }
  if (document._newDotsWatched) return;
  document._newDotsWatched = true;
  // One listener for the page, so dots added later are covered as well.
  document.addEventListener('click', event => {
    const element = event.target.closest?.('.is-new');
    const key = element && dotKey(element);
    if (!key) return;
    element.classList.remove('is-new');
    markDotSeen(key);
  }, true);
}
