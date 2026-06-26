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
          padding-top: 56px;
        }

        /* Top Bar */
        .tpl-topbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 56px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 20px;
          z-index: 100;
          box-shadow: 0 2px 12px rgba(99,102,241,0.3);
        }
        .tpl-topbar-title {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.3px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .tpl-topbar-search {
          flex: 1;
          max-width: 400px;
          position: relative;
        }
        .tpl-topbar-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: #9ca3af;
          pointer-events: none;
        }
        .tpl-topbar-search-input {
          width: 100%;
          height: 36px;
          padding: 0 14px 0 38px;
          font-size: 13px;
          font-family: inherit;
          border: none;
          border-radius: 10px;
          background: rgba(255,255,255,0.95);
          outline: none;
          color: #1a1a2e;
          transition: box-shadow 0.2s ease, background 0.2s ease;
        }
        .tpl-topbar-search-input::placeholder { color: #9ca3af; }
        .tpl-topbar-search-input:focus {
          background: #fff;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
        }
        .tpl-topbar-count {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.75);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .tpl-topbar-link {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          margin-left: auto;
          transition: color 0.2s;
        }
        .tpl-topbar-link:hover { color: #fff; }

        /* Icons Container */
        .tpl-icons-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 20px 20px;
        }

        .tpl-section-title {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin: 32px 0 16px;
          padding-left: 4px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tpl-section-title:first-child { margin-top: 8px; }
        .tpl-section-title .tpl-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: 20px;
          min-width: 28px;
        }

        /* Icon Grid */
        .tpl-icon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 10px;
        }

        .tpl-icon-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px 6px 14px;
          background: #fff;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #f0f0f0;
          position: relative;
          user-select: none;
        }
        .tpl-icon-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(99,102,241,0.12);
          border-color: rgba(99,102,241,0.2);
        }
        .tpl-icon-card:active { transform: translateY(-1px); }
        .tpl-icon-card .tpl-icon-preview {
          font-size: 28px;
          line-height: 1;
          color: #374151;
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
        }
        .tpl-icon-card:hover .tpl-icon-preview { color: #6366f1; }
        .tpl-icon-card .tpl-icon-name {
          font-size: 10px;
          color: #9ca3af;
          margin-top: 8px;
          text-align: center;
          word-break: break-all;
          line-height: 1.3;
          max-width: 100%;
          overflow: hidden;
          font-weight: 500;
        }
        .tpl-icon-card:hover .tpl-icon-name { color: #6b7280; }

        /* Copy Toast */
        .tpl-copy-toast {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          background: #1a1a2e;
          color: #fff;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 13px;
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
        .tpl-copy-toast.tpl-show {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .tpl-copy-toast svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        /* Hidden class for search filter */
        .tpl-icon-card.tpl-hidden { display: none; }

        /* No Results */
        .tpl-no-results {
          text-align: center;
          padding: 60px 20px;
          color: #9ca3af;
          font-size: 15px;
          display: none;
        }
        .tpl-no-results.tpl-show { display: block; }
        .tpl-no-results svg {
          width: 56px;
          height: 56px;
          margin-bottom: 14px;
          opacity: 0.35;
        }

        ${cssContent}
      </style>
    </head>

    <body>
      <div class="tpl-topbar">
        <span class="tpl-topbar-title">${prefix}</span>
        <div class="tpl-topbar-search">
          <svg class="tpl-topbar-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            class="tpl-topbar-search-input"
            id="searchInput"
            placeholder="Search icons... ( / )"
            autocomplete="off"
          />
        </div>
        <span class="tpl-topbar-count" id="searchCount">${svgMonochrome.length + svgMultichrome.length} icons</span>
        <a class="tpl-topbar-link" href="https://github.com/hunghg255/csvgtocss" target="_blank">GitHub</a>
      </div>

      <div class="tpl-icons-container">
        <div class="tpl-section-title">
          Monochrome
          <span class="tpl-badge">${svgMonochrome.length}</span>
        </div>
        <div class="tpl-icon-grid" id="monoGrid">
          ${svgMonochrome
            .map((it: any) => {
              var fullName = prefix + '-' + it.name;
              return (
                '<div class="tpl-icon-card" data-name="' +
                fullName +
                '" onclick="copyIcon(this)">' +
                '<span class="tpl-icon-preview"><i class="' +
                fullName +
                '"></i></span>' +
                '<span class="tpl-icon-name">' +
                fullName +
                '</span>' +
                '</div>'
              );
            })
            .join('')}
        </div>

        <div class="tpl-section-title">
          Multicolor
          <span class="tpl-badge">${svgMultichrome.length}</span>
        </div>
        <div class="tpl-icon-grid" id="multiGrid">
          ${svgMultichrome
            .map((it: any) => {
              var fullName = prefix + '-' + it.name;
              return (
                '<div class="tpl-icon-card" data-name="' +
                fullName +
                '" onclick="copyIcon(this)">' +
                '<span class="tpl-icon-preview"><i class="' +
                fullName +
                '"></i></span>' +
                '<span class="tpl-icon-name">' +
                fullName +
                '</span>' +
                '</div>'
              );
            })
            .join('')}
        </div>

        <div class="tpl-no-results" id="noResults">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
            <path d="M8 11h6"></path>
          </svg>
          <div>No icons match your search</div>
        </div>
      </div>

      <!-- Copy Toast -->
      <div class="tpl-copy-toast" id="copyToast">
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
          toast.classList.add('tpl-show');
          clearTimeout(toastTimeout);
          toastTimeout = setTimeout(function() {
            toast.classList.remove('tpl-show');
          }, 1800);
        }

        // Search / Filter
        var searchInput = document.getElementById('searchInput');
        var allCards = document.querySelectorAll('.tpl-icon-card');
        var monoGrid = document.getElementById('monoGrid');
        var multiGrid = document.getElementById('multiGrid');
        var noResults = document.getElementById('noResults');
        var searchCount = document.getElementById('searchCount');
        var sectionTitles = document.querySelectorAll('.tpl-section-title');
        var totalCount = allCards.length;

        searchInput.addEventListener('input', function() {
          var query = this.value.toLowerCase().trim();
          var visibleCount = 0;

          allCards.forEach(function(card) {
            var name = (card.getAttribute('data-name') || '').toLowerCase();
            if (!query || name.indexOf(query) !== -1) {
              card.classList.remove('tpl-hidden');
              visibleCount++;
            } else {
              card.classList.add('tpl-hidden');
            }
          });

          // Update count
          searchCount.textContent = query ? visibleCount + ' / ' + totalCount : totalCount + ' icons';

          // Show/hide no results
          noResults.classList.toggle('tpl-show', query && visibleCount === 0);

          // Show/hide sections
          monoGrid.style.display = (query && monoGrid.querySelectorAll('.tpl-icon-card:not(.tpl-hidden)').length === 0) ? 'none' : '';
          multiGrid.style.display = (query && multiGrid.querySelectorAll('.tpl-icon-card:not(.tpl-hidden)').length === 0) ? 'none' : '';

          // Toggle section titles
          sectionTitles.forEach(function(title) {
            var grid = title.nextElementSibling;
            if (grid && grid.classList.contains('tpl-icon-grid')) {
              title.style.display = (query && grid.querySelectorAll('.tpl-icon-card:not(.tpl-hidden)').length === 0) ? 'none' : '';
            }
          });
        });

        // Keyboard shortcut
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
