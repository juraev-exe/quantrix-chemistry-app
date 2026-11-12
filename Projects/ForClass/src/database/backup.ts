import { getAllProfiles, createProfile, updateProfile } from './profiles';
import { getAllMatches, saveMatch, clearMatchHistory } from './matches';
import { dbClear, STORE_PROFILES } from './indexedDB';
import { GameSettings, DEFAULT_SETTINGS } from '../types/settings';
import { PlayerProfile } from '../types/profile';
import { MatchRecord } from '../types/match';

export interface BackupData {
  version: number;
  exportDate: string;
  profiles: PlayerProfile[];
  matches: MatchRecord[];
  settings: GameSettings;
}

export async function exportAllGameData(): Promise<void> {
  const profiles = await getAllProfiles();
  const matches = await getAllMatches();
  const settingsJson = localStorage.getItem('type_or_die_settings');
  const settings: GameSettings = settingsJson ? JSON.parse(settingsJson) : DEFAULT_SETTINGS;

  const backup: BackupData = {
    version: 1,
    exportDate: new Date().toISOString(),
    profiles,
    matches,
    settings
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `type-or-die-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importGameData(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const data: Partial<BackupData> = JSON.parse(jsonString);
    if (!data || !Array.isArray(data.profiles) || !Array.isArray(data.matches)) {
      return { success: false, message: 'Invalid backup file format.' };
    }

    // Clear existing
    await dbClear(STORE_PROFILES);
    await clearMatchHistory();

    // Restore profiles
    for (const p of data.profiles) {
      if (p.id && p.name) {
        await updateProfile(p);
      }
    }

    // Restore matches
    for (const m of data.matches) {
      if (m.id && m.timestamp) {
        await saveMatch(m);
      }
    }

    // Restore settings
    if (data.settings) {
      localStorage.setItem('type_or_die_settings', JSON.stringify(data.settings));
    }

    return {
      success: true,
      message: `Successfully imported ${data.profiles.length} profiles and ${data.matches.length} matches!`
    };
  } catch (err) {
    return { success: false, message: 'Error parsing backup file: ' + (err as Error).message };
  }
}

export async function resetAllGameData(): Promise<void> {
  await dbClear(STORE_PROFILES);
  await clearMatchHistory();
  localStorage.removeItem('type_or_die_settings');
}

