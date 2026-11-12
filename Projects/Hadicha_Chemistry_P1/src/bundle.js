(function () {
  'use strict';

  // ── DATA: 118 ELEMENTS ──────────────────────────────────────────────────
  const elements = [
    { n: 1, sym: "H", name: "Hydrogen", mass: "1.008", cat: "nonmetal", row: 1, col: 1 },
    { n: 2, sym: "He", name: "Helium", mass: "4.003", cat: "noble-gas", row: 1, col: 18 },
    { n: 3, sym: "Li", name: "Lithium", mass: "6.94", cat: "alkali-metal", row: 2, col: 1 },
    { n: 4, sym: "Be", name: "Beryllium", mass: "9.012", cat: "alkaline-earth", row: 2, col: 2 },
    { n: 5, sym: "B", name: "Boron", mass: "10.81", cat: "metalloid", row: 2, col: 13 },
    { n: 6, sym: "C", name: "Carbon", mass: "12.011", cat: "nonmetal", row: 2, col: 14 },
    { n: 7, sym: "N", name: "Nitrogen", mass: "14.007", cat: "nonmetal", row: 2, col: 15 },
    { n: 8, sym: "O", name: "Oxygen", mass: "15.999", cat: "nonmetal", row: 2, col: 16 },
    { n: 9, sym: "F", name: "Fluorine", mass: "18.998", cat: "halogen", row: 2, col: 17 },
    { n: 10, sym: "Ne", name: "Neon", mass: "20.180", cat: "noble-gas", row: 2, col: 18 },
    { n: 11, sym: "Na", name: "Sodium", mass: "22.990", cat: "alkali-metal", row: 3, col: 1 },
    { n: 12, sym: "Mg", name: "Magnesium", mass: "24.305", cat: "alkaline-earth", row: 3, col: 2 },
    { n: 13, sym: "Al", name: "Aluminium", mass: "26.982", cat: "post-transition", row: 3, col: 13 },
    { n: 14, sym: "Si", name: "Silicon", mass: "28.085", cat: "metalloid", row: 3, col: 14 },
    { n: 15, sym: "P", name: "Phosphorus", mass: "30.974", cat: "nonmetal", row: 3, col: 15 },
    { n: 16, sym: "S", name: "Sulfur", mass: "32.06", cat: "nonmetal", row: 3, col: 16 },
    { n: 17, sym: "Cl", name: "Chlorine", mass: "35.45", cat: "halogen", row: 3, col: 17 },
    { n: 18, sym: "Ar", name: "Argon", mass: "39.948", cat: "noble-gas", row: 3, col: 18 },
    { n: 19, sym: "K", name: "Potassium", mass: "39.098", cat: "alkali-metal", row: 4, col: 1 },
    { n: 20, sym: "Ca", name: "Calcium", mass: "40.078", cat: "alkaline-earth", row: 4, col: 2 },
    { n: 21, sym: "Sc", name: "Scandium", mass: "44.956", cat: "transition-metal", row: 4, col: 3 },
    { n: 22, sym: "Ti", name: "Titanium", mass: "47.867", cat: "transition-metal", row: 4, col: 4 },
    { n: 23, sym: "V", name: "Vanadium", mass: "50.942", cat: "transition-metal", row: 4, col: 5 },
    { n: 24, sym: "Cr", name: "Chromium", mass: "51.996", cat: "transition-metal", row: 4, col: 6 },
    { n: 25, sym: "Mn", name: "Manganese", mass: "54.938", cat: "transition-metal", row: 4, col: 7 },
    { n: 26, sym: "Fe", name: "Iron", mass: "55.845", cat: "transition-metal", row: 4, col: 8 },
    { n: 27, sym: "Co", name: "Cobalt", mass: "58.933", cat: "transition-metal", row: 4, col: 9 },
    { n: 28, sym: "Ni", name: "Nickel", mass: "58.693", cat: "transition-metal", row: 4, col: 10 },
    { n: 29, sym: "Cu", name: "Copper", mass: "63.546", cat: "transition-metal", row: 4, col: 11 },
    { n: 30, sym: "Zn", name: "Zinc", mass: "65.38", cat: "transition-metal", row: 4, col: 12 },
    { n: 31, sym: "Ga", name: "Gallium", mass: "69.723", cat: "post-transition", row: 4, col: 13 },
    { n: 32, sym: "Ge", name: "Germanium", mass: "72.630", cat: "metalloid", row: 4, col: 14 },
    { n: 33, sym: "As", name: "Arsenic", mass: "74.922", cat: "metalloid", row: 4, col: 15 },
    { n: 34, sym: "Se", name: "Selenium", mass: "78.971", cat: "nonmetal", row: 4, col: 16 },
    { n: 35, sym: "Br", name: "Bromine", mass: "79.904", cat: "halogen", row: 4, col: 17 },
    { n: 36, sym: "Kr", name: "Krypton", mass: "83.798", cat: "noble-gas", row: 4, col: 18 },
    { n: 37, sym: "Rb", name: "Rubidium", mass: "85.468", cat: "alkali-metal", row: 5, col: 1 },
    { n: 38, sym: "Sr", name: "Strontium", mass: "87.62", cat: "alkaline-earth", row: 5, col: 2 },
    { n: 39, sym: "Y", name: "Yttrium", mass: "88.906", cat: "transition-metal", row: 5, col: 3 },
    { n: 40, sym: "Zr", name: "Zirconium", mass: "91.224", cat: "transition-metal", row: 5, col: 4 },
    { n: 41, sym: "Nb", name: "Niobium", mass: "92.906", cat: "transition-metal", row: 5, col: 5 },
    { n: 42, sym: "Mo", name: "Molybdenum", mass: "95.95", cat: "transition-metal", row: 5, col: 6 },
    { n: 43, sym: "Tc", name: "Technetium", mass: "(98)", cat: "transition-metal", row: 5, col: 7 },
    { n: 44, sym: "Ru", name: "Ruthenium", mass: "101.07", cat: "transition-metal", row: 5, col: 8 },
    { n: 45, sym: "Rh", name: "Rhodium", mass: "102.91", cat: "transition-metal", row: 5, col: 9 },
    { n: 46, sym: "Pd", name: "Palladium", mass: "106.42", cat: "transition-metal", row: 5, col: 10 },
    { n: 47, sym: "Ag", name: "Silver", mass: "107.87", cat: "transition-metal", row: 5, col: 11 },
    { n: 48, sym: "Cd", name: "Cadmium", mass: "112.41", cat: "transition-metal", row: 5, col: 12 },
    { n: 49, sym: "In", name: "Indium", mass: "114.82", cat: "post-transition", row: 5, col: 13 },
    { n: 50, sym: "Sn", name: "Tin", mass: "118.71", cat: "post-transition", row: 5, col: 14 },
    { n: 51, sym: "Sb", name: "Antimony", mass: "121.76", cat: "metalloid", row: 5, col: 15 },
    { n: 52, sym: "Te", name: "Tellurium", mass: "127.60", cat: "metalloid", row: 5, col: 16 },
    { n: 53, sym: "I", name: "Iodine", mass: "126.90", cat: "halogen", row: 5, col: 17 },
    { n: 54, sym: "Xe", name: "Xenon", mass: "131.29", cat: "noble-gas", row: 5, col: 18 },
    { n: 55, sym: "Cs", name: "Caesium", mass: "132.91", cat: "alkali-metal", row: 6, col: 1 },
    { n: 56, sym: "Ba", name: "Barium", mass: "137.33", cat: "alkaline-earth", row: 6, col: 2 },
    { n: 57, sym: "La", name: "Lanthanum", mass: "138.91", cat: "lanthanide", row: 9, col: 4 },
    { n: 58, sym: "Ce", name: "Cerium", mass: "140.12", cat: "lanthanide", row: 9, col: 5 },
    { n: 59, sym: "Pr", name: "Praseodymium", mass: "140.91", cat: "lanthanide", row: 9, col: 6 },
    { n: 60, sym: "Nd", name: "Neodymium", mass: "144.24", cat: "lanthanide", row: 9, col: 7 },
    { n: 61, sym: "Pm", name: "Promethium", mass: "(145)", cat: "lanthanide", row: 9, col: 8 },
    { n: 62, sym: "Sm", name: "Samarium", mass: "150.36", cat: "lanthanide", row: 9, col: 9 },
    { n: 63, sym: "Eu", name: "Europium", mass: "151.96", cat: "lanthanide", row: 9, col: 10 },
    { n: 64, sym: "Gd", name: "Gadolinium", mass: "157.25", cat: "lanthanide", row: 9, col: 11 },
    { n: 65, sym: "Tb", name: "Terbium", mass: "158.93", cat: "lanthanide", row: 9, col: 12 },
    { n: 66, sym: "Dy", name: "Dysprosium", mass: "162.50", cat: "lanthanide", row: 9, col: 13 },
    { n: 67, sym: "Ho", name: "Holmium", mass: "164.93", cat: "lanthanide", row: 9, col: 14 },
    { n: 68, sym: "Er", name: "Erbium", mass: "167.26", cat: "lanthanide", row: 9, col: 15 },
    { n: 69, sym: "Tm", name: "Thulium", mass: "168.93", cat: "lanthanide", row: 9, col: 16 },
    { n: 70, sym: "Yb", name: "Ytterbium", mass: "173.05", cat: "lanthanide", row: 9, col: 17 },
    { n: 71, sym: "Lu", name: "Lutetium", mass: "174.97", cat: "lanthanide", row: 9, col: 18 },
    { n: 72, sym: "Hf", name: "Hafnium", mass: "178.49", cat: "transition-metal", row: 6, col: 4 },
    { n: 73, sym: "Ta", name: "Tantalum", mass: "180.95", cat: "transition-metal", row: 6, col: 5 },
    { n: 74, sym: "W", name: "Tungsten", mass: "183.84", cat: "transition-metal", row: 6, col: 6 },
    { n: 75, sym: "Re", name: "Rhenium", mass: "186.21", cat: "transition-metal", row: 6, col: 7 },
    { n: 76, sym: "Os", name: "Osmium", mass: "190.23", cat: "transition-metal", row: 6, col: 8 },
    { n: 77, sym: "Ir", name: "Iridium", mass: "192.22", cat: "transition-metal", row: 6, col: 9 },
    { n: 78, sym: "Pt", name: "Platinum", mass: "195.08", cat: "transition-metal", row: 6, col: 10 },
    { n: 79, sym: "Au", name: "Gold", mass: "196.97", cat: "transition-metal", row: 6, col: 11 },
    { n: 80, sym: "Hg", name: "Mercury", mass: "200.59", cat: "transition-metal", row: 6, col: 12 },
    { n: 81, sym: "Tl", name: "Thallium", mass: "204.38", cat: "post-transition", row: 6, col: 13 },
    { n: 82, sym: "Pb", name: "Lead", mass: "207.2", cat: "post-transition", row: 6, col: 14 },
    { n: 83, sym: "Bi", name: "Bismuth", mass: "208.98", cat: "post-transition", row: 6, col: 15 },
    { n: 84, sym: "Po", name: "Polonium", mass: "(209)", cat: "post-transition", row: 6, col: 16 },
    { n: 85, sym: "At", name: "Astatine", mass: "(210)", cat: "halogen", row: 6, col: 17 },
    { n: 86, sym: "Rn", name: "Radon", mass: "(222)", cat: "noble-gas", row: 6, col: 18 },
    { n: 87, sym: "Fr", name: "Francium", mass: "(223)", cat: "alkali-metal", row: 7, col: 1 },
    { n: 88, sym: "Ra", name: "Radium", mass: "(226)", cat: "alkaline-earth", row: 7, col: 2 },
    { n: 89, sym: "Ac", name: "Actinium", mass: "(227)", cat: "actinide", row: 10, col: 4 },
    { n: 90, sym: "Th", name: "Thorium", mass: "232.04", cat: "actinide", row: 10, col: 5 },
    { n: 91, sym: "Pa", name: "Protactinium", mass: "231.04", cat: "actinide", row: 10, col: 6 },
    { n: 92, sym: "U", name: "Uranium", mass: "238.03", cat: "actinide", row: 10, col: 7 },
    { n: 93, sym: "Np", name: "Neptunium", mass: "(237)", cat: "actinide", row: 10, col: 8 },
    { n: 94, sym: "Pu", name: "Plutonium", mass: "(244)", cat: "actinide", row: 10, col: 9 },
    { n: 95, sym: "Am", name: "Americium", mass: "(243)", cat: "actinide", row: 10, col: 10 },
    { n: 96, sym: "Cm", name: "Curium", mass: "(247)", cat: "actinide", row: 10, col: 11 },
    { n: 97, sym: "Bk", name: "Berkelium", mass: "(247)", cat: "actinide", row: 10, col: 12 },
    { n: 98, sym: "Cf", name: "Californium", mass: "(251)", cat: "actinide", row: 10, col: 13 },
    { n: 99, sym: "Es", name: "Einsteinium", mass: "(252)", cat: "actinide", row: 10, col: 14 },
    { n: 100, sym: "Fm", name: "Fermium", mass: "(257)", cat: "actinide", row: 10, col: 15 },
    { n: 101, sym: "Md", name: "Mendelevium", mass: "(258)", cat: "actinide", row: 10, col: 16 },
    { n: 102, sym: "No", name: "Nobelium", mass: "(259)", cat: "actinide", row: 10, col: 17 },
    { n: 103, sym: "Lr", name: "Lawrencium", mass: "(266)", cat: "actinide", row: 10, col: 18 },
    { n: 104, sym: "Rf", name: "Rutherfordium", mass: "(267)", cat: "transition-metal", row: 7, col: 4 },
    { n: 105, sym: "Db", name: "Dubnium", mass: "(268)", cat: "transition-metal", row: 7, col: 5 },
    { n: 106, sym: "Sg", name: "Seaborgium", mass: "(269)", cat: "transition-metal", row: 7, col: 6 },
    { n: 107, sym: "Bh", name: "Bohrium", mass: "(270)", cat: "transition-metal", row: 7, col: 7 },
    { n: 108, sym: "Hs", name: "Hassium", mass: "(277)", cat: "transition-metal", row: 7, col: 8 },
    { n: 109, sym: "Mt", name: "Meitnerium", mass: "(278)", cat: "transition-metal", row: 7, col: 9 },
    { n: 110, sym: "Ds", name: "Darmstadtium", mass: "(281)", cat: "transition-metal", row: 7, col: 10 },
    { n: 111, sym: "Rg", name: "Roentgenium", mass: "(282)", cat: "transition-metal", row: 7, col: 11 },
    { n: 112, sym: "Cn", name: "Copernicium", mass: "(285)", cat: "transition-metal", row: 7, col: 12 },
    { n: 113, sym: "Nh", name: "Nihonium", mass: "(286)", cat: "post-transition", row: 7, col: 13 },
    { n: 114, sym: "Fl", name: "Flerovium", mass: "(289)", cat: "post-transition", row: 7, col: 14 },
    { n: 115, sym: "Mc", name: "Moscovium", mass: "(290)", cat: "post-transition", row: 7, col: 15 },
    { n: 116, sym: "Lv", name: "Livermorium", mass: "(293)", cat: "post-transition", row: 7, col: 16 },
    { n: 117, sym: "Ts", name: "Tennessine", mass: "(294)", cat: "halogen", row: 7, col: 17 },
    { n: 118, sym: "Og", name: "Oganesson", mass: "(294)", cat: "noble-gas", row: 7, col: 18 }
  ];

  // ── AUDIO MODULE ────────────────────────────────────────────────────────
  const MUTE_KEY = 'quantrix_muted';
  let _audioCtx = null;

  function getCtx() {
    if (!_audioCtx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (Ctor) _audioCtx = new Ctor();
    }
    if (_audioCtx && _audioCtx.state === 'suspended') {
      _audioCtx.resume();
    }
    return _audioCtx;
  }

  function isMuted() {
    return localStorage.getItem(MUTE_KEY) === '1';
  }

  function toggleMute() {
    const next = !isMuted();
    localStorage.setItem(MUTE_KEY, next ? '1' : '0');
    return next;
  }

  function triggerHaptic(type = 'light') {
    if (!('vibrate' in navigator)) return;
    try {
      if (type === 'light') navigator.vibrate(8);
      else if (type === 'success') navigator.vibrate([10, 30, 10]);
      else if (type === 'error') navigator.vibrate([20, 40, 20]);
    } catch {}
  }

  function playTapSound() {
    triggerHaptic('light');
    if (isMuted()) return;
    try {
      const ctx = getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.03);
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.03);
    } catch {}
  }

  function playSuccessSound() {
    triggerHaptic('success');
    if (isMuted()) return;
    try {
      const ctx = getCtx();
      if (!ctx) return;
      const t = ctx.currentTime;
      [523.25, 659.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.06, t + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + i * 0.06);
        osc.stop(t + i * 0.06 + 0.2);
      });
    } catch {}
  }

  function playErrorSound() {
    triggerHaptic('error');
    if (isMuted()) return;
    try {
      const ctx = getCtx();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.15);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    } catch {}
  }

  function playElementSound(atomicNumber) {
    triggerHaptic('light');
    if (isMuted()) return;
    try {
      const ctx = getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 220 + atomicNumber * 4.2;
      const t = ctx.currentTime;
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    } catch (err) {
      console.warn('AudioContext error:', err);
    }
  }

  // ── THEME MODULE ────────────────────────────────────────────────────────
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

  function getTheme() {
    return getStoredTheme() || getSystemTheme();
  }

  function applyTheme(theme) {
    root.dataset.theme = theme === 'light' ? 'light' : 'dark';
  }

  function toggleTheme() {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    return next;
  }

  const SUN_SVG = `<svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  const MOON_SVG = `<svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

  function initTheme() {
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

  // ── PERIODIC TABLE MODULE ───────────────────────────────────────────────
  const categories = [
    { id: 'alkali-metal',     label: 'Alkali metals',           class: 'cat-alkali' },
    { id: 'alkaline-earth',   label: 'Alkaline earth metals',   class: 'cat-alkaline' },
    { id: 'transition-metal', label: 'Transition metals',       class: 'cat-transition' },
    { id: 'post-transition',  label: 'Post-transition metals',  class: 'cat-post-transition' },
    { id: 'metalloid',        label: 'Metalloids',              class: 'cat-metalloid' },
    { id: 'nonmetal',         label: 'Nonmetals',               class: 'cat-nonmetal' },
    { id: 'halogen',          label: 'Halogens',                class: 'cat-halogen' },
    { id: 'noble-gas',        label: 'Noble gases',             class: 'cat-noble' },
    { id: 'lanthanide',       label: 'Lanthanides',             class: 'cat-lanthanide' },
    { id: 'actinide',         label: 'Actinides',               class: 'cat-actinide' }
  ];

  function getCategoryClass(cat) {
    const match = categories.find(c => c.id === cat);
    return match ? match.class : '';
  }

  let navGrid = [];
  let focusedIndex = -1;

  function initPeriodicTable() {
    const tableMain   = document.getElementById("table-main");
    const tableFblock = document.getElementById("table-fblock");

    if (!tableMain || !tableFblock) return;

    tableMain.innerHTML   = '';
    tableFblock.innerHTML = '';
    navGrid = [];
    focusedIndex = -1;

    // Axis corner
    const axisCorner = document.createElement("div");
    axisCorner.className = "axis-cell axis-corner";
    axisCorner.style.gridRow    = "1";
    axisCorner.style.gridColumn = "1";
    axisCorner.innerHTML = `<span>Grp &rarr;</span><span>Per &darr;</span>`;
    tableMain.appendChild(axisCorner);

    // Group headers 1–18
    for (let g = 1; g <= 18; g++) {
      const gCell = document.createElement("div");
      gCell.className      = "axis-cell group-header";
      gCell.style.gridRow    = "1";
      gCell.style.gridColumn = String(g + 1);
      gCell.textContent = g;
      tableMain.appendChild(gCell);
    }

    // Period headers 1–7
    for (let p = 1; p <= 7; p++) {
      const pCell = document.createElement("div");
      pCell.className      = "axis-cell period-header";
      pCell.style.gridRow    = String(p + 1);
      pCell.style.gridColumn = "1";
      pCell.textContent = p;
      tableMain.appendChild(pCell);
    }

    // Center legend + key-card
    const centerContainer = document.createElement("div");
    centerContainer.className      = "poster-center-box";
    centerContainer.style.gridRow    = "2 / span 3";
    centerContainer.style.gridColumn = "4 / span 10";
    centerContainer.innerHTML = `
      <div class="center-legend">
        <div class="legend-col">
          ${categories.slice(0, 5).map(c => `
            <div class="legend-item" data-cat="${c.id}">
              <span class="legend-swatch ${c.class}"></span>
              <span class="legend-label">${c.label}</span>
            </div>
          `).join('')}
        </div>
        <div class="legend-col">
          ${categories.slice(5).map(c => `
            <div class="legend-item" data-cat="${c.id}">
              <span class="legend-swatch ${c.class}"></span>
              <span class="legend-label">${c.label}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="center-key-card" id="center-key-card">
        <div class="key-callouts">
          <div class="key-row"><span class="key-label">Atomic number</span> <span class="arrow">&rarr;</span></div>
          <div class="key-row"><span class="key-label">Symbol</span> <span class="arrow">&rarr;</span></div>
          <div class="key-row"><span class="key-label">Name</span> <span class="arrow">&rarr;</span></div>
          <div class="key-row"><span class="key-label">Atomic mass</span> <span class="arrow">&rarr;</span></div>
        </div>
        <div class="key-tile-wrapper">
          <div class="key-tile cat-nonmetal" id="key-tile">
            <div class="key-tile-num"  id="key-num">1</div>
            <div class="key-tile-sym"  id="key-sym">H</div>
            <div class="key-tile-name" id="key-name">Hydrogen</div>
            <div class="key-tile-mass" id="key-mass">1.008</div>
          </div>
        </div>
      </div>
    `;
    tableMain.appendChild(centerContainer);

    // Main grid elements
    const mainElements = elements.filter(
      el => !((el.n >= 57 && el.n <= 71) || (el.n >= 89 && el.n <= 103))
    );

    mainElements.forEach(el => {
      const cell = createElementCell(el);
      cell.style.gridRow    = String(el.row + 1);
      cell.style.gridColumn = String(el.col + 1);
      tableMain.appendChild(cell);
      navGrid.push({ el, cellNode: cell });
    });

    // Lanthanide placeholder
    const lPlaceholder = document.createElement("div");
    lPlaceholder.className      = "el cat-lanthanide el-placeholder";
    lPlaceholder.style.gridRow    = "7";
    lPlaceholder.style.gridColumn = "4";
    lPlaceholder.dataset.cat = "lanthanide";
    lPlaceholder.innerHTML = `
      <div class="el-num">57–71</div>
      <div class="el-name-bold">Lanthanides</div>
      <div class="el-star">*</div>
    `;
    lPlaceholder.addEventListener("click", () => highlightCategory('lanthanide'));
    tableMain.appendChild(lPlaceholder);

    // Actinide placeholder
    const aPlaceholder = document.createElement("div");
    aPlaceholder.className      = "el cat-actinide el-placeholder";
    aPlaceholder.style.gridRow    = "8";
    aPlaceholder.style.gridColumn = "4";
    aPlaceholder.dataset.cat = "actinide";
    aPlaceholder.innerHTML = `
      <div class="el-num">89–103</div>
      <div class="el-name-bold">Actinides</div>
      <div class="el-star">**</div>
    `;
    aPlaceholder.addEventListener("click", () => highlightCategory('actinide'));
    tableMain.appendChild(aPlaceholder);

    buildFBlock(tableFblock);
    initLegendInteractions();
    initSearch();
    initMuteToggle();
    initKeyboardNavigation();
  }

  function createElementCell(el) {
    const cell = document.createElement("div");
    cell.className   = `el ${getCategoryClass(el.cat)}`;
    cell.dataset.n   = el.n;
    cell.dataset.cat = el.cat;
    cell.tabIndex    = -1;

    cell.innerHTML = `
      <div class="el-num">${el.n}</div>
      <div class="el-sym">${el.sym}</div>
      <div class="el-name">${el.name}</div>
      <div class="el-mass">${el.mass}</div>
    `;

    cell.addEventListener("pointerdown", () => {
      const idx = navGrid.findIndex(entry => entry.cellNode === cell);
      selectElementByIndex(idx);
    });

    cell.addEventListener("click", () => {
      const idx = navGrid.findIndex(entry => entry.cellNode === cell);
      selectElementByIndex(idx);
    });

    cell.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const idx = navGrid.findIndex(entry => entry.cellNode === cell);
        selectElementByIndex(idx);
      }
    });

    return cell;
  }

  function selectElementByIndex(idx) {
    if (idx < 0 || idx >= navGrid.length) return;
    const { el, cellNode } = navGrid[idx];

    playElementSound(el.n);

    document.querySelectorAll(".el").forEach(e => e.classList.remove("selected"));
    cellNode.classList.add("selected");

    if (focusedIndex !== idx) {
      if (focusedIndex >= 0 && navGrid[focusedIndex]) {
        navGrid[focusedIndex].cellNode.tabIndex = -1;
      }
      focusedIndex = idx;
      cellNode.tabIndex = 0;
      cellNode.focus({ preventScroll: false });
    }

    updateKeyTile(el);
  }

  function updateKeyTile(el) {
    const keyTile = document.getElementById("key-tile");
    const keyNum  = document.getElementById("key-num");
    const keySym  = document.getElementById("key-sym");
    const keyName = document.getElementById("key-name");
    const keyMass = document.getElementById("key-mass");

    if (!keyTile) return;

    categories.forEach(c => keyTile.classList.remove(c.class));
    keyTile.classList.add(getCategoryClass(el.cat));

    keyNum.textContent  = el.n;
    keySym.textContent  = el.sym;
    keyName.textContent = el.name;
    keyMass.textContent = el.mass;

    keyTile.classList.remove("key-tile-animate");
    void keyTile.offsetWidth;
    keyTile.classList.add("key-tile-animate");
  }

  function buildFBlock(container) {
    const groups = [
      { label: '* Lanthanides', range: '57 – 71', filter: e => e.n >= 57 && e.n <= 71 },
      { label: '** Actinides',  range: '89 – 103', filter: e => e.n >= 89 && e.n <= 103 }
    ];

    groups.forEach(({ label, range, filter }) => {
      const row = document.createElement("div");
      row.className = "fblock-row";

      const labelEl = document.createElement("div");
      labelEl.className = "fblock-label";
      labelEl.innerHTML = `
        <div class="fblock-label-title">${label}</div>
        <div class="fblock-label-range">${range}</div>
      `;
      row.appendChild(labelEl);

      elements.filter(filter).forEach(el => {
        const cell = createElementCell(el);
        row.appendChild(cell);
        navGrid.push({ el, cellNode: cell });
      });

      container.appendChild(row);
    });
  }

  function initSearch() {
    const searchInput = document.getElementById("element-search");
    const clearBtn    = document.getElementById("search-clear");
    if (!searchInput) return;

    function applySearch(raw) {
      const q = raw.trim().toLowerCase();
      if (!q) {
        document.querySelectorAll(".el").forEach(cell => {
          cell.classList.remove("search-match", "search-dim");
        });
        if (clearBtn) clearBtn.style.display = "none";
        return;
      }

      if (clearBtn) clearBtn.style.display = "";

      let firstMatch = null;
      navGrid.forEach(({ el, cellNode }) => {
        const nameMatch = el.name.toLowerCase().includes(q);
        const symMatch  = el.sym.toLowerCase().startsWith(q) || el.sym.toLowerCase() === q;
        const numMatch  = String(el.n) === q;

        if (nameMatch || symMatch || numMatch) {
          cellNode.classList.add("search-match");
          cellNode.classList.remove("search-dim");
          if (!firstMatch) firstMatch = cellNode;
        } else {
          cellNode.classList.remove("search-match");
          cellNode.classList.add("search-dim");
        }
      });

      if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      }
    }

    searchInput.addEventListener("input", () => applySearch(searchInput.value));

    if (clearBtn) {
      clearBtn.style.display = "none";
      clearBtn.addEventListener("click", () => {
        playTapSound();
        searchInput.value = "";
        applySearch("");
        searchInput.focus();
      });
    }
  }

  const SPEAKER_ON_SVG = `<svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;
  const SPEAKER_OFF_SVG = `<svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;

  function initMuteToggle() {
    const muteBtn = document.getElementById("mute-toggle");
    if (!muteBtn) return;

    function syncLabel() {
      const muted = isMuted();
      muteBtn.innerHTML = `${muted ? SPEAKER_OFF_SVG : SPEAKER_ON_SVG}<span>${muted ? "Sound Off" : "Sound On"}</span>`;
      muteBtn.classList.toggle("mute-btn--muted", muted);
      muteBtn.setAttribute("aria-pressed", String(!muted));
    }

    syncLabel();
    muteBtn.addEventListener("click", () => {
      toggleMute();
      syncLabel();
    });
  }

  function initKeyboardNavigation() {
    const tableMain = document.getElementById("table-main");
    if (!tableMain) return;

    if (navGrid.length > 0) {
      navGrid[0].cellNode.tabIndex = 0;
    }

    tableMain.addEventListener("keydown", (e) => {
      if (!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) return;
      if (focusedIndex < 0) return;
      e.preventDefault();

      const current = navGrid[focusedIndex].el;
      let target = null;

      if (e.key === "ArrowRight") {
        target = navGrid.find((entry, i) =>
          i > focusedIndex && entry.el.row === current.row
        );
      } else if (e.key === "ArrowLeft") {
        const candidates = navGrid.filter((entry, i) =>
          i < focusedIndex && entry.el.row === current.row
        );
        target = candidates[candidates.length - 1] || null;
      } else if (e.key === "ArrowDown") {
        target = findNearest(current, 1);
      } else if (e.key === "ArrowUp") {
        target = findNearest(current, -1);
      }

      if (target) {
        const newIdx = navGrid.indexOf(target);
        navGrid[focusedIndex].cellNode.tabIndex = -1;
        focusedIndex = newIdx;
        target.cellNode.tabIndex = 0;
        target.cellNode.focus({ preventScroll: false });
        target.cellNode.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        selectElementByIndex(newIdx);
      }
    });
  }

  function findNearest(current, rowDelta) {
    const targetRow = current.row + rowDelta;
    const candidates = navGrid.filter(entry => entry.el.row === targetRow);
    if (!candidates.length) return null;
    return candidates.reduce((best, entry) => {
      const bDiff = Math.abs(best.el.col - current.col);
      const eDiff = Math.abs(entry.el.col - current.col);
      return eDiff < bDiff ? entry : best;
    });
  }

  function initLegendInteractions() {
    const legendItems = document.querySelectorAll(".legend-item");
    let activeFilter = null;

    legendItems.forEach(item => {
      const cat = item.dataset.cat;
      item.addEventListener("mouseenter", () => {
        if (!activeFilter) dimNonMatching(cat);
      });
      item.addEventListener("mouseleave", () => {
        if (!activeFilter) resetDimming();
      });
      item.addEventListener("click", () => {
        playTapSound();
        if (activeFilter === cat) {
          activeFilter = null;
          legendItems.forEach(i => i.classList.remove("active"));
          resetDimming();
        } else {
          activeFilter = cat;
          legendItems.forEach(i => i.classList.remove("active"));
          item.classList.add("active");
          dimNonMatching(cat);
        }
      });
    });
  }

  function highlightCategory(cat) {
    dimNonMatching(cat);
    const item = document.querySelector(`.legend-item[data-cat="${cat}"]`);
    if (item) {
      document.querySelectorAll(".legend-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    }
  }

  function dimNonMatching(cat) {
    document.querySelectorAll(".el").forEach(cell => {
      if (cell.dataset.cat === cat) {
        cell.classList.remove("dimmed", "search-dim");
        cell.classList.add("highlighted");
      } else {
        cell.classList.remove("highlighted");
        cell.classList.add("dimmed");
      }
    });
  }

  function resetDimming() {
    document.querySelectorAll(".el").forEach(cell => {
      cell.classList.remove("dimmed", "highlighted");
    });
  }

  // ── CALCULATOR MODULE ───────────────────────────────────────────────────
  function tokenize(src) {
    const tokens = [];
    let i = 0;
    while (i < src.length) {
      const ch = src[i];
      if (ch === ' ') { i++; continue; }
      if ((ch >= '0' && ch <= '9') || ch === '.') {
        let num = '';
        while (i < src.length && ((src[i] >= '0' && src[i] <= '9') || src[i] === '.')) {
          num += src[i++];
        }
        tokens.push({ type: 'NUM', val: parseFloat(num) });
      } else if ('+-*/()%'.includes(ch)) {
        tokens.push({ type: ch });
        i++;
      } else {
        return null;
      }
    }
    tokens.push({ type: 'EOF' });
    return tokens;
  }

  function parseCalc(tokens) {
    let pos = 0;
    function peek()    { return tokens[pos]; }
    function consume() { return tokens[pos++]; }

    function expr() {
      let left = term();
      while (peek().type === '+' || peek().type === '-') {
        const op = consume().type;
        const right = term();
        left = op === '+' ? left + right : left - right;
      }
      return left;
    }

    function term() {
      let left = unary();
      while (peek().type === '*' || peek().type === '/' || peek().type === '%') {
        const op = consume().type;
        const right = unary();
        if (op === '*') { left = left * right; }
        else if (op === '/') {
          if (right === 0) throw new Error('Division by zero');
          left = left / right;
        } else {
          left = (left / 100) * right;
        }
      }
      return left;
    }

    function unary() {
      if (peek().type === '-') {
        consume();
        return -unary();
      }
      return primary();
    }

    function primary() {
      const tok = peek();
      if (tok.type === 'NUM') {
        consume();
        return tok.val;
      }
      if (tok.type === '(') {
        consume();
        const val = expr();
        if (peek().type !== ')') throw new Error('Expected )');
        consume();
        return val;
      }
      throw new Error('Unexpected token');
    }

    const result = expr();
    if (peek().type !== 'EOF') throw new Error('Extra tokens');
    return result;
  }

  function safeCalc(str) {
    const tokens = tokenize(str);
    if (!tokens) throw new Error('Invalid expression');
    return parseCalc(tokens);
  }

  function initCalculator() {
    const calcDisplay = document.getElementById("calc-display");
    const calcGrid    = document.getElementById("calc-grid");
    if (!calcDisplay || !calcGrid) return;

    const calcButtons = [
      "C", "(", ")", "/",
      "7", "8", "9", "*",
      "4", "5", "6", "-",
      "1", "2", "3", "+",
      "0", ".", "=", "%"
    ];

    let expression = "";
    calcGrid.innerHTML = "";

    calcButtons.forEach(label => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.type = "button";
      if (["/", "*", "-", "+", "%"].includes(label)) btn.classList.add("op");
      if (label === "=") btn.classList.add("eq");
      if (label === "C") btn.classList.add("clear");
      btn.addEventListener("click", () => {
        playTapSound();
        handleCalc(label);
      });
      calcGrid.appendChild(btn);
    });

    function handleCalc(label) {
      if (label === "C") {
        expression = "";
      } else if (label === "=") {
        calculateResult();
        return;
      } else {
        if (expression === "Error") expression = "";
        expression += label;
      }
      calcDisplay.value = expression === "" ? "0" : expression;
    }

    function calculateResult() {
      if (!expression || expression === "Error") return;
      try {
        const result = safeCalc(expression);
        if (!Number.isFinite(result)) throw new Error('Non-finite');
        expression = String(Math.round(result * 1e9) / 1e9);
        playSuccessSound();
      } catch {
        expression = "Error";
        playErrorSound();
      }
      calcDisplay.value = expression;
    }
  }

  // ── CONCENTRATION & MOLARITY MODULE ─────────────────────────────────────
  function initConcentration() {
    const calcBtn = document.getElementById("conc-btn");
    const massInput = document.getElementById("mass");
    const volumeInput = document.getElementById("volume");
    const resultDiv = document.getElementById("conc-result");
    if (!calcBtn || !massInput || !volumeInput || !resultDiv) return;

    function calculateConcentration() {
      playTapSound();
      const mass = parseFloat(massInput.value);
      const volume = parseFloat(volumeInput.value);

      if (isNaN(mass) || isNaN(volume)) {
        setError(resultDiv, "Please enter valid numeric values for mass and volume.");
        playErrorSound();
        return;
      }
      if (mass < 0 || volume <= 0) {
        setError(resultDiv, "Volume must be greater than 0, and mass cannot be negative.");
        playErrorSound();
        return;
      }

      const concentration = (mass / volume) * 100;
      playSuccessSound();
      resultDiv.className = "success";
      resultDiv.innerHTML = `
        <div class="result-number">${concentration.toFixed(2)}%</div>
        <div class="result-desc">${mass}g in ${volume}mL &mdash; Concentration (m/v)</div>
      `;
    }

    calcBtn.addEventListener("click", (e) => {
      e.preventDefault();
      calculateConcentration();
    });

    [massInput, volumeInput].forEach(input => {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); calculateConcentration(); }
      });
    });
  }

  function initMolarity() {
    const molarityBtn = document.getElementById("molarity-btn");
    const molMassInput = document.getElementById("mol-molar-mass");
    const molMassSelect = document.getElementById("mol-element-select");
    const molSoluteMass = document.getElementById("mol-solute-mass");
    const molVolume = document.getElementById("mol-volume-liters");
    const molResult = document.getElementById("molarity-result");

    if (!molarityBtn || !molResult) return;

    if (molMassSelect) {
      const blank = document.createElement("option");
      blank.value = "";
      blank.textContent = "— select element —";
      molMassSelect.appendChild(blank);

      elements.forEach(el => {
        const opt = document.createElement("option");
        opt.value = el.mass.replace(/[()]/g, "");
        opt.textContent = `${el.name} (${el.sym}) — ${el.mass} g/mol`;
        molMassSelect.appendChild(opt);
      });

      molMassSelect.addEventListener("change", () => {
        if (molMassSelect.value && molMassInput) {
          molMassInput.value = molMassSelect.value;
        }
      });
    }

    function calculateMolarity() {
      playTapSound();
      const soluteMass = parseFloat(molSoluteMass?.value);
      const molarMass = parseFloat(molMassInput?.value);
      const volumeL = parseFloat(molVolume?.value);

      if (isNaN(soluteMass) || isNaN(molarMass) || isNaN(volumeL)) {
        setError(molResult, "Please fill in all three fields with valid numbers.");
        playErrorSound();
        return;
      }
      if (molarMass <= 0 || volumeL <= 0 || soluteMass < 0) {
        setError(molResult, "Volume and molar mass must be greater than 0.");
        playErrorSound();
        return;
      }

      const moles = soluteMass / molarMass;
      const molarity = moles / volumeL;

      playSuccessSound();
      molResult.className = "success";
      molResult.innerHTML = `
        <div class="result-number">${molarity.toFixed(4)} mol/L</div>
        <div class="result-desc">
          ${moles.toFixed(4)} mol of solute in ${volumeL} L &mdash; Molarity (M)
        </div>
      `;
    }

    molarityBtn.addEventListener("click", (e) => {
      e.preventDefault();
      calculateMolarity();
    });

    [molSoluteMass, molMassInput, molVolume].forEach(input => {
      if (!input) return;
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); calculateMolarity(); }
      });
    });
  }

  function setError(el, msg) {
    el.className = "error";
    el.textContent = msg;
  }

  // ── QUIZ MODULE ─────────────────────────────────────────────────────────
  const MODES = ['name→symbol', 'symbol→name'];
  let quizScore = 0;
  let quizTotal = 0;
  let currentEl = null;
  let correctAnswer = '';
  let answered = false;

  function initQuiz() {
    const container = document.getElementById("quiz-container");
    if (!container) return;

    container.innerHTML = `
      <div class="quiz-score" id="quiz-score">Score: 0 / 0</div>
      <div class="quiz-question" id="quiz-question"></div>
      <div class="quiz-choices" id="quiz-choices"></div>
      <div class="quiz-feedback" id="quiz-feedback" aria-live="polite"></div>
      <button class="quiz-next-btn" id="quiz-next" type="button" style="display:none;">Next Question &rarr;</button>
      <button class="quiz-reset-btn" id="quiz-reset" type="button">Reset Score</button>
    `;

    document.getElementById("quiz-next").addEventListener("click", () => {
      playTapSound();
      nextQuestion(container);
    });

    document.getElementById("quiz-reset").addEventListener("click", () => {
      playTapSound();
      quizScore = 0;
      quizTotal = 0;
      updateScore();
      nextQuestion(container);
    });

    nextQuestion(container);
  }

  function nextQuestion(container) {
    answered = false;
    const feedback = document.getElementById("quiz-feedback");
    const nextBtn  = document.getElementById("quiz-next");
    if (feedback) { feedback.textContent = ''; feedback.className = 'quiz-feedback'; }
    if (nextBtn)  nextBtn.style.display = 'none';

    const mode = MODES[Math.floor(Math.random() * MODES.length)];
    currentEl = elements[Math.floor(Math.random() * elements.length)];

    const pool = elements.filter(e => e.n !== currentEl.n);
    const distractors = shuffle(pool).slice(0, 3);
    const choices = shuffle([currentEl, ...distractors]);

    let questionText, getChoiceText;
    if (mode === 'name→symbol') {
      questionText   = `What is the chemical symbol for <strong>${currentEl.name}</strong>?`;
      correctAnswer  = currentEl.sym;
      getChoiceText  = e => e.sym;
    } else {
      questionText   = `Which element has the symbol <strong>${currentEl.sym}</strong>?`;
      correctAnswer  = currentEl.name;
      getChoiceText  = e => e.name;
    }

    const questionEl = document.getElementById("quiz-question");
    const choicesEl  = document.getElementById("quiz-choices");
    if (questionEl) questionEl.innerHTML = questionText;
    if (!choicesEl) return;

    choicesEl.innerHTML = '';
    choices.forEach(el => {
      const btn = document.createElement("button");
      btn.className   = "quiz-choice-btn";
      btn.textContent = getChoiceText(el);
      btn.type        = "button";
      btn.addEventListener("click", () => handleAnswer(btn, getChoiceText(el), container));
      choicesEl.appendChild(btn);
    });
  }

  function handleAnswer(btn, chosen, container) {
    if (answered) return;
    answered = true;
    quizTotal++;

    const isCorrect = chosen === correctAnswer;
    if (isCorrect) {
      quizScore++;
      playSuccessSound();
    } else {
      playErrorSound();
    }

    const allBtns = container.querySelectorAll(".quiz-choice-btn");
    allBtns.forEach(b => {
      b.disabled = true;
      if (b.textContent === correctAnswer) {
        b.classList.add("quiz-correct");
      } else if (b === btn && !isCorrect) {
        b.classList.add("quiz-wrong");
      }
    });

    const feedback = document.getElementById("quiz-feedback");
    if (feedback) {
      feedback.textContent = isCorrect
        ? `Correct. ${currentEl.name} (${currentEl.sym}) — Atomic #${currentEl.n}`
        : `Incorrect. The correct answer is "${correctAnswer}" — ${currentEl.name} (${currentEl.sym})`;
      feedback.className = `quiz-feedback ${isCorrect ? 'quiz-feedback--correct' : 'quiz-feedback--wrong'}`;
    }

    updateScore();
    const nextBtn = document.getElementById("quiz-next");
    if (nextBtn) nextBtn.style.display = '';
  }

  function updateScore() {
    const scoreEl = document.getElementById("quiz-score");
    if (scoreEl) {
      const pct = quizTotal > 0 ? Math.round((quizScore / quizTotal) * 100) : 0;
      scoreEl.textContent = `Score: ${quizScore} / ${quizTotal}${quizTotal > 0 ? ` (${pct}%)` : ''}`;
    }
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ── NAVIGATION & BOOTSTRAP ──────────────────────────────────────────────
  function initNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const pages      = document.querySelectorAll(".page");

    navButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        playTapSound();
        const targetId = btn.dataset.page;

        navButtons.forEach(b => b.classList.remove("active"));
        pages.forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        const target = document.getElementById(targetId);
        if (target) target.classList.add("active");

        if (targetId === 'quiz-page') {
          const container = document.getElementById("quiz-container");
          if (container && !container.dataset.initialized) {
            container.dataset.initialized = '1';
            initQuiz();
          }
        }
      });
    });
  }

  function boot() {
    initTheme();
    initNavigation();
    initPeriodicTable();
    initCalculator();
    initConcentration();
    initMolarity();
  }

  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

