import styled, { css, keyframes } from 'styled-components';
import { theme } from '../../theme';
import { createGlobalStyle } from 'styled-components';

// Animations
const flicker = keyframes`
  0%, 100% { opacity: 1; }
  33% { opacity: 0.8; }
  66% { opacity: 0.9; }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 5px ${theme.colors.primary}, 0 0 10px ${theme.colors.primary}; }
  50% { box-shadow: 0 0 15px ${theme.colors.primary}, 0 0 20px ${theme.colors.primary}; }
  100% { box-shadow: 0 0 5px ${theme.colors.primary}, 0 0 10px ${theme.colors.primary}; }
`;

const glitch = keyframes`
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Layout Components
export const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  width: 100%;
  padding: 0 10px;
  max-width: 100%;
  overflow: hidden;
`;

export const Title = styled.h1`
  font-size: min(5vw, 4rem);
  margin: 0 0 25px 0;
  background: linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary}, ${theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: ${theme.glowEffects.primary};
  letter-spacing: 3px;
  animation: ${flicker} 5s infinite;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -15px;
    width: 80%;
    height: 2px;
    transform: translateX(-50%);
    background: ${theme.colors.primary};
    box-shadow: 0 0 10px 2px ${theme.colors.primary};
    
    /* Archaic style with fading/thinning ends */
    mask-image: linear-gradient(
      to right,
      transparent,
      black 20%,
      black 80%,
      transparent
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent,
      black 20%,
      black 80%,
      transparent
    );
  }
`;

export const Section = styled.section`
  margin-bottom: 20px;
  position: relative;
`;

// Button Components
export const Button = styled.button<{ $color?: 'primary' | 'secondary' | 'accent' }>`
  background-color: rgba(10, 10, 30, 0.7);
  color: ${({ $color }) => $color ? theme.colors[$color] : theme.colors.primary};
  border: 2px solid ${({ $color }) => $color ? theme.colors[$color] : theme.colors.primary};
  padding: 12px 24px;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px ${({ $color }) => $color ? theme.colors[$color] : theme.colors.primary},
              inset 0 0 5px ${({ $color }) => $color ? theme.colors[$color] : theme.colors.primary};
  text-shadow: 0 0 5px ${({ $color }) => $color ? theme.colors[$color] : theme.colors.primary};
  
  &:hover, &:focus {
    background-color: rgba(20, 20, 40, 0.9);
    box-shadow: 0 0 15px ${({ $color }) => $color ? theme.colors[$color] : theme.colors.primary},
                0 0 25px ${({ $color }) => $color ? theme.colors[$color] : theme.colors.primary},
                inset 0 0 8px ${({ $color }) => $color ? theme.colors[$color] : theme.colors.primary};
    text-shadow: 0 0 8px ${({ $color }) => $color ? theme.colors[$color] : theme.colors.primary};
    transform: translateY(-3px);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
    background-color: rgba(10, 10, 20, 0.5);
    transform: none;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
    pointer-events: none;
  }

  &:hover:not(:disabled):before {
    left: 100%;
  }
`;

export const CircleButton = styled(Button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

export const GameModeButton = styled(Button)<{ $disabled?: boolean }>`
  width: 180px;
  margin: 5px;
  padding: 15px 10px;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  position: relative;
  
  ${({ $disabled }) => $disabled && css`
    opacity: 0.3;
    cursor: not-allowed;
  `}
  
  &:hover:not(:disabled) {
    transform: translateY(-5px) scale(1.05);
  }
`;

// Wheel components
export const WheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;
  position: relative;
`;

export const Wheel = styled.div<{ $spinning?: boolean }>`
  width: 400px;
  height: 400px;
  border-radius: 50%;
  position: relative;
  border: 4px solid ${theme.colors.primary};
  background-color: rgba(10, 10, 30, 0.8);
  overflow: hidden;
  box-shadow: 0 0 20px ${theme.colors.primary}, inset 0 0 20px ${theme.colors.primary};
  transform-origin: center;
  transition: transform 0.1s ease-in-out;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 30%, rgba(0, 255, 255, 0.2) 90%);
    border-radius: 50%;
    z-index: 1;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    background-color: #fff;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
    z-index: 2;
  }
  
  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
