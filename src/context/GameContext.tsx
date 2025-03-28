import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GameMode, GameState, Player, Question } from '../types';
import Cookies from 'js-cookie';

// Cookie keys
const COOKIE_STATE_KEY = 'boozeless-bonanza-state';
const COOKIE_EXPIRY = 30; // Days

type GameAction =
  | { type: 'ADD_PLAYER'; payload: string }
  | { type: 'REMOVE_PLAYER'; payload: string }
  | { type: 'RESET_COUNTERS' }
  | { type: 'SET_CURRENT_PLAYER'; payload: Player | null }
  | { type: 'SET_LAST_PLAYER'; payload: Player | null }
  | { type: 'SET_GAME_MODE'; payload: GameMode | null }
  | { type: 'SET_WHEEL_SPINNING'; payload: boolean }
  | { type: 'SET_LAST_PLAYER_CHOOSING'; payload: boolean }
  | { type: 'PLAYER_PLAYED' }
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'SET_CURRENT_QUESTION'; payload: Question | null }
  | { type: 'RESTORE_STATE'; payload: Partial<GameState> };

// Get initial state from cookies or use default
const getInitialState = (): GameState => {
  try {
    const savedState = Cookies.get(COOKIE_STATE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState) as Partial<GameState>;
      return { 
        ...initialDefaultState, 
        ...parsedState,
        // Force these to false on initial load to avoid UI being stuck
        isWheelSpinning: false,
        isLastPlayerChoosing: parsedState.isLastPlayerChoosing || false
      };
    }
  } catch (error) {
    console.error('Error restoring state from cookies:', error);
  }
  return initialDefaultState;
};

const initialDefaultState: GameState = {
  players: [],
  currentPlayer: null,
  lastPlayer: null,
  gameMode: null,
  gameHistory: [],
  isWheelSpinning: false,
  isLastPlayerChoosing: false,
  questions: [],
  currentQuestion: null,
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  let newState: GameState;

  switch (action.type) {
    case 'ADD_PLAYER':
      if (state.players.some(player => player.name === action.payload)) {
        return state;
      }
      newState = {
        ...state,
        players: [
          ...state.players,
          {
            id: uuidv4(),
            name: action.payload,
            timesChosen: 0,
          },
        ],
      };
      break;
    case 'REMOVE_PLAYER':
      newState = {
        ...state,
        players: state.players.filter(player => player.id !== action.payload),
      };
      break;
    case 'RESET_COUNTERS':
      newState = {
        ...state,
        players: state.players.map(player => ({ ...player, timesChosen: 0 })),
        gameHistory: [],
      };
      break;
    case 'SET_CURRENT_PLAYER':
      newState = {
        ...state,
        currentPlayer: action.payload,
      };
      break;
    case 'SET_LAST_PLAYER':
      newState = {
        ...state,
        lastPlayer: action.payload,
      };
      break;
    case 'SET_GAME_MODE':
      newState = {
        ...state,
        gameMode: action.payload,
      };
      break;
    case 'SET_WHEEL_SPINNING':
      newState = {
        ...state,
        isWheelSpinning: action.payload,
      };
      break;
    case 'SET_LAST_PLAYER_CHOOSING':
      newState = {
        ...state,
        isLastPlayerChoosing: action.payload,
      };
      break;
    case 'PLAYER_PLAYED':
      if (!state.currentPlayer || !state.gameMode) {
        console.log('PLAYER_PLAYED: No current player or game mode, returning state');
        return state;
      }
      
      console.log('PLAYER_PLAYED action triggered');
      console.log('Current player before:', state.currentPlayer?.name);
      
      // Update player's timesChosen count
      const updatedPlayers = state.players.map(player => 
        player.id === state.currentPlayer?.id 
          ? { ...player, timesChosen: player.timesChosen + 1 } 
          : player
      );
      
      // Add to game history
      const newHistory = [
        ...state.gameHistory,
        {
          player: state.currentPlayer,
          gameMode: state.gameMode,
          timestamp: Date.now(),
        },
      ];
      
      newState = {
        ...state,
        players: updatedPlayers,
        lastPlayer: state.currentPlayer,
        currentPlayer: null,
        gameMode: null,
        gameHistory: newHistory,
      };
      
      console.log('PLAYER_PLAYED: State updated, currentPlayer set to null');
      break;
    case 'SET_QUESTIONS':
      newState = {
        ...state,
        questions: action.payload,
      };
      break;
    case 'SET_CURRENT_QUESTION':
      newState = {
        ...state,
        currentQuestion: action.payload,
      };
      break;
    case 'RESTORE_STATE':
      newState = {
        ...state,
        ...action.payload,
      };
      break;
    default:
      return state;
  }

  // Save state to cookies after each action
  // Exclude large or temporary data that doesn't need to be persisted
  const stateToSave = {
    ...newState,
    questions: [], // Don't store questions in cookies (too large)
    isWheelSpinning: false, // Reset wheel spinning state for refresh
  };
  
  try {
    Cookies.set(COOKIE_STATE_KEY, JSON.stringify(stateToSave), { expires: COOKIE_EXPIRY });
  } catch (error) {
    console.error('Error saving state to cookies:', error);
  }
  
  return newState;
};

