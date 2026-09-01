import type { ReactNode } from 'react';

export const fieldLabelClass = 'mb-2.5 block w-full text-xs font-extrabold text-ink-soft uppercase';

export function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className='m-0 p-0 border-0 min-w-0'>
      <legend className={fieldLabelClass}>{legend}</legend>
      {children}
    </fieldset>
  );
}
