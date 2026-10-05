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

async function loadAvatar(page, { reducedMotion } = {}) {
  if (reducedMotion) await page.emulateMedia({ reducedMotion });
  await page.clock.install();
  await page.goto('/examples/basic.html');
  await page.clock.pauseAt(await page.evaluate(() => Date.now()) + 1000);
  const avatar = page.locator('#avatar');
  await avatar.evaluate(element => {
    element._actions = [];
    element._states = [];
    element.addEventListener('action-state', event => {
      const { action, phase, source } = event.detail;
      element._actions.push(`${action}:${phase}:${source}`);
    });
    element.addEventListener('face-state', event => element._states.push(event.detail.state));
  });
  return avatar;
}

const advance = (page, milliseconds) => page.clock.runFor(milliseconds);

// Left / right eye rotation (degrees) parsed from the eye group transform.
const eyeTilts = avatar => avatar.evaluate(element => {
  const tilt = eye => Number(/rotate\((-?[\d.]+)\)/.exec(eye.getAttribute('transform'))?.[1]);
  return { left: tilt(element._leftEye), right: tilt(element._rightEye) };
});

test('love plays one lifecycle and returns to ordinary eyes', async ({ page }) => {
  const avatar = await loadAvatar(page);

  await avatar.evaluate(element => { element._task = element.play('love'); });
  await advance(page, 600);
  expect(await avatar.evaluate(element => Boolean(element._loveFx))).toBe(true);

  await advance(page, 3500);
  const result = await avatar.evaluate(async element => {
    await element._task;
    return {
      actions: element._actions,
      states: element._states,
      state: element._state,
      fx: element._loveFx,
      leftTransform: element._leftEye.getAttribute('transform'),
      baseOpacity: element._leftBase.getAttribute('opacity'),
    };
  });
  expect(result.actions).toEqual(['love:start:api', 'love:end:api']);
  // The action begins with reset(), which reports idle once before love starts.
  expect(result.states.filter(state => state === 'love')).toEqual(['love']);
  expect(result.states.at(-1)).toBe('idle');
  expect(result.state).toBe('idle');
  expect(result.fx).toBeNull();
  expect(result.leftTransform).not.toContain('rotate');
  expect(result.baseOpacity).toBe('1.000');
});

test('love merges the eyes into mirrored, inward-leaning ovals with the lids cleared', async ({ page }) => {
  const avatar = await loadAvatar(page);

  await avatar.evaluate(element => { void element.play('love'); });
  await advance(page, 1200);

  const tilts = await eyeTilts(avatar);
  expect(tilts.left).toBeLessThan(0);
  expect(tilts.right).toBeGreaterThan(0);
  expect(tilts.left).toBeCloseTo(-tilts.right, 1);

  const shape = await avatar.evaluate(element => ({
    rx: [element._leftBase.getAttribute('rx'), element._rightBase.getAttribute('rx')],
    ry: [element._leftBase.getAttribute('ry'), element._rightBase.getAttribute('ry')],
    lidsClear: [element._leftTop, element._rightTop].every(lid => Number(lid.getAttribute('y')) < -200)
      && [element._leftBottom, element._rightBottom].every(lid => Number(lid.getAttribute('y')) > 100),
  }));
  expect(shape.rx[0]).toBe(shape.rx[1]);
  expect(shape.ry[0]).toBe(shape.ry[1]);
  expect(shape.lidsClear).toBe(true);
});

test('reset cancels love and restores the eyes without a late idle event', async ({ page }) => {
  const avatar = await loadAvatar(page);

  await avatar.evaluate(element => { element._task = element.play('love'); });
  await advance(page, 1000);
  await avatar.evaluate(element => {
    element.reset();
    element._statesAfterReset = element._states.length;
  });
  await advance(page, 4000);

  const result = await avatar.evaluate(async element => {
    await element._task;
    return {
      actions: element._actions,
      statesAfterReset: element._states.slice(element._statesAfterReset),
      fx: element._loveFx,
      state: element._state,
      leftTransform: element._leftEye.getAttribute('transform'),
    };
  });
  expect(result.actions.at(-1)).toBe('love:cancel:api');
  expect(result.statesAfterReset).not.toContain('love');
  expect(result.fx).toBeNull();
  expect(result.state).toBe('idle');
  expect(result.leftTransform).not.toContain('rotate');
});

test('another action replaces love cleanly', async ({ page }) => {
  const avatar = await loadAvatar(page);

  await avatar.evaluate(element => { void element.play('love'); });
  await advance(page, 1000);
  await avatar.evaluate(element => { void element.play('surprise'); });
  await advance(page, 4000);

  const result = await avatar.evaluate(element => ({
    actions: element._actions,
    fx: element._loveFx,
    state: element._state,
    leftTransform: element._leftEye.getAttribute('transform'),
  }));
  expect(result.actions).toContain('love:cancel:api');
  expect(result.fx).toBeNull();
  expect(result.state).toBe('idle');
  expect(result.leftTransform).not.toContain('rotate');
});

