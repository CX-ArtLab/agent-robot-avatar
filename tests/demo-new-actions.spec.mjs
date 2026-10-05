import { test, expect } from '@playwright/test';

const pageErrors = new WeakMap();

test.beforeEach(async ({ page }) => {
  const errors = [];
  pageErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
});

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page)).toEqual([]);
});

// Wait until the demo has finished loading every module, otherwise navigating away
// (or ending the test) aborts in-flight imports and the browser reports page errors.
async function openDemo(page, query = '') {
  await page.goto(`/demo/${query}`, { waitUntil: 'networkidle' });
  await expect(page.locator('.controls button[data-action]')).toHaveCount(17);
  await expect(page.locator('#agent-demo-build')).toHaveText(/^Demo \d/);
}

test('the demo lists the newest actions last, each flagged with a NEW badge', async ({ page }) => {
  await openDemo(page, '?lang=en');
  const buttons = page.locator('.controls button[data-action]');
  await expect(buttons.last()).toHaveAttribute('data-action', 'random');

  const actions = await buttons.evaluateAll(list => list.map(button => button.dataset.action));
  expect(actions.slice(-3)).toEqual(['wake', 'love', 'random']);

  const flags = await buttons.evaluateAll(list => list.map(button => ({
    action: button.dataset.action,
    isNew: button.classList.contains('is-new'),
    badge: getComputedStyle(button, '::after').content,
  })));
  expect(flags.filter(flag => flag.isNew).map(flag => flag.action)).toEqual(['love', 'random']);
  // Chromium and WebKit resolve attr(data-new) to "NEW"; Firefox reports the unresolved attr().
  for (const flag of flags.filter(flag => flag.isNew)) expect(['"NEW"', 'attr(data-new)']).toContain(flag.badge);
  const labels = await buttons.evaluateAll(list => list.filter(button => button.classList.contains('is-new')).map(button => button.dataset.new));
  expect(labels).toEqual(['NEW', 'NEW']);
  for (const flag of flags.filter(flag => !flag.isNew)) expect(['none', 'normal']).toContain(flag.badge);
});

test('the new demo buttons play their real actions and stay labelled in every language', async ({ page }) => {
  await openDemo(page, '?lang=en');
  await page.evaluate(() => {
    const face = document.getElementById('face');
    face._demoActions = [];
    face.addEventListener('action-state', event => face._demoActions.push(`${event.detail.action}:${event.detail.phase}`));
  });

  await page.locator('button[data-action="love"]').click();
  await expect.poll(() => page.evaluate(() => document.getElementById('face')._demoActions)).toContain('love:end');
  await page.locator('button[data-action="random"]').click();
  await expect.poll(() => page.evaluate(() => document.getElementById('face')._demoActions)).toContain('random:end');
  expect(await page.evaluate(() => document.getElementById('face')._demoActions))
    .toEqual(expect.arrayContaining(['love:start', 'love:end', 'random:start', 'random:end']));

  for (const lang of ['zh-CN', 'zh-TW', 'ja', 'ko', 'es', 'pt', 'de', 'fr']) {
    await openDemo(page, `?lang=${lang}`);
    await expect(page.locator('.controls button.is-new')).toHaveCount(2);
    const labels = await page.locator('.controls button.is-new').evaluateAll(list => list.map(button => button.textContent.trim()));
    expect(labels).toHaveLength(2);
    for (const label of labels) expect(label).not.toBe('');
    expect(new Set(labels).size).toBe(2);
  }
});

for (const [name, viewport] of [['phone', { width: 390, height: 844 }], ['small phone', { width: 320, height: 700 }], ['desktop', { width: 1280, height: 760 }]]) {
  test(`the demo action row wraps instead of overflowing on a ${name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const lang of ['zh-CN', 'de']) {
      await openDemo(page, `?lang=${lang}`);
      await expect(page.locator('.controls button.is-new')).toHaveCount(2);
      const layout = await page.evaluate(() => {
        const controls = document.querySelector('.controls').getBoundingClientRect();
        const rects = [...document.querySelectorAll('.controls button[data-action]')].map(button => button.getBoundingClientRect());
        let overlaps = 0;
        for (let i = 0; i < rects.length; i++) {
          for (let j = i + 1; j < rects.length; j++) {
            const a = rects[i];
            const b = rects[j];
            if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) overlaps++;
          }
        }
        // Width of each visual row; wrapping must leave the rows close to equal.
        const rows = new Map();
        for (const rect of rects) {
          const key = Math.round(rect.top);
          const span = rows.get(key) || { left: Infinity, right: -Infinity };
          rows.set(key, { left: Math.min(span.left, rect.left), right: Math.max(span.right, rect.right) });
        }
        const rowWidths = [...rows.values()].map(span => span.right - span.left);
        return {
          rowRatio: Math.min(...rowWidths) / Math.max(...rowWidths),
          count: rects.length,
          outside: rects.filter(rect => rect.left < controls.left - 0.5 || rect.right > controls.right + 0.5
            || rect.left < 0 || rect.right > innerWidth).length,
          overlaps,
          scrolls: document.documentElement.scrollWidth > innerWidth,
        };
      });
      expect(layout.count).toBe(17);
      expect(layout.outside).toBe(0);
      expect(layout.overlaps).toBe(0);
      expect(layout.scrolls).toBe(false);
      expect(layout.rowRatio).toBeGreaterThan(0.65);
    }
  });
}