`;

export const SpinButton = styled(CircleButton)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  z-index: 2;
  font-size: 1.2rem;
  font-weight: bold;
  animation: ${pulse} 2s infinite;
  background-color: rgba(0, 0, 20, 0.8);
  
  &:hover, &:focus {
    transform: translate(-50%, -50%);
    box-shadow: 0 0 15px ${theme.colors.primary},
                0 0 25px ${theme.colors.primary},
                inset 0 0 8px ${theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    font-size: 1rem;
  }
`;

export const WheelSegment = styled.div<{ $index: number; $total: number }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 50%;
  transform-origin: bottom left;
  transform: rotate(${({ $index, $total }) => ($index * (360 / $total))}deg) skewY(${({ $total }) => 90 - 360 / $total}deg);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  overflow: hidden;
  padding-top: 5px;
  
  /* For odd number of players, adjust the segments slightly */
  ${({ $total }) => $total % 2 !== 0 && css`
    padding-top: ${$total < 5 ? '8px' : '5px'};
    justify-content: ${$total < 5 ? 'center' : 'flex-end'};
  `}
  
  &:nth-child(odd) {
    background-color: rgba(0, 255, 255, 0.2);
    border: 1px solid rgba(0, 255, 255, 0.4);
  }
  
  &:nth-child(even) {
    background-color: rgba(255, 0, 255, 0.2);
    border: 1px solid rgba(255, 0, 255, 0.4);
  }
`;

export const WheelText = styled.span<{ $total: number }>`
  transform: skewY(${({ $total }) => -(90 - 360 / $total)}deg) rotate(${({ $total }) => 360 / $total / 2}deg);
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 10px;
  margin-right: ${({ $total }) => $total % 2 === 0 ? '40px' : 
    ($total === 3 ? '15px' : 
     $total === 5 ? '25px' : 
     $total === 7 ? '30px' : '35px')};
  color: ${theme.colors.text};
  text-shadow: 0 0 8px ${theme.colors.primary}, 0 0 15px ${theme.colors.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

// Trivia components
export const QuestionCard = styled.div`
  background-color: ${theme.colors.dark};
  border: 2px solid #00ffff;
  border-radius: 10px;
  padding: 30px;
  margin: 20px 0;
  position: relative;
  box-shadow: 0 0 20px #00ffff;
  
  &:before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border: 1px solid #00ffff;
    border-radius: 12px;
    pointer-events: none;
    opacity: 0.5;
  }
`;

export const QuestionText = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: ${theme.colors.text};
  text-shadow: 0 0 5px #00ffff;
`;

export const AnswerInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  margin: 10px 0;
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px solid ${theme.colors.secondary};
  border-radius: 5px;
  color: ${theme.colors.text};
  font-size: 1.2rem;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    box-shadow: 0 0 10px ${theme.colors.secondary};
  }
`;

// Player management
export const PlayersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
`;

export const PlayerCard = styled.li`  background-color: ${theme.colors.dark};
  border: 2px solid ${theme.colors.accent};
  border-radius: 8px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 0 10px ${theme.colors.accent};
    transform: translateY(-3px);
  }
`;

export const PlayerName = styled.span`
  color: ${theme.colors.text};
  font-size: 1.1rem;
  text-shadow: 0 0 5px ${theme.colors.accent};
`;

export const RemoveButton = styled.button`
  background-color: transparent;
  color: ${theme.colors.secondary};
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    color: #ff0000;
    text-shadow: 0 0 5px #ff0000;
  }
`;

export const PlayerInput = styled.input`
  width: 100%;
  max-width: 300px;
  padding: 12px 20px;
  margin-right: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px solid ${theme.colors.accent};
  border-radius: 5px;
  color: ${theme.colors.text};
  font-size: 1.2rem;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    box-shadow: 0 0 10px ${theme.colors.accent};
  }
`;

export const AddPlayerForm = styled.form`
  display: flex;
  align-items: center;
  margin: 20px 0;
  flex-wrap: wrap;
  gap: 10px;
`;

// Modal
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

export const ModalContent = styled.div`
  background-color: ${theme.colors.dark};
  border: 2px solid ${theme.colors.primary};
  border-radius: 10px;
  padding: 30px;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 0 30px ${theme.colors.primary};
  position: relative;
  animation: ${glitch} 0.3s;
