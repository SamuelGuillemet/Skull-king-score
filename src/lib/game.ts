import { useParams } from 'react-router-dom';

import type { SegmentedOption } from '../components/ui/segmented';
import type { BidStyle, ScoringMode } from '../domain/scoring';
import { useGameStore, type Game } from '../store/game-store';

export const modeNames: Record<ScoringMode, string> = {
  classic: 'Classique',
  rascal: 'Rascal',
  enhanced: 'Rascal Enhanced',
};

export const bidStyleNames: Record<BidStyle, string> = {
  prudent: 'Prudent',
  risky: 'Risqué',
};

export const bidStyleOptions: SegmentedOption<BidStyle>[] = [
  { value: 'prudent', label: 'Prudent' },
  { value: 'risky', label: 'Risqué', danger: true },
];

export interface BidDraft {
  playerId: string;
  bid: number;
  bidStyle: BidStyle;
}

export function useCurrentGame() {
  const { gameId } = useParams();
  return useGameStore((state) => state.games.find((game) => game.id === gameId));
}

export function nextRoundNumber(game: Game) {
  return game.rounds.length + 1;
}

export function isGameComplete(game: Game) {
  return nextRoundNumber(game) > game.totalRounds;
}
