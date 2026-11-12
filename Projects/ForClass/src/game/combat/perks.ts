export interface CombatPerk {
  id: string;
  name: string;
  description: string;
  icon: string;
  trigger: string;
  effectType: 'shield' | 'emp' | 'vampire' | 'nitro';
}

export const COMBAT_PERKS: CombatPerk[] = [
  {
    id: 'energy-shield',
    name: 'Energy Shield',
    description: 'Typing with >= 95% accuracy activates an energy shield blocking 15 damage from next hit.',
    icon: '🛡️',
    trigger: '>= 95% Accuracy',
    effectType: 'shield'
  },
  {
    id: 'emp-overclock',
    name: 'EMP Overclock',
    description: 'Typing over 75 WPM unleashes an EMP pulse deducting 3s from adversary’s turn clock.',
    icon: '⚡',
    trigger: '>= 75 WPM',
    effectType: 'emp'
  },
  {
    id: 'vampiric-slugs',
    name: 'Vampiric Slugs',
    description: 'Landing a critical hit (>= 24 DMG) repairs 10 HP to your health bar.',
    icon: '🩸',
    trigger: 'Critical Hit (>= 24 DMG)',
    effectType: 'vampire'
  },
  {
    id: 'nitro-rounds',
    name: 'Nitro Rounds',
    description: 'Flawless execution with 0 mistakes injects +5 bonus kinetic damage into your shot.',
    icon: '💥',
    trigger: '0 Mistakes',
    effectType: 'nitro'
  }
];

export interface PlayerPerkState {
  hasActiveShield: boolean;
  empPendingAgainstOpponent: boolean;
  bonusDamage: number;
}

export function evaluateTurnPerks(
  perkId: string | undefined,
  wpm: number,
  accuracy: number,
  mistakes: number
): { activated: boolean; shieldGranted: boolean; empTriggered: boolean; bonusDamage: number; notification: string | null } {
  if (!perkId) {
    return { activated: false, shieldGranted: false, empTriggered: false, bonusDamage: 0, notification: null };
  }

  if (perkId === 'energy-shield' && accuracy >= 95) {
    return { activated: true, shieldGranted: true, empTriggered: false, bonusDamage: 0, notification: '🛡️ ENERGY SHIELD DEPLOYED (+15 DEFENSE)' };
  }

  if (perkId === 'emp-overclock' && wpm >= 75) {
    return { activated: true, shieldGranted: false, empTriggered: true, bonusDamage: 0, notification: '⚡ EMP PULSE DISCHARGED (-3s ON OPPONENT)' };
  }

  if (perkId === 'nitro-rounds' && mistakes === 0) {
    return { activated: true, shieldGranted: false, empTriggered: false, bonusDamage: 5, notification: '💥 NITRO ROUNDS ACTIVATED (+5 BONUS DMG)' };
  }

  return { activated: false, shieldGranted: false, empTriggered: false, bonusDamage: 0, notification: null };
}

