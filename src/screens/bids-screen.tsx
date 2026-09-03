import { useNavigate } from 'react-router-dom';

import { BidCard } from '../components/bid-card';
import { Header } from '../components/header';
import { MissingGame } from '../components/loading-screen';
import { RoundBanner, RoundBannerRow } from '../components/round-banner';
import { StickyActionButton } from '../components/ui/button';
import { Page } from '../components/ui/page';
import { Stepper } from '../components/ui/stepper';
import { useBidDrafts } from '../hooks/use-bid-drafts';
import { useCurrentGame } from '../lib/game';
import type { Game } from '../store/game-store';

export function BidsScreen() {
  const game = useCurrentGame();
  return game ? <Bids game={game} /> : <MissingGame />;
}

function Bids({ game }: { game: Game }) {
  const navigate = useNavigate();
  const drafts = useBidDrafts(game);

  return (
    <Page>
      <Header title={`Paris · Manche ${drafts.round}`} backTo={`/games/${game.id}`} game={game} />
      <RoundBanner>
        <RoundBannerRow label='Total annoncé' value={`${drafts.totalBids} plis`} />
      </RoundBanner>
      <section className='flex justify-between items-start gap-3.5 bg-[#e8e4da] mb-3.5 px-3.5 py-3 border border-[#c7c4bb] rounded-[7px]'>
        <div>
          <span className='block font-extrabold text-[13px]'>Cartes distribuées</span>
          <small className='text-[10px] text-ink-muted'>Ajuste la valeur de la manche</small>
        </div>
        <Stepper
          className='w-41'
          value={drafts.cards}
          min={1}
          max={20}
          onChange={drafts.setCards}
          label='les cartes distribuées'
        />
      </section>
      <section className='gap-2.75 grid page:grid-cols-2'>
        {game.players.map((player) => {
          const draft = drafts.bidsByPlayer.get(player.id);
          return draft ? (
            <BidCard
              key={player.id}
              player={player}
              draft={draft}
              withBidStyle={game.mode === 'enhanced'}
              onBidChange={(bid) => drafts.changeBid(player.id, bid)}
              onBidStyleChange={(bidStyle) => drafts.changeBidStyle(player.id, bidStyle)}
            />
          ) : null;
        })}
      </section>
      <StickyActionButton
        onClick={() =>
          navigate(`/games/${game.id}/round`, {
            state: { bids: drafts.bids, cards: drafts.cards },
          })
        }
      >
        Valider les paris
      </StickyActionButton>
    </Page>
  );
}
