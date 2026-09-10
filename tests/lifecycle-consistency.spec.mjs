import { expect, test } from '@playwright/test';

const pageErrors = new WeakMap();

test.beforeEach(async ({ page }) => {
  const errors = [];
  pageErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
});

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page)).toEqual([]);
});

async function load(page) {
  await page.goto('/examples/basic.html');
  return page.locator('#avatar');
}

async function actionLog(avatar) {
  await avatar.evaluate(element => {
    element._lifecycleLog = [];
    element.addEventListener('action-state', event => {
      const { action, phase, source } = event.detail;
      element._lifecycleLog.push(`${action}:${phase}:${source}`);
    });
  });
}

async function waitForSleep(avatar, timeout = 5000) {
  await expect.poll(
    () => avatar.evaluate(element => element._state),
    { timeout, intervals: [50, 100, 200] },
  ).toBe('sleep');
}

test('disconnect returns runtime resources to the connected baseline and reattach initializes once', async ({ page }) => {
  await page.addInitScript(() => {
    const counters = window.__runtimeResources = {
      mediaAdd: 0,
      mediaRemove: 0,
      ioCreate: 0,
      ioDisconnect: 0,
      roCreate: 0,
      roDisconnect: 0,
      moObserve: 0,
      moDisconnect: 0,
    };

    const nativeMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = query => {
      const mql = nativeMatchMedia(query);
      const add = mql.addEventListener?.bind(mql);
      const remove = mql.removeEventListener?.bind(mql);
      if (add) mql.addEventListener = (type, listener, options) => {
        if (type === 'change') counters.mediaAdd += 1;
        return add(type, listener, options);
      };
      if (remove) mql.removeEventListener = (type, listener, options) => {
        if (type === 'change') counters.mediaRemove += 1;
        return remove(type, listener, options);
      };
      return mql;
    };

    const NativeIO = window.IntersectionObserver;
    if (NativeIO) window.IntersectionObserver = class extends NativeIO {
      constructor(...args) { super(...args); counters.ioCreate += 1; }
      disconnect() { counters.ioDisconnect += 1; return super.disconnect(); }
    };
    const NativeRO = window.ResizeObserver;
    if (NativeRO) window.ResizeObserver = class extends NativeRO {
      constructor(...args) { super(...args); counters.roCreate += 1; }
      disconnect() { counters.roDisconnect += 1; return super.disconnect(); }
    };
    const NativeMO = window.MutationObserver;
    if (NativeMO) window.MutationObserver = class extends NativeMO {
      observe(...args) { counters.moObserve += 1; return super.observe(...args); }
      disconnect() { counters.moDisconnect += 1; return super.disconnect(); }
    };
  });

  const avatar = await load(page);
  await expect(avatar).toBeVisible();
  const result = await page.evaluate(async () => {
    const baseline = { ...window.__runtimeResources };
    const late = [];
    for (let i = 0; i < 20; i += 1) {
      const face = document.createElement('agent-robot-avatar');
      face.setAttribute('motion', 'auto');
      face.addEventListener('action-state', event => late.push(`${event.detail.action}:${event.detail.phase}`));
      document.body.append(face);
      void face.play('success');
      await new Promise(resolve => requestAnimationFrame(() => resolve()));
      face.remove();
    }
    await new Promise(resolve => setTimeout(resolve, 120));
    const afterRemove = { ...window.__runtimeResources };

    const reusable = document.createElement('agent-robot-avatar');
    reusable.setAttribute('motion', 'reduce');
    reusable.setAttribute('wake-on', 'manual');
    document.body.append(reusable);
    await new Promise(resolve => requestAnimationFrame(() => resolve()));
    const afterAttach = { ...window.__runtimeResources };
    reusable.remove();
    await new Promise(resolve => setTimeout(resolve, 50));
    const afterDetach = { ...window.__runtimeResources };

    return { baseline, afterRemove, afterAttach, afterDetach, late };
  });

  const active = counters => ({
    media: counters.mediaAdd - counters.mediaRemove,
    io: counters.ioCreate - counters.ioDisconnect,
    ro: counters.roCreate - counters.roDisconnect,
    mo: counters.moObserve - counters.moDisconnect,
  });
  console.log('[resource-balance]', JSON.stringify({
    baseline: active(result.baseline),
    afterRemove: active(result.afterRemove),
    afterAttach: active(result.afterAttach),
    afterDetach: active(result.afterDetach),
  }));
  expect(active(result.afterRemove)).toEqual(active(result.baseline));
  expect(active(result.afterAttach)).toEqual({
    media: active(result.baseline).media + 1,
    io: active(result.baseline).io + 1,
    ro: active(result.baseline).ro + 1,
    mo: active(result.baseline).mo + 1,
  });
  expect(active(result.afterDetach)).toEqual(active(result.baseline));
  expect(result.late.filter(entry => entry.endsWith(':end'))).toEqual([]);
});

