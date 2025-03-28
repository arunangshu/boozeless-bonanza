import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameProvider } from './context/GameContext';
import { GlobalStyle } from './theme';
import { Container, Header, Title } from './components/styled';
import PlayerManagement from './components/PlayerManagement';
import SpinningWheel from './components/SpinningWheel';
import GameModes from './components/GameModes';
import TriviaGame from './components/TriviaGame';
import OtherGameModes from './components/OtherGameModes';
import starryBackground from './assets/starry-background.jpg';

function App() {
  // Apply the background image to document.body to ensure it works with GitHub Pages
  useEffect(() => {
    document.body.style.backgroundImage = `
      url(${starryBackground}),
      radial-gradient(circle at 50% 50%, rgba(25, 25, 112, 0.3) 0%, transparent 80%),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 20, 0.9) 100%)
    `;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundAttachment = '';
    };
  }, []);

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
