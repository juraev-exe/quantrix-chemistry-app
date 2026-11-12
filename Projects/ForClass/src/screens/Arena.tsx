import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, Trophy, Zap, Shield, AlertCircle, Clock, CheckCircle, Crown, Users } from 'lucide-react';
import { PlayerProfile } from '../types/profile';
import { GameMode, Difficulty, CustomGameConfig, ArenaPhase, PlayerTurnResult, RoundResult } from '../types/game';
import { MatchRecord } from '../types/match';
import { CHARACTERS } from '../data/characters/characters';
import { WEAPONS } from '../data/weapons/weapons';
import { getBalancedChallengePair, ChallengeItem } from '../data/challenges/challenges';
import { CanvasArena, CanvasArenaRef } from '../game/canvas/CanvasArena';
import { TypingEngine, EvaluatedChar } from '../game/typing/typingEngine';
import { CombatEngine } from '../game/combat/combatEngine';
import { soundEngine } from '../game/audio/soundEngine';
import { announcer } from '../game/audio/announcer';
import { AudienceCheerBar } from '../components/AudienceCheerBar';
import { StudentCertificateModal } from '../components/StudentCertificateModal';
import { saveMatch } from '../database/matches';
import { updateProfilesAfterMatch, getAllProfiles } from '../database/profiles';
import { GameSettings } from '../types/settings';

interface ArenaProps {
  p1: PlayerProfile;
  p2: PlayerProfile;
  gameMode: GameMode;
  difficulty: Difficulty;
  customConfig?: CustomGameConfig;
  settings: GameSettings;
  onExitToMenu: () => void;
  onRematch: () => void;
  onNextChallenger?: (winner: PlayerProfile, nextPlayer: PlayerProfile) => void;
  onMatchFinished?: (winner: PlayerProfile | 'draw') => void;
  returnScreenName?: string;
}

