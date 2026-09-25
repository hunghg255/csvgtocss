// Generates the icon CSS used by the docs site with the library itself,
// from the sample SVGs in ../test/svg.
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const lib = resolve(root, '../dist/index.mjs');
const out = resolve(root, 'src/generated');

if (!existsSync(lib)) {
  console.error('csvgtocss is not built yet. Run `pnpm install && pnpm build` in the repository root first.');
  process.exit(1);
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
