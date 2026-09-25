// Generates the icon CSS used by the docs site with the library itself,
// from the sample SVGs in ../test/svg. Builds the library first when needed
// (e.g. on a fresh clone or a hosting provider that only builds docs/).
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(root, '..');
const lib = resolve(repoRoot, 'dist/index.mjs');
const out = resolve(root, 'src/generated');

// Run pnpm the same way this script was started, falling back to the one on PATH.
function pnpm(...args) {
  const execPath = process.env.npm_execpath;
  const [cmd, cmdArgs] =
    execPath && /pnpm/.test(execPath) ? [process.execPath, [execPath, ...args]] : ['pnpm', args];
  execFileSync(cmd, cmdArgs, { cwd: repoRoot, stdio: 'inherit', shell: process.platform === 'win32' });
}

if (!existsSync(lib)) {
  console.log('csvgtocss is not built yet, building it in the repository root…');
  try {
    if (!existsSync(resolve(repoRoot, 'node_modules'))) pnpm('install', '--frozen-lockfile');
    pnpm('build');
  } catch {
    console.error('Could not build csvgtocss. Run `pnpm install && pnpm build` in the repository root.');
    process.exit(1);
  }
}

const { svg2Font } = await import(pathToFileURL(lib).href);

await svg2Font({
  src: resolve(root, '../test/svg'),
  dist: out,
  prefix: 'icon',
  exportJson: true,
});

if (!existsSync(resolve(out, 'icon-css.css')) || !existsSync(resolve(out, 'icon-collection.json'))) {
  console.error('Icon generation failed, see the log above.');
  process.exit(1);
}
