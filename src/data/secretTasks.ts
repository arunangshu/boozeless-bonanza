// Structure for secret tasks
export interface SecretTask {
  id: string;         // 5-digit alphanumeric ID
  description: string; // Task description
}

// Common rules for all tasks
export const taskRules = [
  "Confirm your task completion as described above and claim your prize.",
  "You must complete the task before leaving RP Hall.",
  "For the bigger prize, you must keep your task secret until you complete it.",
  "If someone guesses your task, they would get a small reward. Likewise if you guess someone else's secret task correctly, you would get a small reward.",
  "If someone guesses your task, you can still complete your task to claim a small reward.",
  "You cannot swap your task with anyone else."
];

// Store your secret tasks here - easy to update
export const secretTasks: Record<string, SecretTask> = {
  "A1B2C": {
    id: "A1B2C",
    description: "Start a timer now and do not talk with anyone for the next 2 minutes. Show me the exhausted timer to complete the task."
  },
  "X7Y9Z": {
    id: "X7Y9Z",
    description: "Finish three rounds in under 10 minutes."
  },
  "D3F4G": {
    id: "D3F4G",
    description: "Answer all trivia questions correctly in one game session."
  },
  "E5R6T": {
    id: "E5R6T",
    description: "Complete your turn while standing on one foot."
  },
  "H8J1K": {
    id: "H8J1K",
    description: "Win the game without using any power-ups or special abilities."
  },
  "L3M4N": {
    id: "L3M4N",
    description: "Take a selfie with each player when they lose a round."
  },
  "P9Q2R": {
    id: "P9Q2R",
    description: "Complete your turn while speaking in an accent of your choice."
  },
  "S5T7U": {
    id: "S5T7U",
    description: "Every time you win a round, you must do 5 jumping jacks."
  },
  "V1W3X": {
    id: "V1W3X",
    description: "For the entire game, you must refer to yourself in the third person."
  },
  "Y6Z8A": {
    id: "Y6Z8A",
    description: "Create a victory dance and perform it each time you score points."
  }
}; 