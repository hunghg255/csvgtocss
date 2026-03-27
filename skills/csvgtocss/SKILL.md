---
name: csvgtocss
description: Guide for using csvgtocss — a CLI tool that converts SVG files into CSS icon classes and Iconify-compatible JSON collections. Use when user asks to convert SVG to CSS icons, generate icon fonts from SVG files, use csvgtocss CLI, set up svgtocss.config.ts, preview SVG icons in VSCode with iconify-preview, or automate SVG icon workflows in a project.
license: MIT
metadata:
  author: hunghg255
  version: 0.1.4
  source: https://github.com/hunghg255/csvgtocss
---

# csvgtocss

A CLI tool that converts SVG files into **CSS icon classes** and an **Iconify-compatible JSON collection**. After running, icons are usable as pure CSS classes and previewable inline in VSCode.

## Installation

```bash
npm i csvgtocss@latest --save-dev
# or
pnpm add csvgtocss@latest --save-dev
```

## Quick Setup

### 1. Create config file

Create `svgtocss.config.ts` (or `.js` / `.mjs`) at your project root:

```ts
import { defineConfig } from 'csvgtocss';

export default defineConfig({
  src: 'svg', // folder containing your .svg files
  dist: 'dist', // output folder for generated CSS + JSON
  prefix: 'csvgtocss', // CSS class prefix and icon collection name
  exportJson: true, // also export icon-collection.json for Iconify
});
```

### 2. Add npm script

```json
{
  "scripts": {
    "csvgtocss": "csvgtocss"
  }
}
```

### 3. Run

```bash
npm run csvgtocss
```

## CLI Flag

| Flag        | Description                                                                  |
| ----------- | ---------------------------------------------------------------------------- |
| `-c <name>` | Use a custom config file prefix. E.g. `-c awesome` reads `awesome.config.ts` |

## Config Options

| Option       | Type      | Description                                       |
| ------------ | --------- | ------------------------------------------------- |
| `src`        | `string`  | Path to folder with `.svg` input files            |
| `dist`       | `string`  | Output folder for generated CSS + JSON            |
| `prefix`     | `string`  | CSS class prefix and Iconify collection name      |
| `exportJson` | `boolean` | Export `icon-collection.json` for Iconify preview |

## VSCode Icon Preview

Install [iconify-preview](https://marketplace.visualstudio.com/items?itemName=hunghg255.iconify-preview), then add to `.vscode/settings.json`:

```json
{
  "iconify.color": "#ddd",
  "iconify.customCollectionJsonPaths": ["./dist/icon-collection.json"],
  "iconify.delimiters": ["-"],
  "iconify.prefixes": ["", "icon"],
  "iconify.inplace": false,
  "iconify.annotations": true,
  "iconify.languageIds": ["typescript", "typescriptreact"]
}
```

Update the JSON path to match your actual `dist` output location.

See `references/patterns.md` for complete workflows and multi-config examples.

## Gotchas

- **`src` path is relative to project root**, not to the config file.
- **Clean SVGs before converting** — remove hardcoded `fill`, `stroke`, or inline `style` attributes from SVGs; they override CSS color control and make icons non-styleable.
- **`prefix` affects both CSS class names and the JSON collection name** — changing it after integration requires updating all usages in code and config.
- **`exportJson: true` is required** for the Iconify VSCode preview — no JSON file is generated without it.
- **Custom config via `-c`**: the file must be named `<name>.config.ts` (not just `<name>.ts`).
- **ESM only** — config files must use `import`/`export`; CommonJS `require()` will fail since the package uses `"type": "module"`.
