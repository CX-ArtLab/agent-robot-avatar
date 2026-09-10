import { expect, test } from '@playwright/test';

async function loadWithClock(page) {
  await page.clock.install();
  await page.goto('/examples/basic.html');
  await page.clock.pauseAt(await page.evaluate(() => Date.now()) + 1000);
  const avatar = page.locator('#avatar');
  await avatar.evaluate(element => {
    element.setAttribute('motion', 'full');
    element._semantic = [];
    element.addEventListener('action-state', event => {
      const { action, phase, source } = event.detail;
      element._semantic.push(`${action}:${phase}:${source}`);
    });
  });
  return avatar;
}

test('waiting replacement by failure has one canonical semantic lifecycle', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await avatar.evaluate(element => { void element.startWaiting(); });
  await page.clock.runFor(240);
  await avatar.evaluate(element => { element._failurePromise = element.play('failure'); });
  await page.clock.runFor(3800);

  expect(await avatar.evaluate(element => element._semantic)).toEqual([
    'waiting:start:api',
    'waiting:cancel:api',
    'failure:start:api',
    'failure:end:api',
  ]);
});

test('reset cancels continuous waiting without a false semantic end', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await avatar.evaluate(element => { void element.startWaiting(); });
  await page.clock.runFor(240);
  await avatar.evaluate(element => element.reset());
  await page.clock.runFor(1000);

  expect(await avatar.evaluate(element => ({
    semantic: element._semantic,
    waiting: Boolean(element._waitingFx || element._waitingRequested),
    state: element._state,
  }))).toEqual({
    semantic: ['waiting:start:api', 'waiting:cancel:api'],
    waiting: false,
    state: 'idle',
  });
});

test('secondary pointers do not steal an active drag and lost capture clears it', async ({ page }) => {
  const avatar = await loadWithClock(page);
  const box = await avatar.boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  await avatar.dispatchEvent('pointerdown', {
    pointerId: 11,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    clientX: x,
    clientY: y,
    bubbles: true,
  });
  await avatar.dispatchEvent('pointerdown', {
    pointerId: 12,
    pointerType: 'touch',
    isPrimary: false,
    button: 0,
    clientX: x + 5,
    clientY: y + 5,
    bubbles: true,
  });

  expect(await avatar.evaluate(element => element._dragJelly.pointerId)).toBe(11);

  await avatar.dispatchEvent('lostpointercapture', {
    pointerId: 11,
    pointerType: 'touch',
    isPrimary: true,
    bubbles: true,
  });
  await page.clock.runFor(100);

  expect(await avatar.evaluate(element => ({
    active: element._dragJelly.active,
    returning: element._dragJelly.returning,
    pending: element._dragJelly.pendingReaction,
    pointerId: element._dragJelly.pointerId,
    transform: element._dragMotion.style.transform,
  }))).toEqual({
    active: false,
    returning: false,
    pending: null,
    pointerId: null,
    transform: '',
  });
});

test('avatar touch policy is scoped while the surrounding page remains scrollable', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Trusted touch scrolling is verified with Chromium CDP; portable touch contracts run in all projects.');
  await page.goto('/examples/basic.html');
  await page.setViewportSize({ width: 800, height: 600 });
  await page.evaluate(() => {
    document.body.style.display = 'block';
    document.body.style.minHeight = '3200px';
    document.querySelector('.example').style.marginTop = '40px';
  });

  const avatar = page.locator('#avatar');
  expect(await avatar.evaluate(element => getComputedStyle(element).touchAction)).toBe('pinch-zoom');
  expect(await page.evaluate(() => getComputedStyle(document.body).touchAction)).not.toBe('none');

  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 2 });
  await session.send('Input.synthesizeScrollGesture', {
    x: 740,
    y: 520,
    yDistance: -700,
    speed: 900,
    gestureSourceType: 'touch',
  });
  await page.waitForFunction(() => window.scrollY > 100);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
});
