import { test, expect } from '@playwright/test';

for (const [name, viewport, language] of [
  ['desktop', { width: 1280, height: 760 }, 'en'],
  ['phone', { width: 390, height: 844 }, 'de'],
]) {
  test(`the ${name} demo preloads modules and reveals one stable, usable layout`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const requests = new Set();
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    await page.route('**/agent-robot-avatar-demo-*.js', async route => {
      requests.add(new URL(route.request().url()).pathname.split('/').at(-1));
      await gate;
      await route.continue();
    });

    try {
      await page.goto(`/demo/?lang=${language}`, { waitUntil: 'commit' });
      // Even the last module must be requested while the first is still held.
      await expect.poll(() => requests.has('agent-robot-avatar-demo-controls.js')
        && requests.has('agent-robot-avatar-demo-reply-loop.js')).toBe(true);
      await expect(page.locator('.controls button[data-action]')).toHaveCount(17);
      await expect(page.locator('#demoSettingsPanelToggle')).toBeAttached();
      await expect(page.locator('#demoHeadRoundness')).toBeAttached();
      await expect(page.locator('#demoLoadStatus')).toBeVisible();
      await expect(page.locator('#face')).toBeHidden();
      await expect(page.locator('.demo-control-stack')).toBeHidden();
      await expect(page.locator('#canvas')).toHaveAttribute('inert', '');
    } finally {
      release();
    }

    await expect(page.locator('html')).toHaveAttribute('data-demo-ready', 'true');
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('#demoLoadStatus')).toBeHidden();
    await expect(page.locator('#face')).toBeVisible();
    await expect(page.locator('#canvas')).not.toHaveAttribute('inert');
    const stable = await page.evaluate(async () => {
      const elements = [...document.querySelectorAll('.avatar-home, .status-pill, .demo-control-stack, .controls button, .demo-panel-toolbar, .demo-roundness-control, #demoChatEntryHint')];
      const snapshot = () => elements.map(element => {
        const rect = element.getBoundingClientRect();
        return [rect.x, rect.y, rect.width, rect.height];
      });
      const first = snapshot();
      for (let frame = 0; frame < 20; frame++) {
        await new Promise(resolve => requestAnimationFrame(resolve));
        if (JSON.stringify(snapshot()) !== JSON.stringify(first)) return false;
      }
      return true;
    });
    expect(stable).toBe(true);
    await page.locator('#demoSettingsPanelToggle').click();
    await expect(page.locator('#demoSettingsPanel')).toBeVisible();
    await page.locator('#demoSettingsPanelToggle').click();
    await page.locator('#demoLanguagePanelToggle').click();
    await page.locator('[data-lang="zh-CN"]').click();
    await expect(page.locator('[data-action="success"]')).toHaveText('成功');
    await page.locator('#demoLanguagePanelToggle').click();
    await page.locator('#face').dblclick();
    await expect(page.locator('#agentOverlay')).toHaveClass('agent-overlay open');
    await page.locator('#close').click();
    await expect(page.locator('#agentOverlay')).not.toHaveClass(/open/);
    expect(errors).toEqual([]);
  });
}

test('a failed startup module gives a visible error instead of a broken partial demo', async ({ page }) => {
  await page.route('**/agent-robot-avatar-demo-controls.js', route => route.abort());
  await page.goto('/demo/');
  await expect(page.locator('#demoLoadStatus')).toHaveText('The demo could not load. Please reload to try again.');
  await expect(page.locator('#demoLoadStatus')).toBeVisible();
  await expect(page.locator('.demo-control-stack')).toBeHidden();
  await expect(page.locator('#canvas')).toHaveAttribute('inert', '');
});

test('the deployed Pages entry loads all startup modules from its own directory', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/.pages-site/?lang=zh-CN');
  await expect(page.locator('html')).toHaveAttribute('data-demo-ready', 'true');
  await expect(page.locator('#face')).toBeVisible();
  await expect(page.locator('.controls button[data-action]')).toHaveCount(17);
  expect(errors).toEqual([]);
});

