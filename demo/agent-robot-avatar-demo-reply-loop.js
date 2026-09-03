const DEMO_BUILD = '0.1.1-R64';

const face = document.getElementById('face');
const chat = document.getElementById('chat');
const input = document.getElementById('input');
const sendButton = document.getElementById('send');
const overlay = document.getElementById('agentOverlay');

const RESULT_STATES = Object.freeze(['success', 'failure', 'warning', 'angry', 'error', 'surprise', 'inspect']);
const NON_DIALOG_STATES = Object.freeze(['bored', 'sleep', 'sleepy', 'wake', 'waiting']);

const EXTRA_I18N = Object.freeze({
  'zh-CN': {
    failure: { tag: '演示表情 · 失败 / failure', text: '这次没有得到预期结果，任务未能完成。' },
    inspect: { tag: '演示表情 · 审视 / inspect', text: '我重新核对了一遍，这里有一处需要进一步确认。' },
  },
  'zh-TW': {
    failure: { tag: '示範表情 · 失敗 / failure', text: '這次沒有得到預期結果，任務未能完成。' },
    inspect: { tag: '示範表情 · 審視 / inspect', text: '我重新核對了一遍，這裡有一處需要進一步確認。' },
  },
  en: {
    failure: { tag: 'Demo expression · Failure', text: 'The task did not reach the expected result this time.' },
    inspect: { tag: 'Demo expression · Inspect', text: 'I checked it again and found one point that needs closer verification.' },
  },
  ja: {
    failure: { tag: 'デモ表情 · 失敗', text: '今回は期待した結果に到達できず、タスクを完了できませんでした。' },
    inspect: { tag: 'デモ表情 · 確認', text: 'もう一度確認したところ、さらに確かめる必要がある点が見つかりました。' },
  },
  ko: {
    failure: { tag: '데모 표정 · 실패', text: '이번에는 예상한 결과에 도달하지 못해 작업을 완료하지 못했습니다.' },
    inspect: { tag: '데모 표정 · 검토', text: '다시 확인해 보니 추가로 검토해야 할 부분이 하나 있습니다.' },
  },
  es: {
    failure: { tag: 'Expresión demo · Fallo', text: 'Esta vez la tarea no alcanzó el resultado esperado.' },
    inspect: { tag: 'Expresión demo · Revisar', text: 'Lo revisé de nuevo y encontré un punto que necesita más comprobación.' },
  },
  pt: {
    failure: { tag: 'Expressão demo · Falha', text: 'Desta vez a tarefa não alcançou o resultado esperado.' },
    inspect: { tag: 'Expressão demo · Revisar', text: 'Revisei novamente e encontrei um ponto que precisa de mais verificação.' },
  },
  de: {
    failure: { tag: 'Demo-Ausdruck · Fehlgeschlagen', text: 'Diesmal wurde das erwartete Ergebnis nicht erreicht.' },
    inspect: { tag: 'Demo-Ausdruck · Prüfen', text: 'Ich habe es erneut geprüft und einen Punkt gefunden, der genauer kontrolliert werden muss.' },
  },
  fr: {
    failure: { tag: 'Expression démo · Échec', text: 'Cette fois, la tâche n’a pas atteint le résultat attendu.' },
    inspect: { tag: 'Expression démo · Vérifier', text: 'J’ai vérifié à nouveau et trouvé un point qui demande un contrôle supplémentaire.' },
  },
});

let loopState = null;
let loopToken = 0;
let replayTimer = 0;
let remapIndex = 0;
let lastPointer = null;

function activeLanguage() {
  const lang = document.documentElement.lang || 'zh-CN';
  if (EXTRA_I18N[lang]) return lang;
  return lang.startsWith('zh') ? 'zh-CN' : 'en';
}

function injectStyles() {
  if (document.getElementById('agent-demo-reply-loop-style-r64')) return;
  const style = document.createElement('style');
  style.id = 'agent-demo-reply-loop-style-r64';
  style.textContent = `
    .expression-tag.failure{background:#f7ecec;border-color:#ead8d8;color:#9b7474}
    .expression-tag.inspect{background:#eef0f7;border-color:#dde1ee;color:#737e9b}
  `;
  document.head.appendChild(style);
}

function stateFromTag(tag) {
  if (!tag) return null;
  return [...RESULT_STATES, ...NON_DIALOG_STATES].find(state => tag.classList.contains(state)) || null;
}

function replacementState() {
  const state = remapIndex % 2 === 0 ? 'failure' : 'inspect';
  remapIndex += 1;
  return state;
}

