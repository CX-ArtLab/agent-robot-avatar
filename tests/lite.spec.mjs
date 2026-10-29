import { expect, test } from '@playwright/test';

test('the lite build has every expression and no skin code', async ({ page }) => {
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  const warnings = [];
  page.on('console', message => { if (message.type() === 'warning') warnings.push(message.text()); });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // A blank page on the test server, so nothing but the lite build loads.
  await page.route('**/lite-test.html', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>lite</title>' }));
  await page.goto('/lite-test.html');
  const result = await page.evaluate(async () => {
    const module = await import('/agent-robot-avatar-lite.js');
    await new Promise(resolve => setTimeout(resolve, 100));
    const avatar = document.createElement('agent-robot-avatar');
    avatar.setAttribute('skin', '301');
    document.body.append(avatar);
    await new Promise(resolve => setTimeout(resolve, 200));
    avatar.setSkin('102');
    avatar.play('love');
    return { exports: Object.keys(module).sort(), skin: avatar.getSkin(), chained: avatar.setSkin(null) === avatar,
      head: avatar.shadowRoot.getElementById('head').getAttribute('fill') };
  });
  expect(result).toEqual({ exports: ['AgentRobotAvatar', 'VERSION', 'default'], skin: null, chained: true, head: '#08090b' });
  expect(warnings.filter(text => text.includes('lite build'))).toHaveLength(1);
  expect(requests.filter(url => /skins|skin-patterns/.test(url))).toEqual([]);
  expect(errors).toEqual([]);
});
