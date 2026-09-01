import { get, set } from 'idb-keyval';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import type { BidStyle, ScoringMode } from '../domain/scoring';

export interface Player {
  id: string;
  name: string;
}

export interface RoundEntry {
  playerId: string;
  bid: number;
  bidStyle: BidStyle;
  tricks: number;
  bonus: number;
  score: number;
}

export interface PlayedRound {
  round: number;
  cards: number;
  entries: RoundEntry[];
}

export interface Game {
  id: string;
  name: string;
  mode: ScoringMode;
  totalRounds: number;
  players: Player[];
  rounds: PlayedRound[];
  createdAt: number;
  updatedAt: number;
}

interface GameState {
  games: Game[];
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  createGame: (game: Omit<Game, 'id' | 'rounds' | 'createdAt' | 'updatedAt'>) => string;
  saveRound: (gameId: string, round: PlayedRound) => void;
  deleteGame: (gameId: string) => void;
}

const indexedDbStorage: StateStorage = {
  getItem: async (name) => (await get<string>(name)) ?? null,
  setItem: async (name, value) => set(name, value),
  removeItem: async (name) => set(name, null),
};

export const useGameStore = create<GameState>()(
  persist(
    (setState) => ({
      games: [],
      hydrated: false,
      setHydrated: (hydrated) => setState({ hydrated }),
      createGame: (game) => {
        const id = crypto.randomUUID();
        const now = Date.now();
        setState((state) => ({
          games: [
            { ...game, mode: game.mode || 'classic', id, rounds: [], createdAt: now, updatedAt: now },
            ...state.games,
          ],
        }));
        return id;
      },
      saveRound: (gameId, round) =>
        setState((state) => ({
          games: state.games.map((game) =>
            game.id === gameId
              ? {
                  ...game,
                  rounds: [...game.rounds.filter((item) => item.round !== round.round), round].sort(
                    (a, b) => a.round - b.round,
                  ),
                  updatedAt: Date.now(),
                }
              : game,
          ),
        })),
      deleteGame: (gameId) =>
        setState((state) => ({
          games: state.games.filter((game) => game.id !== gameId),
        })),
    }),
    {
      name: 'skull-king-games',
      storage: createJSONStorage(() => indexedDbStorage),
      partialize: (state) => ({ games: state.games }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);

export function playerTotal(game: Game, playerId: string) {
  return game.rounds.reduce(
    (total, round) => total + (round.entries.find((entry) => entry.playerId === playerId)?.score ?? 0),
    0,
  );
}
