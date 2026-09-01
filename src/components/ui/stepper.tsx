import { Minus, Plus } from 'lucide-react';

import { cn } from '../../lib/cn';
import { Button } from './button';

const sizes = {
  sm: {
    grid: 'grid-cols-[42px_minmax(34px,1fr)_42px] gap-1',
    value: 'text-[19px] text-ink',
    button: 'min-h-10 px-0',
  },
  md: {
    grid: 'grid-cols-[46px_minmax(52px,1fr)_46px] gap-2',
    value: 'font-serif text-[30px]',
    button: 'px-0',
  },
  lg: {
    grid: 'grid-cols-[46px_minmax(52px,1fr)_46px] gap-2',
    value: 'font-serif text-[42px] leading-none',
    button: 'px-0',
  },
} as const;

export function Stepper({
  value,
  onChange,
  min = -200,
  max = 200,
  step = 1,
  label,
  size = 'sm',
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const style = sizes[size];
  return (
    <div className={cn('items-center grid', style.grid, className)} role='group' aria-label={label}>
      <Button
        variant='secondary'
        type='button'
        className={style.button}
        aria-label={`Diminuer ${label}`}
        onClick={() => onChange(Math.max(min, value - step))}
      >
        <Minus />
      </Button>
      <strong className={cn('tabular-nums text-center', style.value)} aria-live='polite'>
        {value}
      </strong>
      <Button
        variant='secondary'
        type='button'
        className={style.button}
        aria-label={`Augmenter ${label}`}
        onClick={() => onChange(Math.min(max, value + step))}
      >
        <Plus />
      </Button>
    </div>
  );
}
