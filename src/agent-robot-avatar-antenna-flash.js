import AgentRobotAvatar, { registerAvatarExtension } from './agent-robot-avatar-extension-host.js';

const proto = AgentRobotAvatar.prototype;

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

const runtimeWindow = typeof window !== 'undefined' ? window : null;
const flashConfig = (runtimeWindow?.AgentRobotAvatarAntennaFlashConfig && typeof runtimeWindow.AgentRobotAvatarAntennaFlashConfig === 'object')
  ? runtimeWindow.AgentRobotAvatarAntennaFlashConfig
  : {};
for (const [key, value] of Object.entries(FLASH_DEFAULTS)) {
  if (!Number.isFinite(Number(flashConfig[key]))) flashConfig[key] = value;
}
if (runtimeWindow) {
  runtimeWindow.AgentRobotAvatarAntennaFlashConfig = flashConfig;
  runtimeWindow.AgentRobotAvatarAntennaFlashDefaults = FLASH_DEFAULTS;
}

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

proto.setAntennaFlash = function(enabled = true) {
  this._antennaFlashEnabled = enabled !== false;
  if (!this._antennaFlashEnabled) clearAntennaFlash(this);
  return this;
};

function drawAntennaFlash(now) {
  const dot = this._antennaDot;
  if (!dot) return;

  if (this._antennaFlashAction === 'input' && !this._inputWanted && this._state !== 'input') {
    clearAntennaFlash(this);
  }

  const action = this._antennaFlashAction;
  const enabled = this._antennaFlashEnabled === true;
  if (!enabled || !action || !FLASH_MULTIPLIER[action]) {
    dot.style.opacity = '1';
    return;
  }

  const period = flashPeriod(action);
  const phase = ((now - (this._antennaFlashStart || now)) % period) / period;
  dot.style.opacity = phase < flashDuty() ? '1' : '0';
}

registerAvatarExtension({
  name: 'antenna-flash',
  beforePlay(name, context) {
    const action = normalizeFlashAction(name);
    context.antennaFlashAction = action;
    context.antennaFlashToken = FLASH_MULTIPLIER[action]
      ? beginAntennaFlash(this, action)
      : null;
    if (!context.antennaFlashToken) clearAntennaFlash(this);
  },
  afterPlay(_name, result, context) {
    const action = context.antennaFlashAction;
    const token = context.antennaFlashToken;
    if (context.error) {
      clearAntennaFlash(this, token);
      return;
    }
    if (token && action !== 'input' && result && typeof result.then === 'function') {
      Promise.resolve(result).finally(() => clearAntennaFlash(this, token));
    }
  },
  reset() {
    clearAntennaFlash(this);
  },
  draw: drawAntennaFlash,
});

export { AgentRobotAvatar, FLASH_DEFAULTS };
export default AgentRobotAvatar;
