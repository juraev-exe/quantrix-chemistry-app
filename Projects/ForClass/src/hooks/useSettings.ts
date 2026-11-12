import { useState, useEffect } from 'react';
import { GameSettings, DEFAULT_SETTINGS } from '../types/settings';
import { soundEngine } from '../game/audio/soundEngine';
import { announcer } from '../game/audio/announcer';

const SETTINGS_KEY = 'type_or_die_settings';

export function useSettings() {
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage', e);
    }
    soundEngine.setVolumes(
      settings.masterVolume,
      settings.sfxVolume,
      settings.musicVolume,
      settings.soundMuted
    );
    announcer.setEnabled(!settings.soundMuted && (settings.announcerEnabled ?? true));
  }, [settings]);

  const updateSettings = (updates: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return { settings, updateSettings, resetSettings };
}