test('reduced motion auto-sleep runs without a continuous draw loop and ends visibly asleep', async ({ page }) => {
  const avatar = await load(page);
  await avatar.evaluate(element => {
    element.setAttribute('motion', 'reduce');
    element.setAttribute('auto-sleep', '100');
    element._drawCountForSleep = 0;
    const draw = element._draw.bind(element);
    element._draw = now => { element._drawCountForSleep += 1; return draw(now); };
    element.noteActivity(false);
  });

  await waitForSleep(avatar, 5000);
  await page.waitForTimeout(120);
  const result = await avatar.evaluate(element => ({
    state: element._state,
    sleeping: element._sleeping,
    leftRy: Number(element._leftBase.getAttribute('ry')),
    rightRy: Number(element._rightBase.getAttribute('ry')),
    draws: element._drawCountForSleep,
    raf: element._raf,
    paused: element._framePaused,
  }));
  console.log('[reduced-auto-sleep]', JSON.stringify(result));
  expect(result.state).toBe('sleep');
  expect(result.sleeping).toBe(true);
  expect(result.leftRy).toBeLessThanOrEqual(6);
  expect(result.rightRy).toBeLessThanOrEqual(6);
  expect(result.paused || result.raf === 0).toBe(true);
  expect(result.draws).toBeLessThan(40);
});

test('auto-sleep respects zero, activity delay, dynamic timeout, and active input/waiting', async ({ page }) => {
  const avatar = await load(page);
  await avatar.evaluate(element => {
    element.setAttribute('motion', 'reduce');
    element.setAttribute('auto-sleep', '0');
  });
  await page.waitForTimeout(250);
  await expect(avatar).not.toHaveJSProperty('_state', 'sleep');

  await avatar.evaluate(element => element.setAttribute('auto-sleep', '180'));
  await page.waitForTimeout(120);
  await avatar.evaluate(element => element.noteActivity(false));
  await page.waitForTimeout(120);
  await expect(avatar).not.toHaveJSProperty('_state', 'sleep');

  await avatar.evaluate(element => { void element.play('input'); });
  await page.waitForTimeout(650);
  await expect(avatar).toHaveJSProperty('_state', 'input');
  await avatar.evaluate(element => element.stopWaiting());

  await avatar.evaluate(element => { void element.startWaiting(); });
  await page.waitForTimeout(400);
  await page.waitForTimeout(300);
  expect(await avatar.evaluate(element => Boolean(element._waitingFx))).toBe(true);
  await avatar.evaluate(element => element.stopWaiting());
  await waitForSleep(avatar, 4500);
});

test('reduced manual sleep commits the final sleep SVG before frames pause', async ({ page }) => {
  const avatar = await load(page);
  await avatar.evaluate(element => {
    element.setAttribute('motion', 'reduce');
    void element.play('sleep');
  });
  await waitForSleep(avatar, 4500);
  await page.waitForTimeout(100);
  const reduced = await avatar.evaluate(element => ({
    leftRy: Number(element._leftBase.getAttribute('ry')),
    rightRy: Number(element._rightBase.getAttribute('ry')),
    targetH: element._toPose.h,
    poseH: element._pose.h,
    raf: element._raf,
  }));
  expect(reduced.targetH).toBe(10);
  expect(reduced.poseH).toBe(10);
  expect(reduced.leftRy).toBeLessThanOrEqual(6);
  expect(reduced.rightRy).toBeLessThanOrEqual(6);
  expect(reduced.raf).toBe(0);
});

