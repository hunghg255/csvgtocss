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

export const genHtml = ({ cssContent, prefix, svgMonochrome, svgMultichrome }: any) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>${prefix}</title>
      <meta
        name="viewport"
        content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
      />

      <link rel="stylesheet" href="${prefix}-css.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f8f9fc;
          color: #1a1a2e;
          min-height: 100vh;
        }

        /* Gradient Header */
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          text-align: center;
          padding: 60px 20px 80px;
          position: relative;
        }
        .header::after {
          content: '';
          position: absolute;
          bottom: -30px;
          left: 0;
          right: 0;
          height: 60px;
          background: #f8f9fc;
          border-radius: 50% 50% 0 0 / 100% 100% 0 0;
        }
        .header h1 {
          font-size: 48px;
          font-weight: 700;
          letter-spacing: -1px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.15);
        }
        .header .subtitle {
          font-size: 16px;
          opacity: 0.85;
          margin-top: 10px;
          font-weight: 400;
        }

        /* Search Section */
        .search-section {
          max-width: 520px;
          margin: -30px auto 0;
          padding: 0 20px;
          position: relative;
          z-index: 10;
        }
        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: #9ca3af;
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 18px 20px 18px 52px;
          font-size: 16px;
          font-family: inherit;
          border: none;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
          outline: none;
          transition: box-shadow 0.2s ease;
          color: #1a1a2e;
        }
        .search-input::placeholder { color: #9ca3af; }
        .search-input:focus {
          box-shadow: 0 4px 24px rgba(102,126,234,0.25), 0 1px 4px rgba(0,0,0,0.04);
        }
        .search-count {
          text-align: center;
          margin-top: 16px;
          font-size: 14px;
          color: #9ca3af;
          font-weight: 500;
        }

        /* Icons Container */
        .icons-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px 20px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #374151;
          margin: 40px 0 20px;
          padding-left: 4px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-title .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
          min-width: 28px;
        }

        /* Icon Grid */
        .icon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
        }

        .icon-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 8px 16px;
          background: #fff;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          position: relative;
          user-select: none;
        }
        .icon-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(102,126,234,0.15);
          border-color: rgba(102,126,234,0.2);
        }
        .icon-card:active {
          transform: translateY(-1px);
        }
        .icon-card .icon-preview {
          font-size: 30px;
          line-height: 1;
          color: #374151;
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
        }
        .icon-card:hover .icon-preview { color: #667eea; }
        .icon-card .icon-name {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 10px;
          text-align: center;
          word-break: break-all;
          line-height: 1.3;
          max-width: 100%;
          overflow: hidden;
          font-weight: 500;
        }
        .icon-card:hover .icon-name { color: #6b7280; }

        /* Copy Toast */
        .copy-toast {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          background: #1a1a2e;
          color: #fff;
          padding: 14px 28px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .copy-toast.show {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .copy-toast svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        /* Hidden class for search filter */
        .icon-card.hidden {
          display: none;
        }

        /* No Results */
        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #9ca3af;
          font-size: 16px;
          display: none;
        }
        .no-results.show { display: block; }
        .no-results svg {
          width: 64px;
          height: 64px;
          margin-bottom: 16px;
          opacity: 0.4;
        }

        /* Footer */
        .footer {
          text-align: center;
          padding: 40px 20px 80px;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
          transition: color 0.2s;
        }
        .footer a:hover { color: #764ba2; }

        ${cssContent}
      </style>
    </head>

    <body>
      <div class="header">
        <h1>${prefix}</h1>
        <p class="subtitle">Click any icon to copy its class name</p>
      </div>

      <div class="search-section">
        <div class="search-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            class="search-input"
            id="searchInput"
            placeholder="Search icons..."
            autocomplete="off"
          />
        </div>
        <div class="search-count" id="searchCount"></div>
      </div>

      <div class="icons-container">
        <div class="section-title">
          Monochrome
          <span class="badge">${svgMonochrome.length}</span>
        </div>
        <div class="icon-grid" id="monoGrid">
          ${svgMonochrome
            .map((it: any) => {
              var fullName = prefix + '-' + it.name;
              return (
                '<div class="icon-card" data-name="' +
                fullName +
                '" onclick="copyIcon(this)">' +
                '<span class="icon-preview"><i class="' +
                fullName +
                '"></i></span>' +
                '<span class="icon-name">' +
                fullName +
                '</span>' +
                '</div>'
              );
            })
            .join('')}
        </div>

        <div class="section-title">
          Multicolor
          <span class="badge">${svgMultichrome.length}</span>
        </div>
        <div class="icon-grid" id="multiGrid">
          ${svgMultichrome
            .map((it: any) => {
              var fullName = prefix + '-' + it.name;
              return (
                '<div class="icon-card" data-name="' +
                fullName +
                '" onclick="copyIcon(this)">' +
                '<span class="icon-preview"><i class="' +
                fullName +
                '"></i></span>' +
                '<span class="icon-name">' +
                fullName +
                '</span>' +
                '</div>'
              );
            })
            .join('')}
        </div>

        <div class="no-results" id="noResults">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
            <path d="M8 11h6"></path>
          </svg>
          <div>No icons match your search</div>
        </div>
      </div>

      <div class="footer">
        <a href="https://github.com/hunghg255/csvgtocss">GitHub</a>
      </div>

      <!-- Copy Toast -->
      <div class="copy-toast" id="copyToast">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6 9 17l-5-5"></path>
        </svg>
        <span id="toastText">Copied!</span>
      </div>

      <script>
        // Copy icon name to clipboard
        function copyIcon(el) {
          var name = el.getAttribute('data-name');
          navigator.clipboard.writeText(name).then(function() {
            showToast(name);
          }).catch(function() {
            // Fallback for older browsers
            var ta = document.createElement('textarea');
            ta.value = name;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast(name);
          });
        }

        // Show toast notification
        var toastTimeout;
        function showToast(name) {
          var toast = document.getElementById('copyToast');
          var text = document.getElementById('toastText');
          text.textContent = name + ' copied!';
          toast.classList.add('show');
          clearTimeout(toastTimeout);
          toastTimeout = setTimeout(function() {
            toast.classList.remove('show');
          }, 1800);
        }

        // Search / Filter
        var searchInput = document.getElementById('searchInput');
        var allCards = document.querySelectorAll('.icon-card');
        var monoGrid = document.getElementById('monoGrid');
        var multiGrid = document.getElementById('multiGrid');
        var noResults = document.getElementById('noResults');
        var searchCount = document.getElementById('searchCount');
        var sectionTitles = document.querySelectorAll('.section-title');

        searchInput.addEventListener('input', function() {
          var query = this.value.toLowerCase().trim();
          var visibleCount = 0;

          allCards.forEach(function(card) {
            var name = card.getAttribute('data-name').toLowerCase();
            if (!query || name.indexOf(query) !== -1) {
              card.classList.remove('hidden');
              visibleCount++;
            } else {
              card.classList.add('hidden');
            }
          });

          // Update count display
          searchCount.textContent = query ? visibleCount + ' of ' + allCards.length + ' icons' : '';

          // Show/hide no results
          noResults.classList.toggle('show', query && visibleCount === 0);

          // Show/hide sections based on visible children
          monoGrid.style.display = (query && monoGrid.querySelectorAll('.icon-card:not(.hidden)').length === 0) ? 'none' : '';
          multiGrid.style.display = (query && multiGrid.querySelectorAll('.icon-card:not(.hidden)').length === 0) ? 'none' : '';

          // Toggle section titles visibility
          sectionTitles.forEach(function(title) {
            var grid = title.nextElementSibling;
            if (grid && grid.classList.contains('icon-grid')) {
              title.style.display = (query && grid.querySelectorAll('.icon-card:not(.hidden)').length === 0) ? 'none' : '';
            }
          });
        });

        // Keyboard shortcut: focus search with /
        document.addEventListener('keydown', function(e) {
          if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
          }
          if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.blur();
          }
        });
      </script>
    </body>
  </html>
`;
};
