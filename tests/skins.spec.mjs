import { expect, test } from '@playwright/test';

// One skin from each painter: 1001 obsidian (layered gradients), 301 gummy
// (tuned acrylic), 102 blue glaze and 1009 porcelain (material library).
const SAMPLES = { 1001: 'url(#skin-base)', 301: 'url(#skin-base)', 102: 'url(#material-blueglaze-base)', 1009: 'url(#material-porcelain-base)' };

async function addAvatar(page, attributes) {
  await page.goto('/examples/basic.html');
  // Load the painters first so each skin shows on the frame it is set.
  await page.evaluate(async () => (await import('/agent-robot-avatar.js')).loadSkins());
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
  for (const skin of ['1009', '1001']) {
    const avatar = await addAvatar(page, { skin, color: '#336699' });
    await avatar.evaluate(element => element.setAttribute('color', '#ff0000'));
    expect((await snapshot(avatar)).head).toBe(SAMPLES[skin]);
    await avatar.evaluate(element => element.removeAttribute('skin'));
    await expect.poll(() => snapshot(avatar)).toMatchObject({ skin: null, head: '#ff0000', eye: 'rgb(255, 255, 255)', materialDefs: 0, hostStyle: [] });
    await avatar.evaluate(element => element.setSkin('102'));
    expect(await snapshot(avatar)).toMatchObject({ skin: '102', head: SAMPLES[102] });
    await avatar.evaluate(element => element.setSkin('none'));
    expect(await snapshot(avatar)).toMatchObject({ skin: null, head: '#ff0000', materialDefs: 0, hostStyle: [] });
  }
});

test('skins are named by number', async ({ page }) => {
  const avatar = await addAvatar(page, {});
  await avatar.evaluate(element => element.setAttribute('skin', '0301'));
  await expect.poll(() => avatar.evaluate(element => element.getSkin())).toBe('301');
  expect(await avatar.evaluate(element => element.setSkin(1717).getSkin())).toBe('1717');
});

test('unknown skins warn in markup and throw from setSkin', async ({ page }) => {
  const warnings = [];
  page.on('console', message => { if (message.type() === 'warning') warnings.push(message.text()); });
  const avatar = await addAvatar(page, { skin: '1001' });
  await avatar.evaluate(element => element.setAttribute('skin', '199'));
  await expect.poll(() => avatar.evaluate(element => element.getSkin())).toBeNull();
  expect(warnings.some(text => text.includes('unknown skin "199"'))).toBe(true);
  const message = await avatar.evaluate(element => {
    try { element.setSkin('obsidian'); return ''; } catch (error) { return error.message; }
  });
  expect(message).toContain('Unknown Agent Robot Avatar skin: obsidian');
});

test('the light follows the pointer and rests when following is off', async ({ page }) => {
  for (const [skin, shine] of [['1001', 'skin-shine'], ['102', 'material-blueglaze-shine']]) {
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
    element.setSkin('706');
    const box = document.createElement('div');
    document.body.append(box);
    box.append(element);
  });
  await page.waitForTimeout(200);
  expect(await snapshot(avatar)).toMatchObject({ skin: '706', head: 'url(#skin-base)' });
});

test('without preloading, a skin shows once its painter has loaded', async ({ page }) => {
  await page.goto('/examples/basic.html');
  const avatar = page.locator('#avatar');
  await avatar.evaluate(element => element.setSkin('1009'));
  expect(await avatar.evaluate(element => element.getSkin())).toBe('1009');
  await expect.poll(() => avatar.evaluate(element => element.shadowRoot.getElementById('head').getAttribute('fill'))).toBe(SAMPLES[1009]);
  await avatar.evaluate(element => element.setSkin('301'));
  await expect.poll(() => avatar.evaluate(element => element.shadowRoot.getElementById('head').getAttribute('fill'))).toBe(SAMPLES[301]);
});

test('a skin set before the avatar is in the page shows once it is added', async ({ page }) => {
  await page.goto('/examples/basic.html');
  await page.evaluate(async () => (await import('/agent-robot-avatar.js')).loadSkins());
  const head = await page.evaluate(async () => {
    const element = document.createElement('agent-robot-avatar');
    element.setSkin('102');
    document.body.append(element);
    await new Promise(resolve => setTimeout(resolve, 200));
    return element.shadowRoot.getElementById('head').getAttribute('fill');
  });
  expect(head).toBe(SAMPLES[102]);
});

test('every skin has a permanent series number and belongs to one series', async ({ page }) => {
  await page.goto('/examples/basic.html');
  const catalog = await page.evaluate(async () => {
    const { SKIN_NAMES, SKINS, SKIN_SERIES } = await import('/agent-robot-avatar.js');
    const { RETIRED_SKINS } = await import('/src/skins/catalog.js');
    return { names: SKIN_NAMES, titled: SKIN_NAMES.every(id => SKINS[id].title && SKINS[id].titleEn), grouped: SKIN_SERIES.flatMap(series => series.skins), series: SKIN_SERIES, retired: RETIRED_SKINS };
  });
  expect(catalog.names).toHaveLength(188);
  expect(new Set(catalog.names).size).toBe(188);
  expect(catalog.titled).toBe(true);
  expect(catalog.grouped).toEqual(catalog.names);
  // A number is its series number followed by two digits.
  for (const series of catalog.series) for (const id of series.skins) expect(Math.floor(Number(id) / 100), id).toBe(series.number);
  for (const id of catalog.retired) expect(catalog.names).not.toContain(id);
});

test('every skin renders through all expressions without errors', async ({ page }) => {
  test.setTimeout(120000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()); });
  await page.goto('/examples/basic.html');
  const results = await page.evaluate(async () => {
    const { SKIN_NAMES, loadSkins } = await import('/agent-robot-avatar.js');
    await loadSkins();
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
  for (const skin of ['301', '102', '201', '1717']) {
    await page.locator('#avatar').evaluate((element, name) => element.setSkin(name), skin);
    for (const action of ['angry', 'love', 'random', 'sleep', 'wake']) {
      await page.locator('#avatar').evaluate((element, name) => element.play(name), action);
      await page.waitForTimeout(350);
    }
  }
  expect(errors).toEqual([]);
});

test('love paints overlapping eyes once, then returns to two eyes', async ({ page }) => {
  await page.goto('/examples/basic.html');
  await page.evaluate(async () => (await import('/agent-robot-avatar.js')).loadSkins());
  // The page's own avatar is on screen, so its frames keep running.
  const avatar = page.locator('#avatar');
  await avatar.evaluate(element => element.setSkin('305'));
  const state = () => avatar.evaluate(element => {
    const root = element.shadowRoot;
    const joined = root.querySelector('[mask="url(#skin-joined-eyes)"]')?.closest('g[clip-path]');
    return { joined: Boolean(joined) && joined.style.display !== 'none', eyesHidden: root.getElementById('leftEye').parentElement.style.opacity === '0' };
  });
  // play() resolves when love is over, so do not wait for it here.
  await avatar.evaluate(element => { element.play('love'); });
  await expect.poll(state).toEqual({ joined: true, eyesHidden: true });
  await expect.poll(state, { timeout: 8000 }).toEqual({ joined: false, eyesHidden: false });
});
