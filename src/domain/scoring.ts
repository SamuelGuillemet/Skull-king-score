export type ScoringMode = 'classic' | 'rascal' | 'enhanced'
export type BidStyle = 'prudent' | 'risky'

export interface ScoreInput {
  mode: ScoringMode
  round: number
  cards: number
  bid: number
  tricks: number
  bonus: number
  bidStyle?: BidStyle
}

function negativePenalty(bonus: number) {
  return Math.min(0, bonus)
}

function adjustedRascalBonus(bonus: number) {
  if (bonus <= 0) return bonus
  return Math.ceil(bonus / 2 / 5) * 5
}

export function calculateRoundScore(input: ScoreInput) {
  const difference = Math.abs(input.bid - input.tricks)

  if (input.mode === 'classic') {
    if (input.bid === 0) {
      const base = input.bid === input.tricks ? 10 * input.round : -10 * input.round
      return base + (difference === 0 ? input.bonus : negativePenalty(input.bonus))
    }

    if (difference === 0) return 20 * input.bid + input.bonus
    return -10 * difference + negativePenalty(input.bonus)
  }

  if (input.mode === 'enhanced' && input.bidStyle === 'risky') {
    if (difference === 0) return 15 * input.cards + input.bonus
    return negativePenalty(input.bonus)
  }

  if (difference === 0) return 10 * input.cards + input.bonus
  if (difference === 1) {
    return 5 * input.cards + adjustedRascalBonus(input.bonus)
  }
  return negativePenalty(input.bonus)
}

export function formatScore(score: number) {
  return score > 0 ? `+${score}` : String(score)
}
