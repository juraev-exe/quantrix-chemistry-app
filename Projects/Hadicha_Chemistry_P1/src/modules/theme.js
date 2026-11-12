// Theme system: dark/light with localStorage persistence and
// OS-preference fallback (prefers-color-scheme).

const THEME_KEY = 'quantrix-theme';
const root = document.documentElement;
const modeQuery = window.matchMedia('(prefers-color-scheme: light)');

function getSystemTheme() {
  return modeQuery.matches ? 'light' : 'dark';
}

function getStoredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === 'dark' || stored === 'light' ? stored : null;
}

/** Resolve current theme: stored override, else OS preference. */
export function getTheme() {
  return getStoredTheme() || getSystemTheme();
}

/** Set the data-theme attribute on the root <html> element. */
export function applyTheme(theme) {
  root.dataset.theme = theme === 'light' ? 'light' : 'dark';
}

/** Toggle theme, persist the choice, and apply it. Returns the new theme. */
export function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
  return next;
}

const SUN_SVG = `<svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
const MOON_SVG = `<svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

/** Initialize theme on load and wire up the toggle button. */
export function initTheme() {
  applyTheme(getTheme());

  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function syncLabel() {
    const isDark = getTheme() === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    btn.innerHTML = `${isDark ? SUN_SVG : MOON_SVG}<span>${isDark ? 'Light' : 'Dark'}</span>`;
    btn.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
    btn.setAttribute('title', `Switch to ${nextTheme} theme`);
    btn.setAttribute('aria-pressed', String(isDark));
  }

  syncLabel();
  btn.addEventListener('click', () => {
    toggleTheme();
    syncLabel();
  });
}
