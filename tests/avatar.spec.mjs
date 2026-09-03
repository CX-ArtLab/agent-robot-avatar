import { expect, test } from '@playwright/test';

test('loads the component and exposes its public controls', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/examples/basic.html');
  const avatar = page.locator('agent-robot-avatar');

  await expect(avatar).toBeVisible();
  await expect.poll(() => avatar.evaluate(element => Boolean(element.shadowRoot?.querySelector('svg')))).toBe(true);

  const api = await avatar.evaluate(element => ({
    registered: customElements.get('agent-robot-avatar') === element.constructor,
    play: typeof element.play,
    reset: typeof element.reset,
    pointerFollow: typeof element.setPointerFollow,
    roundness: typeof element.setHeadRoundness,
    waiting: typeof element.startWaiting,
    antennaFlash: typeof element.setAntennaFlash,
    demoGlobal: typeof window.AgentRobotAvatarDemoBuild,
  }));

  expect(api).toEqual({
    registered: true,
    play: 'function',
    reset: 'function',
    pointerFollow: 'function',
    roundness: 'function',
    waiting: 'function',
    antennaFlash: 'function',
    demoGlobal: 'undefined',
  });
  expect(pageErrors).toEqual([]);
});

test('changes state and returns to idle', async ({ page }) => {
  await page.goto('/examples/basic.html');
  const avatar = page.locator('agent-robot-avatar');

  const states = await avatar.evaluate(async element => {
    const seen = [];
    element.addEventListener('face-state', event => seen.push(event.detail.state));
    await element.play('input');
    element.reset();
    return seen;
  });

  expect(states).toContain('input');
  expect(states.at(-1)).toBe('idle');
});

test('interactive demo loads without runtime errors', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/demo/');
  await expect(page.locator('agent-robot-avatar')).toBeVisible();
  await expect(page.locator('[data-action="waiting"]')).toBeVisible();
  await expect(page.locator('#demoAntennaFlash')).not.toBeChecked();
  await expect(page.locator('#agent-demo-build')).toHaveText('Demo 0.2.0');
  const versions = await page.evaluate(() => ({
    runtime: window.AgentRobotAvatarVersion,
    demo: window.AgentRobotAvatarDemoBuild,
  }));
  expect(versions).toEqual({ runtime: '0.2.0', demo: '0.2.0' });
  expect(pageErrors).toEqual([]);
});

