import type { WrongAnswer, Badge } from '../types';

interface ResultScreenProps {
  score: number;
  maxStreak: number;
  wrongAnswers: WrongAnswer[];
  newBadges: Badge[];
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export function ResultScreen({
  score,
  maxStreak,
  wrongAnswers,
  newBadges,
  onPlayAgain,
  onGoHome
}: ResultScreenProps) {
  const isPerfect = wrongAnswers.length === 0 && score > 0;
  const emoji = isPerfect ? '🏆' : score >= 10 ? '⭐' : score >= 5 ? '👍' : '💪';

  return (
    <div className="min-h-screen bg-gradient-main flex flex-col items-center justify-center p-4">
      {/* Result card */}
      <div className="glass rounded-3xl p-8 text-center mb-6 animate-slideUp max-w-lg w-full">
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-3xl font-bold text-white mb-4">
          {isPerfect ? 'Parfait !' : 'Bien joué !'}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-4xl font-bold text-white">{score}</div>
            <div className="text-white/70">Score</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-4xl font-bold text-white">{maxStreak}</div>
            <div className="text-white/70">Meilleur streak</div>
          </div>
        </div>

        {/* New badges */}
        {newBadges.length > 0 && (
          <div className="mb-6 animate-bounce-custom">
            <h3 className="text-xl font-bold text-yellow-300 mb-3">
              🎉 Nouveaux badges !
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {newBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-yellow-500/30 rounded-xl px-4 py-2 flex items-center gap-2"
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-white font-semibold">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wrong answers recap */}
        {wrongAnswers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white/90 mb-3">
              📝 Révise ces calculs
            </h3>
            <div className="bg-white/10 rounded-xl p-4 max-h-40 overflow-y-auto">
              {wrongAnswers.map((wa, index) => (
                <div key={index} className="text-white/90 mb-2 last:mb-0">
                  <span className="text-red-300 line-through">{wa.question} = {wa.userAnswer}</span>
                  <span className="mx-2">→</span>
                  <span className="text-green-300 font-semibold">{wa.correctAnswer}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={onGoHome}
          className="glass text-white font-bold py-4 px-8 rounded-2xl
            transition-all hover:bg-white/30 active:scale-95"
        >
          🏠 Accueil
        </button>
        <button
          onClick={onPlayAgain}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl
            transition-all active:scale-95"
        >
          🔄 Rejouer
        </button>
      </div>
    </div>
  );
}
