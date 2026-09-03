import { useState, type SubmitEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { ScoringMode } from '../domain/scoring';
import { generateUUID } from '../lib/crypto';
import { getFormattedDate } from '../lib/date-utils';
import { useGameStore } from '../store/game-store';

export const MIN_PLAYERS = 2;
export const MIN_ROUNDS = 1;
export const MAX_ROUNDS = 20;

export function useNewGameForm() {
  const navigate = useNavigate();
  const createGame = useGameStore((state) => state.createGame);
  const sourceId = useSearchParams()[0].get('from');
  const source = useGameStore((state) => state.games.find((game) => game.id === sourceId));
  const [mode, setMode] = useState<ScoringMode>(source?.mode ?? 'classic');
  const [rounds, setRounds] = useState(source?.totalRounds ?? 10);
  const [players, setPlayers] = useState(() =>
    (source?.players.map(({ name }) => name) ?? ['', '', '']).map((name) => ({
      id: generateUUID(),
      name,
    })),
  );

  const playerNames = players.flatMap(({ name }) => {
    const trimmed = name.trim();
    return trimmed ? [trimmed] : [];
  });

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    if (playerNames.length < MIN_PLAYERS) return;
    const submittedPlayers = playerNames.map((name) => ({ id: generateUUID(), name }));
    const id = createGame({
      name: `Partie du ${getFormattedDate()}`,
      mode,
      totalRounds: rounds,
      players: submittedPlayers,
    });
    navigate(`/games/${id}`);
  };

  return {
    mode,
    setMode,
    rounds,
    setRounds,
    players,
    canSubmit: playerNames.length >= MIN_PLAYERS,
    renamePlayer: (id: string, name: string) =>
      setPlayers((current) => current.map((player) => (player.id === id ? { ...player, name } : player))),
    addPlayer: () => setPlayers((current) => [...current, { id: generateUUID(), name: '' }]),
    submit,
  };
}
