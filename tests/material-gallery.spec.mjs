import { expect, test } from '@playwright/test';

// Eye colors captured from the original local workshop, including the saved
// lavender variant. Both live previews and exported thumbnails must keep them.
// Skin number -> [material key, eye color].
const iceEyes = {
  7:['iceglaze','#304c6e'], 8:['mintice','#3a6458'], 9:['blushice','#643a50'],
  10:['champagneice','#6b5834'], 11:['lavenderice','#304c6e'], 12:['whiteice','#405765'],
};

test('ice skin previews and catalog thumbnails preserve the original eye colors', async ({page}) => {
  for (const [skin, [key, color]] of Object.entries(iceEyes)) {
    await page.goto(`/demo/skins.html?skin=${skin}&lang=zh-CN`);
    await expect(page.locator(`#face #material-${key}-eye-porcelain stop`).first()).toHaveAttribute('stop-color', color);
  }

  await page.goto('/demo/materials/index.html?view=ice&lang=zh-CN');
  await expect(page.locator('.skin-card')).toHaveCount(6);
  for (const [skin, [key, color]] of Object.entries(iceEyes)) {
    const image = page.locator(`.skin-card[data-skin="${skin}"] img`);
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute('src', /^blob:/);
    const exportedEye = await image.evaluate(async (img, id) => {
      const svg = new DOMParser().parseFromString(await (await fetch(img.src)).text(), 'image/svg+xml');
      return svg.querySelector(`#material-${id}-eye-porcelain stop`).getAttribute('stop-color');
    }, key);
    expect(exportedEye, `${skin} thumbnail`).toBe(color);
  }
});
