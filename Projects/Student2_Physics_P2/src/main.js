// Interactive Harmonic Pendulum & Kinematics Simulator

const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
  width = canvas.width = canvas.parentElement.clientWidth;
  height = canvas.height = 440;
}
window.addEventListener('resize', resize);
resize();

// Physical Parameters
let length = 220; // pixels
let gravity = 9.81; // m/s^2
let mass = 1.0; // kg
let damping = 0.001; // air resistance

let angle = Math.PI / 4; // current angle in radians
let angleVelocity = 0.0;
let angleAcceleration = 0.0;
let isRunning = true;
let isDragging = false;

// DOM Elements
const planetSelect = document.getElementById('planet-select');
const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');
const gravitySlider = document.getElementById('gravity-slider');
const gravityVal = document.getElementById('gravity-val');
const dampingSlider = document.getElementById('damping-slider');
const dampingVal = document.getElementById('damping-val');
const playPauseBtn = document.getElementById('play-pause-btn');
const resetBtn = document.getElementById('reset-btn');

const readoutPeriod = document.getElementById('readout-period');
const readoutVelocity = document.getElementById('readout-velocity');
const barKinetic = document.getElementById('bar-kinetic');
const barPotential = document.getElementById('bar-potential');
const barTotal = document.getElementById('bar-total');
const valKinetic = document.getElementById('val-kinetic');
const valPotential = document.getElementById('val-potential');
const valTotal = document.getElementById('val-total');

// Planet Gravities (m/s^2)
const planetGravities = {
  earth: 9.81,
  moon: 1.62,
  mars: 3.72,
  jupiter: 24.79,
  zero: 0.0
};

planetSelect.addEventListener('change', (e) => {
  const g = planetGravities[e.target.value];
  gravity = g;
  gravitySlider.value = g;
  gravityVal.textContent = `${g.toFixed(2)} m/s²`;
});

gravitySlider.addEventListener('input', (e) => {
  gravity = parseFloat(e.target.value);
  gravityVal.textContent = `${gravity.toFixed(2)} m/s²`;
  planetSelect.value = 'custom';
});

lengthSlider.addEventListener('input', (e) => {
  length = parseFloat(e.target.value);
  lengthVal.textContent = `${(length / 100).toFixed(2)} m`;
});

dampingSlider.addEventListener('input', (e) => {
  damping = parseFloat(e.target.value);
  dampingVal.textContent = damping === 0 ? 'None (Vacuum)' : damping.toFixed(4);
});

playPauseBtn.addEventListener('click', () => {
  isRunning = !isRunning;
  playPauseBtn.textContent = isRunning ? '⏸ Pause' : '▶ Play';
});

resetBtn.addEventListener('click', () => {
  angle = Math.PI / 4;
  angleVelocity = 0;
  angleAcceleration = 0;
});

// Dragging support
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const originX = width / 2;
  const originY = 60;
  const bobX = originX + length * Math.sin(angle);
  const bobY = originY + length * Math.cos(angle);

  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const dist = Math.hypot(mouseX - bobX, mouseY - bobY);

  if (dist < 30) {
    isDragging = true;
    angleVelocity = 0;
  }
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const rect = canvas.getBoundingClientRect();
  const originX = width / 2;
  const originY = 60;
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  angle = Math.atan2(mouseX - originX, mouseY - originY);
  angleVelocity = 0;
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

// Animation Loop
let lastTime = performance.now();

function animate(currentTime) {
  requestAnimationFrame(animate);
  const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
  lastTime = currentTime;

  const originX = width / 2;
  const originY = 60;

  if (isRunning && !isDragging) {
    // Angular acceleration: alpha = -(g / L) * sin(theta) - damping * omega
    const L_meters = length / 100;
    angleAcceleration = (-(gravity / L_meters) * Math.sin(angle)) - (damping * 10 * angleVelocity);
    angleVelocity += angleAcceleration * dt;
    angle += angleVelocity * dt;
  }

  const bobX = originX + length * Math.sin(angle);
  const bobY = originY + length * Math.cos(angle);

  // Clear Canvas
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, width, height);

  // Draw Grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw Pivot Mount
  ctx.fillStyle = '#334155';
  ctx.fillRect(originX - 30, originY - 14, 60, 14);
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.arc(originX, originY, 6, 0, Math.PI * 2);
  ctx.fill();

  // Draw Equilibrium guide
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX, originY + length + 20);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Arc
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
  ctx.beginPath();
  ctx.arc(originX, originY, length, 0.25 * Math.PI, 0.75 * Math.PI);
  ctx.stroke();

  // Draw Rod
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(bobX, bobY);
  ctx.stroke();

  // Draw Bob Shadow / Glow
  const gradient = ctx.createRadialGradient(bobX, bobY, 4, bobX, bobY, 28);
  gradient.addColorStop(0, '#818cf8');
  gradient.addColorStop(0.6, '#4f46e5');
  gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(bobX, bobY, 28, 0, Math.PI * 2);
  ctx.fill();

  // Draw Bob Core
  ctx.fillStyle = isDragging ? '#fbbf24' : '#6366f1';
  ctx.beginPath();
  ctx.arc(bobX, bobY, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Energy Computations
  const L_meters = length / 100;
  const heightDrop = L_meters * (1 - Math.cos(angle)); // in meters
  const linearVelocity = Math.abs(angleVelocity * L_meters); // m/s
  const potentialEnergy = mass * gravity * heightDrop; // Joules
  const kineticEnergy = 0.5 * mass * (linearVelocity ** 2); // Joules
  const totalEnergy = kineticEnergy + potentialEnergy;
  const maxPossibleEnergy = Math.max(totalEnergy, mass * gravity * (L_meters * 2), 0.01);

  // Update DOM readouts
  const period = gravity > 0 ? (2 * Math.PI * Math.sqrt(L_meters / gravity)).toFixed(2) : '∞';
  readoutPeriod.textContent = `${period} s`;
  readoutVelocity.textContent = `${linearVelocity.toFixed(2)} m/s`;

  valKinetic.textContent = `${kineticEnergy.toFixed(2)} J`;
  valPotential.textContent = `${potentialEnergy.toFixed(2)} J`;
  valTotal.textContent = `${totalEnergy.toFixed(2)} J`;

  barKinetic.style.width = `${Math.min((kineticEnergy / maxPossibleEnergy) * 100, 100)}%`;
  barPotential.style.width = `${Math.min((potentialEnergy / maxPossibleEnergy) * 100, 100)}%`;
  barTotal.style.width = `${Math.min((totalEnergy / maxPossibleEnergy) * 100, 100)}%`;
}

requestAnimationFrame(animate);
