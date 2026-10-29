import { test } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
const SP = '/tmp/claude-1000/-home-ubuntu-APP-GitHub-agent-robot-avatar/974319fa-8810-48e8-85d6-9a7d6710cc6e/scratchpad';
test('px', async ({ page }) => {
  await page.setContent('<p>x</p>');
  for (const f of readdirSync(SP).filter(f => f.startsWith('sw-got-'))) {
    const a = 'data:image/png;base64,' + readFileSync(`${SP}/${f}`).toString('base64');
    const b = 'data:image/png;base64,' + readFileSync(`${SP}/${f.replace('got', 'want')}`).toString('base64');
    const r = await page.evaluate(async ([a, b]) => {
      const load = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = src; });
      const [ia, ib] = await Promise.all([load(a), load(b)]);
      const c = document.createElement('canvas'); c.width = ia.width; c.height = ia.height; const x = c.getContext('2d');
      x.drawImage(ia, 0, 0); const da = x.getImageData(0, 0, c.width, c.height).data;
      x.clearRect(0, 0, c.width, c.height); x.drawImage(ib, 0, 0); const db = x.getImageData(0, 0, c.width, c.height).data;
      let n = 0, max = 0, big = 0, x0 = 999, y0 = 999, x1 = 0, y1 = 0;
      for (let i = 0; i < da.length; i += 4) { const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2])); if (d) n++; if (d > 24) { big++; const p = i / 4, px = p % c.width, py = (p - px) / c.width; x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py); } max = Math.max(max, d); }
      return { n, big, max, box: [x0, y0, x1, y1] };
    }, [a, b]);
    console.log(f, JSON.stringify(r));
  }
});