function localizeReplacement(row, state) {
  const t = EXTRA_I18N[activeLanguage()]?.[state] || EXTRA_I18N.en[state];
  if (!t) return;
  const text = row.querySelector('.reply-text');
  const tag = row.querySelector('.expression-tag');
  if (text) text.textContent = t.text;
  if (tag) textContent(tag, t.tag);
}

function textContent(el, value) {
  if (el && el.textContent !== value) el.textContent = value;
}

function stopReplyLoop(resetFace = false) {
  loopState = null;
  loopToken += 1;
  clearTimeout(replayTimer);
  replayTimer = 0;
  lastPointer = null;
  if (resetFace && face?.reset) face.reset();
}

function scheduleReplay(token) {
  clearTimeout(replayTimer);
  replayTimer = setTimeout(() => {
    if (!face || !loopState || token !== loopToken) return;
    if (chat?.querySelector('.message.agent.typing')) return;
    face.play(loopState);
  }, 90);
}

function startReplyLoop(state, forceStart = false) {
  if (!face || !RESULT_STATES.includes(state)) return;
  loopState = state;
  loopToken += 1;
  const token = loopToken;
  clearTimeout(replayTimer);
  lastPointer = null;
  if (forceStart) face.play(state);
  else if (face._state === 'idle') scheduleReplay(token);
}

function normalizeReplyRow(row) {
  if (!(row instanceof HTMLElement) || row.dataset.replyLoopProcessed === '1') return;
  const tag = row.querySelector('.expression-tag');
  if (!tag) return;

  let state = stateFromTag(tag);
  if (!state) return;
  row.dataset.replyLoopProcessed = '1';

  if (NON_DIALOG_STATES.includes(state)) {
    state = replacementState();
    tag.className = `expression-tag ${state}`;
    row.dataset.dialogVariant = '0';
    localizeReplacement(row, state);
    startReplyLoop(state, true);
    return;
  }

  startReplyLoop(state, false);
}

function scanReplies() {
  if (!chat) return;
  chat.querySelectorAll('.message.agent:not(.typing)').forEach(normalizeReplyRow);
  if (chat.querySelector('.message.agent.typing')) stopReplyLoop(false);
}

function pointerInsideInfluence(event) {
  if (!face) return false;
  const rect = face.getBoundingClientRect();
  if (!rect.width || !rect.height) return false;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const near = Math.max(rect.width, rect.height) * 2.55;
  return Math.hypot(event.clientX - cx, event.clientY - cy) <= near;
}

function onPointerMove(event) {
  if (!loopState) {
    lastPointer = { x: event.clientX, y: event.clientY };
    return;
  }
  if (!lastPointer) {
    lastPointer = { x: event.clientX, y: event.clientY };
    return;
  }
  const moved = Math.hypot(event.clientX - lastPointer.x, event.clientY - lastPointer.y);
  lastPointer = { x: event.clientX, y: event.clientY };
  if (moved >= 8 && pointerInsideInfluence(event)) stopReplyLoop(true);
}

injectStyles();
scanReplies();

if (chat) {
  const observer = new MutationObserver(scanReplies);
  observer.observe(chat, { childList: true, subtree: true });
}

if (face) {
  face.addEventListener('face-state', event => {
    const state = event.detail?.state;
    if (state === 'input' || state === 'waiting') {
      stopReplyLoop(false);
      return;
    }
    if (state === 'idle' && loopState) scheduleReplay(loopToken);
  });
}

if (input) {
  input.addEventListener('input', () => {
    if (input.value.length) stopReplyLoop(false);
  }, true);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) stopReplyLoop(true);
  }, true);
}

if (sendButton) sendButton.addEventListener('click', () => stopReplyLoop(true), true);
window.addEventListener('pointermove', onPointerMove, { passive: true });

if (overlay) {
  const observer = new MutationObserver(() => {
    if (!overlay.classList.contains('open')) stopReplyLoop(false);
  });
  observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
}

const langObserver = new MutationObserver(() => {
  if (!chat) return;
  chat.querySelectorAll('.message.agent[data-reply-loop-processed="1"]').forEach(row => {
    const state = stateFromTag(row.querySelector('.expression-tag'));
    if (state === 'failure' || state === 'inspect') localizeReplacement(row, state);
  });
});
langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

window.AgentRobotAvatarDemoReplyLoop = {
  get state() { return loopState; },
  stop: () => stopReplyLoop(true),
};
window.AgentRobotAvatarDemoBuild = DEMO_BUILD;

export { startReplyLoop, stopReplyLoop };
