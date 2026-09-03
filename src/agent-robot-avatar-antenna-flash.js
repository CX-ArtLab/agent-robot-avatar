import AgentRobotAvatar from './agent-robot-avatar-waiting.js?v=R58';

const DEMO_BUILD = '0.1.1-R58';
const proto = AgentRobotAvatar.prototype;
const basePlay = proto.play;
const baseReset = proto.reset;
const baseDraw = proto._draw;

if (typeof window !== 'undefined' && typeof window.AgentRobotAvatarAntennaFlashEnabled === 'undefined') {
  window.AgentRobotAvatarAntennaFlashEnabled = false;
}

const FLASH_DEFAULTS = Object.freeze({
  period: 1000,
  duty: 0.80,
});

const FLASH_MULTIPLIER = Object.freeze({
  input: 1.20,
  send: 1.00,
  success: 1.10,
  warning: 1.00,
  angry: 0.90,
  error: 0.80,
  surprise: 0.80,
});

const flashConfig = (window.AgentRobotAvatarAntennaFlashConfig && typeof window.AgentRobotAvatarAntennaFlashConfig === 'object')
  ? window.AgentRobotAvatarAntennaFlashConfig
  : {};
for (const [key, value] of Object.entries(FLASH_DEFAULTS)) {
  if (!Number.isFinite(Number(flashConfig[key]))) flashConfig[key] = value;
}
window.AgentRobotAvatarAntennaFlashConfig = flashConfig;
window.AgentRobotAvatarAntennaFlashDefaults = FLASH_DEFAULTS;

function configNumber(key, fallback, min, max) {
  const value = Number(flashConfig[key]);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, value));
}

function flashPeriod(action) {
  const base = configNumber('period', FLASH_DEFAULTS.period, 200, 4000);
  return base * (FLASH_MULTIPLIER[action] || 1);
}

function flashDuty() {
  return configNumber('duty', FLASH_DEFAULTS.duty, 0.05, 0.95);
}

function normalizeFlashAction(action) {
  if (action === 'blocked' || action === 'policy-blocked') return 'angry';
  if (action === 'system-error' || action === 'connection-error') return 'error';
  return action;
}

function beginAntennaFlash(instance, action) {
  const normalized = normalizeFlashAction(action);
  if (!FLASH_MULTIPLIER[normalized]) {
    instance._antennaFlashAction = null;
    return null;
  }
  const token = (instance._antennaFlashToken || 0) + 1;
  instance._antennaFlashToken = token;
  instance._antennaFlashAction = normalized;
  instance._antennaFlashStart = performance.now();
  return token;
}

function clearAntennaFlash(instance, token = null) {
  if (token != null && token !== instance._antennaFlashToken) return;
  instance._antennaFlashAction = null;
  const dot = instance._antennaDot;
  if (dot) dot.style.opacity = '1';
}

proto.play = function(name) {
  const action = normalizeFlashAction(String(name || '').trim().toLowerCase());
  const shouldFlash = !!FLASH_MULTIPLIER[action];
  const token = shouldFlash ? beginAntennaFlash(this, action) : null;
  if (!shouldFlash) clearAntennaFlash(this);

  const result = basePlay.call(this, name);

  if (shouldFlash && action !== 'input' && result && typeof result.then === 'function') {
    Promise.resolve(result).finally(() => clearAntennaFlash(this, token));
  }
  return result;
};

proto.reset = function() {
  clearAntennaFlash(this);
  return baseReset.call(this);
};

proto._draw = function(now) {
  baseDraw.call(this, now);

  const dot = this._antennaDot;
  if (!dot) return;

  if (this._antennaFlashAction === 'input' && !this._inputWanted && this._state !== 'input') {
    clearAntennaFlash(this);
  }

  const action = this._antennaFlashAction;
  const enabled = typeof window !== 'undefined' && window.AgentRobotAvatarAntennaFlashEnabled === true;
  if (!enabled || !action || !FLASH_MULTIPLIER[action]) {
    dot.style.opacity = '1';
    return;
  }

  const period = flashPeriod(action);
  const phase = ((now - (this._antennaFlashStart || now)) % period) / period;
  dot.style.opacity = phase < flashDuty() ? '1' : '0';
};

window.AgentRobotAvatarDemoBuild = DEMO_BUILD;
if (typeof document !== 'undefined') {
  const syncBuildBadge = () => {
    window.AgentRobotAvatarDemoBuild = DEMO_BUILD;
    const badge = document.getElementById('agent-demo-build');
    if (badge) badge.textContent = `Demo ${DEMO_BUILD}`;
  };
  syncBuildBadge();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncBuildBadge, { once: true });
  queueMicrotask(syncBuildBadge);
  setTimeout(syncBuildBadge, 0);
}

export { AgentRobotAvatar, DEMO_BUILD, FLASH_DEFAULTS };
export default AgentRobotAvatar;
