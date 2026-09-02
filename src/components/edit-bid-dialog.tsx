import { Dialog } from '@base-ui/react/dialog';

import type { BidStyle } from '../domain/scoring';
import { bidStyleOptions } from '../lib/game';
import { Button } from './ui/button';
import { DialogSurface } from './ui/dialog';
import { Segmented } from './ui/segmented';
import { Stepper } from './ui/stepper';

export function EditBidDialog({
  bid,
  maxBid,
  bidStyle,
  onChange,
  onBidStyleChange,
  onClose,
}: {
  bid?: number;
  maxBid: number;
  bidStyle?: BidStyle;
  onChange: (bid: number) => void;
  onBidStyleChange?: (bidStyle: BidStyle) => void;
  onClose: () => void;
}) {
  return (
    <Dialog.Root open={bid !== undefined} onOpenChange={(open) => !open && onClose()}>
      <DialogSurface title='Modifier le pari'>
        <div className='gap-5 grid pt-1'>
          {bidStyle && onBidStyleChange && (
            <Segmented value={bidStyle} options={bidStyleOptions} onChange={onBidStyleChange} />
          )}
          <Stepper value={bid ?? 0} min={0} max={maxBid} onChange={onChange} label='le pari' />
          <Dialog.Close render={<Button className='w-full' />}>Terminer</Dialog.Close>
        </div>
      </DialogSurface>
    </Dialog.Root>
  );
}
