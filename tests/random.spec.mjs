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

const eyeShape = avatar => avatar.evaluate(element => {
  const read = base => ({
    cy: Number(base.getAttribute('cy')),
    rx: Number(base.getAttribute('rx')),
    ry: Number(base.getAttribute('ry')),
  });
  return { left: read(element._leftBase), right: read(element._rightBase) };
});

test('random plays one lifecycle and returns to ordinary eyes', async ({ page }) => {
  const avatar = await loadAvatar(page);

  await avatar.evaluate(element => { element._task = element.play('random'); });
  await advance(page, 700);
  expect(await avatar.evaluate(element => Boolean(element._randomFx))).toBe(true);

  await advance(page, 4000);
  const result = await avatar.evaluate(async element => {
    await element._task;
    return {
      actions: element._actions,
      states: element._states,
      state: element._state,
      fx: element._randomFx,
      baseOpacity: element._leftBase.getAttribute('opacity'),
    };
  });
  expect(result.actions).toEqual(['random:start:api', 'random:end:api']);
  // The action begins with reset(), which reports idle once before random starts.
  expect(result.states.filter(state => state === 'random')).toEqual(['random']);
  expect(result.states.at(-1)).toBe('idle');
  expect(result.state).toBe('idle');
  expect(result.fx).toBeNull();
  expect(result.baseOpacity).toBe('1.000');

  // Idle eyes drift slightly, so check for an ordinary full-size eye rather than exact numbers.
  const rest = await eyeShape(avatar);
  for (const eye of [rest.left, rest.right]) {
    expect(eye.rx).toBeGreaterThan(22);
    expect(eye.rx).toBeLessThanOrEqual(27.01);
    expect(eye.ry).toBeGreaterThan(20);
    expect(Math.abs(eye.cy)).toBeLessThan(2);
  }
});

test('slot is an alias of random', async ({ page }) => {
  const avatar = await loadAvatar(page);

  await avatar.evaluate(element => { element._task = element.play('slot'); });
  await advance(page, 5000);
  const actions = await avatar.evaluate(async element => {
    await element._task;
    return element._actions;
  });
  expect(actions).toEqual(['random:start:api', 'random:end:api']);
});

test('each reel is a single eye that never overlaps the other or leaves the drum', async ({ page }) => {
  const avatar = await loadAvatar(page);

  await avatar.evaluate(element => { void element.play('random'); });
  await advance(page, 400);

  const samples = [];
  for (let i = 0; i < 70; i++) {
    samples.push(await avatar.evaluate(element => {
      const eyes = [element._leftEye, element._rightEye];
      return {
        ellipses: eyes.map(eye => eye.querySelectorAll('ellipse').length),
        active: Boolean(element._randomFx),
        ...['_leftBase', '_rightBase'].reduce((out, key, index) => {
          const base = element[key];
          out[index ? 'right' : 'left'] = {
            rx: Number(base.getAttribute('rx')),
            ry: Number(base.getAttribute('ry')),
            cy: Number(base.getAttribute('cy')),
          };
          return out;
        }, {}),
      };
    }));
    await advance(page, 40);
  }

  const active = samples.filter(sample => sample.active);
  expect(active.length).toBeGreaterThan(30);
  for (const sample of samples) {
    // Exactly one ellipse per eye: no extra copies, so eyes cannot stack.
    expect(sample.ellipses).toEqual([1, 1]);
    for (const eye of [sample.left, sample.right]) {
      // Never wider than the resting eye, so the two eyes (86 and 154, 68 apart) cannot touch.
      expect(eye.rx).toBeLessThanOrEqual(27.01);
      expect(eye.ry).toBeGreaterThanOrEqual(0);
      expect(eye.ry).toBeLessThanOrEqual(29.01);
      // Stays inside the head silhouette (half height 94, eyes centred on 126).
      expect(Math.abs(eye.cy)).toBeLessThan(60);
    }
  }
  // The eye really does roll: its vertical position and height both change.
  const heights = new Set(active.map(sample => sample.left.ry.toFixed(1)));
  const positions = new Set(active.map(sample => sample.left.cy.toFixed(1)));
  expect(heights.size).toBeGreaterThan(10);
  expect(positions.size).toBeGreaterThan(10);
});

