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
