import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { GameMode } from '../types';
import {
  Section,
  GameModeContainer,
  GameModeButton,
  Message,
  ActionButton,
} from './styled';

const GameModes: React.FC = () => {
  const { state, chooseGameMode, isGameModeDisabled, removePlayer, spinWheel, finishTurn } = useGame();
  const { currentPlayer, gameMode, gameHistory } = state;

  if (!currentPlayer || gameMode) return null;

  const modes = Object.values(GameMode);
  
  // Check if this is the first turn and force Trivia
  const isFirstTurn = gameHistory.length === 0;
  
  // Check if only Dare is available due to 5 turns rule
  const onlyDareAllowed = 
    gameHistory.length >= 5 && 
    !gameHistory.slice(-5).some(h => h.gameMode === GameMode.DARE);

  const handlePlayerLeft = () => {
    if (currentPlayer) {
      console.log('Player Left button clicked - GameModes.tsx');
      console.log('Current player:', currentPlayer.name);
      console.log('Total players before removing:', state.players.length);
      
      // Remove the player first
      removePlayer(currentPlayer.id);
      console.log('Player removed, remaining players:', state.players.length - 1);
      
      // Reset game state regardless of player count
      finishTurn();
      console.log('Finish turn called');
      
      // Small delay to ensure state updates
      setTimeout(() => {
        console.log('Checking if players remain after timeout:', state.players.length - 1);
        // Only spin the wheel if there are players left
        if (state.players.length > 1) {
          console.log('Spinning wheel - players remain');
          spinWheel();
        } else {
          console.log('Not spinning - no players or only one player left');
          // If there are no players left, we don't need to do anything else
          // The UI will show the add player screen automatically
        }
      }, 200); // Increased timeout for more reliable state update
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
            <h3 className="neon-text-purple">{currentPlayer.name}, choose your challenge:</h3>
          </motion.div>
        </Message>
        
        <GameModeContainer>
          {modes.map((mode) => {
            // Disable all modes except Trivia for first turn
            const disabledDueToFirstTurn = isFirstTurn && mode !== GameMode.TRIVIA;
            // Disable all modes except Dare if 5-turn rule applies
            const disabledDueToDareRule = onlyDareAllowed && mode !== GameMode.DARE;
            // Regular disabled check (duplicate mode 3x in a row)
            const disabledDueToRepetition = !disabledDueToFirstTurn && !disabledDueToDareRule && isGameModeDisabled(mode);
            
            const disabled = disabledDueToFirstTurn || disabledDueToDareRule || disabledDueToRepetition;
            
            const color = 
              mode === GameMode.TRIVIA ? 'cyan' :
              mode === GameMode.TRUTH ? 'primary' :
              mode === GameMode.DARE ? 'secondary' :
              mode === GameMode.SITUATION ? 'accent' :
              'primary';
            
            // Create custom style for Trivia button to use cyan color
            const buttonStyle = mode === GameMode.TRIVIA ? {
              border: '2px solid #00ffff',
              color: '#00ffff',
              boxShadow: '0 0 10px #00ffff, inset 0 0 5px #00ffff',
              textShadow: '0 0 5px #00ffff'
            } : {};
            
            return (
              <motion.div
                key={mode}
                whileHover={!disabled ? { scale: 1.05, y: -5 } : {}}
                whileTap={!disabled ? { scale: 0.95 } : {}}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <GameModeButton
                  onClick={() => !disabled && chooseGameMode(mode)}
                  $color={color !== 'cyan' ? color : 'primary'} 
                  disabled={disabled}
                  $disabled={disabled}
                  style={buttonStyle}
                >
                  <div className={`${mode === GameMode.TRIVIA ? 'neon-text-cyan' : `neon-text-${color === 'primary' ? '' : color === 'secondary' ? 'pink' : 'purple'}`}`}>
                    {mode}
                  </div>
                </GameModeButton>
              </motion.div>
            );
          })}
        </GameModeContainer>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          marginTop: '10px',
          flexDirection: isFirstTurn || onlyDareAllowed || modes.some(mode => isGameModeDisabled(mode)) ? 'column' : 'row'
        }}>
          {/* Player Left button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <ActionButton
              onClick={handlePlayerLeft}
              $color="secondary"
            >
              Player Left. Spin Again
            </ActionButton>
          </motion.div>

          {/* Display rules messages when needed */}
          {(isFirstTurn || onlyDareAllowed || modes.some(mode => isGameModeDisabled(mode))) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <Message $type="info" style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                {isFirstTurn && (
                  <p>First player must choose Trivia to start the game!</p>
                )}
                
                {onlyDareAllowed && (
                  <p>It's been 5 turns without Dare - you must choose Dare this turn!</p>
                )}
                
                {!isFirstTurn && !onlyDareAllowed && Object.values(GameMode).some(mode => isGameModeDisabled(mode)) && (
                  <>
                    {Object.values(GameMode).filter(mode => isGameModeDisabled(mode)).map(mode => (
                      <p key={mode}>
                        {mode} cannot be chosen twice in a row.
                      </p>
                    ))}
                  </>
                )}
              </Message>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Section>
  );
};

export default GameModes; 