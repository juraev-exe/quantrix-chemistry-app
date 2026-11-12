import React, { useState } from 'react';
import { Swords, Trophy, Flame, Skull, Target, Sliders, ArrowLeft, ArrowRight } from 'lucide-react';
import { GameMode, Difficulty, CustomGameConfig } from '../types/game';
import { PlayerProfile } from '../types/profile';
import { soundEngine } from '../game/audio/soundEngine';

interface GameModeSelectionProps {
  p1: PlayerProfile;
  p2: PlayerProfile;
  onBack: () => void;
  onStartGame: (mode: GameMode, difficulty: Difficulty, customConfig?: CustomGameConfig) => void;
}

export const GameModeSelection: React.FC<GameModeSelectionProps> = ({
  p1,
  p2,
  onBack,
  onStartGame
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('quick');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');

  // Custom Match settings
  const [customHp, setCustomHp] = useState<number>(100);
  const [customTime, setCustomTime] = useState<number>(30);
  const [customDmgMult, setCustomDmgMult] = useState<number>(1.0);
  const [customRounds, setCustomRounds] = useState<number>(1);

  const modes = [
    {
      id: 'quick' as GameMode,
      name: 'QUICK DUEL',
      icon: <Swords className="w-6 h-6 text-cyan-400" />,
      desc: 'Standard 100 HP deathmatch. The first sniper to deplete the adversary’s health pool wins.',
      badge: 'POPULAR'
    },
    {
      id: 'bo3' as GameMode,
      name: 'BEST OF 3',
      icon: <Trophy className="w-6 h-6 text-emerald-400" />,
      desc: 'Tournament series. Snipers duel across rounds; first to win 2 rounds secures the match.',
      badge: 'COMPETITIVE'
    },
    {
      id: 'bo5' as GameMode,
      name: 'BEST OF 5',
      icon: <Flame className="w-6 h-6 text-amber-400" />,
      desc: 'Extended marathon standoff. First sniper to claim 3 victorious rounds wins the crown.',
      badge: 'ENDURANCE'
    },
    {
      id: 'sudden' as GameMode,
      name: 'SUDDEN DEATH',
      icon: <Skull className="w-6 h-6 text-rose-500" />,
      desc: 'One shot, one kill. Starting HP is set to 1. The first shot fired delivers instant elimination.',
      badge: 'LETHAL'
    },
    {
      id: 'custom' as GameMode,
      name: 'CUSTOM MATCH',
      icon: <Sliders className="w-6 h-6 text-purple-400" />,
      desc: 'Fine-tune combat parameters: starting health, time limits, difficulty, and damage multipliers.',
      badge: 'CONFIGURABLE'
    }
  ];

  const handleLaunch = () => {
    soundEngine.playClick();
    if (selectedMode === 'custom') {
      const customConfig: CustomGameConfig = {
        startingHp: customHp,
        difficulty: selectedDifficulty,
        timeLimitSec: customTime,
        damageMultiplier: customDmgMult,
        roundsToWin: customRounds
      };
      onStartGame('custom', selectedDifficulty, customConfig);
    } else {
      onStartGame(selectedMode, selectedDifficulty);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <button
          onClick={() => {
            soundEngine.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-pixel text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
        <div className="text-center">
          <h2 className="font-pixel text-lg sm:text-xl text-cyan-400 tracking-wider">
            ENGAGEMENT PROTOCOL
          </h2>
          <p className="font-mono text-xs text-slate-400">
            {p1.name} <span className="text-rose-500 font-bold">VS</span> {p2.name}
          </p>
        </div>
        <div className="w-16" />
      </div>

      {/* Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {modes.map((m) => {
          const isSelected = selectedMode === m.id;
          return (
            <div
              key={m.id}
              onClick={() => {
                soundEngine.playClick();
                setSelectedMode(m.id);
              }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)] scale-[1.01]'
                  : 'bg-[#0e1626]/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    {m.icon}
                  </div>
                  <span className={`font-pixel text-xs tracking-wider ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {m.name}
                  </span>
                </div>
                <span className="font-pixel text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {m.badge}
                </span>
              </div>
              <p className="font-mono text-xs text-slate-400 leading-relaxed">
                {m.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Custom Match Settings panel */}
      {selectedMode === 'custom' && (
        <div className="p-5 mb-6 rounded-lg bg-slate-900/90 border border-purple-500/40 shadow-lg text-xs font-mono space-y-4">
          <div className="font-pixel text-xs text-purple-400 flex items-center gap-2">
            <Sliders className="w-4 h-4" /> CUSTOM COMBAT PARAMETERS
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Starting HP</label>
              <select
                value={customHp}
                onChange={(e) => setCustomHp(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value={50}>50 HP (Fast)</option>
                <option value={100}>100 HP (Standard)</option>
                <option value={150}>150 HP (Extended)</option>
                <option value={200}>200 HP (Endurance)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Time Limit per Turn</label>
              <select
                value={customTime}
                onChange={(e) => setCustomTime(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value={15}>15 Seconds (Panic)</option>
                <option value={30}>30 Seconds (Standard)</option>
                <option value={45}>45 Seconds (Relaxed)</option>
                <option value={60}>60 Seconds (Long)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Damage Multiplier</label>
              <select
                value={customDmgMult}
                onChange={(e) => setCustomDmgMult(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value={0.5}>0.5x (Subdued)</option>
                <option value={1.0}>1.0x (Standard)</option>
                <option value={1.5}>1.5x (Lethal)</option>
                <option value={2.0}>2.0x (Double Damage)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Rounds to Win</label>
              <select
                value={customRounds}
                onChange={(e) => setCustomRounds(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value={1}>1 Round (First Kill)</option>
                <option value={2}>2 Rounds</option>
                <option value={3}>3 Rounds</option>
                <option value={5}>5 Rounds</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Difficulty Selector */}
      <div className="p-4 mb-6 rounded-lg bg-[#0e1626]/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-pixel text-xs text-slate-200">CHALLENGE DIFFICULTY</div>
          <div className="text-[11px] font-mono text-slate-400">
            Governs sentence complexity and vocabulary length
          </div>
        </div>

        <div className="flex gap-2">
          {(['easy', 'medium', 'hard', 'tech'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => {
                soundEngine.playClick();
                setSelectedDifficulty(diff);
              }}
              className={`px-3 py-1.5 rounded font-pixel text-[10px] uppercase transition-all ${
                selectedDifficulty === diff
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-center">
        <button
          onClick={handleLaunch}
          className="flex items-center gap-3 px-10 py-4 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-pixel text-sm font-bold tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(0,255,102,0.4)] cursor-pointer active:scale-95"
        >
          <span>ENTER THE ARENA</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

