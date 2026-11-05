import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicDemoFiles } from './public-pages-files.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '.pages-site');
const demo = path.join(root, 'demo');
if (path.dirname(output) !== root || path.basename(output) !== '.pages-site') throw new Error('Invalid Pages output directory');
await rm(output, {recursive:true, force:true});
await mkdir(output, {recursive:true});
await cp(path.join(root, 'boopface.js'), path.join(output, 'boopface.js'));
await cp(path.join(root, 'src'), path.join(output, 'src'), {recursive:true});
for (const file of publicDemoFiles) {
  const destination = path.resolve(output, file);
  if (!destination.startsWith(`${output}${path.sep}`)) throw new Error(`Invalid public path: ${file}`);
  // Only code and pages need their paths moved; everything else, pictures and
  // fonts above all, is copied byte for byte.
  if (!/\.(?:js|mjs|css|html)$/.test(file)) {
    await mkdir(path.dirname(destination), {recursive:true});
    await cp(path.join(demo, file), destination);
    continue;
  }
  let source = await readFile(path.join(demo, file), 'utf8');
  // The deployed demo sits at the artifact root, one directory above local demo/.
  // The demo moves up one level: demo/ becomes the root, next to src/.
  if (file.startsWith('materials/')) source = source.replaceAll('../../boopface.js', '../boopface.js').replaceAll('../../src/', '../src/');
  else source = source.replaceAll('../boopface.js', './boopface.js').replaceAll('../src/', './src/');
  await mkdir(path.dirname(destination), {recursive:true});
  await writeFile(destination, source);
}
// The embedded simulator is one self-contained offline file.
await mkdir(path.join(output, 'hardware'), {recursive:true});
await cp(path.join(root, 'embedded/preview/boopface-embedded-preview.html'), path.join(output, 'hardware/index.html'));
console.log(`Public demo built at ${output} (${publicDemoFiles.length} demo files; private editors excluded)`);
