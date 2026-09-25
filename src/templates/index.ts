export const stylesTemplate = ({ fontname, timestamp, cssString, prefix, fontSize }: any) => {
  return `
@font-face {
  font-family: "${fontname}";
  src: url('${fontname}.eot?t=${timestamp}'); /* IE9*/
  src: url('${fontname}.eot?t=${timestamp}#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url("${fontname}.woff2?t=${timestamp}") format("woff2"),
  url("${fontname}.woff?t=${timestamp}") format("woff"),
  url('${fontname}.ttf?t=${timestamp}') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
  url('${fontname}.svg?t=${timestamp}#${fontname}') format('svg'); /* iOS 4.1- */
}

[class^="${prefix}-"], [class*=" ${prefix}-"] {
  font-family: '${fontname}' !important;
  font-size:${fontSize};
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

${cssString}
  `;
};


const escapeHtml = (value: string) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderCards = (icons: Array<{ name: string }>, prefix: string, kind: 'mono' | 'multi') =>
  icons
    .map((it) => {
      const fullName = escapeHtml(`${prefix}-${it.name}`);
      return `<div class="card" role="button" tabindex="0" data-name="${fullName}" data-kind="${kind}" title="${fullName}">
            <span class="card-preview"><i class="${fullName}"></i></span>
            <span class="card-name">${fullName}</span>
            <button type="button" class="card-action" data-copy="html" aria-label="Copy HTML snippet" title="Copy HTML">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>
            </button>
          </div>`;
    })
    .join('');

const renderSection = (
  icons: Array<{ name: string }>,
  prefix: string,
  kind: 'mono' | 'multi',
  title: string,
  hint: string,
) => {
  if (!icons.length) return '';
  return `<section class="section" data-section="${kind}">
        <header class="section-head">
          <h2>${title}</h2>
          <span class="badge">${icons.length}</span>
          <span class="section-hint">${hint}</span>
        </header>
        <div class="grid">
          ${renderCards(icons, prefix, kind)}
        </div>
      </section>`;
};

