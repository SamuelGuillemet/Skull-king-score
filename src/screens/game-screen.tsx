import { ChevronRight } from 'lucide-react';

import { Header } from '../components/header';
import { MissingGame } from '../components/loading-screen';
import { ScoreSheet } from '../components/score-sheet';
import { Eyebrow, FabLink, Page, bleedX } from '../components/ui/page';
import { cn } from '../lib/cn';
import { isGameComplete, modeNames, nextRoundNumber, useCurrentGame } from '../lib/game';

export function GameScreen() {
  const game = useCurrentGame();
  if (!game) return <MissingGame />;

  const complete = isGameComplete(game);
  return (
    <Page>
      <Header title={game.name} backTo='/' game={game} />
      <section className='flex justify-between items-center px-0.5 pt-7 pb-4.5'>
        <div>
          <Eyebrow>{modeNames[game.mode]}</Eyebrow>
          <h2 className='mt-1 mb-2 font-serif text-2xl leading-[1.1]'>
            {complete ? 'Partie terminée' : `Manche ${nextRoundNumber(game)} sur ${game.totalRounds}`}
          </h2>
        </div>
        <span className='px-2.25 py-1.5 border border-[#bfc9c7] rounded font-extrabold text-[11px] text-sea'>
          {game.players.length} joueurs
        </span>
      </section>
      <div className={cn('pb-3 overflow-x-auto', bleedX)}>
        <ScoreSheet game={game} />
      </div>
      {!complete && (
        <FabLink to={`/games/${game.id}/bids`}>
          Saisir les paris <ChevronRight />
        </FabLink>
      )}
    </Page>
  );
}
