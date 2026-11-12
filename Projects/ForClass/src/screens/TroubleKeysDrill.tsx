import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Target, RefreshCw, CheckCircle2, AlertTriangle, Zap, Shield } from 'lucide-react';
import { TypingEngine, EvaluatedChar } from '../game/typing/typingEngine';
import { soundEngine } from '../game/audio/soundEngine';

interface TroubleKeysDrillProps {
  onBack: () => void;
}

export const TroubleKeysDrill: React.FC<TroubleKeysDrillProps> = ({ onBack }) => {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  // Keyboard Rows
  const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  // Key error statistics
  const [keyErrors, setKeyErrors] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('type_or_die_trouble_keys');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    // Initial sample trouble keys for demonstration
    return { B: 4, P: 5, Q: 3, Z: 6, X: 3, V: 2 };
  });

  // Targeted Sentences Generator
  const generateDrillSentence = (troubleLetters: string[]): string => {
    const letters = troubleLetters.length > 0 ? troubleLetters : ['P', 'B', 'Q', 'Z'];
    const drills = [
      'quick brown foxes jump over lazy dogs with vibrant buzz',
      'brave zebras quickly bypass perplexing obstacles with poise',
      'sharp precision prevents quiet marksmen from blazing blanks',
      'swift blitz requires peak balance and unwavering patience',
      'zealous pupils question obscure puzzle problems with zest'
    ];
    return drills[Math.floor(Math.random() * drills.length)];
  };

  const [currentPrompt, setCurrentPrompt] = useState<string>(() => generateDrillSentence(Object.keys(keyErrors)));
  const engine = useRef<TypingEngine>(new TypingEngine(currentPrompt)).current;

  const [evaluatedChars, setEvaluatedChars] = useState<EvaluatedChar[]>([]);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [mistakes, setMistakes] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const focusInput = useCallback(() => {
    hiddenInputRef.current?.focus();
  }, []);

  const resetDrill = (customText?: string) => {
    const target = customText || generateDrillSentence(Object.keys(keyErrors));
    setCurrentPrompt(target);
    engine.reset(target);
    setEvaluatedChars(engine.getEvaluatedChars());
    setWpm(0);
    setAccuracy(100);
    setMistakes(0);
    setIsCompleted(false);
    setTimeout(focusInput, 50);
  };

  useEffect(() => {
    resetDrill();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isCompleted || e.ctrlKey || e.metaKey) return;

    const { changed, isError } = engine.handleKeyInput(e.key);
    if (changed) {
      if (isError) {
        soundEngine.playTypo();
        // Record typo key in trouble keys tracker
        const upper = e.key.toUpperCase();
        if (/^[A-Z]$/.test(upper)) {
          setKeyErrors(prev => {
            const next = { ...prev, [upper]: (prev[upper] || 0) + 1 };
            try {
              localStorage.setItem('type_or_die_trouble_keys', JSON.stringify(next));
            } catch (e) {}
            return next;
          });
        }
      } else {
        soundEngine.playKeystroke(650);
      }

      setEvaluatedChars(engine.getEvaluatedChars());
      const state = engine.getState();
      setWpm(state.wpm);
      setAccuracy(state.accuracy);
      setMistakes(state.mistakes);

      if (state.isCompleted) {
        setIsCompleted(true);
        soundEngine.playVictory();
      }
    }
  };

  const getKeyColor = (key: string) => {
    const count = keyErrors[key] || 0;
    if (count >= 5) return 'bg-rose-950/80 border-rose-500 text-rose-400 font-bold';
    if (count >= 2) return 'bg-amber-950/60 border-amber-500 text-amber-300';
    return 'bg-slate-900 border-slate-700 text-slate-300';
  };

  const topTroubleKeys = Object.entries(keyErrors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

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
            <h2 className="font-pixel text-lg sm:text-xl text-amber-400 tracking-wider flex items-center justify-center gap-2">
              <Target className="w-5 h-5 text-amber-400" /> KEYBOARD DIAGNOSTIC & TROUBLE KEYS
            </h2>
            <p className="font-mono text-xs text-slate-400">VISUAL HEATMAP & TARGETED TECHNIQUE DRILLS</p>
          </div>
          <div className="w-16" />
        </div>

        {/* VISUAL KEYBOARD HEATMAP */}
        <div className="mb-6 p-5 rounded-xl bg-[#0e1626]/90 border border-slate-800 text-center shadow-lg">
          <div className="font-pixel text-xs text-slate-300 mb-4 flex items-center justify-center gap-4">
            <span>KEYBOARD ACCURACY HEATMAP:</span>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700" /> Normal
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Moderate Typos
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2.5 h-2.5 rounded bg-rose-500" /> High Error Key
              </span>
            </div>
          </div>

          <div className="inline-flex flex-col gap-2 p-3 rounded-lg bg-slate-950 border border-slate-850">
            {KEYBOARD_ROWS.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1.5">
                {row.map((k) => (
                  <div
                    key={k}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded border flex items-center justify-center font-pixel text-xs shadow transition-all ${getKeyColor(k)}`}
                  >
                    {k}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {topTroubleKeys.length > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
              <span>Identified Weak Keys:</span>
              {topTroubleKeys.map(([k, errs]) => (
                <span key={k} className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-600 text-rose-300 font-bold">
                  {k} ({errs} typos)
                </span>
              ))}
            </div>
          )}
        </div>

        {/* TARGETED DRILL SECTION */}
        <div className="p-6 rounded-lg bg-[#0e1626]/95 border-2 border-amber-500/50 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <span className="font-pixel text-xs text-amber-400">
              TARGETED DRILL FOR WEAK KEYS
            </span>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1 text-cyan-400">
                <Zap className="w-4 h-4" />
                <span>WPM: <strong>{wpm}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <Shield className="w-4 h-4" />
                <span>ACC: <strong>{accuracy}%</strong></span>
              </div>
              <div className="flex items-center gap-1 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <span>ERRORS: <strong>{mistakes}</strong></span>
              </div>
            </div>
          </div>

          {/* Typing Prompt Box */}
          <div className="p-4 rounded bg-slate-950/90 border border-slate-800 font-mono text-base sm:text-xl tracking-wide leading-relaxed min-h-[90px] select-none mb-4">
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
                  <span key={idx} className="text-amber-300 font-bold border-b-2 border-amber-400 bg-amber-950/60 animate-pulse">
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

          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-500">Click anywhere to focus keyboard.</span>
            <button
              onClick={() => {
                soundEngine.playClick();
                resetDrill();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-pixel text-[10px]"
            >
              <RefreshCw className="w-3.5 h-3.5" /> RE-ROLL DRILL
            </button>
          </div>
        </div>

        {isCompleted && (
          <div className="mt-4 p-4 rounded bg-emerald-950/40 border border-emerald-500/60 text-center animate-fadeIn font-mono text-xs">
            <span className="text-emerald-400 font-bold font-pixel text-xs block mb-1">
              DRILL ACCOMPLISHED!
            </span>
            <span className="text-slate-300">
              Weak key muscle memory reinforced. Ready for the next drill!
            </span>
          </div>
        )}
      </div>

      <div className="text-center text-[11px] font-mono text-slate-500 mt-6">
        Typing diagnostics update automatically as students make typos in all game modes.
      </div>
    </div>
  );
};

