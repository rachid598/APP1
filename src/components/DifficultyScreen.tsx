import type { Difficulty, Operation } from '../types';
import { DIFFICULTY_NAMES, DIFFICULTY_COLORS, OPERATION_NAMES, OPERATION_ICONS } from '../utils/MathEngine';

interface DifficultyScreenProps {
  operation: Operation;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  easy: 'Nombres de 1 à 20',
  medium: 'Nombres de 10 à 100',
  hard: 'Nombres de 50 à 500',
  expert: 'Nombres de 100 à 1000'
};

export function DifficultyScreen({ operation, onSelectDifficulty, onBack }: DifficultyScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-main flex flex-col items-center justify-center p-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 w-12 h-12 rounded-full glass flex items-center justify-center text-2xl text-white transition-transform hover:scale-110"
      >
        ←
      </button>

      {/* Header */}
      <div className="text-center mb-8 animate-fadeIn">
        <div className="text-6xl mb-4">{OPERATION_ICONS[operation]}</div>
        <h2 className="text-3xl font-bold text-white">{OPERATION_NAMES[operation]}</h2>
        <p className="text-white/80 mt-2">Choisis ton niveau</p>
      </div>

      {/* Difficulty buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
        {DIFFICULTIES.map((diff) => (
          <button
            key={diff}
            onClick={() => onSelectDifficulty(diff)}
            className={`${DIFFICULTY_COLORS[diff]} text-white rounded-2xl p-6
              shadow-lg transform transition-all hover:scale-105 hover:shadow-xl active:scale-95
              flex flex-col items-center gap-2`}
          >
            <span className="text-2xl font-bold">{DIFFICULTY_NAMES[diff]}</span>
            <span className="text-sm opacity-90">{DIFFICULTY_DESCRIPTIONS[diff]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
