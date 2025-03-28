# Boozeless Bonanza

A futuristic neon arcade-themed party game where players take turns spinning a wheel and completing challenges in Truth, Dare, Situation, or Trivia modes.

## Features

- **Spinning Wheel**: Randomly selects players with weighted probabilities
- **Multiple Game Modes**: Truth, Dare, Situation, and Trivia
- **Special Rules**:
  - The same game mode cannot be chosen thrice in a row
  - If Dare is not chosen for five consecutive turns, the next player must choose Dare
- **Player Management**: Add or remove players
- **Reset Counter**: Reset game statistics with password protection

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Technologies Used

- React
- TypeScript
- Styled Components
- Framer Motion for animations

## Game Rules

1. Players take turns spinning the wheel
2. After the first spin, there's a 15% chance that the last player gets to choose the next player
3. Player selection probabilities are weighted based on a formula: 10^(-(number of times chosen))
4. Players choose between Truth, Situation, Dare, or Trivia
5. In Trivia mode, players answer questions from a database
6. Special rules enforce variety in game mode selection

## Customization

- Add your own trivia questions by editing the `public/data/questions.csv` file
- Modify sample challenges for Truth, Dare, and Situation modes in the `OtherGameModes.tsx` file
