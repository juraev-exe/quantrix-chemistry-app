export function initConcentration() {
  const form = document.getElementById("conc-form");
  const calcBtn = document.getElementById("conc-btn");
  const massInput = document.getElementById("mass");
  const volumeInput = document.getElementById("volume");
  const resultDiv = document.getElementById("conc-result");

  if (!calcBtn || !massInput || !volumeInput || !resultDiv) return;

  function calculateConcentration() {
    const mass = parseFloat(massInput.value);
    const volume = parseFloat(volumeInput.value);

    if (isNaN(mass) || isNaN(volume)) {
      resultDiv.className = "error";
      resultDiv.textContent = "Please enter valid numeric values for mass and volume.";
      return;
    }

    if (mass < 0 || volume <= 0) {
      resultDiv.className = "error";
      resultDiv.textContent = "Volume must be greater than 0, and mass cannot be negative.";
      return;
    }

    const concentration = (mass / volume) * 100;
    resultDiv.className = "success";
    resultDiv.innerHTML = `
      <div class="result-number">${concentration.toFixed(2)}%</div>
      <div class="result-desc">(${mass}g in ${volume}mL solution &mdash; m/v basis)</div>
    `;
  }

  calcBtn.addEventListener("click", (e) => {
    e.preventDefault();
    calculateConcentration();
  });

  // Also support enter key in input fields
  [massInput, volumeInput].forEach(input => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        calculateConcentration();
      }
    });
  });
}
