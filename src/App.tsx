import React from 'react';
import { motion } from 'framer-motion';
import { GameProvider } from './context/GameContext';
import { GlobalStyle } from './theme';
import { Container, Header, Title } from './components/styled';
import PlayerManagement from './components/PlayerManagement';
import SpinningWheel from './components/SpinningWheel';
import GameModes from './components/GameModes';
import TriviaGame from './components/TriviaGame';
import OtherGameModes from './components/OtherGameModes';

function App() {
  return (
    <>
      <GlobalStyle />
      <GameProvider>
        <Container>
          <Header>
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 200,
                damping: 20,
                duration: 0.8
              }}
            >
              <Title>Boozeless Bonanza</Title>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div style={{ marginTop: '10px', fontSize: '1.2rem', fontStyle: 'italic' }}>
                  <span className="neon-text-pink">Enter at your own risk!</span>
                </div>
              </motion.div>
            </motion.div>
          </Header>

          <PlayerManagement />
          <SpinningWheel />
          <GameModes />
          <TriviaGame />
          <OtherGameModes />
        </Container>
      </GameProvider>
    </>
  );
}

export default App;
