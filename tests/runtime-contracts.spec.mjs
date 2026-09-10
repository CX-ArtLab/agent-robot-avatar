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

async function loadWithClock(page, { reducedMotion = 'no-preference', motion = 'full' } = {}) {
  await page.emulateMedia({ reducedMotion });
  await page.clock.install();
  await page.goto('/examples/basic.html');
  await page.clock.pauseAt(await page.evaluate(() => Date.now()) + 1000);
  const avatar = page.locator('#avatar');
  if (motion) await avatar.evaluate((element, value) => element.setAttribute('motion', value), motion);
  return avatar;
}

async function advance(page, milliseconds) {
  await page.clock.runFor(milliseconds);
}

async function drag(page, avatar, dx, dy, { release = true } = {}) {
  const box = await avatar.boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy);
  await advance(page, 80);
  if (release) await page.mouse.up();
  return { x, y };
}

function lifecycle(detail) {
  return `${detail.action}:${detail.phase}:${detail.source}`;
}

test('reset while dragging cancels capture, deformation and delayed drag reaction', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await avatar.evaluate(element => {
    element._states = [];
    element.addEventListener('face-state', event => element._states.push(event.detail.state));
  });

  const point = await drag(page, avatar, 70, 12, { release: false });
  await avatar.evaluate(element => {
    element.reset();
    element._afterReset = element._states.length;
  });
  await page.mouse.move(point.x + 95, point.y + 25);
  await page.mouse.up();
  await advance(page, 2200);

  expect(await avatar.evaluate(element => ({
    active: element._dragJelly.active,
    returning: element._dragJelly.returning,
    pending: element._dragJelly.pendingReaction,
    pointerId: element._dragJelly.pointerId,
    transform: element._dragMotion.style.transform,
    shapeRestored: element._headShape.getAttribute('d') === element._baseHeadPathD,
    lateStates: element._states.slice(element._afterReset),
  }))).toEqual({
    active: false,
    returning: false,
    pending: null,
    pointerId: null,
    transform: '',
    shapeRestored: true,
    lateStates: [],
  });
});

test('reset during drag rebound discards the queued angry/success reaction', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await avatar.evaluate(element => {
    element._states = [];
    element.addEventListener('face-state', event => element._states.push(event.detail.state));
  });
  await drag(page, avatar, 75, 5);
  await avatar.evaluate(element => {
    element.reset();
    element._afterReset = element._states.length;
  });
  await advance(page, 2200);

  expect(await avatar.evaluate(element => ({
    returning: element._dragJelly.returning,
    pending: element._dragJelly.pendingReaction,
    lateStates: element._states.slice(element._afterReset),
  }))).toEqual({ returning: false, pending: null, lateStates: [] });
});

test('a new program action owns the avatar after a released drag', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await avatar.evaluate(element => {
    element._states = [];
    element.addEventListener('face-state', event => element._states.push(event.detail.state));
  });
  await drag(page, avatar, 75, 5);
  await avatar.evaluate(element => {
    element._programStart = element._states.length;
    element._programAction = element.play('inspect');
  });
  await advance(page, 700);

  const result = await avatar.evaluate(element => ({
    inspect: Boolean(element._inspectFx),
    dragReturning: element._dragJelly.returning,
    programStates: element._states.slice(element._programStart),
  }));
  expect(result.inspect).toBe(true);
  expect(result.dragReturning).toBe(false);
  expect(result.programStates).not.toContain('angry');
  expect(result.programStates).not.toContain('happy');
  await avatar.evaluate(element => element.reset());
});

