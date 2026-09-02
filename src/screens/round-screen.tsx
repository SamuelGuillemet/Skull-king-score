import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { EditBidDialog } from '../components/edit-bid-dialog';
import { Header } from '../components/header';
import { RoundBanner, RoundBannerRow } from '../components/round-banner';
import { RoundResultCard } from '../components/round-result-card';
import { StickyActionButton } from '../components/ui/button';
import { Page } from '../components/ui/page';
import { useRoundDraft } from '../hooks/use-round-draft';
import { bidStyleNames, useCurrentGame } from '../lib/game';

export function RoundScreen() {
  const game = useCurrentGame();
  const draft = useRoundDraft(game);
  const [editedPlayerId, setEditedPlayerId] = useState<string | null>(null);
  if (!game) return <Navigate to='/' replace />;

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
