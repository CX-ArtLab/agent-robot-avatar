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

async function installRecorders(avatar) {
  await avatar.evaluate(element => {
    element._testFaceStates = [];
    element._testActionStates = [];
    element.addEventListener('face-state', event => element._testFaceStates.push(event.detail.state));
    element.addEventListener('action-state', event => {
      const { action, phase, source } = event.detail;
      element._testActionStates.push(`${action}:${phase}:${source}`);
    });
  });
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

test('reset while dragging clears capture, geometry and delayed reaction', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await installRecorders(avatar);
  const point = await drag(page, avatar, 70, 12, { release: false });
  await avatar.evaluate(element => {
    element.reset();
    element._testResetFaceIndex = element._testFaceStates.length;
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
    lateFace: element._testFaceStates.slice(element._testResetFaceIndex),
  }))).toEqual({
    active: false,
    returning: false,
    pending: null,
    pointerId: null,
    transform: '',
    shapeRestored: true,
    lateFace: [],
  });
});

test('reset during rebound discards queued drag reaction', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await installRecorders(avatar);
  await drag(page, avatar, 78, 9);
  await advance(page, 30);
  await avatar.evaluate(element => {
    element.reset();
    element._testResetFaceIndex = element._testFaceStates.length;
  });
  await advance(page, 2200);
  expect(await avatar.evaluate(element => ({
    dragBusy: element._dragJelly.active || element._dragJelly.returning,
    pending: element._dragJelly.pendingReaction,
    late: element._testFaceStates.slice(element._testResetFaceIndex),
  }))).toEqual({ dragBusy: false, pending: null, late: [] });
});

test('new program action owns the avatar after a drag', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await installRecorders(avatar);
  await drag(page, avatar, 76, 8);
  await avatar.evaluate(element => { element._testProgram = element.play('input'); });
  await advance(page, 1800);
  expect(await avatar.evaluate(element => ({
    state: element._state,
    wanted: element._inputWanted,
    lateDrag: element._testFaceStates.filter(state => state === 'angry' || state === 'happy'),
    actions: element._testActionStates,
  }))).toEqual({
    state: 'input',
    wanted: true,
    lateDrag: [],
    actions: ['input:start:api'],
  });
  await avatar.evaluate(element => element.reset());
});

test('continuous waiting suppresses drag expressions and never replays them', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await installRecorders(avatar);
  await avatar.evaluate(element => { void element.startWaiting(); });
  await advance(page, 240);
  await drag(page, avatar, 78, 7);
  await advance(page, 1400);

  expect(await avatar.evaluate(element => ({
    waiting: Boolean(element._waitingFx),
    requested: element._waitingRequested,
    badFace: element._testFaceStates.filter(state => state === 'angry' || state === 'happy'),
    actions: element._testActionStates,
  }))).toEqual({
    waiting: true,
    requested: true,
    badFace: [],
    actions: ['waiting:start:api'],
  });

  await avatar.evaluate(element => element.stopWaiting());
  await advance(page, 1400);
  expect(await avatar.evaluate(element => ({
    badFace: element._testFaceStates.filter(state => state === 'angry' || state === 'happy'),
    actions: element._testActionStates,
  }))).toEqual({
    badFace: [],
    actions: ['waiting:start:api', 'waiting:end:api'],
  });
});

test('invalid wake and unknown action preserve continuous waiting', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await installRecorders(avatar);
  await avatar.evaluate(element => { void element.startWaiting(); });
  await advance(page, 240);

  const result = await avatar.evaluate(element => {
    let unknown = '';
    const wakeReturnedSelf = element.play('wake') === element;
    try { element.play('not-a-real-action'); } catch (error) { unknown = error.message; }
    return {
      wakeReturnedSelf,
      unknown,
      waiting: Boolean(element._waitingFx),
      requested: element._waitingRequested,
    };
  });
  expect(result.wakeReturnedSelf).toBe(true);
  expect(result.unknown).toContain('Unknown Agent Robot Avatar action');
  expect(result.waiting).toBe(true);
  expect(result.requested).toBe(true);

  await avatar.evaluate(element => element.stopWaiting());
  expect(await avatar.evaluate(element => element._testActionStates)).toEqual([
    'waiting:start:api',
    'waiting:end:api',
  ]);
});

