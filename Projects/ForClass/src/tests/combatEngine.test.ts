import { describe, it, expect } from 'vitest';
import { CombatEngine } from '../game/combat/combatEngine';
import { PlayerTurnResult } from '../types/game';

describe('Combat Engine: Damage Formula & Turn Resolution', () => {
  const engine = new CombatEngine();

  const mockTurnResult = (playerId: string, effectiveWpm: number): PlayerTurnResult => ({
    playerId,
    playerName: playerId,
    challengeText: 'test',
    typedText: 'test',
    wpm: effectiveWpm,
    accuracy: 100,
    effectiveWpm,
    correctChars: 4,
    incorrectChars: 0,
    completionTimeMs: 2000,
    completed: true,
    timestamp: Date.now()
  });

  it('declares the player with higher effective WPM as round winner', () => {
    const p1Turn = mockTurnResult('p1', 60);
    const p2Turn = mockTurnResult('p2', 40);

    const round = engine.resolveRound(1, p1Turn, p2Turn, 100, 100);

    expect(round.winnerPlayerId).toBe('p1');
    expect(round.p1HpRemaining).toBe(100);
    expect(round.p2HpRemaining).toBeLessThan(100);
  });

  it('correctly calculates damage with base 10 + bonus from speed difference', () => {
    // diff = 20 WPM. bonus = min(25, round(20 * 0.5)) = 10. Damage = 10 + 10 = 20.
    const p1Turn = mockTurnResult('p1', 70);
    const p2Turn = mockTurnResult('p2', 50);

    const round = engine.resolveRound(1, p1Turn, p2Turn, 100, 100);
    expect(round.damageDealt).toBe(20);
    expect(round.p2HpRemaining).toBe(80);
  });

  it('enforces minimum damage of 10 and maximum damage of 35', () => {
    // Very small difference (e.g. diff = 1) -> bonus = 1 -> damage = 11 (within bounds)
    const p1Turn = mockTurnResult('p1', 51);
    const p2Turn = mockTurnResult('p2', 50);
    const roundMin = engine.resolveRound(1, p1Turn, p2Turn, 100, 100);
    expect(roundMin.damageDealt).toBeGreaterThanOrEqual(10);

    // Massive difference (e.g. diff = 100) -> bonus capped at 25 -> damage = 35
    const p1Huge = mockTurnResult('p1', 150);
    const p2Low = mockTurnResult('p2', 30);
    const roundMax = engine.resolveRound(1, p1Huge, p2Low, 100, 100);
    expect(roundMax.damageDealt).toBe(35);
    expect(roundMax.p2HpRemaining).toBe(65);
  });

  it('handles ties when difference is less than 0.5', () => {
    const p1Turn = mockTurnResult('p1', 50.2);
    const p2Turn = mockTurnResult('p2', 50.4);

    const round = engine.resolveRound(1, p1Turn, p2Turn, 100, 100);
    expect(round.winnerPlayerId).toBe('tie');
    expect(round.summary).toContain('STALEMATE');
  });

  it('respects damageMultiplier in custom matches', () => {
    const customEngine = new CombatEngine({ damageMultiplier: 2.0 });
    // base 10 + bonus 10 = 20 * 2.0 = 40
    const p1Turn = mockTurnResult('p1', 70);
    const p2Turn = mockTurnResult('p2', 50);

    const round = customEngine.resolveRound(1, p1Turn, p2Turn, 100, 100);
    expect(round.damageDealt).toBe(40);
    expect(round.p2HpRemaining).toBe(60);
  });
});

