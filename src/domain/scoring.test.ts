import { describe, expect, it } from 'vitest';

import { calculateRoundScore } from './scoring';

describe('calculateRoundScore', () => {
  it('scores classic non-zero and zero bids', () => {
    expect(calculateRoundScore({ mode: 'classic', round: 5, cards: 5, bid: 3, tricks: 3, bonus: 0 })).toBe(60);
    expect(calculateRoundScore({ mode: 'classic', round: 8, cards: 8, bid: 0, tricks: 1, bonus: 0 })).toBe(-80);
  });

  it('scores rascal exact, near and missed bids', () => {
    expect(calculateRoundScore({ mode: 'rascal', round: 8, cards: 8, bid: 5, tricks: 5, bonus: 10 })).toBe(90);
    expect(calculateRoundScore({ mode: 'rascal', round: 8, cards: 8, bid: 5, tricks: 4, bonus: 10 })).toBe(45);
    expect(calculateRoundScore({ mode: 'rascal', round: 8, cards: 8, bid: 5, tricks: 3, bonus: -20 })).toBe(-20);
  });

  it('halves positive bonuses but retains negative penalties in full', () => {
    expect(calculateRoundScore({ mode: 'rascal', round: 3, cards: 3, bid: 1, tricks: 2, bonus: 5 })).toBe(20);
    expect(calculateRoundScore({ mode: 'rascal', round: 3, cards: 3, bid: 1, tricks: 2, bonus: -5 })).toBe(10);
    expect(
      calculateRoundScore({ mode: 'enhanced', round: 1, cards: 1, bid: 0, tricks: 1, bonus: -10, bidStyle: 'prudent' }),
    ).toBe(-5);
  });

  it('scores risky enhanced bids only when exact while retaining penalties', () => {
    expect(
      calculateRoundScore({ mode: 'enhanced', round: 6, cards: 6, bid: 2, tricks: 2, bonus: 10, bidStyle: 'risky' }),
    ).toBe(100);
    expect(
      calculateRoundScore({ mode: 'enhanced', round: 6, cards: 6, bid: 2, tricks: 1, bonus: -15, bidStyle: 'risky' }),
    ).toBe(-15);
  });
});
