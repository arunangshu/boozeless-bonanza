import { createGlobalStyle, keyframes } from 'styled-components';

// Define animations
const pulseAnimation = keyframes`
  0% { text-shadow: 0 0 20px rgba(255, 128, 0, 0.7); }
  50% { text-shadow: 0 0 30px rgba(255, 0, 255, 0.9), 0 0 40px rgba(0, 255, 255, 0.7); }
  100% { text-shadow: 0 0 20px rgba(2, 216, 27, 0.7); }
`;

export const theme = {
  colors: {
    background: '#050518',
    text: '#ffffff',
    primary: '#ff8c00',
    secondary: '#ff00ff',
    accent: '#9900ff',
    dark: '#0c0c20',
    light: '#8080ff',
    cyan: '#00ffff',
  },
  fonts: {
    main: "'Orbitron', sans-serif",
    secondary: "'Audiowide', cursive",
  },
  glowEffects: {
    primary: '0 0 10px #ff8c00, 0 0 20px #ff8c00, 0 0 30px #ff8c00',
    secondary: '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff',
    accent: '0 0 10px #9900ff, 0 0 20px #9900ff, 0 0 30px #9900ff',
    cyan: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
  },
};

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
    text-shadow: ${theme.glowEffects.cyan};
  }

  /* Neon button classes */
  .neon-button {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
    box-shadow: 0 0 10px ${theme.colors.primary};
    text-shadow: ${theme.glowEffects.primary};
  }

  .neon-button-pink {
    border-color: ${theme.colors.secondary};
    color: ${theme.colors.secondary};
    box-shadow: 0 0 10px ${theme.colors.secondary};
    text-shadow: ${theme.glowEffects.secondary};
  }

  .neon-button-purple {
    border-color: ${theme.colors.accent};
    color: ${theme.colors.accent};
    box-shadow: 0 0 10px ${theme.colors.accent};
    text-shadow: ${theme.glowEffects.accent};
  }
  
  .neon-button-cyan {
    border-color: ${theme.colors.cyan};
    color: ${theme.colors.cyan};
    box-shadow: 0 0 10px ${theme.colors.cyan};
    text-shadow: ${theme.glowEffects.cyan};
  }

  /* Define animations */
  @keyframes pulse {
    0% { text-shadow: 0 0 20px rgba(0, 255, 255, 0.7); }
    50% { text-shadow: 0 0 30px rgba(255, 0, 255, 0.9), 0 0 40px rgba(0, 255, 255, 0.7); }
    100% { text-shadow: 0 0 20px rgba(0, 255, 255, 0.7); }
  }
`; 