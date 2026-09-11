import { elements } from '../data/elements.js';
import { playElementSound } from './audio.js';

export function initPeriodicTable() {
  const table = document.getElementById("table");
  const info = document.getElementById("info");

  if (!table || !info) return;

  // Clear existing content if any
  table.innerHTML = '';

  elements.forEach(el => {
    const div = document.createElement("div");
    div.className = `el ${el.cat}`;
    div.style.gridRow = el.row;
    div.style.gridColumn = el.col;
    div.setAttribute("title", `${el.name} (${el.sym}) - Atomic #${el.n}`);
    div.innerHTML = `
      <span class="num">${el.n}</span>
      <span class="sym">${el.sym}</span>
    `;

    div.addEventListener("click", () => {
      // Highlight active element
      document.querySelectorAll(".el").forEach(e => e.classList.remove("selected"));
      div.classList.add("selected");

      playElementSound(el.n);
      showElementInfo(el);
    });

    table.appendChild(div);
  });
}

export function showElementInfo(el) {
  const info = document.getElementById("info");
  if (!info) return;

  info.innerHTML = `
    <span class="big-sym">${el.sym}</span>
    <h2>${el.name}</h2>
    <div class="row">Atomic Number: <b>${el.n}</b></div>
    <div class="row">Atomic Mass: <b>${el.mass} u</b></div>
    <div class="row">Category: <span class="cat-pill ${el.cat}">${el.cat.replace(/-/g, " ")}</span></div>
  `;
}
