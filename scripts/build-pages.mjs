import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '.pages-site');
const demo = path.join(root, 'demo');

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const html = await readFile(path.join(demo, 'index.html'), 'utf8');
const pagesHtml = html.replace("../agent-robot-avatar.js", "./agent-robot-avatar.js");

if (pagesHtml === html) {
  throw new Error('Demo entry import was not found while building GitHub Pages.');
}

await writeFile(path.join(output, 'index.html'), pagesHtml);
await cp(path.join(root, 'agent-robot-avatar.js'), path.join(output, 'agent-robot-avatar.js'));
await cp(path.join(root, 'src'), path.join(output, 'src'), { recursive: true });

for (const entry of await readdir(demo, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.js')) {
    await cp(path.join(demo, entry.name), path.join(output, entry.name));
  }
}

console.log(`GitHub Pages demo built at ${output}`);
