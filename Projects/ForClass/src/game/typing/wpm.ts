/**
 * Calculate standard Words Per Minute (WPM).
 * In typing competitions, standard word length is defined as 5 characters.
 *
 * @param correctChars Count of correctly typed characters
 * @param elapsedSeconds Time spent typing in seconds
 */
export function calculateWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || correctChars <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const words = correctChars / 5;
  const rawWpm = words / minutes;
  return Math.max(0, Math.round(rawWpm));
}

/**
 * Calculate typing accuracy percentage (0 to 100).
 *
 * @param correctChars Count of correct characters
 * @param totalTyped Total characters entered including errors
 */
export function calculateAccuracy(correctChars: number, totalTyped: number): number {
  if (totalTyped <= 0) return 100;
  const acc = (correctChars / totalTyped) * 100;
  return Math.min(100, Math.max(0, Math.round(acc * 10) / 10));
}

/**
 * Calculate effective typing speed.
 * Formula: effectiveWpm = WPM * (accuracy / 100)
 *
 * @param wpm Raw Words Per Minute
 * @param accuracy Accuracy percentage (0 - 100)
 */
export function calculateEffectiveWpm(wpm: number, accuracy: number): number {
  if (wpm <= 0 || accuracy <= 0) return 0;
  const eff = wpm * (accuracy / 100);
  return Math.round(eff * 10) / 10;
}

