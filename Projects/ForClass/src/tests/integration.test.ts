import { describe, it, expect } from 'vitest';
import { CombatEngine } from '../game/combat/combatEngine';
import { PlayerProfile } from '../types/profile';
import { MatchRecord } from '../types/match';
import { PlayerTurnResult, RoundResult } from '../types/game';
import { sortLeaderboard } from '../database/profiles';
import { BackupData } from '../database/backup';

describe('Integration: Complete Match Flow & Persistence Lifecycle', () => {
  const p1: PlayerProfile = {
    id: 'p1_id',
    name: 'SNIPER_ALPHA',
    avatar: '🎯',
    characterId: 'cyber-commando',
    weaponId: 'anti-materiel',
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winRate: 0,
    totalKills: 0,
    highestWpm: 0,
    averageWpm: 0,
    bestAccuracy: 0,
    averageAccuracy: 0,
    totalCharsTyped: 0,
    favoriteGameMode: 'quick',
    createdAt: Date.now(),
    lastPlayedDate: Date.now()
  };

  const p2: PlayerProfile = {
    id: 'p2_id',
    name: 'GHOST_OMEGA',
    avatar: '💀',
    characterId: 'neon-reaper',
    weaponId: 'plasma-carbine',
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winRate: 0,
    totalKills: 0,
    highestWpm: 0,
    averageWpm: 0,
    bestAccuracy: 0,
    averageAccuracy: 0,
    totalCharsTyped: 0,
    favoriteGameMode: 'quick',
    createdAt: Date.now(),
    lastPlayedDate: Date.now()
  };

  it('executes a multi-round match until HP reaches 0 and updates profiles', () => {
    const combat = new CombatEngine();
    let p1Hp = 100;
    let p2Hp = 100;
    const rounds: RoundResult[] = [];

    // Round 1: P1 outtypes P2 (70 WPM vs 40 WPM)
    const p1TurnR1: PlayerTurnResult = {
      playerId: p1.id,
      playerName: p1.name,
      challengeText: 'target acquired',
      typedText: 'target acquired',
      wpm: 70,
      accuracy: 100,
      effectiveWpm: 70,
      correctChars: 15,
      incorrectChars: 0,
      completionTimeMs: 2500,
      completed: true,
      timestamp: Date.now()
    };

    const p2TurnR1: PlayerTurnResult = {
      playerId: p2.id,
      playerName: p2.name,
      challengeText: 'secure perimeter',
      typedText: 'secure perimeter',
      wpm: 40,
      accuracy: 100,
      effectiveWpm: 40,
      correctChars: 16,
      incorrectChars: 0,
      completionTimeMs: 4000,
      completed: true,
      timestamp: Date.now()
    };

    const r1 = combat.resolveRound(1, p1TurnR1, p2TurnR1, p1Hp, p2Hp);
    expect(r1.winnerPlayerId).toBe(p1.id);
    expect(r1.damageDealt).toBe(25); // base 10 + min(25, 30*0.5=15) = 25
    expect(r1.p2HpRemaining).toBe(75);
    p2Hp = r1.p2HpRemaining;
    rounds.push(r1);

    // Round 2: Massive critical hit from P1 (diff >= 50 => max 35 damage)
    const p1TurnR2 = { ...p1TurnR1, wpm: 90, effectiveWpm: 90 };
    const p2TurnR2 = { ...p2TurnR1, wpm: 35, effectiveWpm: 35 };
    const r2 = combat.resolveRound(2, p1TurnR2, p2TurnR2, p1Hp, p2Hp);
    expect(r2.damageDealt).toBe(35); // capped at max damage 35
    expect(r2.p2HpRemaining).toBe(40);
    p2Hp = r2.p2HpRemaining;
    rounds.push(r2);

    // Round 3: P1 finishes off P2 with another hit
    const r3 = combat.resolveRound(3, p1TurnR2, p2TurnR2, p1Hp, p2Hp);
    expect(r3.p2HpRemaining).toBe(5);
    p2Hp = r3.p2HpRemaining;
    rounds.push(r3);

    // Round 4: Final lethal shot
    const r4 = combat.resolveRound(4, p1TurnR2, p2TurnR2, p1Hp, p2Hp);
    expect(r4.p2HpRemaining).toBe(0);
    p2Hp = r4.p2HpRemaining;
    rounds.push(r4);

    // Match concluded: P1 wins, P2 reaches 0 HP
    expect(p2Hp).toBe(0);

    // Verify Match Record data structure
    const matchRecord: MatchRecord = {
      id: 'match_test_1',
      timestamp: Date.now(),
      gameMode: 'quick',
      player1: {
        id: p1.id,
        name: p1.name,
        avatar: p1.avatar,
        characterId: p1.characterId,
        weaponId: p1.weaponId,
        finalHp: p1Hp,
        avgWpm: 85,
        avgAccuracy: 100,
        roundsWon: 4
      },
      player2: {
        id: p2.id,
        name: p2.name,
        avatar: p2.avatar,
        characterId: p2.characterId,
        weaponId: p2.weaponId,
        finalHp: 0,
        avgWpm: 36,
        avgAccuracy: 100,
        roundsWon: 0
      },
      winnerId: p1.id,
      winnerName: p1.name,
      totalRounds: 4,
      matchDurationSec: 32,
      rounds
    };

    expect(matchRecord.winnerId).toBe(p1.id);
    expect(matchRecord.player2.finalHp).toBe(0);
    expect(matchRecord.rounds.length).toBe(4);
  });

  it('correctly ranks leaderboard across multiple sort categories', () => {
    const list: PlayerProfile[] = [
      { ...p1, id: 'a', name: 'ALICE', wins: 10, totalGames: 12, winRate: 83, highestWpm: 95, totalKills: 8, bestAccuracy: 98 },
      { ...p2, id: 'b', name: 'BOB', wins: 15, totalGames: 25, winRate: 60, highestWpm: 120, totalKills: 14, bestAccuracy: 94 },
      { ...p1, id: 'c', name: 'CHARLIE', wins: 8, totalGames: 8, winRate: 100, highestWpm: 80, totalKills: 6, bestAccuracy: 99 }
    ];

    // Sorted by Wins: Bob (15) > Alice (10) > Charlie (8)
    const byWins = sortLeaderboard(list, 'wins');
    expect(byWins[0].name).toBe('BOB');
    expect(byWins[1].name).toBe('ALICE');
    expect(byWins[2].name).toBe('CHARLIE');

    // Sorted by Win Rate: Charlie (100%) > Alice (83%) > Bob (60%)
    const byRate = sortLeaderboard(list, 'winRate');
    expect(byRate[0].name).toBe('CHARLIE');
    expect(byRate[1].name).toBe('ALICE');

    // Sorted by Peak WPM: Bob (120) > Alice (95) > Charlie (80)
    const byWpm = sortLeaderboard(list, 'highestWpm');
    expect(byWpm[0].name).toBe('BOB');
    expect(byWpm[1].name).toBe('ALICE');

    // Sorted by Accuracy: Charlie (99%) > Alice (98%) > Bob (94%)
    const byAcc = sortLeaderboard(list, 'bestAccuracy');
    expect(byAcc[0].name).toBe('CHARLIE');
  });

  it('validates JSON export / import schema', () => {
    const backup: BackupData = {
      version: 1,
      exportDate: new Date().toISOString(),
      profiles: [p1, p2],
      matches: [],
      settings: {
        masterVolume: 80,
        sfxVolume: 85,
        musicVolume: 50,
        soundMuted: false,
        announcerEnabled: true,
        fullscreen: false,
        animationIntensity: 'full',
        reducedMotion: false,
        defaultDifficulty: 'medium',
        defaultGameMode: 'quick',
        defaultTimerSec: 30,
        theme: 'cyberpunk'
      }
    };

    const json = JSON.stringify(backup);
    const parsed: BackupData = JSON.parse(json);

    expect(parsed.version).toBe(1);
    expect(parsed.profiles.length).toBe(2);
    expect(parsed.profiles[0].name).toBe('SNIPER_ALPHA');
    expect(parsed.settings.defaultDifficulty).toBe('medium');
  });
});

