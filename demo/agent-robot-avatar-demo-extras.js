const INSPECT_LABELS = Object.freeze({
  'zh-CN': { action: '审视', state: '审视 / 核对' },
  'zh-TW': { action: '審視', state: '審視 / 核對' },
  en: { action: 'Inspect', state: 'Inspect / Verify' },
  ja: { action: '確認', state: '確認 / 検証' },
  ko: { action: '검토', state: '검토 / 확인' },
  es: { action: 'Revisar', state: 'Revisar / Verificar' },
  pt: { action: 'Revisar', state: 'Revisar / Verificar' },
  de: { action: 'Prüfen', state: 'Prüfen / Kontrollieren' },
  fr: { action: 'Vérifier', state: 'Vérifier / Contrôler' },
});

const FAILURE_LABELS = Object.freeze({
  'zh-CN': { action: '失败', state: '失败' },
  'zh-TW': { action: '失敗', state: '失敗' },
  en: { action: 'Failure', state: 'Failure' },
  ja: { action: '失敗', state: '失敗' },
  ko: { action: '실패', state: '실패' },
  es: { action: 'Fallo', state: 'Fallo' },
  pt: { action: 'Falha', state: 'Falha' },
  de: { action: 'Fehlgeschlagen', state: 'Fehlgeschlagen' },
  fr: { action: 'Échec', state: 'Échec' },
});

const LOVE_LABELS = Object.freeze({
  'zh-CN': { action: '喜欢', state: '喜欢 / 爱心' },
  'zh-TW': { action: '喜歡', state: '喜歡 / 愛心' },
  en: { action: 'Love', state: 'Love / Heart' },
  ja: { action: '好き', state: '好き / ハート' },
  ko: { action: '좋아요', state: '좋아요 / 하트' },
  es: { action: 'Amor', state: 'Amor / Corazón' },
  pt: { action: 'Amor', state: 'Amor / Coração' },
  de: { action: 'Liebe', state: 'Liebe / Herz' },
  fr: { action: 'Amour', state: 'Amour / Cœur' },
});

const RANDOM_LABELS = Object.freeze({
  'zh-CN': { action: '随机', state: '随机 / 老虎机' },
  'zh-TW': { action: '隨機', state: '隨機 / 老虎機' },
  en: { action: 'Random', state: 'Random / Slot machine' },
  ja: { action: 'ランダム', state: 'ランダム / スロット' },
  ko: { action: '랜덤', state: '랜덤 / 슬롯머신' },
  es: { action: 'Azar', state: 'Azar / Tragaperras' },
  pt: { action: 'Aleatório', state: 'Aleatório / Caça-níqueis' },
  de: { action: 'Zufall', state: 'Zufall / Spielautomat' },
  fr: { action: 'Aléatoire', state: 'Aléatoire / Machine à sous' },
});

const WRAP_WAITING_LABELS = Object.freeze({
  'zh-CN':'等待 · 环绕', 'zh-TW':'等待 · 環繞', en:'Waiting · Wrap', ja:'待機 · 回り込み',
  ko:'대기 · 감싸기', es:'Espera · Envoltura', pt:'Espera · Contorno', de:'Warten · Umlauf', fr:'Attente · Enveloppement',
});

function activeLanguage(table) {
  const lang = document.documentElement.lang || 'zh-CN';
  if (table[lang]) return lang;
  return lang.startsWith('zh') ? 'zh-CN' : 'en';
}

// Actions added in the latest release are shown last and flagged with a corner badge.
function markAsNew(button) {
  button.classList.add('is-new');
  button.dataset.new = 'NEW';
}

function ensureActionButton(action, afterAction) {
  const controls = document.querySelector('.controls');
  if (!controls) return null;
  let button = controls.querySelector(`[data-action="${action}"]`);
  if (button) return button;
  button = document.createElement('button');
  button.type = 'button';
  button.dataset.action = action;
  const anchor = controls.querySelector(`[data-action="${afterAction}"]`);
  if (anchor) anchor.insertAdjacentElement('afterend', button);
  else controls.appendChild(button);
  return button;
}

function syncActionLabels() {
  const inspect = INSPECT_LABELS[activeLanguage(INSPECT_LABELS)];
  const failure = FAILURE_LABELS[activeLanguage(FAILURE_LABELS)];
  const love = LOVE_LABELS[activeLanguage(LOVE_LABELS)];
  const random = RANDOM_LABELS[activeLanguage(RANDOM_LABELS)];
  const inspectButton = ensureActionButton('inspect', 'warning');
  const failureButton = ensureActionButton('failure', 'success');
  const wrapButton = ensureActionButton('waiting-wrap', 'waiting');
  // New actions go at the very end of the row, in the order they were added.
  const loveButton = ensureActionButton('love', 'wake');
  const randomButton = ensureActionButton('random', 'love');
  for (const button of [loveButton, randomButton]) if (button) markAsNew(button);
  if (inspectButton) inspectButton.textContent = inspect.action;
  if (failureButton) failureButton.textContent = failure.action;
  if (loveButton) loveButton.textContent = love.action;
  if (randomButton) randomButton.textContent = random.action;
  if (wrapButton) wrapButton.textContent = WRAP_WAITING_LABELS[activeLanguage(WRAP_WAITING_LABELS)];
}

function applyDefaultAntennaFlashOff() {
  const toggle = document.getElementById('demoAntennaFlash');
  if (!toggle) return;
  toggle.checked = false;
  const face = document.getElementById('face');
  face?.setAntennaFlash?.(false);
  const dot = face?.shadowRoot?.getElementById('antennaDot');
  if (dot) dot.style.opacity = '1';
}

function mountWaitingSync() {
  const face = document.getElementById('face');
  const chat = document.getElementById('chat');
  if (!face || !chat) return;
  const sync = () => {
    const typing = chat.querySelector('.message.agent.typing');
    if (!typing || typing.dataset.avatarWaitingStarted === '1') return;
    typing.dataset.avatarWaitingStarted = '1';
    if (typeof face.startWaiting === 'function') face.startWaiting();
  };
  new MutationObserver(sync).observe(chat, { childList: true, subtree: true });
  sync();
}

function mountStateLabels() {
  const face = document.getElementById('face');
  const status = document.getElementById('status');
  if (!face || !status) return;
  face.addEventListener('face-state', event => {
    const state = event.detail?.state;
    if (state === 'inspect') {
      const t = INSPECT_LABELS[activeLanguage(INSPECT_LABELS)];
      status.textContent = `inspect · ${t.state}`;
    } else if (state === 'failure') {
      const t = FAILURE_LABELS[activeLanguage(FAILURE_LABELS)];
      status.textContent = `failure · ${t.state}`;
    } else if (state === 'love') {
      const t = LOVE_LABELS[activeLanguage(LOVE_LABELS)];
      status.textContent = `love · ${t.state}`;
    } else if (state === 'random') {
      const t = RANDOM_LABELS[activeLanguage(RANDOM_LABELS)];
      status.textContent = `random · ${t.state}`;
    }
  });
}

function mountExtras() {
  syncActionLabels();
  applyDefaultAntennaFlashOff();
  mountWaitingSync();
  mountStateLabels();

  new MutationObserver(() => {
    syncActionLabels();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountExtras, { once: true });
else mountExtras();

export { mountExtras };
