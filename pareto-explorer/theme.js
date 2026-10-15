/* Share the portfolio's theme preference, including changes in other tabs. */
(() => {
  'use strict';
  const root = document.documentElement;
  const button = document.getElementById('theme-toggle');
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  let explicitTheme = false;
  try { explicitTheme = ['light', 'dark'].includes(localStorage.getItem('theme')); } catch (_) {}
  function apply(theme) {
    root.dataset.theme = theme;
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    document.dispatchEvent(new CustomEvent('portfolio:theme', { detail: theme }));
  }
  apply(root.dataset.theme || (systemTheme.matches ? 'dark' : 'light'));
  button.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    explicitTheme = true;
    apply(theme);
    try { localStorage.setItem('theme', theme); } catch (_) {}
  });
  systemTheme.addEventListener('change', event => {
    if (!explicitTheme) apply(event.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', event => {
    if (event.key !== 'theme' && event.key !== null) return;
    explicitTheme = ['light', 'dark'].includes(event.newValue);
    apply(explicitTheme ? event.newValue : (systemTheme.matches ? 'dark' : 'light'));
  });
})();
