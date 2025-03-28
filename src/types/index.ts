export type Player = {
  id: string;
  name: string;
  timesChosen: number;
};

export type GameHistory = {
  player: Player;
  gameMode: GameMode;
  timestamp: number;
};

export type Question = {
  question: string;
  answer: string;
  category: string;
  options?: string[];
  correctOptionIndex?: number;
};

export enum GameMode {
  TRUTH = 'Truth',
  SITUATION = 'Situation',
  DARE = 'Dare',
  TRIVIA = 'Trivia',
}

export type GameState = {
  players: Player[];
  currentPlayer: Player | null;
  lastPlayer: Player | null;
  gameMode: GameMode | null;
  gameHistory: GameHistory[];
  isWheelSpinning: boolean;
  isLastPlayerChoosing: boolean;
  questions: Question[];
  currentQuestion: Question | null;
}; 