// Theme system: dark/light with localStorage persistence and
// OS-preference fallback (prefers-color-scheme).

const THEME_KEY = 'quantrix_theme';

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

/** Initialize theme on load and wire up the toggle button. */
export function initTheme() {
  applyTheme(getTheme());

  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function syncLabel() {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    btn.textContent = next === 'dark' ? '🌙 Dark' : '☀️ Light';
    btn.setAttribute('aria-label', `Switch to ${next} theme`);
    btn.setAttribute('title', `Switch to ${next} theme`);
    btn.setAttribute('aria-pressed', String(getTheme() === 'dark'));
  }

  syncLabel();
  btn.addEventListener('click', () => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('theme-transition');
      window.setTimeout(() => root.classList.remove('theme-transition'), 220);
    }
    toggleTheme();
    syncLabel();
  });
}
