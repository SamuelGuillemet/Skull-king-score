import { Skull } from 'lucide-react';

export function LoadingScreen({ message }: { message: string }) {
  return (
    <main className='content-center place-items-center gap-3.5 grid min-h-svh text-ink-muted'>
      <Skull className='size-10 text-coral animate-beat' />
      <p>{message}</p>
    </main>
  );
}