test('action-state canonical lifecycle covers replacement, aliases, stop and reset', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await installRecorders(avatar);

  await avatar.evaluate(element => { void element.startWaiting(); });
  await advance(page, 240);
  await avatar.evaluate(element => { element._testSuccess = element.play('success'); });
  await advance(page, 2600);
  expect(await avatar.evaluate(element => element._testActionStates)).toEqual([
    'waiting:start:api',
    'waiting:cancel:api',
    'success:start:api',
    'success:end:api',
  ]);

  await avatar.evaluate(element => {
    element._testActionStates.length = 0;
    element._testFailure = element.play('failed');
  });
  await advance(page, 3600);
  expect(await avatar.evaluate(element => element._testActionStates)).toEqual([
    'failure:start:api',
    'failure:end:api',
  ]);

  await avatar.evaluate(element => {
    element._testActionStates.length = 0;
    element._testInspect = element.play('review');
  });
  await advance(page, 8000);
  expect(await avatar.evaluate(element => element._testActionStates)).toEqual([
    'inspect:start:api',
    'inspect:end:api',
  ]);

  await avatar.evaluate(element => {
    element._testActionStates.length = 0;
    void element.play('input');
  });
  await advance(page, 80);
  await avatar.evaluate(element => { void element.play('input'); });
  expect(await avatar.evaluate(element => element._testActionStates)).toEqual(['input:start:api']);
  await avatar.evaluate(element => element.reset());
  expect(await avatar.evaluate(element => element._testActionStates)).toEqual([
    'input:start:api',
    'input:cancel:api',
  ]);
});

