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
await cp(path.join(root, 'agent-robot-avatar.js'), path.join(output, 'agent-robot-avatar.js'));
await cp(path.join(root, 'src'), path.join(output, 'src'), {recursive:true});
for (const file of publicDemoFiles) {
  const destination = path.resolve(output, file);
  if (!destination.startsWith(`${output}${path.sep}`)) throw new Error(`Invalid public path: ${file}`);
  let source = await readFile(path.join(demo, file), 'utf8');
  // The deployed demo sits at the artifact root, one directory above local demo/.
  if (file === 'index.html' || file === 'agent-robot-avatar-demo.js') source = source.replaceAll('../agent-robot-avatar.js', './agent-robot-avatar.js');
  if (file === 'materials/gallery.js') source = source.replaceAll('../../agent-robot-avatar.js', '../agent-robot-avatar.js');
  if (file === 'materials/catalog-renderer.js') source = source.replaceAll('../../src/', '../src/');
  await mkdir(path.dirname(destination), {recursive:true});
  await writeFile(destination, source);
}
console.log(`Public demo built at ${output} (${publicDemoFiles.length} demo files; private editors excluded)`);
