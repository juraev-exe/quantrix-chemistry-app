export type GameMode = 'quick' | 'bo3' | 'bo5' | 'sudden' | 'practice' | 'custom';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'tech';

export interface CustomGameConfig {
  startingHp: number;
  difficulty: Difficulty;
  timeLimitSec: number;
  damageMultiplier: number;
  roundsToWin: number;
}

export interface PlayerTurnResult {
  playerId: string;
  playerName: string;
  challengeText: string;
  typedText: string;
  wpm: number;
  accuracy: number;
  effectiveWpm: number;
  correctChars: number;
  incorrectChars: number;
  completionTimeMs: number;
  completed: boolean;
  timestamp: number;
}

export interface RoundResult {
  roundNumber: number;
  p1Result: PlayerTurnResult;
  p2Result: PlayerTurnResult;
  winnerPlayerId: string | 'tie';
  damageDealt: number;
  p1HpRemaining: number;
  p2HpRemaining: number;
  summary: string;
}

export type ArenaPhase =
  | 'p1_countdown'
  | 'p1_typing'
  | 'p1_finished'
  | 'handover'
  | 'p2_countdown'
  | 'p2_typing'
  | 'p2_finished'
  | 'round_resolution'
  | 'shooting_animation'
  | 'round_winner_summary'
  | 'match_over';
