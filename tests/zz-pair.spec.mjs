import { test } from '@playwright/test';
import { readFileSync } from 'node:fs';
const SP = '/tmp/claude-1000/-home-ubuntu-APP-GitHub-agent-robot-avatar/974319fa-8810-48e8-85d6-9a7d6710cc6e/scratchpad';
const keys = JSON.parse(readFileSync(`${SP}/gpt-keys.json`, 'utf8'));
const PAIRS = (process.env.PAIRS || '25>188,13>188,1>188,187>188,25>13,25>150').split(',').map(p => p.split('>'));
test('pairs', async ({ page }) => {
  test.setTimeout(600000);
  await page.setViewportSize({ width: 400, height: 400 });
  await page.goto('http://127.0.0.1:4181/examples/basic.html');
  await page.evaluate(async () => { document.body.innerHTML = '<div id="box" style="width:200px;height:200px;display:grid;place-items:center;background:#fff"></div>'; await import('/agent-robot-avatar.js'); });
  const out = [];
  for (const [a, b] of PAIRS) {
    await page.evaluate(async ([a, b]) => { const box = document.getElementById('box'); box.innerHTML = ''; const el = document.createElement('agent-robot-avatar'); el.setAttribute('size', '160'); el.setAttribute('motion', 'reduce'); el.setAttribute('auto-sleep', '0'); box.append(el); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); if (a !== 'none') el.setSkin(a); await new Promise(r => setTimeout(r, 200)); el.setSkin(b === 'none' ? null : b); await new Promise(r => setTimeout(r, 250)); }, [a, b]);
    const got = (await page.locator('#box').screenshot()).toString('base64');
    const want = readFileSync(`${SP}/new/${keys[b]}.png`).toString('base64');
    const r = await page.evaluate(async ([a, b]) => {
      const load = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + src; });
      const [ia, ib] = await Promise.all([load(a), load(b)]);
      const c = document.createElement('canvas'); c.width = ia.width; c.height = ia.height; const x = c.getContext('2d');
      x.drawImage(ia, 0, 0); const da = x.getImageData(0, 0, c.width, c.height).data; x.clearRect(0, 0, 999, 999); x.drawImage(ib, 0, 0); const db = x.getImageData(0, 0, c.width, c.height).data;
      let big = 0, max = 0; for (let i = 0; i < da.length; i += 4) { const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2])); if (d > 24) big++; max = Math.max(max, d); }
      return `${big}/${max}`;
    }, [got, want]);
    out.push(`${a}>${b}:${r}`);
  }
  console.log('RESULT', out.join(' '));
});
