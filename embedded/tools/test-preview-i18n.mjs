import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const preview = new URL('../preview/boopface-embedded-preview.html', import.meta.url).href;
const catalogue = JSON.parse(await readFile(new URL('../preview/translations.json', import.meta.url), 'utf8'));
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ offline: true, viewport: {width:1180,height:1000} });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let definitions;
  for (const language of ['zh-CN', ...Object.keys(catalogue)]) {
    await page.goto(preview + '?lang=' + language);
    await page.waitForFunction(() => document.documentElement.dataset.ready === 'true');
    assert.equal(await page.locator('html').getAttribute('lang'), language);
    assert.equal(await page.locator('#preview-language option').count(), 10);
    const translate = key => language === 'zh-CN' ? key : catalogue[language][key] ?? catalogue.en[key];
    assert.equal(await page.locator('#export').textContent(), translate('导出设置'));
    assert.equal(await page.locator('[data-action="success"]').textContent(), translate('成功'));
    await page.locator('#export').click();
    const code = await page.locator('#export-code').textContent();
    assert(code.startsWith(translate('// BoopFace Embedded 设置，由嵌入式设备模拟器导出。')));
    const current = code.match(/^#define .+/gm).map(line => line.split('//')[0].trim());
    if (definitions) assert.deepEqual(current, definitions, 'language must not change exported settings');
    definitions = current;
    assert.deepEqual((await page.locator('#export-help code').allTextContents()).sort(),
      ['eyes_settings.h', 'embedded/examples/arduino/', 'main.cpp'].sort());
  }
  await page.locator('#export-close').click();
  await page.locator('#eye-color').fill('#ff9900');
  await page.locator('#preview-language').selectOption('es');
  await page.waitForURL(/lang=es/);
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true');
  assert.equal(await page.locator('#eye-color').inputValue(), '#ff9900');
  // Explicit links take precedence over stored preferences and regional codes normalize.
  await page.goto(preview + '?lang=ja-JP');
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true');
  assert.equal(await page.locator('html').getAttribute('lang'), 'ja');
  await page.goto(preview);
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true');
  assert.equal(await page.locator('html').getAttribute('lang'), 'es');
  assert.deepEqual(errors, []);
  console.log('Offline simulator: all 10 languages, localized exports, unchanged settings and saved language passed.');
} finally {
  await browser.close();
}
