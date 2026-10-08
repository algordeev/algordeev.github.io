/* Navigation, persistent theme, accessible project dialogs and course cards. */
(function () {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  let explicitTheme = false;
  try { explicitTheme = ['light', 'dark'].includes(localStorage.getItem('theme')); } catch (_) {}
  function setTheme(theme) {
    root.dataset.theme = theme;
    themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
  }
  setTheme(root.dataset.theme || (systemTheme.matches ? 'dark' : 'light'));
  themeButton.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    explicitTheme = true;
    setTheme(theme);
    try { localStorage.setItem('theme', theme); } catch (_) {}
  });
  systemTheme.addEventListener('change', event => {
    if (!explicitTheme) setTheme(event.matches ? 'dark' : 'light');
  });

  const menuButton = document.getElementById('menu-toggle');
  const menu = document.getElementById('section-menu');
  function closeMenu(restoreFocus) {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
  });
  menuButton.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      menu.hidden = false;
      menuButton.setAttribute('aria-expanded', 'true');
      menu.querySelector('a').focus();
    }
  });
  menu.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    closeMenu(false);
    const section = document.querySelector(link.getAttribute('href'));
    if (section) {
      section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.menu-wrap')) closeMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) closeMenu(true);
  });
  document.addEventListener('focusin', event => {
    if (!event.target.closest('.menu-wrap')) closeMenu(false);
  });

  document.querySelectorAll('[data-project]').forEach(button => {
    const dialog = document.getElementById('project-' + button.dataset.project);
    button.addEventListener('click', () => {
      closeMenu(false);
      dialog.showModal();
      document.body.classList.add('dialog-open');
      dialog.querySelector('.dialog-close').focus();
    });
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    // Only dismiss when both pointer-down and click happen on the backdrop.
    let backdropDown = false;
    function outside(event) {
      const rect = dialog.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    }
    dialog.addEventListener('pointerdown', event => { backdropDown = outside(event); });
    dialog.addEventListener('click', event => { if (backdropDown && outside(event)) dialog.close(); });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      button.focus();
    });
  });

  const viewLabels = { en: 'View certificate →', ru: 'Открыть сертификат →', tr: 'Sertifikayı görüntüle →' };
  function localText(value, lang) {
    return typeof value === 'string' ? value : (value && (value[lang] || value.en)) || '';
  }
  function safeLink(value) {
    if (!value) return null;
    try {
      const url = new URL(value, location.href);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
    } catch (_) { return null; }
  }
  function renderCredentials(lang) {
    const list = document.getElementById('credentials-list');
    const records = Array.isArray(window.PORTFOLIO_CREDENTIALS) ? window.PORTFOLIO_CREDENTIALS : [];
    list.replaceChildren();
    document.getElementById('credentials-empty').hidden = records.length > 0;
    list.hidden = records.length === 0;
    records.forEach(record => {
      const card = document.createElement('article');
      card.className = 'card credential-card';
      function text(tag, className, value) {
        const element = document.createElement(tag);
        element.className = className;
        element.textContent = value;
        card.append(element);
        return element;
      }
      text('p', 'eyebrow', localText(record.type, lang));
      text('h3', '', localText(record.title, lang));
      text('p', 'meta', localText(record.issuer, lang));
      if (record.date) text('p', 'date', localText(record.date, lang));
      if (record.description) text('p', '', localText(record.description, lang));
      const url = safeLink(record.url);
      if (url) {
        const row = text('p', 'links', '');
        const link = document.createElement('a');
        link.href = url;
        link.textContent = viewLabels[lang] || viewLabels.en;
        row.append(link);
      }
      list.append(card);
    });
  }
  document.addEventListener('portfolio:language', event => renderCredentials(event.detail));
  renderCredentials(root.lang || 'en');
})();
