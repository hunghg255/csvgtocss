import { useState } from 'react';
import { copyText } from '../clipboard';

type Props = {
  code: string;
  title?: string;
};

export function CodeBlock({ code, title }: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await copyText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="code">
      <div className="code-head">
        <span>{title ?? ''}</span>
        <button type="button" className="copy-btn" onClick={onCopy}>
          {copied ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </svg>
          )}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <code style={{ background: 'none', border: 0, padding: 0 }}>{code}</code>
      </pre>
    </div>
  );
}