test('looping waiting starts once and continues smoothly', async ({ page }) => {
  await page.goto('/demo/');
  await page.locator('#demoLoop').evaluate(input => {
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('[data-action="waiting"]').click();

  const avatar = page.locator('#face');
  await expect.poll(() => avatar.evaluate(element => element._waitingFx?.continuous)).toBe(true);
  const initial = await avatar.evaluate(element => ({
    start: element._waitingFx.start,
    token: element._transitionToken,
  }));

  await page.waitForTimeout(500);
  const later = await avatar.evaluate(element => ({
    start: element._waitingFx.start,
    token: element._transitionToken,
  }));

  expect(later).toEqual(initial);
  await page.locator('#demoLoop').evaluate(input => {
    input.checked = false;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect.poll(() => avatar.evaluate(element => element._waitingFx)).toBe(null);
});

test('extension registry routes actions and aliases', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/examples/basic.html');
  const avatar = page.locator('agent-robot-avatar');

  await avatar.evaluate(element => {
    element.setAntennaFlash(true);
    void element.play('success');
  });
  await expect.poll(() => avatar.evaluate(element => element._antennaFlashAction)).toBe('success');
  await avatar.evaluate(element => element.reset());

  await avatar.evaluate(element => { void element.play('review'); });
  await expect.poll(() => avatar.evaluate(element => Boolean(element._inspectFx))).toBe(true);
  await avatar.evaluate(element => element.reset());

  await avatar.evaluate(element => { void element.play('fail'); });
  await expect.poll(() => avatar.evaluate(element => element._state)).toBe('sad');
  await avatar.evaluate(element => element.reset());

  expect(pageErrors).toEqual([]);
});

test('built-in action registry maps every core action', async ({ page }) => {
  await page.goto('/examples/basic.html');
  const avatar = page.locator('agent-robot-avatar');

  const called = await avatar.evaluate(element => {
    const calls = [];
    const methods = ['reset', 'bored', 'input', 'send', 'success', 'warning', 'error', 'angry', 'surprise', 'sleep', 'wake'];
    for (const method of methods) {
      element[method] = function() {
        calls.push(method);
        return this;
      };
    }

    for (const action of [
      'idle', 'bored', 'input', 'send', 'success', 'warning', 'error',
      'system-error', 'connection-error', 'angry', 'blocked', 'policy-blocked',
      'surprise', 'sleep', 'wake',
    ]) {
      element._inputWanted = false;
      element._sleeping = action === 'wake';
      element._state = action === 'wake' ? 'sleep' : 'idle';
      element.play(action);
    }

    return calls;
  });

  expect(called).toEqual([
    'reset', 'bored', 'input', 'send', 'success', 'warning', 'error',
    'error', 'error', 'angry', 'angry', 'angry', 'surprise', 'sleep', 'wake',
  ]);
});

test('multiple avatars share one set of global listeners', async ({ page }) => {
  await page.addInitScript(() => {
    const trackedWindowEvents = new Set(['pointermove', 'pointerdown', 'keydown', 'pointerup', 'pointercancel']);
    const counts = {};
    const removals = {};
    window.__avatarListenerCounts = counts;
    window.__avatarListenerRemovals = removals;

    const addWindowListener = window.addEventListener;
    window.addEventListener = function(type, ...args) {
      if (trackedWindowEvents.has(type)) counts[type] = (counts[type] || 0) + 1;
      return addWindowListener.call(this, type, ...args);
    };

    const removeWindowListener = window.removeEventListener;
    window.removeEventListener = function(type, ...args) {
      if (trackedWindowEvents.has(type)) removals[type] = (removals[type] || 0) + 1;
      return removeWindowListener.call(this, type, ...args);
    };

    const addDocumentListener = Document.prototype.addEventListener;
    Document.prototype.addEventListener = function(type, ...args) {
      if (this === document && type === 'visibilitychange') {
        counts.visibilitychange = (counts.visibilitychange || 0) + 1;
      }
      return addDocumentListener.call(this, type, ...args);
    };

    const removeDocumentListener = Document.prototype.removeEventListener;
    Document.prototype.removeEventListener = function(type, ...args) {
      if (this === document && type === 'visibilitychange') {
        removals.visibilitychange = (removals.visibilitychange || 0) + 1;
      }
      return removeDocumentListener.call(this, type, ...args);
    };
  });

  await page.goto('/examples/basic.html');
  await page.evaluate(() => {
    document.body.append(
      document.createElement('agent-robot-avatar'),
      document.createElement('agent-robot-avatar'),
    );
  });

  const counts = await page.evaluate(() => window.__avatarListenerCounts);
  expect(counts).toEqual({
    pointermove: 1,
    pointerdown: 1,
    keydown: 1,
    pointerup: 1,
    pointercancel: 1,
    visibilitychange: 1,
  });

  await page.evaluate(() => {
    document.querySelectorAll('agent-robot-avatar').forEach(element => element.remove());
  });
  const removals = await page.evaluate(() => window.__avatarListenerRemovals);
  expect(removals).toEqual({
    pointermove: 1,
    pointerdown: 1,
    keydown: 1,
    pointerup: 1,
    pointercancel: 1,
    visibilitychange: 1,
  });
});

test('shared pointer handlers preserve jelly dragging', async ({ page }) => {
  await page.goto('/examples/basic.html');
  const avatar = page.locator('agent-robot-avatar');
  const box = await avatar.boundingBox();

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 40, box.y + box.height / 2 + 20);
  await expect.poll(() => avatar.evaluate(element => element._dragJelly.active && element._dragJelly.moved)).toBe(true);
  await page.mouse.up();
  await expect.poll(() => avatar.evaluate(element => element._dragJelly.active)).toBe(false);
});

test('frame rendering pauses in settled sleep and resumes on reset', async ({ page }) => {
  await page.goto('/examples/basic.html');
  const avatar = page.locator('agent-robot-avatar');

  await avatar.evaluate(element => {
    element._headMotion.getAnimations().forEach(animation => animation.cancel());
    element._morphStart = performance.now() - 1000;
    element._morphDuration = 0;
    element._state = 'sleep';
    element._sleeping = true;
  });

  await expect.poll(() => avatar.evaluate(element => element._framePaused && element._raf === 0)).toBe(true);
  const sleepingFrame = await avatar.evaluate(element => element._lastFrame);
  await page.waitForTimeout(150);
  await expect(avatar).toHaveJSProperty('_lastFrame', sleepingFrame);

  await avatar.evaluate(element => element.reset());
  await expect.poll(() => avatar.evaluate(element => !element._framePaused && element._lastFrame > 0)).toBe(true);
  await expect.poll(() => avatar.evaluate(element => element._lastFrame)).toBeGreaterThan(sleepingFrame);
});
