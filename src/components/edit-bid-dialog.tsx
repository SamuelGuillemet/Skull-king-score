import { Dialog } from '@base-ui/react/dialog';

import { Button } from './ui/button';
import { DialogSurface } from './ui/dialog';
import { Stepper } from './ui/stepper';

export function EditBidDialog({
  bid,
  maxBid,
  onChange,
  onClose,
}: {
  bid?: number;
  maxBid: number;
  onChange: (bid: number) => void;
  onClose: () => void;
}) {
  return (
    <Dialog.Root open={bid !== undefined} onOpenChange={(open) => !open && onClose()}>
      <DialogSurface title='Modifier le pari'>
        <div className='gap-5 grid pt-1'>
          <Stepper value={bid ?? 0} min={0} max={maxBid} onChange={onChange} label='le pari' />
          <Dialog.Close render={<Button className='w-full' />}>Terminer</Dialog.Close>
        </div>
      </DialogSurface>
    </Dialog.Root>
  );
}
