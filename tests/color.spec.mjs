import { expect, test } from '@playwright/test';

const parts = ['head', 'leftTop', 'rightTop', 'leftBottom', 'rightBottom', 'antennaDot'];

async function expectColor(avatar, color) {
  const fills = await avatar.evaluate((element, ids) => ids.map(id =>
    element.shadowRoot.getElementById(id)?.getAttribute('fill')), parts);
  expect(fills).toEqual(parts.map(() => color));
  expect(await avatar.evaluate(element => ['leftBase', 'rightBase', 'leftInputBase', 'rightInputBase']
    .map(id => element.shadowRoot.getElementById(id).getAttribute('fill')))).toEqual(Array(4).fill('#fff'));
}

test('color attributes update all head parts and remain isolated per instance', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/examples/basic.html');
  await page.evaluate(() => {
    const other = document.createElement('agent-robot-avatar');
    other.id = 'other-avatar';
    other.setAttribute('color', '#006699');
    document.body.append(other);
  });
  const avatar = page.locator('#avatar');
  const other = page.locator('#other-avatar');
  await expect(other.locator('#antennaDot')).toHaveCount(1);
  await expectColor(other, '#006699');

  for (const color of ['#ff0000', '#336699', '', null]) {
    await avatar.evaluate((element, value) => {
      if (value === null) element.removeAttribute('color');
      else element.setAttribute('color', value);
    }, color);
    await expectColor(avatar, color || '#08090b');
    await expectColor(other, '#006699');
  }
  expect(errors).toEqual([]);
});

test('color changes update the antenna while sleep rendering is paused', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/examples/basic.html');
  const avatar = page.locator('#avatar');
  await avatar.evaluate(element => element.play('sleep'));
  await expect(avatar).toHaveJSProperty('_framePaused', true);
  await avatar.evaluate(element => element.setAttribute('color', '#cc5500'));
  await expectColor(avatar, '#cc5500');
  await expect(avatar).toHaveJSProperty('_framePaused', true);
  expect(errors).toEqual([]);
});
