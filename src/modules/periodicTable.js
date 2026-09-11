import { elements } from '../data/elements.js';
import { playElementSound, isMuted, toggleMute } from './audio.js';

// Category metadata matching the poster
export const categories = [
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

// Map category id → CSS class
function getCategoryClass(cat) {
  const match = categories.find(c => c.id === cat);
  return match ? match.class : '';
}

// Flat ordered list of element cells for keyboard navigation (populated on init)
let navGrid = []; // [{ el, cellNode }] in reading order
let focusedIndex = -1; // index into navGrid that currently holds keyboard focus

export function initPeriodicTable() {
  const tableMain  = document.getElementById("table-main");
  const tableFblock = document.getElementById("table-fblock");

  if (!tableMain || !tableFblock) return;

  tableMain.innerHTML  = '';
  tableFblock.innerHTML = '';
  navGrid = [];
  focusedIndex = -1;

  // ── Axis corner ────────────────────────────────────────────────────────────
  const axisCorner = document.createElement("div");
  axisCorner.className = "axis-cell axis-corner";
  axisCorner.style.gridRow    = "1";
  axisCorner.style.gridColumn = "1";
  axisCorner.innerHTML = `
    <span class="group-arrow">Group &rarr;</span>
    <span class="period-arrow">Period &darr;</span>
  `;
  tableMain.appendChild(axisCorner);

  // ── Group headers 1–18 ────────────────────────────────────────────────────
  for (let g = 1; g <= 18; g++) {
    const gCell = document.createElement("div");
    gCell.className      = "axis-cell group-header";
    gCell.style.gridRow    = "1";
    gCell.style.gridColumn = String(g + 1);
    gCell.textContent = g;
    tableMain.appendChild(gCell);
  }

  // ── Period headers 1–7 ────────────────────────────────────────────────────
  for (let p = 1; p <= 7; p++) {
    const pCell = document.createElement("div");
    pCell.className      = "axis-cell period-header";
    pCell.style.gridRow    = String(p + 1);
    pCell.style.gridColumn = "1";
    pCell.textContent = p;
    tableMain.appendChild(pCell);
  }

  // ── Center legend + key-card ───────────────────────────────────────────────
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

  // ── Main grid elements (skip lanthanides / actinides) ─────────────────────
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

  // ── Lanthanide placeholder ─────────────────────────────────────────────────
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

  // ── Actinide placeholder ───────────────────────────────────────────────────
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

  // ── f-block rows ───────────────────────────────────────────────────────────
  buildFBlock(tableFblock);

  // ── Interactions ──────────────────────────────────────────────────────────
  initLegendInteractions();
  initSearch();
  initMuteToggle();
  initKeyboardNavigation();
}

// ── Cell factory ────────────────────────────────────────────────────────────
function createElementCell(el) {
  const cell = document.createElement("div");
  cell.className   = `el ${getCategoryClass(el.cat)}`;
  cell.dataset.n   = el.n;
  cell.dataset.cat = el.cat;
  cell.tabIndex    = -1;  // reachable by keyboard navigation, not tab order

  cell.innerHTML = `
    <div class="el-num">${el.n}</div>
    <div class="el-sym">${el.sym}</div>
    <div class="el-name">${el.name}</div>
    <div class="el-mass">${el.mass}</div>
  `;

  cell.addEventListener("click", () => {
    const idx = navGrid.findIndex(entry => entry.cellNode === cell);
    selectElementByIndex(idx);
  });

  // Keyboard: Enter / Space triggers selection
  cell.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const idx = navGrid.findIndex(entry => entry.cellNode === cell);
      selectElementByIndex(idx);
    }
  });

  return cell;
}

// ── Select element by navGrid index ─────────────────────────────────────────
function selectElementByIndex(idx) {
  if (idx < 0 || idx >= navGrid.length) return;
  const { el, cellNode } = navGrid[idx];

  playElementSound(el.n);

  document.querySelectorAll(".el").forEach(e => e.classList.remove("selected"));
  cellNode.classList.add("selected");

  // Set keyboard focus ring
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

// ── Key tile updater ─────────────────────────────────────────────────────────
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

// ── f-block builder ──────────────────────────────────────────────────────────
function buildFBlock(container) {
  const groups = [
    { label: '* Lanthanides', range: '57 &ndash; 71', filter: e => e.n >= 57 && e.n <= 71 },
    { label: '** Actinides',  range: '89 &ndash; 103', filter: e => e.n >= 89 && e.n <= 103 }
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

// ── P1-3: Search ────────────────────────────────────────────────────────────
function initSearch() {
  const searchInput = document.getElementById("element-search");
  const clearBtn    = document.getElementById("search-clear");
  if (!searchInput) return;

  function applySearch(raw) {
    const q = raw.trim().toLowerCase();
    if (!q) {
      // Clear: restore full visibility
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

    // Scroll first match into view
    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }

  searchInput.addEventListener("input", () => applySearch(searchInput.value));

  if (clearBtn) {
    clearBtn.style.display = "none";
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      applySearch("");
      searchInput.focus();
    });
  }
}

// ── P2: Mute toggle ──────────────────────────────────────────────────────────
function initMuteToggle() {
  const muteBtn = document.getElementById("mute-toggle");
  if (!muteBtn) return;

  function syncLabel() {
    const muted = isMuted();
    muteBtn.textContent = muted ? "🔇 Sound Off" : "🔊 Sound On";
    muteBtn.classList.toggle("mute-btn--muted", muted);
  }

  syncLabel();
  muteBtn.addEventListener("click", () => {
    toggleMute();
    syncLabel();
  });
}

// ── P2: Keyboard navigation ──────────────────────────────────────────────────
// Arrow keys move focus following the (row, col) positions of elements
function initKeyboardNavigation() {
  const tableMain = document.getElementById("table-main");
  if (!tableMain) return;

  // Make the first element focusable as a starting point
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
        i > focusedIndex &&
        entry.el.row === current.row
      );
    } else if (e.key === "ArrowLeft") {
      const candidates = navGrid.filter((entry, i) =>
        i < focusedIndex &&
        entry.el.row === current.row
      );
      target = candidates[candidates.length - 1] || null;
    } else if (e.key === "ArrowDown") {
      // Find next element in the next period with the nearest column
      target = findNearest(current, 1);
    } else if (e.key === "ArrowUp") {
      target = findNearest(current, -1);
    }

    if (target) {
      const newIdx = navGrid.indexOf(target);
      // Move tabIndex
      navGrid[focusedIndex].cellNode.tabIndex = -1;
      focusedIndex = newIdx;
      target.cellNode.tabIndex = 0;
      target.cellNode.focus({ preventScroll: false });
      target.cellNode.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  });
}

// Find nearest element one period above or below current
function findNearest(current, rowDelta) {
  const targetRow = current.row + rowDelta;
  const candidates = navGrid.filter(entry => entry.el.row === targetRow);
  if (!candidates.length) return null;
  // Pick the one with closest column
  return candidates.reduce((best, entry) => {
    const bDiff = Math.abs(best.el.col - current.col);
    const eDiff = Math.abs(entry.el.col - current.col);
    return eDiff < bDiff ? entry : best;
  });
}

// ── Legend interactions ───────────────────────────────────────────────────────
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
