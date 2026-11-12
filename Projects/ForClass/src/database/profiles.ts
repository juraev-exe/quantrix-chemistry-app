import { PlayerProfile, LeaderboardSortBy } from '../types/profile';
import { MatchRecord } from '../types/match';
import { dbGetAll, dbGet, dbPut, dbDelete, STORE_PROFILES } from './indexedDB';

export async function getAllProfiles(): Promise<PlayerProfile[]> {
  try {
    const list = await dbGetAll<PlayerProfile>(STORE_PROFILES);
    return list.sort((a, b) => b.lastPlayedDate - a.lastPlayedDate);
  } catch (err) {
    console.error('Failed to load profiles from IndexedDB:', err);
    return [];
  }
}

export async function getProfileById(id: string): Promise<PlayerProfile | undefined> {
  try {
    return await dbGet<PlayerProfile>(STORE_PROFILES, id);
  } catch (err) {
    console.error('Failed to get profile by id:', err);
    return undefined;
  }
}

export async function getProfileByName(name: string): Promise<PlayerProfile | undefined> {
  const all = await getAllProfiles();
  const normalized = name.trim().toLowerCase();
  return all.find(p => p.name.trim().toLowerCase() === normalized);
}

export async function createProfile(
  name: string,
  avatar: string = '🎯',
  characterId: string = 'cyber-commando',
  weaponId: string = 'anti-materiel'
): Promise<PlayerProfile> {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error('Player name cannot be empty.');
  }

  const existing = await getProfileByName(trimmed);
  if (existing) {
    throw new Error(`Player name "${trimmed}" is already registered.`);
  }

  const id = 'player_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const newProfile: PlayerProfile = {
    id,
    name: trimmed,
    avatar,
    characterId,
    weaponId,
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

  await dbPut(STORE_PROFILES, newProfile);
  return newProfile;
}

export async function updateProfile(profile: PlayerProfile): Promise<void> {
  await dbPut(STORE_PROFILES, profile);
}

export async function deleteProfile(id: string): Promise<void> {
  await dbDelete(STORE_PROFILES, id);
}

/**
 * Update player statistics following the conclusion of a match.
 */
export async function updateProfilesAfterMatch(match: MatchRecord): Promise<void> {
  const p1 = await getProfileById(match.player1.id);
  const p2 = await getProfileById(match.player2.id);

  const updateStats = (
    profile: PlayerProfile,
    isWinner: boolean,
    isDraw: boolean,
    playerMatchData: typeof match.player1,
    opponentKilled: boolean
  ) => {
    profile.totalGames += 1;
    if (isDraw) {
      profile.draws += 1;
    } else if (isWinner) {
      profile.wins += 1;
    } else {
      profile.losses += 1;
    }

    profile.winRate = Math.round((profile.wins / profile.totalGames) * 100);

    if (opponentKilled) {
      profile.totalKills += 1;
    }

    if (playerMatchData.avgWpm > profile.highestWpm) {
      profile.highestWpm = playerMatchData.avgWpm;
    }

    // Cumulative average WPM
    profile.averageWpm = Math.round(
      ((profile.averageWpm * (profile.totalGames - 1)) + playerMatchData.avgWpm) / profile.totalGames
    );

    if (playerMatchData.avgAccuracy > profile.bestAccuracy) {
      profile.bestAccuracy = playerMatchData.avgAccuracy;
    }

    // Cumulative average Accuracy
    profile.averageAccuracy = Math.round(
      (((profile.averageAccuracy * (profile.totalGames - 1)) + playerMatchData.avgAccuracy) / profile.totalGames) * 10
    ) / 10;

    // Sum characters typed in this match
    let matchChars = 0;
    match.rounds.forEach(r => {
      const turn = r.p1Result.playerId === profile.id ? r.p1Result : r.p2Result;
      matchChars += turn.typedText.length;
    });
    profile.totalCharsTyped += matchChars;

    profile.lastPlayedDate = Date.now();
  };

  if (p1) {
    const isP1Win = match.winnerId === p1.id;
    const isDraw = match.winnerId === 'draw';
    const killedP2 = isP1Win && match.player2.finalHp <= 0;
    updateStats(p1, isP1Win, isDraw, match.player1, killedP2);
    await dbPut(STORE_PROFILES, p1);
  }

  if (p2) {
    const isP2Win = match.winnerId === p2.id;
    const isDraw = match.winnerId === 'draw';
    const killedP1 = isP2Win && match.player1.finalHp <= 0;
    updateStats(p2, isP2Win, isDraw, match.player2, killedP1);
    await dbPut(STORE_PROFILES, p2);
  }
}

export function sortLeaderboard(profiles: PlayerProfile[], sortBy: LeaderboardSortBy): PlayerProfile[] {
  const sorted = [...profiles];
  switch (sortBy) {
    case 'wins':
      return sorted.sort((a, b) => b.wins - a.wins || b.winRate - a.winRate);
    case 'winRate':
      return sorted.sort((a, b) => b.winRate - a.winRate || b.wins - a.wins);
    case 'highestWpm':
      return sorted.sort((a, b) => b.highestWpm - a.highestWpm || b.averageWpm - a.averageWpm);
    case 'bestAccuracy':
      return sorted.sort((a, b) => b.bestAccuracy - a.bestAccuracy || b.averageAccuracy - a.averageAccuracy);
    case 'totalKills':
      return sorted.sort((a, b) => b.totalKills - a.totalKills || b.wins - a.wins);
    case 'totalGames':
      return sorted.sort((a, b) => b.totalGames - a.totalGames || b.wins - a.wins);
    default:
      return sorted.sort((a, b) => b.wins - a.wins);
  }
}

