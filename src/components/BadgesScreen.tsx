import { BADGES } from '../utils/badges';

interface BadgesScreenProps {
  unlockedBadges: string[];
  onBack: () => void;
}

export function BadgesScreen({ unlockedBadges, onBack }: BadgesScreenProps) {
  const unlockedCount = unlockedBadges.length;
  const totalCount = BADGES.length;

  return (
    <div className="min-h-screen bg-gradient-main flex flex-col items-center p-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 w-12 h-12 rounded-full glass flex items-center justify-center text-2xl text-white transition-transform hover:scale-110"
      >
        ←
      </button>

      {/* Header */}
      <div className="text-center mt-16 mb-8 animate-fadeIn">
        <h2 className="text-3xl font-bold text-white mb-2">🏆 Mes Badges</h2>
        <p className="text-white/80">
          {unlockedCount} / {totalCount} débloqués
        </p>
        <div className="w-full max-w-xs mx-auto mt-4 h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-500 transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        {BADGES.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          return (
            <div
              key={badge.id}
              className={`glass rounded-2xl p-4 text-center transition-all ${
                isUnlocked
                  ? 'ring-2 ring-yellow-400'
                  : 'opacity-50 grayscale'
              }`}
            >
              <div className="text-4xl mb-2">
                {isUnlocked ? badge.icon : '🔒'}
              </div>
              <div className="text-white font-semibold mb-1">
                {badge.name}
              </div>
              <div className="text-white/70 text-sm">
                {badge.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
