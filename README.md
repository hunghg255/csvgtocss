# Convert svg to css

[![npm version](https://badge.fury.io/js/csvgtocss.svg)](https://badge.fury.io/js/csvgtocss) [![npm](https://img.shields.io/npm/dw/csvgtocss.svg?logo=npm)](https://www.npmjs.com/package/csvgtocss) [![npm](https://img.shields.io/bundlephobia/minzip/csvgtocss)](https://www.npmjs.com/package/csvgtocss)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

## Demo

[Github](https://github.com/hunghg255/csvgtocss)

[Demo](https://svg-to-css.surge.sh)

## Install

```bash
npm i csvgtocss@latest --save-dev
```

## Setup

### Create file: `csvgtocss.config.{ts,js,mjs}`

```js
import { defineConfig } from 'csvgtocss';

export default defineConfig({
  src: 'svg', // svg path
  dist: 'dist', // output path
  prefix: 'csvgtocss', // font name
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
    "csvgtocss": "csvgtocss",
  },
  ...
}
```

### Custom config file

- You can also use a custom config file instead of `csvgtocss.config.{ts,js,mjs}`. Just create `<FILE_NAME>.config.{ts,js,mjs}` to build command

```js
Exp: awesome.config.ts;
```

```json
{
  ...
  "scripts": {
    ...
    "csvgtocss": "csvgtocss -c awesome",
  },
  ...
}
```

### About

<a href="https://www.buymeacoffee.com/hunghg255" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

Gia Hung – [hung.hg](https://hung.thedev.id)
