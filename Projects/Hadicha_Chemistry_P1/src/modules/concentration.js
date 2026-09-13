import { elements } from '../data/elements.js';

// ---------------------------------------------------------------------------
// P1-1: m/v Concentration Calculator
// ---------------------------------------------------------------------------
export function initConcentration() {
  const calcBtn = document.getElementById("conc-btn");
  const massInput = document.getElementById("mass");
  const volumeInput = document.getElementById("volume");
  const resultDiv = document.getElementById("conc-result");

  if (!calcBtn || !massInput || !volumeInput || !resultDiv) return;

  function calculateConcentration() {
    const mass = parseFloat(massInput.value);
    const volume = parseFloat(volumeInput.value);

    if (isNaN(mass) || isNaN(volume)) {
      setError(resultDiv, "Please enter valid numeric values for mass and volume.");
      return;
    }
    if (mass < 0 || volume <= 0) {
      setError(resultDiv, "Volume must be greater than 0, and mass cannot be negative.");
      return;
    }

    const concentration = (mass / volume) * 100;
    resultDiv.className = "success";
    // P1-1 FIX: label changed to "(mass/volume)"
    resultDiv.innerHTML = `
      <div class="result-number">${concentration.toFixed(2)}%</div>
      <div class="result-desc">${mass}g in ${volume}mL &mdash; Concentration (mass/volume)</div>
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

// ---------------------------------------------------------------------------
// P1-2: Molarity Calculator
// ---------------------------------------------------------------------------
export function initMolarity() {
  const molarityBtn = document.getElementById("molarity-btn");
  const molMassInput = document.getElementById("mol-molar-mass");
  const molMassSelect = document.getElementById("mol-element-select");
  const molSoluteMass = document.getElementById("mol-solute-mass");
  const molVolume = document.getElementById("mol-volume-liters");
  const molResult = document.getElementById("molarity-result");

  if (!molarityBtn || !molResult) return;

  // Populate element dropdown for auto molar-mass lookup
  if (molMassSelect) {
    // Default blank option
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "— select element —";
    molMassSelect.appendChild(blank);

    elements.forEach(el => {
      const opt = document.createElement("option");
      opt.value = el.mass.replace(/[()]/g, ""); // strip parentheses from estimated values
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
    const soluteMass = parseFloat(molSoluteMass?.value);
    const molarMass = parseFloat(molMassInput?.value);
    const volumeL = parseFloat(molVolume?.value);

    if (isNaN(soluteMass) || isNaN(molarMass) || isNaN(volumeL)) {
      setError(molResult, "Please fill in all three fields with valid numbers.");
      return;
    }
    if (molarMass <= 0) {
      setError(molResult, "Molar mass must be greater than 0.");
      return;
    }
    if (volumeL <= 0) {
      setError(molResult, "Volume must be greater than 0.");
      return;
    }
    if (soluteMass < 0) {
      setError(molResult, "Solute mass cannot be negative.");
      return;
    }

    const moles = soluteMass / molarMass;
    const molarity = moles / volumeL;

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

// Shared helper
function setError(el, msg) {
  el.className = "error";
  el.textContent = msg;
}