export const genHtml = ({ prefix, svgMonochrome, svgMultichrome }: any) => {
  const safePrefix = escapeHtml(prefix);
  const monoCount = svgMonochrome.length;
  const multiCount = svgMultichrome.length;
  const total = monoCount + multiCount;
  const generatedAt = new Date().toISOString().slice(0, 10);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <title>${safePrefix} · icons</title>
    <link rel="stylesheet" href="${safePrefix}-css.css" />
    <style>
      :root {
        --bg: #f7f7f8;
        --surface: #ffffff;
        --surface-2: #f1f1f4;
        --border: #e6e6eb;
        --border-strong: #d4d4dc;
        --text: #18181b;
        --text-2: #52525b;
        --text-3: #a1a1aa;
        --accent: #4f46e5;
        --accent-soft: rgba(79, 70, 229, 0.1);
        --header-bg: rgba(247, 247, 248, 0.8);
        --shadow: 0 1px 2px rgba(24, 24, 27, 0.04), 0 8px 24px -8px rgba(24, 24, 27, 0.12);
        --icon-size: 32px;
        --icon-color: currentColor;
        --radius: 14px;
      }
      @media (prefers-color-scheme: dark) {
        :root:not([data-theme="light"]) {
          --bg: #0b0b0e;
          --surface: #141418;
          --surface-2: #1c1c22;
          --border: #25252d;
          --border-strong: #34343e;
          --text: #f4f4f5;
          --text-2: #a1a1aa;
          --text-3: #6b6b76;
          --accent: #818cf8;
          --accent-soft: rgba(129, 140, 248, 0.14);
          --header-bg: rgba(11, 11, 14, 0.75);
          --shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 10px 30px -10px rgba(0, 0, 0, 0.6);
        }
      }
      :root[data-theme="dark"] {
        --bg: #0b0b0e;
        --surface: #141418;
        --surface-2: #1c1c22;
        --border: #25252d;
        --border-strong: #34343e;
        --text: #f4f4f5;
        --text-2: #a1a1aa;
        --text-3: #6b6b76;
        --accent: #818cf8;
        --accent-soft: rgba(129, 140, 248, 0.14);
        --header-bg: rgba(11, 11, 14, 0.75);
        --shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 10px 30px -10px rgba(0, 0, 0, 0.6);
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background: var(--bg);
        color: var(--text);
        font-size: 14px;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        min-height: 100vh;
      }
      button { font: inherit; color: inherit; }
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }

      /* Header */
      .header {
        position: sticky;
        top: 0;
        z-index: 20;
        background: var(--header-bg);
        backdrop-filter: saturate(180%) blur(14px);
        -webkit-backdrop-filter: saturate(180%) blur(14px);
        border-bottom: 1px solid var(--border);
      }
      .header-inner, .toolbar, .main {
        max-width: 1280px;
        margin: 0 auto;
        padding-left: 24px;
        padding-right: 24px;
      }
      .header-inner {
        display: flex;
        align-items: center;
        gap: 16px;
        height: 64px;
      }
      .brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
      .brand-mark {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        color: #fff;
        background: linear-gradient(135deg, #6366f1, #a855f7 60%, #ec4899);
        box-shadow: 0 4px 14px -4px rgba(99, 102, 241, 0.6);
        flex-shrink: 0;
      }
      .brand-mark svg { width: 18px; height: 18px; }
      .brand-title { font-size: 16px; font-weight: 650; letter-spacing: -0.01em; white-space: nowrap; }
      .brand-sub { font-size: 12px; color: var(--text-3); white-space: nowrap; }

      .search {
        position: relative;
        flex: 1;
        max-width: 480px;
        margin-left: auto;
      }
      .search svg {
        position: absolute;
        left: 12px;
        top: 50%;
        width: 16px;
        height: 16px;
        transform: translateY(-50%);
        color: var(--text-3);
        pointer-events: none;
      }
      .search input {
        width: 100%;
        height: 40px;
        padding: 0 44px 0 38px;
        border-radius: 10px;
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--text);
        font: inherit;
        outline: none;
        transition: border-color 0.15s, box-shadow 0.15s;
      }
      .search input::placeholder { color: var(--text-3); }
      .search input:not(:placeholder-shown) ~ .kbd { display: none; }
      .search input:focus { border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-soft); }
      .kbd {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 11px;
        line-height: 1;
        padding: 4px 7px;
        border-radius: 6px;
        border: 1px solid var(--border);
        color: var(--text-3);
        background: var(--surface-2);
        pointer-events: none;
      }
      .icon-btn {
        width: 40px;
        height: 40px;
        display: inline-grid;
        place-items: center;
        border-radius: 10px;
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--text-2);
        cursor: pointer;
        text-decoration: none;
        flex-shrink: 0;
        transition: color 0.15s, border-color 0.15s, background 0.15s;
      }
      .icon-btn:hover { color: var(--text); border-color: var(--border-strong); }
      .icon-btn svg { width: 18px; height: 18px; }
      .theme-dark { display: none; }
      :root[data-theme="dark"] .theme-dark { display: block; }
      :root[data-theme="dark"] .theme-light { display: none; }
      @media (prefers-color-scheme: dark) {
        :root:not([data-theme="light"]) .theme-dark { display: block; }
        :root:not([data-theme="light"]) .theme-light { display: none; }
      }

      /* Toolbar */
      .toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px 20px;
        padding-top: 20px;
        padding-bottom: 4px;
      }
      .segmented {
        display: inline-flex;
        padding: 3px;
        border-radius: 11px;
        background: var(--surface-2);
        border: 1px solid var(--border);
      }
      .segmented button {
        border: 0;
        background: transparent;
        padding: 6px 12px;
        border-radius: 8px;
        cursor: pointer;
        color: var(--text-2);
        font-weight: 500;
        font-size: 13px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: background 0.15s, color 0.15s;
      }
      .segmented button:hover { color: var(--text); }
      .segmented button[aria-pressed="true"] {
        background: var(--surface);
        color: var(--text);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 0 0 1px var(--border);
      }
      .segmented .count { font-size: 11px; color: var(--text-3); font-variant-numeric: tabular-nums; }
      .control { display: inline-flex; align-items: center; gap: 10px; color: var(--text-2); font-size: 13px; }
      .control input[type="range"] { width: 120px; accent-color: var(--accent); }
      .control output { min-width: 36px; font-variant-numeric: tabular-nums; color: var(--text); }
      .swatch {
        position: relative;
        width: 28px;
        height: 28px;
        border-radius: 8px;
        border: 1px solid var(--border-strong);
        overflow: hidden;
        cursor: pointer;
        background: var(--text);
      }
      .swatch input { position: absolute; inset: -8px; width: 44px; height: 44px; opacity: 0; cursor: pointer; }
      .link-btn {
        border: 0;
        background: none;
        padding: 0;
        color: var(--text-3);
        font-size: 12px;
        cursor: pointer;
        text-decoration: underline;
        text-underline-offset: 2px;
      }
      .link-btn:hover { color: var(--text); }
      .toolbar-spacer { flex: 1; }
      .result-count { color: var(--text-3); font-size: 13px; font-variant-numeric: tabular-nums; }

      /* Sections & grid */
      .main { padding-top: 8px; padding-bottom: 64px; }
      .section { margin-top: 28px; }
      .section-head { display: flex; align-items: baseline; gap: 10px; margin: 0 2px 14px; }
      .section-head h2 { margin: 0; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
      .badge {
        font-size: 11px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 999px;
        color: var(--accent);
        background: var(--accent-soft);
        font-variant-numeric: tabular-nums;
      }
      .section-hint { color: var(--text-3); font-size: 12px; }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(max(128px, calc(var(--icon-size) + 72px)), 1fr));
        gap: 12px;
      }
      .card {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 12px;
        padding: 26px 10px 12px;
        border-radius: var(--radius);
        border: 1px solid var(--border);
        background: var(--surface);
        cursor: pointer;
        outline: none;
        user-select: none;
        transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
      }
      .card:hover { transform: translateY(-2px); border-color: var(--border-strong); box-shadow: var(--shadow); }
      .card:focus-visible { border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-soft); }
      .card.copied { border-color: var(--accent); }
      .card-preview {
        display: grid;
        place-items: center;
        height: calc(var(--icon-size) + 8px);
        font-size: var(--icon-size);
        line-height: 1;
        color: var(--text);
      }
      .card[data-kind="mono"] .card-preview { color: var(--icon-color); }
      .card-name {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 11px;
        color: var(--text-2);
        text-align: center;
        line-height: 1.4;
        max-width: 100%;
        overflow: hidden;
        overflow-wrap: anywhere;
        min-height: 2.8em;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .card-name mark { background: var(--accent-soft); color: var(--accent); border-radius: 3px; padding: 0 1px; }
      .card-action {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 28px;
        height: 28px;
        display: grid;
        place-items: center;
        border-radius: 8px;
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--text-2);
        cursor: pointer;
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 0.15s, transform 0.15s, color 0.15s;
      }
      .card-action svg { width: 14px; height: 14px; }
      .card:hover .card-action, .card:focus-within .card-action { opacity: 1; transform: none; }
      .card-action:hover { color: var(--accent); border-color: var(--accent); }
      @media (hover: none) { .card-action { opacity: 1; transform: none; } }
      .card.is-hidden, .section.is-hidden { display: none; }

      /* Empty state */
      .empty { display: none; text-align: center; padding: 96px 20px; color: var(--text-3); }
      .empty.show { display: block; }
      .empty svg { width: 44px; height: 44px; margin-bottom: 12px; opacity: 0.6; }
      .empty strong { display: block; color: var(--text); font-size: 15px; font-weight: 600; margin-bottom: 4px; }

      /* Toast */
      .toast {
        position: fixed;
        left: 50%;
        bottom: 28px;
        z-index: 50;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: calc(100vw - 32px);
        padding: 10px 16px 10px 12px;
        border-radius: 12px;
        background: #18181b;
        color: #fafafa;
        font-size: 13px;
        box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.4);
        opacity: 0;
        pointer-events: none;
        transform: translate(-50%, 12px);
        transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      :root[data-theme="dark"] .toast { background: #f4f4f5; color: #18181b; }
      @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) .toast { background: #f4f4f5; color: #18181b; } }
      .toast.show { opacity: 1; transform: translate(-50%, 0); }
      .toast-check {
        width: 22px;
        height: 22px;
        border-radius: 999px;
        display: grid;
        place-items: center;
        background: #22c55e;
        color: #fff;
        flex-shrink: 0;
      }
      .toast-check svg { width: 13px; height: 13px; }
      .toast code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

      .footer { text-align: center; color: var(--text-3); font-size: 12px; padding: 0 16px 32px; }
      .footer a { color: var(--text-2); }

      @media (max-width: 720px) {
        .header-inner, .toolbar, .main { padding-left: 16px; padding-right: 16px; }
        .header-inner { flex-wrap: wrap; height: auto; padding-top: 12px; padding-bottom: 12px; }
        .search { order: 3; flex-basis: 100%; max-width: none; }
        .brand { margin-right: auto; }
        .kbd { display: none; }
        .toolbar-spacer { display: none; }
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { transition: none !important; }
      }
    </style>
    <script>
      try {
        var savedTheme = localStorage.getItem('csvgtocss:theme');
        if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
      } catch (e) {}
    </script>
  </head>

  <body>
    <header class="header">
      <div class="header-inner">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><circle cx="17.5" cy="17.5" r="3.5"/></svg>
          </div>
          <div>
            <div class="brand-title">${safePrefix}</div>
            <div class="brand-sub">${total} icons · generated ${generatedAt}</div>
          </div>
        </div>

        <label class="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input id="search" type="search" placeholder="Search icons…" autocomplete="off" spellcheck="false" aria-label="Search icons" />
          <span class="kbd">/</span>
        </label>

        <button type="button" class="icon-btn" id="themeToggle" aria-label="Toggle theme" title="Toggle theme">
          <svg class="theme-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
          <svg class="theme-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        </button>
        <a class="icon-btn" href="https://github.com/hunghg255/csvgtocss" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>
        </a>
      </div>
    </header>

    <div class="toolbar">
      <div class="segmented" role="group" aria-label="Filter icons">
        <button type="button" data-filter="all" aria-pressed="true">All <span class="count">${total}</span></button>
        <button type="button" data-filter="mono" aria-pressed="false">Monochrome <span class="count">${monoCount}</span></button>
        <button type="button" data-filter="multi" aria-pressed="false">Multicolor <span class="count">${multiCount}</span></button>
      </div>

      <label class="control">
        Size
        <input id="size" type="range" min="16" max="64" step="4" value="32" />
        <output id="sizeValue">32px</output>
      </label>

      <div class="control">
        Color
        <label class="swatch" id="swatch" title="Color for monochrome icons">
          <input id="color" type="color" value="#18181b" aria-label="Color for monochrome icons" />
        </label>
        <button type="button" class="link-btn" id="colorReset">Reset</button>
      </div>

      <div class="toolbar-spacer"></div>
      <span class="result-count" id="resultCount">${total} icons</span>
    </div>

    <main class="main">
      ${renderSection(svgMonochrome, prefix, 'mono', 'Monochrome', 'Inherits <code class="mono">color</code>')}
      ${renderSection(svgMultichrome, prefix, 'multi', 'Multicolor', 'Keeps original colors')}

      <div class="empty" id="empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M8.5 11h5"/></svg>
        <strong>No icons found</strong>
        <span id="emptyText">Try a different search term.</span>
      </div>
    </main>

    <footer class="footer">
      Click an icon to copy its class name · <span class="mono">&lt;/&gt;</span> copies the HTML snippet ·
      Generated with <a href="https://github.com/hunghg255/csvgtocss" target="_blank" rel="noopener">csvgtocss</a>
    </footer>

    <div class="toast" id="toast" role="status" aria-live="polite">
      <span class="toast-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
      <span>Copied</span>
      <code id="toastText"></code>
    </div>

    <script>
      (function () {
        var root = document.documentElement;
        var search = document.getElementById('search');
        var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
        var sections = Array.prototype.slice.call(document.querySelectorAll('.section'));
        var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
        var resultCount = document.getElementById('resultCount');
        var empty = document.getElementById('empty');
        var emptyText = document.getElementById('emptyText');
        var size = document.getElementById('size');
        var sizeValue = document.getElementById('sizeValue');
        var color = document.getElementById('color');
        var swatch = document.getElementById('swatch');
        var toast = document.getElementById('toast');
        var toastText = document.getElementById('toastText');
        var total = cards.length;
        var activeFilter = 'all';
        var toastTimer;

        function store(key, value) {
          try {
            if (value == null) localStorage.removeItem('csvgtocss:' + key);
            else localStorage.setItem('csvgtocss:' + key, value);
          } catch (e) {}
        }
        function load(key) {
          try { return localStorage.getItem('csvgtocss:' + key); } catch (e) { return null; }
        }
        function escapeHtml(str) {
          return str.replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
          });
        }

        cards.forEach(function (card) {
          card._name = card.getAttribute('data-name');
          card._lower = card._name.toLowerCase();
          card._label = card.querySelector('.card-name');
        });

        // Search + filter
        function apply() {
          var query = search.value.trim().toLowerCase();
          var visible = 0;
          cards.forEach(function (card) {
            var kindOk = activeFilter === 'all' || card.getAttribute('data-kind') === activeFilter;
            var index = query ? card._lower.indexOf(query) : -1;
            var show = kindOk && (!query || index !== -1);
            card.classList.toggle('is-hidden', !show);
            if (show) visible++;
            if (show && index !== -1) {
              var n = card._name;
              card._label.innerHTML = escapeHtml(n.slice(0, index)) + '<mark>' + escapeHtml(n.slice(index, index + query.length)) + '</mark>' + escapeHtml(n.slice(index + query.length));
            } else if (card._label.firstElementChild) {
              card._label.textContent = card._name;
            }
          });
          sections.forEach(function (section) {
            section.classList.toggle('is-hidden', !section.querySelector('.card:not(.is-hidden)'));
          });
          resultCount.textContent = visible === total ? total + ' icons' : visible + ' of ' + total + ' icons';
          empty.classList.toggle('show', visible === 0);
          emptyText.textContent = query ? 'Nothing matches "' + search.value.trim() + '".' : 'No icons in this category.';
        }
        search.addEventListener('input', apply);
        filterButtons.forEach(function (btn) {
          btn.addEventListener('click', function () {
            activeFilter = btn.getAttribute('data-filter');
            filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
            apply();
          });
        });

        // Size
        function setSize(value) {
          root.style.setProperty('--icon-size', value + 'px');
          sizeValue.textContent = value + 'px';
          size.value = value;
        }
        size.addEventListener('input', function () { setSize(size.value); store('size', size.value); });
        if (load('size')) setSize(load('size'));

        // Color (monochrome only)
        function setColor(value) {
          if (value) {
            root.style.setProperty('--icon-color', value);
            swatch.style.background = value;
            color.value = value;
          } else {
            root.style.removeProperty('--icon-color');
            swatch.style.background = '';
          }
        }
        color.addEventListener('input', function () { setColor(color.value); store('color', color.value); });
        document.getElementById('colorReset').addEventListener('click', function () { setColor(null); store('color', null); });
        if (load('color')) setColor(load('color'));

        // Theme
        document.getElementById('themeToggle').addEventListener('click', function () {
          var current = root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          var next = current === 'dark' ? 'light' : 'dark';
          root.setAttribute('data-theme', next);
          store('theme', next);
        });

        // Copy
        function showToast(text) {
          toastText.textContent = text;
          toast.classList.add('show');
          clearTimeout(toastTimer);
          toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1600);
        }
        function copy(text, card) {
          function done() {
            showToast(text);
            if (card) {
              card.classList.add('copied');
              setTimeout(function () { card.classList.remove('copied'); }, 600);
            }
          }
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
          } else {
            fallbackCopy(text);
            done();
          }
        }
        function fallbackCopy(text) {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (e) {}
          document.body.removeChild(ta);
        }
        document.addEventListener('click', function (e) {
          var card = e.target.closest('.card');
          if (!card) return;
          var action = e.target.closest('[data-copy]');
          var name = card._name;
          copy(action ? '<i class="' + name + '"></i>' : name, card);
        });
        document.addEventListener('keydown', function (e) {
          var card = e.target.closest && e.target.closest('.card');
          if (card && e.target === card && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            copy(card._name, card);
            return;
          }
          if (e.key === '/' && document.activeElement !== search && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
            e.preventDefault();
            search.focus();
            search.select();
          } else if (e.key === 'Escape' && document.activeElement === search) {
            search.value = '';
            apply();
            search.blur();
          }
        });
      })();
    </script>
  </body>
</html>
`;
};
