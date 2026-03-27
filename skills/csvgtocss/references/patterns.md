# Patterns & Examples

## Standard Project Setup

Folder structure:
```
my-project/
├── svg/               ← put all .svg icon files here
│   ├── arrow.svg
│   ├── close.svg
│   └── home.svg
├── dist/              ← generated output (gitignore this)
├── svgtocss.config.ts
└── package.json
```

`svgtocss.config.ts`:
```ts
import { defineConfig } from 'csvgtocss';

export default defineConfig({
  src: 'svg',
  dist: 'dist',
  prefix: 'icon',
  exportJson: true,
});
```

`package.json`:
```json
{
  "scripts": {
    "icons": "csvgtocss"
  }
}
```

Run: `npm run icons`

## Custom Config File

When you have multiple icon sets (e.g. brand icons vs UI icons):

`brand.config.ts`:
```ts
import { defineConfig } from 'csvgtocss';
export default defineConfig({
  src: 'svg/brand',
  dist: 'dist/brand',
  prefix: 'brand',
  exportJson: true,
});
```

`ui.config.ts`:
```ts
import { defineConfig } from 'csvgtocss';
export default defineConfig({
  src: 'svg/ui',
  dist: 'dist/ui',
  prefix: 'ui',
  exportJson: true,
});
```

`package.json`:
```json
{
  "scripts": {
    "icons:brand": "csvgtocss -c brand",
    "icons:ui": "csvgtocss -c ui",
    "icons": "npm run icons:brand && npm run icons:ui"
  }
}
```

## VSCode Preview Setup (full)

Install extension: `hunghg255.iconify-preview`

`.vscode/settings.json` for multiple collections:
```json
{
  "iconify.color": "#ddd",
  "iconify.customCollectionJsonPaths": [
    "./dist/brand/icon-collection.json",
    "./dist/ui/icon-collection.json"
  ],
  "iconify.delimiters": ["-"],
  "iconify.prefixes": ["brand", "ui", "icon", ""],
  "iconify.inplace": false,
  "iconify.annotations": true,
  "iconify.languageIds": ["typescript", "typescriptreact", "vue", "html"]
}
```

## Preparing Clean SVGs

Before running csvgtocss, strip hardcoded colors from SVGs so CSS can control them:

```bash
# Quick check for hardcoded fills in your SVG folder
grep -r 'fill=' svg/
grep -r 'stroke=' svg/
```

A clean, CSS-controllable SVG looks like:
```xml
<!-- Good: no hardcoded colors -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M12 2L2 22h20L12 2z"/>
</svg>

<!-- Bad: hardcoded fill will ignore CSS color -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path fill="#333333" d="M12 2L2 22h20L12 2z"/>
</svg>
```

## CI/CD Integration

Add icon generation to your build pipeline:

```json
{
  "scripts": {
    "prebuild": "csvgtocss",
    "build": "vite build"
  }
}
```

This auto-regenerates icons before every build, keeping generated files out of version control.
