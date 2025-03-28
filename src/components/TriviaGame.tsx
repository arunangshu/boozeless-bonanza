import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { GameMode } from '../types';
import {
  Section,
  QuestionCard,
  QuestionText,
  Message,
  ActionButton,
  OptionsContainer,
  OptionButton
} from './styled';

// Option labels for multiple choice
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const TriviaGame: React.FC = () => {
  const { state, finishTurn, getRandomQuestion, removePlayer, spinWheel } = useGame();
  const { currentPlayer, gameMode, currentQuestion } = state;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

  // Reset the component state when a new player is chosen or game mode changes
  useEffect(() => {
    if (currentPlayer && gameMode === GameMode.TRIVIA) {
      setSelectedOption(null);
      setSelectedIndex(null);
      setResult(null);
    }
  }, [currentPlayer, gameMode]);
  
  // If not in trivia mode, don't render
  if (!currentPlayer || gameMode !== GameMode.TRIVIA || !currentQuestion) return null;

  const handleOptionSelect = (option: string, index: number) => {
    if (result !== null) return; // Prevent selection after result is shown
    setSelectedOption(option);
    setSelectedIndex(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || selectedIndex === null) return;
    
    // Check if answer is correct
    let isCorrect = false;
    
    // If we have a correctOptionIndex property, use that for validation
    if (currentQuestion.correctOptionIndex !== undefined) {
      isCorrect = selectedIndex === currentQuestion.correctOptionIndex;
    } else {
      // Fallback to text comparison
      isCorrect = selectedOption.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
    }
    
    setResult(isCorrect ? 'correct' : 'incorrect');
  };

  const handleFinishTurn = () => {
    // Reset local state
    setSelectedOption(null);
    setSelectedIndex(null);
    setResult(null);
    
    // Call the global finishTurn
    finishTurn();
  };

  const handlePlayerLeft = () => {
    if (currentPlayer) {
      // Reset local state
      setSelectedOption(null);
      setSelectedIndex(null);
      setResult(null);
      
      // Remove player and reset game state
      removePlayer(currentPlayer.id);
      // Reset game state to ensure we go back to the spinner
      finishTurn(); // This will clear currentPlayer and gameMode
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
        key={currentPlayer.id} // Force re-render when player changes
      >
        <QuestionCard>
          <QuestionText>{currentQuestion.question}</QuestionText>

          {/* Check if options are "short" based on average length */}
          {(() => {
            // Calculate average option length
            const avgLength = currentQuestion.options
              ? currentQuestion.options.reduce((sum, opt) => sum + opt.length, 0) / currentQuestion.options.length
              : 0;
            
            // If average length is less than 20 characters, use grid layout
            const useGridLayout = avgLength < 20;
            
            return (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                margin: '25px 0',
              }}>
                {useGridLayout ? (
                  // Grid layout for short options (2x2)
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '15px',
                    width: '100%',
                  }}>
                    {currentQuestion.options?.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <OptionButton
                          onClick={() => handleOptionSelect(option, index)}
                          $selected={selectedIndex === index}
                          $color="secondary"
                          disabled={result !== null}
                        >
                          <span style={{ 
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '30px', 
                            height: '30px',
                            minWidth: '30px',
                            borderRadius: '50%',
                            background: 'rgba(255, 0, 255, 0.2)',
                            marginRight: '15px',
                            fontWeight: 'bold',
                            border: '1px solid rgba(255, 0, 255, 0.5)'
                          }}>
                            {OPTION_LABELS[index]}
                          </span>
                          <span>{option}</span>
                        </OptionButton>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  // Original vertical layout for longer options
                  <OptionsContainer>
                    {currentQuestion.options?.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <OptionButton
                          onClick={() => handleOptionSelect(option, index)}
                          $selected={selectedIndex === index}
                          $color="secondary"
                          disabled={result !== null}
                        >
                          <span style={{ 
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '30px', 
                            height: '30px',
                            minWidth: '30px',
                            borderRadius: '50%',
                            background: 'rgba(255, 0, 255, 0.2)',
                            marginRight: '15px',
                            fontWeight: 'bold',
                            border: '1px solid rgba(255, 0, 255, 0.5)'
                          }}>
                            {OPTION_LABELS[index]}
                          </span>
                          <span>{option}</span>
                        </OptionButton>
                      </motion.div>
                    ))}
                  </OptionsContainer>
                )}
              </div>
            );
          })()}

          {selectedOption && !result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ textAlign: 'center' }}
            >
              <ActionButton
                onClick={handleSubmit}
                $color="secondary"
              >
                Submit Answer
              </ActionButton>
            </motion.div>
          )}
        </QuestionCard>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Message $type={result === 'correct' ? 'success' : 'error'}>
              {result === 'correct' ? (
                <p>Correct! Great job!</p>
              ) : (
                <p>Sorry, that's not the right answer.</p>
              )}
            </Message>

            <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <ActionButton
                onClick={handleFinishTurn}
                $color="primary"
              >
                Back to Spinner
              </ActionButton>
              
              <ActionButton
                onClick={handlePlayerLeft}
                $color="secondary"
              >
                Player Left. Spin Again
              </ActionButton>
            </div>
          </motion.div>
        )}
        
        {/* Player Left button always visible */}
        {!result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}
          >
            <ActionButton
              onClick={handlePlayerLeft}
              $color="secondary"
            >
              Player Left. Spin Again
            </ActionButton>
          </motion.div>
        )}
      </motion.div>
    </Section>
  );
};

export default TriviaGame; 