test('continuous waiting suppresses drag expressions without replaying them later', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await avatar.evaluate(element => {
    element._states = [];
    element._actions = [];
    element.addEventListener('face-state', event => element._states.push(event.detail.state));
    element.addEventListener('action-state', event => element._actions.push(lifecycle(event.detail)));
    void element.startWaiting();
  });
  await advance(page, 220);
  await drag(page, avatar, 78, 7);
  await advance(page, 1200);

  const during = await avatar.evaluate(element => ({
    waiting: Boolean(element._waitingFx),
    requested: element._waitingRequested,
    state: element._state,
    badStates: element._states.filter(state => state === 'angry' || state === 'happy'),
    actions: element._actions,
  }));
  expect(during.waiting).toBe(true);
  expect(during.requested).toBe(true);
  expect(during.state).toBe('idle');
  expect(during.badStates).toEqual([]);
  expect(during.actions).toEqual(['waiting:start:api']);

  await avatar.evaluate(element => element.stopWaiting());
  await advance(page, 1600);
  expect(await avatar.evaluate(element => ({
    badStates: element._states.filter(state => state === 'angry' || state === 'happy'),
    actions: element._actions,
  }))).toEqual({ badStates: [], actions: ['waiting:start:api', 'waiting:end:api'] });
});

test('invalid wake and unknown actions do not tear down continuous waiting', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await avatar.evaluate(element => {
    element._actions = [];
    element.addEventListener('action-state', event => element._actions.push(lifecycle(event.detail)));
    void element.startWaiting();
  });
  await advance(page, 220);

  const noOp = await avatar.evaluate(element => ({
    wakeReturnedSelf: element.play('wake') === element,
    waitingAfterWake: Boolean(element._waitingFx),
    unknownError: (() => {
      try { element.play('not-a-real-action'); return null; }
      catch (error) { return error.message; }
    })(),
    waitingAfterUnknown: Boolean(element._waitingFx),
  }));
  expect(noOp.wakeReturnedSelf).toBe(true);
  expect(noOp.waitingAfterWake).toBe(true);
  expect(noOp.unknownError).toContain('Unknown Agent Robot Avatar action');
  expect(noOp.waitingAfterUnknown).toBe(true);

  await avatar.evaluate(element => element.stopWaiting());
  expect(await avatar.evaluate(element => element._actions)).toEqual([
    'waiting:start:api',
    'waiting:end:api',
  ]);
});

test('action-state reports one canonical lifecycle for replacement, stop and aliases', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await avatar.evaluate(element => {
    element._actions = [];
    element.addEventListener('action-state', event => element._actions.push(lifecycle(event.detail)));
    void element.startWaiting();
  });
  await advance(page, 220);
  await avatar.evaluate(element => { element._success = element.play('success'); });
  await advance(page, 2400);

  expect(await avatar.evaluate(element => element._actions)).toEqual([
    'waiting:start:api',
    'waiting:cancel:api',
    'success:start:api',
    'success:end:api',
  ]);

  await avatar.evaluate(element => {
    element._actions.length = 0;
    element._failure = element.play('failed');
  });
  await advance(page, 3300);
  expect(await avatar.evaluate(element => element._actions)).toEqual([
    'failure:start:api',
    'failure:end:api',
  ]);

  await avatar.evaluate(element => {
    element._actions.length = 0;
    element._inspect = element.play('review');
  });
  await advance(page, 7000);
  expect(await avatar.evaluate(element => element._actions)).toEqual([
    'inspect:start:api',
    'inspect:end:api',
  ]);
});

test('reset cancels semantic action once and duplicate input is a no-op', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await avatar.evaluate(element => {
    element._actions = [];
    element.addEventListener('action-state', event => element._actions.push(lifecycle(event.detail)));
    void element.play('input');
  });
  await advance(page, 80);
  await avatar.evaluate(element => { void element.play('input'); });
  await advance(page, 400);
  expect(await avatar.evaluate(element => element._actions)).toEqual(['input:start:api']);

  await avatar.evaluate(element => element.reset());
  expect(await avatar.evaluate(element => element._actions)).toEqual([
    'input:start:api',
    'input:cancel:api',
  ]);
});

