import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { GameMode } from '../types';
import {
  Section,
  QuestionCard,
  QuestionText,
  ActionButton,
  Message,
  Button,
} from './styled';

// Sample challenges for each mode
const challenges = {
  [GameMode.TRUTH]: [
    "What's something you've never told anyone?",
    "What's your biggest fear?",
    "What's the most embarrassing thing you've ever done?",
    "What's a secret talent you have?",
    "What's the weirdest dream you've ever had?",
  ],
  [GameMode.DARE]: [
    "Do your best impression of another player.",
    "Send a funny selfie to your most recent contact.",
    "Speak in an accent for the next 5 minutes.",
    "Call the 5th contact in your phone and sing them happy birthday.",
    "Let the group post something on your social media.",
  ],
  [GameMode.SITUATION]: [
    "What would you do if you won a million dollars?",
    "How would you react if you saw a ghost?",
    "What would you do if you were invisible for a day?",
    "How would you survive a zombie apocalypse?",
    "What would you do if you could time travel?",
  ],
};

const OtherGameModes: React.FC = () => {
  const { state, finishTurn, removePlayer, spinWheel } = useGame();
  const { currentPlayer, lastPlayer, gameMode, gameHistory } = state;
  const [isPlayerLeft, setIsPlayerLeft] = useState(false);

  // Only render for Truth, Dare, and Situation modes
  if (!currentPlayer || !gameMode || gameMode === GameMode.TRIVIA) return null;

  // Choose a random challenge from the appropriate category
  const challengeList = challenges[gameMode];
  const randomIndex = Math.floor(Math.random() * challengeList.length);
  const challenge = challengeList[randomIndex];

  // Determine the color based on the game mode
  const getColor = () => {
    switch (gameMode) {
      case GameMode.TRUTH:
        return 'primary';
      case GameMode.DARE:
        return 'secondary';
      case GameMode.SITUATION:
        return 'accent';
      default:
        return 'primary';
    }
  };

  const handlePlayerLeft = () => {
    setIsPlayerLeft(true);
    if (currentPlayer) {
      // Remove player and reset game state
      removePlayer(currentPlayer.id);
      finishTurn(); // This clears currentPlayer and gameMode
      // Force spinner to appear
      setTimeout(() => {
        spinWheel();
      }, 100);
    }
  };

  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Message>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className={`neon-text-${getColor() === 'primary' ? '' : getColor() === 'secondary' ? 'pink' : 'purple'}`}>
              {currentPlayer.name}'s {gameMode} Challenge
            </h3>
          </motion.div>
        </Message>

        <QuestionCard>
          <QuestionText style={{ textAlign: 'center' }}>
            {lastPlayer ? (
              <>
                <span className="neon-text-pink">{lastPlayer.name}</span>, please give <span className="neon-text">{currentPlayer.name}</span> a {gameMode.toLowerCase()} challenge.
                <div style={{ marginTop: '20px', fontSize: '1.1rem' }}>
                  When done, click "Back to Spinner" to continue the game.
                </div>
              </>
            ) : (
              <>
                Since this is the first turn, the group should give <span className="neon-text">{currentPlayer.name}</span> a {gameMode.toLowerCase()} challenge.
                <div style={{ marginTop: '20px', fontSize: '1.1rem' }}>
                  When done, click "Back to Spinner" to continue the game.
                </div>
              </>
            )}
          </QuestionText>
        </QuestionCard>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ margin: '0 10px' }}
          >
            <ActionButton
              onClick={finishTurn}
              $color={getColor() as 'primary' | 'secondary' | 'accent'}
            >
              Back to Spinner
            </ActionButton>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ margin: '0 10px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ActionButton
              onClick={handlePlayerLeft}
              $color="secondary"
            >
              Player Left. Spin Again
            </ActionButton>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
};

export default OtherGameModes; 