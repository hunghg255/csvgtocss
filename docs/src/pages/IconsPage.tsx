import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { copyText } from '../clipboard';
import { PREFIX, getIconRule, icons, shortenDataUrls, type IconInfo, type IconKind } from '../icons';

type Filter = 'all' | IconKind;

const counts = {
  all: icons.length,
  mono: icons.filter((i) => i.kind === 'mono').length,
  multi: icons.filter((i) => i.kind === 'multi').length,
};

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'mono', label: 'Monochrome' },
  { value: 'multi', label: 'Multicolor' },
];

function Highlight({ text, query }: { text: string; query: string }) {
  const index = query ? text.toLowerCase().indexOf(query) : -1;
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark style={{ background: 'var(--accent-soft)', color: 'var(--accent)', borderRadius: 3 }}>
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}

function useToast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const timer = useRef<number>(undefined);
  const show = (text: string) => {
    setMessage(text);
    setVisible(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setVisible(false), 1600);
  };
  const node = (
    <div className={`toast${visible ? ' show' : ''}`} role="status" aria-live="polite">
      Copied <code>{message}</code>
    </div>
  );
  return { show, node };
}

function Detail({ icon, color }: { icon: IconInfo; color: string }) {
  return (
    <aside className="detail" aria-label="Selected icon">
      <div className="detail-preview" style={icon.kind === 'mono' ? { color } : undefined}>
        <i className={icon.className} />
      </div>
      <div className="detail-body">
        <div className="detail-title">
          <h2>{icon.className}</h2>
          <span className="tag">{icon.kind === 'mono' ? 'monochrome' : 'multicolor'}</span>
        </div>
        <p className="detail-hint">
          {icon.kind === 'mono'
            ? 'Rendered as a mask: follows the CSS color of its parent.'
            : 'Rendered as a background image: keeps its original colors.'}
        </p>
        <CodeBlock title="html" code={`<i class="${icon.className}"></i>`} />
        <CodeBlock title="react" code={`<Icon name="${icon.className}" />`} />
        <CodeBlock title="generated css" code={shortenDataUrls(getIconRule(icon.className), 40)} />
      </div>
    </aside>
  );
}

export function IconsPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [size, setSize] = useState(32);
  const [color, setColor] = useState('');
  const [selected, setSelected] = useState<IconInfo | undefined>(icons[0]);
  const searchRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () => icons.filter((i) => (filter === 'all' || i.kind === filter) && (!q || i.className.includes(q))),
    [filter, q],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'Escape' && target === searchRef.current) {
        setQuery('');
        searchRef.current?.blur();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const onPick = async (icon: IconInfo) => {
    setSelected(icon);
    await copyText(icon.className);
    toast.show(icon.className);
  };

  const gridStyle = { '--icon-size': `${size}px`, ...(color ? { '--icon-color': color } : {}) } as CSSProperties;

  return (
    <div className="icons-page">
      <div className="icons-head">
        <div>
          <h1>Icons</h1>
          <p>
            {icons.length} icons generated from <code>test/svg</code> with <code>prefix: '{PREFIX}'</code>. Click an icon
            to copy its class name.
          </p>
        </div>
      </div>

      <div className="toolbar">
        <label className="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            placeholder="Search icons…  ( / )"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search icons"
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        <div className="segmented" role="group" aria-label="Filter icons">
          {FILTERS.map((f) => (
            <button key={f.value} type="button" aria-pressed={filter === f.value} onClick={() => setFilter(f.value)}>
              {f.label}
              <span className="count">{counts[f.value]}</span>
            </button>
          ))}
        </div>

        <label className="control">
          Size
          <input type="range" min={16} max={64} step={4} value={size} onChange={(e) => setSize(Number(e.target.value))} />
          <output>{size}px</output>
        </label>

        <label className="control">
          Color
          <input
            type="color"
            value={color || '#808080'}
            onChange={(e) => setColor(e.target.value)}
            aria-label="Color for monochrome icons"
          />
          {color ? (
            <button type="button" className="copy-btn" onClick={() => setColor('')}>
              Reset
            </button>
          ) : (
            <span className="auto-label">auto</span>
          )}
        </label>
      </div>

      <div className="icons-layout">
        <div>
          {visible.length ? (
            <div className="icon-grid" style={gridStyle}>
              {visible.map((icon) => (
                <button
                  key={icon.className}
                  type="button"
                  className="icon-card"
                  data-kind={icon.kind}
                  aria-pressed={selected?.className === icon.className}
                  title={icon.className}
                  onClick={() => onPick(icon)}
                >
                  {icon.kind === 'multi' && <span className="kind-dot" title="Multicolor" />}
                  <span className="preview">
                    <i className={icon.className} />
                  </span>
                  <span className="label">
                    <Highlight text={icon.className} query={q} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty">
              <strong>No icons found</strong>
              {q ? `Nothing matches "${query.trim()}".` : 'No icons in this category.'}
            </div>
          )}
        </div>
        {selected && <Detail icon={selected} color={color || 'var(--text)'} />}
      </div>

      {toast.node}
    </div>
  );
}
