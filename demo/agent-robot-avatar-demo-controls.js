// Palettes inspired by public brand colors. Unofficial examples, shown as plain
// text names only (no logos or brand fonts), with a visible disclaimer.
// Colors follow each brand's own assets where published (Claude, ComfyUI, Telegram).
// Every pair keeps about 3:1 contrast or more because the eyes take the background color.
const PALETTES = Object.freeze([
  { id:'claude', background:'#faf9f5', head:'#d97757', name:'Claude' },
  { id:'chatgpt', background:'#ffffff', head:'#0fa578', name:'ChatGPT' },
  { id:'comfyui', background:'#211927', head:'#f2ff59', name:'ComfyUI' },
  { id:'ubuntu', background:'#e95420', head:'#ffffff', name:'Ubuntu' },
  { id:'dribbble', background:'#ea4c89', head:'#ffffff', name:'Dribbble' },
  { id:'discord', background:'#5865f2', head:'#ffffff', name:'Discord' },
  { id:'telegram', background:'#229ed9', head:'#ffffff', name:'Telegram' },
  { id:'snapchat', background:'#fffc00', head:'#000000', name:'Snapchat' },
  { id:'youtube', background:'#ffffff', head:'#ff0000', name:'YouTube' },
  { id:'netflix', background:'#141414', head:'#e50914', name:'Netflix' },
  { id:'spotify', background:'#121212', head:'#1ed760', name:'Spotify' },
  { id:'lakers', background:'#fdb927', head:'#552583', name:'Lakers', 'zh-CN':'湖人', 'zh-TW':'湖人' },
  { id:'warriors', background:'#1d428a', head:'#ffc72c', name:'Warriors', 'zh-CN':'勇士', 'zh-TW':'勇士' },
  { id:'celtics', background:'#007a33', head:'#ffffff', name:'Celtics', 'zh-CN':'凯尔特人', 'zh-TW':'塞爾提克' },
  { id:'barca', background:'#a50044', head:'#edbb00', name:'Barça', 'zh-CN':'巴萨', 'zh-TW':'巴薩' },
  { id:'man-city', background:'#6cabdd', head:'#1c2c5b', name:'Man City', 'zh-CN':'曼城', 'zh-TW':'曼城' },
]);

const PALETTE_UI = Object.freeze({
  'zh-CN': { swap:'互换背景色和头部颜色', swapHint:'再点一次互换', random:'随机配色', hint:'悬停预览，点击使用', tapHint:'点击色块使用',
    note:'配色灵感来自各品牌公开形象，仅为非官方示例，与品牌方无关。' },
  'zh-TW': { swap:'互換背景色和頭部顏色', swapHint:'再點一次互換', random:'隨機配色', hint:'懸停預覽，點擊使用', tapHint:'點擊色塊使用',
    note:'配色靈感來自各品牌公開形象，僅為非官方示例，與品牌方無關。' },
  en: { swap:'Swap background and head colors', swapHint:'click again to swap', random:'Random colors', hint:'Hover to preview, click to apply', tapHint:'Tap a swatch to apply',
    note:'Palettes inspired by public brand colors. Unofficial examples, not affiliated with or endorsed by the brands.' },
  ja: { swap:'背景色とヘッド色を入れ替え', swapHint:'もう一度で入れ替え', random:'ランダム配色', hint:'ホバーでプレビュー、クリックで適用', tapHint:'タップして適用',
    note:'各ブランドの公開イメージに着想を得た非公式の配色例です。ブランドとは関係ありません。' },
  ko: { swap:'배경색과 머리 색상 바꾸기', swapHint:'다시 누르면 반전', random:'무작위 색상', hint:'마우스를 올려 미리 보고 클릭해 적용', tapHint:'탭하여 적용',
    note:'각 브랜드의 공개 이미지에서 영감을 받은 비공식 예시이며, 해당 브랜드와 관련이 없습니다.' },
  es: { swap:'Intercambiar fondo y cabeza', swapHint:'otra vez para invertir', random:'Colores aleatorios', hint:'Pasa el cursor para ver, haz clic para aplicar', tapHint:'Toca un color para aplicarlo',
    note:'Paletas inspiradas en colores públicos de marcas. Ejemplos no oficiales, sin relación ni respaldo de las marcas.' },
  pt: { swap:'Trocar fundo e cabeça', swapHint:'de novo para inverter', random:'Cores aleatórias', hint:'Passe o cursor para ver, clique para aplicar', tapHint:'Toque numa cor para aplicar',
    note:'Paletas inspiradas nas cores públicas das marcas. Exemplos não oficiais, sem afiliação ou endosso das marcas.' },
  de: { swap:'Hintergrund und Kopffarbe tauschen', swapHint:'erneut zum Tauschen', random:'Zufällige Farben', hint:'Zum Ansehen darüberfahren, zum Übernehmen klicken', tapHint:'Zum Übernehmen antippen',
    note:'Paletten nach öffentlichen Markenfarben. Inoffizielle Beispiele, nicht mit den Marken verbunden oder von ihnen unterstützt.' },
  fr: { swap:'Inverser fond et tête', swapHint:'encore pour inverser', random:'Couleurs aléatoires', hint:'Survolez pour voir, cliquez pour appliquer', tapHint:'Touchez pour appliquer',
    note:'Palettes inspirées des couleurs publiques des marques. Exemples non officiels, sans lien ni approbation des marques.' },
});

const DEFAULTS = Object.freeze({
  background: '#ffffff',
  head: '#08090b',
  eyeThrough: true,
  antenna: true,
  loop: false,
  pointerFollow: true,
});

