// Brand-inspired demo palettes; these are visual examples, not official themes.
const COLOR_PRESETS = Object.freeze([
  { id:'default', background:'#f8f8f6', head:'#08090b', zh:'默认', en:'Default' },
  { id:'mcdonalds', background:'#ffc72c', head:'#da291c', zh:'麦当劳', en:"McDonald's" },
  { id:'ikea', background:'#ffda1a', head:'#0058a3', zh:'宜家', en:'IKEA' },
  { id:'lakers', background:'#fdb927', head:'#552583', zh:'湖人', en:'Lakers' },
  { id:'starbucks', background:'#f1f8f4', head:'#00754a', zh:'星巴克', en:'Starbucks' },
  { id:'claude', background:'#faf4ed', head:'#c96442', zh:'Claude', en:'Claude' },
  { id:'chatgpt', background:'#ffffff', head:'#10a37f', zh:'ChatGPT', en:'ChatGPT' },
  { id:'gemini', background:'#e9e6ff', head:'#4b61d1', zh:'Gemini', en:'Gemini' },
  { id:'lululemon', background:'#ffffff', head:'#d31334', zh:'lululemon', en:'lululemon' },
  { id:'adidas', background:'#ffffff', head:'#111111', zh:'阿迪达斯', en:'adidas' },
  { id:'tiffany', background:'#81d8d0', head:'#182e2c', zh:'Tiffany', en:'Tiffany' },
  { id:'hermes', background:'#f37021', head:'#3b2517', zh:'爱马仕', en:'Hermès' },
  { id:'burberry', background:'#d6bd98', head:'#30261c', zh:'Burberry', en:'Burberry' },
  { id:'fendi', background:'#f9d91c', head:'#242424', zh:'Fendi', en:'Fendi' },
  { id:'spotify', background:'#1ed760', head:'#191414', zh:'Spotify', en:'Spotify' },
  { id:'nintendo', background:'#e60012', head:'#ffffff', zh:'任天堂', en:'Nintendo' },
  { id:'muji', background:'#f3efdf', head:'#7f0019', zh:'无印良品', en:'MUJI' },
]);

const THEME_UI = Object.freeze({
  'zh-CN': { custom:'自定义颜色', themes:'主题配色' },
  'zh-TW': { custom:'自訂顏色', themes:'主題配色' },
  en: { custom:'Custom colors', themes:'Color themes' },
  ja: { custom:'カスタムカラー', themes:'配色テーマ' },
  ko: { custom:'사용자 색상', themes:'색상 테마' },
  es: { custom:'Colores personalizados', themes:'Temas de color' },
  pt: { custom:'Cores personalizadas', themes:'Temas de cor' },
  de: { custom:'Eigene Farben', themes:'Farbthemen' },
  fr: { custom:'Couleurs personnalisées', themes:'Thèmes de couleurs' },
});

