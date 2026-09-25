import path from 'node:path';
import fs from 'fs-extra';
import { cleanupSVG, importDirectory, isEmptyColor, parseColors, runSVGO } from '@iconify/tools';
import { getIconsCSS } from '@iconify/utils';
import { log } from './log';
import { analyzeSvgMonochrome, filterSvgFiles } from './utils';
import color from 'picocolors';
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
   * @default icon
   */
  prefix?: string;

  exportJson?: boolean;

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
  exportJson?: boolean;
}

export const defineConfig = (options: IDefineConfig) => {
  return options;
};

export const svg2Font = async (options: SvgToCssOptions) => {
  const src = path.resolve(process.cwd(), options.src);
  const dist = path.resolve(process.cwd(), options.dist);
  const prefix = options.prefix ?? 'icon';

  try {
    await fs.emptyDir(dist);

    const svgFiles = filterSvgFiles(src);

    if (svgFiles.length === 0) return;

    // Import icons
    const iconSet = await importDirectory(src, {
      prefix,
      ignoreImportErrors: true,
    });

    const svgMonochrome: Array<{ name: string; prefix: string }> = [];
    const svgMultichrome: Array<{ name: string; prefix: string }> = [];

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

      let isMonochrome: boolean;

      // Clean up and optimise icons
      try {
        // Clean up icon code
        cleanupSVG(svg);

        // check svg is monotone
        isMonochrome = analyzeSvgMonochrome(svg.toString());
        // Assume icon is monotone: replace color with currentColor, add if missing
        // If icon is not monotone, remove this code
        if (isMonochrome) {
          await parseColors(svg, {
            defaultColor: 'currentColor',
            callback: (attr, colorStr, color) => {
              return !color || isEmptyColor(color) ? colorStr : 'currentColor';
            },
          });
        }

        // Optimise
        runSVGO(svg);
      } catch (err) {
        // Invalid icon
        console.error(`Error parsing ${name}:`, err);
        iconSet.remove(name);
        return;
      }

      // Update icon
      iconSet.fromSVG(name, svg);
      (isMonochrome ? svgMonochrome : svgMultichrome).push({ name, prefix });
    });

    const svgFileSuccess = [...svgMonochrome, ...svgMultichrome].map((it) => it.name);
    const iconSetData = iconSet.export();

    let cssMonofont = '';
    let cssMultifont = '';

    if (svgMonochrome.length) {
      cssMonofont = getIconsCSS(
        iconSetData,
        svgMonochrome.map((it) => it.name),
        {
          iconSelector: `.${prefix}-{name}`,
          commonSelector: '',
          mode: 'mask',
        },
      );
    }

    if (svgMultichrome.length) {
      cssMultifont = getIconsCSS(
        iconSetData,
        svgMultichrome.map((it) => it.name),
        {
          iconSelector: `.${prefix}-{name}`,
          commonSelector: '',
          mode: 'background',
        },
      );
    }

    const cssContent = `
${cssMonofont}
${cssMultifont}
`;

    const type = `
export type T${prefix} = ${svgFileSuccess
      .map((name) => `'${prefix}-${name}'`)
      .join(' | ')};
`;

    const writes = [
      fs.writeFile(path.resolve(dist, `${prefix}-css.css`), cssContent),
      fs.writeFile(path.resolve(dist, `${prefix}-type.d.ts`), type),
      fs.writeFile(
        path.resolve(dist, `${prefix}-demo.html`),
        genHtml({
          prefix,
          svgMonochrome,
          svgMultichrome,
        }),
      ),
    ];

    if (options?.exportJson) {
      writes.push(
        fs.writeFile(
          path.resolve(dist, `${prefix}-collection.json`),
          JSON.stringify(iconSetData, null, 2),
        ),
      );
    }

    await Promise.all(writes);

    log.log('✅', color.green('Generate icon SUCCESS'));
    log.log(color.yellowBright(svgFileSuccess.join(' | ')));
    console.log();
    if (svgFiles.length !== svgFileSuccess.length) {
      log.log('❌', color.red('Generate icon ERROR'));
      log.log(
        color.yellowBright(
          'Can not generate with some icon like be: error svg content, svg content have image, etc...',
        ),
      );
    }

    console.log();
  } catch (error) {
    log.log(color.red('SvgTocss:CLI:ERR:'), error);
    console.log();
  }
};
