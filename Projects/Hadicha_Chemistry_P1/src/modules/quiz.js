import { elements } from '../data/elements.js';

// P3: Element quiz — random element question, 4 choices, session score tracking.

const MODES = ['name→symbol', 'symbol→name'];

let score = 0;
let total = 0;
let currentEl = null;
let correctAnswer = '';
let answered = false;

export function initQuiz() {
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
    nextQuestion(container);
  });

  document.getElementById("quiz-reset").addEventListener("click", () => {
    score = 0;
    total = 0;
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

  // Pick random mode and element
  const mode = MODES[Math.floor(Math.random() * MODES.length)];
  currentEl = elements[Math.floor(Math.random() * elements.length)];

  // Build 4 choices: 1 correct + 3 random distractors
  const pool = elements.filter(e => e.n !== currentEl.n);
  const distractors = shuffle(pool).slice(0, 3);
  const choices = shuffle([currentEl, ...distractors]);

  // Question & answer text depending on mode
  let questionText, getChoiceText;
  if (mode === 'name→symbol') {
    questionText   = `What is the symbol for <strong>${currentEl.name}</strong>?`;
    correctAnswer  = currentEl.sym;
    getChoiceText  = e => e.sym;
  } else {
    questionText   = `What element has the symbol <strong>${currentEl.sym}</strong>?`;
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
  total++;

  const isCorrect = chosen === correctAnswer;
  if (isCorrect) score++;

  // Mark all buttons correct/wrong visually
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
      ? `✅ Correct! ${currentEl.name} (${currentEl.sym}) — Atomic #${currentEl.n}`
      : `❌ Wrong. The correct answer is "${correctAnswer}" — ${currentEl.name} (${currentEl.sym})`;
    feedback.className = `quiz-feedback ${isCorrect ? 'quiz-feedback--correct' : 'quiz-feedback--wrong'}`;
  }

  updateScore();

  const nextBtn = document.getElementById("quiz-next");
  if (nextBtn) nextBtn.style.display = '';
}

function updateScore() {
  const scoreEl = document.getElementById("quiz-score");
  if (scoreEl) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    scoreEl.textContent = `Score: ${score} / ${total}${total > 0 ? ` (${pct}%)` : ''}`;
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
