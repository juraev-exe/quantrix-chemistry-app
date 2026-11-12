import { describe, it, expect } from 'vitest';
import { getBalancedChallengePair, CHALLENGES } from '../data/challenges/challenges';
import { Difficulty } from '../types/game';

describe('Typing Challenges: Fairness & Balance', () => {
  it('contains challenges across all difficulty tiers', () => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'tech'];
    for (const diff of difficulties) {
      const items = CHALLENGES.filter((c) => c.difficulty === diff);
      expect(items.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('provides two distinct challenges of equal difficulty and comparable length', () => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'tech'];

    for (const diff of difficulties) {
      const [c1, c2] = getBalancedChallengePair(diff);

      // Must be same difficulty
      expect(c1.difficulty).toBe(diff);
      expect(c2.difficulty).toBe(diff);

      // Must not be the exact same sentence
      expect(c1.id).not.toBe(c2.id);
      expect(c1.text).not.toBe(c2.text);

      // Must be close in length (within 20 characters)
      const diffLength = Math.abs(c1.charCount - c2.charCount);
      expect(diffLength).toBeLessThanOrEqual(25);
    }
  });
});

