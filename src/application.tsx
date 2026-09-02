import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ScrollToTop } from './components/scroll-to-top';
import { BidsScreen } from './screens/bids-screen';
import { GameScreen } from './screens/game-screen';
import { HomeScreen } from './screens/home-screen';
import { NewGameScreen } from './screens/new-game-screen';
import { RoundScreen } from './screens/round-screen';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<HomeScreen />} />
        <Route path='/new' element={<NewGameScreen />} />
        <Route path='/games/:gameId' element={<GameScreen />} />
        <Route path='/games/:gameId/bids' element={<BidsScreen />} />
        <Route path='/games/:gameId/round' element={<RoundScreen />} />
        <Route path='/games/:gameId/round/:roundNumber' element={<RoundScreen />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}
