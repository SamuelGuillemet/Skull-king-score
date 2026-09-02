import { useState } from 'react';

import type { BidStyle } from '../domain/scoring';
import { nextRoundNumber, type BidDraft } from '../lib/game';
import type { Game } from '../store/game-store';

/** Holds the bids being entered for the upcoming round, before they are scored. */
export function useBidDrafts(game: Game | undefined) {
  const round = game ? nextRoundNumber(game) : 1;
  const [cards, setCards] = useState(round);
  const [bids, setBids] = useState<BidDraft[]>(
    () => game?.players.map((player) => ({ playerId: player.id, bid: 0, bidStyle: 'prudent' })) ?? [],
  );

  const patchBid = (playerId: string, patch: Partial<BidDraft>) =>
    setBids((current) => current.map((bid) => (bid.playerId === playerId ? { ...bid, ...patch } : bid)));

  return {
    round,
    cards,
    setCards,
    bids,
    bidsByPlayer: new Map(bids.map((bid) => [bid.playerId, bid])),
    totalBids: bids.reduce((total, bid) => total + bid.bid, 0),
    changeBid: (playerId: string, bid: number) => patchBid(playerId, { bid: Math.max(0, Math.min(bid, cards)) }),
    changeBidStyle: (playerId: string, bidStyle: BidStyle) => patchBid(playerId, { bidStyle }),
  };
}
