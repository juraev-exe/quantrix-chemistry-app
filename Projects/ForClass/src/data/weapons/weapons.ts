export interface WeaponData {
  id: string;
  name: string;
  type: string;
  description: string;
  bulletColor: string;
  trailColor: string;
  muzzleFlashColor: string;
  soundPitch: number; // multiplier for sound synth
  bulletSpeed: number; // px per tick in canvas
  icon: string;
}

export const WEAPONS: WeaponData[] = [
  {
    id: 'anti-materiel',
    name: 'Anti-Materiel Sniper',
    type: 'Heavy Kinetic Rifle',
    description: 'High-caliber bolt-action rifle chambered for armor-piercing depleted uranium rounds.',
    bulletColor: '#00f0ff',
    trailColor: 'rgba(0, 240, 255, 0.6)',
    muzzleFlashColor: '#ffffff',
    soundPitch: 0.9,
    bulletSpeed: 28,
    icon: '🔭'
  },
  {
    id: 'neon-railgun',
    name: 'Neon Railgun',
    type: 'Electromagnetic Accelerator',
    description: 'Superconducting magnetic coils launch slugs at hypersonic velocities with an ionizing trail.',
    bulletColor: '#00ff66',
    trailColor: 'rgba(0, 255, 102, 0.7)',
    muzzleFlashColor: '#00ff66',
    soundPitch: 1.3,
    bulletSpeed: 34,
    icon: '⚡'
  },
  {
    id: 'plasma-carbine',
    name: 'Plasma Carbine',
    type: 'Ion Pulse Rifle',
    description: 'Fires condensed bolts of superheated ionized gas capable of melting kinetic shielding.',
    bulletColor: '#ff2a55',
    trailColor: 'rgba(255, 42, 85, 0.7)',
    muzzleFlashColor: '#ff5577',
    soundPitch: 1.1,
    bulletSpeed: 26,
    icon: '💥'
  },
  {
    id: 'hand-cannon',
    name: 'Heavy Hand Cannon',
    type: 'Magnum Kinetic Pistol',
    description: 'Brutal high-recoil six-shooter loaded with devastating hollow-point cartridges.',
    bulletColor: '#ffb703',
    trailColor: 'rgba(255, 183, 3, 0.6)',
    muzzleFlashColor: '#ffaa00',
    soundPitch: 0.8,
    bulletSpeed: 24,
    icon: '🔫'
  },
  {
    id: 'vortex-dmr',
    name: 'Vortex DMR',
    type: 'Marksman Rifle',
    description: 'Semi-automatic tactical battle rifle balancing lethal stopping power with cyclic precision.',
    bulletColor: '#b026ff',
    trailColor: 'rgba(176, 38, 255, 0.6)',
    muzzleFlashColor: '#d066ff',
    soundPitch: 1.2,
    bulletSpeed: 30,
    icon: '🎯'
  }
];

