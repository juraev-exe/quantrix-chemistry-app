export interface CharacterData {
  id: string;
  name: string;
  title: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  visorColor: string;
  avatarIcon: string;
}

export const CHARACTERS: CharacterData[] = [
  {
    id: 'cyber-commando',
    name: 'Cyber Commando',
    title: 'Tactical Recon Specialist',
    description: 'Battlefield veteran enhanced with neural targeting interfaces and military-grade kinetic dampeners.',
    primaryColor: '#00f0ff',
    accentColor: '#0077ff',
    visorColor: '#ffffff',
    avatarIcon: '⚡'
  },
  {
    id: 'neon-reaper',
    name: 'Neon Reaper',
    title: 'Shadow Assassin',
    description: 'Ghostly infiltrator operating on overclocked reflexes and blinding neon blades.',
    primaryColor: '#ff2a55',
    accentColor: '#990022',
    visorColor: '#ff0033',
    avatarIcon: '💀'
  },
  {
    id: 'phantom-sniper',
    name: 'Phantom Sniper',
    title: 'Ballistic Marksman',
    description: 'Patient and lethal. Calculates windage, bullet drop, and heartbeat rhythm in fractions of a second.',
    primaryColor: '#00ff66',
    accentColor: '#008833',
    visorColor: '#00ff66',
    avatarIcon: '🎯'
  },
  {
    id: 'wasteland-gunner',
    name: 'Wasteland Gunner',
    title: 'Scrap Heavy Gunner',
    description: 'Armor-plated survivor forged in radiation zones, wielding custom modified slug weapons.',
    primaryColor: '#ffb703',
    accentColor: '#fb8500',
    visorColor: '#ffee88',
    avatarIcon: '🔥'
  },
  {
    id: 'valkyrie-unit',
    name: 'Valkyrie Unit',
    title: 'Aero-Cyber Enforcer',
    description: 'Next-generation orbital pilot with supersonic reaction speed and synchronized energy weapons.',
    primaryColor: '#b026ff',
    accentColor: '#7000cc',
    visorColor: '#ff00ff',
    avatarIcon: '🦅'
  },
  {
    id: 'dreadnought',
    name: 'Dreadnought',
    title: 'Titanium Juggernaut',
    description: 'Immovable walking fortress. Absorbs direct ordnance and returns crushing counter-fire.',
    primaryColor: '#94a3b8',
    accentColor: '#475569',
    visorColor: '#38bdf8',
    avatarIcon: '🛡️'
  }
];

export const AVATAR_OPTIONS = [
  '🎯', '⚡', '💀', '🔥', '🦅', '🛡️',
  '👾', '🤖', '👑', '💣', '🚀', '🗡️',
  '🐺', '🦁', '🐉', '☣️', '☣️', '✨'
];