test('action-state bubbles across the custom element boundary', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await page.evaluate(() => {
    window.bubbledActionStates = [];
    document.addEventListener('action-state', event => {
      window.bubbledActionStates.push({
        target: event.target.id,
        bubbles: event.bubbles,
        composed: event.composed,
        detail: lifecycle(event.detail),
      });
    }, { once: true });
  });
  await avatar.evaluate(element => { void element.play('success'); });
  expect(await page.evaluate(() => window.bubbledActionStates)).toEqual([{
    target: 'avatar',
    bubbles: true,
    composed: true,
    detail: 'success:start:api',
  }]);
});

test('wake-on manual ignores page and avatar interaction but explicit wake still works', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await avatar.evaluate(element => {
    element.setAttribute('wake-on', 'manual');
    element._actions = [];
    element.addEventListener('action-state', event => element._actions.push(lifecycle(event.detail)));
    element._sleep = element.play('sleep');
  });
  await advance(page, 3000);
  await expect(avatar).toHaveJSProperty('_state', 'sleep');

  await page.mouse.click(10, 10);
  const box = await avatar.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.keyboard.press('A');
  await advance(page, 400);
  await expect(avatar).toHaveJSProperty('_state', 'sleep');

  await avatar.evaluate(element => { element._wake = element.play('wake'); });
  await advance(page, 1000);
  await expect(avatar).toHaveJSProperty('_state', 'idle');
  expect(await avatar.evaluate(element => element._actions.slice(-2))).toEqual([
    'wake:start:api',
    'wake:end:api',
  ]);
});

test('wake-on interaction wakes only the directly interacted avatar', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await avatar.evaluate(element => {
    element.setAttribute('wake-on', 'interaction');
    element._actions = [];
    element.addEventListener('action-state', event => element._actions.push(lifecycle(event.detail)));
    void element.play('sleep');
  });
  await advance(page, 3000);
  await page.mouse.click(10, 10);
  await advance(page, 300);
  await expect(avatar).toHaveJSProperty('_state', 'sleep');

  const box = await avatar.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await advance(page, 1000);
  await expect(avatar).toHaveJSProperty('_state', 'idle');
  expect(await avatar.evaluate(element => element._actions.slice(-2))).toEqual([
    'wake:start:automatic',
    'wake:end:automatic',
  ]);
});

test('default activity policy remains backward compatible', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await avatar.evaluate(element => {
    element._actions = [];
    element.addEventListener('action-state', event => element._actions.push(lifecycle(event.detail)));
    void element.play('sleep');
  });
  await advance(page, 3000);
  await page.mouse.click(10, 10);
  await advance(page, 1000);
  await expect(avatar).toHaveJSProperty('_state', 'idle');
  expect(await avatar.evaluate(element => element._actions.slice(-2))).toEqual([
    'wake:start:automatic',
    'wake:end:automatic',
  ]);
});

test('size accepts numeric pixels and px strings and rejects unsupported input deterministically', async ({ page }) => {
  const avatar = await loadWithClock(page);
  const cases = [
    ['140', 140],
    ['140px', 140],
    ['96.5px', 96.5],
    ['140em', 112],
    ['140abc', 112],
    ['0', 112],
    ['-20', 112],
    ['Infinity', 112],
  ];

  for (const [value, expected] of cases) {
    await avatar.evaluate((element, next) => element.setAttribute('size', next), value);
    await expect.poll(() => avatar.evaluate(element => element.getBoundingClientRect().width)).toBeCloseTo(expected, 1);
  }

  await avatar.evaluate(element => element.setAttribute('size', '160px'));
  await drag(page, avatar, 45, 8, { release: false });
  const coordinates = await avatar.evaluate(element => ({
    hotX: element._dragJelly.hotX,
    hotY: element._dragJelly.hotY,
    targetX: element._dragJelly.targetX,
    targetY: element._dragJelly.targetY,
  }));
  expect(Object.values(coordinates).every(Number.isFinite)).toBe(true);
  await avatar.evaluate(element => element.reset());
  await page.mouse.up();
});

