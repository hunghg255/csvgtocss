import path from 'node:path';

import fs from 'fs-extra';

import { XMLParser } from 'fast-xml-parser';
/*
 * Filter svg files
 * @return {Array} svg files
 */
export function filterSvgFiles(svgFolderPath: string): string[] {
  const files = fs.readdirSync(svgFolderPath, 'utf-8');
  const svgArr = [];
  if (!files) {
    throw new Error(`Error! Svg folder is empty.${svgFolderPath}`);
  }

  for (const i in files) {
    if (typeof files[i] !== 'string' || path.extname(files[i]) !== '.svg') {
      continue;
    }
    if (!~svgArr.indexOf(files[i])) {
      svgArr.push(path.join(svgFolderPath, files[i]));
    }
  }
  return svgArr;
}

const PAINTABLE_TAGS = new Set([
  'path',
  'rect',
  'circle',
  'ellipse',
  'line',
  'polyline',
  'polygon',
  'text',
  'textPath',
  'tspan',
  'use',
]);

const GRADIENT_TAGS = new Set(['linearGradient', 'radialGradient', 'pattern']);

const NON_RENDER_TAGS = new Set([
  'svg',
  'g',
  'defs',
  'clipPath',
  'mask',
  'filter',
  'style',
  'title',
  'desc',
  'metadata',
  'symbol',
  'marker',
  'switch',
]);

const IGNORE_PAINT_VALUES = new Set(['none', 'transparent', 'inherit', 'initial', 'unset']);

function toArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function parseStyle(style = '') {
  const out = {};

  String(style)
    .split(';')
    .forEach((rule) => {
      const index = rule.indexOf(':');
      if (index === -1) return;

      const key = rule.slice(0, index).trim();
      const value = rule.slice(index + 1).trim();

      if (key && value) out[key] = value;
    });

  return out;
}

function getAttr(node, name) {
  return node?.['@']?.[name];
}

function getNodeStyle(node) {
  return parseStyle(getAttr(node, 'style'));
}

function pickPaintValue(node, style, inherited, prop) {
  const attrValue = getAttr(node, prop);
  const styleValue = style[prop];

  if (styleValue != null) return styleValue;
  if (attrValue != null) return attrValue;

  if (prop === 'fill') return inherited.fill ?? 'black';
  if (prop === 'stroke') return inherited.stroke ?? 'none';

  return undefined;
}

function normalizeColor(value, options = {}) {
  if (value == null) return null;

  let v = String(value).trim().toLowerCase();

  if (!v) return null;

  if (IGNORE_PAINT_VALUES.has(v)) return null;

  if (v === 'currentcolor') {
    return options.countCurrentColor ? 'currentcolor' : null;
  }

  if (v.startsWith('url(')) {
    return '__url_paint__';
  }

  // Normalize common whites/blacks.
  if (v === 'white') return '#ffffff';
  if (v === 'black') return '#000000';

  // Normalize #rgb to #rrggbb.
  const shortHex = v.match(/^#([0-9a-f]{3})$/i);
  if (shortHex) {
    const [r, g, b] = shortHex[1].split('');
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return v;
}

function makeState(node, inherited) {
  const style = getNodeStyle(node);

  const fill = pickPaintValue(node, style, inherited, 'fill');
  const stroke = pickPaintValue(node, style, inherited, 'stroke');

  return {
    fill,
    stroke,
  };
}

function isHidden(node, inheritedHidden = false) {
  if (inheritedHidden) return true;

  const attrs = node?.['@'] || {};
  const style = parseStyle(attrs.style);

  const display = style.display ?? attrs.display;
  const visibility = style.visibility ?? attrs.visibility;
  const opacity = style.opacity ?? attrs.opacity;

  if (String(display).trim().toLowerCase() === 'none') return true;
  if (String(visibility).trim().toLowerCase() === 'hidden') return true;
  if (Number(opacity) === 0) return true;

  return false;
}

function collectChildEntries(node) {
  const entries = [];

  for (const [tagName, value] of Object.entries(node || {})) {
    if (tagName === '@') continue;

    for (const child of toArray(value)) {
      if (child && typeof child === 'object') {
        entries.push([tagName, child]);
      }
    }
  }

  return entries;
}

/**
 * Analyze whether an SVG is monochrome.
 *
 * Monochrome = rendered paint colors count <= 1.
 * Duotone = rendered paint colors count === 2.
 * Multicolor = rendered paint colors count > 2.
 *
 * Gradients/patterns/bitmap are classified separately.
 */
export function analyzeSvgMonochrome(svgString, options = {}) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    attributesGroupName: '@',
    preserveOrder: false,
    trimValues: true,
    parseTagValue: false,
    parseAttributeValue: false,
  });

  const parsed = parser.parse(svgString);

  if (!parsed || !parsed.svg) {
    throw new Error('Invalid SVG: missing <svg> root');
  }

  const colors = new Set();
  const paintNodes = [];

  let hasGradient = false;
  let hasPattern = false;
  let hasBitmap = false;
  let hasUrlPaint = false;

  function visit(tagName, node, inheritedState, inheritedHidden) {
    const hidden = isHidden(node, inheritedHidden);
    const state = makeState(node, inheritedState);

    if (GRADIENT_TAGS.has(tagName)) {
      if (tagName === 'pattern') hasPattern = true;
      else hasGradient = true;
    }

    if (tagName === 'image') {
      hasBitmap = true;
    }

    if (!hidden && PAINTABLE_TAGS.has(tagName)) {
      const fill = normalizeColor(state.fill, options);
      const stroke = normalizeColor(state.stroke, options);

      const nodeColors = [];

      if (fill) {
        if (fill === '__url_paint__') {
          hasUrlPaint = true;
        } else {
          colors.add(fill);
          nodeColors.push(fill);
        }
      }

      if (stroke) {
        if (stroke === '__url_paint__') {
          hasUrlPaint = true;
        } else {
          colors.add(stroke);
          nodeColors.push(stroke);
        }
      }

      paintNodes.push({
        tagName,
        fill: state.fill,
        stroke: state.stroke,
        colors: nodeColors,
      });
    }

    for (const [childTagName, childNode] of collectChildEntries(node)) {
      visit(childTagName, childNode, state, hidden);
    }
  }

  visit('svg', parsed.svg, { fill: 'black', stroke: 'none' }, false);

  const resultColors = [...colors];

  let type = 'monochrome';

  if (hasBitmap) {
    type = 'bitmap';
  } else if (hasUrlPaint || hasGradient || hasPattern) {
    type = 'gradient';
  } else if (resultColors.length === 2) {
    type = 'duotone';
  } else if (resultColors.length > 2) {
    type = 'multicolor';
  }

  return type === 'monochrome';
}