`;

export const ModalTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: ${theme.colors.primary};
  text-shadow: 0 0 10px ${theme.colors.primary};
`;

export const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px solid ${theme.colors.primary};
  border-radius: 5px;
  color: ${theme.colors.text};
  font-size: 1rem;
  outline: none;
`;

export const ModalButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

// Game mode container
export const GameModeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 10px 0;
  gap: 15px;
`;

// Message
export const Message = styled.div<{ $type?: 'success' | 'error' | 'info' }>`
  padding: 10px;
  margin: 15px 0;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  background-color: ${theme.colors.dark};
  border: 2px solid ${({ $type }) => 
    $type === 'success' ? '#00ff00' :
    $type === 'error' ? '#ff0000' :
    '#00ffff'
  };
  color: ${({ $type }) => 
    $type === 'success' ? '#00ff00' :
    $type === 'error' ? '#ff0000' :
    '#00ffff'
  };
  box-shadow: 0 0 10px ${({ $type }) => 
    $type === 'success' ? '#00ff00' :
    $type === 'error' ? '#ff0000' :
    '#00ffff'
  };
  
  h3 {
    font-size: 1.4rem;
    margin-bottom: 5px;
  }
  
  p {
    margin: 5px 0;
  }
`;

// Navigation buttons
export const NavButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
`;

export const ActionButton = styled(Button)`
  margin-top: 10px;
  font-size: 1.1rem;
  padding: 12px 20px;
  min-width: 180px;
`;

// New component for trivia options
export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 25px 0;
`;

export const OptionButton = styled(Button)<{ $selected?: boolean }>`
  text-align: left;
  text-transform: none;
  padding: 15px 20px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  position: relative;
  letter-spacing: 1px;
  border-width: ${({ $selected }) => $selected ? '3px' : '2px'};
  background-color: ${({ $selected }) => $selected ? 'rgba(40, 40, 70, 0.9)' : 'rgba(20, 20, 40, 0.7)'};
  box-shadow: ${({ $selected, $color }) => 
    $selected 
      ? `0 0 15px ${$color ? theme.colors[$color] : theme.colors.primary}, 
         0 0 25px ${$color ? theme.colors[$color] : theme.colors.primary}`
      : `0 0 10px ${$color ? theme.colors[$color] : theme.colors.primary}`
  };
  
  /* Make button content align properly */
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 65px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.01);
    background-color: rgba(30, 30, 60, 0.8);
  }
`;

// Dropdown Components
export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  margin-bottom: 20px;
`;

export const DropdownButton = styled(Button)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &:after {
    content: '';
    margin-left: 10px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid currentColor;
    transition: transform 0.3s ease;
  }
  
  &[aria-expanded="true"]:after {
    transform: rotate(180deg);
  }
`;

export const DropdownContent = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  position: absolute;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  z-index: 100;
  background-color: ${theme.colors.dark};
  border: 2px solid ${theme.colors.primary};
  border-radius: 8px;
  box-shadow: 0 0 15px ${theme.colors.primary};
  margin-top: 10px;
  padding: 15px;
  animation: ${({ $isOpen }) => $isOpen ? 'fadeIn 0.3s ease' : 'none'};
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary};
    border-radius: 4px;
    box-shadow: 0 0 6px ${theme.colors.primary};
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${theme.fonts.main};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    background-image: 
      url('/images/starry-background.jpg'),
      radial-gradient(circle at 50% 50%, rgba(25, 25, 112, 0.3) 0%, transparent 80%),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 20, 0.9) 100%);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    min-height: 100vh;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.secondary};
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  button {
    font-family: ${theme.fonts.main};
    cursor: pointer;
    transition: all 0.3s ease;
  }

  /* Neon text effect */
  .neon-text {
    text-shadow: ${theme.glowEffects.primary};
  }

  .neon-text-pink {
    text-shadow: ${theme.glowEffects.secondary};
  }

  .neon-text-purple {
    text-shadow: ${theme.glowEffects.accent};
  }
  
  /* Cyan neon text effect */
  .neon-text-cyan {
    text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
  }
`; 
