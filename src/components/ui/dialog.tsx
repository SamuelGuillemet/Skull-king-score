import { Dialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';

/** Backdrop + popup chrome shared by every dialog of the app. */
export function DialogSurface({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop className='z-40 fixed inset-0 bg-[rgb(11_17_20/68%)] backdrop-blur-[2px] animate-fade-in' />
      <Dialog.Popup className='bottom-4 z-50 fixed inset-x-4 bg-[#f7f4ec] shadow-[0_20px_70px_rgb(0_0_0/30%)] m-auto p-5 rounded-lg w-[min(calc(100%-32px),430px)] animate-rise-in'>
        <Dialog.Title className='mb-4.5 font-serif text-[26px]'>{title}</Dialog.Title>
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  );
}
