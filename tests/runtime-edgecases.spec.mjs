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
  await page.setViewportSize({ width: 800, height: 600 });
  await page.goto('/examples/basic.html');
  await page.evaluate(() => {
    document.documentElement.style.height = 'auto';
    document.body.style.display = 'block';
    document.body.style.height = 'auto';
    document.body.style.minHeight = '3600px';
    document.body.style.overflow = 'visible';
    document.querySelector('.example').style.marginTop = '40px';
    window._outsideTouch = null;
    document.addEventListener('touchstart', event => {
      window._outsideTouch = {
        trusted: event.isTrusted,
        insideAvatar: event.composedPath().some(node => node?.id === 'avatar'),
      };
    }, { once: true, passive: true });
  });

  const avatar = page.locator('#avatar');
  expect(await avatar.evaluate(element => getComputedStyle(element).touchAction)).toBe('pinch-zoom');
  expect(await page.evaluate(() => getComputedStyle(document.body).touchAction)).not.toBe('none');
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeGreaterThan(3000);

  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 2 });
  const touch = (x, y) => ({ x, y, radiusX: 2, radiusY: 2, force: 1, id: 1 });
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [touch(740, 520)],
  });
  for (const y of [440, 350, 250, 150, 80]) {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [touch(740, y)],
    });
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  expect(await page.evaluate(() => window._outsideTouch)).toEqual({ trusted: true, insideAvatar: false });
});
