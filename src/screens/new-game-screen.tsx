import { Header } from '../components/header';
import { LoadingScreen } from '../components/loading-screen';
import { PlayerNameFields } from '../components/player-name-fields';
import { StickyActionButton } from '../components/ui/button';
import { Fieldset, fieldLabelClass } from '../components/ui/field';
import { Page } from '../components/ui/page';
import { Segmented } from '../components/ui/segmented';
import { Stepper } from '../components/ui/stepper';
import type { ScoringMode } from '../domain/scoring';
import { MAX_ROUNDS, MIN_ROUNDS, useNewGameForm } from '../hooks/use-new-game-form';
import { modeNames } from '../lib/game';
import { useGameStore } from '../store/game-store';

const modeOptions = (Object.keys(modeNames) as ScoringMode[]).map((mode) => ({
  value: mode,
  label: modeNames[mode],
}));

export function NewGameScreen() {
  const hydrated = useGameStore((state) => state.hydrated);
  if (!hydrated) return <LoadingScreen message='Chargement des parties...' />;
  return <NewGameForm />;
}

function NewGameForm() {
  const form = useNewGameForm();

  return (
    <Page>
      <Header title='Nouvelle partie' backTo='/' />
      <form className='gap-7 grid py-7' onSubmit={form.submit}>
        <Fieldset legend='Mode de comptage'>
          <Segmented value={form.mode} options={modeOptions} onChange={form.setMode} />
        </Fieldset>
        <div>
          <span className={fieldLabelClass}>Nombre de manches</span>
          <Stepper
            size='md'
            value={form.rounds}
            min={MIN_ROUNDS}
            max={MAX_ROUNDS}
            onChange={form.setRounds}
            label='le nombre de manches'
          />
        </div>
        <Fieldset legend='Joueurs'>
          <PlayerNameFields players={form.players} onRename={form.renamePlayer} onAdd={form.addPlayer} />
        </Fieldset>
        <StickyActionButton disabled={!form.canSubmit}>Créer la partie</StickyActionButton>
      </form>
    </Page>
  );
}
