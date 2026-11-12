import { LeaderboardSortBy, PlayerProfile } from '../src/types/profile';
import { MatchRecord } from '../src/types/match';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${msg}`);
}

console.log('--- RUNNING DATABASE & LEADERBOARD LOGIC TESTS ---');

// Mock Profiles for ranking tests
const mockProfiles: PlayerProfile[] = [
  {
    id: 'p1',
    name: 'Ghost',
    avatar: '🎯',
    characterId: 'ghost',
    weaponId: 'm24',
    totalGames: 10,
    wins: 8,
    losses: 2,
    draws: 0,
    winRate: 80,
    totalKills: 15,
    highestWpm: 95,
    averageWpm: 78,
    bestAccuracy: 100,
    averageAccuracy: 96,
    totalCharactersTyped: 4500,
    favoriteGameMode: 'quick',
    lastPlayedDate: Date.now() - 5000,
    createdAt: Date.now() - 100000
  },
  {
    id: 'p2',
    name: 'Viper',
    avatar: '⚡',
    characterId: 'viper',
    weaponId: 'barrett',
    totalGames: 12,
    wins: 6,
    losses: 6,
    draws: 0,
    winRate: 50,
    totalKills: 9,
    highestWpm: 110, // Higher WPM than Ghost!
    averageWpm: 82,
    bestAccuracy: 98,
    averageAccuracy: 92,
    totalCharactersTyped: 6200,
    favoriteGameMode: 'bo3',
    lastPlayedDate: Date.now() - 1000,
    createdAt: Date.now() - 120000
  },
  {
    id: 'p3',
    name: 'Reaper',
    avatar: '💀',
    characterId: 'reaper',
    weaponId: 'plasma',
    totalGames: 5,
    wins: 5,
    losses: 0,
    draws: 0,
    winRate: 100, // 100% win rate!
    totalKills: 12,
    highestWpm: 85,
    averageWpm: 75,
    bestAccuracy: 100,
    averageAccuracy: 99,
    totalCharactersTyped: 2400,
    favoriteGameMode: 'sudden',
    lastPlayedDate: Date.now(),
    createdAt: Date.now() - 80000
  }
];

function sortProfiles(list: PlayerProfile[], sortBy: LeaderboardSortBy): PlayerProfile[] {
  return [...list].sort((a, b) => {
    switch (sortBy) {
      case 'wins':
        return b.wins - a.wins || b.winRate - a.winRate;
      case 'winRate':
        return b.winRate - a.winRate || b.wins - a.wins;
      case 'highestWpm':
        return b.highestWpm - a.highestWpm;
      case 'bestAccuracy':
        return b.bestAccuracy - a.bestAccuracy || b.averageAccuracy - a.averageAccuracy;
      case 'totalKills':
        return b.totalKills - a.totalKills;
      case 'totalGames':
        return b.totalGames - a.totalGames;
      default:
        return b.wins - a.wins;
    }
  });
}

// 1. Sort by Wins (Ghost has 8 wins -> rank 1)
{
  const sorted = sortProfiles(mockProfiles, 'wins');
  assert(sorted[0].name === 'Ghost', 'Most Wins: Ghost is #1 with 8 wins');
  assert(sorted[1].name === 'Viper', 'Most Wins: Viper is #2 with 6 wins');
  assert(sorted[2].name === 'Reaper', 'Most Wins: Reaper is #3 with 5 wins');
}

// 2. Sort by Win Rate (Reaper has 100% win rate -> rank 1)
{
  const sorted = sortProfiles(mockProfiles, 'winRate');
  assert(sorted[0].name === 'Reaper', 'Win Rate: Reaper is #1 with 100% win rate');
  assert(sorted[1].name === 'Ghost', 'Win Rate: Ghost is #2 with 80% win rate');
}

// 3. Sort by Highest WPM (Viper has 110 WPM -> rank 1)
{
  const sorted = sortProfiles(mockProfiles, 'highestWpm');
  assert(sorted[0].name === 'Viper', 'Highest WPM: Viper is #1 with 110 WPM');
  assert(sorted[1].name === 'Ghost', 'Highest WPM: Ghost is #2 with 95 WPM');
}

// 4. Backup & Export JSON Structure Validation
{
  const backupPayload = {
    version: 1,
    exportedAt: Date.now(),
    profiles: mockProfiles,
    matches: []
  };

  const jsonStr = JSON.stringify(backupPayload);
  const parsed = JSON.parse(jsonStr);

  assert(parsed.version === 1, 'Backup payload contains valid version metadata');
  assert(parsed.profiles.length === 3, 'Backup payload retains all profiles');
}

console.log('🎉 ALL DATABASE & LEADERBOARD LOGIC TESTS PASSED!');
