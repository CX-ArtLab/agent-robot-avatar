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

const HINTS = Object.freeze({
  'zh-CN': '双击进入对话模拟 · 头像支持拖动',
  'zh-TW': '雙擊進入對話模擬 · 頭像支援拖動',
  en: 'Double-click for demo chat · Avatar is draggable',
  ja: 'ダブルクリックで会話デモ · アバターはドラッグ可能',
  ko: '더블클릭하여 데모 대화 · 아바타 드래그 지원',
  es: 'Doble clic para chat de prueba · Avatar arrastrable',
  pt: 'Clique duas vezes para chat de teste · Avatar arrastável',
  de: 'Doppelklick für Demo-Chat · Avatar verschiebbar',
  fr: 'Double-cliquez pour le chat démo · Avatar déplaçable',
});

function activeLanguage(table) {
  const lang = document.documentElement.lang || 'zh-CN';
  if (table[lang]) return lang;
  return lang.startsWith('zh') ? 'zh-CN' : 'en';
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
  const inspectButton = ensureActionButton('inspect', 'warning');
  const failureButton = ensureActionButton('failure', 'success');
  if (inspectButton) inspectButton.textContent = inspect.action;
  if (failureButton) failureButton.textContent = failure.action;
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

function syncHint() {
  const hint = document.getElementById('demoChatEntryHint');
  if (!hint) return false;
  hint.textContent = HINTS[activeLanguage(HINTS)];
  return true;
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
    }
  });
}

function mountExtras() {
  syncActionLabels();
  applyDefaultAntennaFlashOff();
  mountWaitingSync();
  mountStateLabels();
  syncHint();

  new MutationObserver(() => {
    syncActionLabels();
    syncHint();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  // demoChatEntryHint is created later by the dialog i18n module.
  if (!document.getElementById('demoChatEntryHint') && document.body) {
    const bodyObserver = new MutationObserver(() => {
      if (syncHint()) bodyObserver.disconnect();
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });
  }

}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountExtras, { once: true });
else mountExtras();

export { mountExtras };