test('love config is exposed with defaults and bounds, and normalizes invalid input', async ({ page }) => {
  await page.addInitScript(() => {
    window.AgentRobotAvatarLoveConfig = {
      rx: '35',
      ry: 'not-a-number',
      tilt: -5,
      pulse: 5,
      beats: 2.4,
      morphIn: 99999,
    };
  });
  const avatar = await loadAvatar(page);

  const exposed = await page.evaluate(() => ({
    defaults: window.AgentRobotAvatarLoveDefaults,
    bounds: window.AgentRobotAvatarLoveBounds,
    frozen: Object.isFrozen(window.AgentRobotAvatarLoveDefaults),
  }));
  expect(exposed.frozen).toBe(true);
  for (const [key, value] of Object.entries(exposed.defaults)) {
    expect(value).toBeGreaterThanOrEqual(exposed.bounds[key][0]);
    expect(value).toBeLessThanOrEqual(exposed.bounds[key][1]);
  }

  await avatar.evaluate(element => { void element.play('love'); });
  await advance(page, 2400);
  const result = await avatar.evaluate(element => ({
    rx: Number(element._leftBase.getAttribute('rx')),
    ry: Number(element._leftBase.getAttribute('ry')),
    timing: element._loveFx?.timing,
  }));
  const { defaults, bounds } = exposed;
  expect(result.rx).toBeCloseTo(35, 1);
  expect(result.ry).toBeCloseTo(defaults.ry, 1);
  expect((await eyeTilts(avatar)).right).toBeCloseTo(0, 1);
  expect(result.timing.beats).toBe(2);
  expect(result.timing.morphIn).toBe(bounds.morphIn[1]);
});

test('reduced motion keeps a static heart without head motion or beating', async ({ page }) => {
  const avatar = await loadAvatar(page, { reducedMotion: 'reduce' });
  const scale = () => avatar.evaluate(element => Number(/scale\(([\d.]+)\)/.exec(element._leftEye.getAttribute('transform'))?.[1]));

  await avatar.evaluate(element => { void element.play('love'); });
  await advance(page, 900);
  const first = await avatar.evaluate(element => ({
    effect: Boolean(element._loveFx),
    animations: element._headMotion.getAnimations().filter(animation => animation.playState === 'running').length,
  }));
  expect(first).toEqual({ effect: true, animations: 0 });

  const samples = [];
  for (let i = 0; i < 4; i++) {
    samples.push(await scale());
    await advance(page, 190);
  }
  expect(new Set(samples).size).toBe(1);
  // The finished heart is shown at once, not stuck at the start of the morph.
  const defaultTilt = await page.evaluate(() => window.AgentRobotAvatarLoveDefaults.tilt);
  expect((await eyeTilts(avatar)).right).toBeCloseTo(defaultTilt, 1);

  await avatar.evaluate(element => element.reset());
  expect(await avatar.evaluate(element => element._actions.at(-1))).toBe('love:cancel:api');
});

test('reduced motion love still ends and returns to ordinary eyes', async ({ page }) => {
  const avatar = await loadAvatar(page, { reducedMotion: 'reduce' });

  await avatar.evaluate(element => { element._task = element.play('love'); });
  await advance(page, 5000);
  const result = await avatar.evaluate(async element => {
    await element._task;
    return { actions: element._actions, fx: element._loveFx, state: element._state };
  });
  expect(result.actions).toEqual(['love:start:api', 'love:end:api']);
  expect(result.fx).toBeNull();
  expect(result.state).toBe('idle');
  await advance(page, 300);
  // Ordinary eyes carry no heart tilt (NaN means the transform has no rotation at all).
  const tilt = (await eyeTilts(avatar)).right;
  expect(Number.isNaN(tilt) || Math.abs(tilt) < 0.5).toBe(true);
});

test('love follows motion preference changes while it plays', async ({ page }) => {
  const avatar = await loadAvatar(page);
  const scale = () => avatar.evaluate(element => Number(/scale\(([\d.]+)\)/.exec(element._leftEye.getAttribute('transform'))?.[1]));
  const sampleScales = async () => {
    const values = new Set();
    for (let i = 0; i < 5; i++) {
      await page.mouse.move(20 + i * 5, 40 + i * 3);
      values.add(await scale());
      await advance(page, 70);
    }
    return values.size;
  };

  await avatar.evaluate(element => { void element.play('love'); });
  await advance(page, 700);
  expect(await sampleScales()).toBeGreaterThan(1);

  // Full -> reduce: the heart stops beating and the head stops swaying, even with the pointer moving.
  await avatar.evaluate(element => element.setAttribute('motion', 'reduce'));
  await advance(page, 50);
  expect(await sampleScales()).toBe(1);
  expect(await avatar.evaluate(element => element._headMotion.getAnimations()
    .filter(animation => animation.playState === 'running').length)).toBe(0);

  // Reduce -> full: the beat comes back.
  await avatar.evaluate(element => element.setAttribute('motion', 'full'));
  await advance(page, 50);
  expect(await sampleScales()).toBeGreaterThan(1);
});
