import type { Operation, Difficulty, Question } from '../types';

interface DifficultyConfig {
  addition: { min: number; max: number };
  subtraction: { min: number; max: number };
  multiplication: { min: number; max: number };
  division: { maxDivisor: number; maxQuotient: number };
  timeBonus: number;
}

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    addition: { min: 1, max: 20 },
    subtraction: { min: 1, max: 20 },
    multiplication: { min: 2, max: 5 },
    division: { maxDivisor: 5, maxQuotient: 10 },
    timeBonus: 3
  },
  medium: {
    addition: { min: 10, max: 100 },
    subtraction: { min: 10, max: 100 },
    multiplication: { min: 2, max: 10 },
    division: { maxDivisor: 10, maxQuotient: 12 },
    timeBonus: 2
  },
  hard: {
    addition: { min: 50, max: 500 },
    subtraction: { min: 50, max: 500 },
    multiplication: { min: 6, max: 12 },
    division: { maxDivisor: 12, maxQuotient: 15 },
    timeBonus: 1
  },
  expert: {
    addition: { min: 100, max: 1000 },
    subtraction: { min: 100, max: 1000 },
    multiplication: { min: 11, max: 25 },
    division: { maxDivisor: 15, maxQuotient: 20 },
    timeBonus: 1
  }
};

// Nombres "amicaux" qui sont plus faciles à calculer mentalement
const FRIENDLY_NUMBERS = [5, 10, 15, 20, 25, 50, 100];

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateFriendlyNumber(min: number, max: number): number {
  // 30% de chance d'obtenir un nombre "amical"
  if (Math.random() < 0.3) {
    const friendly = FRIENDLY_NUMBERS.filter(n => n >= min && n <= max);
    if (friendly.length > 0) {
      return friendly[random(0, friendly.length - 1)];
    }
  }
  return random(min, max);
}

function generateAddition(config: DifficultyConfig): Question {
  const { min, max } = config.addition;
  const num1 = generateFriendlyNumber(min, max);
  const num2 = generateFriendlyNumber(min, max);
  const answer = num1 + num2;

  return {
    num1,
    num2,
    operation: 'addition',
    answer,
    display: `${num1} + ${num2}`
  };
}

function generateSubtraction(config: DifficultyConfig): Question {
  const { min, max } = config.subtraction;
  let num1 = generateFriendlyNumber(min, max);
  let num2 = generateFriendlyNumber(min, max);

  // Assurer que le résultat est positif
  if (num2 > num1) {
    [num1, num2] = [num2, num1];
  }

  const answer = num1 - num2;

  return {
    num1,
    num2,
    operation: 'subtraction',
    answer,
    display: `${num1} − ${num2}`
  };
}

function generateMultiplication(config: DifficultyConfig): Question {
  const { min, max } = config.multiplication;
  const num1 = random(min, max);
  const num2 = random(min, max);
  const answer = num1 * num2;

  return {
    num1,
    num2,
    operation: 'multiplication',
    answer,
    display: `${num1} × ${num2}`
  };
}

function generateDivision(config: DifficultyConfig): Question {
  const { maxDivisor, maxQuotient } = config.division;

  // Générer division avec résultat entier
  const divisor = random(2, maxDivisor);
  const quotient = random(1, maxQuotient);
  const dividend = divisor * quotient;

  return {
    num1: dividend,
    num2: divisor,
    operation: 'division',
    answer: quotient,
    display: `${dividend} ÷ ${divisor}`
  };
}

export function generateQuestion(operation: Operation, difficulty: Difficulty): Question {
  const config = DIFFICULTY_CONFIGS[difficulty];

  if (operation === 'mix') {
    const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];
    operation = operations[random(0, 3)];
  }

  switch (operation) {
    case 'addition':
      return generateAddition(config);
    case 'subtraction':
      return generateSubtraction(config);
    case 'multiplication':
      return generateMultiplication(config);
    case 'division':
      return generateDivision(config);
    default:
      return generateAddition(config);
  }
}

export function getTimeBonus(difficulty: Difficulty): number {
  return DIFFICULTY_CONFIGS[difficulty].timeBonus;
}

export function getInitialTime(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy': return 60;
    case 'medium': return 45;
    case 'hard': return 30;
    case 'expert': return 20;
  }
}

export const OPERATION_NAMES: Record<Operation, string> = {
  addition: 'Addition',
  subtraction: 'Soustraction',
  multiplication: 'Multiplication',
  division: 'Division',
  mix: 'Mix'
};

export const OPERATION_ICONS: Record<Operation, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷',
  mix: '?'
};

export const DIFFICULTY_NAMES: Record<Difficulty, string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
  expert: 'Expert'
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'bg-green-500 hover:bg-green-600',
  medium: 'bg-yellow-500 hover:bg-yellow-600',
  hard: 'bg-orange-500 hover:bg-orange-600',
  expert: 'bg-red-500 hover:bg-red-600'
};
