import { ArrowLeft, Skull } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '../lib/cn';
import type { Game } from '../store/game-store';
import { RankingDialog } from './ranking-dialog';
import { iconButtonClass } from './ui/button';
import { bleedX } from './ui/page';

export function Header({ title, backTo, game }: { title: string; backTo?: string; game?: Game }) {
  return (
    <header
      className={cn(
        'top-0 z-20 sticky pt-[env(safe-area-inset-top)] items-center grid grid-cols-[44px_minmax(0,1fr)_44px] bg-ink h-17 text-paper',
        bleedX,
      )}
    >
      {backTo ? (
        <Link className={iconButtonClass} to={backTo} aria-label='Retour'>
          <ArrowLeft />
        </Link>
      ) : (
        <span className={cn(iconButtonClass, 'text-coral-light')}>
          <Skull />
        </span>
      )}
      <h1 className='overflow-hidden font-serif font-bold text-[19px] text-center text-ellipsis whitespace-nowrap'>
        {title}
      </h1>
      {game ? <RankingDialog game={game} /> : <span className='w-10.5' />}
    </header>
  );
}
