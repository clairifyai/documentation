/**
 * Annotation System
 * Inline text highlighting with questions, feature requests, and kudos.
 * Requires the annotation API running at /api/
 */

(function () {
  'use strict';

  const API = 'https://8081-ib6kqjv59pxx5g5exb313-650447e7.us2.manus.computer';  // annotation API
  const STORAGE_KEY = 'ann_token';
  const TYPE_META = {
    question:        { label: 'Question',        emoji: '❓', color: '#3b82f6' },
    feature_request: { label: 'Feature Request', emoji: '💡', color: '#8b5cf6' },
    kudos:           { label: 'Kudos',           emoji: '👏', color: '#f59e0b' },
  };

  /* ── State ─────────────────────────────────────────────────── */
  let currentUser   = null;   // { username, email }
  let annotations   = [];     // all annotations for this page
  let activeFilter  = 'all';  // 'all' | 'question' | 'feature_request' | 'kudos'
  let pendingSelection = null; // { text, range }
  let pendingType   = null;

  /* ── Token helpers ─────────────────────────────────────────── */
  function getToken()        { return localStorage.getItem(STORAGE_KEY); }
  function setToken(t)       { localStorage.setItem(STORAGE_KEY, t); }
  function clearToken()      { localStorage.removeItem(STORAGE_KEY); }
  function authHeaders() {
    const t = getToken();
    return t ? { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' }
             : { 'Content-Type': 'application/json' };
  }

  /* ── API calls ─────────────────────────────────────────────── */
  async function apiPost(path, body) {
    const r = await fetch(API + path, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      throw new Error(err.detail || 'Request failed');
    }
    return r.json();
  }

  async function apiGet(path) {
    const r = await fetch(API + path, { headers: authHeaders() });
    if (!r.ok) throw new Error('Request failed');
    return r.json();
  }

  async function apiDelete(path) {
    const r = await fetch(API + path, { method: 'DELETE', headers: authHeaders() });
    if (!r.ok) throw new Error('Request failed');
  }

  async function apiPatch(path, body) {
    const r = await fetch(API + path, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error('Request failed');
    return r.json();
  }

  /* ── Page path ─────────────────────────────────────────────── */
  function getPagePath() {
    return window.location.pathname;
  }

  /* ── Build DOM ─────────────────────────────────────────────── */
  function buildUI() {
    const html = `
    <!-- Auth modal -->
    <div class="ann-modal-overlay" id="ann-modal-overlay">
      <div class="ann-modal" role="dialog" aria-modal="true" aria-label="Sign in">
        <div class="ann-modal-header">
          <span class="ann-modal-title" id="ann-modal-title">Sign in to annotate</span>
          <button class="ann-modal-close" id="ann-modal-close" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="ann-modal-tabs">
          <div class="ann-modal-tab active" data-tab="login">Sign in</div>
          <div class="ann-modal-tab" data-tab="register">Create account</div>
        </div>
        <div class="ann-modal-form" id="ann-auth-form">
          <div>
            <label for="ann-email">Email</label>
            <input type="email" id="ann-email" placeholder="you@example.com" autocomplete="email"/>
          </div>
          <div>
            <label for="ann-password">Password</label>
            <input type="password" id="ann-password" placeholder="••••••••" autocomplete="current-password"/>
          </div>
          <div class="ann-modal-error" id="ann-auth-error"></div>
          <button class="ann-modal-submit" id="ann-auth-submit">Sign in</button>
        </div>
      </div>
    </div>

    <!-- Selection popup -->
    <div class="ann-selection-popup" id="ann-selection-popup" role="tooltip">
      <button class="ann-sel-btn" data-type="question">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        Ask
      </button>
      <div class="ann-sel-divider"></div>
      <button class="ann-sel-btn" data-type="feature_request">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        Request
      </button>
      <div class="ann-sel-divider"></div>
      <button class="ann-sel-btn" data-type="kudos">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
        </svg>
        Kudos
      </button>
    </div>

    <!-- Inline comment form -->
    <div class="ann-form-popup" id="ann-form-popup" role="dialog" aria-label="Add annotation">
      <div class="ann-form-header">
        <span class="ann-form-type-label" id="ann-form-type-label"></span>
        <button class="ann-form-close" id="ann-form-close" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="ann-form-anchor-preview" id="ann-form-anchor-preview"></div>
      <textarea class="ann-form-textarea" id="ann-form-textarea" rows="3" placeholder="Write your comment…"></textarea>
      <div class="ann-form-footer">
        <button class="ann-form-cancel" id="ann-form-cancel">Cancel</button>
        <button class="ann-form-submit" id="ann-form-submit">Post</button>
      </div>
    </div>

    <!-- Side panel tab trigger -->
    <div class="ann-tab-trigger" id="ann-tab-trigger" role="button" aria-label="Open annotations panel">
      <div class="ann-tab-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="transform:rotate(180deg)">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        Comments
        <span class="ann-tab-count" id="ann-tab-count">0</span>
      </div>
    </div>

    <!-- Side panel -->
    <aside class="ann-panel" id="ann-panel" aria-label="Annotations panel">
      <div class="ann-panel-header">
        <div>
          <div class="ann-panel-title">Annotations</div>
          <div class="ann-panel-subtitle" id="ann-panel-subtitle">This page</div>
        </div>
        <button class="ann-panel-close" id="ann-panel-close" aria-label="Close panel">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- User bar (shown when logged in) -->
      <div class="ann-panel-user-bar" id="ann-panel-user-bar">
        <div class="ann-panel-user-info">
          <div class="ann-panel-avatar" id="ann-panel-avatar"></div>
          <span class="ann-panel-username" id="ann-panel-username"></span>
        </div>
        <button class="ann-panel-logout" id="ann-panel-logout">Sign out</button>
      </div>

      <!-- Filter tabs -->
      <div class="ann-panel-filters">
        <button class="ann-filter-btn active" data-filter="all">All</button>
        <button class="ann-filter-btn" data-filter="question">❓ Questions</button>
        <button class="ann-filter-btn" data-filter="feature_request">💡 Requests</button>
        <button class="ann-filter-btn" data-filter="kudos">👏 Kudos</button>
      </div>

      <!-- Auth prompt (shown when logged out) -->
      <div class="ann-panel-auth-prompt" id="ann-panel-auth-prompt">
        <div class="ann-panel-auth-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="ann-panel-auth-text">Sign in to ask questions, request features, or give kudos on any highlighted text.</div>
        <button class="ann-panel-auth-btn" id="ann-panel-signin-btn">Log in</button>
      </div>

      <!-- List -->
      <div class="ann-panel-list" id="ann-panel-list"></div>
    </aside>
    `;

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
  }

  /* ── Auth modal ─────────────────────────────────────────────── */
  let authMode = 'login'; // 'login' | 'register'

  function openAuthModal() {
    document.getElementById('ann-modal-overlay').classList.add('open');
    document.getElementById('ann-email').focus();
  }
  function closeAuthModal() {
    document.getElementById('ann-modal-overlay').classList.remove('open');
    document.getElementById('ann-auth-error').textContent = '';
    document.getElementById('ann-auth-error').classList.remove('visible');
  }

  function setAuthMode(mode) {
    authMode = mode;
    document.querySelectorAll('.ann-modal-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === mode);
    });
    document.getElementById('ann-auth-submit').textContent =
      mode === 'login' ? 'Sign in' : 'Create account';
    document.getElementById('ann-modal-title').textContent =
      mode === 'login' ? 'Sign in to annotate' : 'Create your account';
    document.getElementById('ann-password').autocomplete =
      mode === 'login' ? 'current-password' : 'new-password';
  }

  async function submitAuth() {
    const email    = document.getElementById('ann-email').value.trim();
    const password = document.getElementById('ann-password').value;
    const errEl    = document.getElementById('ann-auth-error');
    const submitBtn = document.getElementById('ann-auth-submit');

    if (!email || !password) {
      errEl.textContent = 'Please fill in all fields.';
      errEl.classList.add('visible');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Please wait…';
    errEl.classList.remove('visible');

    try {
      const path = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const data = await apiPost(path, { email, password });
      setToken(data.token);
      currentUser = { username: data.username, email: data.email };
      closeAuthModal();
      updateUserUI();
      loadAnnotations();
    } catch (e) {
      errEl.textContent = e.message;
      errEl.classList.add('visible');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = authMode === 'login' ? 'Sign in' : 'Create account';
    }
  }

  /* ── User UI ────────────────────────────────────────────────── */
  function updateUserUI() {
    const userBar    = document.getElementById('ann-panel-user-bar');
    const authPrompt = document.getElementById('ann-panel-auth-prompt');

    if (currentUser) {
      userBar.classList.add('visible');
      authPrompt.classList.remove('visible');
      document.getElementById('ann-panel-avatar').textContent =
        currentUser.username.charAt(0).toUpperCase();
      document.getElementById('ann-panel-username').textContent =
        '@' + currentUser.username;
    } else {
      userBar.classList.remove('visible');
      authPrompt.classList.add('visible');
    }
  }

  /* ── Panel ──────────────────────────────────────────────────── */
  function openPanel() {
    document.getElementById('ann-panel').classList.add('open');
    document.getElementById('ann-tab-trigger').style.display = 'none';
  }
  function closePanel() {
    document.getElementById('ann-panel').classList.remove('open');
    document.getElementById('ann-tab-trigger').style.display = '';
  }

  /* ── Load & render annotations ─────────────────────────────── */
  async function loadAnnotations() {
    try {
      const page = encodeURIComponent(getPagePath());
      annotations = await apiGet(`/api/annotations?page=${page}`);
    } catch (e) {
      annotations = [];
    }
    renderAnnotations();
    renderHighlights();
  }

  function filteredAnnotations() {
    if (activeFilter === 'all') return annotations;
    return annotations.filter(a => a.type === activeFilter);
  }

  function renderAnnotations() {
    const list = document.getElementById('ann-panel-list');
    const count = document.getElementById('ann-tab-count');
    count.textContent = annotations.length;

    const items = filteredAnnotations();
    if (items.length === 0) {
      list.innerHTML = `
        <div class="ann-empty">
          <span class="ann-empty-icon">💬</span>
          ${activeFilter === 'all'
            ? 'No annotations yet.<br>Highlight any text to get started.'
            : `No ${activeFilter.replace('_', ' ')}s yet.`}
        </div>`;
      return;
    }

    list.innerHTML = items.map(a => renderCard(a)).join('');

    // Bind card click → scroll to highlight
    list.querySelectorAll('.ann-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.ann-card-action-btn')) return;
        const id = parseInt(card.dataset.id);
        scrollToHighlight(id);
      });
    });

    // Bind action buttons
    list.querySelectorAll('.ann-card-action-btn.resolve').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.dataset.id);
        const ann = annotations.find(a => a.id === id);
        if (!ann) return;
        try {
          await apiPatch(`/api/annotations/${id}`, { resolved: !ann.resolved });
          await loadAnnotations();
        } catch (e) { console.error(e); }
      });
    });

    list.querySelectorAll('.ann-card-action-btn.delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.dataset.id);
        if (!confirm('Delete this annotation?')) return;
        try {
          await apiDelete(`/api/annotations/${id}`);
          await loadAnnotations();
        } catch (e) { console.error(e); }
      });
    });
  }

  function renderCard(a) {
    const meta   = TYPE_META[a.type] || TYPE_META.question;
    const isOwn  = currentUser && currentUser.username === a.author_name;
    const date   = new Date(a.created_at + 'Z').toLocaleDateString(undefined, {
      month: 'short', day: 'numeric'
    });
    const anchor = a.anchor_text.length > 60
      ? a.anchor_text.slice(0, 60) + '…'
      : a.anchor_text;

    const resolvedBadge = a.resolved
      ? `<span class="ann-resolved-badge">✓ Resolved</span>`
      : '';

    const ownActions = isOwn ? `
      ${a.type === 'question' ? `<button class="ann-card-action-btn resolve" data-id="${a.id}">${a.resolved ? 'Unresolve' : 'Resolve'}</button>` : ''}
      <button class="ann-card-action-btn delete" data-id="${a.id}">Delete</button>
    ` : '';

    return `
      <div class="ann-card" data-id="${a.id}">
        <div class="ann-card-header">
          <span class="ann-type-badge ann-type-${a.type}">${meta.emoji} ${meta.label}</span>
          <span class="ann-card-author">@${a.author_name}</span>
          <span class="ann-card-date">${date}</span>
        </div>
        <div class="ann-card-anchor">"${anchor}"</div>
        <div class="ann-card-body">${escapeHtml(a.body)}</div>
        ${(ownActions || resolvedBadge) ? `
        <div class="ann-card-actions">
          ${ownActions}
          ${resolvedBadge}
        </div>` : ''}
      </div>
    `;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Highlights in doc content ─────────────────────────────── */
  function renderHighlights() {
    // Remove existing highlights
    document.querySelectorAll('.ann-highlight').forEach(el => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });

    // Group annotations by anchor text
    const byAnchor = {};
    annotations.forEach(a => {
      if (!byAnchor[a.anchor_text]) byAnchor[a.anchor_text] = [];
      byAnchor[a.anchor_text].push(a);
    });

    // Find and highlight each anchor text in the article
    const article = document.querySelector('.docs-article, .md-content, main, article');
    if (!article) return;

    Object.entries(byAnchor).forEach(([text, anns]) => {
      // Use the first annotation's type for color
      const type = anns[0].type;
      highlightTextInElement(article, text, type, anns[0].id);
    });
  }

  function highlightTextInElement(root, searchText, type, id) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        // Skip script/style/code nodes
        const tag = node.parentElement?.tagName?.toLowerCase();
        if (['script', 'style', 'code', 'pre'].includes(tag)) return NodeFilter.FILTER_REJECT;
        return node.textContent.includes(searchText)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });

    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);

    nodes.forEach(textNode => {
      const idx = textNode.textContent.indexOf(searchText);
      if (idx === -1) return;

      const before = document.createTextNode(textNode.textContent.slice(0, idx));
      const mark   = document.createElement('mark');
      mark.className = `ann-highlight ann-highlight-${type}`;
      mark.dataset.annId = id;
      mark.textContent = searchText;
      mark.addEventListener('click', () => {
        openPanel();
        scrollToCard(id);
      });
      const after = document.createTextNode(textNode.textContent.slice(idx + searchText.length));

      const parent = textNode.parentNode;
      parent.insertBefore(before, textNode);
      parent.insertBefore(mark, textNode);
      parent.insertBefore(after, textNode);
      parent.removeChild(textNode);
    });
  }

  function scrollToHighlight(id) {
    const mark = document.querySelector(`.ann-highlight[data-ann-id="${id}"]`);
    if (!mark) return;
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64;
    const top  = mark.getBoundingClientRect().top + window.scrollY - navH - 32;
    window.scrollTo({ top, behavior: 'smooth' });
    // Flash
    mark.style.transition = 'background 300ms ease';
    mark.style.background = 'rgba(99,102,241,0.4)';
    setTimeout(() => { mark.style.background = ''; }, 1200);
    scrollToCard(id);
  }

  function scrollToCard(id) {
    const card = document.querySelector(`.ann-card[data-id="${id}"]`);
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    card.classList.add('highlighted');
    setTimeout(() => card.classList.remove('highlighted'), 2000);
  }

  /* ── Text selection ─────────────────────────────────────────── */
  function getSelectionText() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return null;
    const text = sel.toString().trim();
    if (!text || text.length < 3) return null;
    return { text, range: sel.getRangeAt(0).cloneRange() };
  }

  function positionPopup(popup, rect) {
    const margin = 8;
    let left = rect.left + rect.width / 2 - popup.offsetWidth / 2;
    let top  = rect.top + window.scrollY - popup.offsetHeight - 12;

    // Clamp horizontally
    left = Math.max(margin, Math.min(left, window.innerWidth - popup.offsetWidth - margin));
    // If above viewport, flip below
    if (top - window.scrollY < margin) {
      top = rect.bottom + window.scrollY + 12;
    }

    popup.style.left = left + 'px';
    popup.style.top  = top  + 'px';
  }

  function showSelectionPopup(selection) {
    pendingSelection = selection;
    const popup = document.getElementById('ann-selection-popup');
    popup.classList.add('visible');

    const range = selection.range;
    const rect  = range.getBoundingClientRect();
    // Ensure popup is in DOM before measuring
    requestAnimationFrame(() => positionPopup(popup, rect));
  }

  function hideSelectionPopup() {
    document.getElementById('ann-selection-popup').classList.remove('visible');
  }

  /* ── Comment form ───────────────────────────────────────────── */
  function showCommentForm(type) {
    if (!pendingSelection) return;
    pendingType = type;

    const meta   = TYPE_META[type];
    const form   = document.getElementById('ann-form-popup');
    const label  = document.getElementById('ann-form-type-label');
    const anchor = document.getElementById('ann-form-anchor-preview');
    const ta     = document.getElementById('ann-form-textarea');

    label.innerHTML = `<span style="font-size:1rem">${meta.emoji}</span> ${meta.label}`;
    anchor.textContent = '"' + (pendingSelection.text.length > 60
      ? pendingSelection.text.slice(0, 60) + '…'
      : pendingSelection.text) + '"';
    ta.value = '';
    ta.placeholder = type === 'question'        ? 'What would you like to know?'
                   : type === 'feature_request' ? "Describe the feature you'd like to see\u2026"
                   : 'What did you find helpful?';

    form.classList.add('visible');

    // Position near the selection
    const range = pendingSelection.range;
    const rect  = range.getBoundingClientRect();
    requestAnimationFrame(() => {
      let left = rect.left + rect.width / 2 - form.offsetWidth / 2;
      let top  = rect.bottom + window.scrollY + 12;
      left = Math.max(8, Math.min(left, window.innerWidth - form.offsetWidth - 8));
      form.style.left = left + 'px';
      form.style.top  = top  + 'px';
      ta.focus();
    });
  }

  function hideCommentForm() {
    document.getElementById('ann-form-popup').classList.remove('visible');
    pendingType = null;
  }

  async function submitAnnotation() {
    if (!pendingSelection || !pendingType) return;
    const body = document.getElementById('ann-form-textarea').value.trim();
    if (!body) {
      document.getElementById('ann-form-textarea').focus();
      return;
    }

    const submitBtn = document.getElementById('ann-form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting…';

    try {
      await apiPost('/api/annotations', {
        page_path:   getPagePath(),
        anchor_text: pendingSelection.text,
        type:        pendingType,
        body,
      });
      hideCommentForm();
      pendingSelection = null;
      window.getSelection()?.removeAllRanges();
      await loadAnnotations();
      openPanel();
    } catch (e) {
      alert('Failed to post: ' + e.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Post';
    }
  }

  /* ── Init ───────────────────────────────────────────────────── */
  async function init() {
    buildUI();

    // Try to restore session
    const token = getToken();
    if (token) {
      try {
        currentUser = await apiGet('/api/auth/me');
      } catch (e) {
        clearToken();
        currentUser = null;
      }
    }

    updateUserUI();
    await loadAnnotations();

    /* ── Event listeners ────────────────────────────────────── */

    // Auth modal
    document.getElementById('ann-modal-close').addEventListener('click', closeAuthModal);
    document.getElementById('ann-modal-overlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('ann-modal-overlay')) closeAuthModal();
    });
    document.querySelectorAll('.ann-modal-tab').forEach(tab => {
      tab.addEventListener('click', () => setAuthMode(tab.dataset.tab));
    });
    document.getElementById('ann-auth-submit').addEventListener('click', submitAuth);
    document.getElementById('ann-email').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('ann-password').focus();
    });
    document.getElementById('ann-password').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitAuth();
    });

    // Panel
    document.getElementById('ann-tab-trigger').addEventListener('click', openPanel);
    document.getElementById('ann-panel-close').addEventListener('click', closePanel);
    document.getElementById('ann-panel-signin-btn').addEventListener('click', openAuthModal);
    document.getElementById('ann-panel-logout').addEventListener('click', () => {
      clearToken();
      currentUser = null;
      updateUserUI();
    });

    // Filters
    document.querySelectorAll('.ann-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        document.querySelectorAll('.ann-filter-btn').forEach(b =>
          b.classList.toggle('active', b.dataset.filter === activeFilter)
        );
        renderAnnotations();
      });
    });

    // Selection popup buttons
    document.querySelectorAll('.ann-sel-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = btn.dataset.type;
        hideSelectionPopup();
        if (!currentUser) {
          openAuthModal();
          return;
        }
        showCommentForm(type);
      });
    });

    // Comment form
    document.getElementById('ann-form-close').addEventListener('click', () => {
      hideCommentForm();
      pendingSelection = null;
      window.getSelection()?.removeAllRanges();
    });
    document.getElementById('ann-form-cancel').addEventListener('click', () => {
      hideCommentForm();
      pendingSelection = null;
      window.getSelection()?.removeAllRanges();
    });
    document.getElementById('ann-form-submit').addEventListener('click', submitAnnotation);
    document.getElementById('ann-form-textarea').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submitAnnotation();
    });

    // Text selection — listen on the docs article
    document.addEventListener('mouseup', (e) => {
      // Ignore clicks inside our own UI
      if (e.target.closest('#ann-selection-popup, #ann-form-popup, .ann-panel, .ann-modal-overlay, .ann-tab-trigger')) {
        return;
      }

      setTimeout(() => {
        const sel = getSelectionText();
        if (sel) {
          showSelectionPopup(sel);
        } else {
          hideSelectionPopup();
          if (!e.target.closest('#ann-form-popup')) {
            hideCommentForm();
          }
        }
      }, 10);
    });

    // Hide popups on outside click
    document.addEventListener('mousedown', (e) => {
      if (!e.target.closest('#ann-selection-popup')) {
        hideSelectionPopup();
      }
      if (!e.target.closest('#ann-form-popup, #ann-selection-popup')) {
        // Don't clear pendingSelection here — user may have clicked the form
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideSelectionPopup();
        hideCommentForm();
        closeAuthModal();
        pendingSelection = null;
        window.getSelection()?.removeAllRanges();
      }
    });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
