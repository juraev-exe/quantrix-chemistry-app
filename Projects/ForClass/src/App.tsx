import React, { useState, useEffect } from 'react';
import { useSettings } from './hooks/useSettings';
import { Header } from './components/Header';
import { CRTOverlay } from './components/CRTOverlay';
import { MainMenu } from './screens/MainMenu';
import { PlayerRegistration } from './screens/PlayerRegistration';
import { GameModeSelection } from './screens/GameModeSelection';
import { Arena } from './screens/Arena';
import { PracticeArena } from './screens/PracticeArena';
import { Leaderboard } from './screens/Leaderboard';
import { PlayerProfiles } from './screens/PlayerProfiles';
import { MatchHistory } from './screens/MatchHistory';
import { StatisticsDashboard } from './screens/StatisticsDashboard';
import { TournamentBracket } from './screens/TournamentBracket';
import { BossRaidArena } from './screens/BossRaidArena';
import { TroubleKeysDrill } from './screens/TroubleKeysDrill';
import { SettingsModal } from './screens/SettingsModal';
import { HowToPlayModal } from './screens/HowToPlayModal';
import { PlayerProfile } from './types/profile';
import { GameMode, Difficulty, CustomGameConfig } from './types/game';
import { soundEngine } from './game/audio/soundEngine';

export const App: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const [currentScreen, setCurrentScreen] = useState<string>('menu');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Selected combatants
  const [p1, setP1] = useState<PlayerProfile | null>(null);
  const [p2, setP2] = useState<PlayerProfile | null>(null);

  // Match Configuration
  const [gameMode, setGameMode] = useState<GameMode>(settings.defaultGameMode);
  const [difficulty, setDifficulty] = useState<Difficulty>(settings.defaultDifficulty);
  const [customConfig, setCustomConfig] = useState<CustomGameConfig | undefined>(undefined);
  const [tournamentCallback, setTournamentCallback] = useState<((winner: PlayerProfile) => void) | null>(null);

  // Fullscreen listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleMute = () => {
    updateSettings({ soundMuted: !settings.soundMuted });
  };

  // Navigations
  const handleProceedToMode = (player1: PlayerProfile, player2: PlayerProfile) => {
    setTournamentCallback(null);
    setP1(player1);
    setP2(player2);
    setCurrentScreen('gamemode');
  };

  const handleStartGame = (mode: GameMode, diff: Difficulty, config?: CustomGameConfig) => {
    setTournamentCallback(null);
    setGameMode(mode);
    setDifficulty(diff);
    setCustomConfig(config);
    setCurrentScreen('arena');
  };

  const handleLaunchTournamentDuel = (
    player1: PlayerProfile,
    player2: PlayerProfile,
    onFinished: (winner: PlayerProfile) => void
  ) => {
    setP1(player1);
    setP2(player2);
    setGameMode('quick');
    setDifficulty(settings.defaultDifficulty);
    setCustomConfig(undefined);
    setTournamentCallback(() => onFinished);
    setCurrentScreen('arena');
  };

  const handleRematch = () => {
    // Restart arena with current players and mode
    setCurrentScreen('menu');
    setTimeout(() => {
      setCurrentScreen('arena');
    }, 50);
  };

  const handleNextChallenger = (winner: PlayerProfile, nextPlayer: PlayerProfile) => {
    // King of the Hill: Winner stays as P1, next student steps up as P2
    setP1(winner);
    setP2(nextPlayer);
    setCurrentScreen('menu');
    setTimeout(() => {
      setCurrentScreen('arena');
    }, 50);
  };

  // Theme color accents
  const getThemeClass = () => {
    switch (settings.theme) {
      case 'blood':
        return 'theme-blood bg-[#0a0507]';
      case 'matrix':
        return 'theme-matrix bg-[#040e06]';
      case 'retro-amber':
        return 'theme-amber bg-[#0f0c05]';
      default:
        return 'theme-cyberpunk bg-[#070a12]';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClass()} text-slate-100 flex flex-col relative`}>
      {/* CRT Scanline Overlay */}
      <CRTOverlay enabled={!settings.reducedMotion} />

      {/* Top Global Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        soundMuted={settings.soundMuted}
        onToggleMute={toggleMute}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center">
        {currentScreen === 'menu' && (
          <MainMenu
            onNavigate={(screen) => setCurrentScreen(screen)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          />
        )}

        {currentScreen === 'registration' && (
          <PlayerRegistration
            onBack={() => setCurrentScreen('menu')}
            onProceed={handleProceedToMode}
          />
        )}

        {currentScreen === 'gamemode' && p1 && p2 && (
          <GameModeSelection
            p1={p1}
            p2={p2}
            onBack={() => setCurrentScreen('registration')}
            onStartGame={handleStartGame}
          />
        )}

        {currentScreen === 'arena' && p1 && p2 && (
          <Arena
            p1={p1}
            p2={p2}
            gameMode={gameMode}
            difficulty={difficulty}
            customConfig={customConfig}
            settings={settings}
            onExitToMenu={() => {
              if (tournamentCallback) {
                setCurrentScreen('tournament');
              } else {
                setCurrentScreen('menu');
              }
            }}
            onRematch={handleRematch}
            onNextChallenger={handleNextChallenger}
            onMatchFinished={(winner) => {
              if (winner !== 'draw' && tournamentCallback) {
                tournamentCallback(winner);
              }
            }}
            returnScreenName={tournamentCallback ? 'TOURNAMENT BRACKET' : undefined}
          />
        )}

        {currentScreen === 'tournament' && (
          <TournamentBracket
            onBack={() => {
              setTournamentCallback(null);
              setCurrentScreen('menu');
            }}
            onLaunchDuel={handleLaunchTournamentDuel}
          />
        )}

        {currentScreen === 'bossraid' && (
          <BossRaidArena onBack={() => setCurrentScreen('menu')} />
        )}

        {currentScreen === 'troublekeys' && (
          <TroubleKeysDrill onBack={() => setCurrentScreen('menu')} />
        )}

        {currentScreen === 'practice' && (
          <PracticeArena onBack={() => setCurrentScreen('menu')} />
        )}

        {currentScreen === 'leaderboard' && (
          <Leaderboard onBack={() => setCurrentScreen('menu')} />
        )}

        {currentScreen === 'profiles' && (
          <PlayerProfiles onBack={() => setCurrentScreen('menu')} />
        )}

        {currentScreen === 'history' && (
          <MatchHistory onBack={() => setCurrentScreen('menu')} />
        )}

        {currentScreen === 'statistics' && (
          <StatisticsDashboard onBack={() => setCurrentScreen('menu')} />
        )}
      </main>

      {/* Global Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
};
export default App;