test('action-state bubbles and crosses the custom element boundary', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await page.evaluate(() => {
    window.bubbledActionStates = [];
    document.addEventListener('action-state', event => {
      const { action, phase, source } = event.detail;
      window.bubbledActionStates.push({
        target: event.target.id,
        bubbles: event.bubbles,
        composed: event.composed,
        detail: `${action}:${phase}:${source}`,
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

test('wake-on manual ignores environment activity but explicit wake works', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await installRecorders(avatar);
  await avatar.evaluate(element => {
    element.setAttribute('wake-on', 'manual');
    element._testSleep = element.play('sleep');
  });
  await advance(page, 3000);
  await expect(avatar).toHaveJSProperty('_state', 'sleep');

  await page.mouse.click(10, 10);
  const box = await avatar.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.keyboard.press('A');
  await advance(page, 500);
  await expect(avatar).toHaveJSProperty('_state', 'sleep');

  await avatar.evaluate(element => { element._testWake = element.play('wake'); });
  await advance(page, 1200);
  await expect(avatar).toHaveJSProperty('_state', 'idle');
  expect(await avatar.evaluate(element => element._testActionStates.slice(-2))).toEqual([
    'wake:start:api',
    'wake:end:api',
  ]);
});

test('wake-on interaction ignores outside activity and wakes on avatar interaction', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await installRecorders(avatar);
  await avatar.evaluate(element => {
    element.setAttribute('wake-on', 'interaction');
    void element.play('sleep');
  });
  await advance(page, 3000);
  await page.mouse.click(10, 10);
  await page.keyboard.press('A');
  await advance(page, 400);
  await expect(avatar).toHaveJSProperty('_state', 'sleep');

  const box = await avatar.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await advance(page, 1200);
  await expect(avatar).toHaveJSProperty('_state', 'idle');
  expect(await avatar.evaluate(element => element._testActionStates.slice(-2))).toEqual([
    'wake:start:automatic',
    'wake:end:automatic',
  ]);
});

test('default activity wake policy remains backward compatible', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await installRecorders(avatar);
  await avatar.evaluate(element => { void element.play('sleep'); });
  await advance(page, 3000);
  await page.mouse.click(10, 10);
  await advance(page, 1200);
  await expect(avatar).toHaveJSProperty('_state', 'idle');
  expect(await avatar.evaluate(element => element._testActionStates.slice(-2))).toEqual([
    'wake:start:automatic',
    'wake:end:automatic',
  ]);
});

test('explicit noteActivity remains an intentional wake in manual mode', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await avatar.evaluate(element => {
    element.setAttribute('wake-on', 'manual');
    void element.play('sleep');
  });
  await advance(page, 3000);
  await avatar.evaluate(element => element.noteActivity());
  await advance(page, 1200);
  await expect(avatar).toHaveJSProperty('_state', 'idle');
});

test('size accepts numeric pixels and px strings and rejects other input', async ({ page }) => {
  const avatar = await loadWithClock(page);
  const cases = [
    ['140', 140], ['140px', 140], ['96.5px', 96.5],
    ['140em', 112], ['140abc', 112], ['0', 112],
    ['-20', 112], ['Infinity', 112],
  ];
  for (const [value, expected] of cases) {
    await avatar.evaluate((element, next) => element.setAttribute('size', next), value);
    await expect.poll(() => avatar.evaluate(element => element.getBoundingClientRect().width)).toBeCloseTo(expected, 1);
  }

  await avatar.evaluate(element => element.setAttribute('size', '160px'));
  await drag(page, avatar, 45, 8, { release: false });
  const finite = await avatar.evaluate(element => [
    element._dragJelly.hotX,
    element._dragJelly.hotY,
    element._dragJelly.targetX,
    element._dragJelly.targetY,
  ].every(Number.isFinite));
  expect(finite).toBe(true);
  await avatar.evaluate(element => element.reset());
  await page.mouse.up();
});

test('inspect preload config preserves valid values and normalizes invalid values', async ({ page }) => {
  await page.addInitScript(() => {
    window.AgentRobotAvatarInspectConfig = {
      aperture: 24,
      scanOffset: '18',
      close: 'not-a-number',
      holdClosed: -50,
      open: 99999,
    };
  });
  await page.clock.install();
  await page.goto('/examples/basic.html');
  await page.clock.pauseAt(await page.evaluate(() => Date.now()) + 1000);
  const avatar = page.locator('#avatar');
  expect(await page.evaluate(() => ({ ...window.AgentRobotAvatarInspectConfig }))).toMatchObject({
    aperture: 24,
    scanOffset: 18,
    close: 220,
    holdClosed: 0,
    open: 2400,
  });
  await avatar.evaluate(element => { void element.play('inspect'); });
  await advance(page, 400);
  expect(await avatar.evaluate(element => {
    const config = element._inspectFx?.config;
    return config ? Object.values(config).every(Number.isFinite) : true;
  })).toBe(true);
});

test('prefers-reduced-motion keeps waiting lifecycle while visuals stay stable', async ({ page }) => {
  const avatar = await loadWithClock(page, { reducedMotion: 'reduce', motion: null });
  await installRecorders(avatar);
  await avatar.evaluate(element => { void element.startWaiting(); });
  await advance(page, 350);
  const first = await avatar.evaluate(element => ({
    left: element._leftEye.getAttribute('transform'),
    right: element._rightEye.getAttribute('transform'),
    waiting: Boolean(element._waitingFx),
    reduced: element._isReducedMotion(),
  }));
  await advance(page, 1300);
  const second = await avatar.evaluate(element => ({
    left: element._leftEye.getAttribute('transform'),
    right: element._rightEye.getAttribute('transform'),
    waiting: Boolean(element._waitingFx),
    actions: element._testActionStates,
  }));
  expect(first.reduced).toBe(true);
  expect(first.waiting).toBe(true);
  expect(second.waiting).toBe(true);
  expect(second.left).toBe(first.left);
  expect(second.right).toBe(first.right);
  expect(second.actions).toEqual(['waiting:start:api']);
  await avatar.evaluate(element => element.stopWaiting());
  expect(await avatar.evaluate(element => element._testActionStates)).toEqual([
    'waiting:start:api', 'waiting:end:api',
  ]);
});

test('motion full overrides system reduced-motion and runtime preference changes settle motion', async ({ page }) => {
  const full = await loadWithClock(page, { reducedMotion: 'reduce', motion: 'full' });
  expect(await full.evaluate(element => element._isReducedMotion())).toBe(false);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await full.evaluate(element => {
    element.removeAttribute('motion');
    element._testActionStates = [];
    element.addEventListener('action-state', event => {
      const { action, phase, source } = event.detail;
      element._testActionStates.push(`${action}:${phase}:${source}`);
    });
    element._testSuccess = element.play('success');
  });
  await advance(page, 700);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await advance(page, 80);
  expect(await full.evaluate(element => element._headMotion.getAnimations()
    .some(animation => animation.playState === 'running' || animation.playState === 'pending'))).toBe(false);
  await advance(page, 2400);
  expect(await full.evaluate(element => element._testActionStates)).toEqual([
    'success:start:api', 'success:end:api',
  ]);
});

test('pointercancel restores touch drag without reaction or lock residue', async ({ page }) => {
  const avatar = await loadWithClock(page);
  await installRecorders(avatar);
  const box = await avatar.boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await avatar.dispatchEvent('pointerdown', {
    pointerId: 41, pointerType: 'touch', isPrimary: true, button: 0,
    clientX: x, clientY: y, bubbles: true,
  });
  await page.evaluate(({ x, y }) => {
    window.dispatchEvent(new PointerEvent('pointermove', {
      pointerId: 41, pointerType: 'touch', isPrimary: true,
      clientX: x + 80, clientY: y + 8, bubbles: true,
    }));
  }, { x, y });
  await advance(page, 80);
  await page.evaluate(({ x, y }) => {
    window.dispatchEvent(new PointerEvent('pointercancel', {
      pointerId: 41, pointerType: 'touch', isPrimary: true,
      clientX: x + 80, clientY: y + 8, bubbles: true,
    }));
  }, { x, y });
  await advance(page, 1000);
  expect(await avatar.evaluate(element => ({
    active: element._dragJelly.active,
    returning: element._dragJelly.returning,
    pending: element._dragJelly.pendingReaction,
    transform: element._dragMotion.style.transform,
    reactions: element._testActionStates.filter(value => value.startsWith('reaction:')),
  }))).toEqual({ active: false, returning: false, pending: null, transform: '', reactions: [] });
});

test('Chromium trusted touch cancellation produces pointercancel and clean recovery', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'CDP trusted touch injection is Chromium-specific; WebKit/Firefox run the portable pointer-cancel contract above.');
  await page.goto('/examples/basic.html');
  const avatar = page.locator('#avatar');
  const box = await avatar.boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await avatar.evaluate(element => {
    element._trustedTouchEvents = [];
    for (const type of ['pointerdown', 'pointermove', 'pointercancel']) {
      element.addEventListener(type, event => element._trustedTouchEvents.push({ type, trusted: event.isTrusted, pointerType: event.pointerType }));
    }
  });
  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 2 });
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart', touchPoints: [{ x, y, radiusX: 2, radiusY: 2, force: 1, id: 1 }],
  });
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove', touchPoints: [{ x: x + 70, y: y + 10, radiusX: 2, radiusY: 2, force: 1, id: 1 }],
  });
  await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await page.waitForTimeout(250);
  const result = await avatar.evaluate(element => ({
    events: element._trustedTouchEvents,
    active: element._dragJelly.active,
    returning: element._dragJelly.returning,
    pending: element._dragJelly.pendingReaction,
  }));
  expect(result.events.some(event => event.type === 'pointerdown' && event.trusted && event.pointerType === 'touch')).toBe(true);
  expect(result.events.some(event => event.type === 'pointercancel' && event.trusted && event.pointerType === 'touch')).toBe(true);
  expect({ active: result.active, returning: result.returning, pending: result.pending }).toEqual({ active: false, returning: false, pending: null });
});

