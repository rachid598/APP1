export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mix';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  display: string;
}

export interface WrongAnswer {
  question: string;
  userAnswer: number;
  correctAnswer: number;
}

export interface GameState {
  screen: 'home' | 'difficulty' | 'game' | 'result' | 'badges';
  operation: Operation;
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  currentQuestion: Question | null;
  timeLeft: number;
  streak: number;
  maxStreak: number;
  zenMode: boolean;
  wrongAnswers: WrongAnswer[];
  lastAnswerCorrect: boolean | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: GameStats) => boolean;
}

export interface GameStats {
  totalGames: number;
  totalCorrect: number;
  totalWrong: number;
  bestStreak: number;
  perfectGames: number;
  gamesPerOperation: Record<Operation, number>;
  gamesPerDifficulty: Record<Difficulty, number>;
  totalTime: number;
}

export const DEFAULT_STATS: GameStats = {
  totalGames: 0,
  totalCorrect: 0,
  totalWrong: 0,
  bestStreak: 0,
  perfectGames: 0,
  gamesPerOperation: {
    addition: 0,
    subtraction: 0,
    multiplication: 0,
    division: 0,
    mix: 0
  },
  gamesPerDifficulty: {
    easy: 0,
    medium: 0,
    hard: 0,
    expert: 0
  },
  totalTime: 0
};
