import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash, randomFillSync } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(join(root, 'preview/agent-robot-eyes-preview.html'), 'utf8');
const encoded = html.match(/const WASM_BASE64 = '([^']+)'/)[1];
const module = await WebAssembly.compile(Buffer.from(encoded, 'base64'));
assert.deepEqual(WebAssembly.Module.imports(module), [
  {module:'wasi_snapshot_preview1',name:'random_get',kind:'function'}
], 'only browser-local entropy for libc initialization is allowed');
let api;
const instance = await WebAssembly.instantiate(module, { wasi_snapshot_preview1: {
  random_get(pointer,length) { randomFillSync(new Uint8Array(api.memory.buffer,pointer,length)); return 0; }
} });
api = instance.exports;
api._initialize();
const sourcePaths = ['lib/AgentRobotEyes/src/AgentRobotEyes.h','lib/AgentRobotEyes/src/AgentRobotEyes.cpp','lib/AgentRobotEyes/src/AgentRobotGaze.h','lib/AgentRobotEyes/src/AgentRobotWebMotion.h','preview/bridge.cpp'];
const hash = createHash('sha256');
for (const path of sourcePaths) hash.update(await readFile(join(root, path)));
const sourceHash = hash.digest('hex');
assert(html.includes(sourceHash), 'rebuild preview after modifying core/bridge');
const ui = await readFile(join(root, 'preview/ui.js'), 'utf8');
const template = await readFile(join(root, 'preview/index.template.html'), 'utf8');
const escape = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const license = await readFile(join(root, 'lib/AgentRobotEyes/LICENSE'), 'utf8').catch(() => readFile(join(root, '../LICENSE'), 'utf8'));
const notices = await readFile(join(root, 'preview/third-party-notices.txt'), 'utf8');
const demoCSS = await readFile(join(root,'preview/project-demo.css'),'utf8');
const presets = JSON.parse(await readFile(join(root,'preview/presets.json'),'utf8'));
assert.equal(html, template.replace('/*__WASM__*/', `const WASM_BASE64 = '${encoded}';\nconst CORE_SHA256 = '${sourceHash}';`)
  .replace('/*__PRESETS__*/',`const SCREEN_PRESETS = ${JSON.stringify(presets)};`)
  .replace('/*__PROJECT_CSS__*/',demoCSS)
  .replace('/*__UI__*/',ui).replace('__LICENSE__',escape(license)).replace('__THIRD_PARTY__',escape(notices)),
  'rebuild preview after modifying HTML/UI/notices');

