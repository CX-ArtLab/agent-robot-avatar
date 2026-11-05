// Inlined with its catalogue into the offline simulator; no network requests.
const PREVIEW_LANGUAGES = [
  ['en', 'English'], ['zh-CN', '简体中文'], ['zh-TW', '繁體中文'],
  ['ja', '日本語'], ['ko', '한국어'], ['es', 'Español'],
  ['pt', 'Português'], ['de', 'Deutsch'], ['fr', 'Français'], ['ru', 'Русский'],
];
function previewLanguage(value) {
  const code = String(value || '').trim().toLowerCase().replaceAll('_', '-');
  if (code.startsWith('zh')) return /(?:^|-)(?:tw|hk|mo|hant)(?:-|$)/.test(code) ? 'zh-TW' : 'zh-CN';
  return PREVIEW_LANGUAGES.find(([language]) => language.toLowerCase() === code.split('-')[0])?.[0];
}
const PREVIEW_LANGUAGE = (() => {
  const linked = previewLanguage(new URLSearchParams(location.search).get('lang'));
  if (linked) return linked;
  try {
    const saved = previewLanguage(localStorage.getItem('boopFaceDemoLanguage'));
    if (saved) return saved;
  } catch (_) {}
  return (navigator.languages || [navigator.language]).map(previewLanguage).find(Boolean) || 'en';
})();
function previewText(text) {
  if (PREVIEW_LANGUAGE === 'zh-CN') return text;
  return PREVIEW_TRANSLATIONS[PREVIEW_LANGUAGE]?.[text] ?? PREVIEW_TRANSLATIONS.en[text] ?? text;
}
(() => {
  document.documentElement.lang = PREVIEW_LANGUAGE;
  const translate = text => {
    const trimmed = text.trim();
    return trimmed ? text.replace(trimmed, previewText(trimmed)) : text;
  };
  // Keep nested code elements and their identifiers intact.
  const help = document.getElementById('export-help');
  const translatedHelp = previewText(help.innerHTML);
  if (translatedHelp !== help.innerHTML) help.innerHTML = translatedHelp;
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.parentElement.closest('script,style')) node.nodeValue = translate(node.nodeValue);
  }
  for (const element of document.querySelectorAll('[title],[aria-label]')) {
    for (const name of ['title', 'aria-label']) {
      if (element.hasAttribute(name)) element.setAttribute(name, translate(element.getAttribute(name)));
    }
  }
  document.documentElement.style.setProperty('--sense-label', JSON.stringify(previewText('感应范围')));
  document.documentElement.style.setProperty('--sense-active-label', JSON.stringify(previewText('正在注视')));
  const select = document.getElementById('preview-language');
  select.replaceChildren(...PREVIEW_LANGUAGES.map(([value, label]) => new Option(label, value, false, value === PREVIEW_LANGUAGE)));
  select.addEventListener('change', () => {
    try { localStorage.setItem('boopFaceDemoLanguage', select.value); } catch (_) {}
    const url = new URL(location.href);
    url.searchParams.set('lang', select.value);
    // All simulator settings are already persisted. Reloading also updates
    // action names and screen metadata consistently, including file:// use.
    location.href = url.href;
  });
})();
