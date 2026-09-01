import { Dialog } from '@base-ui/react/dialog'
import { ArrowLeft, BarChart3, ChevronRight, Minus, Pencil, Plus, Skull, Trash2, Users } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button } from './components/ui/button'
import { calculateRoundScore, formatScore, type BidStyle, type ScoringMode } from './domain/scoring'
import { playerTotal, useGameStore, type Game, type RoundEntry } from './store/game-store'

const modeNames: Record<ScoringMode, string> = {
  classic: 'Classique',
  rascal: 'Rascal',
  enhanced: 'Rascal Enhanced',
}

function Header({ title, backTo, game }: { title: string; backTo?: string; game?: Game }) {
  return (
    <header className="app-header">
      {backTo ? (
        <Link className="icon-button" to={backTo} aria-label="Retour">
          <ArrowLeft />
        </Link>
      ) : (
        <span className="brand-mark">
          <Skull />
        </span>
      )}
      <h1>{title}</h1>
      {game ? <RankingDialog game={game} /> : <span className="header-spacer" />}
    </header>
  )
}

function RankingDialog({ game }: { game: Game }) {
  const ranking = [...game.players].sort((a, b) => playerTotal(game, b.id) - playerTotal(game, a.id))
  return (
    <Dialog.Root>
      <Dialog.Trigger className="icon-button" aria-label="Afficher le classement">
        <BarChart3 />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop" />
        <Dialog.Popup className="dialog-popup">
          <Dialog.Title className="dialog-title">Classement</Dialog.Title>
          <div className="ranking-list">
            {ranking.map((player, index) => (
              <div className="ranking-row" key={player.id}>
                <span className="rank">{index + 1}</span>
                <strong>{player.name}</strong>
                <b>{playerTotal(game, player.id)} pts</b>
              </div>
            ))}
          </div>
          <Dialog.Close render={<Button className="w-full" variant="secondary" />}>Fermer</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function HomeScreen() {
  const games = useGameStore((state) => state.games)
  const hydrated = useGameStore((state) => state.hydrated)
  const deleteGame = useGameStore((state) => state.deleteGame)
  if (!hydrated)
    return (
      <main className="center-screen">
        <Skull className="loading-mark" />
        <p>Chargement des parties...</p>
      </main>
    )
  return (
    <main className="page home-page">
      <Header title="Skull King" />
      <section className="home-intro">
        <p className="eyebrow">Carnet de bord</p>
        <h2>Vos parties</h2>
        <p>Les scores restent sur cet appareil, même hors connexion.</p>
      </section>
      <section className="game-list">
        {games.length === 0 && (
          <div className="empty-state">
            <Skull />
            <h3>Aucune partie</h3>
            <p>L'équipage attend sa première manche.</p>
          </div>
        )}
        {games.map((game) => (
          <article className="game-card" key={game.id}>
            <Link to={`/games/${game.id}`}>
              <div>
                <span className="mode-label">{modeNames[game.mode]}</span>
                <h3>{game.name}</h3>
                <p>
                  <Users size={15} /> {game.players.length} joueurs · Manche{' '}
                  {Math.min(game.rounds.length + 1, game.totalRounds)}/{game.totalRounds}
                </p>
              </div>
              <ChevronRight />
            </Link>
            <Button
              variant="ghost"
              aria-label={`Supprimer ${game.name}`}
              onClick={() => confirm('Supprimer cette partie ?') && deleteGame(game.id)}
            >
              <Trash2 size={18} />
            </Button>
          </article>
        ))}
      </section>
      <Link className="fab-link" to="/new">
        <Plus /> Nouvelle partie
      </Link>
    </main>
  )
}

function NewGameScreen() {
  const navigate = useNavigate()
  const createGame = useGameStore((state) => state.createGame)
  const [mode, setMode] = useState<ScoringMode>('classic')
  const [rounds, setRounds] = useState(10)
  const [names, setNames] = useState(['', '', ''])
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const players = names
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({ id: crypto.randomUUID(), name }))
    if (players.length < 2) return
    const date = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date())
    const id = createGame({ name: `Partie du ${date}`, mode, totalRounds: rounds, players })
    navigate(`/games/${id}`)
  }
  return (
    <main className="page">
      <Header title="Nouvelle partie" backTo="/" />
      <form className="form-page" onSubmit={submit}>
        <fieldset>
          <legend>Mode de comptage</legend>
          <div className="segmented three">
            {(['classic', 'rascal', 'enhanced'] as ScoringMode[]).map((item) => (
              <button type="button" className={mode === item ? 'active' : ''} key={item} onClick={() => setMode(item)}>
                {modeNames[item]}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="field-label">
          Nombre de manches
          <div className="number-control">
            <Button type="button" variant="secondary" onClick={() => setRounds(Math.max(1, rounds - 1))}>
              <Minus />
            </Button>
            <strong>{rounds}</strong>
            <Button type="button" variant="secondary" onClick={() => setRounds(Math.min(20, rounds + 1))}>
              <Plus />
            </Button>
          </div>
        </label>
        <fieldset>
          <legend>Joueurs</legend>
          <div className="player-fields">
            {names.map((name, index) => (
              <input
                key={index}
                aria-label={`Nom du joueur ${index + 1}`}
                placeholder={`Joueur ${index + 1}`}
                value={name}
                onChange={(event) =>
                  setNames((current) =>
                    current.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)),
                  )
                }
              />
            ))}
          </div>
          <Button type="button" variant="ghost" onClick={() => setNames((current) => [...current, ''])}>
            <Plus size={18} /> Ajouter un joueur
          </Button>
        </fieldset>
        <Button className="sticky-action" disabled={names.filter((name) => name.trim()).length < 2}>
          Créer la partie
        </Button>
      </form>
    </main>
  )
}

