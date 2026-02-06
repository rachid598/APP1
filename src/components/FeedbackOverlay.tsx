import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
}

interface FeedbackOverlayProps {
  show: boolean;
  isCorrect: boolean;
  message: string;
  timeBonus?: number;
  streak: number;
}

const CONFETTI_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 0.3
  }));
}

export function FeedbackOverlay({ show, isCorrect, message, timeBonus, streak }: FeedbackOverlayProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (show && isCorrect) {
      // Plus de confettis pour les streaks élevés
      const count = streak >= 10 ? 20 : streak >= 5 ? 15 : streak >= 3 ? 10 : 6;
      setConfetti(generateConfetti(count));
    }
  }, [show, isCorrect, streak]);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Message d'encouragement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none
              text-3xl md:text-4xl font-bold text-center px-6 py-3 rounded-2xl
              ${isCorrect
                ? 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]'
                : 'text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]'
              }`}
          >
            {message}
          </motion.div>

          {/* Time bonus flottant */}
          {isCorrect && timeBonus && timeBonus > 0 && (
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -60 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="fixed top-20 right-8 z-50 pointer-events-none
                text-2xl font-bold text-green-400
                drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]"
            >
              +{timeBonus}s
            </motion.div>
          )}

          {/* Confettis */}
          {isCorrect && confetti.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                opacity: 1,
                y: -20,
                x: `${piece.x}vw`,
                rotate: 0,
                scale: 1
              }}
              animate={{
                opacity: 0,
                y: '100vh',
                rotate: Math.random() * 720 - 360,
                scale: 0.5
              }}
              transition={{
                duration: 1.5 + Math.random() * 0.5,
                delay: piece.delay,
                ease: "easeIn"
              }}
              className="fixed top-0 z-40 pointer-events-none text-2xl"
              style={{ left: 0 }}
            >
              {streak >= 5 ? '✨' : '🎉'}
            </motion.div>
          ))}

          {/* Streak indicator spécial */}
          {isCorrect && streak >= 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30
                pointer-events-none"
            >
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.1, 0]
                }}
                transition={{ duration: 0.6 }}
                className="w-40 h-40 rounded-full bg-yellow-400/30 blur-xl"
              />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

// Composant pour l'animation du score qui pop
export function ScorePop({ score, trigger }: { score: number; trigger: boolean }) {
  return (
    <motion.span
      key={score}
      initial={trigger ? { scale: 1.5, color: '#4ade80' } : { scale: 1 }}
      animate={{ scale: 1, color: '#ffffff' }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className="font-bold"
    >
      {score}
    </motion.span>
  );
}

// Composant pour shake sur erreur
export function ShakeWrapper({
  children,
  shake
}: {
  children: React.ReactNode;
  shake: boolean;
}) {
  return (
    <motion.div
      animate={shake ? {
        x: [-10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      } : {}}
    >
      {children}
    </motion.div>
  );
}

// Timer flash vert
export function TimerFlash({
  timeLeft,
  flash,
  danger
}: {
  timeLeft: number;
  flash: boolean;
  danger: boolean;
}) {
  return (
    <motion.span
      animate={flash ? {
        color: ['#4ade80', '#ffffff'],
        textShadow: ['0 0 20px #4ade80', '0 0 0px transparent']
      } : {}}
      transition={{ duration: 0.5 }}
      className={danger ? 'text-red-300 font-bold' : ''}
    >
      {timeLeft}s
    </motion.span>
  );
}