test('the left reel settles before the right reel, both onto the resting eye', async ({ page }) => {
  const avatar = await loadAvatar(page);

  await avatar.evaluate(element => { void element.play('random'); });
  await advance(page, 600);
  const plans = await avatar.evaluate(element => element._randomFx.plans.map(plan => ({
    end: plan.tEnd,
    atEnd: plan.position(plan.tEnd),
    period: plan.period,
  })));

  expect(plans[0].end).toBeLessThan(plans[1].end);
  for (const plan of plans) {
    // A settled reel sits on a whole number of passes, i.e. exactly on the resting eye.
    expect(plan.atEnd / plan.period).toBeCloseTo(Math.round(plan.atEnd / plan.period), 6);
  }
});

test('reset cancels random and restores the eyes without a late idle event', async ({ page }) => {
  const avatar = await loadAvatar(page);

  await avatar.evaluate(element => { element._task = element.play('random'); });
  await advance(page, 900);
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
      fx: element._randomFx,
      state: element._state,
    };
  });
  expect(result.actions.at(-1)).toBe('random:cancel:api');
  expect(result.statesAfterReset).not.toContain('random');
  expect(result.fx).toBeNull();
  expect(result.state).toBe('idle');
  const rest = await eyeShape(avatar);
  expect(rest.left.rx).toBeGreaterThan(22);
  expect(rest.left.rx).toBeLessThanOrEqual(27.01);
  expect(rest.left.ry).toBeGreaterThan(20);
});

test('another action replaces random cleanly', async ({ page }) => {
  const avatar = await loadAvatar(page);

  await avatar.evaluate(element => { void element.play('random'); });
  await advance(page, 900);
  await avatar.evaluate(element => { void element.play('love'); });
  await advance(page, 5000);

  const result = await avatar.evaluate(element => ({
    actions: element._actions,
    fx: element._randomFx,
    state: element._state,
  }));
  expect(result.actions).toContain('random:cancel:api');
  expect(result.actions).toContain('love:end:api');
  expect(result.fx).toBeNull();
  expect(result.state).toBe('idle');
});

test('random config is exposed with defaults and bounds, and normalizes invalid input', async ({ page }) => {
  await page.addInitScript(() => {
    window.AgentRobotAvatarRandomConfig = {
      radius: '70',
      gap: 'not-a-number',
      squeeze: -4,
      speed: 99,
      damping: 5,
    };
  });
  const avatar = await loadAvatar(page);

  const exposed = await page.evaluate(() => ({
    defaults: window.AgentRobotAvatarRandomDefaults,
    bounds: window.AgentRobotAvatarRandomBounds,
    frozen: Object.isFrozen(window.AgentRobotAvatarRandomDefaults),
  }));
  expect(exposed.frozen).toBe(true);
  for (const [key, value] of Object.entries(exposed.defaults)) {
    expect(value).toBeGreaterThanOrEqual(exposed.bounds[key][0]);
    expect(value).toBeLessThanOrEqual(exposed.bounds[key][1]);
  }

  await avatar.evaluate(element => { void element.play('random'); });
  await advance(page, 600);
  const fx = await avatar.evaluate(element => ({
    radius: element._randomFx.radius,
    squeeze: element._randomFx.squeeze,
    period: element._randomFx.period,
  }));
  const { defaults, bounds } = exposed;
  expect(fx.radius).toBe(70);
  expect(fx.squeeze).toBe(bounds.squeeze[0]);
  // One pass is the visible half of the drum plus the (defaulted) hidden gap.
  expect(fx.period).toBeCloseTo(Math.PI * 70 + defaults.gap, 6);
});

test('reduced motion holds a static part-way eye instead of spinning', async ({ page }) => {
  const avatar = await loadAvatar(page, { reducedMotion: 'reduce' });

  await avatar.evaluate(element => { void element.play('random'); });
  await advance(page, 500);
  expect(await avatar.evaluate(element => element._randomFx?.reduced)).toBe(true);

  const samples = [];
  for (let i = 0; i < 4; i++) {
    samples.push(JSON.stringify(await eyeShape(avatar)));
    await advance(page, 90);
  }
  expect(new Set(samples).size).toBe(1);
  expect(await avatar.evaluate(element => element._headMotion.getAnimations()
    .filter(animation => animation.playState === 'running').length)).toBe(0);

  await avatar.evaluate(element => element.reset());
  expect(await avatar.evaluate(element => element._actions.at(-1))).toBe('random:cancel:api');
});
