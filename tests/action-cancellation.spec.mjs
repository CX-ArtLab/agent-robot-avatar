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

async function loadAvatarWithClock(page) {
  await page.clock.install();
  await page.goto('/examples/basic.html');
  const browserNow = await page.evaluate(() => Date.now());
  await page.clock.pauseAt(browserNow + 1000);
  return page.locator('agent-robot-avatar');
}

async function advance(page, milliseconds) {
  await page.clock.runFor(milliseconds);
}

test('reset cancels surprise before its visible phase', async ({ page }) => {
  const avatar = await loadAvatarWithClock(page);

  await avatar.evaluate(element => {
    element._testStates = [];
    element.addEventListener('face-state', event => element._testStates.push(event.detail.state));
    element._testAction = element.play('surprise');
  });
  await advance(page, 580);
  await avatar.evaluate(element => {
    element.reset();
    element._testResetIndex = element._testStates.length;
  });
  await advance(page, 2000);

  const result = await avatar.evaluate(async element => {
    await element._testAction;
    return {
      state: element._state,
      statesAfterReset: element._testStates.slice(element._testResetIndex),
      surpriseShake: element._surpriseShake,
    };
  });
  expect(result).toEqual({ state: 'idle', statesAfterReset: [], surpriseShake: null });
});

test('reset stops active head motion immediately', async ({ page }) => {
  const avatar = await loadAvatarWithClock(page);

  await avatar.evaluate(element => {
    element._testAction = element.play('success');
  });
  await advance(page, 600);
  await expect.poll(() => avatar.evaluate(element => element._headMotion.getAnimations()
    .some(animation => animation.playState === 'running' || animation.playState === 'pending'))).toBe(true);

  const afterReset = await avatar.evaluate(element => {
    element.reset();
    return {
      running: element._headMotion.getAnimations()
        .some(animation => animation.playState === 'running' || animation.playState === 'pending'),
      transform: element._headMotion.style.transform,
    };
  });
  expect(afterReset).toEqual({ running: false, transform: '' });

  await advance(page, 1000);
  await avatar.evaluate(element => element._testAction);
  await expect(avatar).toHaveJSProperty('_state', 'idle');
});

for (const action of ['success', 'angry']) {
  test(`a newer ${action} action owns its full visible phase`, async ({ page }) => {
    const avatar = await loadAvatarWithClock(page);

    await avatar.evaluate((element, name) => {
      element._testFirstAction = element.play(name);
    }, action);
    await advance(page, 600);
    await avatar.evaluate((element, name) => {
      element._testSecondAction = element.play(name);
    }, action);
    await advance(page, 950);

    const duringSecond = await avatar.evaluate(element => ({
      state: element._state,
      effectActive: Boolean(element._eyeBob || element._angryEyeDrop),
    }));
    expect(duringSecond).toEqual({
      state: action === 'success' ? 'happy' : 'angry',
      effectActive: true,
    });

    await advance(page, 1100);
    await avatar.evaluate(element => Promise.all([
      element._testFirstAction,
      element._testSecondAction,
    ]));
    await expect(avatar).toHaveJSProperty('_state', 'idle');
  });
}

test('a newer sleep action is not completed by the older sleep continuation', async ({ page }) => {
  const avatar = await loadAvatarWithClock(page);

  await avatar.evaluate(element => {
    element._testSleepStates = [];
    element.addEventListener('face-state', event => element._testSleepStates.push(event.detail.state));
    element._testFirstAction = element.play('sleep');
  });
  await advance(page, 700);
  await avatar.evaluate(element => {
    element._testSecondStart = element._testSleepStates.length;
    element._testSecondAction = element.play('sleep');
  });
  await advance(page, 1900);

  const duringSecond = await avatar.evaluate(element => ({
    state: element._state,
    sleepEvents: element._testSleepStates
      .slice(element._testSecondStart)
      .filter(state => state === 'sleep').length,
  }));
  expect(duringSecond).toEqual({ state: 'sleepy', sleepEvents: 0 });

  await advance(page, 800);
  await avatar.evaluate(element => Promise.all([
    element._testFirstAction,
    element._testSecondAction,
  ]));
  await expect(avatar).toHaveJSProperty('_state', 'sleep');
});

test('waiting remains active when it replaces a pending surprise', async ({ page }) => {
  const avatar = await loadAvatarWithClock(page);

  await avatar.evaluate(element => {
    element._testStates = [];
    element.addEventListener('face-state', event => element._testStates.push(event.detail.state));
    element._testSurpriseAction = element.play('surprise');
  });
  await advance(page, 580);
  await avatar.evaluate(element => {
    element._testWaitingStart = element._testStates.length;
    element._testWaitingAction = element.play('waiting');
  });
  await advance(page, 500);

  const result = await avatar.evaluate(element => ({
    states: element._testStates.slice(element._testWaitingStart),
    waiting: Boolean(element._waitingFx),
    state: element._state,
  }));
  expect(result).toEqual({ states: ['idle', 'waiting'], waiting: true, state: 'idle' });

  await avatar.evaluate(element => element.reset());
  await advance(page, 3000);
  await avatar.evaluate(element => Promise.all([
    element._testSurpriseAction,
    element._testWaitingAction,
  ]));
});

test('automatic sleep reaches sleep instead of restarting its preparation', async ({ page }) => {
  const avatar = await loadAvatarWithClock(page);

  await avatar.evaluate(element => {
    element.setAttribute('auto-sleep', '100');
    element._lastActivity = performance.now();
  });
  await advance(page, 3000);

  await expect(avatar).toHaveJSProperty('_state', 'sleep');
});
