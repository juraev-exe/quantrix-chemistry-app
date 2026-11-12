import { CombatEngine } from '../src/game/combat/combatEngine';
import { calculateEffectiveWpm, calculateAccuracy, calculateWpm } from '../src/game/typing/wpm';
import { TypingEngine } from '../src/game/typing/typingEngine';
import { PlayerTurnResult } from '../src/types/game';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${msg}`);
}

console.log('--- RUNNING TYPE OR DIE ENGINE TESTS ---');

// Test 1: Effective WPM
{
  const eff100 = calculateEffectiveWpm(100, 100);
  assert(eff100 === 100, `100 WPM with 100% accuracy = 100 eWPM (got ${eff100})`);

  const eff80 = calculateEffectiveWpm(100, 80);
  assert(eff80 === 80, `100 WPM with 80% accuracy = 80 eWPM (got ${eff80})`);
}

// Test 2: Combat Damage & Winner Determination
{
  const combatEngine = new CombatEngine();

  const p1Result: PlayerTurnResult = {
    playerId: 'p1',
    playerName: 'Ghost',
    challengeText: 'test phrase',
    typedText: 'test phrase',
    wpm: 80,
    accuracy: 100,
    effectiveWpm: 80,
    correctChars: 11,
    incorrectChars: 0,
    completionTimeMs: 2000,
    completed: true,
    timestamp: Date.now()
  };

  const p2Result: PlayerTurnResult = {
    playerId: 'p2',
    playerName: 'Viper',
    challengeText: 'test phrase',
    typedText: 'test phrase',
    wpm: 60,
    accuracy: 100,
    effectiveWpm: 60,
    correctChars: 11,
    incorrectChars: 0,
    completionTimeMs: 2600,
    completed: true,
    timestamp: Date.now()
  };

  const round = combatEngine.resolveRound(1, p1Result, p2Result, 100, 100);
  assert(round.winnerPlayerId === 'p1', 'P1 wins with higher eWPM (80 vs 60)');
  // bonus = min(25, round((80 - 60) * 0.5)) = 10. finalDamage = 10 + 10 = 20.
  assert(round.damageDealt === 20, `Damage dealt is 20 HP (got ${round.damageDealt})`);
  assert(round.p2HpRemaining === 80, `P2 HP drops from 100 to 80 (got ${round.p2HpRemaining})`);
}

// Test 3: Maximum Damage Cap (35 HP)
{
  const combatEngine = new CombatEngine();

  const p1GodMode: PlayerTurnResult = {
    playerId: 'p1',
    playerName: 'Ghost',
    challengeText: 'test',
    typedText: 'test',
    wpm: 150,
    accuracy: 100,
    effectiveWpm: 150,
    correctChars: 4,
    incorrectChars: 0,
    completionTimeMs: 1000,
    completed: true,
    timestamp: Date.now()
  };

  const p2Slow: PlayerTurnResult = {
    playerId: 'p2',
    playerName: 'Viper',
    challengeText: 'test',
    typedText: 'test',
    wpm: 40,
    accuracy: 100,
    effectiveWpm: 40,
    correctChars: 4,
    incorrectChars: 0,
    completionTimeMs: 3000,
    completed: true,
    timestamp: Date.now()
  };

  const round = combatEngine.resolveRound(1, p1GodMode, p2Slow, 100, 100);
  // diff = 110. bonus capped at 25. final = 10 + 25 = 35.
  assert(round.damageDealt === 35, `Damage is capped at maximum 35 HP (got ${round.damageDealt})`);
}

// Test 4: Minimum Damage Floor (10 HP)
{
  const combatEngine = new CombatEngine();

  const p1Slight: PlayerTurnResult = {
    playerId: 'p1',
    playerName: 'Ghost',
    challengeText: 'test',
    typedText: 'test',
    wpm: 61,
    accuracy: 100,
    effectiveWpm: 61,
    correctChars: 4,
    incorrectChars: 0,
    completionTimeMs: 1000,
    completed: true,
    timestamp: Date.now()
  };

  const p2Slight: PlayerTurnResult = {
    playerId: 'p2',
    playerName: 'Viper',
    challengeText: 'test',
    typedText: 'test',
    wpm: 60,
    accuracy: 100,
    effectiveWpm: 60,
    correctChars: 4,
    incorrectChars: 0,
    completionTimeMs: 1010,
    completed: true,
    timestamp: Date.now()
  };

  const round = combatEngine.resolveRound(1, p1Slight, p2Slight, 100, 100);
  assert(round.damageDealt === 11, `Damage includes base 10 + 1 bonus = 11 (got ${round.damageDealt})`);
}

// Test 5: Tie Handling
{
  const combatEngine = new CombatEngine();

  const p1Tie: PlayerTurnResult = {
    playerId: 'p1',
    playerName: 'Ghost',
    challengeText: 'test',
    typedText: 'test',
    wpm: 70,
    accuracy: 100,
    effectiveWpm: 70,
    correctChars: 4,
    incorrectChars: 0,
    completionTimeMs: 1000,
    completed: true,
    timestamp: Date.now()
  };

  const p2Tie: PlayerTurnResult = {
    playerId: 'p2',
    playerName: 'Viper',
    challengeText: 'test',
    typedText: 'test',
    wpm: 70,
    accuracy: 100,
    effectiveWpm: 70,
    correctChars: 4,
    incorrectChars: 0,
    completionTimeMs: 1000,
    completed: true,
    timestamp: Date.now()
  };

  const round = combatEngine.resolveRound(1, p1Tie, p2Tie, 100, 100);
  assert(round.winnerPlayerId === 'tie', 'Tied eWPM results in mutual draw');
  assert(round.damageDealt === 0, 'No damage dealt on exact tie');
}

// Test 6: Typing Engine Validation & Backspace Correction
{
  const engine = new TypingEngine('sniper rifle');

  engine.handleKeyInput('s');
  engine.handleKeyInput('n');
  engine.handleKeyInput('i');
  const errorInput = engine.handleKeyInput('x'); // typo!
  assert(errorInput.isError === true, 'Typo detected by handleKeyInput');

  let state = engine.getState();
  assert(state.mistakes === 1, 'Mistake count tracked accurately = 1');
  assert(!state.isCompleted, 'Not completed on typo');

  // Backspace correction
  engine.handleKeyInput('Backspace');
  state = engine.getState();
  assert(state.typedText === 'sni', 'Backspace retracted incorrect char');

  // Complete correctly
  for (const char of 'per rifle') {
    engine.handleKeyInput(char);
  }
  state = engine.getState();
  assert(state.isCompleted, 'Engine marks complete when full string typed correctly');
  assert(state.typedText === 'sniper rifle', 'Full string matches target');
}

console.log('🎉 ALL ENGINE & COMBAT TESTS PASSED WITH 100% SUCCESS!');
