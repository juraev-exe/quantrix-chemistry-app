import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Skull, Zap, Shield, AlertCircle, Clock, Trophy, Users, RefreshCw } from 'lucide-react';
import { PlayerProfile } from '../types/profile';
import { getAllProfiles } from '../database/profiles';
import { CHALLENGES, ChallengeItem } from '../data/challenges/challenges';
import { TypingEngine, EvaluatedChar } from '../game/typing/typingEngine';
import { soundEngine } from '../game/audio/soundEngine';
import { announcer } from '../game/audio/announcer';
import { AudienceCheerBar } from '../components/AudienceCheerBar';

interface BossRaidArenaProps {
  onBack: () => void;
}

export const BossRaidArena: React.FC<BossRaidArenaProps> = ({ onBack }) => {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  // Boss Configuration
  const [bossMaxHp, setBossMaxHp] = useState<number>(500);
  const [bossHp, setBossHp] = useState<number>(500);
  const [bossName, setBossName] = useState<string>('TITAN MEGABOT');
  const [isBossEnraged, setIsBossEnraged] = useState<boolean>(false);

  // Class Roster & Active Student Queue
  const [roster, setRoster] = useState<PlayerProfile[]>([]);
  const [currentStudentIdx, setCurrentStudentIdx] = useState<number>(0);
  const [totalClassDamage, setTotalClassDamage] = useState<number>(0);

  // Active Challenge
  const getRandomChallenge = (): ChallengeItem => {
    return CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
  };

  const [currentChallenge, setCurrentChallenge] = useState<ChallengeItem>(getRandomChallenge);
  const engine = useRef<TypingEngine>(new TypingEngine(currentChallenge.text)).current;

  // Typing UI state
  const [evaluatedChars, setEvaluatedChars] = useState<EvaluatedChar[]>([]);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [mistakes, setMistakes] = useState<number>(0);
  const [turnTimer, setTurnTimer] = useState<number>(25);
  const [isClassVictory, setIsClassVictory] = useState<boolean>(false);
  const [lastBlastDamage, setLastBlastDamage] = useState<number | null>(null);

  // Load roster
  useEffect(() => {
    getAllProfiles().then((list) => {
      if (list.length > 0) {
        setRoster(list);
      } else {
        // Fallback default students
        setRoster([
          { id: 's1', name: 'CADET_1', avatar: '🎯', characterId: 'cyber-commando', weaponId: 'anti-materiel', totalGames: 0, wins: 0, losses: 0, draws: 0, winRate: 0, totalKills: 0, highestWpm: 0, averageWpm: 0, bestAccuracy: 0, averageAccuracy: 0, totalCharsTyped: 0, favoriteGameMode: 'raid', createdAt: Date.now(), lastPlayedDate: Date.now() },
          { id: 's2', name: 'CADET_2', avatar: '⚡', characterId: 'neon-reaper', weaponId: 'plasma-carbine', totalGames: 0, wins: 0, losses: 0, draws: 0, winRate: 0, totalKills: 0, highestWpm: 0, averageWpm: 0, bestAccuracy: 0, averageAccuracy: 0, totalCharsTyped: 0, favoriteGameMode: 'raid', createdAt: Date.now(), lastPlayedDate: Date.now() }
        ]);
      }
    });
  }, []);

  const currentStudent = roster[currentStudentIdx % roster.length] || null;

  const focusInput = useCallback(() => {
    hiddenInputRef.current?.focus();
  }, []);

  const resetStudentTurn = useCallback((nextStudentIndex?: number) => {
    const nextChallenge = getRandomChallenge();
    setCurrentChallenge(nextChallenge);
    engine.reset(nextChallenge.text);
    setEvaluatedChars(engine.getEvaluatedChars());
    setWpm(0);
    setAccuracy(100);
    setMistakes(0);
    setTurnTimer(25);
    setLastBlastDamage(null);
    if (nextStudentIndex !== undefined) {
      setCurrentStudentIdx(nextStudentIndex);
    }
    setTimeout(focusInput, 50);
  }, [engine, focusInput]);

  useEffect(() => {
    resetStudentTurn();
  }, [resetStudentTurn]);

  // Turn timer
  useEffect(() => {
    if (isClassVictory) return;
    const interval = setInterval(() => {
      setTurnTimer((prev) => {
        if (prev <= 1) {
          // Time expired for this student, pass to next student
          soundEngine.playTypo();
          resetStudentTurn(currentStudentIdx + 1);
          return 25;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStudentIdx, isClassVictory, resetStudentTurn]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isClassVictory) return;
    if (e.ctrlKey || e.metaKey) return;

    const { changed, isError } = engine.handleKeyInput(e.key);
    if (changed) {
      if (isError) {
        soundEngine.playTypo();
      } else {
        soundEngine.playKeystroke(700);
      }

      setEvaluatedChars(engine.getEvaluatedChars());
      const state = engine.getState();
      setWpm(state.wpm);
      setAccuracy(state.accuracy);
      setMistakes(state.mistakes);

      // Check if student completed their typing salvo
      if (state.isCompleted) {
        executeArtilleryBlast(state.effectiveWpm);
      }
    }
  };

  const executeArtilleryBlast = (effectiveWpm: number) => {
    // Damage formula for Boss Raid:
    const damage = Math.max(15, Math.round(effectiveWpm * 0.75));
    soundEngine.playRifleShot(1.2);
    soundEngine.playBulletImpact();
    soundEngine.playCriticalHit();

    setLastBlastDamage(damage);
    setTotalClassDamage((prev) => prev + damage);

    const newHp = Math.max(0, bossHp - damage);
    setBossHp(newHp);

    if (newHp <= bossMaxHp * 0.4) {
      setIsBossEnraged(true);
    }

    if (currentStudent) {
      announcer.announceBossDamage(currentStudent.name, damage);
    }

    // Check Victory
    if (newHp <= 0) {
      setIsClassVictory(true);
      soundEngine.playVictory();
      announcer.announceBossDefeat();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });
    } else {
      // Pass baton to next student in roster
      setTimeout(() => {
        resetStudentTurn(currentStudentIdx + 1);
      }, 900);
    }
  };

  const restartRaid = () => {
    soundEngine.playClick();
    setBossHp(bossMaxHp);
    setIsBossEnraged(false);
    setIsClassVictory(false);
    setTotalClassDamage(0);
    setCurrentStudentIdx(0);
    resetStudentTurn(0);
  };

  return (
    <div
      onClick={focusInput}
      className="w-full max-w-5xl mx-auto px-4 py-6 min-h-[calc(100vh-64px)] flex flex-col justify-between"
    >
      <input
        ref={hiddenInputRef}
        type="text"
        className="opacity-0 absolute -top-96 left-0 pointer-events-none"
        onKeyDown={handleKeyDown}
        onPaste={(e) => e.preventDefault()}
        autoComplete="off"
        spellCheck="false"
      />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
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
            <h2 className="font-pixel text-lg sm:text-xl text-rose-500 tracking-wider flex items-center justify-center gap-2">
              <Skull className="w-5 h-5 text-rose-500" /> CLASSROOM BOSS RAID
            </h2>
            <p className="font-mono text-xs text-slate-400">COOPERATIVE CLASSROOM PVE ASSAULT</p>
          </div>

          <div className="text-right font-mono text-xs text-slate-400">
            <div>Class Salvos: <strong className="text-emerald-400">{totalClassDamage} DMG</strong></div>
          </div>
        </div>

        {/* BOSS HEALTH BAR & STATUS */}
        <div className="p-5 rounded-xl bg-gradient-to-b from-rose-950/60 to-slate-900 border-2 border-rose-500/70 shadow-[0_0_35px_rgba(255,42,85,0.3)] mb-6 text-center">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl animate-pulse">🤖</span>
              <span className="font-pixel text-sm sm:text-base text-rose-400 tracking-wider">
                {bossName} {isBossEnraged && <span className="text-amber-400 text-xs">[ENRAGED]</span>}
              </span>
            </div>

            <span className="font-pixel text-xs sm:text-sm text-white">
              {bossHp} / {bossMaxHp} HP
            </span>
          </div>

          {/* Health Bar */}
          <div className="w-full h-5 bg-slate-950 rounded-full border-2 border-rose-800 overflow-hidden relative shadow-inner">
            <div
              className={`h-full transition-all duration-300 ${
                isBossEnraged ? 'bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 animate-pulse' : 'bg-rose-500'
              }`}
              style={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
            />
          </div>

          {lastBlastDamage && (
            <div className="mt-2 font-pixel text-xs text-emerald-400 animate-bounce">
              💥 DIRECT HIT FOR -{lastBlastDamage} HP!
            </div>
          )}
        </div>

        {/* ACTIVE STUDENT FIRING POSITION */}
        {currentStudent && !isClassVictory && (
          <div className="p-5 rounded-lg bg-[#0e1626]/95 border-2 border-cyan-500/60 shadow-xl mb-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-1.5 rounded bg-cyan-950/80 border border-cyan-800">
                  {currentStudent.avatar}
                </span>
                <div>
                  <div className="font-pixel text-sm text-cyan-300 flex items-center gap-2">
                    <span>{currentStudent.name}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-[10px] text-cyan-400">
                      ON DECK
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Next in line: {roster[(currentStudentIdx + 1) % roster.length]?.name || 'Next Cadet'}
                  </div>
                </div>
              </div>

              {/* Turn Metrics */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1 text-cyan-400">
                  <Zap className="w-4 h-4" />
                  <span>WPM: <strong>{wpm}</strong></span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <Shield className="w-4 h-4" />
                  <span>ACC: <strong>{accuracy}%</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400 font-pixel text-xs bg-slate-900 px-3 py-1 rounded border border-slate-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{turnTimer}s</span>
                </div>
              </div>
            </div>

            {/* Prompt */}
            <div className="p-4 rounded bg-slate-950/90 border border-slate-800 font-mono text-base sm:text-xl tracking-wide leading-relaxed min-h-[90px] select-none">
              {evaluatedChars.map((item, idx) => {
                if (item.status === 'correct') {
                  return (
                    <span key={idx} className="text-emerald-400 bg-emerald-950/40 rounded px-[1px]">
                      {item.char}
                    </span>
                  );
                }
                if (item.status === 'incorrect') {
                  return (
                    <span key={idx} className="text-rose-500 bg-rose-950/60 underline decoration-rose-500 rounded px-[1px]">
                      {item.char}
                    </span>
                  );
                }
                if (item.status === 'cursor') {
                  return (
                    <span key={idx} className="text-cyan-300 font-bold border-b-2 border-cyan-400 bg-cyan-950/60 animate-pulse">
                      {item.expectedChar}
                    </span>
                  );
                }
                return (
                  <span key={idx} className="text-slate-500">
                    {item.expectedChar}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* CLASSROOM VICTORY BANNER */}
        {isClassVictory && (
          <div className="p-8 rounded-xl bg-gradient-to-b from-emerald-950/80 to-slate-900 border-4 border-emerald-400 text-center shadow-[0_0_50px_rgba(0,255,102,0.4)] my-6 animate-fadeIn">
            <div className="text-5xl mb-2">🏆</div>
            <h3 className="font-pixel text-2xl sm:text-4xl text-white mb-2">
              MEGABOT BOSS ANNIHILATED!
            </h3>
            <p className="font-mono text-sm text-emerald-300 max-w-lg mx-auto mb-6">
              The entire class worked as a cohesive unit! Total cumulative damage: <strong>{totalClassDamage} DMG</strong>. Outstanding teamwork!
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={restartRaid}
                className="flex items-center gap-2 px-6 py-3 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-pixel text-xs font-bold uppercase shadow-lg"
              >
                <RefreshCw className="w-4 h-4" /> RAID AGAIN (HIGHER HP)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Audience Cheers */}
      <AudienceCheerBar />
    </div>
  );
};