const LANGUAGES = Object.freeze([
  ['en', 'English'],
  ['zh-CN', '简体中文'],
  ['zh-TW', '繁體中文'],
  ['ja', '日本語'],
  ['ko', '한국어'],
  ['es', 'Español'],
  ['pt', 'Português'],
  ['de', 'Deutsch'],
  ['fr', 'Français'],
]);

const LANGUAGE_STORAGE_KEY = 'agentRobotAvatarDemoLanguage';

function normalizeLanguage(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const normalized = value.trim().toLowerCase();
  const exact = LANGUAGES.find(([code]) => code.toLowerCase() === normalized);
  if (exact) return exact[0];
  if (normalized.startsWith('zh')) {
    return /(^|[-_])(tw|hk|mo|hant)([-_]|$)/.test(normalized) ? 'zh-TW' : 'zh-CN';
  }
  const base = normalized.split(/[-_]/)[0];
  return LANGUAGES.find(([code]) => code.toLowerCase() === base)?.[0] || null;
}

function initialLanguage() {
  const linked = normalizeLanguage(new URLSearchParams(window.location.search).get('lang'));
  if (linked) return linked;

  try {
    const saved = normalizeLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY));
    if (saved) return saved;
  } catch (_) {}

  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const language of browserLanguages) {
    const supported = normalizeLanguage(language);
    if (supported) return supported;
  }
  return 'en';
}

