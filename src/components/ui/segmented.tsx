import { cn } from '../../lib/cn';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  /** Highlights the option in coral once selected. */
  danger?: boolean;
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  compact = false,
  className,
}: {
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-flow-col auto-cols-fr bg-sand p-0.75 border border-line rounded-[7px] overflow-hidden',
        compact && 'w-44',
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            type='button'
            key={option.value}
            aria-pressed={selected}
            className={cn(
              'px-2 max-[520px]:px-1 py-1.25 rounded min-h-10.5 font-extrabold text-ink-soft max-[520px]:text-[10px] text-xs',
              compact && 'min-h-8.5 text-[11px]',
              selected && 'bg-card text-ink shadow-[0_2px_7px_rgb(23_33_38/10%)]',
              selected && option.danger && 'bg-coral text-white',
            )}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
