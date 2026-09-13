// P2: Safe recursive-descent expression parser.
// Handles: numbers (decimals), +, -, *, /, (, ), %
// No eval / Function constructor used.

// ── Parser ────────────────────────────────────────────────────────────────────

function tokenize(src) {
  const tokens = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === ' ') { i++; continue; }
    if (ch >= '0' && ch <= '9' || ch === '.') {
      let num = '';
      while (i < src.length && (src[i] >= '0' && src[i] <= '9' || src[i] === '.')) {
        num += src[i++];
      }
      tokens.push({ type: 'NUM', val: parseFloat(num) });
    } else if ('+-*/()%'.includes(ch)) {
      tokens.push({ type: ch });
      i++;
    } else {
      return null; // unexpected character
    }
  }
  tokens.push({ type: 'EOF' });
  return tokens;
}

// Grammar (with correct precedence):
//   expr   = term ( ('+' | '-') term )*
//   term   = unary ( ('*' | '/' | '%') unary )*
//   unary  = '-' unary | primary
//   primary = NUM | '(' expr ')'

function parse(tokens) {
  let pos = 0;

  function peek()    { return tokens[pos]; }
  function consume() { return tokens[pos++]; }
  function expect(type) {
    if (peek().type !== type) throw new Error(`Expected ${type}`);
    return consume();
  }

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
        // % as "percent of": 50 % 200 → 50/100*200 = 100; standalone 50% → 0.5
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
    if (peek().type === '+') {
      consume();
      return unary();
    }
    return primary();
  }

  function primary() {
    const tok = peek();
    if (tok.type === 'NUM') {
      consume();
      // Handle trailing % on a bare number (50% → 0.5)
      if (peek().type === '%' && !['*', '/'].includes(tokens[pos + 1]?.type)) {
        consume();
        return tok.val / 100;
      }
      return tok.val;
    }
    if (tok.type === '(') {
      consume();
      const val = expr();
      expect(')');
      return val;
    }
    throw new Error(`Unexpected token: ${tok.type}`);
  }

  const result = expr();
  if (peek().type !== 'EOF') throw new Error('Unexpected trailing characters');
  return result;
}

function safeCalc(expression) {
  const tokens = tokenize(expression);
  if (!tokens) throw new Error('Invalid characters');
  return parse(tokens);
}

// ── Calculator UI ─────────────────────────────────────────────────────────────

export function initCalculator() {
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
    if (!expression || expression === "Error") return;
    try {
      const result = safeCalc(expression);
      if (!Number.isFinite(result)) throw new Error('Non-finite result');
      // Round away floating-point noise
      expression = String(Math.round(result * 1e9) / 1e9);
    } catch {
      expression = "Error";
    }
    calcDisplay.value = expression;
  }
}