test('hidden and offscreen avatars suspend sustained drawing and resume current state', async ({ page }, testInfo) => {
  await page.goto('/examples/basic.html');
  const avatar = page.locator('#avatar');
  await avatar.evaluate(element => {
    element._testDrawCount = 0;
    const draw = element._draw.bind(element);
    element._draw = now => { element._testDrawCount += 1; return draw(now); };
    void element.startWaiting();
  });
  await page.waitForTimeout(250);

  await avatar.evaluate(element => { element.style.display = 'none'; });
  await page.waitForFunction(() => document.querySelector('#avatar')._runtimeVisible === false);
  const hiddenStart = await avatar.evaluate(element => element._testDrawCount);
  await page.waitForTimeout(600);
  const hiddenEnd = await avatar.evaluate(element => element._testDrawCount);

  await avatar.evaluate(element => {
    element.style.display = '';
    element.style.position = 'absolute';
    element.style.top = '5000px';
  });
  await page.waitForFunction(() => document.querySelector('#avatar')._runtimeVisible === false);
  const offscreenStart = await avatar.evaluate(element => element._testDrawCount);
  await page.waitForTimeout(600);
  const offscreenEnd = await avatar.evaluate(element => element._testDrawCount);

  await avatar.evaluate(element => {
    element.style.position = '';
    element.style.top = '';
  });
  await page.waitForFunction(() => document.querySelector('#avatar')._runtimeVisible === true);
  await page.waitForTimeout(180);
  const resumed = await avatar.evaluate(element => ({ waiting: Boolean(element._waitingFx), draws: element._testDrawCount }));

  console.log(`[perf:${testInfo.project.name}] hidden_draws_600ms=${hiddenEnd - hiddenStart} offscreen_draws_600ms=${offscreenEnd - offscreenStart} resumed_waiting=${resumed.waiting}`);
  expect(hiddenEnd - hiddenStart).toBeLessThanOrEqual(1);
  expect(offscreenEnd - offscreenStart).toBeLessThanOrEqual(1);
  expect(resumed.waiting).toBe(true);
});

