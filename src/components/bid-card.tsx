import type { BidStyle } from '../domain/scoring';
import { cn } from '../lib/cn';
import { bidStyleOptions, type BidDraft } from '../lib/game';
import type { Player } from '../store/game-store';
import { cardClass, cardTitleClass } from './ui/card';
import { Segmented } from './ui/segmented';
import { Stepper } from './ui/stepper';

export function BidCard({
  player,
  draft,
  withBidStyle,
  onBidChange,
  onBidStyleChange,
}: {
  player: Player;
  draft: BidDraft;
  withBidStyle: boolean;
  onBidChange: (bid: number) => void;
  onBidStyleChange: (bidStyle: BidStyle) => void;
}) {
  return (
    <article className={cn(cardClass, 'py-2 px-4')}>
      <div className={cardTitleClass}>
        <h2 className='font-serif text-[21px]'>{player.name}</h2>
        {withBidStyle && (
          <Segmented compact value={draft.bidStyle} options={bidStyleOptions} onChange={onBidStyleChange} />
        )}
      </div>
      <Stepper
        size='lg'
        className='mx-auto mt-2 max-w-62.5'
        value={draft.bid}
        min={0}
        onChange={onBidChange}
        label={`le pari de ${player.name}`}
      />
    </article>
  );
}
