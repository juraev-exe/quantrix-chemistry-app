import React, { useState } from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, HelpCircle, Settings, Home, Wifi, Copy, Check } from 'lucide-react';
import { soundEngine } from '../game/audio/soundEngine';

interface HeaderProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
  soundMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenSettings,
  onOpenHowToPlay,
  soundMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClassroomUrl = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText('http://192.168.0.156:3000');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-8 py-2.5 bg-[#0a0f1d]/85 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
      <div
        onClick={() => {
          soundEngine.playClick();
          onNavigate('menu');
        }}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <span className="text-xl sm:text-2xl">🎯</span>
        <div className="flex flex-col">
          <span className="font-pixel text-xs sm:text-sm text-cyan-400 group-hover:text-emerald-400 transition-colors tracking-wider text-glow-cyan">
            TYPE OR DIE
          </span>
          <span className="text-[10px] text-slate-500 font-mono tracking-widest hidden sm:inline">
            CLASSROOM & MULTIPLAYER ARENA
          </span>
        </div>
      </div>

      {/* Classroom Network Join Pill */}
      <div
        onClick={handleCopyClassroomUrl}
        title="Click to copy classroom Wi-Fi URL for students"
        className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-600/70 hover:bg-emerald-900/60 cursor-pointer transition-colors text-[11px] font-mono text-emerald-300"
      >
        <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>Wi-Fi Join: <strong>192.168.0.156:3000</strong></span>
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-emerald-400" />
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {currentScreen !== 'menu' && (
          <button
            onClick={() => {
              soundEngine.playClick();
              onNavigate('menu');
            }}
            title="Main Menu"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-400 border border-slate-700 text-xs font-pixel text-slate-300 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden md:inline">MENU</span>
          </button>
        )}

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenHowToPlay();
          }}
          title="How to Play"
          className="p-1.5 rounded bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-400 border border-slate-700 text-slate-300 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onToggleMute();
          }}
          title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="p-1.5 rounded bg-slate-800/80 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-700 text-slate-300 transition-colors"
        >
          {soundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onToggleFullscreen();
          }}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className="p-1.5 rounded bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-400 border border-slate-700 text-slate-300 transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenSettings();
          }}
          title="Settings"
          className="p-1.5 rounded bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-400 border border-slate-700 text-slate-300 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