const commands = [], expected = [];
let frames = 0;
function command(op, ...args) {
  commands.push([op,...args].join(' '));
  if (op === 'init') expected.push({ result: String(api.eyes_init(...args)) });
  if (op === 'play') expected.push({ result: String(api.eyes_play(...args)) });
  if (op === 'gaze') { api.eyes_gaze(...args); expected.push({ result: 'ok' }); }
  if (op === 'layout') expected.push({result:String(api.eyes_layout(...args))});
  if (op === 'tracking') {api.eyes_tracking(...args);expected.push({result:'ok'});}
  if (op === 'target') {api.eyes_target(...args);expected.push({result:'ok'});}
  if (op === 'motion') {api.eyes_motion_target(...args);expected.push({result:'ok'});}
  if (op === 'gazeconfig') expected.push({result:String(api.eyes_gaze_config(...args))});
  if (op === 'update') {
    const changed = api.eyes_update(...args), action = api.eyes_action();
    const pixels = Buffer.from(new Uint8Array(api.memory.buffer, api.eyes_data(), api.eyes_size()));
    expected.push({ changed, action, pixels }); frames++;
  }
}
assert.equal(api.eyes_init(513,160,25,1,240,0), 0);
assert.equal(api.eyes_init(240,160,0,1,240,0), 0);
for (const [w,h] of [[240,160],[128,64],[41,23]]) {
  for (let action=0;action<18;action++) {
    command('init',w,h,25,1,240,0); command('update',0); command('play',action,100);
    for (const t of [100,110,140,220,340,700,1300,2100,2990,3900,4300,5000]) command('update',t);
  }
  command('init',w,h,60,0,0,0); command('gaze',-1,1); command('update',0);
  command('play',6,100); command('update',500); command('play',2,510);
  command('update',4000); command('play',15,4100); command('update',4500); command('update',9000);
  command('play',16,9010); command('update',9900); command('gaze',0,0); command('update',9910);
  command('play',-1,9920); command('play',18,9920);
  const start = 0xffffff9b;
  command('init',w,h,30,0,240,start); command('update',start);
  command('play',6,(start+50)>>>0); command('update',(start+400)>>>0); command('update',(start+1900)>>>0);
}
for(const preset of presets) {
  command('init',preset.width,preset.height,25,1,240,0);
  command('layout',...(preset.viewport||[0,0,0,0]),0,preset.frame==='round'?1:0,1,0,0);
  command('play',13,0);
  for(const t of [0,40,300,900,1700,3000])command('update',t);
  command('layout',0,0,0,0,1,preset.frame==='round'?1:0,1.25,.1,-.1);
  command('update',3100);
  command('tracking',1,3200);
  command('target',.8,-.5,.8,1,3200);
  for(let t=3200;t<=3600;t+=40){command('target',.8,-.5,.8,1,t);command('update',t);}
  command('target',-1,1,.2,1,3650);
  for(const t of [3650,4000,4250,5000])command('update',t);
  command('gazeconfig',.5,.4,600,140,1);
  command('motion',-.7,.8,.8,1,0,5100);command('update',5200);
  command('motion',-.7,.8,.8,1,1,5300);command('update',5400);
  command('motion',-.7,.8,.8,1,0,5600);command('update',6000);command('update',6500);
}
const temp = await mkdtemp(join(tmpdir(),'eyes-preview-test-'));
try {
  const binary = join(temp,'oracle');
  execFileSync(process.env.CXX || 'g++', ['-std=c++11','-O2','-Wall','-Wextra','-Werror','-pedantic',
    '-I',join(root,'lib/AgentRobotEyes/src'), join(root,'lib/AgentRobotEyes/src/AgentRobotEyes.cpp'),
    join(root,'preview/bridge.cpp'),join(root,'tests/preview-oracle.cpp'),'-o',binary], { stdio:'inherit' });
  const lines = execFileSync(binary, { input:commands.join('\n')+'\n', encoding:'utf8', maxBuffer:32*1024*1024 }).trim().split('\n');
  assert.equal(lines.length, expected.length);
  let totalDifferent = 0, maxDifferent = 0;
  for (let i=0;i<lines.length;i++) {
    const expectedLine = expected[i];
    if ('result' in expectedLine) { assert.equal(lines[i],expectedLine.result,commands[i]); continue; }
    const [changed,action,hex] = lines[i].split(' ');
    assert.equal(Number(changed),expectedLine.changed,commands[i]+' frame scheduling');
    assert.equal(Number(action),expectedLine.action,commands[i]+' active action');
    const native = Buffer.from(hex,'hex');
    assert.equal(native.length,expectedLine.pixels.length);
    let different=0;
    for (let j=0;j<native.length;j++) {
      let bits=native[j]^expectedLine.pixels[j];
      while(bits) { different+=bits&1; bits>>>=1; }
    }
    // libm/compiler floating point differences may move a boundary by a pixel.
    assert(different <= 8, `${commands[i]}: ${different} differing pixels`);
    maxDifferent = Math.max(maxDifferent,different); totalDifferent+=different;
  }
  console.log(`Preview parity: ${frames} native/WASM frames, all 18 actions, 9 screen presets, layout/circle clipping, proximity, gaze, interruption, sleep, rollover; max ${maxDifferent} differing boundary pixels (${totalDifferent} total).`);
} finally { await rm(temp,{recursive:true,force:true}); }