export const Arena: React.FC<ArenaProps> = ({
  p1,
  p2,
  gameMode,
  difficulty,
  customConfig,
  settings,
  onExitToMenu,
  onRematch,
  onNextChallenger,
  onMatchFinished,
  returnScreenName
}) => {
  const canvasRef = useRef<CanvasArenaRef | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  // Combat Engine instance
  const combatEngine = useRef(new CombatEngine({
    damageMultiplier: customConfig?.damageMultiplier ?? 1.0
  })).current;

  // Determine starting rules
  const initialHp = gameMode === 'sudden' ? 1 : (customConfig?.startingHp ?? 100);
  const timeLimitSec = customConfig?.timeLimitSec ?? settings.defaultTimerSec ?? 30;
  const roundsToWin = gameMode === 'bo3' ? 2 : (gameMode === 'bo5' ? 3 : (customConfig?.roundsToWin ?? 1));

  // Match State
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [p1Hp, setP1Hp] = useState<number>(initialHp);
  const [p2Hp, setP2Hp] = useState<number>(initialHp);
  const [p1RoundsWon, setP1RoundsWon] = useState<number>(0);
  const [p2RoundsWon, setP2RoundsWon] = useState<number>(0);
  const [matchStartTime] = useState<number>(Date.now());
  const [completedRounds, setCompletedRounds] = useState<RoundResult[]>([]);
  const [allProfiles, setAllProfiles] = useState<PlayerProfile[]>([]);

  // Arena Phase
  const [phase, setPhase] = useState<ArenaPhase>('p1_countdown');

  // Turn challenges
  const [challenges, setChallenges] = useState<[ChallengeItem, ChallengeItem]>(() =>
    getBalancedChallengePair(difficulty)
  );

  // Typing Engines
  const p1Engine = useRef<TypingEngine>(new TypingEngine(challenges[0].text)).current;
  const p2Engine = useRef<TypingEngine>(new TypingEngine(challenges[1].text)).current;

  // Turn Results
  const [p1TurnResult, setP1TurnResult] = useState<PlayerTurnResult | null>(null);
  const [p2TurnResult, setP2TurnResult] = useState<PlayerTurnResult | null>(null);
  const [currentRoundResult, setCurrentRoundResult] = useState<RoundResult | null>(null);
  const [matchWinner, setMatchWinner] = useState<PlayerProfile | 'draw' | null>(null);
  const [certificateStudent, setCertificateStudent] = useState<PlayerProfile | null>(null);

  // Active Typing Display State
  const [evaluatedChars, setEvaluatedChars] = useState<EvaluatedChar[]>([]);
  const [currentWpm, setCurrentWpm] = useState<number>(0);
  const [currentAccuracy, setCurrentAccuracy] = useState<number>(100);
  const [currentMistakes, setCurrentMistakes] = useState<number>(0);
  const [turnTimeRemaining, setTurnTimeRemaining] = useState<number>(timeLimitSec);

  // Countdown timer (3, 2, 1)
  const [countdownNum, setCountdownNum] = useState<number>(3);

  // Character Silhouettes & Weapon definitions
  const p1CharData = CHARACTERS.find((c) => c.id === p1.characterId) || CHARACTERS[0];
  const p2CharData = CHARACTERS.find((c) => c.id === p2.characterId) || CHARACTERS[1];
  const p1WeaponData = WEAPONS.find((w) => w.id === p1.weaponId) || WEAPONS[0];
  const p2WeaponData = WEAPONS.find((w) => w.id === p2.weaponId) || WEAPONS[1];

  // Fetch all profiles for King of the Hill challengers
  useEffect(() => {
    getAllProfiles().then(setAllProfiles).catch(() => {});
  }, []);

  // Keep input focused
  const focusTypingInput = useCallback(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, []);

  // Update evaluated characters
  const updateActiveDisplay = useCallback((engine: TypingEngine) => {
    setEvaluatedChars(engine.getEvaluatedChars());
    const state = engine.getState();
    setCurrentWpm(state.wpm);
    setCurrentAccuracy(state.accuracy);
    setCurrentMistakes(state.mistakes);
  }, []);

  // Start P1 Countdown
  const startP1Countdown = useCallback(() => {
    setPhase('p1_countdown');
    setCountdownNum(3);
    soundEngine.playCountdown(false);
    announcer.announceRoundStart(currentRound, p1.name, p2.name);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownNum(count);
        soundEngine.playCountdown(false);
      } else {
        clearInterval(interval);
        soundEngine.playCountdown(true);
        p1Engine.reset(challenges[0].text);
        updateActiveDisplay(p1Engine);
        setTurnTimeRemaining(timeLimitSec);
        setPhase('p1_typing');
        setTimeout(focusTypingInput, 50);
      }
    }, 1000);
  }, [challenges, p1Engine, timeLimitSec, updateActiveDisplay, focusTypingInput]);

  // Start P2 Countdown
  const startP2Countdown = useCallback(() => {
    setPhase('p2_countdown');
    setCountdownNum(3);
    soundEngine.playCountdown(false);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownNum(count);
        soundEngine.playCountdown(false);
      } else {
        clearInterval(interval);
        soundEngine.playCountdown(true);
        p2Engine.reset(challenges[1].text);
        updateActiveDisplay(p2Engine);
        setTurnTimeRemaining(timeLimitSec);
        setPhase('p2_typing');
        setTimeout(focusTypingInput, 50);
      }
    }, 1000);
  }, [challenges, p2Engine, timeLimitSec, updateActiveDisplay, focusTypingInput]);

  // Mount effect: start round 1
  useEffect(() => {
    startP1Countdown();
  }, [startP1Countdown]);

  // Typing timer countdown during active phases
  useEffect(() => {
    if (phase !== 'p1_typing' && phase !== 'p2_typing') return;

    const timer = setInterval(() => {
      setTurnTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (phase === 'p1_typing') {
            handleP1TurnFinished(true);
          } else {
            handleP2TurnFinished(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Handle Player 1 Turn Completion
  const handleP1TurnFinished = (expired: boolean = false) => {
    if (expired) {
      p1Engine.expire();
    }
    const state = p1Engine.getState();
    const result: PlayerTurnResult = {
      playerId: p1.id,
      playerName: p1.name,
      challengeText: state.targetText,
      typedText: state.typedText,
      wpm: state.wpm,
      accuracy: state.accuracy,
      effectiveWpm: state.effectiveWpm,
      correctChars: state.typedText.split('').filter((c, i) => c === state.targetText[i]).length,
      incorrectChars: state.mistakes,
      completionTimeMs: state.elapsedSeconds * 1000,
      completed: state.isCompleted,
      timestamp: Date.now()
    };

    setP1TurnResult(result);
    // HIDE PLAYER 1 RESULT FROM PLAYER 2!
    setPhase('handover');
    soundEngine.playReload();
    announcer.announceHandover(p2.name);
  };

  // Handle Player 2 Turn Completion
  const handleP2TurnFinished = (expired: boolean = false) => {
    if (expired) {
      p2Engine.expire();
    }
    const state = p2Engine.getState();
    const result: PlayerTurnResult = {
      playerId: p2.id,
      playerName: p2.name,
      challengeText: state.targetText,
      typedText: state.typedText,
      wpm: state.wpm,
      accuracy: state.accuracy,
      effectiveWpm: state.effectiveWpm,
      correctChars: state.typedText.split('').filter((c, i) => c === state.targetText[i]).length,
      incorrectChars: state.mistakes,
      completionTimeMs: state.elapsedSeconds * 1000,
      completed: state.isCompleted,
      timestamp: Date.now()
    };

    setP2TurnResult(result);
    resolveAndAnimateRound(p1TurnResult!, result);
  };

  // Resolve Round & Animate Shootout
  const resolveAndAnimateRound = (res1: PlayerTurnResult, res2: PlayerTurnResult) => {
    setPhase('shooting_animation');

    const roundRes = combatEngine.resolveRound(
      currentRound,
      res1,
      res2,
      p1Hp,
      p2Hp
    );

    setCurrentRoundResult(roundRes);
    const isCritical = roundRes.damageDealt >= 24;

    if (isCritical) {
      const winnerName = roundRes.winnerPlayerId === p1.id ? p1.name : p2.name;
      announcer.announceCriticalHit(winnerName, roundRes.damageDealt);
    }

    setTimeout(() => {
      if (roundRes.winnerPlayerId === p1.id) {
        soundEngine.playRifleShot(p1WeaponData.soundPitch);
        canvasRef.current?.fireShot('p1', roundRes.damageDealt, isCritical, () => {
          soundEngine.playBulletImpact();
          if (isCritical) soundEngine.playCriticalHit();
          setP2Hp(roundRes.p2HpRemaining);
        });
      } else if (roundRes.winnerPlayerId === p2.id) {
        soundEngine.playRifleShot(p2WeaponData.soundPitch);
        canvasRef.current?.fireShot('p2', roundRes.damageDealt, isCritical, () => {
          soundEngine.playBulletImpact();
          if (isCritical) soundEngine.playCriticalHit();
          setP1Hp(roundRes.p1HpRemaining);
        });
      } else {
        soundEngine.playRifleShot(1.0);
        canvasRef.current?.fireShot('p1', roundRes.damageDealt, false);
        canvasRef.current?.fireShot('p2', roundRes.damageDealt, false);
      }

      setTimeout(() => {
        finalizeRound(roundRes);
      }, 1600);
    }, 400);
  };

  // Finalize round and check match over
  const finalizeRound = (roundRes: RoundResult) => {
    setCompletedRounds((prev) => [...prev, roundRes]);

    let newP1Won = p1RoundsWon;
    let newP2Won = p2RoundsWon;

    if (roundRes.winnerPlayerId === p1.id) {
      newP1Won += 1;
      setP1RoundsWon(newP1Won);
    } else if (roundRes.winnerPlayerId === p2.id) {
      newP2Won += 1;
      setP2RoundsWon(newP2Won);
    }

    let matchWinnerProfile: PlayerProfile | 'draw' | null = null;

    if (gameMode === 'bo3' || gameMode === 'bo5' || (gameMode === 'custom' && roundsToWin > 1)) {
      if (newP1Won >= roundsToWin) {
        matchWinnerProfile = p1;
      } else if (newP2Won >= roundsToWin) {
        matchWinnerProfile = p2;
      } else if (roundRes.p1HpRemaining <= 0 && roundRes.p2HpRemaining <= 0) {
        matchWinnerProfile = 'draw';
      } else if (roundRes.p1HpRemaining <= 0) {
        matchWinnerProfile = p2;
      } else if (roundRes.p2HpRemaining <= 0) {
        matchWinnerProfile = p1;
      }
    } else {
      if (roundRes.p1HpRemaining <= 0 && roundRes.p2HpRemaining <= 0) {
        matchWinnerProfile = 'draw';
      } else if (roundRes.p1HpRemaining <= 0) {
        matchWinnerProfile = p2;
      } else if (roundRes.p2HpRemaining <= 0) {
        matchWinnerProfile = p1;
      }
    }

    if (matchWinnerProfile !== null) {
      setMatchWinner(matchWinnerProfile);
      setPhase('match_over');

      if (matchWinnerProfile !== 'draw') {
        soundEngine.playVictory();
        announcer.announceWinner(matchWinnerProfile.name);
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        soundEngine.playDefeat();
      }

      persistMatchCompletion(matchWinnerProfile, [...completedRounds, roundRes]);
    } else {
      setPhase('round_winner_summary');
    }
  };

  const persistMatchCompletion = async (
    winner: PlayerProfile | 'draw',
    allRounds: RoundResult[]
  ) => {
    const calcAvgWpm = (playerId: string) => {
      const arr = allRounds.map((r) =>
        r.p1Result.playerId === playerId ? r.p1Result.wpm : r.p2Result.wpm
      );
      return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    };

    const calcAvgAcc = (playerId: string) => {
      const arr = allRounds.map((r) =>
        r.p1Result.playerId === playerId ? r.p1Result.accuracy : r.p2Result.accuracy
      );
      return arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : 0;
    };

    const matchDurationSec = Math.round((Date.now() - matchStartTime) / 1000);

    const record: MatchRecord = {
      id: 'match_' + Date.now(),
      timestamp: Date.now(),
      gameMode,
      player1: {
        id: p1.id,
        name: p1.name,
        avatar: p1.avatar,
        characterId: p1.characterId,
        weaponId: p1.weaponId,
        finalHp: p1Hp,
        avgWpm: calcAvgWpm(p1.id),
        avgAccuracy: calcAvgAcc(p1.id),
        roundsWon: p1RoundsWon + (allRounds[allRounds.length - 1]?.winnerPlayerId === p1.id ? 1 : 0)
      },
      player2: {
        id: p2.id,
        name: p2.name,
        avatar: p2.avatar,
        characterId: p2.characterId,
        weaponId: p2.weaponId,
        finalHp: p2Hp,
        avgWpm: calcAvgWpm(p2.id),
        avgAccuracy: calcAvgAcc(p2.id),
        roundsWon: p2RoundsWon + (allRounds[allRounds.length - 1]?.winnerPlayerId === p2.id ? 1 : 0)
      },
      winnerId: winner === 'draw' ? 'draw' : winner.id,
      winnerName: winner === 'draw' ? 'STALEMATE' : winner.name,
      totalRounds: allRounds.length,
      matchDurationSec,
      rounds: allRounds
    };

    await saveMatch(record);
    await updateProfilesAfterMatch(record);
    getAllProfiles().then(setAllProfiles).catch(() => {});
    if (onMatchFinished) {
      onMatchFinished(winner);
    }
  };

  const handleNextRound = () => {
    soundEngine.playClick();
    setCurrentRound((prev) => prev + 1);
    const newChallenges = getBalancedChallengePair(difficulty);
    setChallenges(newChallenges);
    setP1TurnResult(null);
    setP2TurnResult(null);
    setCurrentRoundResult(null);
    startP1Countdown();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (phase === 'handover' && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      soundEngine.playClick();
      startP2Countdown();
      return;
    }

    if (phase !== 'p1_typing' && phase !== 'p2_typing') return;

    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      return;
    }

    const currentEngine = phase === 'p1_typing' ? p1Engine : p2Engine;
    const { changed, isError } = currentEngine.handleKeyInput(e.key);

    if (changed) {
      if (isError) {
        soundEngine.playTypo();
      } else {
        soundEngine.playKeystroke(phase === 'p1_typing' ? 700 : 500);
      }
      updateActiveDisplay(currentEngine);

      if (currentEngine.getState().isCompleted) {
        if (phase === 'p1_typing') {
          handleP1TurnFinished(false);
        } else {
          handleP2TurnFinished(false);
        }
      }
    }
  };

  const isP1Active = phase === 'p1_countdown' || phase === 'p1_typing';
  const isP2Active = phase === 'p2_countdown' || phase === 'p2_typing';

  // Eligible next student challengers
  const eligibleChallengers = matchWinner && matchWinner !== 'draw'
    ? allProfiles.filter((p) => p.id !== matchWinner.id)
    : [];

  return (
    <div
      onClick={focusTypingInput}
      className="w-full max-w-5xl mx-auto px-4 py-4 min-h-[calc(100vh-64px)] flex flex-col justify-between"
    >
      <input
        ref={hiddenInputRef}
        type="text"
        className="opacity-0 absolute -top-96 left-0 pointer-events-none"
        onKeyDown={handleKeyDown}
        onPaste={(e) => e.preventDefault()}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* TOP ARENA HUD: Health Bars, Names, Round Counters */}
      <div>
        <div className="flex items-center justify-between mb-2">
          {/* PLAYER 1 HUD */}
          <div className="flex items-center gap-3 w-5/12">
            <span className="text-3xl p-1.5 rounded bg-cyan-950/80 border border-cyan-800">
              {p1.avatar}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-xs text-cyan-400 font-bold truncate max-w-[140px]">
                  {p1.name}
                </span>
                <span className="font-mono text-xs text-cyan-300 font-bold">
                  {p1Hp} / {initialHp} HP
                </span>
              </div>
              <div className="w-full h-3.5 bg-slate-900 rounded-full border border-slate-700 overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-300 ${
                    p1Hp <= 25 ? 'bg-rose-500' : p1Hp <= 50 ? 'bg-amber-400' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${Math.max(0, (p1Hp / initialHp) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-0.5">
                <span>Rounds Won: {p1RoundsWon}</span>
                <span>{p1WeaponData.name}</span>
              </div>
            </div>
          </div>

          {/* CENTER MATCH INFO */}
          <div className="text-center px-4">
            <div className="font-pixel text-[11px] text-emerald-400 tracking-wider">
              ROUND {currentRound}
            </div>
            <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
              {gameMode.toUpperCase()} | {difficulty.toUpperCase()}
            </div>
            {roundsToWin > 1 && (
              <div className="text-[10px] font-mono text-amber-400">
                FIRST TO {roundsToWin}
              </div>
            )}
          </div>

          {/* PLAYER 2 HUD */}
          <div className="flex items-center gap-3 w-5/12 flex-row-reverse">
            <span className="text-3xl p-1.5 rounded bg-amber-950/80 border border-amber-800">
              {p2.avatar}
            </span>
            <div className="flex-1 text-right">
              <div className="flex items-center justify-between flex-row-reverse">
                <span className="font-pixel text-xs text-amber-400 font-bold truncate max-w-[140px]">
                  {p2.name}
                </span>
                <span className="font-mono text-xs text-amber-300 font-bold">
                  {p2Hp} / {initialHp} HP
                </span>
              </div>
              <div className="w-full h-3.5 bg-slate-900 rounded-full border border-slate-700 overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-300 float-right ${
                    p2Hp <= 25 ? 'bg-rose-500' : p2Hp <= 50 ? 'bg-amber-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.max(0, (p2Hp / initialHp) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-0.5">
                <span>{p2WeaponData.name}</span>
                <span>Rounds Won: {p2RoundsWon}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2D CANVAS GAME SCENE */}
        <CanvasArena
          ref={canvasRef}
          p1Character={p1CharData}
          p2Character={p2CharData}
          p1Weapon={p1WeaponData}
          p2Weapon={p2WeaponData}
          p1Hp={p1Hp}
          p2Hp={p2Hp}
          p1Pose={isP1Active ? 'aiming' : 'idle'}
          p2Pose={isP2Active ? 'aiming' : 'idle'}
          reducedMotion={settings.reducedMotion}
          animationIntensity={settings.animationIntensity}
        />
      </div>

      {/* LOWER PLAY AREA / TYPING ARENA OR HANDOVER */}
      <div className="my-4">
        {/* PHASE: COUNTDOWN */}
        {(phase === 'p1_countdown' || phase === 'p2_countdown') && (
          <div className="p-8 rounded-lg bg-[#0e1626]/90 border-2 border-cyan-500/40 text-center animate-fadeIn">
            <div className="font-mono text-xs text-slate-400 tracking-widest uppercase mb-1">
              {phase === 'p1_countdown' ? `${p1.name}'S TURN PREPARING` : `${p2.name}'S TURN PREPARING`}
            </div>
            <div className="font-pixel text-4xl sm:text-6xl text-emerald-400 text-glow-green my-2 animate-bounce">
              {countdownNum}
            </div>
            <p className="font-mono text-xs text-slate-400">
              KEEP FINGERS ON THE HOME ROW. FIRE ON ZERO!
            </p>
          </div>
        )}

        {/* PHASE: ACTIVE TYPING */}
        {(phase === 'p1_typing' || phase === 'p2_typing') && (
          <div className={`p-5 rounded-lg bg-[#0e1626]/95 border-2 shadow-xl ${
            phase === 'p1_typing' ? 'border-cyan-500/60 shadow-[0_0_20px_rgba(0,240,255,0.2)]' : 'border-amber-500/60 shadow-[0_0_20px_rgba(255,183,3,0.2)]'
          }`}>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded font-pixel text-xs font-bold ${
                  phase === 'p1_typing' ? 'bg-cyan-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                }`}>
                  {phase === 'p1_typing' ? `P1: ${p1.name}` : `P2: ${p2.name}`}
                </span>
                <span className="text-xs font-mono text-slate-400">IS FIRING...</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <Zap className="w-4 h-4" />
                  <span>WPM: <strong>{currentWpm}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Shield className="w-4 h-4" />
                  <span>ACC: <strong>{currentAccuracy}%</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>ERR: <strong>{currentMistakes}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400 font-pixel text-[11px] bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{turnTimeRemaining}s</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded bg-slate-950/80 border border-slate-800 font-mono text-base sm:text-lg md:text-xl tracking-wide leading-relaxed min-h-[90px] select-none">
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
                    <span key={idx} className="relative text-cyan-300 font-bold border-b-2 border-cyan-400 bg-cyan-950/60 animate-pulse">
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

            <div className="mt-3 flex justify-between items-center text-[11px] font-mono text-slate-500">
              <span>Backspace supported | Copy-paste disabled</span>
              <span>Click arena anytime to refocus</span>
            </div>
          </div>
        )}

        {/* PHASE: CONFIDENTIAL HANDOVER */}
        {phase === 'handover' && (
          <div className="p-8 rounded-lg bg-[#0e1626]/95 border-2 border-amber-500/50 text-center shadow-[0_0_30px_rgba(255,183,3,0.2)] animate-fadeIn">
            <div className="inline-block px-3 py-1 rounded bg-amber-950 text-amber-400 font-pixel text-[10px] mb-3 border border-amber-700">
              🔒 CONFIDENTIAL SHOOTOUT HANDOVER
            </div>

            <h3 className="font-pixel text-xl sm:text-2xl text-white mb-2">
              PLAYER 1 TURN COMPLETE!
            </h3>

            <p className="font-mono text-sm text-slate-300 max-w-lg mx-auto mb-6">
              Player 1&apos;s speed and accuracy are classified until Player 2 completes their turn.
              Please pass the keyboard to <strong className="text-amber-400">{p2.name}</strong>.
            </p>

            <button
              onClick={() => {
                soundEngine.playClick();
                startP2Countdown();
              }}
              className="px-8 py-3.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(255,183,3,0.4)] cursor-pointer active:scale-95"
            >
              READY PLAYER 2 (PRESS SPACEBAR)
            </button>
          </div>
        )}

        {/* PHASE: SHOOTING ANIMATION */}
        {phase === 'shooting_animation' && currentRoundResult && (
          <div className="p-6 rounded-lg bg-[#0e1626]/90 border border-slate-700 text-center animate-fadeIn">
            <div className="font-pixel text-xs text-cyan-400 mb-1">
              BALLISTIC EXCHANGE
            </div>
            <div className="font-pixel text-base sm:text-lg text-emerald-400 text-glow-green mb-2">
              {currentRoundResult.summary}
            </div>
            <p className="font-mono text-xs text-slate-400">
              Rounds fired. Calculating impact damage...
            </p>
          </div>
        )}

        {/* PHASE: ROUND SUMMARY */}
        {phase === 'round_winner_summary' && currentRoundResult && (
          <div className="p-6 rounded-lg bg-[#0e1626]/95 border-2 border-slate-700 shadow-xl animate-fadeIn">
            <h3 className="font-pixel text-sm sm:text-base text-cyan-400 text-center mb-4">
              ROUND {currentRound} CONCLUSION
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 font-mono text-xs">
              <div className={`p-4 rounded border ${
                currentRoundResult.winnerPlayerId === p1.id ? 'bg-cyan-950/40 border-cyan-500' : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="font-pixel text-xs text-cyan-400 mb-2 flex items-center justify-between">
                  <span>{p1.name}</span>
                  {currentRoundResult.winnerPlayerId === p1.id && (
                    <span className="text-[10px] text-emerald-400 font-bold">ROUND WINNER 🏆</span>
                  )}
                </div>
                <div className="space-y-1 text-slate-300">
                  <div>Raw Speed: <strong className="text-white">{currentRoundResult.p1Result.wpm} WPM</strong></div>
                  <div>Accuracy: <strong className="text-white">{currentRoundResult.p1Result.accuracy}%</strong></div>
                  <div>Effective Speed: <strong className="text-cyan-400">{currentRoundResult.p1Result.effectiveWpm} Eff. WPM</strong></div>
                </div>
              </div>

              <div className={`p-4 rounded border ${
                currentRoundResult.winnerPlayerId === p2.id ? 'bg-amber-950/40 border-amber-500' : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="font-pixel text-xs text-amber-400 mb-2 flex items-center justify-between">
                  <span>{p2.name}</span>
                  {currentRoundResult.winnerPlayerId === p2.id && (
                    <span className="text-[10px] text-emerald-400 font-bold">ROUND WINNER 🏆</span>
                  )}
                </div>
                <div className="space-y-1 text-slate-300">
                  <div>Raw Speed: <strong className="text-white">{currentRoundResult.p2Result.wpm} WPM</strong></div>
                  <div>Accuracy: <strong className="text-white">{currentRoundResult.p2Result.accuracy}%</strong></div>
                  <div>Effective Speed: <strong className="text-amber-400">{currentRoundResult.p2Result.effectiveWpm} Eff. WPM</strong></div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleNextRound}
                className="px-8 py-3 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-pixel text-xs font-bold uppercase transition-all shadow-[0_0_20px_rgba(0,255,102,0.4)]"
              >
                START ROUND {currentRound + 1}
              </button>
            </div>
          </div>
        )}

        {/* PHASE: MATCH OVER / VICTORY SCREEN */}
        {phase === 'match_over' && matchWinner && (
          <div className="p-8 rounded-lg bg-[#0e1626]/98 border-2 border-emerald-500/70 shadow-[0_0_40px_rgba(0,255,102,0.3)] text-center animate-fadeIn">
            <div className="inline-block p-3 rounded-full bg-emerald-950 border border-emerald-600 mb-3 animate-pulse">
              <Trophy className="w-10 h-10 text-emerald-400" />
            </div>

            <h2 className="font-pixel text-2xl sm:text-4xl text-white mb-2">
              {matchWinner === 'draw' ? 'HONORABLE DRAW' : `${matchWinner.name} WINS!`}
            </h2>

            <p className="font-mono text-xs sm:text-sm text-slate-400 mb-6">
              {matchWinner === 'draw'
                ? 'Both snipers fell in mutual crossfire. A legendary standoff!'
                : `Claimed victory in Round ${currentRound} after dominating the typing firefight.`}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto mb-8 font-mono text-xs">
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <div className="text-slate-500 text-[10px]">TOTAL ROUNDS</div>
                <div className="font-pixel text-sm text-cyan-400">{currentRound}</div>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <div className="text-slate-500 text-[10px]">P1 ROUNDS</div>
                <div className="font-pixel text-sm text-cyan-400">{p1RoundsWon}</div>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <div className="text-slate-500 text-[10px]">P2 ROUNDS</div>
                <div className="font-pixel text-sm text-amber-400">{p2RoundsWon}</div>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <div className="text-slate-500 text-[10px]">DATA SAVED</div>
                <div className="font-pixel text-xs text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> SYNCED
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS (REMATCH, NEXT CHALLENGER, MENU) */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* KING OF THE HILL: NEXT STUDENT CHALLENGER */}
              {matchWinner !== 'draw' && eligibleChallengers.length > 0 && onNextChallenger && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    const next = eligibleChallengers[Math.floor(Math.random() * eligibleChallengers.length)];
                    onNextChallenger(matchWinner, next);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded bg-purple-600 hover:bg-purple-500 text-white font-pixel text-xs font-bold uppercase transition-all shadow-[0_0_20px_rgba(176,38,255,0.4)] cursor-pointer active:scale-95"
                >
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>NEXT STUDENT CHALLENGER</span>
                </button>
              )}

              {matchWinner !== 'draw' && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setCertificateStudent(matchWinner);
                  }}
                  className="flex items-center gap-2 px-5 py-3 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-xs font-bold uppercase transition-all shadow-lg"
                >
                  <span>🖨️ DIPLOMA</span>
                </button>
              )}

              <button
                onClick={() => {
                  soundEngine.playClick();
                  onRematch();
                }}
                className="flex items-center gap-2 px-6 py-3 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-pixel text-xs font-bold uppercase transition-all shadow-[0_0_20px_rgba(0,255,102,0.4)]"
              >
                <RefreshCw className="w-4 h-4" /> REMATCH
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  onExitToMenu();
                }}
                className="flex items-center gap-2 px-6 py-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-pixel text-xs uppercase transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> {returnScreenName ? `RETURN TO ${returnScreenName}` : 'MAIN MENU'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Classroom Audience Cheer Reactions */}
      <div className="mb-2">
        <AudienceCheerBar />
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-500 border-t border-slate-800/80 pt-3">
        <button
          onClick={() => {
            if (confirm('Abandon current match and return to Main Menu?')) {
              soundEngine.playClick();
              onExitToMenu();
            }
          }}
          className="hover:text-rose-400 transition-colors"
        >
          Abandon Match
        </button>

        <span>Classroom Local Duel • Wi-Fi Join: 192.168.0.156:3000</span>
      </div>

      {/* Diploma Certificate Modal */}
      <StudentCertificateModal
        student={certificateStudent}
        isOpen={!!certificateStudent}
        onClose={() => setCertificateStudent(null)}
      />
    </div>
  );
};
