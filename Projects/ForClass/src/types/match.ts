import { GameMode, RoundResult } from './game';

export interface MatchRecord {
  id: string;
  timestamp: number;
  gameMode: GameMode;
  player1: {
    id: string;
    name: string;
    avatar: string;
    characterId: string;
    weaponId: string;
    finalHp: number;
    avgWpm: number;
    avgAccuracy: number;
    roundsWon: number;
  };
  player2: {
    id: string;
    name: string;
    avatar: string;
    characterId: string;
    weaponId: string;
    finalHp: number;
    avgWpm: number;
    avgAccuracy: number;
    roundsWon: number;
  };
  winnerId: string | 'draw';
  winnerName: string;
  totalRounds: number;
  matchDurationSec: number;
  rounds: RoundResult[];
}

