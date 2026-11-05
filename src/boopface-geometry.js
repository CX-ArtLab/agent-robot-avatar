const DEFAULT_HEAD_HEIGHT_SCALE = 0.9;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const smooth01 = value => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

function flattenHeadPoints(points, heightScale = DEFAULT_HEAD_HEIGHT_SCALE) {
  if (!points?.length) return [];
  const source = points.map(point => ({ x: point.x, y: point.y }));
  const minY = Math.min(...source.map(point => point.y));
  const maxY = Math.max(...source.map(point => point.y));
  const height = maxY - minY;
  if (!(height > 0)) return source;

  const scale = clamp(Number(heightScale), 0.1, 1);
  const centerY = (minY + maxY) / 2;
  const inset = height * (1 - scale) / 2;
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

export { DEFAULT_HEAD_HEIGHT_SCALE, flattenHeadPoints };
