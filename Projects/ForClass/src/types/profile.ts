export interface PlayerProfile {
  id: string; // unique ID or slug
  name: string; // unique display name
  avatar: string; // avatar identifier (e.g. icon name or emoji)
  characterId: string; // selected character
  weaponId: string; // selected weapon skin
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number; // percentage (0 - 100)
  totalKills: number;
  highestWpm: number;
  averageWpm: number;
  bestAccuracy: number;
  averageAccuracy: number;
  totalCharsTyped: number;
  favoriteGameMode: string;
  createdAt: number;
  lastPlayedDate: number;
}

export type LeaderboardSortBy =
  | 'wins'
  | 'winRate'
  | 'highestWpm'
  | 'bestAccuracy'
  | 'totalKills'
  | 'totalGames';

