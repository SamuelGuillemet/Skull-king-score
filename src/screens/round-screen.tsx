import { useState } from 'react';

import { EditBidDialog } from '../components/edit-bid-dialog';
import { Header } from '../components/header';
import { MissingGame } from '../components/loading-screen';
import { RoundBanner, RoundBannerRow } from '../components/round-banner';
import { RoundResultCard } from '../components/round-result-card';
import { StickyActionButton } from '../components/ui/button';
import { Page } from '../components/ui/page';
import { useRoundDraft } from '../hooks/use-round-draft';
import { bidStyleNames, useCurrentGame } from '../lib/game';
import type { Game } from '../store/game-store';

export function RoundScreen() {
  const game = useCurrentGame();
  return game ? <Round game={game} /> : <MissingGame />;
}

function Round({ game }: { game: Game }) {
  const draft = useRoundDraft(game);
  const [editedPlayerId, setEditedPlayerId] = useState<string | null>(null);

  const editedEntry = editedPlayerId ? draft.entriesByPlayer.get(editedPlayerId) : undefined;
  return (
    <Page>
      <Header
        title={`${draft.isEditing ? 'Modifier' : 'Résultats'} · Manche ${draft.round}`}
        backTo={draft.isEditing ? `/games/${game.id}` : `/games/${game.id}/bids`}
        game={game}
      />
      <RoundBanner>
        <RoundBannerRow label='Total annoncé' value={`${draft.totalBids} plis`} />
        <RoundBannerRow label='Cartes distribuées' value={`${draft.cards} cartes`} />
      </RoundBanner>
      <section className='gap-3.5 grid'>
        {game.players.map((player) => {
          const entry = draft.entriesByPlayer.get(player.id);
          return entry ? (
            <RoundResultCard
              key={player.id}
              player={player}
              entry={entry}
              score={draft.scoreFor(entry)}
              bidStyleLabel={game.mode === 'enhanced' ? bidStyleNames[entry.bidStyle] : undefined}
              maxTricks={draft.cards}
              onEditBid={() => setEditedPlayerId(player.id)}
              onChange={(patch) => draft.updateEntry(player.id, patch)}
            />
          ) : null;
        })}
      </section>
      <EditBidDialog
        bid={editedEntry?.bid}
        maxBid={draft.cards}
        bidStyle={game.mode === 'enhanced' ? editedEntry?.bidStyle : undefined}
        onChange={(bid) => editedPlayerId && draft.updateEntry(editedPlayerId, { bid })}
        onBidStyleChange={(bidStyle) => editedPlayerId && draft.updateEntry(editedPlayerId, { bidStyle })}
        onClose={() => setEditedPlayerId(null)}
      />
      <StickyActionButton onClick={draft.save}>
        {draft.isEditing ? 'Mettre à jour la manche' : 'Enregistrer la manche'}
      </StickyActionButton>
    </Page>
  );
}
