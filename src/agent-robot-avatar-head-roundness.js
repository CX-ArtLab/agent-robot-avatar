import AgentRobotAvatar from './agent-robot-avatar-failure.js?v=0.1.0';

const VERSION = '0.1.0';
const proto = AgentRobotAvatar.prototype;
const HEAD_HEIGHT_SCALE = 0.9;
const DEFAULT_ROUNDNESS = 50;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function smooth01(t) {
  t = clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
}

function flattenPoints(points) {
  if (!points?.length) return [];
  const source = points.map(point => ({ x: point.x, y: point.y }));
  const minY = Math.min(...source.map(point => point.y));
  const maxY = Math.max(...source.map(point => point.y));
  const height = maxY - minY;
  const centerY = (minY + maxY) / 2;
  const inset = height * (1 - HEAD_HEIGHT_SCALE) / 2;
  const upperLockY = minY + height * 0.40;
  const lowerLockY = maxY - height * 0.40;

  return source.map(point => {
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
}

function ensureDefaultGeometry(instance) {
  if (!instance?._headShape || !instance._baseHeadPoints?.length) return false;
  if (instance._headRoundnessDefaultPoints?.length) return true;

  let points = instance._baseHeadPoints.map(point => ({ x: point.x, y: point.y }));

  if (!instance._headFlattenedR32) {
    points = flattenPoints(points);
    instance._headFlattenedR32 = true;
    instance._baseHeadPoints = points.map(point => ({ ...point }));
    instance._baseHeadPathD = instance._pointsToPath(points);
    instance._headShape.setAttribute('d', instance._baseHeadPathD);
  }

  instance._headRoundnessDefaultPoints = instance._baseHeadPoints.map(point => ({ x: point.x, y: point.y }));
  instance._headRoundness = DEFAULT_ROUNDNESS;
  return true;
}

function superellipsePoint(angle, cx, cy, halfW, halfH, exponent) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const xTerm = Math.pow(Math.abs(cos) / Math.max(0.001, halfW), exponent);
  const yTerm = Math.pow(Math.abs(sin) / Math.max(0.001, halfH), exponent);
  const denom = Math.pow(xTerm + yTerm, 1 / exponent);
  const radius = denom > 0 ? 1 / denom : 0;
  return { x: cx + cos * radius, y: cy + sin * radius };
}

function targetShape(points, exponent) {
  const minX = Math.min(...points.map(point => point.x));
  const maxX = Math.max(...points.map(point => point.x));
  const minY = Math.min(...points.map(point => point.y));
  const maxY = Math.max(...points.map(point => point.y));
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const halfW = (maxX - minX) / 2;
  const halfH = (maxY - minY) / 2;

  return points.map(point => {
    const angle = Math.atan2(point.y - cy, point.x - cx);
    return superellipsePoint(angle, cx, cy, halfW, halfH, exponent);
  });
}

function mixPoints(from, to, amount) {
  const t = clamp(amount, 0, 1);
  return from.map((point, index) => ({
    x: point.x + (to[index].x - point.x) * t,
    y: point.y + (to[index].y - point.y) * t,
  }));
}

proto.setHeadRoundness = function(value = DEFAULT_ROUNDNESS) {
  if (!ensureDefaultGeometry(this)) return this;

  const roundness = clamp(Number(value) || 0, 0, 100);
  const baseline = this._headRoundnessDefaultPoints;
  let points = baseline.map(point => ({ ...point }));

  if (roundness < DEFAULT_ROUNDNESS) {
    const squarer = targetShape(baseline, 10);
    points = mixPoints(baseline, squarer, (DEFAULT_ROUNDNESS - roundness) / DEFAULT_ROUNDNESS);
  } else if (roundness > DEFAULT_ROUNDNESS) {
    const rounder = targetShape(baseline, 2.2);
    points = mixPoints(baseline, rounder, (roundness - DEFAULT_ROUNDNESS) / DEFAULT_ROUNDNESS);
  }

  this._headRoundness = roundness;
  this._baseHeadPoints = points;
  this._baseHeadPathD = this._pointsToPath(points);

  if (this._dragJelly?.active || this._dragJelly?.returning) this._applyHeadDeform?.();
  else this._headShape.setAttribute('d', this._baseHeadPathD);

  this.dispatchEvent(new CustomEvent('head-roundness-change', {
    detail: { value: roundness, version: VERSION }
  }));
  return this;
};

proto.getHeadRoundness = function() {
  return Number.isFinite(this._headRoundness) ? this._headRoundness : DEFAULT_ROUNDNESS;
};

if (typeof window !== 'undefined') {
  window.AgentRobotAvatarVersion = VERSION;
  window.AgentRobotAvatarHeadRoundnessDefault = DEFAULT_ROUNDNESS;
}

export { AgentRobotAvatar, DEFAULT_ROUNDNESS, VERSION };
export default AgentRobotAvatar;
