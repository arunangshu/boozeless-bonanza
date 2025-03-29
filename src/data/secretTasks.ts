// Structure for secret tasks
export interface SecretTask {
  id: string;         // 5-digit alphanumeric ID
  description: string; // Task description
}

// Common rules for all tasks
export const taskRules = [
  "Confirm your task completion as described above and claim your prize.",
  "Going out of the room is allowed, but you must complete the task before leaving RP Hall.",
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
    description: "Stand up. Then loud and clear, give your complete formal intro to me as if I asked you."
  },
  "D3F4G": {
    id: "D3F4G",
    description: "Go out of the room, then come back with a plastic glass with a little bit of any drink. Then act like you are heavily drunk for two minutes."
  },
  "E5R6T": {
    id: "E5R6T",
    description: "Show me a picture of you hugging the RP Vending Machine. You can let one friend know your task and take help in clicking the picture."
  },
  "H8J1K": {
    id: "H8J1K",
    description: "Introduce yourself to a person you don't know. Tell me the name of the person and your task completion will be confirmed if he/she can tell me your name and department."
  },
  "L3M4N": {
    id: "L3M4N",
    description: "Take a selfie with the next person who gives wrong answer in trivia, and show me the picture."
  },
  "P9Q2R": {
    id: "P9Q2R",
    description: "Turn off the LED Strip Lights."
  },
  "S5T7U": {
    id: "S5T7U",
    description: "Start a timer, and vent that this is your worst hall day experience ever for two minutes. It should be convincing enough so that people don't realise that it is your secret task. Show me the timer to confirm your task completion."
  },
  "V1W3X": {
    id: "V1W3X",
    description: "For the entire game, you must refer to yourself in the third person."
  },
  "Y6Z8A": {
    id: "Y6Z8A",
    description: "Take the drink but refuse to take any snacks with a convincing reason"
  },
  "B4C7D": {
    id: "B4C7D",
    description: "Start a timer and have an argument with a person of your choice for two minutes. Show me the timer to confirm your task completion."
  },
  "F2G5H": {
    id: "F2G5H",
    description: "Start a timer and don't sit for the next five minutes. Give a convincing reason for not sitting to whoever asks. Show me the timer to confirm your task completion."
  },
  "J6K9L": {
    id: "J6K9L",
    description: "Start a timer and use only your non-dominant hand for eating or drinkingfor the next two minutes. Show me the timer to confirm your task completion."
  },
  "N3O7P": {
    id: "N3O7P",
    description: "Start a timer and spend the next 3 minutes casually holding any object (e.g., a water bottle) and appreciating it to others. Show me the timer for confirmation."
  },
  "R8S2T": {
    id: "R8S2T",
    description: "Start a timer and speak in English for the next two minutes. Give a convincing reason for speaking in English to whoever asks. Show me the timer to confirm your task completion."
  },
  "U5V9W": {
    id: "U5V9W",
    description: "Compliment three people on their footwear in the next 10 minutes. Tell me the names of at the people you complimented to confirm task completion."
  },
  "Y1Z4A": {
    id: "Y1Z4A",
    description: "Pick up your phone, start a timer and pretend to take an important call. During the call, say at least three dramatic things (e.g., 'I can't believe this is happening!') so that everyone starts asking you who you are talking to. Show me the timer for the 2-minute call to confirm your task completion."
  },
  "C6D9E": {
    id: "C6D9E",
    description: "Ask at least two people what their favorite food is. Pretend it's just a casual conversation. Let me know their names and answers to confirm task completion."
  }
}; 