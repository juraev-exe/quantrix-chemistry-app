import React, { useState, useEffect } from 'react';
import { X, BookOpen, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { CLASSROOM_PRESETS } from '../data/challenges/challenges';
import { Difficulty } from '../types/game';
import { soundEngine } from '../game/audio/soundEngine';

interface ClassroomWordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CustomEntry {
  text: string;
  difficulty: Difficulty;
}

export const ClassroomWordModal: React.FC<ClassroomWordModalProps> = ({ isOpen, onClose }) => {
  const [customWords, setCustomWords] = useState<CustomEntry[]>([]);
  const [pasteInput, setPasteInput] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('type_or_die_custom_words');
      if (stored) {
        setCustomWords(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed reading custom words', e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const saveList = (updated: CustomEntry[]) => {
    setCustomWords(updated);
    localStorage.setItem('type_or_die_custom_words', JSON.stringify(updated));
  };

  const handleAddBatch = () => {
    soundEngine.playClick();
    const lines = pasteInput
      .split(/[\n,;]+/)
      .map(s => s.trim())
      .filter(s => s.length >= 8);

    if (lines.length === 0) {
      alert('Please enter valid phrases or sentences (at least 8 characters each).');
      return;
    }

    const newEntries: CustomEntry[] = lines.map(text => ({
      text,
      difficulty: selectedDifficulty
    }));

    const merged = [...customWords, ...newEntries];
    saveList(merged);
    setPasteInput('');
    setNotice(`Added ${lines.length} classroom challenges!`);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleLoadPreset = (preset: typeof CLASSROOM_PRESETS[0]) => {
    soundEngine.playClick();
    const entries: CustomEntry[] = preset.words.map(text => ({
      text,
      difficulty: preset.difficulty
    }));
    const merged = [...customWords, ...entries];
    saveList(merged);
    setNotice(`Loaded preset: "${preset.name}"!`);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDeleteItem = (index: number) => {
    soundEngine.playClick();
    const updated = customWords.filter((_, idx) => idx !== index);
    saveList(updated);
  };

  const handleClearAll = () => {
    soundEngine.playClick();
    if (confirm('Clear all custom classroom words?')) {
      saveList([]);
      setNotice('Classroom word bank cleared.');
      setTimeout(() => setNotice(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f172a] border-2 border-emerald-500/50 rounded-lg p-6 shadow-[0_0_35px_rgba(0,255,102,0.25)] text-slate-200">
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
          <BookOpen className="w-8 h-8 text-emerald-400" />
          <div>
            <h2 className="font-pixel text-lg text-emerald-400 tracking-wide">
              CLASSROOM WORD BANK & CURRICULUM
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              ADD SPELLING LISTS, SCIENCE TERMS, OR CUSTOM CLASSROOM SENTENCES
            </p>
          </div>
        </div>

        {notice && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded flex items-center gap-2 text-emerald-300 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notice}</span>
          </div>
        )}

        {/* Ready to Use Presets */}
        <div className="mb-6 p-4 rounded bg-slate-900/80 border border-slate-800">
          <span className="font-pixel text-[10px] text-cyan-400 block mb-2">
            QUICK LOAD CURRICULUM PRESETS:
          </span>
          <div className="flex flex-wrap gap-2">
            {CLASSROOM_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleLoadPreset(preset)}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Paste Box */}
        <div className="space-y-3 mb-6 font-mono text-xs">
          <div className="flex items-center justify-between">
            <label className="text-slate-300 font-bold">
              Paste Custom Words / Sentences (separated by commas or newlines):
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Target Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty)}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="tech">Tech</option>
              </select>
            </div>
          </div>

          <textarea
            rows={4}
            value={pasteInput}
            onChange={(e) => setPasteInput(e.target.value)}
            placeholder="e.g. Gravity keeps the planets in orbit around the sun.&#10;Photosynthesis creates oxygen for Earth."
            className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-200 font-mono text-xs focus:border-emerald-400 outline-none"
          />

          <div className="flex justify-end">
            <button
              onClick={handleAddBatch}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-pixel text-[10px] font-bold shadow-[0_0_15px_rgba(0,255,102,0.3)]"
            >
              <Plus className="w-3.5 h-3.5" /> ADD TO CLASSROOM WORD BANK
            </button>
          </div>
        </div>

        {/* Existing Custom Words List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-pixel text-xs text-slate-300">
              ACTIVE CLASSROOM CHALLENGES ({customWords.length})
            </span>
            {customWords.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-rose-400 hover:text-rose-300 font-mono text-[11px] flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono text-xs">
            {customWords.length === 0 ? (
              <div className="p-4 bg-slate-950/60 rounded border border-slate-800 text-slate-500 text-center">
                No custom curriculum words added yet. Type or load presets above!
              </div>
            ) : (
              customWords.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800"
                >
                  <span className="text-slate-300 truncate max-w-md">{item.text}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-400 uppercase">
                      {item.difficulty}
                    </span>
                    <button
                      onClick={() => handleDeleteItem(idx)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="px-6 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-pixel text-xs font-bold"
          >
            DONE & RETURN
          </button>
        </div>
      </div>
    </div>
  );
};

