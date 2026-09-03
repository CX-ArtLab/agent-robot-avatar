import AgentRobotAvatar, { registerAvatarExtension } from './agent-robot-avatar-extension-host.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const HEAD_HEIGHT_SCALE = 0.9;
const ANTENNA_DEFAULTS = Object.freeze({
  x: 120,
  y: 12,
  radius: 15,
  stiffness: 180,
  damping: 5.6,
});

const runtimeWindow = typeof window !== 'undefined' ? window : null;
const antennaConfig = (runtimeWindow?.AgentRobotAvatarAntennaConfig && typeof runtimeWindow.AgentRobotAvatarAntennaConfig === 'object')
  ? runtimeWindow.AgentRobotAvatarAntennaConfig
  : {};
for (const [key, value] of Object.entries(ANTENNA_DEFAULTS)) {
  if (!Number.isFinite(Number(antennaConfig[key]))) antennaConfig[key] = value;
}
if (runtimeWindow) {
  runtimeWindow.AgentRobotAvatarAntennaConfig = antennaConfig;
  runtimeWindow.AgentRobotAvatarAntennaDefaults = ANTENNA_DEFAULTS;
}

function configNumber(key, fallback, min, max) {
  const value = Number(antennaConfig[key]);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, value));
}

function antennaHome() {
  return {
    x: configNumber('x', ANTENNA_DEFAULTS.x, 60, 180),
    y: configNumber('y', ANTENNA_DEFAULTS.y, -40, 60),
  };
}

function smooth01(t) {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
}

function flattenHead(instance) {
  if (instance._headFlattenedR32 || !instance._headShape || !instance._baseHeadPoints?.length) return;

  const source = instance._baseHeadPoints.map(point => ({ x: point.x, y: point.y }));
  const minY = Math.min(...source.map(point => point.y));
  const maxY = Math.max(...source.map(point => point.y));
  const height = maxY - minY;
  const centerY = (minY + maxY) / 2;
  const inset = height * (1 - HEAD_HEIGHT_SCALE) / 2;

  const upperLockY = minY + height * 0.40;
  const lowerLockY = maxY - height * 0.40;

  const flattened = source.map(point => {
    let shiftY = 0;
    if (point.y <= upperLockY) {
      shiftY = inset;
    } else if (point.y < centerY) {
      const t = (centerY - point.y) / Math.max(0.001, centerY - upperLockY);
      shiftY = inset * smooth01(t);
    } else if (point.y >= lowerLockY) {
      shiftY = -inset;
    } else if (point.y > centerY) {
      const t = (point.y - centerY) / Math.max(0.001, lowerLockY - centerY);
      shiftY = -inset * smooth01(t);
    }
    return { x: point.x, y: point.y + shiftY };
  });

  const path = typeof instance._pointsToPath === 'function'
    ? instance._pointsToPath(flattened)
    : `M ${flattened.map((point, index) => `${index ? 'L ' : ''}${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ')} Z`;

  instance._baseHeadPoints = flattened;
  instance._baseHeadPathD = path;
  instance._headShape.setAttribute('d', path);
  instance._headFlattenedR32 = true;
}

function ensureAntenna(instance, now) {
  flattenHead(instance);
  if (instance._antennaDot?.isConnected && instance._antennaSpring) return true;

  const svg = instance.shadowRoot?.querySelector('svg');
  if (!svg || !instance._headMotion) return false;

  const home = antennaHome();
  let dot = instance.shadowRoot.getElementById('antennaDot');
  if (!dot) {
    dot = document.createElementNS(SVG_NS, 'circle');
    dot.id = 'antennaDot';
    dot.setAttribute('cx', String(home.x));
    dot.setAttribute('cy', String(home.y));
    dot.setAttribute('r', String(configNumber('radius', ANTENNA_DEFAULTS.radius, 2, 40)));
    dot.setAttribute('fill', instance._head?.getAttribute('fill') || '#08090b');
    dot.setAttribute('aria-hidden', 'true');
    dot.style.pointerEvents = 'none';
    svg.appendChild(dot);
  }

  instance._antennaDot = dot;
  instance._antennaSpring = {
    x: home.x,
    y: home.y,
    vx: 0,
    vy: 0,
    last: now,
    initialized: false,
  };
  return true;
}

function antennaTarget(instance) {
  const svg = instance.shadowRoot?.querySelector('svg');
  const headMatrix = instance._headMotion?.getScreenCTM?.();
  const svgMatrix = svg?.getScreenCTM?.();
  const home = antennaHome();
  if (!svg || !headMatrix || !svgMatrix || typeof DOMPoint === 'undefined') return home;

  try {
    const screenPoint = new DOMPoint(home.x, home.y).matrixTransform(headMatrix);
    const localPoint = screenPoint.matrixTransform(svgMatrix.inverse());
    return { x: localPoint.x, y: localPoint.y };
  } catch (_) {
    return home;
  }
}

function updateAntenna(instance, now) {
  if (!ensureAntenna(instance, now)) return;

  const spring = instance._antennaSpring;
  const dot = instance._antennaDot;
  const target = antennaTarget(instance);

  if (!spring.initialized) {
    spring.x = target.x;
    spring.y = target.y;
    spring.last = now;
    spring.initialized = true;
  }

  const dt = Math.max(0.001, Math.min(0.05, (now - spring.last) / 1000 || 0.033));
  spring.last = now;

  const stiffness = configNumber('stiffness', ANTENNA_DEFAULTS.stiffness, 5, 300);
  const damping = configNumber('damping', ANTENNA_DEFAULTS.damping, 0.5, 40);
  const ax = (target.x - spring.x) * stiffness - spring.vx * damping;
  const ay = (target.y - spring.y) * stiffness - spring.vy * damping;
  spring.vx += ax * dt;
  spring.vy += ay * dt;
  spring.x += spring.vx * dt;
  spring.y += spring.vy * dt;

  dot.setAttribute('cx', spring.x.toFixed(2));
  dot.setAttribute('cy', spring.y.toFixed(2));
  dot.setAttribute('r', configNumber('radius', ANTENNA_DEFAULTS.radius, 2, 40).toFixed(2));
  dot.setAttribute('fill', instance._head?.getAttribute('fill') || '#08090b');
}

function drawAntenna(now) {
  updateAntenna(this, now);
}

registerAvatarExtension({
  name: 'antenna',
  draw: drawAntenna,
});

export { AgentRobotAvatar, ANTENNA_DEFAULTS };
export default AgentRobotAvatar;