const DEFAULTS = Object.freeze({
  background: '#f8f8f6',
  head: '#08090b',
  eyeThrough: true,
  antenna: true,
  antennaFlash: true,
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
    antenna: '天线', antennaFlash: '天线闪动', loop: '循环', pointerFollow: '鼠标跟随',
    actions: { idle:'正常', bored:'发呆', waiting:'等待', input:'输入', send:'发送/点头', success:'成功', warning:'警告', angry:'内容阻止', error:'系统错误', surprise:'惊讶', sleep:'睡着', wake:'醒来' },
    states: { idle:'默认待机', bored:'发呆', waiting:'等待', input:'输入中', send:'发送', success:'成功', happy:'成功', warning:'警告确认', angry:'内容阻止', error:'系统错误', surprise:'惊讶', sleepy:'困倦', sleep:'睡眠', wake:'醒来' },
  },
  'zh-TW': {
    webComponent: 'Web 元件', color: '顏色', settings: '設定', language: '語言',
    colorSettings: '顏色設定', otherSettings: '其他功能', languageSettings: '頁面語言',
    background: '背景色', head: '頭部顏色', eyeThrough: '眼睛穿透', reset: '恢復預設',
    antenna: '天線', antennaFlash: '天線閃動', loop: '循環', pointerFollow: '滑鼠跟隨',
    actions: { idle:'正常', bored:'發呆', waiting:'等待', input:'輸入', send:'傳送/點頭', success:'成功', warning:'警告', angry:'內容阻止', error:'系統錯誤', surprise:'驚訝', sleep:'睡著', wake:'醒來' },
    states: { idle:'預設待機', bored:'發呆', waiting:'等待', input:'輸入中', send:'傳送', success:'成功', happy:'成功', warning:'警告確認', angry:'內容阻止', error:'系統錯誤', surprise:'驚訝', sleepy:'睏倦', sleep:'睡眠', wake:'醒來' },
  },
  en: {
    webComponent: 'Web Component', color: 'Color', settings: 'Settings', language: 'Language',
    colorSettings: 'Color settings', otherSettings: 'Other settings', languageSettings: 'Page language',
    background: 'Background', head: 'Head color', eyeThrough: 'Transparent eyes', reset: 'Reset colors',
    antenna: 'Antenna', antennaFlash: 'Antenna blink', loop: 'Loop', pointerFollow: 'Pointer follow',
    actions: { idle:'Normal', bored:'Bored', waiting:'Waiting', input:'Input', send:'Send/Nod', success:'Success', warning:'Warning', angry:'Blocked', error:'System Error', surprise:'Surprise', sleep:'Sleep', wake:'Wake' },
    states: { idle:'Idle', bored:'Bored', waiting:'Waiting', input:'Input', send:'Sending', success:'Success', happy:'Success', warning:'Warning', angry:'Blocked', error:'System Error', surprise:'Surprise', sleepy:'Sleepy', sleep:'Sleeping', wake:'Awake' },
  },
  ja: {
    webComponent: 'Web コンポーネント', color: 'カラー', settings: '設定', language: '言語',
    colorSettings: 'カラー設定', otherSettings: 'その他の設定', languageSettings: 'ページ言語',
    background: '背景色', head: 'ヘッド色', eyeThrough: '目を透過', reset: '色をリセット',
    antenna: 'アンテナ', antennaFlash: 'アンテナ点滅', loop: 'ループ', pointerFollow: 'マウス追従',
    actions: { idle:'通常', bored:'退屈', waiting:'待機', input:'入力', send:'送信/うなずき', success:'成功', warning:'警告', angry:'ブロック', error:'システムエラー', surprise:'驚き', sleep:'睡眠', wake:'起床' },
    states: { idle:'待機中', bored:'退屈', waiting:'待機', input:'入力中', send:'送信中', success:'成功', happy:'成功', warning:'警告', angry:'ブロック', error:'システムエラー', surprise:'驚き', sleepy:'眠い', sleep:'睡眠中', wake:'起床' },
  },
  ko: {
    webComponent: '웹 컴포넌트', color: '색상', settings: '설정', language: '언어',
    colorSettings: '색상 설정', otherSettings: '기타 설정', languageSettings: '페이지 언어',
    background: '배경색', head: '머리 색상', eyeThrough: '눈 투과', reset: '색상 초기화',
    antenna: '안테나', antennaFlash: '안테나 점멸', loop: '반복', pointerFollow: '마우스 추적',
    actions: { idle:'정상', bored:'멍함', waiting:'대기', input:'입력', send:'전송/끄덕임', success:'성공', warning:'경고', angry:'차단', error:'시스템 오류', surprise:'놀람', sleep:'수면', wake:'깨우기' },
    states: { idle:'대기 중', bored:'멍함', waiting:'대기', input:'입력 중', send:'전송 중', success:'성공', happy:'성공', warning:'경고', angry:'차단', error:'시스템 오류', surprise:'놀람', sleepy:'졸림', sleep:'수면 중', wake:'깨어남' },
  },
  es: {
    webComponent: 'Componente Web', color: 'Color', settings: 'Ajustes', language: 'Idioma',
    colorSettings: 'Ajustes de color', otherSettings: 'Otros ajustes', languageSettings: 'Idioma de página',
    background: 'Fondo', head: 'Color de cabeza', eyeThrough: 'Ojos transparentes', reset: 'Restablecer colores',
    antenna: 'Antena', antennaFlash: 'Parpadeo antena', loop: 'Bucle', pointerFollow: 'Seguir cursor',
    actions: { idle:'Normal', bored:'Aburrido', waiting:'Esperando', input:'Entrada', send:'Enviar/Asentir', success:'Éxito', warning:'Aviso', angry:'Bloqueado', error:'Error del sistema', surprise:'Sorpresa', sleep:'Dormir', wake:'Despertar' },
    states: { idle:'En espera', bored:'Aburrido', waiting:'Esperando', input:'Introduciendo', send:'Enviando', success:'Éxito', happy:'Éxito', warning:'Aviso', angry:'Bloqueado', error:'Error del sistema', surprise:'Sorpresa', sleepy:'Somnoliento', sleep:'Durmiendo', wake:'Despierto' },
  },
  pt: {
    webComponent: 'Componente Web', color: 'Cor', settings: 'Configurações', language: 'Idioma',
    colorSettings: 'Configurações de cor', otherSettings: 'Outras configurações', languageSettings: 'Idioma da página',
    background: 'Fundo', head: 'Cor da cabeça', eyeThrough: 'Olhos transparentes', reset: 'Redefinir cores',
    antenna: 'Antena', antennaFlash: 'Piscar antena', loop: 'Repetir', pointerFollow: 'Seguir cursor',
    actions: { idle:'Normal', bored:'Entediado', waiting:'Aguardando', input:'Entrada', send:'Enviar/Acenar', success:'Sucesso', warning:'Aviso', angry:'Bloqueado', error:'Erro do sistema', surprise:'Surpresa', sleep:'Dormir', wake:'Acordar' },
    states: { idle:'Em espera', bored:'Entediado', waiting:'Aguardando', input:'Digitando', send:'Enviando', success:'Sucesso', happy:'Sucesso', warning:'Aviso', angry:'Bloqueado', error:'Erro do sistema', surprise:'Surpresa', sleepy:'Sonolento', sleep:'Dormindo', wake:'Acordado' },
  },
  de: {
    webComponent: 'Webkomponente', color: 'Farbe', settings: 'Einstellungen', language: 'Sprache',
    colorSettings: 'Farbeinstellungen', otherSettings: 'Weitere Einstellungen', languageSettings: 'Seitensprache',
    background: 'Hintergrund', head: 'Kopffarbe', eyeThrough: 'Augen transparent', reset: 'Farben zurücksetzen',
    antenna: 'Antenne', antennaFlash: 'Antenne blinken', loop: 'Schleife', pointerFollow: 'Maus folgen',
    actions: { idle:'Normal', bored:'Gelangweilt', waiting:'Warten', input:'Eingabe', send:'Senden/Nicken', success:'Erfolg', warning:'Warnung', angry:'Blockiert', error:'Systemfehler', surprise:'Überrascht', sleep:'Schlafen', wake:'Aufwachen' },
    states: { idle:'Bereit', bored:'Gelangweilt', waiting:'Warten', input:'Eingabe', send:'Senden', success:'Erfolg', happy:'Erfolg', warning:'Warnung', angry:'Blockiert', error:'Systemfehler', surprise:'Überrascht', sleepy:'Müde', sleep:'Schläft', wake:'Wach' },
  },
  fr: {
    webComponent: 'Composant Web', color: 'Couleur', settings: 'Réglages', language: 'Langue',
    colorSettings: 'Réglages des couleurs', otherSettings: 'Autres réglages', languageSettings: 'Langue de la page',
    background: 'Arrière-plan', head: 'Couleur de tête', eyeThrough: 'Yeux transparents', reset: 'Réinitialiser couleurs',
    antenna: 'Antenne', antennaFlash: 'Clignotement antenne', loop: 'Boucle', pointerFollow: 'Suivre le curseur',
    actions: { idle:'Normal', bored:'Ennui', waiting:'Attente', input:'Entrée', send:'Envoyer/Hochement', success:'Succès', warning:'Avertissement', angry:'Bloqué', error:'Erreur système', surprise:'Surprise', sleep:'Dormir', wake:'Réveil' },
    states: { idle:'En veille', bored:'Ennui', waiting:'Attente', input:'Saisie', send:'Envoi', success:'Succès', happy:'Succès', warning:'Avertissement', angry:'Bloqué', error:'Erreur système', surprise:'Surprise', sleepy:'Somnolent', sleep:'Endormi', wake:'Réveillé' },
  },
});

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function mountDemoControls() {
  const stack = document.querySelector('.demo-control-stack');
  if (!stack || stack.dataset.controlsMounted) return;

  const canvas = document.getElementById('canvas');
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
  const themePanelToggle = options.querySelector('#demoThemePanelToggle');
  const settingsPanelToggle = options.querySelector('#demoSettingsPanelToggle');
  const languagePanelToggle = options.querySelector('#demoLanguagePanelToggle');
  const colorPanel = options.querySelector('#demoColorPanel');
  const settingsPanel = options.querySelector('#demoSettingsPanel');
  const languagePanel = options.querySelector('#demoLanguagePanel');
  const bgColor = options.querySelector('#demoBgColor');
  const headColor = options.querySelector('#demoHeadColor');
  const eyeThrough = options.querySelector('#demoEyeThrough');
  const antennaToggle = options.querySelector('#demoAntenna');
  const antennaFlashToggle = options.querySelector('#demoAntennaFlash');
  const loopToggle = options.querySelector('#demoLoop');
  const pointerToggle = options.querySelector('#demoPointerFollow');
  const resetButton = options.querySelector('#demoReset');
  const presets = options.querySelector('#demoColorPresets');
  for (const preset of COLOR_PRESETS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'demo-option demo-theme';
    button.dataset.preset = preset.id;
    button.style.setProperty('--preset-bg', preset.background);
    button.style.setProperty('--preset-head', preset.head);
    button.setAttribute('aria-pressed', 'false');
    const name = document.createElement('span');
    name.className = 'demo-theme-name';
    const swatch = document.createElement('span');
    swatch.className = 'demo-theme-swatch';
    swatch.setAttribute('aria-hidden', 'true');
    button.append(name, swatch);
    button.addEventListener('click', () => {
      const reverse = bgColor.value.toLowerCase() === preset.background
        && headColor.value.toLowerCase() === preset.head;
      bgColor.value = reverse ? preset.head : preset.background;
      headColor.value = reverse ? preset.background : preset.head;
      eyeThrough.checked = true;
      applyBackground();
      applyHeadColor();
      applyEyeColor();
    });
    presets.appendChild(button);
  }

  let currentLanguage = initialLanguage();
  let currentState = 'idle';

  function setPanel(openPanel) {
    const colorOpen = openPanel === 'color';
    const themesOpen = openPanel === 'themes';
    const settingsOpen = openPanel === 'settings';
    const languageOpen = openPanel === 'language';
    colorPanel.hidden = !colorOpen;
    presets.hidden = !themesOpen;
    settingsPanel.hidden = !settingsOpen;
    languagePanel.hidden = !languageOpen;
    colorPanelToggle.classList.toggle('demo-panel-open', colorOpen);
    themePanelToggle.classList.toggle('demo-panel-open', themesOpen);
    settingsPanelToggle.classList.toggle('demo-panel-open', settingsOpen);
    languagePanelToggle.classList.toggle('demo-panel-open', languageOpen);
    colorPanelToggle.setAttribute('aria-expanded', String(colorOpen));
    themePanelToggle.setAttribute('aria-expanded', String(themesOpen));
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

    const themeUI = THEME_UI[currentLanguage] || THEME_UI.en;
    colorPanelToggle.title = themeUI.custom;
    colorPanelToggle.setAttribute('aria-label', themeUI.custom);
    themePanelToggle.title = themeUI.themes;
    themePanelToggle.setAttribute('aria-label', themeUI.themes);
    settingsPanelToggle.title = t.settings;
    settingsPanelToggle.setAttribute('aria-label', t.settings);
    languagePanelToggle.title = t.language;
    languagePanelToggle.setAttribute('aria-label', t.language);
    colorPanel.setAttribute('aria-label', t.colorSettings);
    presets.setAttribute('aria-label', themeUI.themes);
    presets.querySelectorAll('[data-preset]').forEach((button, index) => {
      const preset = COLOR_PRESETS[index];
      const name = currentLanguage.startsWith('zh') ? preset.zh : preset.en;
      const hint = currentLanguage.startsWith('zh') ? '再次点击交换前景与背景' : 'Click again to swap foreground and background';
      button.title = `${name} · ${hint}`;
      button.setAttribute('aria-label', `${name} · ${hint}`);
      button.querySelector('.demo-theme-name').textContent = name;
    });
    settingsPanel.setAttribute('aria-label', t.otherSettings);
    languagePanel.setAttribute('aria-label', t.languageSettings);

    options.querySelector('#demoBgLabel').textContent = t.background;
    options.querySelector('#demoHeadLabel').textContent = t.head;
    options.querySelector('#demoEyeThroughLabel').textContent = t.eyeThrough;
    options.querySelector('#demoAntennaLabel').textContent = t.antenna;
    options.querySelector('#demoAntennaFlashLabel').textContent = t.antennaFlash;
    options.querySelector('#demoLoopLabel').textContent = t.loop;
    options.querySelector('#demoPointerFollowLabel').textContent = t.pointerFollow;
    resetButton.textContent = t.reset;
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
  themePanelToggle.addEventListener('click', () => setPanel(presets.hidden ? 'themes' : null));
  settingsPanelToggle.addEventListener('click', () => setPanel(settingsPanel.hidden ? 'settings' : null));
  languagePanelToggle.addEventListener('click', () => setPanel(languagePanel.hidden ? 'language' : null));
  languagePanel.addEventListener('click', event => {
    const button = event.target.closest('button[data-lang]');
    if (!button) return;
    applyLanguage(button.dataset.lang, { remember: true, updateUrl: true });
  });

  function applyEyeColor() {
    const color = eyeThrough.checked ? bgColor.value : '#ffffff';
    const shadow = face.shadowRoot;
    if (!shadow) return;
    ['leftBase', 'rightBase', 'leftInputBase', 'rightInputBase'].forEach(id => {
      const el = shadow.getElementById(id);
      if (el) el.setAttribute('fill', color);
    });
    syncPresetSelection();
  }

  function syncPresetSelection() {
    presets.querySelectorAll('[data-preset]').forEach((button, index) => {
      const preset = COLOR_PRESETS[index];
      const forward = bgColor.value.toLowerCase() === preset.background
        && headColor.value.toLowerCase() === preset.head;
      const reverse = bgColor.value.toLowerCase() === preset.head
        && headColor.value.toLowerCase() === preset.background;
      button.setAttribute('aria-pressed', String(eyeThrough.checked && (forward || reverse)));
      button.style.setProperty('--preset-bg', reverse ? preset.head : preset.background);
      button.style.setProperty('--preset-head', reverse ? preset.background : preset.head);
    });
  }

  function applyBackground() {
    const color = bgColor.value;
    canvas.style.backgroundColor = color;
    document.documentElement.style.backgroundColor = color;
    document.body.style.backgroundColor = color;
    applyEyeColor();
  }

  function applyHeadColor() {
    const color = headColor.value;
    face.setAttribute('color', color);
    const shadow = face.shadowRoot;
    if (!shadow) return;
    ['head', 'leftTop', 'rightTop', 'leftBottom', 'rightBottom', 'antennaDot'].forEach(id => {
      const el = shadow.getElementById(id);
      if (el) el.setAttribute('fill', color);
    });
    syncPresetSelection();
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

  function applyAntennaFlashSetting() {
    face.setAntennaFlash(antennaFlashToggle.checked);
    if (!antennaFlashToggle.checked) {
      const dot = face.shadowRoot?.getElementById('antennaDot');
      if (dot) dot.style.opacity = '1';
    }
  }

  bgColor.addEventListener('input', applyBackground);
  headColor.addEventListener('input', applyHeadColor);
  eyeThrough.addEventListener('change', applyEyeColor);
  antennaToggle.addEventListener('change', syncAntennaVisibility);
  antennaFlashToggle.addEventListener('change', applyAntennaFlashSetting);

  pointerToggle.addEventListener('change', () => {
    if (oldFollowInput) oldFollowInput.checked = pointerToggle.checked;
    face.setPointerFollow(pointerToggle.checked);
  });
  face.setPointerFollow(pointerToggle.checked);

  face.addEventListener('face-state', event => {
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
      if (['waiting', 'waiting-wrap', 'waiting-wave'].includes(activeAction)) face.stopWaiting();
    }
  });

  const extraLoopDelay = Object.freeze({ idle:900, bored:3350, waiting:0, 'waiting-wrap':0, input:900, sleep:800, wake:500 });

  async function playOneCycle(action, token) {
    if (action === 'waiting' && loopEnabled) {
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
      if (['waiting', 'waiting-wrap', 'waiting-wave'].includes(action) && loopEnabled) return;
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

  resetButton.addEventListener('click', () => {
    bgColor.value = DEFAULTS.background;
    headColor.value = DEFAULTS.head;
    eyeThrough.checked = DEFAULTS.eyeThrough;
    applyBackground();
    applyHeadColor();
    applyEyeColor();
  });

  applyBackground();
  applyHeadColor();
  applyEyeColor();
  syncAntennaVisibility();
  applyAntennaFlashSetting();
  setPanel(null);
  applyLanguage(currentLanguage);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountDemoControls, { once: true });
else mountDemoControls();

export { mountDemoControls };


