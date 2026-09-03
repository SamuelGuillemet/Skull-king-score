import { ChevronRight, Copy, Trash2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import { modeNames, nextRoundNumber } from '../lib/game';
import type { Game } from '../store/game-store';
import { Button } from './ui/button';

export function GameCard({ game, onDelete }: { game: Game; onDelete: () => void }) {
  const round = Math.min(nextRoundNumber(game), game.totalRounds);
  return (
    <article className='grid grid-cols-[1fr_48px] bg-card shadow-[0_5px_16px_rgb(23_33_38/5%)] border border-line rounded-lg overflow-hidden'>
      <Link
        className='flex justify-between items-center p-4 min-w-0 text-inherit no-underline'
        to={`/games/${game.id}`}
      >
        <div>
          <span className='font-extrabold text-[10px] text-sea uppercase'>{modeNames[game.mode]}</span>
          <h3 className='mt-0.75 mb-1.5 font-serif text-xl'>{game.name}</h3>
          <p className='flex items-center gap-1.25 text-ink-muted text-xs'>
            <Users size={15} /> {game.players.length} joueurs ·{' '}
            {game.rounds.length === game.totalRounds ? 'Partie terminée' : `Manche ${round}/${game.totalRounds}`}
          </p>
        </div>
        <ChevronRight />
      </Link>
      <div className='grid border-line-soft border-l w-12'>
        <Link
          className='place-items-center grid text-sea no-underline'
          to={`/new?from=${game.id}`}
          aria-label={`Dupliquer les paramètres de ${game.name}`}
        >
          <Copy size={18} />
        </Link>
        <Button
          variant='ghost'
          className='px-0 border-0 border-line-soft border-t rounded-none w-12 text-[#9b5146]'
          aria-label={`Supprimer ${game.name}`}
          onClick={onDelete}
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </article>
  );
}
