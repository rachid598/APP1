import type { Operation } from '../types';
import { OPERATION_NAMES, OPERATION_ICONS } from '../utils/MathEngine';

interface HomeScreenProps {
  onSelectOperation: (op: Operation) => void;
  onShowBadges: () => void;
  zenMode: boolean;
  onToggleZen: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  totalGames: number;
  bestStreak: number;
}

const OPERATIONS: Operation[] = ['addition', 'subtraction', 'multiplication', 'division', 'mix'];

const OPERATION_COLORS: Record<Operation, string> = {
  addition: 'from-green-400 to-green-600',
  subtraction: 'from-blue-400 to-blue-600',
  multiplication: 'from-purple-400 to-purple-600',
  division: 'from-orange-400 to-orange-600',
  mix: 'from-pink-400 to-pink-600'
};

export function HomeScreen({
  onSelectOperation,
  onShowBadges,
  zenMode,
  onToggleZen,
  soundEnabled,
  onToggleSound,
  totalGames,
  bestStreak
}: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-main flex flex-col items-center justify-center p-4">
      {/* Header controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={onToggleSound}
          className="w-12 h-12 rounded-full glass flex items-center justify-center text-2xl transition-transform hover:scale-110"
          aria-label={soundEnabled ? 'Couper le son' : 'Activer le son'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
        <button
          onClick={onShowBadges}
          className="w-12 h-12 rounded-full glass flex items-center justify-center text-2xl transition-transform hover:scale-110"
          aria-label="Voir les badges"
        >
          🏆
        </button>
      </div>

      {/* Title */}
      <div className="text-center mb-8 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
          🧮 Calcul Mental
        </h1>
        <p className="text-white/80 text-lg">Pour les élèves de 6ème</p>
      </div>

      {/* Stats */}
      {totalGames > 0 && (
        <div className="glass rounded-2xl p-4 mb-6 flex gap-6 text-white animate-fadeIn">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalGames}</div>
            <div className="text-sm opacity-80">Parties</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{bestStreak}</div>
            <div className="text-sm opacity-80">Meilleur streak</div>
          </div>
        </div>
      )}

      {/* Zen Mode Toggle */}
      <div className="glass rounded-full px-4 py-2 mb-6 flex items-center gap-3 animate-fadeIn">
        <span className="text-white">Mode Zen</span>
        <button
          onClick={onToggleZen}
          className={`w-14 h-7 rounded-full transition-colors ${
            zenMode ? 'bg-green-500' : 'bg-gray-500'
          } relative`}
        >
          <div
            className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
              zenMode ? 'translate-x-8' : 'translate-x-1'
            }`}
          />
        </button>
        <span className="text-white/70 text-sm">
          {zenMode ? '🧘 Sans chrono' : '⏱️ Avec chrono'}
        </span>
      </div>

      {/* Operation buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-2xl">
        {OPERATIONS.map((op) => (
          <button
            key={op}
            onClick={() => onSelectOperation(op)}
            className={`bg-gradient-to-br ${OPERATION_COLORS[op]} text-white rounded-2xl p-6
              shadow-lg transform transition-all hover:scale-105 hover:shadow-xl active:scale-95
              flex flex-col items-center gap-2`}
          >
            <span className="text-4xl">{OPERATION_ICONS[op]}</span>
            <span className="text-xl font-semibold">{OPERATION_NAMES[op]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
