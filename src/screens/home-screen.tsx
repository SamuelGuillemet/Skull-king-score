import { Plus, Skull } from 'lucide-react';

import { GameCard } from '../components/game-card';
import { Header } from '../components/header';
import { LoadingScreen } from '../components/loading-screen';
import { Eyebrow, FabLink, Page } from '../components/ui/page';
import { useGameStore } from '../store/game-store';

export function HomeScreen() {
  const games = useGameStore((state) => state.games);
  const hydrated = useGameStore((state) => state.hydrated);
  const deleteGame = useGameStore((state) => state.deleteGame);

  if (!hydrated) return <LoadingScreen message='Chargement des parties...' />;

  return (
    <Page className='bg-[radial-gradient(var(--color-line)_0.8px,transparent_0.8px)] bg-size-[16px_16px]'>
      <Header title='Skull King' />
      <section className='px-2 pt-9.5 pb-6.5'>
        <Eyebrow>Carnet de bord</Eyebrow>
        <h2 className='mt-1 mb-2 font-serif text-[32px] leading-[1.1]'>Vos parties</h2>
      </section>
      <section className='gap-2.5 grid page:grid-cols-2'>
        {games.length === 0 && <EmptyState />}
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onDelete={() => confirm('Supprimer cette partie ?') && deleteGame(game.id)}
          />
        ))}
      </section>
      <FabLink to='/new'>
        <Plus /> Nouvelle partie
      </FabLink>
    </Page>
  );
}

function EmptyState() {
  return (
    <div className='content-center place-items-center grid border border-[#b9b5aa] border-dashed rounded-lg min-h-65 text-ink-muted text-center'>
      <Skull className='mb-3 size-9 text-coral' />
      <h3 className='mb-1 font-serif text-[21px] text-ink'>Aucune partie</h3>
      <p className='text-[13px]'>L'équipage attend sa première manche.</p>
    </div>
  );
}
