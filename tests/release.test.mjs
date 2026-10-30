import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const guard = path.join(root, 'scripts', 'check-publish-tag.mjs');

function runGuard(version, tag) {
  return spawnSync(process.execPath, [guard], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, npm_package_version: version, npm_config_tag: tag },
  });
}

test('stable release accepts the latest npm tag', () => {
  const result = runGuard('0.2.0', 'latest');
  assert.equal(result.status, 0, result.stderr);
});

test('release candidate accepts the next npm tag', () => {
  const result = runGuard('0.2.0-rc.1', 'next');
  assert.equal(result.status, 0, result.stderr);
});

test('release candidate rejects the latest npm tag', () => {
  const result = runGuard('0.2.0-rc.1', 'latest');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Refusing to publish prerelease/);
});

test('every README shows the package version in its badge and project status', async () => {
  const { readFile, readdir } = await import('node:fs/promises');
  const { version } = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  const docs = (await readdir(path.join(root, 'docs'))).filter(name => /^README\..+\.md$/.test(name));
  for (const file of ['README.md', ...docs.map(name => path.join('docs', name))]) {
    const text = await readFile(path.join(root, file), 'utf8');
    const versions = [...text.matchAll(/badge\/version-v([\d.]+)-|\*\*[^*\n]*v(\d+\.\d+\.\d+)\*\*/g)].map(match => match[1] || match[2]);
    assert.deepEqual(versions, [version, version], file);
  }
});