test('full and reduced motion settle on the same closed-eye sleep SVG', async ({ page }) => {
  const reducedAvatar = await load(page);
  const fullAvatar = page.locator('#full-avatar');
  await page.evaluate(() => {
    const reduced = document.querySelector('#avatar');
    reduced.setAttribute('motion', 'reduce');
    const full = document.createElement('agent-robot-avatar');
    full.id = 'full-avatar';
    full.setAttribute('motion', 'full');
    document.body.append(full);
    void reduced.play('sleep');
    void full.play('sleep');
  });
  await waitForSleep(reducedAvatar, 4500);
  await waitForSleep(fullAvatar, 4500);
  // Full motion enters the semantic sleep state before its visual morph has
  // finished. Compare only after the rendered eyes have actually settled.
  await expect.poll(
    () => fullAvatar.evaluate(element => Number(element._leftBase.getAttribute('ry'))),
    { timeout: 5000, intervals: [80, 150, 250] },
  ).toBeLessThanOrEqual(6);
  await expect.poll(
    () => fullAvatar.evaluate(element => Number(element._rightBase.getAttribute('ry'))),
    { timeout: 5000, intervals: [80, 150, 250] },
  ).toBeLessThanOrEqual(6);
  await page.waitForTimeout(80);

  const visual = await page.evaluate(() => {
    const snapshot = element => ({
      state: element._state,
      poseH: element._pose.h,
      targetH: element._toPose.h,
      leftRy: Number(element._leftBase.getAttribute('ry')),
      rightRy: Number(element._rightBase.getAttribute('ry')),
      raf: element._raf,
    });
    return {
      reduced: snapshot(document.querySelector('#avatar')),
      full: snapshot(document.querySelector('#full-avatar')),
    };
  });
  console.log('[sleep-visual-compare]', JSON.stringify(visual));
  expect(visual.reduced.state).toBe('sleep');
  expect(visual.full.state).toBe('sleep');
  expect(visual.reduced.poseH).toBe(10);
  expect(visual.reduced.targetH).toBe(10);
  expect(visual.full.poseH).toBeCloseTo(10, 0);
  expect(visual.reduced.leftRy).toBeLessThanOrEqual(6);
  expect(visual.reduced.rightRy).toBeLessThanOrEqual(6);
  expect(Math.abs(visual.reduced.leftRy - visual.full.leftRy)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(visual.reduced.rightRy - visual.full.rightRy)).toBeLessThanOrEqual(0.5);
  expect(visual.reduced.raf).toBe(0);
});

test('stopWaiting terminates the actual active semantic action exactly once', async ({ page }) => {
  const avatar = await load(page);
  await actionLog(avatar);

  await avatar.evaluate(element => { void element.play('input'); });
  await page.waitForTimeout(650);
  await avatar.evaluate(element => element.stopWaiting());
  await page.waitForTimeout(80);
  expect(await avatar.evaluate(element => ({ state: element._state, log: [...element._lifecycleLog] }))).toEqual({
    state: 'idle',
    log: ['input:start:api', 'input:cancel:api'],
  });

  await avatar.evaluate(element => {
    element._lifecycleLog.length = 0;
    void element.play('success');
  });
  await page.waitForTimeout(650);
  await avatar.evaluate(element => element.stopWaiting());
  await page.waitForTimeout(1900);
  expect(await avatar.evaluate(element => element._lifecycleLog)).toEqual([
    'success:start:api',
    'success:cancel:api',
  ]);

  await avatar.evaluate(element => {
    element._lifecycleLog.length = 0;
    void element.startWaiting();
  });
  await page.waitForTimeout(350);
  await avatar.evaluate(element => {
    element.stopWaiting();
    element.stopWaiting();
  });
  expect(await avatar.evaluate(element => element._lifecycleLog)).toEqual([
    'waiting:start:api',
    'waiting:end:api',
  ]);
});

