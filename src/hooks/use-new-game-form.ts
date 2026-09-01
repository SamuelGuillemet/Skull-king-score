import { useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ScoringMode } from '../domain/scoring';
import { getFormattedDate } from '../lib/date-utils';
import { useGameStore } from '../store/game-store';

export const MIN_PLAYERS = 2;
export const MIN_ROUNDS = 1;
export const MAX_ROUNDS = 20;

export function useNewGameForm() {
  const navigate = useNavigate();
  const createGame = useGameStore((state) => state.createGame);
  const [mode, setMode] = useState<ScoringMode>('classic');
  const [rounds, setRounds] = useState(10);
  const [players, setPlayers] = useState(() => [
    { id: crypto.randomUUID(), name: '' },
    { id: crypto.randomUUID(), name: '' },
    { id: crypto.randomUUID(), name: '' },
  ]);

  const playerNames = players.flatMap(({ name }) => {
    const trimmed = name.trim();
    return trimmed ? [trimmed] : [];
  });

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    if (playerNames.length < MIN_PLAYERS) return;
    const submittedPlayers = playerNames.map((name) => ({ id: crypto.randomUUID(), name }));
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
    addPlayer: () => setPlayers((current) => [...current, { id: crypto.randomUUID(), name: '' }]),
    submit,
  };
}
