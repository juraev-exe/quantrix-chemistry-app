import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Swords, Shuffle, Award, CheckCircle, RefreshCw, Printer } from 'lucide-react';
import { PlayerProfile } from '../types/profile';
import { getAllProfiles } from '../database/profiles';
import { soundEngine } from '../game/audio/soundEngine';
import { StudentCertificateModal } from '../components/StudentCertificateModal';

export interface BracketMatch {
  id: string;
  round: 'quarters' | 'semis' | 'final';
  p1: PlayerProfile | null;
  p2: PlayerProfile | null;
  winner: PlayerProfile | null;
  completed: boolean;
}

interface TournamentBracketProps {
  onBack: () => void;
  onLaunchDuel: (p1: PlayerProfile, p2: PlayerProfile, onFinished: (winner: PlayerProfile) => void) => void;
}

export const TournamentBracket: React.FC<TournamentBracketProps> = ({
  onBack,
  onLaunchDuel
}) => {
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [certificateStudent, setCertificateStudent] = useState<PlayerProfile | null>(null);

  // 8-Player Bracket State
  const [matches, setMatches] = useState<BracketMatch[]>([
    // Quarterfinals
    { id: 'q1', round: 'quarters', p1: null, p2: null, winner: null, completed: false },
    { id: 'q2', round: 'quarters', p1: null, p2: null, winner: null, completed: false },
    { id: 'q3', round: 'quarters', p1: null, p2: null, winner: null, completed: false },
    { id: 'q4', round: 'quarters', p1: null, p2: null, winner: null, completed: false },
    // Semifinals
    { id: 's1', round: 'semis', p1: null, p2: null, winner: null, completed: false },
    { id: 's2', round: 'semis', p1: null, p2: null, winner: null, completed: false },
    // Grand Final
    { id: 'f1', round: 'final', p1: null, p2: null, winner: null, completed: false }
  ]);

  useEffect(() => {
    getAllProfiles().then((list) => {
      setProfiles(list);
      // Auto populate if bracket is empty and profiles exist
      autoFillBracket(list);
    });
  }, []);

  const autoFillBracket = (list: PlayerProfile[]) => {
    if (list.length < 2) return;
    const shuffled = [...list].sort(() => Math.random() - 0.5);

    const getP = (idx: number) => shuffled[idx % shuffled.length];

    setMatches([
      { id: 'q1', round: 'quarters', p1: getP(0), p2: getP(1), winner: null, completed: false },
      { id: 'q2', round: 'quarters', p1: getP(2), p2: getP(3), winner: null, completed: false },
      { id: 'q3', round: 'quarters', p1: getP(4), p2: getP(5), winner: null, completed: false },
      { id: 'q4', round: 'quarters', p1: getP(6), p2: getP(7), winner: null, completed: false },
      { id: 's1', round: 'semis', p1: null, p2: null, winner: null, completed: false },
      { id: 's2', round: 'semis', p1: null, p2: null, winner: null, completed: false },
      { id: 'f1', round: 'final', p1: null, p2: null, winner: null, completed: false }
    ]);
  };

  const handleStartMatch = (match: BracketMatch) => {
    if (!match.p1 || !match.p2 || match.completed) return;
    soundEngine.playClick();

    onLaunchDuel(match.p1, match.p2, (winner) => {
      // Record match outcome and advance winner
      setMatches((prev) => {
        const next = [...prev];
        const currentIdx = next.findIndex((m) => m.id === match.id);
        if (currentIdx !== -1) {
          next[currentIdx].winner = winner;
          next[currentIdx].completed = true;

          // Advance into Semifinals
          if (match.id === 'q1') next[4].p1 = winner;
          if (match.id === 'q2') next[4].p2 = winner;
          if (match.id === 'q3') next[5].p1 = winner;
          if (match.id === 'q4') next[5].p2 = winner;

          // Advance into Final
          if (match.id === 's1') next[6].p1 = winner;
          if (match.id === 's2') next[6].p2 = winner;
        }
        return next;
      });
    });
  };

  const grandFinal = matches.find((m) => m.id === 'f1');
  const champion = grandFinal?.winner || null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
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
          <h2 className="font-pixel text-lg sm:text-2xl text-amber-400 tracking-wider flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" /> CLASSROOM TOURNAMENT BRACKET
          </h2>
          <p className="font-mono text-xs text-slate-400">8-STUDENT SINGLE ELIMINATION CHAMPIONSHIP</p>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            autoFillBracket(profiles);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-pixel text-[10px]"
        >
          <Shuffle className="w-3.5 h-3.5" /> RE-SHUFFLE ROSTER
        </button>
      </div>

      {/* CHAMPION BANNER */}
      {champion && (
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-2 border-amber-400 text-center shadow-[0_0_35px_rgba(255,183,3,0.4)] animate-fadeIn">
          <div className="text-4xl mb-2">👑</div>
          <h3 className="font-pixel text-2xl sm:text-3xl text-amber-300 font-bold mb-1">
            {champion.name} IS THE CLASSROOM CHAMPION!
          </h3>
          <p className="font-mono text-xs text-slate-300 mb-4">
            Survived every elimination match to claim the Grand Tournament Trophy.
          </p>
          <button
            onClick={() => {
              soundEngine.playClick();
              setCertificateStudent(champion);
            }}
            className="flex items-center gap-2 px-6 py-2.5 mx-auto rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-xs font-bold uppercase transition-all shadow-lg"
          >
            <Printer className="w-4 h-4" /> PRINT CHAMPION CERTIFICATE
          </button>
        </div>
      )}

      {/* TOURNAMENT BRACKET TREE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative font-mono text-xs">
        {/* ROUND 1: QUARTERFINALS */}
        <div className="space-y-4">
          <div className="font-pixel text-xs text-cyan-400 text-center pb-2 border-b border-cyan-800">
            QUARTERFINALS
          </div>

          {matches.slice(0, 4).map((m, idx) => (
            <div
              key={m.id}
              className={`p-3.5 rounded-lg border-2 transition-all ${
                m.completed
                  ? 'bg-slate-950 border-slate-800 opacity-80'
                  : 'bg-[#0e1626] border-cyan-500/50 shadow-md'
              }`}
            >
              <div className="text-[10px] font-pixel text-slate-500 mb-2 flex justify-between">
                <span>MATCH {idx + 1}</span>
                {m.completed && <span className="text-emerald-400">COMPLETED</span>}
              </div>

              {/* Player 1 */}
              <div className={`p-2 rounded mb-1.5 flex items-center justify-between ${
                m.winner?.id === m.p1?.id ? 'bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-600' : 'bg-slate-900 text-slate-300'
              }`}>
                <span>{m.p1 ? `${m.p1.avatar} ${m.p1.name}` : 'TBD'}</span>
                {m.winner?.id === m.p1?.id && <span>🏆</span>}
              </div>

              {/* Player 2 */}
              <div className={`p-2 rounded mb-2.5 flex items-center justify-between ${
                m.winner?.id === m.p2?.id ? 'bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-600' : 'bg-slate-900 text-slate-300'
              }`}>
                <span>{m.p2 ? `${m.p2.avatar} ${m.p2.name}` : 'TBD'}</span>
                {m.winner?.id === m.p2?.id && <span>🏆</span>}
              </div>

              {!m.completed && m.p1 && m.p2 && (
                <button
                  onClick={() => handleStartMatch(m)}
                  className="w-full py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-pixel text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Swords className="w-3.5 h-3.5" /> DUEL MATCH
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ROUND 2: SEMIFINALS */}
        <div className="space-y-12 flex flex-col justify-center">
          <div className="font-pixel text-xs text-purple-400 text-center pb-2 border-b border-purple-800">
            SEMIFINALS
          </div>

          {matches.slice(4, 6).map((m, idx) => (
            <div
              key={m.id}
              className={`p-3.5 rounded-lg border-2 transition-all ${
                m.completed
                  ? 'bg-slate-950 border-slate-800 opacity-80'
                  : 'bg-[#0e1626] border-purple-500/50 shadow-md'
              }`}
            >
              <div className="text-[10px] font-pixel text-slate-500 mb-2 flex justify-between">
                <span>SEMI {idx + 1}</span>
                {m.completed && <span className="text-emerald-400">COMPLETED</span>}
              </div>

              {/* Player 1 */}
              <div className={`p-2 rounded mb-1.5 flex items-center justify-between ${
                m.winner?.id === m.p1?.id ? 'bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-600' : 'bg-slate-900 text-slate-300'
              }`}>
                <span>{m.p1 ? `${m.p1.avatar} ${m.p1.name}` : 'Awaiting Quarterfinal'}</span>
                {m.winner?.id === m.p1?.id && <span>🏆</span>}
              </div>

              {/* Player 2 */}
              <div className={`p-2 rounded mb-2.5 flex items-center justify-between ${
                m.winner?.id === m.p2?.id ? 'bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-600' : 'bg-slate-900 text-slate-300'
              }`}>
                <span>{m.p2 ? `${m.p2.avatar} ${m.p2.name}` : 'Awaiting Quarterfinal'}</span>
                {m.winner?.id === m.p2?.id && <span>🏆</span>}
              </div>

              {!m.completed && m.p1 && m.p2 && (
                <button
                  onClick={() => handleStartMatch(m)}
                  className="w-full py-1.5 rounded bg-purple-500 hover:bg-purple-400 text-white font-pixel text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Swords className="w-3.5 h-3.5" /> DUEL SEMIFINAL
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ROUND 3: GRAND FINAL */}
        <div className="flex flex-col justify-center">
          <div className="font-pixel text-xs text-amber-400 text-center pb-2 border-b border-amber-800 mb-8">
            GRAND FINAL
          </div>

          {grandFinal && (
            <div className={`p-5 rounded-xl border-4 transition-all ${
              grandFinal.completed
                ? 'bg-amber-950/30 border-amber-400'
                : 'bg-[#0e1626] border-amber-500 shadow-[0_0_25px_rgba(255,183,3,0.3)]'
            }`}>
              <div className="text-center font-pixel text-xs text-amber-400 mb-3 flex items-center justify-center gap-1.5">
                <Trophy className="w-4 h-4" /> CHAMPIONSHIP MATCH
              </div>

              {/* Finalist 1 */}
              <div className={`p-3 rounded mb-2 flex items-center justify-between ${
                grandFinal.winner?.id === grandFinal.p1?.id ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-400' : 'bg-slate-900 text-slate-300'
              }`}>
                <span>{grandFinal.p1 ? `${grandFinal.p1.avatar} ${grandFinal.p1.name}` : 'Awaiting Semi 1'}</span>
                {grandFinal.winner?.id === grandFinal.p1?.id && <span className="text-xl">👑</span>}
              </div>

              {/* Finalist 2 */}
              <div className={`p-3 rounded mb-4 flex items-center justify-between ${
                grandFinal.winner?.id === grandFinal.p2?.id ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-400' : 'bg-slate-900 text-slate-300'
              }`}>
                <span>{grandFinal.p2 ? `${grandFinal.p2.avatar} ${grandFinal.p2.name}` : 'Awaiting Semi 2'}</span>
                {grandFinal.winner?.id === grandFinal.p2?.id && <span className="text-xl">👑</span>}
              </div>

              {!grandFinal.completed && grandFinal.p1 && grandFinal.p2 && (
                <button
                  onClick={() => handleStartMatch(grandFinal)}
                  className="w-full py-2.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,183,3,0.5)]"
                >
                  <Swords className="w-4 h-4" /> BATTLE FOR THE TROPHY
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      <StudentCertificateModal
        student={certificateStudent}
        isOpen={!!certificateStudent}
        onClose={() => setCertificateStudent(null)}
      />
    </div>
  );
};

