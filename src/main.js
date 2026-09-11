import './style.css';
import { initPeriodicTable } from './modules/periodicTable.js';
import { initCalculator } from './modules/calculator.js';
import { initConcentration } from './modules/concentration.js';

// Setup page navigation
function initNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const pages = document.querySelectorAll(".page");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetPageId = btn.dataset.page;
      
      navButtons.forEach(b => b.classList.remove("active"));
      pages.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPage = document.getElementById(targetPageId);
      if (targetPage) {
        targetPage.classList.add("active");
      }
    });
  });
}

// Bootstrap application on DOM load
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initPeriodicTable();
  initCalculator();
  initConcentration();
});