test('explicit noteActivity inside trusted key/pointer/click handlers wakes manual mode while ambient events do not', async ({ page }) => {
  const avatar = await load(page);
  await actionLog(avatar);
  await page.evaluate(() => {
    const input = document.createElement('input');
    input.id = 'host-input';
    const pointerButton = document.createElement('button');
    pointerButton.id = 'host-pointer';
    pointerButton.textContent = 'pointer';
    const clickButton = document.createElement('button');
    clickButton.id = 'host-click';
    clickButton.textContent = 'click';
    const noWakeButton = document.createElement('button');
    noWakeButton.id = 'host-no-wake';
    noWakeButton.textContent = 'no wake';
    document.body.append(input, pointerButton, clickButton, noWakeButton);
    const face = document.querySelector('#avatar');
    input.addEventListener('keydown', () => face.noteActivity());
    pointerButton.addEventListener('pointerdown', () => face.noteActivity());
    clickButton.addEventListener('click', () => face.noteActivity());
    noWakeButton.addEventListener('click', () => face.noteActivity(false));
  });

  async function sleepAgain() {
    await avatar.evaluate(element => {
      element.setAttribute('wake-on', 'manual');
      void element.play('sleep');
    });
    await waitForSleep(avatar, 4500);
  }

  await sleepAgain();
  await page.mouse.click(5, 5);
  await page.keyboard.press('A');
  await page.waitForTimeout(150);
  await expect(avatar).toHaveJSProperty('_state', 'sleep');

  await page.locator('#host-no-wake').click();
  await page.waitForTimeout(120);
  await expect(avatar).toHaveJSProperty('_state', 'sleep');

  await page.locator('#host-input').focus();
  await page.keyboard.press('B');
  await expect.poll(() => avatar.evaluate(element => element._sleeping), { timeout: 1800 }).toBe(false);

  await sleepAgain();
  await page.locator('#host-pointer').hover();
  await page.mouse.down();
  await expect.poll(() => avatar.evaluate(element => element._sleeping), { timeout: 1800 }).toBe(false);
  await page.mouse.up();

  await sleepAgain();
  await page.locator('#host-click').click();
  await expect.poll(() => avatar.evaluate(element => element._sleeping), { timeout: 1800 }).toBe(false);

  const wakeSources = await avatar.evaluate(element => ({
    automatic: element._lifecycleLog.filter(entry => entry === 'wake:start:automatic'),
    api: element._lifecycleLog.filter(entry => entry === 'wake:start:api'),
  }));
  expect(wakeSources.automatic).toEqual([]);
  expect(wakeSources.api).toHaveLength(3);
});

test('interaction wake policy is target-specific across multiple instances', async ({ page }) => {
  const avatar = await load(page);
  const second = page.locator('#second-avatar');
  await page.evaluate(() => {
    const face = document.createElement('agent-robot-avatar');
    face.id = 'second-avatar';
    face.setAttribute('wake-on', 'manual');
    document.body.append(face);
    document.querySelector('#avatar').setAttribute('wake-on', 'interaction');
    void document.querySelector('#avatar').play('sleep');
    void face.play('sleep');
  });
  await waitForSleep(avatar, 4500);
  await waitForSleep(second, 4500);
  await avatar.click({ position: { x: 20, y: 20 } });
  await expect.poll(() => avatar.evaluate(element => element._sleeping), { timeout: 1800 }).toBe(false);
  await expect(second).toHaveJSProperty('_state', 'sleep');
});

test('request lifecycle example ignores stale results and fits mobile and desktop viewports', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/examples/accessibility.html');
  await expect(page.locator('#avatar')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.locator('#replace-request').click();
  await page.waitForTimeout(1900);
  await expect(page.locator('#agent-status')).toHaveText('Task completed.');
  await expect(page.locator('#request-log')).toContainText('stale result ignored');
  await expect(page.locator('#request-log')).not.toContainText('failure:start:api');

  await page.setViewportSize({ width: 1280, height: 800 });
  const mainBox = await page.locator('main').boundingBox();
  expect(mainBox.width).toBeLessThanOrEqual(621);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('prototype-like and unknown action names fail before disturbing waiting lifecycle', async ({ page }) => {
  const avatar = await load(page);
  await actionLog(avatar);
  await avatar.evaluate(element => { void element.startWaiting(); });
  await page.waitForTimeout(350);

  for (const name of ['constructor', '__proto__', 'not-a-real-action']) {
    const message = await avatar.evaluate((element, action) => {
      try { element.play(action); } catch (error) { return error.message; }
      return '';
    }, name);
    expect(message).toContain('Unknown Agent Robot Avatar action');
    expect(await avatar.evaluate(element => ({
      waiting: Boolean(element._waitingFx),
      requested: element._waitingRequested,
      state: element._state,
      log: [...element._lifecycleLog],
    }))).toEqual({
      waiting: true,
      requested: true,
      state: 'idle',
      log: ['waiting:start:api'],
    });
  }

  await avatar.evaluate(element => element.stopWaiting());
  expect(await avatar.evaluate(element => element._lifecycleLog)).toEqual([
    'waiting:start:api',
    'waiting:end:api',
  ]);
});
