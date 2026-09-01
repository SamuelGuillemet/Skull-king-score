import { Plus } from 'lucide-react';

import { Button } from './ui/button';

export function PlayerNameFields({
  players,
  onRename,
  onAdd,
}: {
  players: { id: string; name: string }[];
  onRename: (id: string, name: string) => void;
  onAdd: () => void;
}) {
  return (
    <>
      <div className='gap-2.25 grid mb-2'>
        {players.map((player, index) => (
          <input
            key={player.id}
            className='bg-card px-3.5 border border-line rounded-md w-full h-12.5 text-ink'
            aria-label={`Nom du joueur ${index + 1}`}
            placeholder={`Joueur ${index + 1}`}
            value={player.name}
            onChange={(event) => onRename(player.id, event.target.value)}
          />
        ))}
      </div>
      <Button type='button' variant='ghost' onClick={onAdd}>
        <Plus size={18} /> Ajouter un joueur
      </Button>
    </>
  );
}
