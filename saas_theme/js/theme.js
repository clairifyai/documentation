/**
 * SAAS Theme — Interactive Behaviors
 * Dark mode, mobile nav, sidebar, TOC highlighting, dropdowns, copy code
 */

(function () {
  'use strict';

  /* ── 1. Dark Mode ─────────────────────────────────────────── */
  const THEME_KEY = 'saas-theme-color';

  function getStoredTheme() {
    return localStorage.getItem(THEME_KEY);
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    const stored = getStoredTheme();
    if (stored) {
      setTheme(stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Apply theme immediately to avoid flash
  initTheme();

  /* ── 2. DOM Ready ─────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {

    /* Theme toggle button */
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }

    /* ── 3. Sticky header shadow on scroll ──────────────────── */
    const header = document.getElementById('site-header');
    if (header) {
      const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ── 4. Mobile menu ─────────────────────────────────────── */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu    = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
      function openMobileMenu() {
        mobileMenuBtn.classList.add('open');
        mobileMenu.classList.add('open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }

      function closeMobileMenu() {
        mobileMenuBtn.classList.remove('open');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }

      mobileMenuBtn.addEventListener('click', function () {
        if (mobileMenu.classList.contains('open')) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });

      // Close on outside click
      document.addEventListener('click', function (e) {
        if (mobileMenu.classList.contains('open') &&
            !mobileMenu.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
          closeMobileMenu();
        }
      });

      // Close on Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
          closeMobileMenu();
        }
      });
    }

    /* ── 5. Dropdown menus ──────────────────────────────────── */
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');
    dropdownItems.forEach(function (item) {
      const trigger = item.querySelector('.nav-dropdown-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = item.classList.contains('open');
        // Close all
        dropdownItems.forEach(d => d.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', function () {
      dropdownItems.forEach(function (item) {
        item.classList.remove('open');
        const trigger = item.querySelector('.nav-dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    });

    /* ── 6. Docs sidebar (mobile) ───────────────────────────── */
    const sidebar        = document.getElementById('docs-sidebar');
    const sidebarClose   = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    // Create a sidebar toggle button for mobile docs pages
    if (sidebar) {
      // Inject a floating toggle button for mobile
      const sidebarToggle = document.createElement('button');
      sidebarToggle.className = 'sidebar-toggle-btn';
      sidebarToggle.setAttribute('aria-label', 'Open sidebar');
      sidebarToggle.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
        <span>Menu</span>
      `;
      document.querySelector('.docs-main') && document.querySelector('.docs-main').prepend(sidebarToggle);

      function openSidebar() {
        sidebar.classList.add('open');
        if (sidebarOverlay) {
          sidebarOverlay.classList.add('active');
          sidebarOverlay.style.display = 'block';
        }
        document.body.style.overflow = 'hidden';
      }

      function closeSidebar() {
        sidebar.classList.remove('open');
        if (sidebarOverlay) {
          sidebarOverlay.classList.remove('active');
          sidebarOverlay.style.display = '';
        }
        document.body.style.overflow = '';
      }

      sidebarToggle.addEventListener('click', openSidebar);
      if (sidebarClose)   sidebarClose.addEventListener('click', closeSidebar);
      if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
          closeSidebar();
        }
      });
    }

    /* ── 7. TOC active link on scroll ───────────────────────── */
    const tocLinks = document.querySelectorAll('.toc-link');
    if (tocLinks.length > 0) {
      const headings = Array.from(
        document.querySelectorAll('.docs-article h1, .docs-article h2, .docs-article h3, .docs-article h4')
      );

      function updateActiveTocLink() {
        const scrollY = window.scrollY;
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64;
        let activeId = null;

        for (let i = headings.length - 1; i >= 0; i--) {
          if (headings[i].getBoundingClientRect().top <= navHeight + 32) {
            activeId = headings[i].id;
            break;
          }
        }

        tocLinks.forEach(function (link) {
          const href = link.getAttribute('href');
          if (href && href === '#' + activeId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }

      window.addEventListener('scroll', updateActiveTocLink, { passive: true });
      updateActiveTocLink();
    }

    /* ── 8. Copy code buttons ───────────────────────────────── */
    // Add copy buttons to all highlight blocks
    document.querySelectorAll('.highlight, .md-content pre').forEach(function (block) {
      const pre = block.tagName === 'PRE' ? block : block.querySelector('pre');
      if (!pre) return;

      // Don't add duplicate buttons
      if (block.querySelector('.code-copy-btn')) return;

      const btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.setAttribute('aria-label', 'Copy code');
      btn.innerHTML = `
        <svg class="icon-copy" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        <svg class="icon-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:none">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      `;

      btn.style.cssText = `
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        padding: 0.375rem 0.625rem;
        background: rgba(255,255,255,0.08);
        color: rgba(255,255,255,0.5);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.75rem;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: all 150ms ease;
        z-index: 10;
      `;

      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(255,255,255,0.15)';
        btn.style.color = 'rgba(255,255,255,0.9)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(255,255,255,0.08)';
        btn.style.color = 'rgba(255,255,255,0.5)';
      });

      btn.addEventListener('click', function () {
        const code = pre.querySelector('code') || pre;
        navigator.clipboard.writeText(code.innerText).then(function () {
          btn.querySelector('.icon-copy').style.display = 'none';
          btn.querySelector('.icon-check').style.display = 'block';
          btn.style.color = '#34d399';
          setTimeout(function () {
            btn.querySelector('.icon-copy').style.display = 'block';
            btn.querySelector('.icon-check').style.display = 'none';
            btn.style.color = 'rgba(255,255,255,0.5)';
          }, 2000);
        });
      });

      if (block.tagName !== 'PRE') {
        block.style.position = 'relative';
        block.appendChild(btn);
      } else {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        wrapper.appendChild(btn);
      }
    });

    /* ── 9. Hero code window copy ───────────────────────────── */
    window.copyCode = function (btn) {
      const codeBlock = btn.closest('.code-window').querySelector('code');
      if (!codeBlock) return;
      navigator.clipboard.writeText(codeBlock.innerText).then(function () {
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        `;
        setTimeout(function () {
          btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          `;
        }, 2000);
      });
    };

    /* ── 10. Smooth scroll for anchor links ─────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const navHeight = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
          ) || 64;
          const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    /* ── 11. Animate elements on scroll (Intersection Observer) */
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll(
        '.feature-card, .testimonial-card, .stat-item, .hero-badge, .section-header'
      ).forEach(function (el) {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
      });
    }

    /* ── 12. External link handling ─────────────────────────── */
    document.querySelectorAll('a[href^="http"]').forEach(function (link) {
      if (!link.hostname || link.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

  }); // end DOMContentLoaded

  /* ── 13. Animate on scroll CSS injection ─────────────────── */
  const animStyle = document.createElement('style');
  animStyle.textContent = `
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .animate-on-scroll.in-view {
      opacity: 1;
      transform: translateY(0);
    }
    .feature-card:nth-child(2).animate-on-scroll { transition-delay: 0.05s; }
    .feature-card:nth-child(3).animate-on-scroll { transition-delay: 0.10s; }
    .feature-card:nth-child(4).animate-on-scroll { transition-delay: 0.15s; }
    .feature-card:nth-child(5).animate-on-scroll { transition-delay: 0.20s; }
    .feature-card:nth-child(6).animate-on-scroll { transition-delay: 0.25s; }
    .stat-item:nth-child(2) { transition-delay: 0.05s; }
    .stat-item:nth-child(3) { transition-delay: 0.10s; }
    .stat-item:nth-child(4) { transition-delay: 0.15s; }

    /* Sidebar toggle button for mobile docs */
    .sidebar-toggle-btn {
      display: none;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: var(--color-bg-tertiary);
      border: 1px solid var(--color-border);
      border-radius: 8px;
      color: var(--color-text-muted);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      margin-bottom: 24px;
      transition: all 150ms ease;
    }
    .sidebar-toggle-btn:hover {
      color: var(--color-text);
      border-color: var(--color-primary);
    }
    @media (max-width: 768px) {
      .sidebar-toggle-btn { display: flex; }
    }
  `;
  document.head.appendChild(animStyle);

})();