function useCurrentGame() {
  const { gameId } = useParams()
  return useGameStore((state) => state.games.find((game) => game.id === gameId))
}

function GameScreen() {
  const game = useCurrentGame()
  const navigate = useNavigate()
  if (!game) return <Navigate to="/" replace />
  const nextRound = game.rounds.length + 1
  const complete = nextRound > game.totalRounds
  return (
    <main className="page">
      <Header title={game.name} backTo="/" game={game} />
      <section className="sheet-heading">
        <div>
          <p className="eyebrow">{modeNames[game.mode]}</p>
          <h2>{complete ? 'Partie terminée' : `Manche ${nextRound} sur ${game.totalRounds}`}</h2>
        </div>
        <span>{game.players.length} joueurs</span>
      </section>
      <div className="score-sheet-wrap">
        <table className="score-sheet">
          <thead>
            <tr>
              <th>Manche</th>
              {game.players.map((player) => (
                <th key={player.id}>{player.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: game.totalRounds }, (_, index) => index + 1).map((roundNumber) => {
              const playedRound = game.rounds.find((item) => item.round === roundNumber)
              return (
                <tr
                  className={roundNumber === nextRound ? 'current' : playedRound ? 'played' : ''}
                  key={roundNumber}
                  onClick={() => playedRound && navigate(`/games/${game.id}/round/${roundNumber}`)}
                >
                  <th>
                    <span className="round-cell">
                      {roundNumber}
                      {playedRound && <Pencil aria-label={`Modifier la manche ${roundNumber}`} />}
                    </span>
                  </th>
                  {game.players.map((player) => (
                    <td key={player.id}>
                      {playedRound?.entries.find((entry) => entry.playerId === player.id)?.score ?? '—'}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              {game.players.map((player) => (
                <td key={player.id}>{playerTotal(game, player.id)}</td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
      {!complete && (
        <Link className="fab-link" to={`/games/${game.id}/bids`}>
          Saisir les paris <ChevronRight />
        </Link>
      )}
    </main>
  )
}

interface BidDraft {
  playerId: string
  bid: number
  bidStyle: BidStyle
}

function BidsScreen() {
  const game = useCurrentGame()
  const navigate = useNavigate()
  const [bids, setBids] = useState<BidDraft[]>(
    () => game?.players.map((player) => ({ playerId: player.id, bid: 0, bidStyle: 'prudent' })) ?? [],
  )
  if (!game) return <Navigate to="/" replace />
  const round = game.rounds.length + 1
  const updateBid = (playerId: string, amount: number) =>
    setBids((current) =>
      current.map((bid) =>
        bid.playerId === playerId ? { ...bid, bid: Math.max(0, Math.min(round, bid.bid + amount)) } : bid,
      ),
    )
  return (
    <main className="page">
      <Header title={`Paris · Manche ${round}`} backTo={`/games/${game.id}`} game={game} />
      <div className="round-banner">
        <span>Total annoncé</span>
        <strong>{bids.reduce((total, bid) => total + bid.bid, 0)} plis</strong>
      </div>
      <section className="entry-list">
        {game.players.map((player) => {
          const draft = bids.find((bid) => bid.playerId === player.id)!
          return (
            <article className="entry-card" key={player.id}>
              <div className="entry-title">
                <h2>{player.name}</h2>
                {game.mode === 'enhanced' && (
                  <div className="segmented compact">
                    <button
                      type="button"
                      className={draft.bidStyle === 'prudent' ? 'active' : ''}
                      onClick={() =>
                        setBids((items) =>
                          items.map((item) => (item.playerId === player.id ? { ...item, bidStyle: 'prudent' } : item)),
                        )
                      }
                    >
                      Prudent
                    </button>
                    <button
                      type="button"
                      className={draft.bidStyle === 'risky' ? 'active risky' : ''}
                      onClick={() =>
                        setBids((items) =>
                          items.map((item) => (item.playerId === player.id ? { ...item, bidStyle: 'risky' } : item)),
                        )
                      }
                    >
                      Risqué
                    </button>
                  </div>
                )}
              </div>
              <div className="large-counter">
                <Button variant="secondary" onClick={() => updateBid(player.id, -1)}>
                  <Minus />
                </Button>
                <strong>{draft.bid}</strong>
                <Button variant="secondary" onClick={() => updateBid(player.id, 1)}>
                  <Plus />
                </Button>
              </div>
            </article>
          )
        })}
      </section>
      <Button
        className="sticky-action"
        onClick={() => navigate(`/games/${game.id}/round`, { state: { bids, cards: round } })}
      >
        Valider les paris
      </Button>
    </main>
  )
}

function Stepper({
  value,
  onChange,
  min = -200,
  max = 200,
  step = 1,
  label,
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label: string
}) {
  return (
    <div className="stepper" aria-label={label}>
      <Button variant="secondary" onClick={() => onChange(Math.max(min, value - step))}>
        <Minus />
      </Button>
      <strong>{value}</strong>
      <Button variant="secondary" onClick={() => onChange(Math.min(max, value + step))}>
        <Plus />
      </Button>
    </div>
  )
}

function RoundScreen() {
  const game = useCurrentGame()
  const { roundNumber } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const saveRound = useGameStore((state) => state.saveRound)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const state = location.state as { bids?: BidDraft[]; cards?: number } | null
  const requestedRound = roundNumber ? Number(roundNumber) : undefined
  const existingRound = game?.rounds.find((item) => item.round === requestedRound)
  const [cards, setCards] = useState(state?.cards ?? existingRound?.cards ?? (game?.rounds.length ?? 0) + 1)
  const [editing, setEditing] = useState<string | null>(null)
  const [entries, setEntries] = useState<RoundEntry[]>(
    () =>
      existingRound?.entries.map((entry) => ({ ...entry })) ??
      state?.bids?.map((bid) => ({ ...bid, tricks: 0, bonus: 0, score: 0 })) ??
      [],
  )
  useEffect(() => {
    if (game && entries.length === 0 && !existingRound) navigate(`/games/${game.id}/bids`, { replace: true })
  }, [entries.length, existingRound, game, navigate])
  if (!game) return <Navigate to="/" replace />
  const round = existingRound?.round ?? game.rounds.length + 1
  const scoreFor = (entry: RoundEntry) =>
    calculateRoundScore({
      mode: game.mode,
      round,
      cards,
      bid: entry.bid,
      tricks: entry.tricks,
      bonus: entry.bonus,
      bidStyle: entry.bidStyle,
    })
  const updateEntry = (playerId: string, patch: Partial<RoundEntry>) =>
    setEntries((current) => current.map((entry) => (entry.playerId === playerId ? { ...entry, ...patch } : entry)))
  const startLongPress = (event: PointerEvent, playerId: string) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    longPressTimer.current = setTimeout(() => setEditing(playerId), 550)
  }
  const cancelLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
  }
  const save = () => {
    saveRound(game.id, { round, cards, entries: entries.map((entry) => ({ ...entry, score: scoreFor(entry) })) })
    navigate(`/games/${game.id}`)
  }
  return (
    <main className="page">
      <Header
        title={`${existingRound ? 'Modifier' : 'Résultats'} · Manche ${round}`}
        backTo={existingRound ? `/games/${game.id}` : `/games/${game.id}/bids`}
        game={game}
      />
      <div className="round-banner">
        <span>Total annoncé</span>
        <strong>{entries.reduce((total, entry) => total + entry.bid, 0)} plis</strong>
      </div>
      <section className="cards-control">
        <div>
          <span>Cartes distribuées</span>
          <small>Ajuste la valeur de la manche</small>
        </div>
        <Stepper value={cards} min={1} max={20} onChange={setCards} label="Cartes distribuées" />
      </section>
      <section className="entry-list result-list">
        {game.players.map((player) => {
          const entry = entries.find((item) => item.playerId === player.id)
          if (!entry) return null
          const score = scoreFor(entry)
          return (
            <article className="entry-card result-card" key={player.id}>
              <div className="entry-title">
                <button
                  className="bid-summary"
                  type="button"
                  onPointerDown={(event) => startLongPress(event, player.id)}
                  onPointerUp={cancelLongPress}
                  onPointerCancel={cancelLongPress}
                  onContextMenu={(event) => {
                    event.preventDefault()
                    setEditing(player.id)
                  }}
                >
                  <h2>{player.name}</h2>
                  <span>
                    Pari {entry.bid}
                    {game.mode === 'enhanced' ? ` · ${entry.bidStyle === 'risky' ? 'risqué' : 'prudent'}` : ''}
                  </span>
                </button>
                <strong className={score < 0 ? 'score negative' : 'score'}>{formatScore(score)} pts</strong>
              </div>
              <div className="result-controls">
                <label>
                  Plis réalisés
                  <Stepper
                    value={entry.tricks}
                    min={0}
                    max={cards}
                    onChange={(tricks) => updateEntry(player.id, { tricks })}
                    label={`Plis réalisés par ${player.name}`}
                  />
                </label>
                <label>
                  Bonus / pénalités
                  <Stepper
                    value={entry.bonus}
                    step={5}
                    onChange={(bonus) => updateEntry(player.id, { bonus })}
                    label={`Bonus de ${player.name}`}
                  />
                </label>
              </div>
            </article>
          )
        })}
      </section>
      <Dialog.Root open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <Dialog.Portal>
          <Dialog.Backdrop className="dialog-backdrop" />
          <Dialog.Popup className="dialog-popup">
            <Dialog.Title className="dialog-title">Modifier le pari</Dialog.Title>
            {editing &&
              (() => {
                const entry = entries.find((item) => item.playerId === editing)!
                return (
                  <div className="dialog-form">
                    <Stepper
                      value={entry.bid}
                      min={0}
                      max={cards}
                      onChange={(bid) => updateEntry(editing, { bid })}
                      label="Pari"
                    />
                    <Dialog.Close render={<Button className="w-full" />}>Terminer</Dialog.Close>
                  </div>
                )
              })()}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      <Button className="sticky-action" onClick={save}>
        {existingRound ? 'Mettre à jour la manche' : 'Enregistrer la manche'}
      </Button>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/new" element={<NewGameScreen />} />
        <Route path="/games/:gameId" element={<GameScreen />} />
        <Route path="/games/:gameId/bids" element={<BidsScreen />} />
        <Route path="/games/:gameId/round" element={<RoundScreen />} />
        <Route path="/games/:gameId/round/:roundNumber" element={<RoundScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
