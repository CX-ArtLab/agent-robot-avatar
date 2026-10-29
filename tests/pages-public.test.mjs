import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { publicDemoFiles } from '../scripts/public-pages-files.mjs';
import { featured, publicSkins, skinById, catalogCategories as categories } from '../demo/skin-catalog.js';

const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, '.pages-site');
execFileSync(process.execPath, ['scripts/build-pages.mjs'], {cwd:root});
function files(dir, prefix = '') {
  return readdirSync(dir, {withFileTypes:true}).flatMap(item => {
    const relative = prefix + item.name;
    return item.isDirectory() ? files(path.join(dir, item.name), relative + '/') : [relative];
  });
}
test('public artifact contains only approved demo files and component runtime', () => {
  const actual = files(output);
  const expected = [...publicDemoFiles, 'agent-robot-avatar.js', ...files(path.join(root, 'src'), 'src/')];
  assert.deepEqual(actual.sort(), expected.sort());
  for (const forbidden of ['materials/materials.js','materials/material-tuner.js','materials/other-material-tuner.js',
    'materials/material-controls.js','materials/material-presets.js','materials/tuner-history.js','materials/layered-materials.js',
    'materials/export.mjs','materials/robot-material-demos.html','local-only/material-lab/index.html','ai-skins.html']) {
    assert.equal(existsSync(path.join(output, forbidden)), false, forbidden);
  }
});
test('public gallery has a return link and no editing controls or editor modules', () => {
  const html = readFileSync(path.join(output, 'materials/index.html'), 'utf8');
  assert.match(html, /id="back-to-skins"/);
  for (const file of publicDemoFiles.filter(file => file.startsWith('materials/'))) {
    const source = readFileSync(path.join(output, file), 'utf8');
    assert.doesNotMatch(source, /setupMaterialTuner|setupOtherMaterialTuner|applyLayerSettings|layerControls|material-edit|material-delete|tuner-history|material-presets|local-only\//, file);
  }
});
test('published JS module imports resolve inside the artifact', () => {
  for (const file of files(output).filter(file => file.endsWith('.js'))) {
    const source = readFileSync(path.join(output, file), 'utf8');
    for (const match of source.matchAll(/(?:from\s*|import\s*\(?\s*)['"](\.[^'"]+)['"]/g)) {
      const target = path.resolve(output, path.dirname(file), match[1]);
      assert.ok(target.startsWith(output + path.sep), `${file} imports outside artifact: ${match[1]}`);
      assert.ok(existsSync(target), `${file} has missing import: ${match[1]}`);
    }
  }
});
test('featured skins are the chosen ones, unique and exclude the unskinned original', () => {
  assert.deepEqual(featured, ['101', '102', '201', '206', '302', '310', '403', '504', '510', '705', '611', '711',
    '805', '906', '914', '926', '1008', '1102', '1207', '1303', '1401', '1402', '1409', '1503']);
  assert.equal(new Set(featured).size, featured.length);
  assert.ok(featured.every(id => id !== 'classic' && skinById.has(id)));
  assert.ok(publicSkins.every(skin => skin.id !== 'classic'));
});

test('approved material categories cover each public skin exactly once', () => {
  const ids = publicSkins.map(skin => skin.id);
  const grouped = categories.flatMap(category => category.names).filter(id => ids.includes(id));
  assert.ok(categories.length > 0);
  assert.ok(ids.length > 0);
  assert.deepEqual(grouped.sort(), ids.sort());
});
