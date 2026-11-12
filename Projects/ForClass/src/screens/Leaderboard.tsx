import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Medal, Zap, Shield, Skull, Gamepad2, Award } from 'lucide-react';
import { PlayerProfile, LeaderboardSortBy } from '../types/profile';
import { getAllProfiles, sortLeaderboard } from '../database/profiles';
import { soundEngine } from '../game/audio/soundEngine';

interface LeaderboardProps {
  onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>('wins');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const list = await getAllProfiles();
    setProfiles(list);
    setLoading(false);
  };

  const categories = [
    { id: 'wins' as LeaderboardSortBy, label: 'MOST WINS', icon: <Trophy className="w-3.5 h-3.5" /> },
    { id: 'winRate' as LeaderboardSortBy, label: 'WIN RATE', icon: <Medal className="w-3.5 h-3.5" /> },
    { id: 'highestWpm' as LeaderboardSortBy, label: 'PEAK WPM', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'bestAccuracy' as LeaderboardSortBy, label: 'ACCURACY', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'totalKills' as LeaderboardSortBy, label: 'TOTAL KILLS', icon: <Skull className="w-3.5 h-3.5" /> },
    { id: 'totalGames' as LeaderboardSortBy, label: 'GAMES PLAYED', icon: <Gamepad2 className="w-3.5 h-3.5" /> }
  ];

  const sortedList = sortLeaderboard(profiles, sortBy);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <button
          onClick={() => {
            soundEngine.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-pixel text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> MAIN MENU
        </button>
        <div className="text-center">
          <h2 className="font-pixel text-lg sm:text-xl text-amber-400 tracking-wider flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> HALL OF FAME
          </h2>
          <p className="font-mono text-xs text-slate-400">LOCAL MARKSMAN RANKINGS</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((c) => {
          const isSelected = sortBy === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                soundEngine.playClick();
                setSortBy(c.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-pixel text-[10px] tracking-wide transition-all ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(255,183,3,0.4)]'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {c.icon}
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-lg bg-[#0e1626]/90 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-pixel text-[9px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-16">RANK</th>
                <th className="py-3.5 px-4">SNIPER</th>
                <th className="py-3.5 px-3 text-center">WINS</th>
                <th className="py-3.5 px-3 text-center">LOSSES</th>
                <th className="py-3.5 px-3 text-center">WIN RATE</th>
                <th className="py-3.5 px-3 text-center">PEAK WPM</th>
                <th className="py-3.5 px-3 text-center">AVG WPM</th>
                <th className="py-3.5 px-3 text-center">ACCURACY</th>
                <th className="py-3.5 px-4 text-center">KILLS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-cyan-400 font-pixel text-xs animate-pulse">
                    QUERYING LOCAL DATABASE...
                  </td>
                </tr>
              ) : sortedList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-mono text-sm">
                    No duel records logged yet. Enter the Arena and fight for glory!
                  </td>
                </tr>
              ) : (
                sortedList.map((p, idx) => {
                  const rank = idx + 1;
                  const isTop3 = rank <= 3;
                  const rankBadge =
                    rank === 1 ? '🥇 1ST' : rank === 2 ? '🥈 2ND' : rank === 3 ? '🥉 3RD' : `#${rank}`;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        rank === 1 ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-pixel text-[10px]">
                        <span
                          className={`${
                            rank === 1
                              ? 'text-amber-400 font-bold'
                              : rank === 2
                              ? 'text-slate-300 font-bold'
                              : rank === 3
                              ? 'text-amber-600 font-bold'
                              : 'text-slate-500'
                          }`}
                        >
                          {rankBadge}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl p-1 rounded bg-slate-900 border border-slate-800">
                            {p.avatar}
                          </span>
                          <div>
                            <span className="font-pixel text-xs text-white font-bold">{p.name}</span>
                            <div className="text-[10px] text-slate-500 font-mono">
                              Total matches: {p.totalGames}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center font-bold text-emerald-400">
                        {p.wins}
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-400">
                        {p.losses}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-cyan-400">
                        {p.winRate}%
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-amber-400">
                        {p.highestWpm}
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-300">
                        {p.averageWpm}
                      </td>
                      <td className="py-3.5 px-3 text-center text-purple-400">
                        {p.bestAccuracy}%
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-rose-400">
                        {p.totalKills}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
