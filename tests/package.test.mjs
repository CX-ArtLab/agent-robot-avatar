import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const npmCli = process.env.npm_execpath;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    ...options,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}

function runNpm(args, options = {}) {
  assert.ok(npmCli, 'npm_execpath is required; run this test through npm');
  return run(process.execPath, [npmCli, ...args], options);
}

test('package contains the complete runtime and excludes the demo', async () => {
  const output = runNpm(['pack', '--dry-run', '--json']);
  const [pack] = JSON.parse(output);
  const files = new Set(pack.files.map(file => file.path));
  const required = [
    'boopface.js',
    'boopface-lite.js',
    'index.d.ts',
    'lite.d.ts',
    'src/boopface-skins.js',
    'src/skins/catalog.js',
    'src/boopface-core.js',
    'src/boopface-geometry.js',
    'src/boopface-actions.js',
    'src/boopface-antenna.js',
    'src/boopface-extension-host.js',
    'src/boopface-version.js',
    'src/boopface-waiting.js',
    'src/boopface-inspect.js',
    'src/boopface-failure.js',
    'src/boopface-love.js',
    'src/boopface-random.js',
    'src/boopface-head-roundness.js',
    'src/boopface-runtime.js',
  ];

  for (const file of required) assert.ok(files.has(file), `Missing package file: ${file}`);
  // Only what a page runs: no demo, examples, translated docs or images.
  for (const folder of ['demo/', 'examples/', 'docs/', 'assets/', 'tests/']) {
    assert.ok([...files].every(file => !file.startsWith(folder)), `${folder} must not ship in the package`);
  }

  for (const file of required.filter(file => file.endsWith('.js'))) {
    const source = await readFile(path.join(root, file), 'utf8');
    assert.doesNotMatch(source, /from\s+['"][^'"]+\?v=/, `Cache query remains in ${file}`);
    assert.doesNotMatch(source, /BoopFaceDemo/, `Demo global remains in ${file}`);
  }

  for (const file of [
    'src/boopface-actions.js',
    'src/boopface-antenna.js',
    'src/boopface-waiting.js',
    'src/boopface-inspect.js',
    'src/boopface-failure.js',
    'src/boopface-love.js',
    'src/boopface-random.js',
  ]) {
    const source = await readFile(path.join(root, file), 'utf8');
    assert.doesNotMatch(source, /proto\.(play|reset|_draw)\s*=/, `Legacy method wrapper remains in ${file}`);
  }

  const extensionHost = await readFile(path.join(root, 'src/boopface-extension-host.js'), 'utf8');
  assert.match(extensionHost, /proto\.play\s*=/, 'Extension host must own play routing');
  assert.match(extensionHost, /proto\.reset\s*=/, 'Extension host must own reset routing');
  assert.match(extensionHost, /proto\._draw\s*=/, 'Extension host must own frame drawing');
});

test('version is consistent across the package, runtime, and demo', async () => {
  const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  const runtime = await import(pathToFileURL(path.join(root, 'boopface.js')).href);
  const demo = await readFile(path.join(root, 'demo', 'index.html'), 'utf8');
  const demoRuntime = await readFile(path.join(root, 'demo', 'boopface-demo.js'), 'utf8');

  assert.equal(runtime.VERSION, packageJson.version);
  assert.match(packageJson.version, /^\d+\.\d+\.\d+(?:-rc\.\d+)?$/);
  assert.match(demo, /<script type="module" src="\.\/boopface-demo\.js"><\/script>/);
  assert.match(demoRuntime, /BoopFaceDemoBuild = VERSION/);
  assert.doesNotMatch(demo, /boopface\.js\?v=|demoVersion/);
});

test('packed package installs and can be imported without browser globals', async () => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'boop-face-'));
  const consumer = path.join(temporaryRoot, 'consumer');
  await mkdir(consumer);
  await writeFile(path.join(consumer, 'package.json'), '{"type":"module"}\n');

  try {
    const output = runNpm(['pack', '--json', '--pack-destination', temporaryRoot]);
    const [pack] = JSON.parse(output);
    const tarball = path.join(temporaryRoot, pack.filename);
    runNpm(['install', '--ignore-scripts', '--no-audit', '--no-fund', tarball], { cwd: consumer });
    const imported = run(process.execPath, [
      '--input-type=module',
      '--eval',
      "import('boopface').then(module => console.log(Object.keys(module).sort().join(',')))",
    ], { cwd: consumer });
    assert.match(imported, /BoopFace,SKINS,SKIN_NAMES,SKIN_SERIES,VERSION,default,loadSkins/);
    const lite = run(process.execPath, [
      '--input-type=module',
      '--eval',
      "import('boopface/lite').then(module => console.log(Object.keys(module).sort().join(',')))",
    ], { cwd: consumer });
    assert.match(lite, /BoopFace,VERSION,default/);

    const packageJson = JSON.parse(await readFile(path.join(consumer, 'node_modules', 'boopface', 'package.json'), 'utf8'));
    assert.notEqual(packageJson.sideEffects, false);
    assert.equal(packageJson.types, './index.d.ts');
    assert.equal(packageJson.exports['.'].types, './index.d.ts');
    assert.equal(packageJson.publishConfig.registry, 'https://registry.npmjs.org/');
    assert.equal(packageJson.publishConfig.access, 'public');
    // Prereleases are published by the workflow and guarded by check-publish-tag.
    if (!packageJson.version.includes('-')) assert.match(packageJson.scripts['release:check'], /--tag latest/);
    assert.match(packageJson.scripts.prepublishOnly, /check-publish-tag/);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});


test('Pages build resolves both its component preload and import at the deployment root', async () => {
  run(process.execPath, ['scripts/build-pages.mjs']);
  const html = await readFile(path.join(root, '.pages-site', 'index.html'), 'utf8');
  const demoRuntime = await readFile(path.join(root, '.pages-site', 'boopface-demo.js'), 'utf8');
  assert.doesNotMatch(html, /\.\.\/boopface\.js/);
  assert.doesNotMatch(demoRuntime, /\.\.\/boopface\.js/);
  const preloads = [...html.matchAll(/rel="modulepreload" href="([^"]+)"/g)].map(match => match[1]);
  assert.ok(preloads.includes('./boopface.js'));
  assert.match(html, /src="\.\/boopface-demo\.js"/);
  assert.match(demoRuntime, /import\('\.\/boopface\.js'\)/);
  for (const preload of preloads) {
    await readFile(path.join(root, '.pages-site', preload), 'utf8');
  }
});
