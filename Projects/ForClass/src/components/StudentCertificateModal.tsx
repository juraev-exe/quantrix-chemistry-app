import React from 'react';
import { X, Printer, Award, Download, Check } from 'lucide-react';
import { PlayerProfile } from '../types/profile';
import { soundEngine } from '../game/audio/soundEngine';

interface StudentCertificateModalProps {
  student: PlayerProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentCertificateModal: React.FC<StudentCertificateModalProps> = ({
  student,
  isOpen,
  onClose
}) => {
  if (!isOpen || !student) return null;

  const handlePrint = () => {
    soundEngine.playClick();
    window.print();
  };

  const getRankTitle = (wpm: number) => {
    if (wpm >= 80) return 'MASTER MARKSMAN (TIER I ELITE)';
    if (wpm >= 60) return 'TACTICAL SHARPSHOOTER (TIER II)';
    if (wpm >= 40) return 'COMBAT APPRENTICE (TIER III)';
    return 'RECON CADET';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-[#0a0f1d] border-4 border-amber-500/80 rounded-xl p-8 shadow-[0_0_50px_rgba(255,183,3,0.3)] text-slate-100 print:border-8 print:border-black print:text-black print:bg-white print:shadow-none">
        {/* Modal Close Button (hidden when printing) */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Border Inner Frame */}
        <div className="border-2 border-dashed border-amber-400/60 p-6 rounded-lg text-center print:border-black">
          {/* Header Seal */}
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(255,183,3,0.5)] print:bg-transparent print:border-black">
              🏆
            </div>
          </div>

          <div className="font-pixel text-[11px] text-amber-400 uppercase tracking-widest mb-1 print:text-black">
            ACADEMY OF KEYBOARD MARKSMANSHIP
          </div>

          <h2 className="font-pixel text-2xl sm:text-3xl text-white mb-2 print:text-black">
            CERTIFICATE OF EXCELLENCE
          </h2>

          <p className="font-mono text-xs text-slate-400 mb-6 italic print:text-gray-700">
            This official commendation is hereby conferred upon
          </p>

          {/* Student Name */}
          <div className="my-4 py-2 border-b-2 border-amber-400/80 max-w-md mx-auto print:border-black">
            <span className="font-pixel text-2xl sm:text-3xl text-cyan-300 font-bold uppercase tracking-wider print:text-black">
              {student.name}
            </span>
          </div>

          <p className="font-mono text-xs text-slate-300 max-w-lg mx-auto leading-relaxed mb-6 print:text-black">
            for exceptional reflex velocity, composure under pressure, and mastery over the mechanical keyboard in the arena of <strong>TYPE OR DIE</strong>.
          </p>

          {/* Metrics Pill Grid */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6 font-mono text-xs">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 print:bg-gray-100 print:border-black">
              <div className="text-[10px] text-slate-500 print:text-gray-600">PEAK SPEED</div>
              <div className="font-pixel text-sm text-emerald-400 print:text-black">
                {student.highestWpm} WPM
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 print:bg-gray-100 print:border-black">
              <div className="text-[10px] text-slate-500 print:text-gray-600">ACCURACY</div>
              <div className="font-pixel text-sm text-cyan-400 print:text-black">
                {student.bestAccuracy}%
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 print:bg-gray-100 print:border-black">
              <div className="text-[10px] text-slate-500 print:text-gray-600">DUEL VICTORIES</div>
              <div className="font-pixel text-sm text-amber-400 print:text-black">
                {student.wins} WINS
              </div>
            </div>
          </div>

          <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400 text-amber-300 font-pixel text-[10px] tracking-wide mb-8 print:border-black print:text-black">
            HONORARY RANK: {getRankTitle(student.highestWpm)}
          </div>

          {/* Signature & Date Lines */}
          <div className="flex justify-between items-end max-w-md mx-auto pt-6 border-t border-slate-800 text-left font-mono text-xs print:border-black">
            <div>
              <div className="border-b border-slate-600 w-36 mb-1 print:border-black" />
              <div className="text-[10px] text-slate-500 print:text-gray-600">INSTRUCTOR SIGNATURE</div>
            </div>

            <div className="text-right">
              <div className="font-bold text-slate-300 print:text-black">
                {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="text-[10px] text-slate-500 print:text-gray-600">DATE ISSUED</div>
            </div>
          </div>
        </div>

        {/* Action Controls (hidden when printed) */}
        <div className="mt-6 flex justify-end gap-3 print:hidden">
          <button
            onClick={() => onClose()}
            className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-pixel text-xs"
          >
            CLOSE
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-xs font-bold shadow-[0_0_15px_rgba(255,183,3,0.4)]"
          >
            <Printer className="w-4 h-4" /> PRINT DIPLOMA
          </button>
        </div>
      </div>
    </div>
  );
};

