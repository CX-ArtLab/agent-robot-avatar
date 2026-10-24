import { expect, test } from '@playwright/test';

const SKIN_EYES = { obsidian: 'rgb(240, 247, 255)', porcelain: 'rgb(52, 59, 60)', aurora: 'rgb(45, 48, 82)' };

async function addAvatar(page, attributes) {
  await page.goto('/examples/basic.html');
  await page.evaluate(attrs => {
    const avatar = document.createElement('agent-robot-avatar');
    avatar.id = 'skinned';
    for (const [name, value] of Object.entries(attrs)) avatar.setAttribute(name, value);
    document.body.append(avatar);
  }, attributes);
  const avatar = page.locator('#skinned');
  await expect.poll(() => avatar.evaluate(element => element.getSkin())).toBe(attributes.skin ?? null);
  return avatar;
}

function snapshot(avatar) {
  return avatar.evaluate(element => {
    const root = element.shadowRoot;
    const style = id => getComputedStyle(root.getElementById(id));
    return {
      skin: element.getSkin(),
      head: root.getElementById('head').getAttribute('fill'),
      eye: style('leftBase').fill,
      lidsMasked: ['leftTop', 'rightBottom'].every(id => root.getElementById(id).closest('mask') !== null),
      lidFill: style('leftTop').fill,
    };
  });
}

for (const skin of Object.keys(SKIN_EYES)) {
  test(`${skin} skin paints the head and keeps eyelids cutting the eyes`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const avatar = await addAvatar(page, { skin });
    expect(await snapshot(avatar)).toEqual({
      skin, head: 'url(#skin-base)', eye: SKIN_EYES[skin], lidsMasked: true, lidFill: 'rgb(0, 0, 0)',
    });
    // Expressions move the lids inside the mask, so the skin never shows a flat patch.
    await avatar.evaluate(element => element.play('angry'));
    await page.waitForTimeout(700);
    expect((await snapshot(avatar)).lidsMasked).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('an avatar without a skin keeps its original eyelids', async ({ page }) => {
  const avatar = await addAvatar(page, {});
  await page.waitForTimeout(200);
  expect(await snapshot(avatar)).toMatchObject({ skin: null, head: '#08090b', lidsMasked: false });
  expect(await avatar.evaluate(element => element.shadowRoot.getElementById('skinDefs'))).toBeNull();
});

test('removing a skin returns to the color attribute, and color changes keep an active skin', async ({ page }) => {
  const avatar = await addAvatar(page, { skin: 'porcelain', color: '#336699' });
  await avatar.evaluate(element => element.setAttribute('color', '#ff0000'));
  expect((await snapshot(avatar)).head).toBe('url(#skin-base)');
  await avatar.evaluate(element => element.removeAttribute('skin'));
  await expect.poll(() => snapshot(avatar)).toMatchObject({ skin: null, head: '#ff0000', eye: 'rgb(255, 255, 255)' });
  await avatar.evaluate(element => element.setSkin('aurora'));
  expect(await snapshot(avatar)).toMatchObject({ skin: 'aurora', head: 'url(#skin-base)' });
  await avatar.evaluate(element => element.setSkin('none'));
  expect(await snapshot(avatar)).toMatchObject({ skin: null, head: '#ff0000' });
});

test('unknown skins warn in markup and throw from setSkin', async ({ page }) => {
  const warnings = [];
  page.on('console', message => { if (message.type() === 'warning') warnings.push(message.text()); });
  const avatar = await addAvatar(page, { skin: 'obsidian' });
  await avatar.evaluate(element => element.setAttribute('skin', 'marble'));
  await expect.poll(() => avatar.evaluate(element => element.getSkin())).toBeNull();
  expect(warnings.some(text => text.includes('unknown skin "marble"'))).toBe(true);
  const message = await avatar.evaluate(element => {
    try { element.setSkin('marble'); return ''; } catch (error) { return error.message; }
  });
  expect(message).toContain('Unknown Agent Robot Avatar skin: marble');
});

test('the light follows the pointer and rests when following is off', async ({ page }) => {
  const avatar = await addAvatar(page, { skin: 'obsidian', size: '200' });
  const shineX = () => avatar.evaluate(element => Number(element.shadowRoot.getElementById('skin-shine').getAttribute('cx')));
  await expect.poll(shineX).toBeCloseTo(.35, 2);
  const box = await avatar.boundingBox();
  await page.mouse.move(box.x + box.width * 1.2, box.y + box.height / 2);
  await expect.poll(shineX).toBeGreaterThan(.6);
  await avatar.evaluate(element => element.setPointerFollow(false));
  await expect.poll(shineX).toBeCloseTo(.35, 2);
});

test('a skin set from script survives moving the avatar in the page', async ({ page }) => {
  const avatar = await addAvatar(page, {});
  await avatar.evaluate(element => {
    element.setSkin('aurora');
    const box = document.createElement('div');
    document.body.append(box);
    box.append(element);
  });
  await page.waitForTimeout(200);
  expect(await snapshot(avatar)).toMatchObject({ skin: 'aurora', head: 'url(#skin-base)' });
});
