// Produce an Arduino-importable library ZIP without the Web component or tools.
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const library = path.join(root, 'lib/BoopFace');
const properties = await readFile(path.join(library, 'library.properties'), 'utf8');
const version = properties.match(/^version=(.+)$/m)?.[1].trim();
if (!/^\d+\.\d+\.\d+$/.test(version || '')) throw new Error('Invalid embedded version');
const tag = process.argv[2];
if (tag !== `eyes-v${version}`) throw new Error(`Expected tag eyes-v${version}, received ${tag}`);
const manifest = JSON.parse(await readFile(path.join(library, 'library.json'), 'utf8'));
const header = await readFile(path.join(library, 'src/BoopFace.h'), 'utf8');
if (manifest.version !== version || !header.includes(`version() { return "${version}"; }`)) {
  throw new Error('Embedded manifest and runtime versions must agree');
}
const output = path.resolve(process.argv[3] || `BoopFace-Embedded-${version}.zip`);
const work = await mkdtemp(path.join(tmpdir(), 'boopface-library-'));
try {
  const destination = path.join(work, 'BoopFace');
  await mkdir(destination);
  for (const file of ['library.properties', 'library.json', 'src', 'examples']) {
    await cp(path.join(library, file), path.join(destination, file), {recursive: true});
  }
  await cp(path.join(root, '../LICENSE'), path.join(destination, 'LICENSE'));
  await cp(path.join(root, 'CHANGELOG.md'), path.join(destination, 'CHANGELOG.md'));
  await writeFile(path.join(destination, 'README.md'), `# BoopFace Embedded ${version}

Experimental C++11 robot eyes. Import this ZIP with Arduino IDE's
Sketch → Include Library → Add .ZIP Library. Examples appear under
File → Examples → BoopFace. SerialEyes needs no screen;
OledSSD1306 needs the Adafruit SSD1306 library and a 128×64 I²C OLED.

All board configurations compile in CI; physical verification is pending.

- Guide and firmware examples: https://github.com/CX-ArtLab/boopface/tree/main/embedded
- Simulator: https://cx-artlab.github.io/boopface/hardware/
- Issues: https://github.com/CX-ArtLab/boopface/issues

Use #include <BoopFace.h> and boopface::Eyes. The caller supplies the
framebuffer, clock and display driver. No Arduino dependency in the core.

PlatformIO: add cxlab/BoopFace@^${version} to lib_deps in platformio.ini.
Arduino Library Manager indexing is pending; install from ZIP or source
until it is available. License: MIT (see LICENSE).
`);
  execFileSync('python3', ['-c', `
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import sys
root=Path(sys.argv[1])
with ZipFile(sys.argv[2], 'w', ZIP_DEFLATED) as archive:
    for file in sorted(root.rglob('*')):
        if file.is_file(): archive.write(file, file.relative_to(root))
`, work, output]);
  console.log(output);
} finally {
  await rm(work, {recursive: true, force: true});
}
