import './generated/icon-css.css';
import cssText from './generated/icon-css.css?raw';
import collection from './generated/icon-collection.json';

type IconData = { body: string; width?: number; height?: number };

export type IconKind = 'mono' | 'multi';

export type IconInfo = {
  name: string;
  className: string;
  kind: IconKind;
};

const data = collection as { prefix: string; icons: Record<string, IconData> };

export const PREFIX = data.prefix;

export const CSS_TEXT = cssText;

export const icons: IconInfo[] = Object.entries(data.icons).map(([name, icon]) => ({
  name,
  className: `${PREFIX}-${name}`,
  // Monochrome icons have every color replaced with currentColor.
  kind: icon.body.includes('currentColor') ? 'mono' : 'multi',
}));

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The rule block generated for one icon, e.g. `.icon-add { --svg: url(...) }`. */
export function getIconRule(className: string): string {
  const match = cssText.match(new RegExp(`\\.${escapeRegExp(className)}\\s*\\{[^}]*\\}`));
  return match ? match[0] : '';
}

/** The data URI embedded in an icon's rule. */
export function getIconDataUrl(className: string): string {
  const match = getIconRule(className).match(/url\("([^"]+)"\)/);
  return match ? match[1] : '';
}

/** The shared rule for monochrome (mask) or multicolor (background) icons. */
export function getCommonRule(kind: IconKind): string {
  const blocks = cssText.match(/[^{}]+\{[^}]*\}/g) ?? [];
  const block = blocks.find((b) =>
    kind === 'mono' ? b.includes('mask-image: var(--svg)') : b.includes('background-size'),
  );
  return block ? shortenSelectorList(block.trim()) : '';
}

/** Shortens long data URIs so rules stay readable in the docs. */
export function shortenDataUrls(css: string, keep = 48): string {
  return css.replace(/url\("([^"]+)"\)/g, (_, url: string) =>
    url.length > keep ? `url("${url.slice(0, keep)}…")` : `url("${url}")`,
  );
}

function shortenSelectorList(block: string): string {
  const [selectors, rest] = [block.slice(0, block.indexOf('{')), block.slice(block.indexOf('{'))];
  const list = selectors.split(',').map((s) => s.trim());
  if (list.length <= 3) return block;
  return `${list.slice(0, 2).join(', ')}, /* …${list.length - 2} more */ ${rest}`;
}

export const cssBytes = new Blob([cssText]).size;