test('prefers-reduced-motion keeps continuous waiting semantic state while stabilizing visuals', async ({ page }) => {
  const avatar = await loadWithClock(page, { reducedMotion: 'reduce', motion: null });
  await avatar.evaluate(element => {
    element._actions = [];
    element.addEventListener('action-state', event => element._actions.push(lifecycle(event.detail)));
    void element.startWaiting();
  });
  await advance(page, 240);
  await advance(page, 100);
  const first = await avatar.evaluate(element => ({
    left: element._leftEye.getAttribute('transform'),
    right: element._rightEye.getAttribute('transform'),
    waiting: Boolean(element._waitingFx),
    reduced: element._isReducedMotion(),
  }));
  await advance(page, 1200);
  const second = await avatar.evaluate(element => ({
    left: element._leftEye.getAttribute('transform'),
    right: element._rightEye.getAttribute('transform'),
    waiting: Boolean(element._waitingFx),
    reduced: element._isReducedMotion(),
    actions: element._actions,
  }));

  expect(first.reduced).toBe(true);
  expect(first.waiting).toBe(true);
  expect(second.waiting).toBe(true);
  expect(second.left).toBe(first.left);
  expect(second.right).toBe(first.right);
  expect(second.actions).toEqual(['waiting:start:api']);
  await avatar.evaluate(element => element.stopWaiting());
  expect(await avatar.evaluate(element => element._actions)).toEqual([
    'waiting:start:api',
    'waiting:end:api',
  ]);
});

test('motion full overrides the system reduce preference', async ({ page }) => {
  const avatar = await loadWithClock(page, { reducedMotion: 'reduce', motion: 'full' });
  expect(await avatar.evaluate(element => element._isReducedMotion())).toBe(false);
});

test('switching to reduced motion during an action cancels motion but not its lifecycle', async ({ page }) => {
  const avatar = await loadWithClock(page, { reducedMotion: 'no-preference', motion: null });
  await avatar.evaluate(element => {
    element._actions = [];
    element.addEventListener('action-state', event => element._actions.push(lifecycle(event.detail)));
    element._success = element.play('success');
  });
  await advance(page, 700);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await advance(page, 50);
  expect(await avatar.evaluate(element => element._headMotion.getAnimations()
    .some(animation => animation.playState === 'running' || animation.playState === 'pending'))).toBe(false);
  await advance(page, 2200);
  expect(await avatar.evaluate(element => element._actions)).toEqual([
    'success:start:api',
    'success:end:api',
  ]);
});

test('pointer moves are coalesced to at most one update per rendered frame', async ({ page }) => {
  await page.goto('/examples/basic.html');
  const avatar = page.locator('#avatar');
  await avatar.evaluate(element => {
    element.setAttribute('motion', 'full');
    element._runtimePointerFlushCount = 0;
  });
  await page.evaluate(() => {
    for (let index = 0; index < 100; index += 1) {
      window.dispatchEvent(new PointerEvent('pointermove', {
        clientX: 20 + index,
        clientY: 30 + index,
        pointerId: 1,
        bubbles: true,
      }));
    }
  });
  await page.waitForTimeout(80);
  const flushes = await avatar.evaluate(element => element._runtimePointerFlushCount);
  expect(flushes).toBeGreaterThan(0);
  expect(flushes).toBeLessThanOrEqual(2);
});

