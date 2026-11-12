import React from 'react';
import { X, Target, Shield, Zap, Keyboard, Award } from 'lucide-react';
import { soundEngine } from '../game/audio/soundEngine';

export interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f172a] border-2 border-cyan-500/50 rounded-lg p-6 shadow-[0_0_35px_rgba(0,240,255,0.25)] text-slate-200">
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
          <Target className="w-8 h-8 text-cyan-400 animate-pulse" />
          <div>
            <h2 className="font-pixel text-lg text-cyan-400 tracking-wide">HOW TO PLAY</h2>
            <p className="text-xs text-slate-400 font-mono">TYPE OR DIE COMBAT MANUAL</p>
          </div>
        </div>

        <div className="space-y-6 text-sm font-mono leading-relaxed">
          {/* Section 1 */}
          <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800">
            <h3 className="flex items-center gap-2 font-pixel text-xs text-emerald-400 mb-2">
              <Keyboard className="w-4 h-4" /> 1. ALTERNATING TYPING DUEL
            </h3>
            <p className="text-slate-300 text-xs mb-2">
              Two players face off on one computer. Each round consists of an alternating turn:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-400">
              <li><strong className="text-cyan-400">Player 1 Turn:</strong> 3-second countdown, then Player 1 types their prompt.</li>
              <li><strong className="text-amber-400">Confidential Handover:</strong> Player 1&apos;s stats are hidden. Hand the keyboard to Player 2.</li>
              <li><strong className="text-amber-400">Player 2 Turn:</strong> Player 2 receives a matched challenge of equivalent difficulty.</li>
              <li><strong className="text-emerald-400">Resolution & Shootout:</strong> Both speeds are revealed. The superior sniper fires!</li>
            </ol>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800">
            <h3 className="flex items-center gap-2 font-pixel text-xs text-cyan-400 mb-2">
              <Zap className="w-4 h-4" /> 2. EFFECTIVE WPM & DAMAGE FORMULA
            </h3>
            <p className="text-slate-300 text-xs mb-2">
              Raw speed means nothing without precision. Speed is scaled by your typing accuracy:
            </p>
            <div className="bg-black/60 p-2.5 rounded font-mono text-xs text-cyan-300 border border-cyan-900 mb-2">
              Effective WPM = Raw WPM × (Accuracy % / 100)
            </div>
            <p className="text-slate-400 text-xs mb-2">
              The shooter with the higher Effective WPM hits their target for:
            </p>
            <div className="bg-black/60 p-2.5 rounded font-mono text-xs text-emerald-300 border border-emerald-900">
              Damage = 10 (Base) + min(25, round(Difference × 0.5))
              <br />
              <span className="text-slate-400 text-[11px]">(Min 10 DMG, Max 35 DMG per hit)</span>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800">
            <h3 className="flex items-center gap-2 font-pixel text-xs text-amber-400 mb-2">
              <Shield className="w-4 h-4" /> 3. GAME MODES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-black/40 rounded border border-slate-800">
                <span className="font-pixel text-[10px] text-cyan-400">QUICK DUEL</span>
                <p className="text-slate-400 text-[11px]">First player to deplete opponent&apos;s 100 HP wins.</p>
              </div>
              <div className="p-2 bg-black/40 rounded border border-slate-800">
                <span className="font-pixel text-[10px] text-emerald-400">BEST OF 3 / 5</span>
                <p className="text-slate-400 text-[11px]">Win 2 or 3 rounds to claim match victory.</p>
              </div>
              <div className="p-2 bg-black/40 rounded border border-slate-800">
                <span className="font-pixel text-[10px] text-rose-400">SUDDEN DEATH</span>
                <p className="text-slate-400 text-[11px]">One lethal shot decides the victor instantly.</p>
              </div>
              <div className="p-2 bg-black/40 rounded border border-slate-800">
                <span className="font-pixel text-[10px] text-purple-400">PRACTICE & CUSTOM</span>
                <p className="text-slate-400 text-[11px]">Hone your skills solo or tailor HP, timer, and damage rules.</p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800">
            <h3 className="flex items-center gap-2 font-pixel text-xs text-purple-400 mb-2">
              <Award className="w-4 h-4" /> 4. LOCAL PERSISTENCE & LEADERBOARDS
            </h3>
            <p className="text-slate-400 text-xs">
              Every match and keystroke is saved locally in your browser&apos;s IndexedDB. Track lifetime stats, highest WPM, win streaks, and rank on the 6 Hall of Fame leaderboards without an internet connection.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-pixel text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            UNDERSTOOD, LET&apos;S DUEL
          </button>
        </div>
      </div>
    </div>
  );
};
export default HowToPlayModal;
