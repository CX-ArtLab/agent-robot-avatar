const STYLE_ID = 'agent-demo-controls-style-r51';
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

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .demo-control-stack{position:absolute;left:50%;top:calc(39% + 128px);transform:translateX(-50%);width:min(900px,calc(100% - 56px));z-index:20;display:grid;gap:8px}
    .demo-control-stack>.controls{position:static;left:auto;top:auto;transform:none;max-width:none;width:100%;margin:0;overflow:visible;display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
    .demo-control-stack>.controls button{width:auto!important;min-width:0;flex:0 0 auto!important}
    .demo-options{display:grid;gap:7px;width:max-content;max-width:100%;justify-items:center;padding:0;border:0;background:transparent;box-shadow:none;color:#72777e;font-size:11px}
    .demo-panel-toolbar{display:flex;align-items:center;justify-content:center;gap:6px;padding:5px;border:1px solid rgba(0,0,0,.055);border-radius:12px;background:rgba(255,255,255,.82);box-shadow:0 6px 22px rgba(0,0,0,.055);backdrop-filter:blur(14px)}
    .demo-panel-toggle{width:34px!important;height:34px!important;padding:0!important;border:0!important;border-radius:9px!important;background:#f4f5f6!important;color:#72777e!important;display:grid!important;place-items:center!important;cursor:pointer!important}
    .demo-panel-toggle:hover{background:#e9eaec!important}
    .demo-panel-toggle.demo-panel-open{background:#dfe1e4!important;color:#25282c!important}
    .demo-panel-toggle svg{width:18px;height:18px;display:block;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
    .demo-options-group{display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap;width:max-content;max-width:100%;padding:7px 9px;border:1px solid rgba(0,0,0,.055);border-radius:14px;background:rgba(255,255,255,.82);box-shadow:0 6px 22px rgba(0,0,0,.055);backdrop-filter:blur(14px)}
    .demo-options-group[hidden]{display:none!important}
    .demo-option{min-height:30px;display:inline-flex;align-items:center;gap:7px;padding:4px 8px;border-radius:9px;background:#f4f5f6;white-space:nowrap;user-select:none;width:auto!important;flex:0 0 auto!important}
    .demo-option.color-option{padding-right:5px}
    .demo-option input[type=color]{width:24px;height:22px;padding:0;border:0;border-radius:6px;background:transparent;cursor:pointer}
    .demo-option input[type=color]::-webkit-color-swatch-wrapper{padding:1px}
    .demo-option input[type=color]::-webkit-color-swatch{border:1px solid rgba(0,0,0,.12);border-radius:5px}
    .demo-toggle input{position:absolute;opacity:0;pointer-events:none}
    .demo-switch{position:relative;width:30px;height:18px;border-radius:999px;background:#d4d6d9;transition:background .18s ease;cursor:pointer;flex:0 0 auto}
    .demo-switch::after{content:'';position:absolute;left:2px;top:2px;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.18);transition:transform .18s ease}
    .demo-toggle input:checked+.demo-switch{background:#666b72}
    .demo-toggle input:checked+.demo-switch::after{transform:translateX(12px)}
    .demo-toggle input:focus-visible+.demo-switch{outline:2px solid #aeb2b8;outline-offset:2px}
    .demo-reset{border:0!important;color:#656a70!important;font:600 11px/1 Inter,"PingFang SC","Microsoft YaHei",system-ui,sans-serif!important;cursor:pointer!important;padding:7px 10px!important}
    .demo-reset:hover{background:#e9eaec!important}
    .demo-language-option{border:0!important;background:#f4f5f6!important;color:#5f646a!important;border-radius:9px!important;padding:7px 9px!important;font-size:10px!important;cursor:pointer!important}
    .demo-language-option:hover{background:#e9eaec!important}
    .demo-language-option.demo-language-active{background:#dfe1e4!important;color:#202327!important;font-weight:700!important}
    .demo-control-stack .controls button.demo-active{background:#dfe1e4;color:#202327}
    .title.demo-title span{display:inline}
    .title.demo-title span:not(:last-child)::after{content:' / '}
    .follow-control.demo-original-follow{display:none!important}
    .support-link{display:none!important}
    .status-pill.demo-status{left:50%;top:calc(39% + 82px);bottom:auto;transform:translateX(-50%);z-index:15;pointer-events:none;white-space:nowrap}
    @media(max-width:600px){
      html,body{min-height:100%!important}.canvas{min-height:max(100vh,790px)!important}
      .title.demo-title{left:18px;top:14px;line-height:1.48;max-width:calc(100% - 90px)}
      .title.demo-title span{display:block}.title.demo-title span:not(:last-child)::after{content:''}
      .avatar-home{top:27%!important}.status-pill.demo-status{left:50%!important;top:calc(27% + 80px)!important;bottom:auto!important}
      .demo-control-stack{top:calc(27% + 128px);width:calc(100% - 20px);gap:7px}
      .demo-options-group{gap:5px;padding:7px 6px}.demo-option{padding:4px 7px;gap:6px}
    }
    @media(max-width:390px){
      .canvas{min-height:max(100vh,820px)!important}.avatar-home{top:26%!important}.status-pill.demo-status{top:calc(26% + 80px)!important}.demo-control-stack{top:calc(26% + 128px)}
      .demo-options-group{gap:5px}.demo-option,.demo-reset{font-size:10px!important;padding:4px 5px!important;gap:4px!important}
    }
  `;
  document.head.appendChild(style);
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function mountDemoControls() {
  if (document.querySelector('.demo-control-stack')) return;

  const canvas = document.getElementById('canvas');
  const face = document.getElementById('face');
  const controls = document.querySelector('.controls');
  if (!canvas || !face || !controls) return;

  injectStyles();
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

  const stack = document.createElement('div');
  stack.className = 'demo-control-stack';
  controls.parentNode.insertBefore(stack, controls);
  stack.appendChild(controls);

  const options = document.createElement('div');
  options.className = 'demo-options';
  options.innerHTML = `
    <div class="demo-panel-toolbar" id="demoPanelToolbar">
      <button class="demo-panel-toggle" id="demoColorPanelToggle" type="button" aria-expanded="false" aria-controls="demoColorPanel">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18h1.2a1.8 1.8 0 0 0 0-3.6h-1.4a1.7 1.7 0 0 1 0-3.4H15a6 6 0 0 0 0-12h-3Z"/><circle cx="7.5" cy="10" r=".7"/><circle cx="9" cy="6.8" r=".7"/><circle cx="13" cy="6.2" r=".7"/></svg>
      </button>
      <button class="demo-panel-toggle" id="demoSettingsPanelToggle" type="button" aria-expanded="false" aria-controls="demoSettingsPanel">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h10M18 6h2M4 12h3M11 12h9M4 18h8M16 18h4"/><circle cx="16" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="14" cy="18" r="2"/></svg>
      </button>
      <button class="demo-panel-toggle" id="demoLanguagePanelToggle" type="button" aria-expanded="false" aria-controls="demoLanguagePanel">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.3 2.4 3.5 5.4 3.5 9S14.3 18.6 12 21M12 3C9.7 5.4 8.5 8.4 8.5 12S9.7 18.6 12 21"/></svg>
      </button>
    </div>
    <div class="demo-options-group demo-color-group" id="demoColorPanel" hidden>
      <label class="demo-option color-option"><span id="demoBgLabel"></span><input id="demoBgColor" type="color" value="${DEFAULTS.background}"></label>
      <label class="demo-option color-option"><span id="demoHeadLabel"></span><input id="demoHeadColor" type="color" value="${DEFAULTS.head}"></label>
      <label class="demo-option demo-toggle"><span id="demoEyeThroughLabel"></span><input id="demoEyeThrough" type="checkbox" checked><span class="demo-switch" aria-hidden="true"></span></label>
      <button class="demo-option demo-reset" id="demoReset" type="button"></button>
    </div>
    <div class="demo-options-group demo-behavior-group" id="demoSettingsPanel" hidden>
      <label class="demo-option demo-toggle"><span id="demoAntennaLabel"></span><input id="demoAntenna" type="checkbox" checked><span class="demo-switch" aria-hidden="true"></span></label>
      <label class="demo-option demo-toggle"><span id="demoAntennaFlashLabel"></span><input id="demoAntennaFlash" type="checkbox" checked><span class="demo-switch" aria-hidden="true"></span></label>
      <label class="demo-option demo-toggle"><span id="demoLoopLabel"></span><input id="demoLoop" type="checkbox"><span class="demo-switch" aria-hidden="true"></span></label>
      <label class="demo-option demo-toggle"><span id="demoPointerFollowLabel"></span><input id="demoPointerFollow" type="checkbox" checked><span class="demo-switch" aria-hidden="true"></span></label>
    </div>
    <div class="demo-options-group demo-language-group" id="demoLanguagePanel" hidden>
      ${LANGUAGES.map(([code, name]) => `<button class="demo-language-option" type="button" data-lang="${code}">${name}</button>`).join('')}
    </div>
  `;
  stack.appendChild(options);

  const colorPanelToggle = options.querySelector('#demoColorPanelToggle');
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

  let currentLanguage = I18N[document.documentElement.lang] ? document.documentElement.lang : 'zh-CN';
  let currentState = 'idle';

  function setPanel(openPanel) {
    const colorOpen = openPanel === 'color';
    const settingsOpen = openPanel === 'settings';
    const languageOpen = openPanel === 'language';
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

  function applyLanguage(language = currentLanguage) {
    currentLanguage = I18N[language] ? language : 'en';
    const t = I18N[currentLanguage];
    document.documentElement.lang = currentLanguage;

    if (title) title.innerHTML = `<span>Agent Robot Avatar</span><span>SVG + Vanilla JS</span><span>${t.webComponent}</span>`;

    colorPanelToggle.title = t.color;
    colorPanelToggle.setAttribute('aria-label', t.color);
    settingsPanelToggle.title = t.settings;
    settingsPanelToggle.setAttribute('aria-label', t.settings);
    languagePanelToggle.title = t.language;
    languagePanelToggle.setAttribute('aria-label', t.language);
    colorPanel.setAttribute('aria-label', t.colorSettings);
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
  settingsPanelToggle.addEventListener('click', () => setPanel(settingsPanel.hidden ? 'settings' : null));
  languagePanelToggle.addEventListener('click', () => setPanel(languagePanel.hidden ? 'language' : null));
  languagePanel.addEventListener('click', event => {
    const button = event.target.closest('button[data-lang]');
    if (!button) return;
    applyLanguage(button.dataset.lang);
  });

  function applyEyeColor() {
    const color = eyeThrough.checked ? bgColor.value : '#ffffff';
    const shadow = face.shadowRoot;
    if (!shadow) return;
    ['leftBase', 'rightBase', 'leftInputBase', 'rightInputBase'].forEach(id => {
      const el = shadow.getElementById(id);
      if (el) el.setAttribute('fill', color);
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
    window.AgentRobotAvatarAntennaFlashEnabled = antennaFlashToggle.checked;
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
  window.AgentRobotAvatarDemoLoopEnabled = loopEnabled;

  loopToggle.addEventListener('change', () => {
    loopEnabled = loopToggle.checked;
    window.AgentRobotAvatarDemoLoopEnabled = loopEnabled;
    if (!loopEnabled) loopToken += 1;
  });

  const extraLoopDelay = Object.freeze({ idle:900, bored:3350, waiting:0, input:900, sleep:800, wake:500 });

  async function playOneCycle(action, token) {
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