test('high-frequency pointer work is coalesced per frame for one and multiple instances', async ({ page }, testInfo) => {
  await page.goto('/examples/basic.html');
  const avatar = page.locator('#avatar');
  await avatar.evaluate(element => { element._runtimePointerFlushCount = 0; });
  await page.evaluate(() => {
    for (let index = 0; index < 100; index += 1) {
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 30 + index, clientY: 40 + index, pointerId: 1 }));
    }
  });
  await page.waitForTimeout(20);
  const single = await avatar.evaluate(element => element._runtimePointerFlushCount);

  await page.evaluate(() => {
    for (let index = 0; index < 3; index += 1) {
      const extra = document.createElement('agent-robot-avatar');
      extra.className = 'perf-extra';
      document.body.append(extra);
      extra._runtimePointerFlushCount = 0;
    }
    document.querySelector('#avatar')._runtimePointerFlushCount = 0;
    for (let index = 0; index < 100; index += 1) {
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 60 + index, clientY: 80 + index, pointerId: 2 }));
    }
  });
  await page.waitForTimeout(20);
  const multi = await page.evaluate(() => [document.querySelector('#avatar'), ...document.querySelectorAll('.perf-extra')]
    .map(element => element._runtimePointerFlushCount || 0));
  console.log(`[perf:${testInfo.project.name}] pointer_events=100 single_flushes=${single} four_instance_flushes=${multi.join(',')}`);
  expect(single).toBeLessThanOrEqual(1);
  expect(multi.every(count => count <= 1)).toBe(true);
});

test('normal repeated ESM imports remain safe without hiding extension conflicts', async ({ page }) => {
  await page.goto('/examples/basic.html');
  const result = await page.evaluate(async () => {
    const first = await import('/agent-robot-avatar.js?repeat=1');
    const second = await import('/agent-robot-avatar.js?repeat=2');
    return {
      sameConstructor: first.AgentRobotAvatar === second.AgentRobotAvatar,
      registered: customElements.get('agent-robot-avatar') === first.AgentRobotAvatar,
    };
  });
  expect(result).toEqual({ sameConstructor: true, registered: true });
});
