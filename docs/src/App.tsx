import { useEffect, useState } from 'react';
import { DocsPage } from './pages/DocsPage';
import { IconsPage } from './pages/IconsPage';

type Route = 'docs' | 'icons';

const readRoute = (): Route => (window.location.hash.startsWith('#/icons') ? 'icons' : 'docs');

const THEME_KEY = 'csvgtocss-docs:theme';

function toggleTheme() {
  const root = document.documentElement;
  const current =
    root.getAttribute('data-theme') ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // storage unavailable: theme still applies for this visit
  }
}

export function App() {
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(readRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.title = route === 'icons' ? 'Icons · csvgtocss' : 'Docs · csvgtocss';
  }, [route]);

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <a className="logo" href="#/">
            <span className="logo-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <circle cx="17.5" cy="17.5" r="3.5" />
              </svg>
            </span>
            <span className="logo-text">csvgtocss</span>
          </a>
          <nav className="nav">
            <a href="#/" aria-current={route === 'docs' ? 'page' : undefined}>
              Docs
            </a>
            <a href="#/icons" aria-current={route === 'icons' ? 'page' : undefined}>
              Icons
            </a>
          </nav>
          <div className="header-actions">
            <button type="button" className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
              </svg>
            </button>
            <a
              className="icon-btn"
              href="https://github.com/hunghg255/csvgtocss"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <main>{route === 'icons' ? <IconsPage /> : <DocsPage />}</main>

      <footer className="footer">
        MIT Licensed · <a href="https://www.npmjs.com/package/csvgtocss">csvgtocss on npm</a>
      </footer>
    </>
  );
}