test('hidden and offscreen avatars stop sustained drawing and resume when visible', async ({ page }) => {
  await page.goto('/examples/basic.html');
  const avatar = page.locator('#avatar');
  await avatar.evaluate(element => {
    const original = element._draw.bind(element);
    element._runtimeDrawCount = 0;
    element._draw = now => {
      element._runtimeDrawCount += 1;
      return original(now);
    };
  });
  await page.waitForTimeout(180);
  expect(await avatar.evaluate(element => element._runtimeDrawCount)).toBeGreaterThan(1);

  await avatar.evaluate(element => {
    element.style.display = 'none';
    element._runtimeDrawCount = 0;
  });
  await page.waitForTimeout(180);
  await avatar.evaluate(element => { element._runtimeDrawCount = 0; });
  await page.waitForTimeout(220);
  expect(await avatar.evaluate(element => element._runtimeDrawCount)).toBeLessThanOrEqual(1);

  await avatar.evaluate(element => { element.style.display = ''; element._runtimeDrawCount = 0; });
  await page.waitForTimeout(220);
  expect(await avatar.evaluate(element => element._runtimeDrawCount)).toBeGreaterThan(1);

  await avatar.evaluate(element => {
    element.style.position = 'fixed';
    element.style.left = '0';
    element.style.top = '5000px';
    element._runtimeDrawCount = 0;
  });
  await page.waitForTimeout(180);
  await avatar.evaluate(element => { element._runtimeDrawCount = 0; });
  await page.waitForTimeout(220);
  expect(await avatar.evaluate(element => element._runtimeDrawCount)).toBeLessThanOrEqual(1);
});

test('inspect preload configuration is preserved, normalized and remains mutable', async ({ page }) => {
  await page.addInitScript(() => {
    window.AgentRobotAvatarInspectConfig = {
      aperture: 24,
      scanOffset: 999,
      prepPause: '80',
      close: Number.NaN,
    };
  });
  await page.goto('/examples/basic.html');
  const initial = await page.evaluate(() => ({ ...window.AgentRobotAvatarInspectConfig }));
  expect(initial.aperture).toBe(24);
  expect(initial.scanOffset).toBe(24);
  expect(initial.prepPause).toBe(80);
  expect(initial.close).toBe(220);

  const avatar = page.locator('#avatar');
  await page.evaluate(() => {
    window.AgentRobotAvatarInspectConfig.aperture = 35;
    window.AgentRobotAvatarInspectConfig.scanOffset = -10;
  });
  await avatar.evaluate(element => { void element.play('inspect'); });
  await page.waitForTimeout(400);
  expect(await avatar.evaluate(element => ({
    aperture: element._inspectFx?.config.aperture,
    scanOffset: element._inspectFx?.config.scanOffset,
    finite: element._inspectFx ? Object.values(element._inspectFx.config).every(Number.isFinite) : false,
  }))).toEqual({ aperture: 35, scanOffset: 0, finite: true });
  await avatar.evaluate(element => element.reset());
});

test('normal repeated module import is idempotent', async ({ page }) => {
  await page.goto('/examples/basic.html');
  const result = await page.evaluate(async () => {
    const first = await import('/agent-robot-avatar.js');
    const second = await import('/agent-robot-avatar.js');
    return {
      sameClass: first.AgentRobotAvatar === second.AgentRobotAvatar,
      registered: customElements.get('agent-robot-avatar') === first.AgentRobotAvatar,
    };
  });
  expect(result).toEqual({ sameClass: true, registered: true });
});

test('trusted Chromium touch cancellation restores the avatar without a reaction', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'CDP trusted touch simulation is Chromium-specific.');
  await page.goto('/examples/basic.html');
  const avatar = page.locator('#avatar');
  await avatar.evaluate(element => {
    element.setAttribute('motion', 'reduce');
    element._actions = [];
    element.addEventListener('action-state', event => element._actions.push(lifecycle(event.detail)));
  });
  await expect.poll(() => avatar.evaluate(element => getComputedStyle(element).touchAction)).toBe('pinch-zoom');

  const box = await avatar.boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const client = await page.context().newCDPSession(page);
  await client.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  const point = (px, py) => ({ x: px, y: py, radiusX: 1, radiusY: 1, force: 1, id: 1 });
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(x, y)] });
  await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point(x + 70, y + 8)] });
  await page.waitForTimeout(80);
  await client.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await page.waitForTimeout(120);

  expect(await avatar.evaluate(element => ({
    active: element._dragJelly.active,
    returning: element._dragJelly.returning,
    pending: element._dragJelly.pendingReaction,
    transform: element._dragMotion.style.transform,
    actionEvents: element._actions,
  }))).toEqual({ active: false, returning: false, pending: null, transform: '', actionEvents: [] });
});
