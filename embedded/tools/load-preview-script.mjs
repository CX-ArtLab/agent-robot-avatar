import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Shared by the builder and freshness check. Display helpers come first so
// the UI can use them; all files are plain scripts inlined into one tag.
const SCRIPT_FILES = ['i18n.js', 'board.js', 'panel.js', 'ui.js'];

export async function loadPreviewScript(preview) {
  const parts = await Promise.all(SCRIPT_FILES.map(name => readFile(join(preview, name), 'utf8')));
  const translations = JSON.parse(await readFile(join(preview, 'translations.json'), 'utf8'));
  return `const PREVIEW_TRANSLATIONS = ${JSON.stringify(translations).replaceAll('<', '\\u003c')};\n` + parts.join('\n');
}
