# Convert svg to css

[![npm version](https://badge.fury.io/js/svgtocss.svg)](https://badge.fury.io/js/svgtocss) [![npm](https://img.shields.io/npm/dw/svgtocss.svg?logo=npm)](https://www.npmjs.com/package/svgtocss) [![npm](https://img.shields.io/bundlephobia/minzip/svgtocss)](https://www.npmjs.com/package/svgtocss)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

## Demo

[Github](https://github.com/hunghg255/svgtocss)

[Demo](https://svg-to-css.surge.sh)

## Install

```bash
npm i svgtocss@latest --save-dev
```

## Setup

### Create file: `svgtocss.config.{ts,js,mjs}`

```js
import { defineConfig } from 'svgtocss';

export default defineConfig({
  src: 'svg', // svg path
  dist: 'dist', // output path
  fontName: 'svgtocss', // font name
});
```

## CLI (file package.json)

```
-c: Config
```

```json
{
  ...
  "scripts": {
    ...
    "svgtocss": "svgtocss",
  },
  ...
}
```

### Custom config file

- You can also use a custom config file instead of `svgtocss.config.{ts,js,mjs}`. Just create `<FILE_NAME>.config.{ts,js,mjs}` to build command

```js
Exp: awesome.config.ts;
```

```json
{
  ...
  "scripts": {
    ...
    "svgtocss": "svgtocss -c awesome",
  },
  ...
}
```

### About

<a href="https://www.buymeacoffee.com/hunghg255" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

Gia Hung – [hung.hg](https://hung.thedev.id)
