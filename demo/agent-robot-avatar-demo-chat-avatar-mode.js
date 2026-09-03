const LABELS = Object.freeze({
  'zh-CN': { top: '顶部', chat: '对话', title: '头像位置' },
  'zh-TW': { top: '頂部', chat: '對話', title: '頭像位置' },
  en: { top: 'Top', chat: 'Chat', title: 'Avatar position' },
  ja: { top: '上部', chat: '会話', title: 'アバター位置' },
  ko: { top: '상단', chat: '대화', title: '아바타 위치' },
  es: { top: 'Arriba', chat: 'Chat', title: 'Posición del avatar' },
  pt: { top: 'Topo', chat: 'Chat', title: 'Posição do avatar' },
  de: { top: 'Oben', chat: 'Chat', title: 'Avatar-Position' },
  fr: { top: 'Haut', chat: 'Chat', title: "Position de l’avatar" },
});

const face = document.getElementById('face');
const chat = document.getElementById('chat');
const headerSlot = document.getElementById('slot');
const overlay = document.getElementById('agentOverlay');
const phone = document.querySelector('.agent-phone');
const panelHead = document.querySelector('.panel-head');

let mode = 'inline';
let syncing = false;
let openTimer = 0;

try {
  const saved = sessionStorage.getItem('agentRobotAvatarDemoAvatarMode');
  if (saved === 'top' || saved === 'inline') mode = saved;
} catch (_) {}

function activeLanguage() {
  const lang = document.documentElement.lang || 'en';
  return LABELS[lang] ? lang : 'en';
}

function injectStyles() {
  if (document.getElementById('agent-demo-chat-avatar-mode-r63')) return;
  const style = document.createElement('style');
  style.id = 'agent-demo-chat-avatar-mode-r63';
  style.textContent = `
    .panel-head.agent-avatar-mode-ready{padding-right:174px}
    .agent-avatar-mode-switch{
      position:absolute;right:62px;top:33px;display:flex;align-items:center;gap:2px;
      padding:3px;border:1px solid #e2e4e7;border-radius:10px;background:#f3f4f5;
      box-shadow:0 2px 8px rgba(0,0,0,.025);z-index:3
    }
    .agent-avatar-mode-switch button{
      min-width:38px;height:28px;padding:0 8px;border:0;border-radius:7px;background:transparent;
      color:#8b9097;font-size:10px;font-weight:650;line-height:28px;cursor:pointer;box-shadow:none
    }
    .agent-avatar-mode-switch button:hover{background:rgba(255,255,255,.72)}
    .agent-avatar-mode-switch button:active{transform:none}
    .agent-avatar-mode-switch button.active{background:#fff;color:#4f545a;box-shadow:0 1px 4px rgba(0,0,0,.08)}
    .agent-phone.avatar-mode-inline .panel-face-slot{display:none}
    .agent-phone.avatar-mode-inline .panel-head{gap:0}
    .message.agent.avatar-live-row{align-items:flex-start;gap:10px}
    .inline-avatar-slot{
      width:48px;height:48px;flex:0 0 48px;display:grid;place-items:center;margin-top:1px;
      overflow:visible
    }
    .inline-avatar-slot agent-robot-avatar{display:block;filter:drop-shadow(0 7px 14px rgba(0,0,0,.07))}
    @media(max-width:460px){
      .panel-head.agent-avatar-mode-ready{padding-right:148px}
      .agent-avatar-mode-switch{right:58px}
      .agent-avatar-mode-switch button{min-width:32px;padding:0 6px;font-size:9px}
      .inline-avatar-slot{width:44px;height:44px;flex-basis:44px}
      .message.agent.avatar-live-row{gap:8px}
    }
  `;
  document.head.appendChild(style);
}

function buildSwitch() {
  if (!panelHead) return null;
  let control = panelHead.querySelector('.agent-avatar-mode-switch');
  if (control) return control;

  control = document.createElement('div');
  control.className = 'agent-avatar-mode-switch';
  control.innerHTML = `
    <button type="button" data-avatar-mode="top" aria-pressed="false"></button>
    <button type="button" data-avatar-mode="inline" aria-pressed="false"></button>
  `;
  control.addEventListener('click', event => {
    const button = event.target.closest('button[data-avatar-mode]');
    if (!button) return;
    setMode(button.dataset.avatarMode);
  });
  panelHead.appendChild(control);
  panelHead.classList.add('agent-avatar-mode-ready');
  return control;
}

function updateSwitchLanguage() {
  const control = buildSwitch();
  if (!control) return;
  const t = LABELS[activeLanguage()];
  control.title = t.title;
  const top = control.querySelector('[data-avatar-mode="top"]');
  const inline = control.querySelector('[data-avatar-mode="inline"]');
  if (top) top.textContent = t.top;
  if (inline) inline.textContent = t.chat;
}

