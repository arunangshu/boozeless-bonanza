import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    background: '#050518',
    text: '#ffffff',
    primary: '#ff8c00',
    secondary: '#ff00ff',
    accent: '#9900ff',
    dark: '#0c0c20',
    light: '#8080ff',
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
`; 