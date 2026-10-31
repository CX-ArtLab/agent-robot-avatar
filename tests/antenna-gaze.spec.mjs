import { expect, test } from '@playwright/test';

// Pulling the antenna turns the eyes toward the pull. However far and in
// whichever direction it is pulled, both eyes must stay inside the head.
test('eyes stay inside the head while the antenna is pulled', async ({ page }) => {
  await page.goto('/examples/basic.html');
  const avatar = page.locator('agent-robot-avatar');
  await expect.poll(() => avatar.evaluate(element => Boolean(element.shadowRoot?.querySelector('#antennaDot')))).toBe(true);

  const dot = await avatar.evaluate(element => {
    const box = element.shadowRoot.querySelector('#antennaDot').getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  });

  for (const [dx, dy] of [[-220, 180], [220, 180], [-240, 0], [240, 0], [0, 240], [-200, -60]]) {
    await page.mouse.move(dot.x, dot.y);
    await page.mouse.down();
    await page.mouse.move(dot.x + dx, dot.y + dy, { steps: 12 });
    await page.waitForTimeout(500);

    const outside = await avatar.evaluate(element => {
      const root = element.shadowRoot;
      const head = root.querySelector('#head');
      const shape = root.querySelector('#headShape');
      const toHead = head.getScreenCTM().inverse();
      let misses = 0;
      for (const id of ['leftBase', 'rightBase']) {
        const eye = root.querySelector(`#${id}`);
        const toScreen = eye.getScreenCTM();
        const cx = Number(eye.getAttribute('cx')), cy = Number(eye.getAttribute('cy'));
        // One unit inside the outline, so antialiased edges don't count.
        const rx = Number(eye.getAttribute('rx')) - 1, ry = Number(eye.getAttribute('ry')) - 1;
        for (let a = 0; a < 360; a += 10) {
          const t = a * Math.PI / 180;
          const point = new DOMPoint(cx + rx * Math.cos(t), cy + ry * Math.sin(t)).matrixTransform(toScreen).matrixTransform(toHead);
          if (!shape.isPointInFill(point)) misses += 1;
        }
      }
      return misses;
    });
    await page.mouse.up();
    await page.waitForTimeout(900);

    expect(outside, `pulled by ${dx},${dy}`).toBe(0);
  }
});
