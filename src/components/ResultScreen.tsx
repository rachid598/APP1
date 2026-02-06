import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { WrongAnswer, Badge, Difficulty } from '../types';
import { getSessionBadges, getPerformanceMessage, type SessionBadge } from '../utils/sessionBadges';
import { SoundSystem } from '../utils/SoundSystem';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  maxStreak: number;
  wrongAnswers: WrongAnswer[];
  newBadges: Badge[];
  difficulty: Difficulty;
  averageResponseTime: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

// Confetti pour écran de résultat
function ResultConfetti() {
  const confetti = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1,
    emoji: ['🎉', '⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]
  }));

  return (
    <>
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -50, x: `${piece.x}vw`, opacity: 1 }}
          animate={{ y: '110vh', opacity: 0 }}
          transition={{
            duration: 3 + Math.random(),
            delay: piece.delay,
            ease: "linear"
          }}
          className="fixed top-0 text-2xl pointer-events-none z-0"
          style={{ left: 0 }}
        >
          {piece.emoji}
        </motion.div>
      ))}
    </>
  );
}

export function ResultScreen({
  score,
  totalQuestions,
  maxStreak,
  wrongAnswers,
  newBadges,
  difficulty,
  averageResponseTime,
  onPlayAgain,
  onGoHome
}: ResultScreenProps) {
  const [sessionBadges, setSessionBadges] = useState<SessionBadge[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const { title, subtitle } = getPerformanceMessage({
    score,
    totalQuestions,
    wrongAnswers,
    maxStreak,
    difficulty,
    totalTimeSpent: 0,
    averageResponseTime
  });

  useEffect(() => {
    // Calculer les badges de session
    const badges = getSessionBadges({
      score,
      totalQuestions,
      wrongAnswers,
      maxStreak,
      difficulty,
      totalTimeSpent: 0,
      averageResponseTime
    });
    setSessionBadges(badges);

    // Afficher confetti si bonne performance
    if (accuracy >= 80 || badges.length > 0) {
      setShowConfetti(true);
      SoundSystem.playBadge();
    }
  }, [score, totalQuestions, wrongAnswers, maxStreak, difficulty, averageResponseTime, accuracy]);

  return (
    <div className="min-h-screen bg-gradient-main flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && <ResultConfetti />}

      {/* Result card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="glass rounded-3xl p-8 text-center mb-6 max-w-lg w-full z-10"
      >
        {/* Title avec animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-5xl mb-2"
        >
          {accuracy === 100 ? '🏆' : accuracy >= 80 ? '⭐' : accuracy >= 60 ? '👏' : '💪'}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-white mb-1"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/70 mb-6"
        >
          {subtitle}
        </motion.p>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-white/10 rounded-xl p-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="text-3xl font-bold text-white"
            >
              {score}
            </motion.div>
            <div className="text-white/70 text-sm">Score</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="text-3xl font-bold text-white"
            >
              {accuracy}%
            </motion.div>
            <div className="text-white/70 text-sm">Précision</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="text-3xl font-bold text-white"
            >
              🔥{maxStreak}
            </motion.div>
            <div className="text-white/70 text-sm">Streak</div>
          </div>
        </motion.div>

        {/* Session badges */}
        {sessionBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-6"
          >
            <h3 className="text-lg font-bold text-yellow-300 mb-3">
              🏅 Badges de cette partie
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {sessionBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 1 + index * 0.15, type: "spring" }}
                  className="bg-gradient-to-r from-yellow-500/40 to-orange-500/40 rounded-xl px-4 py-2
                    border border-yellow-400/50 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{badge.icon}</span>
                    <div className="text-left">
                      <div className="text-white font-semibold text-sm">{badge.name}</div>
                      <div className="text-white/60 text-xs">{badge.description}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* New global badges */}
        {newBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mb-6"
          >
            <h3 className="text-lg font-bold text-purple-300 mb-3">
              🎉 Nouveaux badges débloqués !
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {newBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 + index * 0.1, type: "spring" }}
                  className="bg-purple-500/30 rounded-xl px-4 py-2 flex items-center gap-2
                    border border-purple-400/50"
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-white font-semibold">{badge.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Wrong answers recap */}
        {wrongAnswers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mb-4"
          >
            <h3 className="text-lg font-semibold text-white/90 mb-3">
              📝 Révise ces calculs
            </h3>
            <div className="bg-white/10 rounded-xl p-4 max-h-32 overflow-y-auto text-left">
              {wrongAnswers.slice(0, 5).map((wa, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                  className="text-white/90 mb-2 last:mb-0 flex items-center gap-2"
                >
                  <span className="text-red-300 line-through text-sm">
                    {wa.question} = {wa.userAnswer}
                  </span>
                  <span className="text-white/50">→</span>
                  <span className="text-green-300 font-semibold">{wa.correctAnswer}</span>
                </motion.div>
              ))}
              {wrongAnswers.length > 5 && (
                <div className="text-white/50 text-sm mt-2">
                  +{wrongAnswers.length - 5} autres erreurs
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="flex gap-4 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGoHome}
          className="glass text-white font-bold py-4 px-8 rounded-2xl
            transition-colors hover:bg-white/30"
        >
          🏠 Accueil
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayAgain}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl"
        >
          🔄 Rejouer
        </motion.button>
      </motion.div>
    </div>
  );
}
