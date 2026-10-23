import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { chromium, firefox, webkit } from '@playwright/test';

const root = fileURLToPath(new URL('../../', import.meta.url));
const engine = process.env.PREVIEW_BROWSER || 'chromium';
const browser = await ({chromium,firefox,webkit})[engine].launch({
  headless: true,
  ...(process.env.PREVIEW_BROWSER_PATH ? { executablePath: process.env.PREVIEW_BROWSER_PATH,
    args: ['--no-sandbox','--disable-dev-shm-usage', ...(process.env.PREVIEW_BROWSER_ARGS ? JSON.parse(process.env.PREVIEW_BROWSER_ARGS) : [])] } : {})
});
// Playwright's WebKit cannot open even file:// pages in an offline context,
// so there the network is cut by aborting every web request instead.
const context = await browser.newContext({ viewport: {width:1180,height:1000}, offline: engine !== 'webkit' });
if (engine === 'webkit') await context.route(/^(https?|wss?):/, route => route.abort());
const page = await context.newPage();
const errors = [], external = [];
page.on('pageerror', error => errors.push(error.message));
page.on('request', request => { if (/^https?:/.test(request.url())) external.push(request.url()); });
const file = pathToFileURL(resolve(root,'embedded/preview/agent-robot-eyes-preview.html')).href;
const clock = () => page.locator('#clock').textContent();
const frame = () => page.locator('#screen').evaluate(canvas => {
  const bytes = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
  let hash=2166136261, lit=0;
  for(let i=0;i<bytes.length;i+=4) { hash=Math.imul(hash^bytes[i],16777619)>>>0; if(bytes[i])lit++; }
  return { hash,lit,width:canvas.width,height:canvas.height };
});
const choose = async id => {
  // The picker lists one screen type at a time: pick the type chip, then the screen.
  const group = await page.evaluate(id => id === 'custom' ? 'other' : SCREEN_PRESETS.find(item => item.id === id).group || 'other', id);
  await page.locator(`[data-group="${group}"]`).click();
  await page.locator('#profile').selectOption(id);
};
try {
  await page.clock.install();
  await page.goto(file);
  await page.waitForFunction(() => document.getElementById('status').textContent.includes('本机绘制'));
  await page.locator('#tracking').uncheck();
  assert.equal(await page.locator('.action').count(),18);
  assert((await frame()).lit>1000);
  assert.equal(await page.locator('#step').isDisabled(),true);
  await page.locator('#pause').click();
  const stopped=await clock(); await page.clock.runFor(800);
  assert.equal(await clock(),stopped,'pause freezes simulation time');
  await page.locator('#step').click(); assert.notEqual(await clock(),stopped);
  await page.locator('#reset').click();
  const idle=await frame();
  await page.locator('[data-action="love"]').click();
  for(let i=0;i<15;i++) await page.locator('#step').click();
  assert.notEqual((await frame()).hash,idle.hash,'native heart must differ');
  await page.locator('#pause').click();
  await page.clock.runFor(3500);
  assert((await page.locator('#current').textContent()).includes('idle'));
  await page.locator('#demo').click(); await page.clock.runFor(4100);
  assert((await page.locator('#current').textContent()).includes('bored'));
  await page.locator('[data-action="waiting"]').click();
  assert.equal(await page.locator('#demo').getAttribute('aria-pressed'),'false');
  await page.clock.runFor(5100);
  assert((await page.locator('#current').textContent()).endsWith('waiting'));
  await page.locator('[data-action="sleep"]').click(); await page.clock.runFor(3600);
  const sleeping=await frame(); await page.clock.runFor(5000);
  assert.equal((await frame()).hash,sleeping.hash);
  await page.locator('[data-action="wake"]').click(); await page.clock.runFor(1200);
  assert((await page.locator('#current').textContent()).includes('idle'));
  await choose('oled');
  assert.deepEqual([(await frame()).width,(await frame()).height],[128,64]);
  await choose('tft');
  const tft=await frame(); assert.deepEqual([tft.width,tft.height],[240,240]);
  const padding = await page.locator('#screen').evaluate(canvas => {
    const ctx=canvas.getContext('2d');
    return [...ctx.getImageData(0,0,240,40).data, ...ctx.getImageData(0,200,240,40).data]
      .every((value,index) => index%4===3 ? value===255 : value===0);
  });
  assert(padding,'TFT must center 160px eye area with 40px black padding');
  await page.locator('#pause').click();
  const centered=await frame();
  const framingClock=await clock();
  await page.locator('#housing').uncheck();
  assert.equal((await frame()).hash,centered.hash,'housing must not change native pixels');
  assert.equal(await clock(),framingClock,'housing must not restart simulation');
  assert.equal(await page.locator('#device').evaluate(el=>el.classList.contains('bare')),true);
  await page.locator('#housing').check();
  await page.locator('#gx').fill('1');
  assert.notEqual((await frame()).hash,centered.hash);
  await page.locator('#center').click(); assert.equal((await frame()).hash,centered.hash);
  await page.locator('#fps [data-value="60"]').click();
  const before=Number.parseFloat(await clock());
  await page.locator('#step').click();
  assert(Math.abs(Number.parseFloat(await clock())-before-.02)<.001);
  await page.locator('#blink').uncheck(); await page.locator('#transitions').uncheck();
  for(const action of ['input','blocked','random','surprise','waiting-wave']) {
    await page.locator(`[data-action="${action}"]`).click();
    assert((await page.locator('#current').textContent()).endsWith(action));
  }
  await choose('eyes');
  await page.locator('[data-zoom="1"]').click();
  // Actual size: 240 px at the default 0.15 mm pitch, 96 CSS px per inch.
  const glassWidth=await page.locator('#glass').evaluate(el=>el.getBoundingClientRect().width);
  assert(Math.abs(glassWidth-240*.15*96/25.4)<.5,'actual-size zoom uses physical pixel pitch');
  await page.locator('[data-zoom="fit"]').click();
  // Panel character is display-only: the core framebuffer stays identical.
  const native=await frame();
  await page.locator('#raw-pixels').check(); await page.locator('#pixel-grid').uncheck();
  assert.equal((await frame()).hash,native.hash,'panel effects must not change native pixels');
  await page.locator('#raw-pixels').uncheck(); await page.locator('#pixel-grid').check();
  // Layout is remembered per screen.
  await choose('landscape');
  await page.locator('#face-scale').fill('1.5');
  await choose('portrait');
  assert.equal(await page.locator('#face-scale').inputValue(),'1');
  await choose('landscape');
  assert.equal(await page.locator('#face-scale').inputValue(),'1.5');
  await page.locator('#layout-reset').click();
  assert.equal(await page.locator('#face-scale').inputValue(),'1');
  // Rotating a rectangular module re-renders the framebuffer in the new orientation.
  await choose('t-display-s3');
  assert.deepEqual([(await frame()).width,(await frame()).height],[320,170]);
  await page.locator('#rotate').click();
  assert.deepEqual([(await frame()).width,(await frame()).height],[170,320]);
  await page.locator('#next-profile').click();
  assert.equal(await page.locator('#profile').inputValue(),'t-display-114');
  await page.locator('#prev-profile').click();
  assert.equal(await page.locator('#profile').inputValue(),'t-display-s3');
  // Every preset, reference or generic housing, renders its native framebuffer.
  for(const item of await page.evaluate(()=>SCREEN_PRESETS.map(preset=>preset.id))) {
    await choose(item);
    assert((await frame()).lit>0,'eyes visible on '+item);
  }
  await choose('eyes');
  await page.setViewportSize({width:390,height:844});
  const overflowing=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  assert.equal(overflowing,false,'mobile layout must not overflow');
  await choose('round');
  // A type chip narrows the picker to that type; the bus line estimates frame rate.
  assert.deepEqual(await page.locator('#profile option').evaluateAll(options=>[...new Set(options.map(o=>SCREEN_PRESETS.find(p=>p.id===o.value).group))]),['round']);
  assert((await page.locator('#bus-note').textContent()).startsWith('SPI'));
  await choose('ssd1306-091');
  assert.match(await page.locator('#bus-note').textContent(),/^I²C .*FPS/);
  await choose('round');
  assert.deepEqual([(await frame()).width,(await frame()).height],[240,240]);
  await choose('custom');
  await page.locator('#custom-width').fill('172');await page.locator('#custom-height').fill('320');
  await page.locator('#custom-shape').selectOption('0');await page.locator('#apply-size').click();
  assert.deepEqual([(await frame()).width,(await frame()).height],[172,320]);
  await page.locator('#custom-shape').selectOption('1');await page.locator('#apply-size').click();
  assert((await page.locator('#size-error').textContent()).length>0);
  assert.equal((await frame()).width,172,'invalid custom size leaves valid framebuffer intact');
  if(process.env.PREVIEW_SCREENSHOT) await page.screenshot({path:process.env.PREVIEW_SCREENSHOT,fullPage:true});
  assert.deepEqual(errors,[]); assert.deepEqual(external,[]);
  console.log(`Offline ${engine} UI passed: all controls, pause/step, native animation, cycling/manual interruption, sleep/wake, OLED/TFT, gaze, reset, actual size, display-only panel effects, per-screen layout, rotation, screen types, every preset, responsive layout; no network requests.`);
} finally { await browser.close(); }
