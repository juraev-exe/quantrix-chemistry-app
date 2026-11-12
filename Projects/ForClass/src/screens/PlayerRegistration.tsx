import React, { useState, useEffect } from 'react';
import { UserPlus, ArrowRight, ArrowLeft, Users, Shuffle, BookOpen, Copy, Check, Wifi, AlertTriangle } from 'lucide-react';
import { PlayerProfile } from '../types/profile';
import { CHARACTERS, AVATAR_OPTIONS } from '../data/characters/characters';
import { WEAPONS } from '../data/weapons/weapons';
import { getAllProfiles, createProfile } from '../database/profiles';
import { soundEngine } from '../game/audio/soundEngine';
import { ClassroomWordModal } from '../components/ClassroomWordModal';

interface PlayerRegistrationProps {
  onBack: () => void;
  onProceed: (p1: PlayerProfile, p2: PlayerProfile) => void;
}

export const PlayerRegistration: React.FC<PlayerRegistrationProps> = ({ onBack, onProceed }) => {
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Selected player IDs
  const [p1Id, setP1Id] = useState<string>('');
  const [p2Id, setP2Id] = useState<string>('');

  // Modals
  const [isCreatingFor, setIsCreatingFor] = useState<'p1' | 'p2' | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);
  const [isWordModalOpen, setIsWordModalOpen] = useState<boolean>(false);

  // Single player creation form
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState(AVATAR_OPTIONS[0]);
  const [newChar, setNewChar] = useState(CHARACTERS[0].id);
  const [newWeapon, setNewWeapon] = useState(WEAPONS[0].id);
  const [formError, setFormError] = useState<string | null>(null);

  // Batch roster import form
  const [rosterInput, setRosterInput] = useState('');
  const [copiedWifi, setCopiedWifi] = useState(false);

  useEffect(() => {
    loadExistingProfiles();
  }, []);

  const loadExistingProfiles = async () => {
    setLoading(true);
    let list = await getAllProfiles();

    // Default guest profiles if empty
    if (list.length === 0) {
      try {
        const guest1 = await createProfile('STUDENT_1', '⚡', 'cyber-commando', 'anti-materiel');
        const guest2 = await createProfile('STUDENT_2', '🎯', 'phantom-sniper', 'plasma-carbine');
        list = [guest1, guest2];
      } catch (e) {
        console.warn('Default profiles init:', e);
      }
    }

    setProfiles(list);
    if (list.length >= 2) {
      setP1Id(list[0].id);
      setP2Id(list[1].id);
    } else if (list.length === 1) {
      setP1Id(list[0].id);
    }
    setLoading(false);
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      soundEngine.playClick();
      const created = await createProfile(newName, newAvatar, newChar, newWeapon);
      const updatedList = await getAllProfiles();
      setProfiles(updatedList);

      if (isCreatingFor === 'p1') {
        setP1Id(created.id);
      } else {
        setP2Id(created.id);
      }

      setIsCreatingFor(null);
      setNewName('');
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  const handleBatchRosterImport = async () => {
    soundEngine.playClick();
    const names = rosterInput
      .split(/[\n,;]+/)
      .map(n => n.trim().toUpperCase())
      .filter(n => n.length > 0);

    if (names.length === 0) {
      alert('Please enter at least one student name.');
      return;
    }

    let addedCount = 0;
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const avatar = AVATAR_OPTIONS[i % AVATAR_OPTIONS.length];
      const char = CHARACTERS[i % CHARACTERS.length].id;
      const wep = WEAPONS[i % WEAPONS.length].id;

      try {
        await createProfile(name, avatar, char, wep);
        addedCount++;
      } catch (e) {
        // Name might already exist, skip duplicate
      }
    }

    const updated = await getAllProfiles();
    setProfiles(updated);
    if (updated.length >= 2) {
      setP1Id(updated[0].id);
      setP2Id(updated[1].id);
    }
    setIsBatchModalOpen(false);
    setRosterInput('');
    alert(`Successfully imported ${addedCount} students to the classroom roster!`);
  };

  const handlePickRandomPair = () => {
    soundEngine.playClick();
    if (profiles.length < 2) return;
    const shuffled = [...profiles].sort(() => Math.random() - 0.5);
    setP1Id(shuffled[0].id);
    setP2Id(shuffled[1].id);
  };

  const handleCopyWifi = () => {
    navigator.clipboard.writeText('http://192.168.0.156:3000');
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2500);
  };

  const p1Profile = profiles.find((p) => p.id === p1Id);
  const p2Profile = profiles.find((p) => p.id === p2Id);
  const canProceed = p1Profile && p2Profile && p1Id !== p2Id;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Top Classroom Wi-Fi Banner */}
      <div className="mb-6 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs shadow-md">
        <div className="flex items-center gap-2 text-emerald-300">
          <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>
            <strong>Classroom Wi-Fi Play:</strong> Students on local Wi-Fi can open{' '}
            <code className="bg-black/60 px-2 py-0.5 rounded text-emerald-400 border border-emerald-700">
              http://192.168.0.156:3000
            </code>{' '}
            on their laptops or Chromebooks!
          </span>
        </div>

        <button
          onClick={handleCopyWifi}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-pixel text-[10px] shrink-0"
        >
          {copiedWifi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedWifi ? 'COPIED LINK!' : 'COPY URL'}</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <button
          onClick={() => {
            soundEngine.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-pixel text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>

        <div className="text-center">
          <h2 className="font-pixel text-lg sm:text-xl text-cyan-400 tracking-wider">
            STUDENT DUEL REGISTRATION
          </h2>
          <p className="font-mono text-xs text-slate-400">SELECT COMBATANTS OR QUICK-IMPORT ROSTER</p>
        </div>

        {/* Classroom Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsWordModalOpen(true);
            }}
            title="Classroom Vocabulary / Word Bank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-pixel text-emerald-400 border border-emerald-800 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">WORDS</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setIsBatchModalOpen(true);
            }}
            title="Import Class Roster"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-600/30 hover:bg-purple-600 text-xs font-pixel text-purple-300 hover:text-white border border-purple-500 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>ROSTER</span>
          </button>

          <button
            onClick={handlePickRandomPair}
            title="Randomize Student Matchup"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-600/30 hover:bg-amber-600 text-xs font-pixel text-amber-300 hover:text-white border border-amber-500 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>RANDOM</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 font-pixel text-cyan-400 animate-pulse text-sm">
          INITIALIZING TARGET PROFILES...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* PLAYER 1 CARD */}
          <div className="p-6 rounded-lg bg-[#0e1626]/90 border-2 border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.15)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-pixel text-xs text-cyan-400 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700">P1</span>
                  PLAYER 1 (LEFT FLANK)
                </span>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setIsCreatingFor('p1');
                    setNewName('');
                    setFormError(null);
                  }}
                  className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300"
                >
                  <UserPlus className="w-3.5 h-3.5" /> + Student
                </button>
              </div>

              {/* Profile Select dropdown */}
              <label className="block text-xs font-mono text-slate-400 mb-1">Select Student</label>
              <select
                value={p1Id}
                onChange={(e) => {
                  soundEngine.playClick();
                  setP1Id(e.target.value);
                }}
                className="w-full mb-4 bg-slate-900 border border-cyan-800 rounded px-3 py-2 text-cyan-300 font-mono text-sm"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === p2Id}>
                    {p.name} (W:{p.wins} / L:{p.losses}) {p.id === p2Id ? '[Chosen by P2]' : ''}
                  </option>
                ))}
              </select>

              {p1Profile && (
                <div className="bg-slate-900/80 p-4 rounded border border-slate-800 text-xs font-mono space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded bg-cyan-950/60 border border-cyan-800">
                      {p1Profile.avatar}
                    </span>
                    <div>
                      <div className="font-pixel text-sm text-cyan-300">{p1Profile.name}</div>
                      <div className="text-slate-400 text-[11px]">
                        Lifetime WPM: <span className="text-emerald-400">{p1Profile.averageWpm}</span> | Best: <span className="text-emerald-400">{p1Profile.highestWpm}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                    <div>
                      <div className="text-slate-500 text-[10px]">CHARACTER</div>
                      <div className="text-slate-200">
                        {CHARACTERS.find((c) => c.id === p1Profile.characterId)?.name || 'Commando'}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">WEAPON</div>
                      <div className="text-slate-200">
                        {WEAPONS.find((w) => w.id === p1Profile.weaponId)?.name || 'Sniper'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
              Left student types first in alternating turn
            </div>
          </div>

          {/* PLAYER 2 CARD */}
          <div className="p-6 rounded-lg bg-[#0e1626]/90 border-2 border-amber-500/40 shadow-[0_0_20px_rgba(255,183,3,0.15)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-pixel text-xs text-amber-400 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-700">P2</span>
                  PLAYER 2 (RIGHT FLANK)
                </span>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setIsCreatingFor('p2');
                    setNewName('');
                    setFormError(null);
                  }}
                  className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300"
                >
                  <UserPlus className="w-3.5 h-3.5" /> + Student
                </button>
              </div>

              {/* Profile Select dropdown */}
              <label className="block text-xs font-mono text-slate-400 mb-1">Select Student</label>
              <select
                value={p2Id}
                onChange={(e) => {
                  soundEngine.playClick();
                  setP2Id(e.target.value);
                }}
                className="w-full mb-4 bg-slate-900 border border-amber-800 rounded px-3 py-2 text-amber-300 font-mono text-sm"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === p1Id}>
                    {p.name} (W:{p.wins} / L:{p.losses}) {p.id === p1Id ? '[Chosen by P1]' : ''}
                  </option>
                ))}
              </select>

              {p2Profile && (
                <div className="bg-slate-900/80 p-4 rounded border border-slate-800 text-xs font-mono space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded bg-amber-950/60 border border-amber-800">
                      {p2Profile.avatar}
                    </span>
                    <div>
                      <div className="font-pixel text-sm text-amber-300">{p2Profile.name}</div>
                      <div className="text-slate-400 text-[11px]">
                        Lifetime WPM: <span className="text-emerald-400">{p2Profile.averageWpm}</span> | Best: <span className="text-emerald-400">{p2Profile.highestWpm}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                    <div>
                      <div className="text-slate-500 text-[10px]">CHARACTER</div>
                      <div className="text-slate-200">
                        {CHARACTERS.find((c) => c.id === p2Profile.characterId)?.name || 'Reaper'}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">WEAPON</div>
                      <div className="text-slate-200">
                        {WEAPONS.find((w) => w.id === p2Profile.weaponId)?.name || 'Railgun'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
              Right student responds in turn
            </div>
          </div>
        </div>
      )}

      {/* Validation warning */}
      {p1Id === p2Id && (
        <div className="mb-6 p-3 rounded bg-rose-950/60 border border-rose-600 flex items-center gap-2 text-rose-300 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Player 1 and Player 2 cannot select the same student. Please select two distinct students.</span>
        </div>
      )}

      {/* Proceed Button */}
      <div className="flex justify-center">
        <button
          disabled={!canProceed}
          onClick={() => {
            if (p1Profile && p2Profile) {
              soundEngine.playClick();
              onProceed(p1Profile, p2Profile);
            }
          }}
          className={`flex items-center gap-3 px-8 py-3.5 rounded font-pixel text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg ${
            canProceed
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-[0_0_25px_rgba(0,255,102,0.4)] cursor-pointer active:scale-95'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
          }`}
        >
          <span>PROCEED TO GAME MODE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* BATCH ROSTER IMPORT MODAL */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0f172a] border-2 border-purple-500/60 rounded-lg p-6 max-w-lg w-full shadow-[0_0_35px_rgba(176,38,255,0.3)]">
            <h3 className="font-pixel text-sm text-purple-400 mb-1">
              BATCH IMPORT CLASSROOM ROSTER
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Paste your student names separated by commas or lines. Avatars and loadouts will be auto-assigned!
            </p>

            <textarea
              rows={6}
              value={rosterInput}
              onChange={(e) => setRosterInput(e.target.value)}
              placeholder="e.g. Liam, Olivia, Noah, Emma, Oliver, Charlotte, James, Amelia, Sophia, Benjamin, Lucas, Henry..."
              className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white font-mono text-xs focus:border-purple-400 outline-none mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsBatchModalOpen(false)}
                className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-mono text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBatchRosterImport}
                className="px-5 py-2 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold font-pixel text-[10px]"
              >
                IMPORT ALL STUDENTS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE PROFILE MODAL */}
      {isCreatingFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0f172a] border-2 border-cyan-500/60 rounded-lg p-6 max-w-lg w-full shadow-[0_0_35px_rgba(0,240,255,0.3)]">
            <h3 className="font-pixel text-sm text-cyan-400 mb-1">
              ADD NEW STUDENT ({isCreatingFor.toUpperCase()})
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Enter student name and customize their avatar and weapon.
            </p>

            {formError && (
              <div className="mb-3 p-2 bg-rose-900/50 border border-rose-600 rounded text-rose-300 text-xs font-mono">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateNew} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  maxLength={18}
                  placeholder="e.g. SARAH"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono uppercase focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Choose Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => {
                        soundEngine.playClick();
                        setNewAvatar(av);
                      }}
                      className={`text-xl p-2 rounded border ${
                        newAvatar === av
                          ? 'border-cyan-400 bg-cyan-950/70 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                          : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingFor(null)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-pixel text-[10px]"
                >
                  SAVE STUDENT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Classroom Word Bank Modal */}
      <ClassroomWordModal
        isOpen={isWordModalOpen}
        onClose={() => setIsWordModalOpen(false)}
      />
    </div>
  );
};
