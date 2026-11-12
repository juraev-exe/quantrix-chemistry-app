import React, { useRef, useState } from 'react';
import { X, Volume2, Sliders, Monitor, Download, Upload, Trash2, CheckCircle2 } from 'lucide-react';
import { GameSettings } from '../types/settings';
import { Difficulty, GameMode } from '../types/game';
import { soundEngine } from '../game/audio/soundEngine';
import { exportAllGameData, importGameData, resetAllGameData } from '../database/backup';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (updates: Partial<GameSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExport = async () => {
    soundEngine.playClick();
    await exportAllGameData();
    showNotice('Backup downloaded successfully!');
  };

  const handleImportClick = () => {
    soundEngine.playClick();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const res = await importGameData(content);
      if (res.success) {
        showNotice(res.message);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = async () => {
    soundEngine.playClick();
    if (confirm('DANGER: This will delete all local player profiles and match history permanently. Continue?')) {
      await resetAllGameData();
      showNotice('All data has been reset.');
      setTimeout(() => window.location.reload(), 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f172a] border-2 border-cyan-500/50 rounded-lg p-6 shadow-[0_0_35px_rgba(0,240,255,0.25)] text-slate-200">
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
          <Sliders className="w-8 h-8 text-cyan-400" />
          <div>
            <h2 className="font-pixel text-lg text-cyan-400 tracking-wide">SYSTEM SETTINGS</h2>
            <p className="text-xs text-slate-400 font-mono">AUDIO, GRAPHICS & STORAGE CONFIGURATION</p>
          </div>
        </div>

        {notification && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded flex items-center gap-2 text-emerald-300 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        <div className="space-y-6 text-sm font-mono">
          {/* Audio Settings */}
          <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800">
            <h3 className="flex items-center gap-2 font-pixel text-xs text-cyan-400 mb-4">
              <Volume2 className="w-4 h-4" /> AUDIO CONTROLS
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Master Volume</span>
                  <span className="text-cyan-400">{settings.masterVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.masterVolume}
                  onChange={(e) => onUpdateSettings({ masterVolume: Number(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Sound Effects (Gunfire, Hits, UI)</span>
                  <span className="text-emerald-400">{settings.sfxVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.sfxVolume}
                  onChange={(e) => onUpdateSettings({ sfxVolume: Number(e.target.value) })}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Ambient Music</span>
                  <span className="text-purple-400">{settings.musicVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.musicVolume}
                  onChange={(e) => onUpdateSettings({ musicVolume: Number(e.target.value) })}
                  className="w-full accent-purple-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs">Mute All Audio</span>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onUpdateSettings({ soundMuted: !settings.soundMuted });
                  }}
                  className={`px-4 py-1.5 rounded font-pixel text-[10px] ${
                    settings.soundMuted ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {settings.soundMuted ? 'MUTED' : 'ENABLED'}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <div>
                  <span className="text-xs">Arcade Announcer Voice</span>
                  <p className="text-[10px] text-slate-400">Offline speech voice for match start & handovers</p>
                </div>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onUpdateSettings({ announcerEnabled: !settings.announcerEnabled });
                  }}
                  className={`px-4 py-1.5 rounded font-pixel text-[10px] ${
                    settings.announcerEnabled ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {settings.announcerEnabled ? 'VOICE ON' : 'VOICE OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Graphics & Performance */}
          <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800">
            <h3 className="flex items-center gap-2 font-pixel text-xs text-emerald-400 mb-4">
              <Monitor className="w-4 h-4" /> GRAPHICS & ACCESSIBILITY
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">Animation Intensity</div>
                  <div className="text-[11px] text-slate-400">Controls particle density and smoke</div>
                </div>
                <div className="flex gap-1">
                  {(['full', 'medium', 'low'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        soundEngine.playClick();
                        onUpdateSettings({ animationIntensity: level });
                      }}
                      className={`px-2.5 py-1 rounded font-pixel text-[9px] uppercase ${
                        settings.animationIntensity === level
                          ? 'bg-cyan-500 text-black font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="font-bold text-slate-200">Reduced Motion</div>
                  <div className="text-[11px] text-slate-400">Disables intense screen shaking</div>
                </div>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onUpdateSettings({ reducedMotion: !settings.reducedMotion });
                  }}
                  className={`px-3 py-1 rounded font-pixel text-[9px] ${
                    settings.reducedMotion ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {settings.reducedMotion ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Gameplay Defaults */}
          <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800">
            <h3 className="font-pixel text-xs text-amber-400 mb-4">DEFAULT GAMEPLAY PREFERENCES</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Default Difficulty</label>
                <select
                  value={settings.defaultDifficulty}
                  onChange={(e) => onUpdateSettings({ defaultDifficulty: e.target.value as Difficulty })}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                >
                  <option value="easy">Easy (Short Words & Phrases)</option>
                  <option value="medium">Medium (Standard Sentences)</option>
                  <option value="hard">Hard (Complex & Long)</option>
                  <option value="tech">Tech (Programming / Code)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Default Mode</label>
                <select
                  value={settings.defaultGameMode}
                  onChange={(e) => onUpdateSettings({ defaultGameMode: e.target.value as GameMode })}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                >
                  <option value="quick">Quick Duel (100 HP)</option>
                  <option value="bo3">Best of 3</option>
                  <option value="bo5">Best of 5</option>
                  <option value="sudden">Sudden Death</option>
                  <option value="practice">Practice Mode</option>
                  <option value="custom">Custom Match</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Typing Time Limit</label>
                <select
                  value={settings.defaultTimerSec}
                  onChange={(e) => onUpdateSettings({ defaultTimerSec: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                >
                  <option value={20}>20 Seconds (High Pressure)</option>
                  <option value={30}>30 Seconds (Standard)</option>
                  <option value={45}>45 Seconds (Relaxed)</option>
                  <option value={60}>60 Seconds (Long)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Color Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => onUpdateSettings({ theme: e.target.value as GameSettings['theme'] })}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                >
                  <option value="cyberpunk">Cyberpunk Neon</option>
                  <option value="blood">Blood Red</option>
                  <option value="matrix">Matrix Emerald</option>
                  <option value="retro-amber">Retro Amber</option>
                </select>
              </div>
            </div>
          </div>

          {/* Backup, Export & Reset */}
          <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800">
            <h3 className="font-pixel text-xs text-rose-400 mb-4">LOCAL DATA MANAGEMENT</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs text-cyan-400 border border-cyan-800 font-pixel text-[10px]"
              >
                <Download className="w-3.5 h-3.5" /> EXPORT BACKUP JSON
              </button>

              <button
                onClick={handleImportClick}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs text-emerald-400 border border-emerald-800 font-pixel text-[10px]"
              >
                <Upload className="w-3.5 h-3.5" /> IMPORT BACKUP JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                onClick={handleResetData}
                className="flex items-center gap-2 px-3 py-2 bg-rose-950/60 hover:bg-rose-900 rounded text-xs text-rose-300 border border-rose-700 font-pixel text-[10px]"
              >
                <Trash2 className="w-3.5 h-3.5" /> RESET ALL DATA
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="px-6 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-pixel text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            SAVE & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
export default SettingsModal;
