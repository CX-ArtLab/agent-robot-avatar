import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Shared by the builder and freshness check so SVGs stay fully embedded offline.
export async function loadPreviewFrames(preview) {
  const models = JSON.parse(await readFile(join(preview, 'frames/models.json'), 'utf8'));
  for (const [id, model] of Object.entries(models)) {
    if (!/^[a-z0-9.-]+$/.test(id)) throw new Error('Invalid frame ID');
    const [x, y, w, h] = model.display;
    if (!(model.width > 0 && model.height > 0 && x >= 0 && y >= 0 && w > 0 && h > 0 &&
      x + w <= model.width && y + h <= model.height)) throw new Error('Invalid opening: ' + id);
    model.svg = await readFile(join(preview, 'frames', id + '.svg'), 'utf8');
    if (!model.svg.includes(`viewBox="0 0 ${model.width} ${model.height}"`) ||
      /<(?:script|image|foreignObject)\b|\bon\w+\s*=|(?:href|src)\s*=/i.test(model.svg))
      throw new Error('Frame must be a self-contained vector with the matching viewBox: ' + id);
  }
  return models;
}
