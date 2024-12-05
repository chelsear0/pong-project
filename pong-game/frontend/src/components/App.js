import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import GamePage from './components/GamePage';
import BotGame from './components/BotGame';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/bot" element={<BotGame />} />
      </Routes>
    </Router>
  );
};

export default App;
