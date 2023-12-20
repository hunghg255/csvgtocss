import { defineConfig } from '../dist/index.mjs';

export default defineConfig({
  src: 'svg', // svg path
  dist: 'dist/iconcss', // output path
  prefix: 'icon', // font name
});
