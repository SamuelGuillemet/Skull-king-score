import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { cn } from '../lib/cn';
import { nextRoundNumber } from '../lib/game';
import { playerTotal, type Game, type PlayedRound } from '../store/game-store';

const cell = 'h-[46px] min-w-[86px] border-r border-b border-line-soft px-3 py-2 text-center';
const stickyCell = 'sticky left-0 z-2 min-w-[68px]';

export function ScoreSheet({ game }: { game: Game }) {
  const currentRound = nextRoundNumber(game);
  const playedRounds = new Map(game.rounds.map((round) => [round.round, round]));
  const roundNumbers = Array.from({ length: game.totalRounds }, (_, index) => index + 1);

  return (
    <table className='bg-card border border-line rounded-[7px] w-full min-w-max overflow-hidden tabular-nums border-separate border-spacing-0'>
      <thead>
        <tr>
          <th className={cn(cell, stickyCell, 'z-3 bg-ink text-xs text-white')}>Manche</th>
          {game.players.map((player) => (
            <th className={cn(cell, 'bg-ink text-xs text-white')} key={player.id}>
              {player.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {roundNumbers.map((roundNumber) => (
          <ScoreRow
            key={roundNumber}
            game={game}
            roundNumber={roundNumber}
            playedRound={playedRounds.get(roundNumber)}
            isCurrent={roundNumber === currentRound}
          />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th className={cn(cell, stickyCell, 'border-b-0 bg-sea font-black text-white')}>Total</th>
          {game.players.map((player) => (
            <td className={cn(cell, 'border-b-0 bg-sea font-black text-white')} key={player.id}>
              {playerTotal(game, player.id)}
            </td>
          ))}
        </tr>
      </tfoot>
    </table>
  );
}

function ScoreRow({
  game,
  roundNumber,
  playedRound,
  isCurrent,
}: {
  game: Game;
  roundNumber: number;
  playedRound?: PlayedRound;
  isCurrent: boolean;
}) {
  const navigate = useNavigate();
  const scores = new Map(playedRound?.entries.map((entry) => [entry.playerId, entry.score]));
  const rowBackground = isCurrent ? 'bg-[#e1eeec]' : playedRound && 'group-hover:bg-[#f6dfd8]';
  const goToRound = () => playedRound && navigate(`/games/${game.id}/round/${roundNumber}`);

  return (
    <tr
      className={cn('group', playedRound && 'cursor-pointer')}
      onClick={goToRound}
      onKeyDown={(event) => {
        if (playedRound && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          goToRound();
        }
      }}
      role={playedRound && 'button'}
      tabIndex={playedRound ? 0 : undefined}
    >
      <th className={cn(cell, stickyCell, 'bg-sand text-xs text-ink-muted', rowBackground)}>
        <span className='inline-flex items-center gap-1.75'>
          {roundNumber}
          {playedRound && (
            <Pencil className='left-3 absolute size-3' aria-label={`Modifier la manche ${roundNumber}`} />
          )}
        </span>
      </th>
      {game.players.map((player) => (
        <td className={cn(cell, 'font-extrabold', rowBackground)} key={player.id}>
          {scores.get(player.id) ?? '—'}
        </td>
      ))}
    </tr>
  );
}
