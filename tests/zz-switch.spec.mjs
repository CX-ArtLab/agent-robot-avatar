import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import * as require_fs from 'node:fs';
const SP = '/tmp/claude-1000/-home-ubuntu-APP-GitHub-agent-robot-avatar/974319fa-8810-48e8-85d6-9a7d6710cc6e/scratchpad';
const keys = JSON.parse(readFileSync(`${SP}/gpt-keys.json`, 'utf8'));
test('switching matches fresh renders', async ({ page }) => {
  test.setTimeout(600000);
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.setViewportSize({ width: 400, height: 400 });
  await page.goto('http://127.0.0.1:4181/examples/basic.html');
  await page.evaluate(async () => { document.body.innerHTML = '<div id="box" style="width:200px;height:200px;display:grid;place-items:center;background:#fff"></div>'; await import('/agent-robot-avatar.js'); });
  // 1 material, 13 native, 25 native, 61 material(frosted), 120 material (ball?), 188 native
  const seq = ['1', '13', '2', '61', '25', '188', '150', '1', null, '13', null, '120', '120', '7'];
  const shot = async () => page.locator('#box').screenshot();
  const fresh = async id => {
    await page.evaluate(async id => { const box = document.getElementById('box'); box.innerHTML = ''; const a = document.createElement('agent-robot-avatar'); a.id = 'f'; a.setAttribute('size', '160'); a.setAttribute('motion', 'reduce'); a.setAttribute('auto-sleep', '0'); box.append(a); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); if (id) a.setSkin(id); await new Promise(r => setTimeout(r, 250)); }, id);
    return shot();
  };
  const plain = await fresh(null);
  await page.evaluate(async () => { const box = document.getElementById('box'); box.innerHTML = ''; const a = document.createElement('agent-robot-avatar'); a.id = 's'; a.setAttribute('size', '160'); a.setAttribute('motion', 'reduce'); a.setAttribute('auto-sleep', '0'); box.append(a); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); window.__s = a; });
  const results = [];
  for (const id of seq) {
    await page.evaluate(async id => { window.__s.setSkin(id); await new Promise(r => setTimeout(r, 250)); }, id);
    const got = await shot();
    const want = id ? readFileSync(`${SP}/new/${keys[id]}.png`) : plain;
    const same = Buffer.compare(got, want) === 0; results.push(`${id}:${same ? 'same' : 'DIFF'}`); if (!same) { require_fs.writeFileSync(`${SP}/sw-got-${results.length}-${id}.png`, got); require_fs.writeFileSync(`${SP}/sw-want-${results.length}-${id}.png`, want); }
  }
  const lids = await page.evaluate(() => { const r = window.__s.shadowRoot; return ['leftTop', 'rightTop'].map(i => !!r.getElementById(i) && r.getElementById(i).isConnected); });
  console.log(results.join(' '), 'lids', lids, 'errors', errs.length, errs[0] || '');
  // plain snapshot after the loop must still equal a fresh plain avatar
});
