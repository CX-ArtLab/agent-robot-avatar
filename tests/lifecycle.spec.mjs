import { expect, test } from '@playwright/test';

const errorsByPage = new WeakMap();

test.beforeEach(async ({ page }) => {
  const errors = [];
  errorsByPage.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.install();
  await page.goto('/examples/basic.html');
  await page.clock.pauseAt(await page.evaluate(() => Date.now()) + 1000);
  await page.evaluate(() => {
    window.lifecycleAvatar = document.querySelector('#avatar');
    window.detachedStates = [];
    window.lifecycleAvatar.addEventListener('face-state', event => {
      if (!window.lifecycleAvatar.isConnected) window.detachedStates.push(event.detail.state);
    });
  });
});

test.afterEach(async ({ page }) => {
  expect(errorsByPage.get(page)).toEqual([]);
});

for (const elapsed of [0, 600]) {
  test(`disconnect cancels a success action after ${elapsed}ms without late events`, async ({ page }) => {
    await page.evaluate(() => {
      window.actionSettled = false;
      window.lifecycleAvatar.play('success').then(() => { window.actionSettled = true; });
    });
    await page.clock.runFor(elapsed);
    await page.evaluate(() => window.lifecycleAvatar.remove());
    // The clock remains paused: settling must come from cancellation, not expiration.
    await expect.poll(() => page.evaluate(() => window.actionSettled)).toBe(true);
    expect(await page.evaluate(() => window.lifecycleAvatar.shadowRoot.getAnimations().length)).toBe(0);
    await page.clock.runFor(3000);
    expect(await page.evaluate(() => window.detachedStates)).toEqual([]);
  });
}

test('reconnecting during old work preserves settings and accepts a fresh action', async ({ page }) => {
  await page.evaluate(() => {
    const avatar = window.lifecycleAvatar;
    avatar.setAttribute('color', '#336699');
    avatar.setHeadRoundness(80);
    void avatar.play('surprise');
  });
  await page.clock.runFor(580);
  await page.evaluate(() => {
    const avatar = window.lifecycleAvatar;
    avatar.remove();
    document.body.append(avatar);
    window.reconnectedStates = [];
    avatar.addEventListener('face-state', event => window.reconnectedStates.push(event.detail.state));
    void avatar.play('input');
  });
  await page.clock.runFor(3000);
  expect(await page.evaluate(() => ({
    events: window.reconnectedStates,
    detachedEvents: window.detachedStates,
    roundness: window.lifecycleAvatar.getHeadRoundness(),
    color: window.lifecycleAvatar.getAttribute('color'),
    size: window.lifecycleAvatar.getBoundingClientRect().width,
  }))).toEqual({ events: ['input'], detachedEvents: [], roundness: 80, color: '#336699', size: 140 });
});

test('disconnect clears continuous waiting and drag state before reconnecting', async ({ page }) => {
  await page.evaluate(() => { void window.lifecycleAvatar.startWaiting(); });
  await page.clock.runFor(200);
  const avatar = page.locator('#avatar');
  const box = await avatar.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 35, box.y + box.height / 2 + 15);
  await page.clock.runFor(100);
  await page.evaluate(() => window.lifecycleAvatar.remove());
  await page.mouse.up();
  await page.evaluate(() => {
    document.body.append(window.lifecycleAvatar);
    window.reconnectedStates = [];
    window.lifecycleAvatar.addEventListener('face-state', event => window.reconnectedStates.push(event.detail.state));
  });
  await page.clock.runFor(3500);
  expect(await avatar.evaluate(element => ({
    waiting: element._waitingFx,
    dragging: element._dragJelly.active,
  }))).toEqual({ waiting: null, dragging: false });
  expect(await page.evaluate(() => window.reconnectedStates)).toEqual([]);
  await page.evaluate(() => { void window.lifecycleAvatar.play('input'); });
  await page.clock.runFor(500);
  expect(await page.evaluate(() => window.reconnectedStates)).toEqual(['input']);
});
