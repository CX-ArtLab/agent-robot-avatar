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
    'agent-robot-avatar.js',
    'index.d.ts',
    'src/agent-robot-avatar-core.js',
    'src/agent-robot-avatar-actions.js',
    'src/agent-robot-avatar-antenna.js',
    'src/agent-robot-avatar-extension-host.js',
    'src/agent-robot-avatar-version.js',
    'src/agent-robot-avatar-waiting.js',
    'src/agent-robot-avatar-antenna-flash.js',
    'src/agent-robot-avatar-inspect.js',
    'src/agent-robot-avatar-failure.js',
    'src/agent-robot-avatar-head-roundness.js',
  ];

  for (const file of required) assert.ok(files.has(file), `Missing package file: ${file}`);
  assert.ok([...files].every(file => !file.startsWith('demo/')), 'Demo files must not ship in the package');

  for (const file of required.filter(file => file.endsWith('.js'))) {
    const source = await readFile(path.join(root, file), 'utf8');
    assert.doesNotMatch(source, /from\s+['"][^'"]+\?v=/, `Cache query remains in ${file}`);
    assert.doesNotMatch(source, /AgentRobotAvatarDemo/, `Demo global remains in ${file}`);
  }

  for (const file of [
    'src/agent-robot-avatar-actions.js',
    'src/agent-robot-avatar-antenna.js',
    'src/agent-robot-avatar-waiting.js',
    'src/agent-robot-avatar-antenna-flash.js',
    'src/agent-robot-avatar-inspect.js',
    'src/agent-robot-avatar-failure.js',
  ]) {
    const source = await readFile(path.join(root, file), 'utf8');
    assert.doesNotMatch(source, /proto\.(play|reset|_draw)\s*=/, `Legacy method wrapper remains in ${file}`);
  }

  const extensionHost = await readFile(path.join(root, 'src/agent-robot-avatar-extension-host.js'), 'utf8');
  assert.match(extensionHost, /proto\.play\s*=/, 'Extension host must own play routing');
  assert.match(extensionHost, /proto\.reset\s*=/, 'Extension host must own reset routing');
  assert.match(extensionHost, /proto\._draw\s*=/, 'Extension host must own frame drawing');
});

test('version is consistent across the package, runtime, and demo', async () => {
  const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  const runtime = await import(pathToFileURL(path.join(root, 'agent-robot-avatar.js')).href);
  const demo = await readFile(path.join(root, 'demo', 'index.html'), 'utf8');

  assert.equal(runtime.VERSION, packageJson.version);
  assert.match(packageJson.version, /^\d+\.\d+\.\d+(?:-rc\.\d+)?$/);
  assert.match(demo, /AgentRobotAvatarDemoBuild = VERSION/);
  assert.doesNotMatch(demo, /agent-robot-avatar\.js\?v=|demoVersion/);
});

test('packed package installs and can be imported without browser globals', async () => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'agent-robot-avatar-'));
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
      "import('agent-robot-avatar').then(module => console.log(Object.keys(module).sort().join(',')))",
    ], { cwd: consumer });
    assert.match(imported, /AgentRobotAvatar,VERSION,default/);

    const packageJson = JSON.parse(await readFile(path.join(consumer, 'node_modules', 'agent-robot-avatar', 'package.json'), 'utf8'));
    assert.notEqual(packageJson.sideEffects, false);
    assert.equal(packageJson.types, './index.d.ts');
    assert.equal(packageJson.exports['.'].types, './index.d.ts');
    assert.equal(packageJson.publishConfig.registry, 'https://registry.npmjs.org/');
    assert.equal(packageJson.publishConfig.access, 'public');
    const expectedTag = packageJson.version.includes('-') ? 'next' : 'latest';
    assert.match(packageJson.scripts['release:check'], new RegExp(`--tag ${expectedTag}`));
    assert.match(packageJson.scripts.prepublishOnly, /check-publish-tag/);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
