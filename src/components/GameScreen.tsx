import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Question, Difficulty } from '../types';
import { getInitialTime, getTimeBonus } from '../utils/MathEngine';
import { SoundSystem, vibrate } from '../utils/SoundSystem';
import { getEncouragement, getErrorMessage } from '../utils/encouragements';
import { FeedbackOverlay, ScorePop, ShakeWrapper, TimerFlash } from './FeedbackOverlay';

interface GameScreenProps {
  question: Question;
  difficulty: Difficulty;
  score: number;
  timeLeft: number;
  streak: number;
  zenMode: boolean;
  lastAnswerCorrect: boolean | null;
  onAnswer: (answer: number) => void;
  onTimeUp: () => void;
  onTick: () => void;
}

export function GameScreen({
  question,
  difficulty,
  score,
  timeLeft,
  streak,
  zenMode,
  lastAnswerCorrect,
  onAnswer,
  onTimeUp,
  onTick
}: GameScreenProps) {
  const [inputValue, setInputValue] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [triggerScorePop, setTriggerScorePop] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const [flashTimer, setFlashTimer] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialTime = getInitialTime(difficulty);
  const timeBonus = getTimeBonus(difficulty);

  // Timer
  useEffect(() => {
    if (zenMode) return;

    const timer = setInterval(() => {
      if (timeLeft <= 1) {
        onTimeUp();
      } else {
        if (timeLeft <= 5) {
          SoundSystem.playTick();
        }
        onTick();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, zenMode, onTimeUp, onTick]);

  // Focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, [question]);

  // Show feedback avec messages
  useEffect(() => {
    if (lastAnswerCorrect !== null) {
      setShowFeedback(true);

      if (lastAnswerCorrect) {
        setFeedbackMessage(getEncouragement(streak));
        setTriggerScorePop(true);
        setFlashTimer(true);
        setTimeout(() => setTriggerScorePop(false), 300);
        setTimeout(() => setFlashTimer(false), 500);
      } else {
        setFeedbackMessage(getErrorMessage());
        setShakeInput(true);
        vibrate([50, 30, 50]); // Double vibration pour erreur
        setTimeout(() => setShakeInput(false), 400);
      }

      const timer = setTimeout(() => setShowFeedback(false), 600);
      return () => clearTimeout(timer);
    }
  }, [lastAnswerCorrect, streak]);

  // Reset input when question changes
  useEffect(() => {
    setInputValue('');
  }, [question]);

  const handleSubmit = useCallback(() => {
    const answer = parseInt(inputValue);
    if (!isNaN(answer)) {
      onAnswer(answer);
    }
  }, [inputValue, onAnswer]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleNumPad = (value: string) => {
    if (value === 'clear') {
      setInputValue('');
    } else if (value === 'back') {
      setInputValue(prev => prev.slice(0, -1));
    } else if (value === 'enter') {
      handleSubmit();
    } else if (value === '-') {
      if (inputValue === '') {
        setInputValue('-');
      }
    } else {
      setInputValue(prev => prev + value);
    }
    vibrate(10);
  };

  const progressPercent = zenMode ? 100 : (timeLeft / initialTime) * 100;
  const progressColor = timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="min-h-screen bg-gradient-main flex flex-col items-center p-4 relative overflow-hidden">
      {/* Feedback Overlay */}
      <FeedbackOverlay
        show={showFeedback}
        isCorrect={lastAnswerCorrect === true}
        message={feedbackMessage}
        timeBonus={lastAnswerCorrect && !zenMode ? timeBonus : undefined}
        streak={streak}
      />

      {/* Header */}
      <div className="w-full max-w-lg flex justify-between items-center mb-4 z-10">
        <motion.div
          className="glass rounded-full px-4 py-2 text-white"
          animate={triggerScorePop ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          Score: <ScorePop score={score} trigger={triggerScorePop} />
        </motion.div>

        {streak >= 3 && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="glass rounded-full px-4 py-2 text-white"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              🔥
            </motion.span>{' '}
            {streak}
          </motion.div>
        )}

        {!zenMode && (
          <div className="glass rounded-full px-4 py-2 text-white">
            ⏱️ <TimerFlash timeLeft={timeLeft} flash={flashTimer} danger={timeLeft <= 5} />
          </div>
        )}

        {zenMode && (
          <div className="glass rounded-full px-4 py-2 text-white">
            🧘 Zen
          </div>
        )}
      </div>

      {/* Progress bar */}
      {!zenMode && (
        <div className="w-full max-w-lg h-2 bg-white/20 rounded-full overflow-hidden mb-8 z-10">
          <motion.div
            className={`h-full ${progressColor}`}
            initial={{ width: '100%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Question */}
      <motion.div
        key={question.display}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className={`glass rounded-3xl p-8 mb-8 text-center z-10 ${
          showFeedback && lastAnswerCorrect === true ? 'ring-4 ring-green-400 shadow-[0_0_30px_rgba(74,222,128,0.3)]' :
          showFeedback && lastAnswerCorrect === false ? 'ring-4 ring-red-400 shadow-[0_0_30px_rgba(248,113,113,0.3)]' : ''
        }`}
      >
        <div className="text-5xl md:text-6xl font-bold text-white mb-4">
          {question.display}
        </div>
        <div className="text-3xl text-white/80">= ?</div>
      </motion.div>

      {/* Input avec shake */}
      <ShakeWrapper shake={shakeInput}>
        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full max-w-xs text-center text-4xl font-bold bg-white/20 backdrop-blur
            rounded-2xl py-4 px-6 text-white placeholder-white/50 outline-none
            focus:ring-4 focus:ring-white/50 mb-6 transition-all
            ${shakeInput ? 'ring-4 ring-red-400' : ''}`}
          placeholder="?"
          inputMode="numeric"
          autoComplete="off"
        />
      </ShakeWrapper>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs z-10">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', 'back'].map((key) => (
          <motion.button
            key={key}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNumPad(key)}
            className="glass text-white text-2xl font-bold py-4 rounded-xl
              transition-colors hover:bg-white/30"
          >
            {key === 'back' ? '⌫' : key}
          </motion.button>
        ))}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleNumPad('clear')}
          className="glass text-white text-lg font-bold py-4 rounded-xl col-span-1
            transition-colors hover:bg-white/30"
        >
          C
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNumPad('enter')}
          className="bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-4 rounded-xl col-span-2"
        >
          Valider ✓
        </motion.button>
      </div>
    </div>
  );
}
