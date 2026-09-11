export function initCalculator() {
  const calcDisplay = document.getElementById("calc-display");
  const calcGrid = document.getElementById("calc-grid");

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
    btn.addEventListener("click", () => handleCalc(label));
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
    try {
      // Safe math parser: only allow digits, arithmetic symbols, spaces, parentheses, decimal, and %
      if (!expression || expression === "Error") return;
      if (/^[0-9+\-*/().% ]+$/.test(expression)) {
        // Replace percentage with /100
        const sanitized = expression.replace(/%/g, "/100");
        // Use Function instead of raw eval for sandboxed arithmetic
        const result = Function(`'use strict'; return (${sanitized})`)();
        if (Number.isFinite(result)) {
          // Format long decimals cleanly
          expression = String(Math.round(result * 1000000) / 1000000);
        } else {
          expression = "Error";
        }
      } else {
        expression = "Error";
      }
    } catch {
      expression = "Error";
    }
    calcDisplay.value = expression;
  }
}
