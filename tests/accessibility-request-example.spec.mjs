import { expect, test } from '@playwright/test';

const pageErrors = new WeakMap();

test.beforeEach(async ({ page }) => {
  const errors = [];
  pageErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/examples/accessibility.html');
  await expect(page.locator('#avatar')).toBeVisible();
});

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page)).toEqual([]);
});

const status = page => page.locator('#agent-status');
const log = page => page.locator('#request-log');

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

test('cancelling during replacement delay keeps the request cancelled', async ({ page }) => {
  await page.locator('#replace-request').click();
  await page.waitForTimeout(80);
  await page.locator('#cancel-request').click();

  await expect(status(page)).toHaveText('Request cancelled.');
  await page.waitForTimeout(1500);
  await expect(status(page)).toHaveText('Request cancelled.');
  await expect(status(page)).not.toHaveText('Processing…');
  await expect(log(page)).toContainText('stale start ignored');
  await expect(log(page)).not.toContainText('success:start:api');
});

test('a newer user request invalidates a delayed replacement start', async ({ page }) => {
  await page.locator('#replace-request').click();
  await page.waitForTimeout(80);
  await page.locator('[data-request="error"]').click();

  await expect(log(page)).toContainText('error:end:api', { timeout: 6000 });
  await expect(status(page)).toHaveText('Connection problem.');
  await expect(log(page)).toContainText('stale start ignored');
  await expect(log(page)).not.toContainText('success:start:api');
});

test('repeated replacement clicks invalidate the older replacement flow', async ({ page }) => {
  await page.locator('#replace-request').click();
  await page.waitForTimeout(80);
  await page.locator('#replace-request').click();

  await expect(status(page)).toHaveText('Task completed.', { timeout: 6000 });
  await expect(log(page)).toContainText('stale start ignored');
  const text = await log(page).textContent();
  expect(countMatches(text, /request \d+:start/g)).toBe(3);
  expect(countMatches(text, /success:start:api/g)).toBe(1);
});

test('normal replacement still lets the newer success own the UI', async ({ page }) => {
  await page.locator('#replace-request').click();

  await expect(status(page)).toHaveText('Task completed.', { timeout: 6000 });
  await expect(log(page)).toContainText('stale result ignored', { timeout: 6000 });
  await expect(log(page)).not.toContainText('failure:start:api');
});

test('business status is the only live region and terminal text survives animation end', async ({ page }) => {
  await expect(page.locator('[role="status"]')).toHaveCount(1);
  await expect(page.locator('[role="log"]')).toHaveCount(0);
  await expect(page.locator('[aria-live]')).toHaveCount(1);
  await expect(status(page)).toHaveAttribute('aria-live', 'polite');
  await expect(status(page)).toHaveAttribute('aria-atomic', 'true');
  await expect(page.locator('.request-log')).toHaveAttribute('aria-labelledby', 'request-log-heading');
  await expect(page.locator('#request-log-heading')).toHaveText('Request event log');
  await expect(log(page)).not.toHaveAttribute('aria-hidden', 'true');

  await page.locator('#avatar').evaluate(element => {
    element.dispatchEvent(new CustomEvent('action-state', {
      bubbles: true,
      composed: true,
      detail: { action: 'success', phase: 'start', source: 'interaction' },
    }));
  });
  await expect(status(page)).toHaveText('Idle.');
  await expect(log(page)).not.toContainText('success:start:interaction');

  for (const [outcome, message] of [
    ['success', 'Task completed.'],
    ['failure', 'Task failed.'],
    ['error', 'Connection problem.'],
  ]) {
    await page.locator(`[data-request="${outcome}"]`).click();
    await expect(log(page)).toContainText(`${outcome}:end:api`, { timeout: 6000 });
    await expect(status(page)).toHaveText(message);
  }
});
