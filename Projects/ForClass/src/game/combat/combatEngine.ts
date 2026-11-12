import { PlayerTurnResult, RoundResult } from '../../types/game';

export interface CombatConfig {
  baseDamage: number;
  maxBonusDamage: number;
  bonusMultiplier: number;
  minDamage: number;
  maxDamage: number;
  damageMultiplier: number;
  tieDamage: number; // 0 for standoff, >0 for mutual glancing shot
}

export const DEFAULT_COMBAT_CONFIG: CombatConfig = {
  baseDamage: 10,
  maxBonusDamage: 25,
  bonusMultiplier: 0.5,
  minDamage: 10,
  maxDamage: 35,
  damageMultiplier: 1.0,
  tieDamage: 0
};

export class CombatEngine {
  private config: CombatConfig;

  constructor(config: Partial<CombatConfig> = {}) {
    this.config = { ...DEFAULT_COMBAT_CONFIG, ...config };
  }

  /**
   * Calculate combat outcome between Player 1 and Player 2 for a round.
   */
  public resolveRound(
    roundNumber: number,
    p1Result: PlayerTurnResult,
    p2Result: PlayerTurnResult,
    currentP1Hp: number,
    currentP2Hp: number
  ): RoundResult {
    // Determine winner based on effectiveWPM
    const p1Score = p1Result.effectiveWpm;
    const p2Score = p2Result.effectiveWpm;
    const diff = Math.abs(p1Score - p2Score);

    // If difference is within 0.5, treat as tie
    if (diff < 0.5) {
      const damage = Math.round(this.config.tieDamage * this.config.damageMultiplier);
      const newP1Hp = Math.max(0, currentP1Hp - damage);
      const newP2Hp = Math.max(0, currentP2Hp - damage);

      return {
        roundNumber,
        p1Result,
        p2Result,
        winnerPlayerId: 'tie',
        damageDealt: damage,
        p1HpRemaining: newP1Hp,
        p2HpRemaining: newP2Hp,
        summary: `STALEMATE! Both snipers matched speed (${p1Score.toFixed(1)} vs ${p2Score.toFixed(1)} Eff. WPM).`
      };
    }

    const p1Won = p1Score > p2Score;
    const winnerResult = p1Won ? p1Result : p2Result;
    const loserResult = p1Won ? p2Result : p1Result;

    // Damage formula:
    // baseDamage = 10
    // bonusDamage = min(25, round((winnerEffectiveWPM - loserEffectiveWPM) * 0.5))
    // finalDamage = (baseDamage + bonusDamage) * damageMultiplier
    const rawBonus = Math.round(diff * this.config.bonusMultiplier);
    const bonusDamage = Math.min(this.config.maxBonusDamage, rawBonus);
    let finalDamage = Math.round((this.config.baseDamage + bonusDamage) * this.config.damageMultiplier);

    // Enforce bounds
    finalDamage = Math.max(
      Math.round(this.config.minDamage * this.config.damageMultiplier),
      Math.min(Math.round(this.config.maxDamage * this.config.damageMultiplier), finalDamage)
    );

    const newP1Hp = p1Won ? currentP1Hp : Math.max(0, currentP1Hp - finalDamage);
    const newP2Hp = p1Won ? Math.max(0, currentP2Hp - finalDamage) : currentP2Hp;

    const summary = `${winnerResult.playerName} fired a lethal shot for ${finalDamage} DMG! (${winnerResult.effectiveWpm.toFixed(1)} vs ${loserResult.effectiveWpm.toFixed(1)} Eff. WPM)`;

    return {
      roundNumber,
      p1Result,
      p2Result,
      winnerPlayerId: winnerResult.playerId,
      damageDealt: finalDamage,
      p1HpRemaining: newP1Hp,
      p2HpRemaining: newP2Hp,
      summary
    };
  }
}