interface GameContextType {
  state: GameState;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  resetCounters: (password: string) => boolean;
  spinWheel: () => void;
  chooseGameMode: (mode: GameMode) => void;
  finishTurn: () => void;
  choosePlayerManually: (playerId: string) => void;
  getRandomQuestion: () => Question | null;
  isGameModeDisabled: (mode: GameMode) => boolean;
  clearGameData: (password: string) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, getInitialState());

  // Load questions from CSV
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // First try to load the original questions.csv
        let response = await fetch('/data/questions.csv');
        
        // If it fails, fallback to our sample questions
        if (!response.ok) {
          console.warn("Could not load original questions.csv, trying sample-questions.csv");
          response = await fetch('/data/sample-questions.csv');
        }
        
        const text = await response.text();
        
        // Improved CSV parsing with proper handling of commas in fields
        const parseCsvLine = (line: string): string[] => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          
          if (current) {
            result.push(current.trim());
          }
          
          return result;
        };
        
        const rows = text.split('\n')
          .filter(row => row.trim())
          .map(row => parseCsvLine(row));
        
        const headers = rows[0];
        console.log("CSV Headers:", headers);
        
        // Detect if this is multiple-choice format (has A, B, C, D columns)
        const isMultipleChoice = headers.some(h => h === 'A') && 
                                headers.some(h => h === 'B') &&
                                headers.some(h => h === 'C') &&
                                headers.some(h => h === 'D');
        
        const questions: Question[] = [];
        
        if (isMultipleChoice) {
          // Multiple choice format parsing
          const questionIndex = headers.findIndex(h => 
            h.toLowerCase().includes('question') || h.toLowerCase() === 'q');
          const answerIndex = headers.findIndex(h => 
            h.toLowerCase() === 'answer' || h.toLowerCase() === 'ans');
          const optionAIndex = headers.findIndex(h => h === 'A');
          const optionBIndex = headers.findIndex(h => h === 'B');
          const optionCIndex = headers.findIndex(h => h === 'C');
          const optionDIndex = headers.findIndex(h => h === 'D');
          
          for (let i = 1; i < rows.length; i++) {
            const values = rows[i];
            if (values.length >= Math.max(questionIndex, answerIndex, optionAIndex, optionBIndex, optionCIndex, optionDIndex) + 1) {
              // Extract the correct answer letter
              const answerLetter = values[answerIndex].replace(/^"|"$/g, '').trim();
              
              // Get the answer text based on the letter
              let correctAnswerText = '';
              if (answerLetter === 'A') correctAnswerText = values[optionAIndex];
              else if (answerLetter === 'B') correctAnswerText = values[optionBIndex];
              else if (answerLetter === 'C') correctAnswerText = values[optionCIndex];
              else if (answerLetter === 'D') correctAnswerText = values[optionDIndex];
              else correctAnswerText = answerLetter; // If the answer is the actual text
              
              // Create options array
              const options = [
                values[optionAIndex].replace(/^"|"$/g, ''),
                values[optionBIndex].replace(/^"|"$/g, ''),
                values[optionCIndex].replace(/^"|"$/g, ''),
                values[optionDIndex].replace(/^"|"$/g, '')
              ];
              
              questions.push({
                question: values[questionIndex].replace(/^"|"$/g, ''),
                answer: correctAnswerText.replace(/^"|"$/g, ''),
                category: 'Trivia', // Default category for multiple choice
                options: options,
                correctOptionIndex: answerLetter.charCodeAt(0) - 65 // Convert A,B,C,D to 0,1,2,3
              });
            }
          }
        } else {
          // Standard format parsing
          const questionIndex = headers.findIndex(h => 
            h.toLowerCase().includes('question') || h.toLowerCase().includes('q'));
          const answerIndex = headers.findIndex(h => 
            h.toLowerCase().includes('answer') || h.toLowerCase().includes('a'));
          const categoryIndex = headers.findIndex(h => 
            h.toLowerCase().includes('category') || h.toLowerCase().includes('cat'));
          
          // Default to first three columns if headers can't be identified
          const qIdx = questionIndex >= 0 ? questionIndex : 0;
          const aIdx = answerIndex >= 0 ? answerIndex : 1;
          const cIdx = categoryIndex >= 0 ? categoryIndex : 2;
          
          for (let i = 1; i < rows.length; i++) {
            const values = rows[i];
            if (values.length >= Math.max(qIdx, aIdx, cIdx) + 1) {
              questions.push({
                question: values[qIdx].replace(/^"|"$/g, ''), // Remove quotes if present
                answer: values[aIdx].replace(/^"|"$/g, ''),
                category: values[cIdx].replace(/^"|"$/g, '') || 'General',
              });
            }
          }
        }
        
        console.log(`Loaded ${questions.length} questions from CSV`);
        
        // If no questions loaded, use sample questions as fallback
        if (questions.length === 0) {
          const sampleQuestions: Question[] = [
            {
              question: "What is the capital of France?",
              answer: "Paris",
              category: "Geography",
              options: ["Paris", "London", "Berlin", "Madrid"]
            },
            {
              question: "Who painted the Mona Lisa?",
              answer: "Leonardo da Vinci",
              category: "Art",
              options: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Michelangelo"]
            },
            {
              question: "What is the largest planet in our solar system?",
              answer: "Jupiter",
              category: "Science",
              options: ["Jupiter", "Saturn", "Earth", "Mars"]
            },
            {
              question: "In which year did World War II end?",
              answer: "1945",
              category: "History",
              options: ["1945", "1939", "1918", "1941"]
            },
            {
              question: "What is the chemical symbol for gold?",
              answer: "Au",
              category: "Science",
              options: ["Au", "Ag", "Fe", "Gd"]
            }
          ];
          dispatch({ type: 'SET_QUESTIONS', payload: sampleQuestions });
          console.log("Using sample questions as fallback");
        } else {
          dispatch({ type: 'SET_QUESTIONS', payload: questions });
        }
        
        // After loading questions, check if we need to restore a current question for Trivia mode
        if (state.gameMode === GameMode.TRIVIA && !state.currentQuestion) {
          const question = getRandomQuestion();
          if (question) {
            if (!question.options) {
              const questionWithOptions = generateOptionsForQuestion(question);
              dispatch({ type: 'SET_CURRENT_QUESTION', payload: questionWithOptions });
            } else {
              dispatch({ type: 'SET_CURRENT_QUESTION', payload: question });
            }
          }
        }
      } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback to sample questions
        const sampleQuestions: Question[] = [
          {
            question: "What is the capital of France?",
            answer: "Paris",
            category: "Geography",
            options: ["Paris", "London", "Berlin", "Madrid"]
          },
          {
            question: "Who painted the Mona Lisa?",
            answer: "Leonardo da Vinci",
            category: "Art",
            options: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Michelangelo"]
          },
          {
            question: "What is the largest planet in our solar system?",
            answer: "Jupiter",
            category: "Science",
            options: ["Jupiter", "Saturn", "Earth", "Mars"]
          },
          {
            question: "In which year did World War II end?",
            answer: "1945",
            category: "History",
            options: ["1945", "1939", "1918", "1941"]
          },
          {
            question: "What is the chemical symbol for gold?",
            answer: "Au",
            category: "Science",
            options: ["Au", "Ag", "Fe", "Gd"]
          }
        ];
        dispatch({ type: 'SET_QUESTIONS', payload: sampleQuestions });
        console.log("Using sample questions due to error loading CSV");
      }
    };
    
    fetchQuestions();
  }, []);

  const addPlayer = (name: string) => {
    dispatch({ type: 'ADD_PLAYER', payload: name });
  };

  const removePlayer = (id: string) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: id });
  };

  const resetCounters = (password: string) => {
    if (password === 'elysium') {
      dispatch({ type: 'RESET_COUNTERS' });
      // Clear cookies when counters are reset
      Cookies.remove(COOKIE_STATE_KEY);
      return true;
    }
    return false;
  };

  // Function to clear all game data (for troubleshooting)
  const clearGameData = (password: string) => {
    if (password === 'elysium') {
      Cookies.remove(COOKIE_STATE_KEY);
      // Reset to initial state
      window.location.reload();
      return true;
    }
    return false;
  };

  const spinWheel = () => {
    console.log('spinWheel called, players:', state.players.length);
    if (state.players.length === 0) {
      console.log('No players available, not spinning');
      return;
    }
    
    console.log('Setting wheel spinning to true');
    dispatch({ type: 'SET_WHEEL_SPINNING', payload: true });
    
    // Simulate spinning delay
    setTimeout(() => {
      console.log('Wheel spin timeout completed');
      const availablePlayers = state.players.filter(p => p.id !== state.lastPlayer?.id);
      console.log('Available players (excluding last):', availablePlayers.length);
      
      if (availablePlayers.length === 0) {
        console.log('No available players after filtering, stopping wheel');
        dispatch({ type: 'SET_WHEEL_SPINNING', payload: false });
        return;
      }
      
      const segments = [...availablePlayers];
      
      // Add "Last player chooses" segment after first spin
      if (state.gameHistory.length > 0 && state.lastPlayer) {
        segments.push({ id: 'last-player-chooses', name: 'Last player chooses', timesChosen: 0 });
      }
      
      // Removed "Spin Again" segment handling
      
      // Choose random segment with weighted selection for players
      let selectedSegment: Player | null = null;
      
      // Check if selected segment is a special segment or a player
      const specialSegments = segments.filter(seg => seg.id === 'last-player-chooses');
      const playerSegments = segments.filter(seg => seg.id !== 'last-player-chooses');
      
      // 15% chance of "Last player chooses" after first spin if it exists
      const lastPlayerSegment = specialSegments.find(seg => seg.id === 'last-player-chooses');
      
      if (lastPlayerSegment && state.gameHistory.length > 0 && Math.random() < 0.15) {
        selectedSegment = lastPlayerSegment;
      } else {
        // Calculate weights for each player based on formula
        const weights = playerSegments.map(player => 
          Math.pow(10, -player.timesChosen)
        );
        
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        const randomValue = Math.random() * totalWeight;
        
        let cumulativeWeight = 0;
        let selectedPlayer: Player | null = null;
        
        for (let i = 0; i < playerSegments.length; i++) {
          cumulativeWeight += weights[i];
          if (randomValue <= cumulativeWeight) {
            selectedPlayer = playerSegments[i];
            break;
          }
        }
        
        if (!selectedPlayer && playerSegments.length > 0) {
          selectedSegment = playerSegments[0];
        } else {
          selectedSegment = selectedPlayer;
        }
      }
      
      // Handle special segments
      if (selectedSegment && selectedSegment.id === 'last-player-chooses') {
        dispatch({ type: 'SET_LAST_PLAYER_CHOOSING', payload: true });
        dispatch({ type: 'SET_WHEEL_SPINNING', payload: false });
      } else if (selectedSegment) {
        // Regular player selection
        dispatch({ 
          type: 'SET_CURRENT_PLAYER', 
          payload: selectedSegment
        });
        dispatch({ type: 'SET_WHEEL_SPINNING', payload: false });
      } else {
        // Just stop the wheel if no segment was selected
        dispatch({ type: 'SET_WHEEL_SPINNING', payload: false });
      }
    }, 3000);
  };

  const chooseGameMode = (mode: GameMode) => {
    dispatch({ type: 'SET_GAME_MODE', payload: mode });
    
    if (mode === GameMode.TRIVIA) {
      // Always get a new random question each time Trivia is chosen
      const question = getRandomQuestion();
      if (question) {
        // If the question has options already, use them
        // Otherwise, generate new options
        if (!question.options) {
          const questionWithOptions = generateOptionsForQuestion(question);
          dispatch({ type: 'SET_CURRENT_QUESTION', payload: questionWithOptions });
        } else {
          dispatch({ type: 'SET_CURRENT_QUESTION', payload: question });
        }
      }
    }
  };

  // Helper function to generate options for a question
  const generateOptionsForQuestion = (question: Question): Question => {
    // Get three random wrong answers from other questions
    const otherAnswers = state.questions
      .filter(q => q.answer.toLowerCase() !== question.answer.toLowerCase() && q.category === question.category)
      .map(q => q.answer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // If we couldn't get enough answers, use some default options
    const fillerOptions = [
      "Not available",
      "No answer",
      "Unknown option"
    ];
    
    // Combine correct answer with wrong answers and shuffle
    const allOptions = [
      question.answer,
      ...(otherAnswers.length >= 3 ? otherAnswers : [...otherAnswers, ...fillerOptions].slice(0, 3))
    ].sort(() => 0.5 - Math.random());
    
    // Find the index of the correct answer in the shuffled options
    const correctIndex = allOptions.findIndex(opt => 
      opt.toLowerCase() === question.answer.toLowerCase()
    );
    
    return {
      ...question,
      options: allOptions,
      correctOptionIndex: correctIndex >= 0 ? correctIndex : 0
    };
  };

  const finishTurn = () => {
    dispatch({ type: 'PLAYER_PLAYED' });
    dispatch({ type: 'SET_CURRENT_QUESTION', payload: null });
  };

  const choosePlayerManually = (playerId: string) => {
    const player = state.players.find(p => p.id === playerId);
    if (player && player.id !== state.lastPlayer?.id) {
      dispatch({ type: 'SET_CURRENT_PLAYER', payload: player });
      dispatch({ type: 'SET_LAST_PLAYER_CHOOSING', payload: false });
    }
  };

  const getRandomQuestion = (): Question | null => {
    if (state.questions.length === 0) return null;
    
    // Get a random question from the available questions
    const randomIndex = Math.floor(Math.random() * state.questions.length);
    const question = state.questions[randomIndex];
    
    return question;
  };

  const isGameModeDisabled = (mode: GameMode): boolean => {
    const recentHistory = state.gameHistory.slice(-5);
    
    // Rule 1: The same game mode cannot be chosen thrice in a row
    const lastTwoModes = state.gameHistory.slice(-2).map(h => h.gameMode);
    if (lastTwoModes.length === 2 && lastTwoModes.every(m => m === mode)) {
      return true;
    }
    
    // Rule 2: If Dare is not chosen for the last five turns, the next person has to choose Dare
    if (mode !== GameMode.DARE && 
        recentHistory.length >= 5 && 
        !recentHistory.some(h => h.gameMode === GameMode.DARE)) {
      return true;
    }
    
    return false;
  };

  // After loading questions, check if we need to restore a current question for Trivia mode
  useEffect(() => {
    if (state.gameMode === GameMode.TRIVIA && !state.currentQuestion) {
      const question = getRandomQuestion();
      if (question) {
        if (!question.options) {
          const questionWithOptions = generateOptionsForQuestion(question);
          dispatch({ type: 'SET_CURRENT_QUESTION', payload: questionWithOptions });
        } else {
          dispatch({ type: 'SET_CURRENT_QUESTION', payload: question });
        }
      }
    }
  }, [state.gameMode, state.currentQuestion, getRandomQuestion, generateOptionsForQuestion, dispatch]);

  // Cookie persistence explanation:
  // 
  // 1. The game state is saved to cookies after every action in the reducer
  // 2. When the app loads, we try to restore state from cookies
  // 3. Large data like questions array is not stored in cookies to avoid size limits
  // 4. Some volatile state (like wheel spinning) is reset on page refresh
  // 5. When in Trivia mode, we generate a new question if needed after state restoration
  //
  // To completely reset the game:
  // - Use the "Clear All Data" button with password 'elysium'
  // - This will clear cookies and reload the page

  return (
    <GameContext.Provider
      value={{
        state,
        addPlayer,
        removePlayer,
        resetCounters,
        spinWheel,
        chooseGameMode,
        finishTurn,
        choosePlayerManually,
        getRandomQuestion,
        isGameModeDisabled,
        clearGameData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 