const I18N = Object.freeze({
  'zh-CN': {
    webComponent: 'Web 组件', color: '颜色', settings: '设定', language: '语言',
    colorSettings: '颜色设置', otherSettings: '其它功能', languageSettings: '页面语言',
    background: '背景色', head: '头部颜色', eyeThrough: '眼睛穿透', reset: '恢复默认',
    antenna: '天线', loop: '循环播放', pointerFollow: '鼠标跟随',
    actions: { idle:'正常', bored:'发呆', 'waiting-spin':'等待 · 旋转', input:'输入', affirm:'肯定', success:'成功', wary:'警惕', angry:'生气', refuse:'拒绝', surprise:'惊讶', sleep:'睡着', wake:'醒来' },
    states: { idle:'默认待机', bored:'发呆', waiting:'等待', input:'输入中', affirm:'肯定', success:'成功', happy:'成功', wary:'警惕', angry:'生气', refuse:'拒绝', surprise:'惊讶', sleepy:'困倦', sleep:'睡眠', wake:'醒来' },
  },
  'zh-TW': {
    webComponent: 'Web 元件', color: '顏色', settings: '設定', language: '語言',
    colorSettings: '顏色設定', otherSettings: '其他功能', languageSettings: '頁面語言',
    background: '背景色', head: '頭部顏色', eyeThrough: '眼睛穿透', reset: '恢復預設',
    antenna: '天線', loop: '循環播放', pointerFollow: '滑鼠跟隨',
    actions: { idle:'正常', bored:'發呆', 'waiting-spin':'等待 · 旋轉', input:'輸入', affirm:'肯定', success:'成功', wary:'警惕', angry:'生氣', refuse:'拒絕', surprise:'驚訝', sleep:'睡著', wake:'醒來' },
    states: { idle:'預設待機', bored:'發呆', waiting:'等待', input:'輸入中', affirm:'肯定', success:'成功', happy:'成功', wary:'警惕', angry:'生氣', refuse:'拒絕', surprise:'驚訝', sleepy:'睏倦', sleep:'睡眠', wake:'醒來' },
  },
  en: {
    webComponent: 'Web Component', color: 'Color', settings: 'Settings', language: 'Language',
    colorSettings: 'Color settings', otherSettings: 'Other settings', languageSettings: 'Page language',
    background: 'Background', head: 'Head color', eyeThrough: 'Transparent eyes', reset: 'Reset colors',
    antenna: 'Antenna', loop: 'Loop playback', pointerFollow: 'Pointer follow',
    actions: { idle:'Normal', bored:'Bored', 'waiting-spin':'Waiting · Spin', input:'Input', affirm:'Affirm', success:'Success', wary:'Wary', angry:'Angry', refuse:'Refuse', surprise:'Surprise', sleep:'Sleep', wake:'Wake' },
    states: { idle:'Idle', bored:'Bored', waiting:'Waiting', input:'Input', affirm:'Affirm', success:'Success', happy:'Success', wary:'Wary', angry:'Angry', refuse:'Refuse', surprise:'Surprise', sleepy:'Sleepy', sleep:'Sleeping', wake:'Awake' },
  },
  ja: {
    webComponent: 'Web コンポーネント', color: 'カラー', settings: '設定', language: '言語',
    colorSettings: 'カラー設定', otherSettings: 'その他の設定', languageSettings: 'ページ言語',
    background: '背景色', head: 'ヘッド色', eyeThrough: '目を透過', reset: '色をリセット',
    antenna: 'アンテナ', loop: 'ループ再生', pointerFollow: 'マウス追従',
    actions: { idle:'通常', bored:'退屈', 'waiting-spin':'待機 · 回転', input:'入力', affirm:'肯定', success:'成功', wary:'警戒', angry:'怒り', refuse:'拒否', surprise:'驚き', sleep:'睡眠', wake:'起床' },
    states: { idle:'待機中', bored:'退屈', waiting:'待機', input:'入力中', affirm:'肯定', success:'成功', happy:'成功', wary:'警戒', angry:'怒り', refuse:'拒否', surprise:'驚き', sleepy:'眠い', sleep:'睡眠中', wake:'起床' },
  },
  ko: {
    webComponent: '웹 컴포넌트', color: '색상', settings: '설정', language: '언어',
    colorSettings: '색상 설정', otherSettings: '기타 설정', languageSettings: '페이지 언어',
    background: '배경색', head: '머리 색상', eyeThrough: '눈 투과', reset: '색상 초기화',
    antenna: '안테나', loop: '반복 재생', pointerFollow: '마우스 추적',
    actions: { idle:'정상', bored:'멍함', 'waiting-spin':'대기 · 회전', input:'입력', affirm:'긍정', success:'성공', wary:'경계', angry:'화남', refuse:'거절', surprise:'놀람', sleep:'수면', wake:'깨우기' },
    states: { idle:'대기 중', bored:'멍함', waiting:'대기', input:'입력 중', affirm:'긍정', success:'성공', happy:'성공', wary:'경계', angry:'화남', refuse:'거절', surprise:'놀람', sleepy:'졸림', sleep:'수면 중', wake:'깨어남' },
  },
  es: {
    webComponent: 'Componente Web', color: 'Color', settings: 'Ajustes', language: 'Idioma',
    colorSettings: 'Ajustes de color', otherSettings: 'Otros ajustes', languageSettings: 'Idioma de página',
    background: 'Fondo', head: 'Color de cabeza', eyeThrough: 'Ojos transparentes', reset: 'Restablecer colores',
    antenna: 'Antena', loop: 'Reproducir en bucle', pointerFollow: 'Seguir cursor',
    actions: { idle:'Normal', bored:'Aburrido', 'waiting-spin':'Esperando · Giro', input:'Entrada', affirm:'Afirmar', success:'Éxito', wary:'Recelo', angry:'Enfado', refuse:'Rechazar', surprise:'Sorpresa', sleep:'Dormir', wake:'Despertar' },
    states: { idle:'En espera', bored:'Aburrido', waiting:'Esperando', input:'Introduciendo', affirm:'Afirmar', success:'Éxito', happy:'Éxito', wary:'Recelo', angry:'Enfado', refuse:'Rechazar', surprise:'Sorpresa', sleepy:'Somnoliento', sleep:'Durmiendo', wake:'Despierto' },
  },
  pt: {
    webComponent: 'Componente Web', color: 'Cor', settings: 'Configurações', language: 'Idioma',
    colorSettings: 'Configurações de cor', otherSettings: 'Outras configurações', languageSettings: 'Idioma da página',
    background: 'Fundo', head: 'Cor da cabeça', eyeThrough: 'Olhos transparentes', reset: 'Redefinir cores',
    antenna: 'Antena', loop: 'Reprodução em loop', pointerFollow: 'Seguir cursor',
    actions: { idle:'Normal', bored:'Entediado', 'waiting-spin':'Aguardando · Giro', input:'Entrada', affirm:'Afirmar', success:'Sucesso', wary:'Desconfiança', angry:'Raiva', refuse:'Recusar', surprise:'Surpresa', sleep:'Dormir', wake:'Acordar' },
    states: { idle:'Em espera', bored:'Entediado', waiting:'Aguardando', input:'Digitando', affirm:'Afirmar', success:'Sucesso', happy:'Sucesso', wary:'Desconfiança', angry:'Raiva', refuse:'Recusar', surprise:'Surpresa', sleepy:'Sonolento', sleep:'Dormindo', wake:'Acordado' },
  },
  de: {
    webComponent: 'Webkomponente', color: 'Farbe', settings: 'Einstellungen', language: 'Sprache',
    colorSettings: 'Farbeinstellungen', otherSettings: 'Weitere Einstellungen', languageSettings: 'Seitensprache',
    background: 'Hintergrund', head: 'Kopffarbe', eyeThrough: 'Augen transparent', reset: 'Farben zurücksetzen',
    antenna: 'Antenne', loop: 'Endlos abspielen', pointerFollow: 'Maus folgen',
    actions: { idle:'Normal', bored:'Gelangweilt', 'waiting-spin':'Warten · Drehen', input:'Eingabe', affirm:'Zustimmen', success:'Erfolg', wary:'Wachsam', angry:'Wütend', refuse:'Ablehnen', surprise:'Überrascht', sleep:'Schlafen', wake:'Aufwachen' },
    states: { idle:'Bereit', bored:'Gelangweilt', waiting:'Warten', input:'Eingabe', affirm:'Zustimmen', success:'Erfolg', happy:'Erfolg', wary:'Wachsam', angry:'Wütend', refuse:'Ablehnen', surprise:'Überrascht', sleepy:'Müde', sleep:'Schläft', wake:'Wach' },
  },
  fr: {
    webComponent: 'Composant Web', color: 'Couleur', settings: 'Réglages', language: 'Langue',
    colorSettings: 'Réglages des couleurs', otherSettings: 'Autres réglages', languageSettings: 'Langue de la page',
    background: 'Arrière-plan', head: 'Couleur de tête', eyeThrough: 'Yeux transparents', reset: 'Réinitialiser couleurs',
    antenna: 'Antenne', loop: 'Lecture en boucle', pointerFollow: 'Suivre le curseur',
    actions: { idle:'Normal', bored:'Ennui', 'waiting-spin':'Attente · Rotation', input:'Entrée', affirm:'Approuver', success:'Succès', wary:'Méfiance', angry:'Colère', refuse:'Refuser', surprise:'Surprise', sleep:'Dormir', wake:'Réveil' },
    states: { idle:'En veille', bored:'Ennui', waiting:'Attente', input:'Saisie', affirm:'Approuver', success:'Succès', happy:'Succès', wary:'Méfiance', angry:'Colère', refuse:'Refuser', surprise:'Surprise', sleepy:'Somnolent', sleep:'Endormi', wake:'Réveillé' },
  },
});

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function mountDemoControls() {
  const stack = document.querySelector('.demo-control-stack');
  if (!stack || stack.dataset.controlsMounted) return;

  const canvas = document.getElementById('canvas');
  const stage = document.getElementById('demoStage');
  const stageReset = document.getElementById('demoStageReset');
  const face = document.getElementById('face');
  const controls = document.querySelector('.controls');
  if (!canvas || !face || !controls) return;
  stack.dataset.controlsMounted = 'true';

  document.querySelector('.support-link')?.remove();

  const title = document.querySelector('.title');
  if (title) {
    title.classList.add('demo-title');
    title.innerHTML = '<span>Agent Robot Avatar</span><span>SVG + Vanilla JS</span><span>Web Component</span>';
  }

  const status = document.getElementById('status');
  if (status) status.classList.add('demo-status');

  const oldFollow = document.querySelector('.follow-control');
  const oldFollowInput = oldFollow?.querySelector('input[type=checkbox]') || null;
  if (oldFollow) oldFollow.classList.add('demo-original-follow');

  const options = stack.querySelector('.demo-options');

  const colorPanelToggle = options.querySelector('#demoColorPanelToggle');
  const settingsPanelToggle = options.querySelector('#demoSettingsPanelToggle');
  const languagePanelToggle = options.querySelector('#demoLanguagePanelToggle');
  const colorPanel = options.querySelector('#demoColorPanel');
  const settingsPanel = options.querySelector('#demoSettingsPanel');
  const languagePanel = options.querySelector('#demoLanguagePanel');
  const bgColor = colorPanel.querySelector('#demoBgColor');
  const headColor = colorPanel.querySelector('#demoHeadColor');
  const eyeThrough = colorPanel.querySelector('#demoEyeThrough');
  const antennaToggle = options.querySelector('#demoAntenna');
  const loopToggle = options.querySelector('#demoLoop');
  const pointerToggle = options.querySelector('#demoPointerFollow');
  const resetButton = colorPanel.querySelector('#demoReset');
  const randomButton = options.querySelector('#demoRandomColors');
  const swapButton = colorPanel.querySelector('#demoSwapColors');
  const paletteNote = colorPanel.querySelector('#demoPaletteNote');
  const presets = colorPanel.querySelector('#demoColorPresets');
  const paletteCaption = colorPanel.querySelector('#demoPaletteCaption');
  const canHover = window.matchMedia('(hover: hover)');
  const paletteButtons = [];
  for (const palette of PALETTES) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'demo-swatch';
    button.dataset.preset = palette.id;
    button.setAttribute('aria-pressed', 'false');
    button.style.setProperty('--swatch-bg', palette.background);
    button.style.setProperty('--swatch-head', palette.head);
    const entry = { button, palette };
    // Hovering another palette previews it; the chosen one just shows the chosen colors.
    // Leaving the swatches restores the chosen colors.
    button.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      if (!isChosen(entry)) previewPalette(entry);
      else {
        endPreview();
        showCaption(entry);
      }
    });
    button.addEventListener('click', () => choosePalette(entry));
    presets.appendChild(button);
    paletteButtons.push(entry);
  }
  presets.addEventListener('pointerleave', () => endPreview());

  let currentLanguage = initialLanguage();
  let currentState = 'idle';

  function setPanel(openPanel) {
    const colorOpen = openPanel === 'color';
    const settingsOpen = openPanel === 'settings';
    const languageOpen = openPanel === 'language';
    if (!colorOpen) endPreview();
    colorPanel.hidden = !colorOpen;
    settingsPanel.hidden = !settingsOpen;
    languagePanel.hidden = !languageOpen;
    colorPanelToggle.classList.toggle('demo-panel-open', colorOpen);
    settingsPanelToggle.classList.toggle('demo-panel-open', settingsOpen);
    languagePanelToggle.classList.toggle('demo-panel-open', languageOpen);
    colorPanelToggle.setAttribute('aria-expanded', String(colorOpen));
    settingsPanelToggle.setAttribute('aria-expanded', String(settingsOpen));
    languagePanelToggle.setAttribute('aria-expanded', String(languageOpen));
  }

  function updateStatus() {
    if (!status) return;
    const t = I18N[currentLanguage];
    status.textContent = `${currentState} · ${t.states[currentState] || currentState}`;
  }

  function applyLanguage(language = currentLanguage, { remember = false, updateUrl = false } = {}) {
    currentLanguage = I18N[language] ? language : 'en';
    const t = I18N[currentLanguage];
    document.documentElement.lang = currentLanguage;

    if (remember) {
      try { localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage); } catch (_) {}
    }
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', currentLanguage);
      history.replaceState(history.state, '', url);
    }

    if (title) title.innerHTML = `<span>Agent Robot Avatar</span><span>SVG + Vanilla JS</span><span>${t.webComponent}</span>`;

    const paletteUI = PALETTE_UI[currentLanguage] || PALETTE_UI.en;
    colorPanelToggle.title = t.colorSettings;
    colorPanelToggle.setAttribute('aria-label', t.colorSettings);
    settingsPanelToggle.title = t.settings;
    settingsPanelToggle.setAttribute('aria-label', t.settings);
    languagePanelToggle.title = t.language;
    languagePanelToggle.setAttribute('aria-label', t.language);
    colorPanel.setAttribute('aria-label', t.colorSettings);
    for (const { button, palette } of paletteButtons) {
      const name = palette[currentLanguage] || palette.name;
      button.title = name;
      button.setAttribute('aria-label', name);
    }
    showCaption();
    randomButton.title = paletteUI.random;
    randomButton.setAttribute('aria-label', paletteUI.random);
    swapButton.title = paletteUI.swap;
    swapButton.setAttribute('aria-label', paletteUI.swap);
    paletteNote.textContent = paletteUI.note;
    settingsPanel.setAttribute('aria-label', t.otherSettings);
    languagePanel.setAttribute('aria-label', t.languageSettings);

    colorPanel.querySelector('#demoBgLabel').textContent = t.background;
    colorPanel.querySelector('#demoHeadLabel').textContent = t.head;
    colorPanel.querySelector('#demoEyeThroughLabel').textContent = t.eyeThrough;
    options.querySelector('#demoAntennaLabel').textContent = t.antenna;
    options.querySelector('#demoLoopLabel').textContent = t.loop;
    options.querySelector('#demoPointerFollowLabel').textContent = t.pointerFollow;
    resetButton.textContent = t.reset;
    stageReset.title = t.reset;
    stageReset.setAttribute('aria-label', t.reset);
    bgColor.setAttribute('aria-label', t.background);
    headColor.setAttribute('aria-label', t.head);

    controls.querySelectorAll('button[data-action]').forEach(button => {
      const label = t.actions[button.dataset.action];
      if (label) button.textContent = label;
    });

    options.querySelectorAll('.demo-language-option').forEach(button => {
      button.classList.toggle('demo-language-active', button.dataset.lang === currentLanguage);
    });
    updateStatus();
  }

  window.AgentRobotAvatarApplyDemoLanguage = () => applyLanguage(currentLanguage);

  colorPanelToggle.addEventListener('click', () => setPanel(colorPanel.hidden ? 'color' : null));
  settingsPanelToggle.addEventListener('click', () => setPanel(settingsPanel.hidden ? 'settings' : null));
  languagePanelToggle.addEventListener('click', () => setPanel(languagePanel.hidden ? 'language' : null));
  languagePanel.addEventListener('click', event => {
    const button = event.target.closest('button[data-lang]');
    if (!button) return;
    applyLanguage(button.dataset.lang, { remember: true, updateUrl: true });
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const HEAD_PARTS = ['head', 'leftTop', 'rightTop', 'leftBottom', 'rightBottom', 'antennaDot'];
  const EYE_PARTS = ['leftBase', 'rightBase', 'leftInputBase', 'rightInputBase'];
  let shown = { background: bgColor.value, head: headColor.value, eyes: '#ffffff' };
  let fadeFrame = 0;
  let previewing = false;
  // The opening show paints the stage itself while it runs.
  let stageOverride = null;

  function paintColors(background, head, eyes) {
    shown = { background, head, eyes };
    stage.style.setProperty('--demo-stage-bg', stageOverride ?? background);
    face.setAttribute('color', head);
    const shadow = face.shadowRoot;
    if (!shadow) return;
    HEAD_PARTS.forEach(id => shadow.getElementById(id)?.setAttribute('fill', head));
    EYE_PARTS.forEach(id => shadow.getElementById(id)?.setAttribute('fill', eyes));
  }

  function mixColor(from, to, t) {
    const channel = (hex, i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
    return '#' + [0, 1, 2].map(i => {
      const value = Math.round(channel(from, i) + (channel(to, i) - channel(from, i)) * t);
      return value.toString(16).padStart(2, '0');
    }).join('');
  }

  function fadeColors(background, head, eyes, duration = 320) {
    cancelAnimationFrame(fadeFrame);
    if (reducedMotion.matches) {
      paintColors(background, head, eyes);
      return;
    }
    const from = shown;
    const start = performance.now();
    const step = now => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      paintColors(
        mixColor(from.background, background, eased),
        mixColor(from.head, head, eased),
        mixColor(from.eyes, eyes, eased),
      );
      if (t < 1) fadeFrame = requestAnimationFrame(step);
    };
    fadeFrame = requestAnimationFrame(step);
  }

  function showChosenColors({ fade = false } = {}) {
    const background = bgColor.value.toLowerCase();
    const head = headColor.value.toLowerCase();
    const eyes = eyeThrough.checked ? background : '#ffffff';
    if (fade) fadeColors(background, head, eyes);
    else {
      cancelAnimationFrame(fadeFrame);
      paintColors(background, head, eyes);
    }
    syncPresetSelection();
  }

  const isChosen = entry => entry.button.getAttribute('aria-pressed') === 'true';

  // A click applies the palette; on the chosen swatch it swaps background and head instead.
  function nextColors(entry) {
    if (isChosen(entry)) return { background: headColor.value.toLowerCase(), head: bgColor.value.toLowerCase() };
    return { background: entry.palette.background, head: entry.palette.head };
  }

  // The caption names the hovered palette, else the chosen one, else says how to use it.
  // On the chosen palette it also says that clicking again swaps the colors.
  function showCaption(entry = paletteButtons.find(isChosen)) {
    const paletteUI = PALETTE_UI[currentLanguage] || PALETTE_UI.en;
    paletteCaption.classList.toggle('demo-caption-hint', !entry);
    if (!entry) {
      paletteCaption.textContent = canHover.matches ? paletteUI.hint : paletteUI.tapHint;
      return;
    }
    paletteCaption.textContent = entry.palette[currentLanguage] || entry.palette.name;
    if (isChosen(entry)) {
      const hint = document.createElement('span');
      hint.className = 'demo-caption-extra';
      hint.textContent = ` · ${paletteUI.swapHint}`;
      paletteCaption.appendChild(hint);
    }
  }

  function previewPalette(entry) {
    const { background, head } = nextColors(entry);
    previewing = true;
    showCaption(entry);
    fadeColors(background, head, background);
  }

  function endPreview() {
    if (!previewing) return;
    previewing = false;
    showChosenColors({ fade: true });
  }

  function choosePalette(entry) {
    const { background, head } = nextColors(entry);
    previewing = false;
    bgColor.value = background;
    headColor.value = head;
    eyeThrough.checked = true;
    showChosenColors({ fade: true });
    if (!loopEnabled) face.play('success');
  }

  function syncPresetSelection() {
    const bg = bgColor.value.toLowerCase();
    const head = headColor.value.toLowerCase();
    let found = false;
    for (const { button, palette } of paletteButtons) {
      const reversed = bg === palette.head && head === palette.background;
      const matches = !found && eyeThrough.checked && (reversed || (bg === palette.background && head === palette.head));
      found ||= matches;
      button.setAttribute('aria-pressed', String(matches));
      // The swatch shows the pair the way it is applied, top part the background.
      button.style.setProperty('--swatch-top', reversed ? palette.head : palette.background);
      button.style.setProperty('--swatch-bottom', reversed ? palette.background : palette.head);
    }
    if (!previewing) showCaption();
    stageReset.hidden = bg === DEFAULTS.background && head === DEFAULTS.head && eyeThrough.checked === DEFAULTS.eyeThrough;
  }

  function applyAntennaVisibility() {
    const dot = face.shadowRoot?.getElementById('antennaDot');
    if (!dot) return false;
    dot.style.display = antennaToggle.checked ? '' : 'none';
    return true;
  }

  function syncAntennaVisibility() {
    if (applyAntennaVisibility()) return;
    requestAnimationFrame(applyAntennaVisibility);
    setTimeout(applyAntennaVisibility, 60);
  }

  bgColor.addEventListener('input', () => showChosenColors());
  headColor.addEventListener('input', () => showChosenColors());
  eyeThrough.addEventListener('change', () => showChosenColors({ fade: true }));
  antennaToggle.addEventListener('change', syncAntennaVisibility);

  pointerToggle.addEventListener('change', () => {
    if (oldFollowInput) oldFollowInput.checked = pointerToggle.checked;
    face.setPointerFollow(pointerToggle.checked);
  });
  face.setPointerFollow(pointerToggle.checked);

  face.addEventListener('face-state', event => {
    // The opening show is decoration, not a state worth reporting.
    if (document.documentElement.dataset.demoIntro) return;
    currentState = String(event.detail?.state || 'idle');
    updateStatus();
  });

  let loopEnabled = false;
  let loopToken = 0;
  let activeAction = null;

  loopToggle.addEventListener('change', () => {
    loopEnabled = loopToggle.checked;
    if (!loopEnabled) {
      loopToken += 1;
      if (['waiting-spin', 'waiting-wrap', 'waiting-wave'].includes(activeAction)) face.stopWaiting();
    }
  });

  const extraLoopDelay = Object.freeze({ idle:900, bored:3350, 'waiting-spin':0, 'waiting-wrap':0, input:900, sleep:800, wake:500 });

  async function playOneCycle(action, token) {
    if (action === 'waiting-spin' && loopEnabled) {
      await face.startWaiting();
      return;
    }
    if (action === 'waiting-wrap' && loopEnabled) {
      await face.startWaiting({ variant:'wrap' });
      return;
    }
    if (action === 'waiting-wave' && loopEnabled) {
      await face.startWaiting({ variant:'wave' });
      return;
    }
    if (action === 'wake' && loopEnabled) {
      if (!face._sleeping && face._state !== 'sleep') {
        await Promise.resolve(face.play('sleep'));
        if (token !== loopToken) return;
        await wait(160);
      }
      if (token !== loopToken) return;
      await Promise.resolve(face.play('wake'));
      return;
    }
    if (action === 'input' && (face._inputWanted || face._state === 'input')) face.reset();
    if (action === 'sleep' && face._sleeping) face.reset();
    await Promise.resolve(face.play(action));
  }

  async function runAction(action) {
    const token = ++loopToken;
    activeAction = action;
    do {
      if (token !== loopToken) return;
      await playOneCycle(action, token);
      if (['waiting-spin', 'waiting-wrap', 'waiting-wave'].includes(action) && loopEnabled) return;
      if (token !== loopToken || !loopEnabled) return;
      const delay = extraLoopDelay[action] ?? 140;
      if (delay > 0) await wait(delay);
      if (token !== loopToken || !loopEnabled) return;
      if (action === 'input' || action === 'sleep') face.reset();
    } while (token === loopToken && loopEnabled && activeAction === action);
  }

  controls.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button || !controls.contains(button)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    controls.querySelectorAll('button[data-action]').forEach(item => item.classList.toggle('demo-active', item === button));
    runAction(button.dataset.action);
  }, true);

  swapButton.addEventListener('click', () => {
    [bgColor.value, headColor.value] = [headColor.value, bgColor.value];
    showChosenColors({ fade: true });
  });

  randomButton.addEventListener('click', () => {
    const others = paletteButtons.filter(({ button }) => button.getAttribute('aria-pressed') !== 'true');
    choosePalette(others[Math.floor(Math.random() * others.length)]);
  });

  stageReset.addEventListener('click', () => resetButton.click());

  resetButton.addEventListener('click', () => {
    bgColor.value = DEFAULTS.background;
    headColor.value = DEFAULTS.head;
    eyeThrough.checked = DEFAULTS.eyeThrough;
    showChosenColors({ fade: true });
  });

  showChosenColors();
  syncAntennaVisibility();
  setPanel(null);
  applyLanguage(currentLanguage);

  // Opening show: the stage rolls down through the palettes like a slot reel, dark to
  // light, in step with a slower, longer spin of the eyes. When both come to rest,
  // brand colors burst behind the avatar and swirl away to white while it strikes
  // the success pose. The reel is one gradient strip moved with a transform, and the
  // burst one rotating layer. Any click, key, scroll or other action ends the show
  // at once, and reduced motion skips it.

  // [palette, swapped]: from dark to light, the backgrounds walk around the color
  // wheel (navy, sky blue, indigo, pink, orange, gold, yellow) so that neighbors
  // blend without turning grey; once they are white the heads grow darker, ending
  // next to the default black on white. Swapped palettes give more light backgrounds.
  const INTRO_SEQUENCE = [
    ['warriors'], ['telegram'], ['discord'], ['dribbble'], ['ubuntu'], ['lakers'],
    ['snapchat'], ['claude'], ['telegram', true], ['chatgpt'], ['dribbble', true],
    ['youtube'], ['discord', true],
  ];
  // A longer reel spin than the random button, for more turns.
  const INTRO_REEL = Object.freeze({ speed: 0.5, spin: 2900 });
  const BRAND_COLORS = ['#e50914', '#1ed760', '#f2ff59', '#ffc72c', '#5865f2', '#229ed9', '#e95420',
    '#ea4c89', '#fdb927', '#fffc00', '#0fa578', '#d97757', '#6cabdd', '#a50044'];
  let stopIntro = null;
  let finale = null;

  function reelScene({ chosen, eyesFor, play, done, isEnded }) {
    const palettes = INTRO_SEQUENCE.map(([id, swapped]) => {
      const palette = PALETTES.find(item => item.id === id);
      return swapped ? { ...palette, background: palette.head, head: palette.background } : palette;
    });
    // Top to bottom: a filler for the landing bounce, the chosen colors, the palettes
    // from light back to dark, and the current colors, which show first.
    const blocks = [chosen, chosen, ...palettes.slice().reverse(), { background: shown.background, head: shown.head }];
    // One gradient strip; soft seams keep a fast roll from looking torn.
    const reel = document.createElement('div');
    reel.className = 'demo-stage-reel';
    const strip = document.createElement('div');
    strip.className = 'demo-stage-reel-strip';
    const height = stage.clientHeight + 2;
    const seam = Math.round(height * 0.18);
    strip.style.height = `${height * blocks.length}px`;
    const stops = blocks.map((block, i) => {
      const from = i * height + (i ? seam / 2 : 0);
      const to = (i + 1) * height - (i < blocks.length - 1 ? seam / 2 : 0);
      return `${block.background} ${from}px ${to}px`;
    }).join(', ');
    // Seams blend in OKLab where supported, which keeps them from going grey.
    strip.style.background = `linear-gradient(${stops})`;
    strip.style.background = `linear-gradient(in oklab, ${stops})`;
    reel.appendChild(strip);
    let frame = 0;
    let shownBlock = blocks.length - 1;

    // The head and eyes follow the block that fills most of the stage.
    const follow = () => {
      if (isEnded()) return;
      const offset = new DOMMatrixReadOnly(getComputedStyle(strip).transform).m42;
      const index = Math.min(blocks.length - 1, Math.max(0, Math.round(-offset / height)));
      if (index !== shownBlock) {
        shownBlock = index;
        const block = blocks[index];
        paintColors(block.background, block.head, eyesFor(block.background));
      }
      frame = requestAnimationFrame(follow);
    };
    // The eyes' reel starts after the action's short preparation; roll the stage
    // with it, for the same time.
    const roll = () => {
      if (isEnded() || strip.getAnimations().length) return;
      const startY = -(blocks.length - 1) * height;
      const endY = -height;
      const travel = endY - startY;
      const animation = strip.animate([
        { transform: `translateY(${startY}px)`, easing: 'cubic-bezier(.5,0,1,1)' },
        { transform: `translateY(${startY + travel * 0.04}px)`, offset: 0.08 },
        { transform: `translateY(${startY + travel * 0.8}px)`, offset: 0.7, easing: 'cubic-bezier(0,0,.35,1)' },
        { transform: `translateY(${endY + height * 0.12}px)`, offset: 0.9, easing: 'cubic-bezier(.45,0,.4,1)' },
        { transform: `translateY(${endY}px)` },
      ], { duration: face._randomFx?.duration ?? 3400, fill: 'forwards' });
      frame = requestAnimationFrame(follow);
      animation.onfinish = () => done('scene');
    };
    const onState = event => {
      if (event.detail.state !== 'random') return;
      face.removeEventListener('face-state', onState);
      roll();
    };
    let fallback = 0;
    return {
      start() {
        face.addEventListener('face-state', onState);
        const config = window.AgentRobotAvatarRandomConfig;
        const saved = config && { speed: config.speed, spin: config.spin };
        if (config) Object.assign(config, INTRO_REEL);
        try { play('random'); } finally { if (saved) Object.assign(config, saved); }
        stageOverride = 'transparent';
        stage.insertBefore(reel, stage.querySelector('.avatar-home'));
        // Should the eyes never start (an older component), roll anyway.
        fallback = setTimeout(() => {
          if (strip.getAnimations().length) return;
          done('eyes');
          roll();
        }, 800);
      },
      teardown() {
        cancelAnimationFrame(frame);
        clearTimeout(fallback);
        face.removeEventListener('face-state', onState);
        reel.remove();
      },
    };
  }

  // Ending ripple: one wide ring tinted with faint brand colors spreads from behind
  // the avatar to the edges of the stage, turning as it goes, and fades out.
  function playFinale() {
    finale?.remove();
    const clip = document.createElement('div');
    clip.className = 'demo-intro-finale';
    const pastel = BRAND_COLORS.map(color => mixColor(color, '#ffffff', 0.6));
    const size = Math.ceil(Math.hypot(stage.clientWidth, stage.clientHeight)) + 80;
    const ring = document.createElement('div');
    Object.assign(ring.style, {
      width: `${size}px`, height: `${size}px`,
      left: `${(stage.clientWidth - size) / 2}px`, top: `${(stage.clientHeight - size) / 2}px`,
      background: `conic-gradient(from 0deg, ${pastel.join(', ')}, ${pastel[0]})`,
    });
    clip.appendChild(ring);
    stage.insertBefore(clip, stage.querySelector('.avatar-home'));
    finale = clip;
    ring.animate([
      { transform: 'scale(.12) rotate(0deg)', opacity: 0 },
      { opacity: 0.55, offset: 0.18 },
      { transform: 'scale(1) rotate(120deg)', opacity: 0 },
    ], { duration: 1700, easing: 'cubic-bezier(.2,.6,.35,1)', fill: 'both' }).onfinish = () => {
      clip.remove();
      if (finale === clip) finale = null;
    };
  }

  function playIntro() {
    stopIntro?.();
    finale?.remove();
    if (reducedMotion.matches) return;
    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    const chosen = { background: bgColor.value.toLowerCase(), head: headColor.value.toLowerCase() };
    const eyesFor = background => (eyeThrough.checked ? background : '#ffffff');
    const pending = new Set(['scene', 'eyes']);
    let ownAction = false;
    let ended = false;

    const play = action => {
      ownAction = true;
      try { face.play(action); } finally { ownAction = false; }
    };
    const done = part => {
      pending.delete(part);
      land();
    };
    const scene = reelScene({ chosen, eyesFor, play, done, isEnded: () => ended });
    const onEyes = event => {
      if (event.detail.action !== 'random' || event.detail.phase === 'start') return;
      done('eyes');
    };
    const cleanup = () => {
      ended = true;
      stopIntro = null;
      events.forEach(type => window.removeEventListener(type, end, true));
      face.removeEventListener('action-state', onAction);
      face.removeEventListener('action-state', onEyes);
      scene.teardown();
      stageOverride = null;
      delete document.documentElement.dataset.demoIntro;
    };
    function end() {
      if (ended) return;
      cleanup();
      showChosenColors({ fade: true });
      // An action that interrupted the show may have changed state while it ran.
      currentState = String(face._state || 'idle');
      updateStatus();
    }
    function onAction(event) {
      if (!ownAction && event.detail.phase === 'start') end();
    }
    function land() {
      if (ended || pending.size) return;
      cleanup();
      showChosenColors();
      // Ending: as the ripple spreads the head tilts to one side and back, then the
      // happy eyes and a small hop land as a "ta-da". It is still part of the show,
      // so the status label waits until it is over.
      document.documentElement.dataset.demoIntro = 'true';
      const release = event => {
        if (event.detail.action === 'success' && event.detail.phase === 'start') return;
        face.removeEventListener('action-state', release);
        if (stopIntro) return; // a replay took over
        delete document.documentElement.dataset.demoIntro;
        currentState = String(face._state || 'idle');
        updateStatus();
      };
      const head = face._headMotion;
      const tilt = head?.animate && !face._isReducedMotion?.() ? (() => {
        // Keep the eyes centered while the head tilts: the gaze lock ignores wandering
        // and the pointer, the same way every action holds the gaze.
        face._expressionLock = true;
        face._wanderTarget.x = face._wanderTarget.y = 0;
        head.style.transformBox = 'view-box';
        head.style.transformOrigin = '120px 120px';
        return head.animate([
          { transform: 'translateX(0px) rotate(0deg)', offset: 0, easing: 'cubic-bezier(.35,0,.22,1)' },
          { transform: 'translateX(3px) rotate(9deg)', offset: 0.45, easing: 'cubic-bezier(.35,0,.22,1)' },
          { transform: 'translateX(0px) rotate(0deg)', offset: 1 },
        ], { duration: 1100, easing: 'linear' });
      })() : null;
      let timer = 0;
      // Anything the visitor starts during the tilt takes over: no smile afterwards.
      const interrupt = event => {
        if (event.detail.phase !== 'start') return;
        clearTimeout(timer);
        tilt?.cancel();
        face.removeEventListener('action-state', interrupt);
        if (stopIntro) return;
        delete document.documentElement.dataset.demoIntro;
        currentState = String(face._state || 'idle');
        updateStatus();
      };
      face.addEventListener('action-state', interrupt);
      playFinale();
      timer = setTimeout(() => {
        face.removeEventListener('action-state', interrupt);
        face.addEventListener('action-state', release);
        play('success');
      }, tilt ? 1100 : 0);
    }

    stopIntro = end;
    document.documentElement.dataset.demoIntro = 'true';
    events.forEach(type => window.addEventListener(type, end, { capture: true, passive: true }));
    face.addEventListener('action-state', onAction);
    face.addEventListener('action-state', onEyes);
    scene.start();
  }

  if (document.documentElement.dataset.demoReady) playIntro();
  else {
    const ready = new MutationObserver(() => {
      if (!document.documentElement.dataset.demoReady) return;
      ready.disconnect();
      playIntro();
    });
    ready.observe(document.documentElement, { attributes: true, attributeFilter: ['data-demo-ready'] });
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountDemoControls, { once: true });
else mountDemoControls();

export { mountDemoControls };


