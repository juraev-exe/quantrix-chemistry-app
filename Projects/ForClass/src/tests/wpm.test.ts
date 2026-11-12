import { describe, it, expect } from 'vitest';
import { calculateWpm, calculateAccuracy, calculateEffectiveWpm } from '../game/typing/wpm';

describe('Typing Engine: WPM & Accuracy Calculations', () => {
  it('correctly calculates WPM based on standard 5 chars per word', () => {
    // 25 chars in 30 seconds = 5 words in 0.5 minutes = 10 WPM
    expect(calculateWpm(25, 30)).toBe(10);

    // 150 chars in 60 seconds = 30 words in 1 minute = 30 WPM
    expect(calculateWpm(150, 60)).toBe(30);

    // 0 characters or 0 seconds
    expect(calculateWpm(0, 30)).toBe(0);
    expect(calculateWpm(50, 0)).toBe(0);
  });

  it('correctly calculates accuracy percentage', () => {
    // 50 correct out of 50 total = 100%
    expect(calculateAccuracy(50, 50)).toBe(100);

    // 45 correct out of 50 total = 90%
    expect(calculateAccuracy(45, 50)).toBe(90);

    // 0 total typed defaults to 100%
    expect(calculateAccuracy(0, 0)).toBe(100);

    // Accuracy is capped between 0 and 100
    expect(calculateAccuracy(60, 50)).toBe(100);
  });

  it('correctly calculates effective WPM = WPM * (accuracy / 100)', () => {
    // 60 WPM at 100% accuracy = 60 effective WPM
    expect(calculateEffectiveWpm(60, 100)).toBe(60);

    // 60 WPM at 50% accuracy = 30 effective WPM
    expect(calculateEffectiveWpm(60, 50)).toBe(30);

    // 80 WPM at 90% accuracy = 72 effective WPM
    expect(calculateEffectiveWpm(80, 90)).toBe(72);

    // 0 WPM or 0 accuracy
    expect(calculateEffectiveWpm(0, 100)).toBe(0);
    expect(calculateEffectiveWpm(60, 0)).toBe(0);
  });
});

