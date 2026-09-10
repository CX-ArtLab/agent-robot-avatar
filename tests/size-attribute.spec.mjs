import { expect, test } from '@playwright/test';

test('size applies numeric and px values synchronously with one parser', async ({ page }) => {
  await page.goto('/examples/basic.html');

  const observed = await page.evaluate(() => {
    const avatar = document.createElement('agent-robot-avatar');
    document.body.append(avatar);

    const read = () => avatar.style.getPropertyValue('--face-size');
    avatar.setAttribute('size', '140px');
    const px = read();
    avatar.setAttribute('size', '96');
    const numeric = read();
    avatar.setAttribute('size', '.5px');
    const fractional = read();
    avatar.setAttribute('size', 'invalid');
    const fallback = read();
    avatar.removeAttribute('size');
    const removed = read();
    avatar.remove();

    return { px, numeric, fractional, fallback, removed };
  });

  expect(observed).toEqual({
    px: '140px',
    numeric: '96px',
    fractional: '0.5px',
    fallback: '112px',
    removed: '',
  });
});
