import { Dialog } from '@base-ui/react/dialog';
import { BarChart3 } from 'lucide-react';

import { playerTotal, type Game } from '../store/game-store';
import { Button, iconButtonClass } from './ui/button';
import { DialogSurface } from './ui/dialog';

export function RankingDialog({ game }: { game: Game }) {
  const ranking = game.players.toSorted((a, b) => playerTotal(game, b.id) - playerTotal(game, a.id));
  return (
    <Dialog.Root>
      <Dialog.Trigger className={iconButtonClass} aria-label='Afficher le classement'>
        <BarChart3 />
      </Dialog.Trigger>
      <DialogSurface title='Classement'>
        <ol className='gap-1.75 grid mb-4.5'>
          {ranking.map((player, index) => (
            <li
              className='items-center grid grid-cols-[32px_1fr_auto] bg-card px-2.5 border border-line rounded-[5px] min-h-12'
              key={player.id}
            >
              <span className='place-items-center grid bg-sea rounded-full size-6 font-black text-[11px] text-white'>
                {index + 1}
              </span>
              <strong>{player.name}</strong>
              <b className='text-[13px] text-coral'>{playerTotal(game, player.id)} pts</b>
            </li>
          ))}
        </ol>
        <Dialog.Close render={<Button className='w-full' variant='secondary' />}>Fermer</Dialog.Close>
      </DialogSurface>
    </Dialog.Root>
  );
}
