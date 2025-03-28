import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import {
  Section,
  Button,
  PlayersList,
  PlayerCard,
  PlayerName,
  RemoveButton,
  AddPlayerForm,
  PlayerInput,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalInput,
  ModalButtonsContainer,
  Message,
  DropdownContainer,
  DropdownButton,
  DropdownContent,
} from './styled';

const PlayerManagement: React.FC = () => {
  const { state, addPlayer, removePlayer, resetCounters, clearGameData } = useGame();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [modalPassword, setModalPassword] = useState('');
  const [resetMessage, setResetMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [clearMessage, setClearMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  const handleResetCounters = () => {
    const success = resetCounters(modalPassword);
    if (success) {
      setResetMessage({ text: 'Counters reset successfully!', type: 'success' });
      setModalPassword('');
      setTimeout(() => {
        setIsResetModalOpen(false);
        setResetMessage(null);
      }, 1500);
    } else {
      setResetMessage({ text: 'Incorrect password!', type: 'error' });
    }
  };
  
  const handleClearData = () => {
    const success = clearGameData(modalPassword);
    if (success) {
      setClearMessage({ text: 'Game data cleared successfully!', type: 'success' });
      setModalPassword('');
      setTimeout(() => {
        setIsClearModalOpen(false);
        setClearMessage(null);
      }, 1500);
    } else {
      setClearMessage({ text: 'Incorrect password!', type: 'error' });
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DropdownContainer>
          <DropdownButton 
            $color="primary" 
            onClick={toggleDropdown}
            aria-expanded={isDropdownOpen}
          >
            <span className="neon-text">Manage Players</span>
          </DropdownButton>
          
          <DropdownContent $isOpen={isDropdownOpen}>
            <AddPlayerForm onSubmit={handleAddPlayer}>
              <PlayerInput
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
              />
              <Button
                type="submit"
                $color="accent"
                disabled={!newPlayerName.trim()}
              >
                <span className="neon-text-purple">Add Player</span>
              </Button>
            </AddPlayerForm>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '15px' }}>
              <Button
                type="button"
                $color="secondary"
                onClick={() => setIsResetModalOpen(true)}
              >
                <span className="neon-text-pink">Reset Counters</span>
              </Button>
              
              <Button 
                type="button"
                $color="primary"
                onClick={() => setIsResetModalOpen(true)}
                style={{ 
                  background: 'rgba(255, 0, 100, 0.2)',
                  borderColor: 'rgba(255, 0, 100, 0.7)'
                }}
              >
                <span style={{ color: 'rgba(255, 0, 100, 0.9)', textShadow: '0 0 8px rgba(255, 0, 100, 0.7)' }}>
                  Reset Game
                </span>
              </Button>
              
              <Button 
                type="button"
                $color="primary"
                onClick={() => setIsClearModalOpen(true)}
                style={{ 
                  background: 'rgba(255, 50, 50, 0.2)',
                  borderColor: 'rgba(255, 50, 50, 0.7)'
                }}
              >
                <span style={{ color: 'rgba(255, 50, 50, 0.9)', textShadow: '0 0 8px rgba(255, 50, 50, 0.7)' }}>
                  Clear All Data
                </span>
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <PlayersList>
                {state.players.map((player) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PlayerCard>
                      <PlayerName>
                        {player.name} ({player.timesChosen})
                      </PlayerName>
                      <RemoveButton onClick={() => removePlayer(player.id)}>×</RemoveButton>
                    </PlayerCard>
                  </motion.div>
                ))}
              </PlayersList>
            </motion.div>
          </DropdownContent>
        </DropdownContainer>
      </motion.div>

      {isResetModalOpen && (
        <ModalOverlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent
            as={motion.div}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <ModalTitle>Reset Counters</ModalTitle>
            <p>Enter the password to reset all player counters:</p>
            <ModalInput
              type="password"
              value={modalPassword}
              onChange={(e) => setModalPassword(e.target.value)}
              placeholder="Password"
            />

            {resetMessage && (
              <Message $type={resetMessage.type}>
                {resetMessage.text}
              </Message>
            )}

            <ModalButtonsContainer>
              <Button $color="secondary" onClick={() => setIsResetModalOpen(false)}>
                <span className="neon-text-pink">Cancel</span>
              </Button>
              <Button $color="primary" onClick={handleResetCounters}>
                <span className="neon-text">Reset</span>
              </Button>
            </ModalButtonsContainer>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {isClearModalOpen && (
        <ModalOverlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent
            as={motion.div}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <ModalTitle style={{ color: '#ff5555' }}>⚠️ Clear All Game Data</ModalTitle>
            <p>This will delete all saved data and refresh the page. This action cannot be undone!</p>
            <p>Enter the admin password to continue:</p>
            
            <ModalInput
              type="password"
              value={modalPassword}
              onChange={(e) => setModalPassword(e.target.value)}
              placeholder="Password"
            />

            {clearMessage && (
              <Message $type={clearMessage.type}>
                {clearMessage.text}
              </Message>
            )}

            <ModalButtonsContainer>
              <Button $color="secondary" onClick={() => setIsClearModalOpen(false)}>
                <span className="neon-text-pink">Cancel</span>
              </Button>
              <Button $color="primary" onClick={handleClearData} style={{ borderColor: '#ff5555', color: '#ff5555' }}>
                <span style={{ textShadow: '0 0 8px #ff5555' }}>Clear All Data</span>
              </Button>
            </ModalButtonsContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </Section>
  );
};

export default PlayerManagement; 