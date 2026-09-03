import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { calculateRoundScore } from '../domain/scoring';
import { bidsDraftKey, nextRoundNumber, type BidDraft } from '../lib/game';
import { useGameStore, type Game, type RoundEntry } from '../store/game-store';

interface BidsLocationState {
  bids?: BidDraft[];
  cards?: number;
}

/**
 * Draft of a round being scored, either freshly bid (values handed over by the bids screen)
 * or an already played round opened for edition.
 */
export function useRoundDraft(game: Game) {
  const { roundNumber } = useParams();
  const { state } = useLocation() as { state: BidsLocationState | null };
  const navigate = useNavigate();
  const saveRound = useGameStore((store) => store.saveRound);

  const existingRound = game.rounds.find((item) => item.round === Number(roundNumber));
  const cards = state?.cards ?? existingRound?.cards ?? -1;
  const round = existingRound?.round ?? nextRoundNumber(game);

  const [entries, setEntries] = useState<RoundEntry[]>(
    () =>
      existingRound?.entries.map((entry) => ({ ...entry })) ??
      state?.bids?.map((bid) => ({ ...bid, tricks: 0, bonus: 0, score: 0 })) ??
      [],
  );

  useEffect(() => {
    if (entries.length === 0 && !existingRound) navigate(`/games/${game.id}/bids`, { replace: true });
  }, [entries.length, existingRound, game, navigate]);

  const scoreFor = (entry: RoundEntry) =>
    calculateRoundScore({
      mode: game.mode,
      round,
      cards,
      bid: entry.bid,
      tricks: entry.tricks,
      bonus: entry.bonus,
      bidStyle: entry.bidStyle,
    });

  return {
    isEditing: Boolean(existingRound),
    round,
    cards,
    entriesByPlayer: new Map(entries.map((entry) => [entry.playerId, entry])),
    totalBids: entries.reduce((total, entry) => total + entry.bid, 0),
    scoreFor,
    updateEntry: (playerId: string, patch: Partial<RoundEntry>) =>
      setEntries((current) => current.map((entry) => (entry.playerId === playerId ? { ...entry, ...patch } : entry))),
    save: () => {
      saveRound(game.id, {
        round,
        cards,
        entries: entries.map((entry) => ({ ...entry, score: scoreFor(entry) })),
      });
      sessionStorage.removeItem(bidsDraftKey(game.id, round));
      navigate(`/games/${game.id}`);
    },
  };
}
