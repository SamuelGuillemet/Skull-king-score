import { Skull } from 'lucide-react';
import { Navigate } from 'react-router-dom';

import { useGameStore } from '../store/game-store';

export function LoadingScreen({ message }: { message: string }) {
  return (
    <main className='content-center place-items-center gap-3.5 grid min-h-svh text-ink-muted'>
      <Skull className='size-10 text-coral animate-beat' />
      <p>{message}</p>
    </main>
  );
}

/** A game route with no matching game: it may just be the store still loading, so only redirect once hydrated. */
export function MissingGame() {
  const hydrated = useGameStore((state) => state.hydrated);
  return hydrated ? <Navigate to='/' replace /> : <LoadingScreen message='Chargement de la partie...' />;
}
