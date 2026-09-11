import './style.css';
import { initPeriodicTable } from './modules/periodicTable.js';
import { initCalculator }    from './modules/calculator.js';
import { initConcentration, initMolarity } from './modules/concentration.js';
import { initQuiz }          from './modules/quiz.js';

// Navigation: swap active page when a nav button is clicked
function initNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const pages      = document.querySelectorAll(".page");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.page;

      navButtons.forEach(b => b.classList.remove("active"));
      pages.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const target = document.getElementById(targetId);
      if (target) target.classList.add("active");

      // Lazy-init quiz when its tab is first opened
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

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initPeriodicTable();
  initCalculator();
  initConcentration();
  initMolarity();
});
