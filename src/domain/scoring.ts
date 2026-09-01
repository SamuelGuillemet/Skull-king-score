export type ScoringMode = 'classic' | 'rascal' | 'enhanced';
export type BidStyle = 'prudent' | 'risky';

export interface ScoreInput {
  mode: ScoringMode;
  round: number;
  cards: number;
  bid: number;
  tricks: number;
  bonus: number;
  bidStyle?: BidStyle;
}

abstract class ScoringStrategy {
  abstract score(input: ScoreInput): number;

  /** Bonuses only count when the bid is met, penalties always apply. */
  protected penalty(bonus: number) {
    return Math.min(0, bonus);
  }

  protected difference(input: ScoreInput) {
    return Math.abs(input.bid - input.tricks);
  }
}

class ClassicScoring extends ScoringStrategy {
  score(input: ScoreInput) {
    const difference = this.difference(input);

    if (input.bid === 0) {
      const base = (difference === 0 ? 10 : -10) * input.round;
      return base + (difference === 0 ? input.bonus : this.penalty(input.bonus));
    }

    if (difference === 0) return 20 * input.bid + input.bonus;
    return -10 * difference + this.penalty(input.bonus);
  }
}

class RascalScoring extends ScoringStrategy {
  score(input: ScoreInput) {
    const difference = this.difference(input);

    if (difference === 0) return 10 * input.cards + input.bonus;
    if (difference === 1) return 5 * input.cards + this.halvedBonus(input.bonus);
    return this.penalty(input.bonus);
  }

  /** Near misses keep half the bonus, rounded up to the next multiple of 5. */
  private halvedBonus(bonus: number) {
    if (bonus <= 0) return bonus;
    return Math.ceil(bonus / 2 / 5) * 5;
  }
}

class EnhancedScoring extends RascalScoring {
  override score(input: ScoreInput) {
    if (input.bidStyle !== 'risky') return super.score(input);

    if (this.difference(input) === 0) return 15 * input.cards + input.bonus;
    return this.penalty(input.bonus);
  }
}

const strategies: Record<ScoringMode, ScoringStrategy> = {
  classic: new ClassicScoring(),
  rascal: new RascalScoring(),
  enhanced: new EnhancedScoring(),
};

export function calculateRoundScore(input: ScoreInput) {
  return strategies[input.mode].score(input);
}

export function formatScore(score: number) {
  return score > 0 ? `+${score}` : String(score);
}
