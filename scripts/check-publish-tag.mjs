import { readFile } from 'node:fs/promises';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const packageVersion = process.env.npm_package_version || packageJson.version;
const isPrerelease = packageVersion.includes('-');
const publishTag = process.env.npm_config_tag || 'latest';

if (isPrerelease && publishTag === 'latest') {
  console.error(`Refusing to publish prerelease ${packageVersion} with the latest tag. Use --tag next.`);
  process.exitCode = 1;
}
