import type { BidStyle } from '../domain/scoring';
import { cn } from '../lib/cn';
import type { BidDraft } from '../lib/game';
import type { Player } from '../store/game-store';
import { cardClass, cardTitleClass } from './ui/card';
import { Segmented, type SegmentedOption } from './ui/segmented';
import { Stepper } from './ui/stepper';

const bidStyleOptions: SegmentedOption<BidStyle>[] = [
  { value: 'prudent', label: 'Prudent' },
  { value: 'risky', label: 'Risqué', danger: true },
];

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
    <article className={cn(cardClass, 'p-4')}>
      <div className={cardTitleClass}>
        <h2 className='font-serif text-[21px]'>{player.name}</h2>
        {withBidStyle && (
          <Segmented compact value={draft.bidStyle} options={bidStyleOptions} onChange={onBidStyleChange} />
        )}
      </div>
      <Stepper
        size='lg'
        className='mx-auto mt-4.5 max-w-62.5'
        value={draft.bid}
        min={0}
        onChange={onBidChange}
        label={`le pari de ${player.name}`}
      />
    </article>
  );
}
