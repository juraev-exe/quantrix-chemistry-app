// P2: Single AudioContext created once at module load and reused.
// Mute state persisted in localStorage.

const MUTE_KEY = 'quantrix_muted';

// Create context lazily on first user interaction to comply with browser policy
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

/**
 * Play a sine wave tone whose frequency is scaled to the element's atomic number.
 * Silently skips when muted.
 * @param {number} atomicNumber
 */
export function playElementSound(atomicNumber) {
  if (isMuted()) return;

  try {
    const ctx = getCtx();
    if (!ctx) return;

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 220 + atomicNumber * 4;

    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.35);
  } catch (err) {
    console.warn('AudioContext error:', err);
  }
}
