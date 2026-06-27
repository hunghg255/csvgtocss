import { defineConfig } from '../dist/index.mjs';

export default defineConfig({
  src: 'svgIcon', // svg path
  dist: 'dist/iconcss', // output path
  prefix: 'icon', // font name
  exportJson: true, // export json file
});
