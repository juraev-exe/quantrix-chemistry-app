import React, { useState } from 'react';
import { soundEngine } from '../game/audio/soundEngine';

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
}

export const AudienceCheerBar: React.FC = () => {
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  const cheerOptions = ['🔥', '👏', '🎯', '💀', '🎉', '⚡', '🏆', '💥'];

  const triggerCheer = (emoji: string) => {
    soundEngine.playKeystroke(850);
    const newEmoji: FloatingEmoji = {
      id: Date.now() + Math.random(),
      emoji,
      x: 10 + Math.random() * 80 // percentage across width
    };

    setFloatingEmojis(prev => [...prev.slice(-15), newEmoji]);

    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
    }, 1800);
  };

  return (
    <div className="relative">
      {/* Floating Animated Emojis in DOM */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingEmojis.map((item) => (
          <div
            key={item.id}
            style={{ left: `${item.x}%` }}
            className="absolute bottom-16 text-3xl sm:text-4xl animate-floatCheer select-none"
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* Classroom Audience Cheer Bar */}
      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono">
        <span className="text-[11px] text-slate-400 font-pixel flex items-center gap-1.5 hidden sm:flex">
          <span>📣</span> CLASSROOM AUDIENCE CHEER:
        </span>

        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
          {cheerOptions.map((emoji) => (
            <button
              key={emoji}
              onClick={() => triggerCheer(emoji)}
              className="p-1 sm:p-1.5 text-base sm:text-lg rounded bg-slate-800/80 hover:bg-slate-700 hover:scale-125 active:scale-95 transition-all cursor-pointer"
              title={`Cheer ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

