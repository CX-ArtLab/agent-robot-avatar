import { expect, test } from '@playwright/test';

async function setup(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/examples/basic.html');
  await page.clock.pauseAt(await page.evaluate(() => Date.now()) + 1000);
  const avatar = page.locator('#avatar');
  await avatar.evaluate(element => {
    element._actions = [];
    element.addEventListener('action-state', event => {
      const { action, phase, source } = event.detail;
      element._actions.push(`${action}:${phase}:${source}`);
    });
  });
  return avatar;
}

async function runFor(page, ms) {
  await page.clock.runFor(ms);
}

test('reduced motion keeps success and failure recognizable with normal lifecycles', async ({ page }) => {
  const avatar = await setup(page);

  await avatar.evaluate(element => { element._task = element.play('success'); });
  await runFor(page, 700);
  expect(await avatar.evaluate(element => ({
    state: element._state,
    animations: element._headMotion.getAnimations().filter(animation => animation.playState === 'running').length,
  }))).toEqual({ state: 'happy', animations: 0 });
  await runFor(page, 2200);
  expect(await avatar.evaluate(element => element._actions)).toEqual([
    'success:start:api', 'success:end:api',
  ]);

  await avatar.evaluate(element => {
    element._actions.length = 0;
    element._task = element.play('failure');
  });
  await runFor(page, 650);
  expect(await avatar.evaluate(element => ({
    state: element._state,
    animations: element._headMotion.getAnimations().filter(animation => animation.playState === 'running').length,
  }))).toEqual({ state: 'sad', animations: 0 });
  await runFor(page, 3100);
  expect(await avatar.evaluate(element => element._actions)).toEqual([
    'failure:start:api', 'failure:end:api',
  ]);
});

test('reduced error, warning and inspect expose static effects without continuous head motion', async ({ page }) => {
  const avatar = await setup(page);

  for (const [action, delay, effect] of [
    ['error', 560, '_systemErrorShake'],
    ['warning', 620, '_warningFx'],
    ['inspect', 420, '_inspectFx'],
  ]) {
    await avatar.evaluate((element, name) => {
      element._actions.length = 0;
      element._task = element.play(name);
    }, action);
    await runFor(page, delay);
    expect(await avatar.evaluate((element, property) => ({
      effect: Boolean(element[property]),
      animations: element._headMotion.getAnimations().filter(animation => animation.playState === 'running').length,
      dirty: Boolean(element._runtimeVisualDirty),
    }), effect)).toEqual({ effect: true, animations: 0, dirty: false });
    await avatar.evaluate(element => element.reset());
    expect(await avatar.evaluate(element => element._actions.at(-1))).toBe(`${action}:cancel:api`);
    await runFor(page, 100);
  }
});
