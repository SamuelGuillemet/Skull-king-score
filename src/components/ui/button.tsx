import type { ButtonHTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

const variants = {
  primary:
    'bg-coral text-white shadow-[0_5px_0_var(--color-coral-dark)] hover:bg-[#d94834] disabled:bg-[#d7d4cc] disabled:text-[#9c9c98] disabled:shadow-none',
  secondary: 'border-line bg-card text-ink',
  ghost: 'bg-transparent text-sea',
} as const;

/** Round 42px icon slot, shared by plain buttons and by links or dialog triggers. */
export const iconButtonClass =
  'inline-grid size-[42px] place-items-center rounded-full bg-transparent text-inherit [&_svg]:w-[21px]';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex justify-center items-center gap-2 px-4.5 border border-transparent rounded-md min-h-11 [&_svg]:size-4.5 font-extrabold transition-[transform,background-color] active:translate-y-px duration-120 disabled:cursor-not-allowed',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

/** Call to action pinned above the safe area at the bottom of a screen. */
export function StickyActionButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(
        'bottom-[calc(16px+env(safe-area-inset-bottom))] z-30 fixed inset-x-[max(16px,calc((100vw-728px)/2))] h-13.5',
        className,
      )}
      {...props}
    />
  );
}
