import { formatScore } from '../domain/scoring';
import { useLongPress } from '../hooks/use-long-press';
import { cn } from '../lib/cn';
import type { Player, RoundEntry } from '../store/game-store';
import { cardClass, cardTitleClass } from './ui/card';
import { Stepper } from './ui/stepper';

export function RoundResultCard({
  player,
  entry,
  score,
  bidStyleLabel,
  maxTricks,
  onEditBid,
  onChange,
}: {
  player: Player;
  entry: RoundEntry;
  score: number;
  bidStyleLabel?: string;
  maxTricks: number;
  onEditBid: () => void;
  onChange: (patch: Partial<RoundEntry>) => void;
}) {
  const longPress = useLongPress(onEditBid);
  return (
    <article className={cn(cardClass, 'overflow-hidden')}>
      <div className={cn(cardTitleClass, 'border-b border-line-soft p-3 py-1.5')}>
        <button
          className='flex flex-1 items-center gap-3 bg-transparent p-0 border-0 min-w-0 text-inherit text-left'
          type='button'
          aria-label={`Pari ${entry.bid}, modifier le pari de ${player.name}`}
          {...longPress}
        >
          <span
            className='flex-none place-items-center grid bg-sea/10 rounded-full w-11 h-11 font-serif font-bold tabular-nums text-[19px] text-sea'
            aria-hidden='true'
          >
            {entry.bid}
          </span>
          <span className='grid min-w-0'>
            <h2 className='font-serif text-[21px] truncate'>{player.name}</h2>
            {bidStyleLabel && <span className='text-[11px] text-ink-muted'>{bidStyleLabel}</span>}
          </span>
        </button>
        <strong className={cn('flex-none font-serif text-[19px]', score < 0 ? 'text-danger' : 'text-sea')}>
          {formatScore(score)} pts
        </strong>
      </div>
      <div className='gap-px grid grid-cols-2 bg-line-soft'>
        <div className='gap-1 grid bg-card px-3.5 py-1.5 font-extrabold text-[10px] text-ink-muted text-center uppercase'>
          Plis réalisés
          <Stepper
            value={entry.tricks}
            min={0}
            max={maxTricks}
            onChange={(tricks) => onChange({ tricks })}
            label={`les plis réalisés par ${player.name}`}
          />
        </div>
        <div className='gap-1 grid bg-card px-3.5 py-1.5 font-extrabold text-[10px] text-ink-muted text-center uppercase'>
          Bonus / pénalités
          <Stepper
            value={entry.bonus}
            step={5}
            onChange={(bonus) => onChange({ bonus })}
            label={`le bonus de ${player.name}`}
          />
        </div>
      </div>
    </article>
  );
}
