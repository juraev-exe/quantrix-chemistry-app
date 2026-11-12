import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, RefreshCw, Zap, Shield, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Difficulty } from '../types/game';
import { CHALLENGES, ChallengeItem } from '../data/challenges/challenges';
import { TypingEngine, EvaluatedChar } from '../game/typing/typingEngine';
import { soundEngine } from '../game/audio/soundEngine';

interface PracticeArenaProps {
  onBack: () => void;
}

export const PracticeArena: React.FC<PracticeArenaProps> = ({ onBack }) => {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const getRandomChallenge = useCallback((diff: Difficulty): ChallengeItem => {
    const list = CHALLENGES.filter((c) => c.difficulty === diff);
    return list[Math.floor(Math.random() * list.length)] || CHALLENGES[0];
  }, []);

  const [currentChallenge, setCurrentChallenge] = useState<ChallengeItem>(() =>
    getRandomChallenge('medium')
  );

  const engine = useRef<TypingEngine>(new TypingEngine(currentChallenge.text)).current;

  const [evaluatedChars, setEvaluatedChars] = useState<EvaluatedChar[]>([]);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [mistakes, setMistakes] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [bestWpm, setBestWpm] = useState<number>(0);

  const focusInput = useCallback(() => {
    hiddenInputRef.current?.focus();
  }, []);

  const resetDrill = useCallback((item?: ChallengeItem) => {
    const target = item || getRandomChallenge(difficulty);
    setCurrentChallenge(target);
    engine.reset(target.text);
    setEvaluatedChars(engine.getEvaluatedChars());
    setWpm(0);
    setAccuracy(100);
    setMistakes(0);
    setIsFinished(false);
    setTimeout(focusInput, 50);
  }, [difficulty, engine, focusInput, getRandomChallenge]);

  useEffect(() => {
    resetDrill();
  }, [difficulty, resetDrill]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;
    if (e.ctrlKey || e.metaKey) return;

    const { changed, isError } = engine.handleKeyInput(e.key);
    if (changed) {
      if (isError) {
        soundEngine.playTypo();
      } else {
        soundEngine.playKeystroke(600);
      }

      setEvaluatedChars(engine.getEvaluatedChars());
      const state = engine.getState();
      setWpm(state.wpm);
      setAccuracy(state.accuracy);
      setMistakes(state.mistakes);

      if (state.isCompleted) {
        setIsFinished(true);
        soundEngine.playVictory();
        if (state.wpm > bestWpm) {
          setBestWpm(state.wpm);
        }
      }
    }
  };

  return (
    <div
      onClick={focusInput}
      className="w-full max-w-4xl mx-auto px-4 py-8 min-h-[calc(100vh-64px)] flex flex-col justify-between"
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
            <h2 className="font-pixel text-lg sm:text-xl text-cyan-400 tracking-wider">
              PRACTICE FIRING RANGE
            </h2>
            <p className="font-mono text-xs text-slate-400">SOLO REACTION & SPEED DRILLS</p>
          </div>
          <div className="w-16" />
        </div>

        {/* Difficulty Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 rounded-lg bg-[#0e1626]/80 border border-slate-800">
          <span className="font-pixel text-xs text-slate-300">DIFFICULTY LEVEL:</span>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard', 'tech'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  soundEngine.playClick();
                  setDifficulty(diff);
                }}
                className={`px-3 py-1 rounded font-pixel text-[10px] uppercase transition-all ${
                  difficulty === diff
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono text-xs">
          <div className="p-3 rounded bg-slate-900 border border-slate-800 flex items-center gap-2 text-cyan-400">
            <Zap className="w-5 h-5" />
            <div>
              <div className="text-[10px] text-slate-500">SPEED</div>
              <div className="font-pixel text-sm">{wpm} WPM</div>
            </div>
          </div>

          <div className="p-3 rounded bg-slate-900 border border-slate-800 flex items-center gap-2 text-emerald-400">
            <Shield className="w-5 h-5" />
            <div>
              <div className="text-[10px] text-slate-500">ACCURACY</div>
              <div className="font-pixel text-sm">{accuracy}%</div>
            </div>
          </div>

          <div className="p-3 rounded bg-slate-900 border border-slate-800 flex items-center gap-2 text-rose-400">
            <AlertCircle className="w-5 h-5" />
            <div>
              <div className="text-[10px] text-slate-500">MISTAKES</div>
              <div className="font-pixel text-sm">{mistakes}</div>
            </div>
          </div>

          <div className="p-3 rounded bg-slate-900 border border-slate-800 flex items-center gap-2 text-purple-400">
            <CheckCircle2 className="w-5 h-5" />
            <div>
              <div className="text-[10px] text-slate-500">BEST SESSION</div>
              <div className="font-pixel text-sm">{bestWpm} WPM</div>
            </div>
          </div>
        </div>

        {/* Typing Box */}
        <div className="p-6 rounded-lg bg-[#0e1626]/95 border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(0,240,255,0.15)]">
          <div className="p-4 rounded bg-slate-950/90 border border-slate-800 font-mono text-lg sm:text-xl tracking-wide leading-relaxed min-h-[110px] select-none">
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

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <span>Click anywhere to focus keyboard. Type accurately to complete drill.</span>
            <button
              onClick={() => {
                soundEngine.playClick();
                resetDrill();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-pixel text-[10px]"
            >
              <RefreshCw className="w-3.5 h-3.5" /> RE-ROLL TARGET
            </button>
          </div>
        </div>

        {/* Drill Completion Banner */}
        {isFinished && (
          <div className="mt-6 p-6 rounded-lg bg-emerald-950/40 border border-emerald-500/60 text-center animate-fadeIn">
            <h3 className="font-pixel text-sm text-emerald-400 mb-1">
              TARGET NEUTRALIZED! DRILL COMPLETE.
            </h3>
            <p className="font-mono text-xs text-slate-300 mb-4">
              Final Speed: <strong className="text-emerald-300">{wpm} WPM</strong> | Accuracy: <strong className="text-cyan-300">{accuracy}%</strong> | Mistakes: <strong className="text-rose-300">{mistakes}</strong>
            </p>
            <button
              onClick={() => {
                soundEngine.playClick();
                resetDrill();
              }}
              className="px-6 py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-pixel text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(0,255,102,0.4)]"
            >
              NEXT TARGET
            </button>
          </div>
        )}
      </div>

      <div className="text-center text-[11px] font-mono text-slate-500 mt-6">
        Practice Mode records session highs but does not affect competitive rankings.
      </div>
    </div>
  );
};

