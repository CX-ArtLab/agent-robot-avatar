import { expect, test } from '@playwright/test';

test('loads the component and exposes its public controls', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/examples/basic.html');
  const avatar = page.locator('boop-face');

  await expect(avatar).toBeVisible();
  await expect(avatar).toHaveCSS('width', '140px');
  await expect.poll(() => avatar.evaluate(element => Boolean(element.shadowRoot?.querySelector('svg')))).toBe(true);

  const api = await avatar.evaluate(element => ({
    registered: customElements.get('boop-face') === element.constructor,
    play: typeof element.play,
    reset: typeof element.reset,
    pointerFollow: typeof element.setPointerFollow,
    roundness: typeof element.setHeadRoundness,
    waiting: typeof element.startWaiting,
    antennaFlash: typeof element.setAntennaFlash,
    demoGlobal: typeof window.BoopFaceDemoBuild,
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

test('keeps the old <agent-robot-avatar> tag and export working until 1.0', async ({ page }) => {
  const pageErrors = [];
  const warnings = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning') warnings.push(message.text()); });

  await page.goto('/examples/basic.html');
  const result = await page.evaluate(async () => {
    const module = await import('/boopface.js');
    const lite = await import('/boopface-lite.js');
    const first = document.createElement('agent-robot-avatar');
    const second = document.createElement('agent-robot-avatar');
    document.body.append(first, second);
    const states = [];
    first.addEventListener('face-state', event => states.push(event.detail.state));
    await first.play('input');
    return {
      oldExport: module.AgentRobotAvatar === module.BoopFace,
      liteOldExport: lite.AgentRobotAvatar === lite.BoopFace,
      isBoopFace: first instanceof module.BoopFace && second instanceof module.BoopFace,
      hasSvg: Boolean(first.shadowRoot?.querySelector('svg')),
      states,
      windowAlias: window.AgentRobotAvatar === window.BoopFace,
      versionAlias: window.AgentRobotAvatarVersion === window.BoopFaceVersion,
    };
  });

  expect(result).toEqual({
    oldExport: true,
    liteOldExport: true,
    isBoopFace: true,
    hasSvg: true,
    states: ['input'],
    windowAlias: true,
    versionAlias: true,
  });
  expect(warnings.filter(text => text.includes('<agent-robot-avatar>'))).toEqual([
    'boopface: <agent-robot-avatar> is now <boop-face>. The old tag stops working in 1.0.',
  ]);
  expect(pageErrors).toEqual([]);
});

test('constructs usable dynamic and direct instances', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/examples/basic.html');
  const result = await page.evaluate(async () => {
    const { BoopFace: Avatar } = await import('/boopface.js');
    const dynamic = document.createElement('boop-face');
    const direct = new Avatar();
    dynamic.id = 'dynamic-avatar';
    direct.id = 'direct-avatar';
    direct.setAttribute('size', '156');
    document.body.append(dynamic, direct);

    const states = [];
    dynamic.addEventListener('face-state', event => states.push(event.detail.state));
    await dynamic.play('input');

    return {
      exportMatchesRegistry: Avatar === customElements.get('boop-face'),
      instances: [dynamic, direct].map(element => ({
        registered: element instanceof Avatar,
        play: typeof element.play,
        hasSvg: Boolean(element.shadowRoot?.querySelector('svg')),
        size: element.getBoundingClientRect().width,
        states: element === dynamic ? states : [],
      })),
    };
  });

  expect(result.exportMatchesRegistry).toBe(true);
  expect(result.instances).toEqual([
    { registered: true, play: 'function', hasSvg: true, size: 112, states: ['input'] },
    { registered: true, play: 'function', hasSvg: true, size: 156, states: [] },
  ]);
  expect(pageErrors).toEqual([]);
});

test('changes state and returns to idle', async ({ page }) => {
  await page.goto('/examples/basic.html');
  const avatar = page.locator('boop-face');

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
  await expect(page.locator('boop-face')).toBeVisible();
  await expect(page.locator('[data-action="waiting-spin"]')).toBeVisible();
  await expect(page.locator('#agent-demo-build')).toHaveText('Demo 0.8.0');
  const versions = await page.evaluate(() => ({
    runtime: window.BoopFaceVersion,
    demo: window.BoopFaceDemoBuild,
  }));
  expect(versions).toEqual({ runtime: '0.8.0', demo: '0.8.0' });
  expect(pageErrors).toEqual([]);
});

test('demo follows the linked language and remembers a manual choice', async ({ page }) => {
  await page.goto('/demo/?lang=ja');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.locator('#demoLanguagePanelToggle')).toHaveAttribute('title', '言語');

  await page.locator('[data-lang="zh-TW"]').evaluate(button => button.click());
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
  await expect(page).toHaveURL(/lang=zh-TW/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('boopFaceDemoLanguage'))).toBe('zh-TW');

  await page.goto('/demo/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
});

test('demo falls back to the browser language', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ locale: 'fr-FR', baseURL });
  const page = await context.newPage();
  await page.goto('/demo/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await context.close();
});

