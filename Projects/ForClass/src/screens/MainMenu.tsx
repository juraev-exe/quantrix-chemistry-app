import React from 'react';
import { Play, Trophy, Users, History, BarChart2, Settings, HelpCircle, Crosshair, Swords, Skull, Target } from 'lucide-react';
import { soundEngine } from '../game/audio/soundEngine';

interface MainMenuProps {
  onNavigate: (screen: string) => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNavigate,
  onOpenSettings,
  onOpenHowToPlay
}) => {
  const menuItems = [
    {
      id: 'play',
      label: 'PLAY DUEL',
      sub: 'Local 2-Player Typing Standoff',
      icon: <Play className="w-5 h-5 text-emerald-400" />,
      action: () => onNavigate('registration'),
      color: 'hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(0,255,102,0.35)]',
      textColor: 'text-emerald-400'
    },
    {
      id: 'tournament',
      label: 'CLASS TOURNAMENT',
      sub: '8-Student Elimination Bracket',
      icon: <Swords className="w-5 h-5 text-amber-400" />,
      action: () => onNavigate('tournament'),
      color: 'hover:border-amber-500 hover:shadow-[0_0_20px_rgba(255,183,3,0.35)]',
      textColor: 'text-amber-400'
    },
    {
      id: 'bossraid',
      label: 'BOSS RAID (CO-OP)',
      sub: 'Class Teams Up vs Giant Megabot',
      icon: <Skull className="w-5 h-5 text-rose-500" />,
      action: () => onNavigate('bossraid'),
      color: 'hover:border-rose-500 hover:shadow-[0_0_20px_rgba(255,42,85,0.35)]',
      textColor: 'text-rose-400'
    },
    {
      id: 'troublekeys',
      label: 'TROUBLE KEYS',
      sub: 'Heatmap & Targeted Technique Drills',
      icon: <Target className="w-5 h-5 text-purple-400" />,
      action: () => onNavigate('troublekeys'),
      color: 'hover:border-purple-500 hover:shadow-[0_0_20px_rgba(176,38,255,0.35)]',
      textColor: 'text-purple-400'
    },
    {
      id: 'practice',
      label: 'PRACTICE RANGE',
      sub: 'Solo Speed & Accuracy Drills',
      icon: <Crosshair className="w-5 h-5 text-cyan-400" />,
      action: () => onNavigate('practice'),
      color: 'hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
      textColor: 'text-cyan-400'
    },
    {
      id: 'leaderboard',
      label: 'LEADERBOARD',
      sub: 'Classroom Hall of Fame & Rankings',
      icon: <Trophy className="w-5 h-5 text-amber-300" />,
      action: () => onNavigate('leaderboard'),
      color: 'hover:border-amber-400 hover:shadow-[0_0_20px_rgba(255,183,3,0.3)]',
      textColor: 'text-amber-300'
    },
    {
      id: 'profiles',
      label: 'STUDENT ROSTER',
      sub: 'Manage Profiles & Print Certificates',
      icon: <Users className="w-5 h-5 text-blue-400" />,
      action: () => onNavigate('profiles'),
      color: 'hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
      textColor: 'text-blue-400'
    },
    {
      id: 'history',
      label: 'MATCH ARCHIVES',
      sub: 'Review Past Duels & Telemetry',
      icon: <History className="w-5 h-5 text-indigo-400" />,
      action: () => onNavigate('history'),
      color: 'hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]',
      textColor: 'text-indigo-400'
    },
    {
      id: 'stats',
      label: 'STATISTICS',
      sub: 'Performance Graphs & Metrics',
      icon: <BarChart2 className="w-5 h-5 text-emerald-300" />,
      action: () => onNavigate('statistics'),
      color: 'hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(0,255,102,0.3)]',
      textColor: 'text-emerald-300'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-6">
      {/* Title & Arcade Banner */}
      <div className="text-center mb-6 relative">
        <div className="inline-block px-3 py-1 mb-2 rounded bg-cyan-950/60 border border-cyan-800 text-[10px] font-pixel text-cyan-400 tracking-widest uppercase">
          ⚔️ 1-ON-1 LOCAL KEYBOARD ARENA ⚔️
        </div>

        <h1 className="font-pixel text-3xl sm:text-5xl md:text-6xl text-white tracking-wider mb-2 drop-shadow-[0_4px_0_#051408]">
          TYPE <span className="text-emerald-400 text-glow-green">OR</span> <span className="text-rose-500 text-glow-red">DIE</span>
        </h1>

        <p className="font-mono text-xs sm:text-sm text-slate-400 tracking-widest uppercase max-w-md mx-auto">
          YOUR KEYBOARD IS YOUR WEAPON. DUEL IN REAL-TIME OR COOPERATE IN CLASSROOM RAIDS.
        </p>
      </div>

      {/* Main Menu Grid (3 columns on large screens) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full max-w-4xl mb-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              soundEngine.playClick();
              item.action();
            }}
            className={`flex items-center gap-3.5 p-3.5 rounded-lg bg-[#0e1626]/90 border border-slate-800 transition-all duration-200 text-left group ${item.color} active:scale-[0.98] shadow-md`}
          >
            <div className="p-2.5 rounded bg-slate-900 border border-slate-700/80 group-hover:scale-110 transition-transform shrink-0">
              {item.icon}
            </div>
            <div>
              <div className={`font-pixel text-xs sm:text-sm tracking-wide ${item.textColor}`}>
                {item.label}
              </div>
              <div className="font-mono text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                {item.sub}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Utility Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenHowToPlay();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900/80 border border-slate-800 hover:text-cyan-400 hover:border-cyan-800 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>HOW TO PLAY</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenSettings();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900/80 border border-slate-800 hover:text-cyan-400 hover:border-cyan-800 transition-colors"
        >
          <Settings className="w-4 h-4 text-purple-400" />
          <span>SETTINGS</span>
        </button>

        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/80 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>WI-FI LAN: 192.168.0.156:3000</span>
        </div>
      </div>
    </div>
  );
};
