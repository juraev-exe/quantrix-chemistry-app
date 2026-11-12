// Audio & Haptic Feedback Module
// Web Audio API oscillator synthesis calibrated for atomic numbers.
// Mute state persisted in localStorage.

const MUTE_KEY = 'quantrix_muted';
let _audioCtx = null;

function getCtx() {
  if (!_audioCtx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (Ctor) _audioCtx = new Ctor();
  }
  if (_audioCtx && _audioCtx.state === 'suspended') {
    _audioCtx.resume();
  }
  return _audioCtx;
}

/** Returns true when sound is currently muted. */
export function isMuted() {
  return localStorage.getItem(MUTE_KEY) === '1';
}

/** Toggle mute and persist to localStorage. Returns new muted state. */
export function toggleMute() {
  const next = !isMuted();
  localStorage.setItem(MUTE_KEY, next ? '1' : '0');
  return next;
}

/** Trigger device haptic vibration if supported (touch screens). */
export function triggerHaptic(type = 'light') {
  if (!('vibrate' in navigator)) return;
  try {
    if (type === 'light') navigator.vibrate(8);
    else if (type === 'success') navigator.vibrate([10, 30, 10]);
    else if (type === 'error') navigator.vibrate([20, 40, 20]);
  } catch {
    // Ignore unsupported devices
  }
}

/** Crisp tactile UI tap for button and key presses. */
export function playTapSound() {
  triggerHaptic('light');
  if (isMuted()) return;
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = ctx.currentTime;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.03);
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.03);
  } catch {}
}

/** Harmonic confirmation tone for correct answers and calculation results. */
export function playSuccessSound() {
  triggerHaptic('success');
  if (isMuted()) return;
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    [523.25, 659.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, t + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + i * 0.06);
      osc.stop(t + i * 0.06 + 0.2);
    });
  } catch {}
}

/** Subtle low feedback for calculator or quiz error. */
export function playErrorSound() {
  triggerHaptic('error');
  if (isMuted()) return;
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.15);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  } catch {}
}

/**
 * Play an acoustic tone whose frequency is tuned to the element's atomic number.
 * @param {number} atomicNumber
 */
export function playElementSound(atomicNumber) {
  triggerHaptic('light');
  if (isMuted()) return;

  try {
    const ctx = getCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency scaled from 220Hz (A3) upward based on atomic number
    osc.frequency.value = 220 + atomicNumber * 4.2;

    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.32);
  } catch (err) {
    console.warn('AudioContext error:', err);
  }
}
