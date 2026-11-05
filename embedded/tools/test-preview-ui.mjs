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
const file = pathToFileURL(resolve(root,'embedded/preview/boopface-embedded-preview.html')).href;
// Simulated time in seconds, as shown in the playback bar.
const clock = async () => (await page.locator('#clock').textContent()).replace(/[^\d.]/g,'');
const frame = () => page.locator('#screen').evaluate(canvas => {
  const bytes = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
  let hash=2166136261, lit=0;
  for(let i=0;i<bytes.length;i+=4) { hash=Math.imul(hash^bytes[i],16777619)>>>0; if(bytes[i])lit++; }
  return { hash,lit,width:canvas.width,height:canvas.height };
});
const choose = async id => {
  // The picker lists one screen type at a time: pick the type tab, then the
  // screen. The 自定义 tab opens the raw canvas with editable size instead.
  const group = await page.evaluate(id => id === 'custom' ? 'other' : SCREEN_PRESETS.find(item => item.id === id).group || 'other', id);
  await page.locator(`[data-group="${group}"]`).click();
  if (group !== 'other') {
    await page.locator('#profile').click();
    await page.locator(`#profile-list [data-value="${id}"]`).click();
  }
};
const glassBox = () => page.locator('#glass').evaluate(el => { const r = el.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(Math.round); });
try {
  await page.clock.install();
  await page.goto(file);
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true');
  // The eyes follow a simulated object; the switch names the sensor it needs.
  assert.match(await page.locator('#follow').locator('..').getAttribute('title'),/摄像头/);
  // The Web demo's 17 buttons: one of them sleeps and wakes.
  assert.equal(await page.locator('.action').count(),17);
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
  await page.locator('#demo').click();
  assert.equal(await page.locator('#demo').getAttribute('aria-pressed'),'true');
  assert((await page.locator('#demo').textContent()).includes('轮播中'),'running cycle is labelled');
  await page.clock.runFor(4100);
  assert((await page.locator('#current').textContent()).includes('bored'));
  await page.locator('[data-action="waiting-spin"]').click();
  assert.equal(await page.locator('#demo').getAttribute('aria-pressed'),'false');
  await page.clock.runFor(5100);
  assert((await page.locator('#current').textContent()).startsWith('waiting-spin'));
  await page.locator('[data-action="sleep"]').click(); await page.clock.runFor(3600);
  const sleeping=await frame(); await page.clock.runFor(5000);
  assert.equal((await frame()).hash,sleeping.hash);
  assert.equal(await page.locator('[data-action="sleep"]').textContent(),'醒来');
  await page.locator('[data-action="sleep"]').click(); await page.clock.runFor(1200);
  assert.equal(await page.locator('[data-action="sleep"]').textContent(),'睡着');
  assert((await page.locator('#current').textContent()).includes('idle'));
  await choose('oled');
  assert.deepEqual([(await frame()).width,(await frame()).height],[128,64]);
  await choose('tft');
  const tft=await frame(); assert.deepEqual([tft.width,tft.height],[240,240]);
  // A square module turns too; its eyes keep the same layout.
  await page.locator('#rotate').click();
  assert.equal(await page.locator('#device').getAttribute('data-rotation'),'90');
  // The export carries the turn, and the whole panel once the layout leaves the preset.
  await page.locator('[data-fit="contain"]').click();
  await page.locator('#export').click();
  assert.match(await page.locator('#export-code').textContent(),/#define EYES_FULL_PANEL 1/);
  assert.match(await page.locator('#export-code').textContent(),/#define EYES_TURN 3/);
  await page.locator('#export-close').click();
  await page.locator('[data-fit="preset"]').click();
  await page.locator('#rotate').click();
  const padding = await page.locator('#screen').evaluate(canvas => {
    const ctx=canvas.getContext('2d');
    return [...ctx.getImageData(0,0,240,40).data, ...ctx.getImageData(0,200,240,40).data]
      .every((value,index) => index%4===3 ? value===255 : value===0);
  });
  assert(padding,'TFT must center 160px eye area with 40px black padding');
  await page.locator('#pause').click();
  const centered=await frame();
  const framingClock=await clock(), framed=await glassBox();
  await page.locator('#housing').uncheck();
  assert.deepEqual(await glassBox(),framed,'hiding the housing keeps the screen in place');
  assert.equal((await frame()).hash,centered.hash,'housing must not change native pixels');
  assert.equal(await clock(),framingClock,'housing must not restart simulation');
  assert.equal(await page.locator('#device').evaluate(el=>el.classList.contains('bare')),true);
  await page.locator('#housing').check();
  // A pointer inside the sensing ring is the nearby object; the eyes look at it.
  await page.locator('#blink').uncheck();
  await page.locator('#pause').click();
  const lookAt = async () => {
    const box = await page.locator('#device').boundingBox();
    await page.mouse.move(box.x + box.width + 30, box.y + box.height / 2);
    await page.clock.runFor(1500);
    return (await frame()).hash;
  };
  assert.notEqual(await lookAt(),centered.hash,'the eyes follow the object');
  await page.mouse.move(0, 0); await page.clock.runFor(2500);
  assert.equal((await frame()).hash,centered.hash,'the eyes return when the object leaves');
  // With following off, the same object leaves the eyes alone.
  await page.locator('#follow').uncheck();
  assert.equal(await page.locator('#sense-zone').isHidden(),true);
  assert.equal(await lookAt(),centered.hash,'following off keeps the eyes centred');
  await page.mouse.move(0, 0);
  await page.locator('#follow').check();
  await page.locator('#blink').check();
  await page.locator('#pause').click();
  // The frame-rate cap follows the screen; changing timing keeps the animation.
  assert.match(await page.locator('#fps [data-value="max"]').textContent(),/^当前屏幕上限 \d+$/);
  assert.equal(await page.locator('#fps [data-value="60"]').count(),0,'tiers above the screen limit are not offered');
  await page.locator('[data-action="love"]').click();
  for(let i=0;i<5;i++) await page.locator('#step').click();
  const loving=await clock();
  await page.locator('#fps [data-value="15"]').click();
  assert.equal(await clock(),loving,'changing the frame rate does not restart');
  assert((await page.locator('#current').textContent()).startsWith('love'));
  const before=Number.parseFloat(await clock());
  await page.locator('#step').click();
  // One 15 FPS frame is 67 ms; the clock shows hundredths, so allow its rounding.
  assert(Math.abs(Number.parseFloat(await clock())-before-.067)<=.011);
  await page.locator('#blink').uncheck(); await page.locator('#transitions').uncheck();
  assert((await page.locator('#current').textContent()).startsWith('love'),'blink/transition switches keep the action');
  for(const action of ['input','angry','random','surprise','waiting-wave']) {
    await page.locator(`[data-action="${action}"]`).click();
    assert((await page.locator('#current').textContent()).startsWith(action+' '));
  }
  await choose('custom');
  await page.locator('[data-zoom="1"]').click();
  // Actual size: 240 px at the default 0.15 mm pitch, 96 CSS px per inch.
  const glassWidth=await page.locator('#glass').evaluate(el=>el.getBoundingClientRect().width);
  assert(Math.abs(glassWidth-240*.15*96/25.4)<.5,'actual-size zoom uses physical pixel pitch');
  await page.locator('[data-zoom="fit"]').click();
  // The zoom slider runs from small to past the fitted size.
  const fitted=await glassBox();
  await page.locator('#zoom').fill('0');
  assert((await glassBox())[2]<fitted[2],'zoom slider shrinks the module');
  // Past the fitted size the slider zooms until the screen fills 80% of the stage.
  await page.locator('#zoom').fill('1000');
  const zoomed=await glassBox(), stage=await page.locator('#stage').evaluate(el=>[el.clientWidth,el.clientHeight]);
  assert(zoomed[2]>fitted[2],'zoom goes past the fitted size');
  assert(Math.abs(Math.max(zoomed[2]/stage[0],zoomed[3]/stage[1])-.8)<.02,'largest zoom fills 80% of the stage');
  await page.locator('[data-zoom="fit"]').click();
  assert.deepEqual(await glassBox(),fitted,'fit returns to the whole module');
  assert(await page.locator('#stage').evaluate(el=>el.scrollWidth<=el.clientWidth&&el.scrollHeight<=el.clientHeight),'no scrolling');
  // Panel character is display-only: the core framebuffer stays identical.
  const native=await frame();
  await page.locator('#pixel-grid').uncheck();
  assert.equal((await frame()).hash,native.hash,'panel effects must not change native pixels');
  await page.locator('#pixel-grid').check();
  // Swapping the colours trades eye and background on screen.
  await page.locator('#color-swap').click();
  assert.deepEqual(await page.evaluate(()=>[document.getElementById('eye-color').value,document.getElementById('bg-color').value]),['#000000','#ffffff']);
  // A palette puts the face colour on the panel and the background colour in the eyes.
  await page.locator('#palettes [title="Claude"]').click();
  assert.deepEqual(await page.evaluate(()=>[document.getElementById('eye-color').value,document.getElementById('bg-color').value]),['#faf9f5','#d97757']);
  assert.equal(await page.locator('#palettes [title="Claude"]').getAttribute('aria-pressed'),'true');
  // Export writes the chosen settings as eyes_settings.h for the firmware.
  await page.locator('#export').click();
  const exported=await page.locator('#export-code').textContent();
  assert.match(exported,/#define EYES_INK_RGB 0xFAF9F5/);
  assert.match(exported,/#define EYES_BACKGROUND_RGB 0xD97757/);
  assert.match(exported,/#define EYES_ZOOM \d\.\d\df/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#export-sheet').isHidden(),true);
  await page.locator('#color-reset').click();
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
  assert.equal(await page.locator('#profile').getAttribute('data-value'),'t-display-114');
  await page.locator('#prev-profile').click();
  assert.equal(await page.locator('#profile').getAttribute('data-value'),'t-display-s3');
  // Every preset, reference or generic housing, renders its native framebuffer.
  for(const item of await page.evaluate(()=>SCREEN_PRESETS.map(preset=>preset.id))) {
    await choose(item);
    assert((await frame()).lit>0,'eyes visible on '+item);
  }
  await choose('custom');
  await page.setViewportSize({width:390,height:844});
  const overflowing=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  assert.equal(overflowing,false,'mobile layout must not overflow');
  await choose('round');
  // A type chip narrows the picker to that type; the bus line estimates frame rate.
  assert.deepEqual(await page.locator('#profile-list [data-value]').evaluateAll(options=>[...new Set(options.map(o=>SCREEN_PRESETS.find(p=>p.id===o.dataset.value).group))]),['round']);
  assert.match(await page.locator('#screen-spec').textContent(),/SPI 40 MHz/);
  // Screens with a firmware example show the board, build command and wiring.
  await choose('gc9a01-128');
  assert.equal(await page.locator('#wiring-body').evaluate(el=>el.hidden),false);
  assert.match(await page.locator('#wiring-body').textContent(),/pio run -e esp32-s3-gc9a01/);
  assert((await page.locator('#wiring-body tr').count())>=6,'external modules list their wiring');
  await choose('esp32s3-round-128');
  assert.match(await page.locator('#wiring-body').textContent(),/无需接线/);
  await choose('custom');
  assert.equal(await page.locator('#wiring-body').evaluate(el=>el.hidden),true);
  assert.match(await page.locator('#screen-support').textContent(),/仅效果预览/);
  await choose('ssd1306-091');
  assert.match(await page.locator('#screen-spec').textContent(),/I²C/);
  assert.equal(await page.locator('#spec-res').textContent(),'128 × 32');
  assert.equal(await page.locator('#spec-color').textContent(),'单色');
  assert.match(await page.locator('#spec-fps').textContent(),/最高约 \d+ FPS/);
  await choose('round');
  assert.deepEqual([(await frame()).width,(await frame()).height],[240,240]);
  await choose('custom');
  await page.locator('#custom-width').fill('172');await page.locator('#custom-height').fill('320');
  await page.locator('#custom-height').press('Enter');
  assert.deepEqual([(await frame()).width,(await frame()).height],[172,320]);
  await page.locator('#custom-shape [data-value="1"]').click();
  assert((await page.locator('#size-error').textContent()).length>0);
  assert.equal((await frame()).width,172,'invalid custom size leaves valid framebuffer intact');
  // A custom screen can be a colour panel or a monochrome OLED.
  await page.locator('#custom-shape [data-value="0"]').click();
  assert.equal(await page.locator('#spec-color').textContent(),'彩色');
  await page.locator('#custom-panel [data-value="oled"]').click();
  assert.equal(await page.locator('#spec-color').textContent(),'单色');
  assert.equal(await page.locator('#palettes').isHidden(),true);
  if(process.env.PREVIEW_SCREENSHOT) await page.screenshot({path:process.env.PREVIEW_SCREENSHOT,fullPage:true});
  assert.deepEqual(errors,[]); assert.deepEqual(external,[]);
  console.log(`Offline ${engine} UI passed: all controls, pause/step, native animation, cycling/manual interruption, sleep/wake, OLED/TFT, gaze, reset, cycling state, housing in place, zoom without scrolling, timing without restart, actual size, display-only panel effects, per-screen layout, rotation, screen types, wiring examples, custom size, every preset, responsive layout; no network requests.`);
} finally { await browser.close(); }
