import type { ReactNode } from 'react';

export function RoundBanner({ children }: { children: ReactNode }) {
  return (
    <div className='flex flex-col gap-2 bg-sea -mx-4 page:-mx-6 mb-5 px-4.5 page:px-6.5 py-3.5 text-white'>
      {children}
    </div>
  );
}

export function RoundBannerRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex justify-between items-center w-full'>
      <span className='font-bold text-xs'>{label}</span>
      <strong className='font-serif text-[19px]'>{value}</strong>
    </div>
  );
}
