(function () {
  'use strict';

  const API = 'http://localhost:8082';

  // -------------------------------------------------------------------------
  // Build modal HTML and inject into <body>
  // -------------------------------------------------------------------------
  function buildUI() {
    const overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.id = 'search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'AI search');

    overlay.innerHTML = `
      <div class="search-modal" id="search-modal">
        <div class="search-input-row">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            class="search-input"
            id="search-input"
            type="text"
            placeholder="Ask anything about Clairify…"
            autocomplete="off"
            spellcheck="false"
          />
          <span class="search-kbd" aria-hidden="true">Esc</span>
        </div>
        <div class="search-body" id="search-body">
          <p class="search-hint">Type a question and press <strong>Enter</strong></p>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Close when clicking the backdrop (outside the modal)
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
  }

  // -------------------------------------------------------------------------
  // Open / close
  // -------------------------------------------------------------------------
  function openModal() {
    var overlay = document.getElementById('search-overlay');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    var input = document.getElementById('search-input');
    input.focus();
    input.select();
  }

  function closeModal() {
    var overlay = document.getElementById('search-overlay');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // -------------------------------------------------------------------------
  // Render helpers
  // -------------------------------------------------------------------------
  function setBody(html) {
    document.getElementById('search-body').innerHTML = html;
  }

  function renderLoading() {
    setBody('<div class="search-loading"><div class="search-spinner"></div>Searching…</div>');
  }

  function renderError(msg) {
    setBody('<p class="search-error">' + escHtml(msg) + '</p>');
  }

  function renderResults(data) {
    var html = '';

    // Answer
    html += '<div class="search-answer">';
    html += '<div class="search-answer-label">AI Answer</div>';
    html += '<div class="search-answer-text">' + escHtml(data.answer) + '</div>';
    html += '</div>';

    // Sources
    if (data.sources && data.sources.length > 0) {
      html += '<div class="search-sources-label">Sources</div>';
      html += '<div class="search-sources-list">';
      data.sources.forEach(function (s) {
        html += '<a class="search-source-item" href="' + escHtml(s.url) + '">';
        html += '<span class="search-source-title">' + escHtml(s.title) + '</span>';
        html += '<span class="search-source-excerpt">' + escHtml(s.excerpt) + '</span>';
        html += '</a>';
      });
      html += '</div>';
    }

    setBody(html);
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // -------------------------------------------------------------------------
  // Search
  // -------------------------------------------------------------------------
  function doSearch(query) {
    query = query.trim();
    if (!query) return;

    renderLoading();

    fetch(API + '/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Server error ' + res.status);
        return res.json();
      })
      .then(function (data) {
        renderResults(data);
      })
      .catch(function (err) {
        renderError('Something went wrong. Please try again. (' + err.message + ')');
      });
  }

  // -------------------------------------------------------------------------
  // Event wiring
  // -------------------------------------------------------------------------
  function wireEvents() {
    // Search button in nav
    var btn = document.getElementById('search-btn');
    if (btn) btn.addEventListener('click', openModal);

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
      var overlay = document.getElementById('search-overlay');

      // Cmd/Ctrl+K → open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (overlay.classList.contains('is-open')) {
          closeModal();
        } else {
          openModal();
        }
        return;
      }

      if (!overlay.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        closeModal();
        return;
      }

      if (e.key === 'Enter') {
        var input = document.getElementById('search-input');
        doSearch(input.value);
      }
    });
  }

  // -------------------------------------------------------------------------
  // Init
  // -------------------------------------------------------------------------
  function init() {
    buildUI();
    wireEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
