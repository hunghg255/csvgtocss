# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `pnpm build` — Build with unbuild (rollup, emits CJS+ESM)
- `pnpm stub` — Development stub mode (unbuild --stub)
- `pnpm lint` — Run oxlint (not ESLint, not eslint)
- `pnpm prepublishOnly` — Runs `pnpm build` before publish
- `pnpm release` — Version bump (bumpp), followed by tag push to trigger GitHub Release workflow
- `node bin/csvgtocss.mjs` — Run CLI locally without installing

## Architecture

**csvgtocss** converts SVG files into CSS icon font classes using @iconify/tools.

### Core flow (`src/index.ts`)

```
svg/ directory → importDirectory (iconify) → for each SVG:
  → toSVG() → cleanupSVG()
  → svgHasOnlyPathChild() / isSvgMonochrome() → detect monochrome vs multicolor
  → monochrome: parseColors() → replace all with "currentColor"
  → runSVGO() → optimize
  → getIconsCSS() → generate CSS

Output:
  - {prefix}-css.css       — Icon CSS classes (monochrome + multicolor)
  - {prefix}-type.d.ts     — TypeScript union type of icon names
  - {prefix}-demo.html     — Preview page with search
  - {prefix}-collection.json — Iconify JSON (optional, exportJson: true)
```

### Key modules

- `src/index.ts` — Core orchestrator (`svg2Font()`). Handles icon import, cleanup, color replacement, CSS generation, and file output.
- `src/utils.ts` — SVG utilities: `filterSvgFiles()`, `svgHasOnlyPathChild()` (heuristic to detect monochrome SVGs by counting unique color+opacity pairs), `isSvgMonochrome()` (uses iconify's parseColors to check).
- `src/cli.ts` / `src/cli-start.ts` — CLI entry. Uses `commander` for arg parsing and `unreadconfig` to load config files.
- `src/templates/index.ts` — Generates HTML preview page with search/filter and copy-to-clipboard.
- `src/log.ts` — Simple logger wrapper with enable/disable toggle.
- `src/errors.ts` — `PrettyError` class and error handler.
- `build.config.ts` — Unbuild config with `inlineDependencies: true` (bundles deps into output), `cjsBridge: true`, minification enabled.

### Monochrome detection logic

`svgHasOnlyPathChild()` in `utils.ts` walks the SVG AST using `@rgrove/parse-xml` and collects all fill/stroke colors (including opacity). If the SVG has 0 or 1 unique (color, opacity) pairs, it is treated as monochrome. Monochrome SVGs get all colors replaced with `currentColor` so they inherit the text color.

### Known issues

- SVGs exported from Figma/Illustrator sometimes contain `clip-path="url(#clip0_xxx)"` that references a `<clipPath>` that doesn't exist in `<defs>`. This causes `@iconify/tools` to throw `Error: Missing element with id="clip0_xxx"` during `parseColors()`. The error is caught and the icon is skipped.

## Dependencies (key)

- `@iconify/tools` — SVG import, cleanup, color parsing, SVGO optimization
- `@iconify/utils` — CSS generation from icon sets, color utilities
- `@rgrove/parse-xml` — XML parser used by `utils.ts` for color analysis
- `cheerio` — DOM manipulation (used internally by `@iconify/tools`)
- `unreadconfig` — Reads config files (svgtocss.config.{ts,js,mjs})
- `unbuild` — Build tool (rollup-based)
- `oxlint` — Linter (not eslint)

## CI/CD

- **CI**: Runs on push/PR to `main` — `pnpm install` → `pnpm lint` → `pnpm build`
- **Release**: Triggered by `v*` tags — generates changelog with `changeloggithub` and publishes to npm
- Package manager: `pnpm` (v9)
