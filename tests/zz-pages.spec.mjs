import { test } from '@playwright/test';
const SP = '/tmp/claude-1000/-home-ubuntu-APP-GitHub-agent-robot-avatar/974319fa-8810-48e8-85d6-9a7d6710cc6e/scratchpad';
for (const [name, base, url] of [['old-skins', 4180, '/demo/skins.html?skin=gallery-glow-blue'], ['new-skins', 4181, '/demo/skins.html?skin=13'], ['new-gallery', 4181, '/demo/materials/index.html'], ['new-home', 4181, '/demo/index.html?skin=61']]) {
  test(name, async ({ page }) => {
    test.setTimeout(120000);
    const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => (m.type() === 'error' || m.type() === 'warning') && errs.push(m.text()));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`http://127.0.0.1:${base}${url}`); await page.waitForTimeout(2500);
    if (name.includes('gallery')) for (let y = 0; y < 9000; y += 700) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(150); }
    const info = await page.evaluate(() => ({ imgs: [...document.querySelectorAll('img')].filter(i => i.naturalWidth).length, skin: document.querySelector('agent-robot-avatar')?.getSkin?.() }));
    console.log(name, JSON.stringify(info), 'errors', errs.length, errs.slice(0, 3).join(' | '));
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300);
    await page.screenshot({ path: `${SP}/${name}.png` });
  });
}
