import { expect, test } from '@playwright/test';

// One skin from each painter: 103 obsidian (layered gradients), 13 gummy (tuned
// acrylic), 2 blue glaze and 111 porcelain (material library).
const SAMPLES = { 103: 'url(#skin-base)', 13: 'url(#skin-base)', 2: 'url(#material-blueglaze-base)', 111: 'url(#material-porcelain-base)' };

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
      materialDefs: root.querySelectorAll('[id^="material-"]').length,
      hostStyle: [...element.style].filter(name => name.startsWith('--material')),
    };
  });
}

for (const [skin, head] of Object.entries(SAMPLES)) {
  test(`skin ${skin} paints the head and keeps eyelids cutting the eyes`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const avatar = await addAvatar(page, { skin });
    expect(await snapshot(avatar)).toMatchObject({ skin, head, lidsMasked: true, lidFill: 'rgb(0, 0, 0)' });
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
  for (const skin of ['111', '103']) {
    const avatar = await addAvatar(page, { skin, color: '#336699' });
    await avatar.evaluate(element => element.setAttribute('color', '#ff0000'));
    expect((await snapshot(avatar)).head).toBe(SAMPLES[skin]);
    await avatar.evaluate(element => element.removeAttribute('skin'));
    await expect.poll(() => snapshot(avatar)).toMatchObject({ skin: null, head: '#ff0000', eye: 'rgb(255, 255, 255)', materialDefs: 0, hostStyle: [] });
    await avatar.evaluate(element => element.setSkin('2'));
    expect(await snapshot(avatar)).toMatchObject({ skin: '2', head: SAMPLES[2] });
    await avatar.evaluate(element => element.setSkin('none'));
    expect(await snapshot(avatar)).toMatchObject({ skin: null, head: '#ff0000', materialDefs: 0, hostStyle: [] });
  }
});

test('skins are named by number', async ({ page }) => {
  const avatar = await addAvatar(page, {});
  await avatar.evaluate(element => element.setAttribute('skin', '013'));
  await expect.poll(() => avatar.evaluate(element => element.getSkin())).toBe('13');
  expect(await avatar.evaluate(element => element.setSkin(188).getSkin())).toBe('188');
});

test('unknown skins warn in markup and throw from setSkin', async ({ page }) => {
  const warnings = [];
  page.on('console', message => { if (message.type() === 'warning') warnings.push(message.text()); });
  const avatar = await addAvatar(page, { skin: '103' });
  await avatar.evaluate(element => element.setAttribute('skin', '999'));
  await expect.poll(() => avatar.evaluate(element => element.getSkin())).toBeNull();
  expect(warnings.some(text => text.includes('unknown skin "999"'))).toBe(true);
  const message = await avatar.evaluate(element => {
    try { element.setSkin('obsidian'); return ''; } catch (error) { return error.message; }
  });
  expect(message).toContain('Unknown Agent Robot Avatar skin: obsidian');
});

test('the light follows the pointer and rests when following is off', async ({ page }) => {
  for (const [skin, shine] of [['103', 'skin-shine'], ['2', 'material-blueglaze-shine']]) {
    const avatar = await addAvatar(page, { skin, size: '200' });
    const shineX = () => avatar.evaluate((element, id) => Number(element.shadowRoot.getElementById(id).getAttribute('cx')), shine);
    await page.waitForTimeout(300);
    const rest = await shineX();
    const box = await avatar.boundingBox();
    await page.mouse.move(box.x + box.width * 1.2, box.y + box.height / 2);
    await expect.poll(shineX).toBeGreaterThan(rest + .2);
    await avatar.evaluate(element => element.setPointerFollow(false));
    await expect.poll(shineX).toBeCloseTo(rest, 2);
    await page.mouse.move(0, 0);
  }
});

test('a skin set from script survives moving the avatar in the page', async ({ page }) => {
  const avatar = await addAvatar(page, {});
  await avatar.evaluate(element => {
    element.setSkin('60');
    const box = document.createElement('div');
    document.body.append(box);
    box.append(element);
  });
  await page.waitForTimeout(200);
  expect(await snapshot(avatar)).toMatchObject({ skin: '60', head: 'url(#skin-base)' });
});

test('a skin set before the avatar is in the page shows once it is added', async ({ page }) => {
  await page.goto('/examples/basic.html');
  const head = await page.evaluate(async () => {
    const element = document.createElement('agent-robot-avatar');
    element.setSkin('2');
    document.body.append(element);
    await new Promise(resolve => setTimeout(resolve, 200));
    return element.shadowRoot.getElementById('head').getAttribute('fill');
  });
  expect(head).toBe(SAMPLES[2]);
});

test('the catalog numbers every skin once and groups it into one series', async ({ page }) => {
  await page.goto('/examples/basic.html');
  const catalog = await page.evaluate(async () => {
    const { SKIN_NAMES, SKINS, SKIN_SERIES } = await import('/agent-robot-avatar.js');
    return { names: SKIN_NAMES, titled: SKIN_NAMES.every(id => SKINS[id].title && SKINS[id].titleEn), grouped: SKIN_SERIES.flatMap(series => series.skins) };
  });
  expect(catalog.names).toEqual(Array.from({ length: 188 }, (_, index) => String(index + 1)));
  expect(catalog.titled).toBe(true);
  expect(catalog.grouped).toEqual(catalog.names);
});

test('every skin renders through all expressions without errors', async ({ page }) => {
  test.setTimeout(120000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()); });
  await page.goto('/examples/basic.html');
  const results = await page.evaluate(async () => {
    const { SKIN_NAMES } = await import('/agent-robot-avatar.js');
    const avatar = document.querySelector('#avatar');
    const out = [];
    for (const name of SKIN_NAMES) {
      avatar.setSkin(name);
      await new Promise(resolve => requestAnimationFrame(resolve));
      out.push({ name, head: avatar.shadowRoot.getElementById('head').getAttribute('fill') });
    }
    return out;
  });
  for (const item of results) expect(item.head, item.name).toMatch(/^url\(#(skin|material-[a-z]+)-base\)$/);
  for (const skin of ['13', '2', '7', '188']) {
    await page.locator('#avatar').evaluate((element, name) => element.setSkin(name), skin);
    for (const action of ['angry', 'love', 'random', 'sleep', 'wake']) {
      await page.locator('#avatar').evaluate((element, name) => element.play(name), action);
      await page.waitForTimeout(350);
    }
  }
  expect(errors).toEqual([]);
});
