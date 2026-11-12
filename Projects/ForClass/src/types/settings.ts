import { Difficulty, GameMode } from './game';

export interface GameSettings {
  masterVolume: number; // 0 - 100
  sfxVolume: number; // 0 - 100
  musicVolume: number; // 0 - 100
  soundMuted: boolean;
  announcerEnabled: boolean;
  fullscreen: boolean;
  animationIntensity: 'full' | 'medium' | 'low';
  reducedMotion: boolean;
  defaultDifficulty: Difficulty;
  defaultGameMode: GameMode;
  defaultTimerSec: number;
  theme: 'cyberpunk' | 'blood' | 'matrix' | 'retro-amber';
}

export const DEFAULT_SETTINGS: GameSettings = {
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
};

