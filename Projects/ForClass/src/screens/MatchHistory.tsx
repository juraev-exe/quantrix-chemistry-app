import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Eye, X, Trophy, Clock, Zap, Shield, Swords } from 'lucide-react';
import { MatchRecord } from '../types/match';
import { getAllMatches, clearMatchHistory } from '../database/matches';
import { soundEngine } from '../game/audio/soundEngine';

interface MatchHistoryProps {
  onBack: () => void;
}

export const MatchHistory: React.FC<MatchHistoryProps> = ({ onBack }) => {
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMatch, setSelectedMatch] = useState<MatchRecord | null>(null);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    const list = await getAllMatches();
    setMatches(list);
    setLoading(false);
  };

  const handleClear = async () => {
    soundEngine.playClick();
    if (confirm('Clear all logged match combat records? Profiles will not be reset.')) {
      await clearMatchHistory();
      await loadMatches();
    }
  };

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
          <h2 className="font-pixel text-lg sm:text-xl text-blue-400 tracking-wider">
            ENGAGEMENT ARCHIVES
          </h2>
          <p className="font-mono text-xs text-slate-400">HISTORICAL DUEL RECORDS</p>
        </div>
        {matches.length > 0 ? (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 font-pixel text-[10px]"
          >
            <Trash2 className="w-3.5 h-3.5" /> CLEAR
          </button>
        ) : (
          <div className="w-16" />
        )}
      </div>

      {loading ? (
        <div className="py-16 text-center text-blue-400 font-pixel text-xs animate-pulse">
          FETCHING COMBAT LOGS...
        </div>
      ) : matches.length === 0 ? (
        <div className="p-12 text-center text-slate-500 font-mono text-sm bg-slate-900/60 rounded-lg border border-slate-800">
          No combat history recorded yet. Complete an arena match to log your combat debrief!
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((m) => {
            const isP1Win = m.winnerId === m.player1.id;
            const isP2Win = m.winnerId === m.player2.id;
            const isDraw = m.winnerId === 'draw';

            return (
              <div
                key={m.id}
                className="p-4 rounded-lg bg-[#0e1626]/90 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs shadow-md"
              >
                {/* Match Summary */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-center min-w-[70px]">
                    <div className="font-pixel text-[9px] text-cyan-400 uppercase">{m.gameMode}</div>
                    <div className="text-[10px] text-slate-500">{m.totalRounds} RND</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-pixel text-xs ${isP1Win ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                        {m.player1.name} ({m.player1.roundsWon})
                      </span>
                      <span className="text-slate-600 font-bold">VS</span>
                      <span className={`font-pixel text-xs ${isP2Win ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                        {m.player2.name} ({m.player2.roundsWon})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Winner: <strong className="text-amber-400">{m.winnerName}</strong></span>
                      <span>•</span>
                      <span>Duration: {m.matchDurationSec}s</span>
                      <span>•</span>
                      <span>{new Date(m.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Performance overview & view button */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right text-[11px] text-slate-400 hidden md:block">
                    <div>P1: {m.player1.avgWpm} WPM ({m.player1.avgAccuracy}%)</div>
                    <div>P2: {m.player2.avgWpm} WPM ({m.player2.avgAccuracy}%)</div>
                  </div>

                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedMatch(m);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500 font-pixel text-[10px] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> DETAILS
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MATCH DETAILS MODAL */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0f172a] border-2 border-blue-500/50 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_35px_rgba(59,130,246,0.3)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="font-pixel text-base text-blue-400 tracking-wide">
                  COMBAT ENGAGEMENT DEBRIEF
                </h3>
                <p className="font-mono text-xs text-slate-400">
                  MATCH ID: {selectedMatch.id} • {new Date(selectedMatch.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Match Header Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 font-mono text-xs">
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <div className="font-pixel text-xs text-cyan-400 mb-1">{selectedMatch.player1.name}</div>
                <div className="text-slate-300">Final Health: {selectedMatch.player1.finalHp} HP</div>
                <div className="text-slate-300">Rounds Won: {selectedMatch.player1.roundsWon}</div>
                <div className="text-slate-300">Average WPM: {selectedMatch.player1.avgWpm} WPM</div>
                <div className="text-slate-300">Accuracy: {selectedMatch.player1.avgAccuracy}%</div>
              </div>

              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <div className="font-pixel text-xs text-amber-400 mb-1">{selectedMatch.player2.name}</div>
                <div className="text-slate-300">Final Health: {selectedMatch.player2.finalHp} HP</div>
                <div className="text-slate-300">Rounds Won: {selectedMatch.player2.roundsWon}</div>
                <div className="text-slate-300">Average WPM: {selectedMatch.player2.avgWpm} WPM</div>
                <div className="text-slate-300">Accuracy: {selectedMatch.player2.avgAccuracy}%</div>
              </div>
            </div>

            {/* Round by Round Logs */}
            <h4 className="font-pixel text-xs text-slate-300 mb-3">ROUND-BY-ROUND BREAKDOWN</h4>
            <div className="space-y-3 font-mono text-xs max-h-[300px] overflow-y-auto">
              {selectedMatch.rounds.map((r, i) => (
                <div key={i} className="p-3 rounded bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-center mb-1 text-slate-400 text-[11px]">
                    <span className="font-pixel text-[10px] text-emerald-400">ROUND {r.roundNumber}</span>
                    <span>Damage Dealt: <strong className="text-rose-400">-{r.damageDealt} HP</strong></span>
                  </div>
                  <p className="text-slate-200 mb-2">{r.summary}</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                    <div>P1: {r.p1Result.wpm} WPM | {r.p1Result.accuracy}% ACC ({r.p1Result.effectiveWpm} Eff)</div>
                    <div>P2: {r.p2Result.wpm} WPM | {r.p2Result.accuracy}% ACC ({r.p2Result.effectiveWpm} Eff)</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedMatch(null)}
                className="px-6 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white font-pixel text-xs"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
