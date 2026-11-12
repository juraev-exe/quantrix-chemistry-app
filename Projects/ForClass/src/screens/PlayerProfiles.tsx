import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, Edit2, Trash2, Check, X, Shield, Zap, Skull, Trophy, Printer } from 'lucide-react';
import { PlayerProfile } from '../types/profile';
import { CHARACTERS, AVATAR_OPTIONS } from '../data/characters/characters';
import { WEAPONS } from '../data/weapons/weapons';
import { getAllProfiles, createProfile, updateProfile, deleteProfile } from '../database/profiles';
import { soundEngine } from '../game/audio/soundEngine';
import { StudentCertificateModal } from '../components/StudentCertificateModal';

interface PlayerProfilesProps {
  onBack: () => void;
}

export const PlayerProfiles: React.FC<PlayerProfilesProps> = ({ onBack }) => {
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [certificateStudent, setCertificateStudent] = useState<PlayerProfile | null>(null);

  // Edit / Create states
  const [editingProfile, setEditingProfile] = useState<PlayerProfile | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState('');
  const [avatarInput, setAvatarInput] = useState(AVATAR_OPTIONS[0]);
  const [charInput, setCharInput] = useState(CHARACTERS[0].id);
  const [weaponInput, setWeaponInput] = useState(WEAPONS[0].id);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    const list = await getAllProfiles();
    setProfiles(list);
    setLoading(false);
  };

  const handleStartCreate = () => {
    soundEngine.playClick();
    setNameInput('');
    setAvatarInput(AVATAR_OPTIONS[0]);
    setCharInput(CHARACTERS[0].id);
    setWeaponInput(WEAPONS[0].id);
    setErrorMsg(null);
    setIsCreating(true);
  };

  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      soundEngine.playClick();
      await createProfile(nameInput, avatarInput, charInput, weaponInput);
      setIsCreating(false);
      await loadProfiles();
    } catch (err) {
      setErrorMsg((err as Error).message);
    }
  };

  const handleStartEdit = (p: PlayerProfile) => {
    soundEngine.playClick();
    setEditingProfile(p);
    setNameInput(p.name);
    setAvatarInput(p.avatar);
    setCharInput(p.characterId);
    setWeaponInput(p.weaponId);
    setErrorMsg(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;
    setErrorMsg(null);
    try {
      soundEngine.playClick();
      const updated: PlayerProfile = {
        ...editingProfile,
        name: nameInput.trim().toUpperCase(),
        avatar: avatarInput,
        characterId: charInput,
        weaponId: weaponInput
      };
      await updateProfile(updated);
      setEditingProfile(null);
      await loadProfiles();
    } catch (err) {
      setErrorMsg((err as Error).message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    soundEngine.playClick();
    if (confirm(`Are you sure you want to delete profile "${name}"? All lifetime stats will be lost.`)) {
      await deleteProfile(id);
      await loadProfiles();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
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
          <h2 className="font-pixel text-lg sm:text-xl text-purple-400 tracking-wider">
            SNIPER DOSSIERS
          </h2>
          <p className="font-mono text-xs text-slate-400">REGISTERED COMBATANT PROFILES</p>
        </div>
        <button
          onClick={handleStartCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-pixel text-[10px] shadow-[0_0_12px_rgba(176,38,255,0.4)]"
        >
          <UserPlus className="w-3.5 h-3.5" /> NEW PROFILE
        </button>
      </div>

      {/* Profiles Grid */}
      {loading ? (
        <div className="py-16 text-center text-purple-400 font-pixel text-xs animate-pulse">
          ACCESSING DOSSIER VAULT...
        </div>
      ) : profiles.length === 0 ? (
        <div className="p-12 text-center text-slate-500 font-mono text-sm bg-slate-900/60 rounded-lg border border-slate-800">
          No operative profiles found. Click &apos;NEW PROFILE&apos; to register a marksman!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((p) => {
            const charObj = CHARACTERS.find((c) => c.id === p.characterId) || CHARACTERS[0];
            const wepObj = WEAPONS.find((w) => w.id === p.weaponId) || WEAPONS[0];

            return (
              <div
                key={p.id}
                className="p-5 rounded-lg bg-[#0e1626]/90 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-1.5 rounded bg-slate-900 border border-slate-800">
                        {p.avatar}
                      </span>
                      <div>
                        <h3 className="font-pixel text-sm text-purple-300 font-bold">{p.name}</h3>
                        <p className="text-[11px] font-mono text-slate-400">
                          {charObj.name} • {wepObj.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          setCertificateStudent(p);
                        }}
                        className="p-1.5 rounded bg-slate-800 hover:bg-amber-500/20 hover:text-amber-400 text-slate-400 transition-colors"
                        title="Print Student Diploma"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-400 transition-colors"
                        title="Edit Profile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Detailed Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 my-3 p-3 bg-slate-950/60 rounded border border-slate-800/80 font-mono text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500">WINS / LOSSES</div>
                      <div className="text-emerald-400 font-bold">{p.wins}W / {p.losses}L</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">WIN RATE</div>
                      <div className="text-cyan-400 font-bold">{p.winRate}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">TOTAL KILLS</div>
                      <div className="text-rose-400 font-bold">{p.totalKills}</div>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <div className="text-[10px] text-slate-500">PEAK WPM</div>
                      <div className="text-amber-400 font-bold">{p.highestWpm} WPM</div>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <div className="text-[10px] text-slate-500">AVG WPM</div>
                      <div className="text-slate-300 font-bold">{p.averageWpm} WPM</div>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <div className="text-[10px] text-slate-500">AVG ACCURACY</div>
                      <div className="text-purple-400 font-bold">{p.averageAccuracy}%</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/60">
                  <span>Chars typed: {p.totalCharsTyped.toLocaleString()}</span>
                  <span>Last active: {new Date(p.lastPlayedDate).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {(isCreating || editingProfile) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border-2 border-purple-500/60 rounded-lg p-6 max-w-lg w-full shadow-[0_0_35px_rgba(176,38,255,0.3)]">
            <h3 className="font-pixel text-sm text-purple-400 mb-1">
              {isCreating ? 'REGISTER NEW OPERATIVE' : 'MODIFY OPERATIVE DOSSIER'}
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Update operative codename, avatar icon, loadout silhouette and weapon skin.
            </p>

            {errorMsg && (
              <div className="mb-3 p-2 bg-rose-900/50 border border-rose-600 rounded text-rose-300 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <form
              onSubmit={isCreating ? handleSaveCreate : handleSaveEdit}
              className="space-y-4 text-xs font-mono"
            >
              <div>
                <label className="block text-slate-300 mb-1">Codename</label>
                <input
                  type="text"
                  required
                  maxLength={18}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono uppercase focus:border-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Avatar Icon</label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setAvatarInput(av)}
                      className={`text-xl p-2 rounded border ${
                        avatarInput === av
                          ? 'border-purple-400 bg-purple-950/70 shadow-[0_0_10px_rgba(176,38,255,0.4)]'
                          : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Character Archetype</label>
                <select
                  value={charInput}
                  onChange={(e) => setCharInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                >
                  {CHARACTERS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.title})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Weapon Skin</label>
                <select
                  value={weaponInput}
                  onChange={(e) => setWeaponInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                >
                  {WEAPONS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingProfile(null);
                  }}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold font-pixel text-[10px]"
                >
                  SAVE DOSSIER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diploma Certificate Modal */}
      <StudentCertificateModal
        student={certificateStudent}
        isOpen={!!certificateStudent}
        onClose={() => setCertificateStudent(null)}
      />
    </div>
  );
};
