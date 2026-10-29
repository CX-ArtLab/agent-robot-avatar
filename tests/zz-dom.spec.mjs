import { test } from '@playwright/test';
import { writeFileSync } from 'node:fs';
const SP = '/tmp/claude-1000/-home-ubuntu-APP-GitHub-agent-robot-avatar/974319fa-8810-48e8-85d6-9a7d6710cc6e/scratchpad';
test('dom', async ({ page }) => {
  await page.goto('http://127.0.0.1:4181/examples/basic.html');
  const [a, b] = await page.evaluate(async () => {
    await import('/agent-robot-avatar.js');
    const make = async prev => { const el = document.createElement('agent-robot-avatar'); el.setAttribute('motion', 'reduce'); el.setAttribute('auto-sleep', '0'); document.body.append(el); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); if (prev) el.setSkin(prev); await new Promise(r => setTimeout(r, 100)); el.setSkin('188'); await new Promise(r => setTimeout(r, 200)); const html = el.shadowRoot.innerHTML; el.remove(); return html; };
    return [await make(null), await make('13')];
  });
  const pretty = h => h.replace(/></g, '>\n<');
  writeFileSync(`${SP}/dom-fresh.txt`, pretty(a)); writeFileSync(`${SP}/dom-after.txt`, pretty(b));
});