function cleanupInlineSlots(keep = null) {
  if (!chat) return;
  chat.querySelectorAll('.inline-avatar-slot').forEach(slot => {
    if (slot === keep) return;
    const row = slot.closest('.message.agent');
    if (face && slot.contains(face)) return;
    slot.remove();
    row?.classList.remove('avatar-live-row');
  });
  chat.querySelectorAll('.message.agent.avatar-live-row').forEach(row => {
    if (!row.querySelector('.inline-avatar-slot')) row.classList.remove('avatar-live-row');
  });
}

function latestAgentRow() {
  if (!chat) return null;
  const typing = chat.querySelector('.message.agent.typing');
  if (typing) return typing;
  const rows = chat.querySelectorAll('.message.agent');
  return rows.length ? rows[rows.length - 1] : null;
}

function inlineSlotFor(row) {
  if (!row) return null;
  let slot = row.querySelector(':scope > .inline-avatar-slot');
  if (!slot) {
    slot = document.createElement('span');
    slot.className = 'inline-avatar-slot';
    slot.setAttribute('aria-hidden', 'true');
    row.insertBefore(slot, row.firstChild);
  }
  row.classList.add('avatar-live-row');
  cleanupInlineSlots(slot);
  return slot;
}

function moveFace(destination, size, animate = true) {
  if (!face || !destination) return;
  if (face.parentElement === destination) {
    face.setAttribute('size', String(size));
    return;
  }

  const first = face.getBoundingClientRect();
  destination.appendChild(face);
  face.setAttribute('size', String(size));
  if (!animate || !first.width || !first.height || !face.animate) return;

  const last = face.getBoundingClientRect();
  const dx = first.left - last.left;
  const dy = first.top - last.top;
  const sx = first.width / Math.max(1, last.width);
  const sy = first.height / Math.max(1, last.height);
  face.animate([
    { transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})` },
    { transform: 'translate(0,0) scale(1)' },
  ], {
    duration: 280,
    easing: 'cubic-bezier(.16,1,.3,1)',
  });
}

function overlayOpen() {
  return !!overlay?.classList.contains('open');
}

function syncPlacement(animate = true) {
  if (syncing || !face || !phone) return;
  syncing = true;
  try {
    phone.classList.toggle('avatar-mode-inline', mode === 'inline');
    const control = buildSwitch();
    control?.querySelectorAll('button[data-avatar-mode]').forEach(button => {
      const active = button.dataset.avatarMode === mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (!overlayOpen()) {
      cleanupInlineSlots();
      return;
    }

    if (mode === 'inline') {
      const row = latestAgentRow();
      const slot = inlineSlotFor(row);
      if (slot) moveFace(slot, 48, animate);
    } else {
      cleanupInlineSlots();
      if (headerSlot) moveFace(headerSlot, 56, animate);
    }
  } finally {
    syncing = false;
  }
}

function setMode(next) {
  if (next !== 'top' && next !== 'inline') return;
  mode = next;
  try { sessionStorage.setItem('agentRobotAvatarDemoAvatarMode', mode); } catch (_) {}
  syncPlacement(true);
}

injectStyles();
buildSwitch();
updateSwitchLanguage();
syncPlacement(false);

if (chat) {
  const chatObserver = new MutationObserver(() => {
    if (mode !== 'inline' || !overlayOpen()) return;
    queueMicrotask(() => syncPlacement(true));
  });
  chatObserver.observe(chat, { childList: true, subtree: true });
}

if (overlay) {
  const overlayObserver = new MutationObserver(() => {
    clearTimeout(openTimer);
    if (overlayOpen()) {
      // Let the existing 520 ms FLIP animation finish moving the avatar into the dialog first.
      openTimer = setTimeout(() => syncPlacement(true), 580);
    } else {
      cleanupInlineSlots();
    }
  });
  overlayObserver.observe(overlay, { attributes: true, attributeFilter: ['class'] });
}

if (headerSlot) {
  const slotObserver = new MutationObserver(() => {
    if (mode === 'inline' && overlayOpen() && headerSlot.contains(face)) {
      clearTimeout(openTimer);
      openTimer = setTimeout(() => syncPlacement(true), 580);
    }
  });
  slotObserver.observe(headerSlot, { childList: true });
}

const langObserver = new MutationObserver(updateSwitchLanguage);
langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

window.AgentRobotAvatarDemoAvatarMode = {
  get mode() { return mode; },
  setMode,
};
export { setMode };
