import React, { useState, useEffect } from 'react';
import { ArrowLeft, BarChart2, TrendingUp, Award, Zap, Shield, Target, Flame } from 'lucide-react';
import { MatchRecord } from '../types/match';
import { PlayerProfile } from '../types/profile';
import { getAllMatches } from '../database/matches';
import { getAllProfiles } from '../database/profiles';
import { soundEngine } from '../game/audio/soundEngine';

interface StatisticsDashboardProps {
  onBack: () => void;
}

export const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({ onBack }) => {
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [mList, pList] = await Promise.all([getAllMatches(), getAllProfiles()]);
    setMatches(mList);
    setProfiles(pList);
    setLoading(false);
  };

  // Aggregated Stats
  const totalMatches = matches.length;
  const totalRoundsPlayed = matches.reduce((acc, m) => acc + m.totalRounds, 0);

  // Highest WPM
  const highestWpmOverall = profiles.length
    ? Math.max(...profiles.map((p) => p.highestWpm), 0)
    : 0;

  // Average WPM
  const avgWpmOverall = profiles.length
    ? Math.round(
        profiles.reduce((acc, p) => acc + p.averageWpm, 0) /
          Math.max(1, profiles.filter((p) => p.averageWpm > 0).length)
      )
    : 0;

  // Average Accuracy
  const avgAccuracyOverall = profiles.length
    ? Math.round(
        (profiles.reduce((acc, p) => acc + p.averageAccuracy, 0) /
          Math.max(1, profiles.filter((p) => p.averageAccuracy > 0).length)) *
          10
      ) / 10
    : 0;

  // Most Successful Player
  const topSniper = profiles.length
    ? [...profiles].sort((a, b) => b.wins - a.wins || b.winRate - a.winRate)[0]
    : null;

  // Recent Matches data points for SVG Chart (chronological order)
  const chartMatches = [...matches].reverse().slice(-10);

  // Max value for WPM chart scaling
  const chartMaxWpm = Math.max(100, ...chartMatches.map((m) => Math.max(m.player1.avgWpm, m.player2.avgWpm)));

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
          <h2 className="font-pixel text-lg sm:text-xl text-rose-400 tracking-wider flex items-center justify-center gap-2">
            <BarChart2 className="w-5 h-5 text-rose-400" /> BATTLE TELEMETRY
          </h2>
          <p className="font-mono text-xs text-slate-400">AGGREGATE SYSTEM STATISTICS</p>
        </div>
        <div className="w-16" />
      </div>

      {loading ? (
        <div className="py-16 text-center text-rose-400 font-pixel text-xs animate-pulse">
          COMPUTING BATTLE METRICS...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-[#0e1626]/90 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-[10px] text-slate-500">TOTAL MATCHES</div>
                <div className="font-pixel text-base text-cyan-400">{totalMatches}</div>
                <div className="text-[10px] font-mono text-slate-400">{totalRoundsPlayed} rounds</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0e1626]/90 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-[10px] text-slate-500">ALL-TIME BEST WPM</div>
                <div className="font-pixel text-base text-emerald-400">{highestWpmOverall}</div>
                <div className="text-[10px] font-mono text-slate-400">Avg: {avgWpmOverall} WPM</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0e1626]/90 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded bg-purple-950/60 border border-purple-800 text-purple-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-[10px] text-slate-500">GLOBAL ACCURACY</div>
                <div className="font-pixel text-base text-purple-400">{avgAccuracyOverall}%</div>
                <div className="text-[10px] font-mono text-slate-400">Target hit rate</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0e1626]/90 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded bg-amber-950/60 border border-amber-800 text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-[10px] text-slate-500">TOP MARKSMAN</div>
                <div className="font-pixel text-sm text-amber-400 truncate max-w-[100px]">
                  {topSniper?.name || 'NONE'}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {topSniper ? `${topSniper.wins} Wins (${topSniper.winRate}%)` : 'No data'}
                </div>
              </div>
            </div>
          </div>

          {/* PERFORMANCE GRAPHS SECTION */}
          <div className="p-6 rounded-lg bg-[#0e1626]/95 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h3 className="font-pixel text-xs sm:text-sm text-cyan-400">
                  SPEED & ACCURACY TELEMETRY (LAST 10 MATCHES)
                </h3>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> P1 WPM
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> P2 WPM
                </span>
              </div>
            </div>

            {chartMatches.length < 2 ? (
              <div className="py-16 text-center text-slate-500 font-mono text-xs">
                Need at least 2 completed matches to plot historical performance curves.
              </div>
            ) : (
              <div className="w-full">
                <div className="h-56 relative w-full flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    {[0.25, 0.5, 0.75, 1.0].map((ratio) => (
                      <line
                        key={ratio}
                        x1="0"
                        y1={200 - ratio * 180}
                        x2="500"
                        y2={200 - ratio * 180}
                        stroke="#1e293b"
                        strokeDasharray="4 4"
                      />
                    ))}

                    {/* P1 Line */}
                    <polyline
                      fill="none"
                      stroke="#00f0ff"
                      strokeWidth="2.5"
                      points={chartMatches
                        .map((m, idx) => {
                          const x = (idx / (chartMatches.length - 1)) * 500;
                          const y = 200 - (m.player1.avgWpm / chartMaxWpm) * 180;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />

                    {/* P1 Data Points */}
                    {chartMatches.map((m, idx) => {
                      const x = (idx / (chartMatches.length - 1)) * 500;
                      const y = 200 - (m.player1.avgWpm / chartMaxWpm) * 180;
                      return (
                        <circle
                          key={'p1-' + idx}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#00f0ff"
                          className="hover:r-6 cursor-pointer"
                        />
                      );
                    })}

                    {/* P2 Line */}
                    <polyline
                      fill="none"
                      stroke="#ffb703"
                      strokeWidth="2.5"
                      points={chartMatches
                        .map((m, idx) => {
                          const x = (idx / (chartMatches.length - 1)) * 500;
                          const y = 200 - (m.player2.avgWpm / chartMaxWpm) * 180;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />

                    {/* P2 Data Points */}
                    {chartMatches.map((m, idx) => {
                      const x = (idx / (chartMatches.length - 1)) * 500;
                      const y = 200 - (m.player2.avgWpm / chartMaxWpm) * 180;
                      return (
                        <circle
                          key={'p2-' + idx}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#ffb703"
                          className="hover:r-6 cursor-pointer"
                        />
                      );
                    })}
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2 border-t border-slate-800 pt-1">
                  <span>Oldest ({new Date(chartMatches[0].timestamp).toLocaleTimeString()})</span>
                  <span>Match Progression</span>
                  <span>Latest ({new Date(chartMatches[chartMatches.length - 1].timestamp).toLocaleTimeString()})</span>
                </div>
              </div>
            )}
          </div>

          {/* ACCURACY BREAKDOWN BARS */}
          <div className="p-6 rounded-lg bg-[#0e1626]/90 border border-slate-800">
            <h3 className="font-pixel text-xs text-purple-400 mb-4">
              REGISTERED OPERATIVES WIN/LOSS RATIOS
            </h3>
            <div className="space-y-3 font-mono text-xs">
              {profiles.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                    <span>{p.avatar} {p.name} ({p.totalGames} Games)</span>
                    <span className="text-emerald-400 font-bold">{p.winRate}% Win Rate</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${p.winRate}%` }}
                    />
                    <div
                      className="bg-rose-600 h-full"
                      style={{ width: `${100 - p.winRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
