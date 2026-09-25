import { useEffect, useMemo, useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import {
  CSS_TEXT,
  PREFIX,
  cssBytes,
  getCommonRule,
  getIconDataUrl,
  getIconRule,
  icons,
  shortenDataUrls,
} from '../icons';

const TOC = [
  {
    title: 'Getting started',
    items: [
      { id: 'installation', label: 'Installation' },
      { id: 'quick-start', label: 'Quick start' },
      { id: 'output', label: 'Output files' },
      { id: 'usage', label: 'Using the icons' },
      { id: 'react', label: 'React' },
      { id: 'config', label: 'Configuration' },
    ],
  },
  {
    title: 'How it works',
    items: [
      { id: 'pipeline', label: 'The pipeline' },
      { id: 'mono-multi', label: 'Monochrome vs multicolor' },
      { id: 'mask', label: 'The CSS mask trick' },
      { id: 'why', label: 'Why CSS icons?' },
      { id: 'tradeoffs', label: 'Trade-offs' },
      { id: 'troubleshooting', label: 'Troubleshooting' },
    ],
  },
];

const monoIcons = icons.filter((i) => i.kind === 'mono');
const multiIcons = icons.filter((i) => i.kind === 'multi');

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -65% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function MaskAnatomy() {
  const [name, setName] = useState(monoIcons[0]?.className ?? '');
  const [color, setColor] = useState('#4f46e5');
  const dataUrl = getIconDataUrl(name);

  if (!monoIcons.length) return null;

  return (
    <div className="anatomy">
      <div className="anatomy-controls">
        <label className="control">
          Icon
          <select className="select" value={name} onChange={(e) => setName(e.target.value)}>
            {monoIcons.map((icon) => (
              <option key={icon.className} value={icon.className}>
                {icon.className}
              </option>
            ))}
          </select>
        </label>
        <label className="control">
          color
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Icon color" />
        </label>
      </div>
      <div className="anatomy-stage" style={{ color }}>
        <div className="anatomy-cell">
          <div className="anatomy-box">
            <span className="fill" style={{ backgroundColor: 'currentColor' }} />
          </div>
          <div className="anatomy-label">
            a 1em box painted with
            <br />
            <code>background-color: currentColor</code>
          </div>
        </div>
        <div className="anatomy-op" aria-hidden="true">
          ×
        </div>
        <div className="anatomy-cell">
          <div className="anatomy-box" style={{ backgroundColor: '#fff', backgroundImage: 'none' }}>
            {dataUrl && <img src={dataUrl} alt="" />}
          </div>
          <div className="anatomy-label">
            the SVG as a stencil
            <br />
            <code>mask-image: var(--svg)</code>
          </div>
        </div>
        <div className="anatomy-op" aria-hidden="true">
          =
        </div>
        <div className="anatomy-cell">
          <div className="anatomy-box">
            <i className={name} />
          </div>
          <div className="anatomy-label">
            the icon, in whatever
            <br />
            <code>color</code> its parent has
          </div>
        </div>
      </div>
    </div>
  );
}

export function DocsPage() {
  const ids = useMemo(() => TOC.flatMap((g) => g.items.map((i) => i.id)), []);
  const active = useActiveSection(ids);

  const sampleMono = monoIcons[0]?.className ?? `${PREFIX}-add`;
  const sampleMulti = multiIcons[0]?.className;
  const monoCommon = getCommonRule('mono');
  const monoRule = shortenDataUrls(getIconRule(sampleMono));
  const multiCommon = getCommonRule('multi');
  const multiRule = sampleMulti ? shortenDataUrls(getIconRule(sampleMulti)) : '';
  const kb = (cssBytes / 1024).toFixed(1);
  const perIcon = icons.length ? Math.round(cssBytes / icons.length) : 0;

  return (
    <div className="docs">
      <aside className="toc" aria-label="On this page">
        {TOC.map((group) => (
          <div className="toc-group" key={group.title}>
            <p className="toc-title">{group.title}</p>
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={active === item.id ? 'active' : undefined}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </aside>

      <article className="content">
        <header className="hero">
          <span className="eyebrow">SVG → CSS icon classes</span>
          <h1>
            Your SVG folder, <span>as plain CSS classes.</span>
          </h1>
          <p>
            csvgtocss turns a folder of SVG files into one CSS file. Every icon becomes a class like{' '}
            <code>.{sampleMono}</code> that you can drop on any element — no icon font, no JavaScript, no sprite. Monochrome
            icons follow the text <code>color</code>; multicolor icons keep their original colors.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => scrollToSection('quick-start')}>
              Get started
            </button>
            <a className="btn" href="#/icons">
              Browse the demo icons →
            </a>
          </div>
          <div className="hero-strip" aria-label="Sample icons">
            {icons.slice(0, 14).map((icon) => (
              <i key={icon.className} className={icon.className} title={icon.className} />
            ))}
          </div>
        </header>

        {/* ---------------- Getting started ---------------- */}

        <section className="section" id="installation">
          <h2>Installation</h2>
          <p>csvgtocss is a build-time tool, so install it as a dev dependency.</p>
          <CodeBlock title="terminal" code={`npm i -D csvgtocss\n# or\npnpm add -D csvgtocss`} />
        </section>

        <section className="section" id="quick-start">
          <h2>Quick start</h2>
          <ol className="steps">
            <li>
              <strong>Put your SVG files in a folder</strong>
              <p>
                One file per icon. The file name becomes the class name, lower-cased and kebab-cased:{' '}
                <code>ArrowLeft.svg</code> → <code>.{PREFIX}-arrowleft</code>, <code>ic_close.svg</code> →{' '}
                <code>.{PREFIX}-ic-close</code>.
              </p>
              <CodeBlock title="project" code={`svg/\n  add.svg\n  bell.svg\n  logo-color.svg`} />
            </li>
            <li>
              <strong>Create a config file</strong>
              <p>
                Name it <code>svgtocss.config.ts</code> (or <code>.js</code> / <code>.mjs</code>) in the project root.
              </p>
              <CodeBlock
                title="svgtocss.config.ts"
                code={`import { defineConfig } from 'csvgtocss';

export default defineConfig({
  src: 'svg',          // folder with your .svg files
  dist: 'src/icons',   // output folder (emptied on every run!)
  prefix: 'icon',      // class prefix -> .icon-add
  exportJson: true,    // also write an Iconify JSON collection
});`}
              />
            </li>
            <li>
              <strong>Add a script and run it</strong>
              <CodeBlock
                title="package.json"
                code={`{
  "scripts": {
    "icons": "csvgtocss"
  }
}`}
              />
              <CodeBlock title="terminal" code={`npm run icons\n\n# use another config file name\nnpx csvgtocss -c my-icons.config`} />
            </li>
            <li>
              <strong>Import the CSS and use a class</strong>
              <CodeBlock
                title="html"
                code={`<link rel="stylesheet" href="/src/icons/icon-css.css" />

<i class="${sampleMono}"></i>`}
              />
            </li>
          </ol>
          <div className="callout">
            <span className="callout-icon">!</span>
            <span>
              The <code>dist</code> folder is emptied before every run. Point it at a folder that only holds generated
              icons.
            </span>
          </div>
        </section>

        <section className="section" id="output">
          <h2>Output files</h2>
          <p>
            With <code>prefix: '{PREFIX}'</code>, one run writes:
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>File</th>
                  <th>What it is</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>{PREFIX}-css.css</code>
                  </td>
                  <td>All icon classes, with each SVG embedded as a data URI. This is the only file your app needs.</td>
                </tr>
                <tr>
                  <td>
                    <code>{PREFIX}-type.d.ts</code>
                  </td>
                  <td>
                    A union type of every class name, <code>T{PREFIX}</code>, for type-safe icon props.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>{PREFIX}-demo.html</code>
                  </td>
                  <td>A local preview page with search, size and color controls. Open it next to the CSS file.</td>
                </tr>
                <tr>
                  <td>
                    <code>{PREFIX}-collection.json</code>
                  </td>
                  <td>
                    The cleaned icons as an Iconify JSON collection. Only when <code>exportJson: true</code>.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="section" id="usage">
          <h2>Using the icons</h2>
          <p>
            An icon is an empty inline element with a class. Every icon is <code>1em</code> × <code>1em</code>, so it is
            sized by <code>font-size</code> and lines up with the surrounding text.
          </p>
          <CodeBlock
            title="html"
            code={`<!-- inherits size and color from the text around it -->
<button><i class="${sampleMono}"></i> Add item</button>

<!-- size with font-size, color with color -->
<i class="${sampleMono}" style="font-size: 32px; color: #4f46e5"></i>

<!-- decorative icons: hide from screen readers -->
<i class="${sampleMono}" aria-hidden="true"></i>

<!-- meaningful icons: give them a label -->
<i class="${sampleMono}" role="img" aria-label="Add"></i>`}
          />
          <h3>Size and color</h3>
          <ul>
            <li>
              <strong>Size:</strong> set <code>font-size</code> on the icon or any parent. Non-square icons keep their
              aspect ratio: the width is generated from the viewBox.
            </li>
            <li>
              <strong>Color (monochrome icons):</strong> set <code>color</code>. Hover and focus styles, dark mode and
              transitions work like they do for text.
            </li>
            <li>
              <strong>Color (multicolor icons):</strong> fixed. They render with their original palette.
            </li>
          </ul>
        </section>

        <section className="section" id="react">
          <h2>React</h2>
          <p>
            No runtime package is needed: import the CSS once and render a class name. The generated type makes typos a
            compile error.
          </p>
          <CodeBlock
            title="Icon.tsx"
            code={`import type { HTMLAttributes } from 'react';
import './icons/${PREFIX}-css.css';
import type { T${PREFIX} } from './icons/${PREFIX}-type';

type IconProps = HTMLAttributes<HTMLElement> & { name: T${PREFIX} };

export function Icon({ name, className, ...rest }: IconProps) {
  return (
    <i
      className={className ? \`\${name} \${className}\` : name}
      aria-hidden={rest['aria-label'] ? undefined : true}
      {...rest}
    />
  );
}`}
          />
          <CodeBlock
            title="usage"
            code={`<Icon name="${sampleMono}" />
<Icon name="${sampleMono}" style={{ fontSize: 24, color: 'tomato' }} />
<Icon name="${sampleMono}" role="img" aria-label="Add" />`}
          />
        </section>

        <section className="section" id="config">
          <h2>Configuration</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>src</code>
                  </td>
                  <td>string</td>
                  <td>—</td>
                  <td>
                    Folder with the SVG files, relative to the working directory. Subfolders are included, but the folder
                    name is not part of the class name, so file names must be unique.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>dist</code>
                  </td>
                  <td>string</td>
                  <td>—</td>
                  <td>Output folder. It is emptied before files are written.</td>
                </tr>
                <tr>
                  <td>
                    <code>prefix</code>
                  </td>
                  <td>string</td>
                  <td>
                    <code>'icon'</code>
                  </td>
                  <td>
                    Class prefix and file name prefix: <code>.prefix-name</code>, <code>prefix-css.css</code>.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>exportJson</code>
                  </td>
                  <td>boolean</td>
                  <td>
                    <code>false</code>
                  </td>
                  <td>
                    Also write <code>prefix-collection.json</code> (Iconify format).
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3>Programmatic use</h3>
          <CodeBlock
            title="build-icons.mjs"
            code={`import { svg2Font } from 'csvgtocss';

await svg2Font({ src: 'svg', dist: 'src/icons', prefix: 'icon' });`}
          />
        </section>

        <div className="divider" />

        {/* ---------------- How it works ---------------- */}

        <section className="section" id="pipeline">
          <h2>The pipeline</h2>
          <p>
            Everything happens at build time with{' '}
            <a href="https://iconify.design/docs/libraries/tools/" target="_blank" rel="noopener noreferrer">
              @iconify/tools
            </a>
            . Your app only ever receives the finished CSS.
          </p>
          <div className="pipeline">
            <div className="pipeline-step">
              <b>1 · import</b>
              <span>Read every .svg in src and name it from the file name.</span>
            </div>
            <div className="pipeline-step">
              <b>2 · clean up</b>
              <span>Validate the markup, strip editor metadata, turn &lt;style&gt; rules into attributes.</span>
            </div>
            <div className="pipeline-step">
              <b>3 · classify</b>
              <span>Count the visible fill and stroke colors: one color = monochrome.</span>
            </div>
            <div className="pipeline-step">
              <b>4 · recolor</b>
              <span>Monochrome only: replace every color with currentColor.</span>
            </div>
            <div className="pipeline-step">
              <b>5 · optimize</b>
              <span>Run SVGO to shrink paths and drop unused markup.</span>
            </div>
            <div className="pipeline-step">
              <b>6 · emit CSS</b>
              <span>Encode each SVG as a data URI inside a class rule.</span>
            </div>
          </div>
        </section>

        <section className="section" id="mono-multi">
          <h2>Monochrome vs multicolor</h2>
          <p>
            The analyzer walks the SVG tree and collects the colors that actually get painted: fills and strokes on shapes,
            including inherited ones. Colors inside <code>&lt;defs&gt;</code>, <code>&lt;clipPath&gt;</code>,{' '}
            <code>&lt;mask&gt;</code> and hidden elements are ignored, because they never show up as ink.
          </p>
          <div className="cards">
            <div className="card">
              <h4>Monochrome → mask</h4>
              <p>
                0 or 1 painted color. Opacity differences are fine: a 20% and a 100% layer of the same color stay
                monochrome. Rendered with <code>mask-image</code>, so the color comes from CSS.
              </p>
            </div>
            <div className="card">
              <h4>Multicolor → background</h4>
              <p>
                2+ colors, a gradient, a pattern or an embedded bitmap. Rendered with <code>background-image</code>, so
                the original palette is kept.
              </p>
            </div>
          </div>
          <p style={{ marginTop: 16 }}>
            The generated CSS has one shared rule per group and one small rule per icon. From the demo set used on this
            site:
          </p>
          {monoCommon && <CodeBlock title={`${PREFIX}-css.css · monochrome`} code={`${monoCommon}\n\n${monoRule}`} />}
          {multiCommon && multiRule && (
            <CodeBlock title={`${PREFIX}-css.css · multicolor`} code={`${multiCommon}\n\n${multiRule}`} />
          )}
        </section>

        <section className="section" id="mask">
          <h2>The CSS mask trick</h2>
          <p>
            A monochrome icon is not drawn from its own colors at all. The element is a <code>1em</code> box filled with{' '}
            <code>background-color: currentColor</code>, and the SVG is used as a <strong>mask</strong>: where the SVG is
            opaque the background shows through, where it is transparent the box is cut away. The color in the SVG itself
            does not matter, only its shape and alpha.
          </p>
          <MaskAnatomy />
          <p>
            Because the visible color is a plain CSS <code>background-color</code> that resolves to{' '}
            <code>currentColor</code>, an icon picks up <code>color</code> from its parent exactly like text: link hover
            states, disabled buttons, dark mode and CSS transitions all just work. The per-icon rule only sets a custom
            property, <code>--svg</code>, which the shared rule feeds into <code>mask-image</code>. That keeps each icon
            down to a single declaration.
          </p>
        </section>

        <section className="section" id="why">
          <h2>Why CSS icons?</h2>
          <p>
            There are many ways to put an icon on a page. Here is how CSS classes compare with the usual options:
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Approach</th>
                  <th>Multicolor</th>
                  <th>Color via CSS</th>
                  <th>Cost in JS bundle</th>
                  <th>Requests</th>
                </tr>
              </thead>
              <tbody>
                <tr className="highlight">
                  <td>CSS classes (csvgtocss)
                    <small className="note">Cached with your CSS. Crisp vectors. No runtime.</small>
                  </td>
                  <td className="yes">Yes</td>
                  <td className="yes">Mono icons</td>
                  <td className="yes">None</td>
                  <td>1 CSS file</td>
                </tr>
                <tr>
                  <td>Icon font
                    <small className="note">Glyphs are hinted like text, baseline quirks, invisible until the font loads.</small>
                  </td>
                  <td className="no">No</td>
                  <td className="yes">Yes</td>
                  <td className="yes">None</td>
                  <td>Font files</td>
                </tr>
                <tr>
                  <td>Inline SVG / React components
                    <small className="note">Can style single paths, but icons ship in JS and add DOM nodes.</small>
                  </td>
                  <td className="yes">Yes</td>
                  <td className="yes">Yes</td>
                  <td className="no">Every icon</td>
                  <td>None</td>
                </tr>
                <tr>
                  <td>
                    <code>&lt;img src="icon.svg"&gt;</code>
                  
                    <small className="note">Simple, but cannot follow the text color.</small>
                  </td>
                  <td className="yes">Yes</td>
                  <td className="no">No</td>
                  <td className="yes">None</td>
                  <td className="meh">1 per icon</td>
                </tr>
                <tr>
                  <td>
                    SVG sprite + <code>&lt;use&gt;</code>
                  
                    <small className="note">Verbose markup; external sprites must be same-origin.</small>
                  </td>
                  <td className="yes">Yes</td>
                  <td className="yes">Yes</td>
                  <td className="yes">None</td>
                  <td>1 sprite</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3>In short</h3>
          <ul>
            <li>
              <strong>Zero JavaScript.</strong> Icons are not components, so they add nothing to your bundle, to hydration
              or to React's render work. They work the same in React, Vue, Svelte, server-rendered HTML or Markdown.
            </li>
            <li>
              <strong>One cacheable file.</strong> All icons live in one stylesheet that can be bundled and cached with the
              rest of your CSS. The demo set here is {kb} KB for {icons.length} icons (about {perIcon} bytes each,
              before gzip).
            </li>
            <li>
              <strong>Behaves like text.</strong> <code>1em</code> sizing and <code>currentColor</code> mean icons follow
              the typography and color of their context.
            </li>
            <li>
              <strong>No font-rendering artifacts.</strong> Unlike icon fonts, icons are drawn as images, so they are not
              hinted or anti-aliased like glyphs and never flash as empty squares.
            </li>
            <li>
              <strong>Multicolor included.</strong> Icon fonts are one color. Here, multicolor icons just switch to{' '}
              <code>background-image</code>.
            </li>
          </ul>
        </section>

        <section className="section" id="tradeoffs">
          <h2>Trade-offs</h2>
          <ul>
            <li>
              <strong>All icons, always.</strong> The whole set is in the CSS even if a page uses three of them. Keep
              sets focused, or split them into several folders and prefixes.
            </li>
            <li>
              <strong>No per-path styling.</strong> You cannot color or animate one part of an icon. Use inline SVG for
              those few cases.
            </li>
            <li>
              <strong>Multicolor icons cannot be recolored.</strong> They are background images.
            </li>
            <li>
              <strong>Accessibility is up to you.</strong> The element is empty, so add <code>aria-hidden="true"</code>{' '}
              for decoration or <code>role="img"</code> with <code>aria-label</code> when the icon carries meaning.
            </li>
            <li>
              <strong>Printing.</strong> Browsers skip backgrounds when printing unless the user enables them. Add{' '}
              <code>print-color-adjust: exact</code> to icons that must appear on paper.
            </li>
            <li>
              <strong>Browser support.</strong> CSS masks work in all current browsers; the generated CSS includes the{' '}
              <code>-webkit-</code> prefixed properties for older Safari and Chromium.
            </li>
          </ul>
        </section>

        <section className="section" id="troubleshooting">
          <h2>Troubleshooting</h2>
          <h3>An icon is missing from the output</h3>
          <p>
            Icons that fail to parse are skipped and the CLI prints <code>Generate icon ERROR</code>. A common cause is
            SVGs exported from Figma or Illustrator that reference a clip path that does not exist, for example{' '}
            <code>clip-path="url(#clip0_12_34)"</code> without a matching <code>&lt;clipPath&gt;</code>. Remove the
            attribute or re-export the icon. SVGs that contain <code>&lt;script&gt;</code> or other unsupported elements
            are rejected the same way.
          </p>
          <h3>
            A one-color icon does not follow <code>color</code>
          </h3>
          <p>
            It was classified as multicolor. Check for a leftover background rectangle (for example a white frame
            exported from Figma), a gradient, or two slightly different shades of the same color, and remove them from the
            SVG.
          </p>
          <h3>A class name is not what I expected</h3>
          <p>
            Names come from file names and are normalized by Iconify: lower-cased, with spaces and underscores turned into
            dashes. The generated <code>{PREFIX}-type.d.ts</code> lists every final name.
          </p>
        </section>

        <p style={{ marginTop: 48, color: 'var(--text-3)', fontSize: 13 }}>
          This site's icons are generated from the repository's <code>test/svg</code> folder by csvgtocss itself (
          {CSS_TEXT.length.toLocaleString()} characters of CSS).
        </p>
      </article>
    </div>
  );
}