test('looping waiting starts once and continues smoothly', async ({ page }) => {
  await page.goto('/demo/');
  // The input exists before the asynchronously loaded controls attach their
  // listeners. Programmatic events bypass the page's inert loading state.
  await expect(page.locator('html')).toHaveAttribute('data-demo-ready', 'true');
  await page.locator('#demoLoop').evaluate(input => {
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('[data-action="waiting-spin"]').click();

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
  const avatar = page.locator('boop-face');

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
  const avatar = page.locator('boop-face');

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
      'idle', 'bored', 'input', 'affirm', 'success', 'wary', 'refuse', 'angry',
      'surprise', 'sleep', 'wake',
      // Deprecated names still reach the same implementations.
      'send', 'warning', 'error', 'system-error', 'connection-error', 'blocked', 'policy-blocked',
    ]) {
      element._inputWanted = false;
      element._sleeping = action === 'wake';
      element._state = action === 'wake' ? 'sleep' : 'idle';
      element.play(action);
    }

    return calls;
  });

  expect(called).toEqual([
    'reset', 'bored', 'input', 'send', 'success', 'warning', 'error', 'angry',
    'surprise', 'sleep', 'wake',
    'send', 'warning', 'error', 'error', 'error', 'angry', 'angry',
  ]);
});

test('multiple avatars share one set of global listeners', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

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
  const created = await page.evaluate(() => {
    const first = document.createElement('boop-face');
    const second = document.createElement('boop-face');
    first.id = 'dynamic-first';
    second.id = 'dynamic-second';
    document.body.append(first, second);
    return [first, second].map(element => ({
      registered: element instanceof customElements.get('boop-face'),
      play: typeof element.play,
      hasSvg: Boolean(element.shadowRoot?.querySelector('svg')),
    }));
  });

  expect(created).toEqual([
    { registered: true, play: 'function', hasSvg: true },
    { registered: true, play: 'function', hasSvg: true },
  ]);

  const counts = await page.evaluate(() => window.__avatarListenerCounts);
  expect(counts).toEqual({
    pointermove: 1,
    pointerdown: 1,
    keydown: 1,
    pointerup: 1,
    pointercancel: 1,
    visibilitychange: 1,
  });

  await page.locator('#dynamic-first').evaluate(element => element.remove());
  const remainingStates = await page.locator('#dynamic-second').evaluate(async element => {
    const states = [];
    element.addEventListener('face-state', event => states.push(event.detail.state));
    await element.play('input');
    return states;
  });
  expect(remainingStates).toEqual(['input']);

  await page.evaluate(() => {
    document.querySelectorAll('boop-face').forEach(element => element.remove());
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
  expect(pageErrors).toEqual([]);
});

test('shared pointer handlers preserve jelly dragging', async ({ page }) => {
  await page.goto('/examples/basic.html');
  const avatar = page.locator('boop-face');
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
  const avatar = page.locator('boop-face');

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
