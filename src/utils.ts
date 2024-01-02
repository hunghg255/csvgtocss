import path from 'node:path';

import fs from 'fs-extra';

import { parseXml } from '@rgrove/parse-xml';
import { stringToColor } from '@iconify/utils';

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

export function svgHasOnlyPathChild(svg: string): boolean {
  if (!svg) {
    return false;
  }

  const svgAst: any = parseXml(svg);

  const mode = svg.includes('currentColor') || svg.includes('currentcolor');

  if (mode) return true;

  let path = 0;
  const fill = [];

  for (let idx = 0; idx < svgAst.children?.[0]?.children?.length; idx++) {
    const child = svgAst.children?.[0]?.children[idx];
    const isRect = child?.name === 'rect' && child?.attributes?.fill;
    const isCircle = child?.name === 'circle' && child?.attributes?.fill;
    const isEllipse = child?.name === 'ellipse' && child?.attributes?.fill;
    const isPolygon = child?.name === 'polygon' && child?.attributes?.fill;
    const isPolyline = child?.name === 'polyline' && child?.attributes?.fill;

    if (child.name === 'path' || isRect || isCircle || isEllipse || isPolygon || isPolyline) {
      path = path + 1;
    }

    if (child?.attributes?.fill && child?.attributes?.fill !== 'none') {
      fill.push(JSON.stringify(stringToColor(child?.attributes?.fill)));
    }

    if (child?.children?.length > 0) {
      for (let j = 0; j < child.children?.length; j++) {
        const child2 = child.children[j];

        const isRect = child2?.name === 'rect' && child2?.attributes?.fill;
        const isCircle = child2?.name === 'circle' && child2?.attributes?.fill;
        const isEllipse = child2?.name === 'ellipse' && child2?.attributes?.fill;
        const isPolygon = child2?.name === 'polygon' && child2?.attributes?.fill;
        const isPolyline = child2?.name === 'polyline' && child2?.attributes?.fill;

        if (child2.name === 'path' || isRect || isCircle || isEllipse || isPolygon || isPolyline) {
          path = path + 1;
        }

        if (child2?.attributes?.fill && child2?.attributes?.fill !== 'none') {
          fill.push(JSON.stringify(stringToColor(child2?.attributes?.fill)));
        }
      }
    }
  }

  if (fill.length === 1) return true;

  if (fill.length > 1) {
    const fillSet = new Set(fill);

    if (fillSet.size > 1) {
      return false;
    }
    return true;
  }

  return path > 1 ? false : true;
}
