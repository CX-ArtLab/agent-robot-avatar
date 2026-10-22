import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const preview = join(root, 'preview');
const temp = await mkdtemp(join(tmpdir(), 'robot-eyes-preview-'));
const zig = process.env.ZIG || 'zig';
const exported = ['eyes_init', 'eyes_play', 'eyes_gaze', 'eyes_update', 'eyes_action', 'eyes_data', 'eyes_size', 'eyes_stride',
  'eyes_layout','eyes_tracking','eyes_target','eyes_motion_target','eyes_gaze_config','eyes_is_tracking','eyes_duration'];
try {
  const version = execFileSync(zig, ['version'], { encoding: 'utf8' }).trim();
  if (version !== '0.13.0') throw new Error(`Use Zig 0.13.0 for reproducible preview builds (found ${version}).`);
  const wasmPath = join(temp, 'eyes.wasm');
  execFileSync(zig, ['build-exe', '-target', 'wasm32-wasi', '-mexec-model=reactor', '-lc', '-O', 'ReleaseFast',
    '-I', join(root, 'lib/AgentRobotEyes/src'),
    '-cflags', '-std=c++11', '-fno-exceptions', '-fno-rtti', '-Wall', '-Wextra', '-Werror', '--',
    join(root, 'lib/AgentRobotEyes/src/AgentRobotEyes.cpp'), join(preview, 'bridge.cpp'),
    ...exported.map(name => `--export=${name}`), '-fstrip', `-femit-bin=${wasmPath}`], { stdio: 'inherit' });
  const wasm = await readFile(wasmPath);
  const module = new WebAssembly.Module(wasm);
  const imports = WebAssembly.Module.imports(module);
  // WASI libc initializes its stack-protection seed from browser-local entropy.
  // No filesystem, clock, network, process or other WASI capability is provided.
  if (imports.some(x => x.module !== 'wasi_snapshot_preview1' || x.name !== 'random_get' || x.kind !== 'function'))
    throw new Error('Unexpected imports: ' + JSON.stringify(imports));
  const sourcePaths = ['lib/AgentRobotEyes/src/AgentRobotEyes.h', 'lib/AgentRobotEyes/src/AgentRobotEyes.cpp', 'lib/AgentRobotEyes/src/AgentRobotGaze.h', 'lib/AgentRobotEyes/src/AgentRobotWebMotion.h', 'preview/bridge.cpp'];
  const hash = createHash('sha256');
  for (const path of sourcePaths) hash.update(await readFile(join(root, path)));
  const sourceHash = hash.digest('hex');
  const ui = await readFile(join(preview, 'ui.js'), 'utf8');
  const demoCSS = await readFile(join(preview, 'project-demo.css'), 'utf8');
  const presets = JSON.parse(await readFile(join(preview, 'presets.json'), 'utf8'));
  const template = await readFile(join(preview, 'index.template.html'), 'utf8');
  const license = await readFile(join(root, 'lib/AgentRobotEyes/LICENSE'), 'utf8').catch(() => readFile(join(root, '../LICENSE'), 'utf8'));
  const notices = await readFile(join(preview, 'third-party-notices.txt'), 'utf8');
  const escape = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const html = template.replace('/*__WASM__*/', `const WASM_BASE64 = '${wasm.toString('base64')}';\nconst CORE_SHA256 = '${sourceHash}';`)
    .replace('/*__PRESETS__*/', `const SCREEN_PRESETS = ${JSON.stringify(presets)};`)
    .replace('/*__PROJECT_CSS__*/', demoCSS)
    .replace('/*__UI__*/', ui).replace('__LICENSE__', escape(license)).replace('__THIRD_PARTY__', escape(notices));
  const output = resolve(process.argv[2] || join(preview, 'agent-robot-eyes-preview.html'));
  await writeFile(output, html);
  console.log(`Built offline preview: ${output} (${html.length} characters; core ${sourceHash.slice(0,12)})`);
} finally {
  await rm(temp, { recursive: true, force: true });
}
