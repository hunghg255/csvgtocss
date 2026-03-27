# Config Options

Full reference for `svgtocss.config.{ts,js,mjs}`.

## defineConfig Options

```ts
import { defineConfig } from 'csvgtocss'

export default defineConfig({
  src: 'svg',           // (required) Path to folder containing .svg source files
  dist: 'dist',         // (required) Output folder for generated CSS and JSON
  prefix: 'csvgtocss',  // (required) Prefix used for CSS class names and font name
  exportJson: true,     // (optional) Whether to export icon-collection.json (needed for VSCode preview)
})
```

## Field Details

| Field | Type | Required | Description |
|---|---|---|---|
| `src` | `string` | ✅ | Relative path to folder with `.svg` files |
| `dist` | `string` | ✅ | Relative path for output files |
| `prefix` | `string` | ✅ | Prefix for CSS class names, e.g. `icon` → `.icon-home` |
| `exportJson` | `boolean` | ❌ | Exports `icon-collection.json` for iconify-preview |

## Example Configs

### Minimal

```ts
import { defineConfig } from 'csvgtocss'

export default defineConfig({
  src: 'src/assets/icons',
  dist: 'public/svgcss',
  prefix: 'icon',
  exportJson: true,
})
```

### With custom config filename (`awesome.config.ts`)

```ts
// awesome.config.ts
import { defineConfig } from 'csvgtocss'

export default defineConfig({
  src: 'icons',
  dist: 'dist/css',
  prefix: 'my-icon',
  exportJson: true,
})
```

```json
// package.json
{
  "scripts": {
    "build-icons": "csvgtocss -c awesome"
  }
}
```

## CLI Flags

| Flag | Description |
|---|---|
| `-c <name>` | Use custom config file named `<name>.config.{ts,js,mjs}` |

## VSCode Settings Template

Copy this to `.vscode/settings.json` and update the JSON path to match your `dist` output:

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
