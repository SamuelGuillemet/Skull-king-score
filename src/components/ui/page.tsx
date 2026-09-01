import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '../../lib/cn';

/** Cancels the horizontal padding of `Page` so a child can span edge to edge. */
export const bleedX = '-mx-4 px-4 page:-mx-6 page:px-6';

export function Page({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <main
      className={cn(
        'bg-paper shadow-[0_0_48px_rgb(23_33_38/12%)] mx-auto px-4 page:px-6 pb-28 w-[min(100%,760px)] min-h-svh',
        className,
      )}
    >
      {children}
    </main>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className='font-extrabold text-[11px] text-sea uppercase tracking-[0.12em]'>{children}</p>;
}

export function FabLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      className='inline-flex right-[max(20px,calc((100vw-720px)/2))] bottom-[calc(20px+env(safe-area-inset-bottom))] z-20 fixed items-center gap-2.25 bg-coral shadow-[0_7px_0_var(--color-coral-dark),0_12px_26px_rgb(88_40_32/22%)] px-5 rounded-[7px] [&_svg]:w-5 h-13.5 font-extrabold text-white no-underline'
      to={to}
    >
      {children}
    </Link>
  );
}
