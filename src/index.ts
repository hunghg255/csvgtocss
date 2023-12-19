/// <reference types="./types" />

import path from 'node:path';

import fs from 'fs-extra';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { cleanupSVG, importDirectory, isEmptyColor, parseColors, runSVGO } from '@iconify/tools';
import { getIconsCSS } from '@iconify/utils';
import { log } from './log';
import { filterSvgFiles, svgHasOnlyPathChild } from './utils';
import color from 'colors-cli';
import { genHtml } from './templates';

export type SvgToCssOptions = {
  dist: string;
  /**
   * svg path
   * @default svg
   * @example
   * ```
   * ```
   */
  src: string;
  /**
   * The font family name you want.
   * @default iconfont
   */
  prefix?: string;

  website?: {
    /**
     * website title
     */
    title?: string;
    description?: string;
    template?: string;
    footerInfo?: string;
    links: Array<{
      title: string;
      url: string;
    }>;
  };
};

interface IDefineConfig {
  src: string;
  dist: string;
  prefix?: string;
}

declare global {
  const options: any;
}

export const defineConfig = (options: IDefineConfig) => {
  return options;
};

export const svg2Font = async (options: SvgToCssOptions) => {
  const src = path.resolve(process.cwd(), options.src);
  const dist = path.resolve(process.cwd(), options.dist);
  const prefix = options.prefix ?? 'icon';

  try {
    await fs.emptyDir(options.dist as any);
    await fs.ensureDir(options.dist as any);

    const svgFiles = await filterSvgFiles(src);

    if (svgFiles.length === 0) return;

    // Import icons
    const iconSet = await importDirectory(src, {
      prefix,
    });

    const svgMonotone: any = [];
    const svgMultitone: any = [];

    // Validate, clean up, fix palette and optimise
    await iconSet.forEach(async (name, type) => {
      if (type !== 'icon') {
        return;
      }

      const svg = iconSet.toSVG(name);
      if (!svg) {
        // Invalid icon
        iconSet.remove(name);
        return;
      }

      // Clean up and optimise icons
      try {
        // Clean up icon code
        cleanupSVG(svg);

        // check svg is monotone
        const isMonotone = svgHasOnlyPathChild(svg.toString());
        // Assume icon is monotone: replace color with currentColor, add if missing
        // If icon is not monotone, remove this code
        if (isMonotone) {
          await parseColors(svg, {
            defaultColor: 'currentColor',
            callback: (attr, colorStr, color) => {
              return !color || isEmptyColor(color) ? colorStr : 'currentColor';
            },
          });
        }

        // Optimise
        runSVGO(svg);

        if (isMonotone) {
          svgMonotone.push({
            name,
            prefix,
          });
        } else {
          svgMultitone.push({
            name,
            prefix,
          });
        }
      } catch (err) {
        // Invalid icon
        console.error(`Error parsing ${name}:`, err);
        iconSet.remove(name);
        return;
      }

      // Update icon
      iconSet.fromSVG(name, svg);
    });

    let cssMonofont = '';
    let cssMultifont = '';

    if (svgMonotone?.length) {
      cssMonofont = getIconsCSS(
        iconSet.export(),
        svgMonotone.map((it: any) => it.name),
        {
          iconSelector: `.${prefix}-{name}`,
          commonSelector: '',
        },
      );
    }

    if (svgMultitone?.length) {
      cssMultifont = getIconsCSS(
        iconSet.export(),
        svgMultitone.map((it: any) => it.name),
        {
          iconSelector: `.${prefix}-{name}`,
          commonSelector: '',
        },
      );
    }

    const cssContent = `
${cssMonofont}
${cssMultifont}
`;

    const type = `
export type T${prefix} = ${[...svgMonotone, ...svgMultitone]
      .map((it: any) => `'${prefix}-${it?.name}'`)
      .join(' | ')};
`;

    fs.writeFile(path.resolve(dist, `${prefix}-css.css`), cssContent);
    fs.writeFile(path.resolve(dist, `${prefix}-type.d.ts`), type);
    fs.writeFile(
      path.resolve(dist, `${prefix}-demo.html`),
      genHtml({
        cssContent,
        prefix,
        svgMonotone,
        svgMultitone,
      }),
    );

    log.log(color.green('SvgTocss:CLI:SUCCESS:'));
    console.log();
  } catch (error) {
    log.log(color.red('SvgTocss:CLI:ERR:'), error);
    console.log();
  }
};
