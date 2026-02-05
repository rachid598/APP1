import { useState, useEffect, useCallback, useRef } from 'react';
import type { Question, Difficulty } from '../types';
import { getInitialTime } from '../utils/MathEngine';
import { SoundSystem, vibrate } from '../utils/SoundSystem';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const initialTime = getInitialTime(difficulty);

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

  // Show feedback
  useEffect(() => {
    if (lastAnswerCorrect !== null) {
      setShowFeedback(true);
      const timer = setTimeout(() => setShowFeedback(false), 300);
      return () => clearTimeout(timer);
    }
  }, [lastAnswerCorrect]);

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
    <div className={`min-h-screen bg-gradient-main flex flex-col items-center p-4 ${
      showFeedback ? (lastAnswerCorrect ? 'animate-pulse-custom' : 'animate-shake') : ''
    }`}>
      {/* Header */}
      <div className="w-full max-w-lg flex justify-between items-center mb-4">
        <div className="glass rounded-full px-4 py-2 text-white">
          Score: <span className="font-bold">{score}</span>
        </div>
        {streak >= 3 && (
          <div className="glass rounded-full px-4 py-2 text-white animate-bounce-custom">
            🔥 {streak}
          </div>
        )}
        {!zenMode && (
          <div className="glass rounded-full px-4 py-2 text-white">
            ⏱️ <span className={timeLeft <= 5 ? 'text-red-300 font-bold' : ''}>{timeLeft}s</span>
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
        <div className="w-full max-w-lg h-2 bg-white/20 rounded-full overflow-hidden mb-8">
          <div
            className={`h-full ${progressColor} progress-bar`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Question */}
      <div className={`glass rounded-3xl p-8 mb-8 text-center animate-fadeIn ${
        showFeedback ? (lastAnswerCorrect ? 'ring-4 ring-green-400' : 'ring-4 ring-red-400') : ''
      }`}>
        <div className="text-5xl md:text-6xl font-bold text-white mb-4">
          {question.display}
        </div>
        <div className="text-3xl text-white/80">= ?</div>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full max-w-xs text-center text-4xl font-bold bg-white/20 backdrop-blur
          rounded-2xl py-4 px-6 text-white placeholder-white/50 outline-none
          focus:ring-4 focus:ring-white/50 mb-6"
        placeholder="?"
        inputMode="numeric"
        autoComplete="off"
      />

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', 'back'].map((key) => (
          <button
            key={key}
            onClick={() => handleNumPad(key)}
            className="glass text-white text-2xl font-bold py-4 rounded-xl
              transition-all hover:bg-white/30 active:scale-95"
          >
            {key === 'back' ? '⌫' : key}
          </button>
        ))}
        <button
          onClick={() => handleNumPad('clear')}
          className="glass text-white text-lg font-bold py-4 rounded-xl col-span-1
            transition-all hover:bg-white/30 active:scale-95"
        >
          C
        </button>
        <button
          onClick={() => handleNumPad('enter')}
          className="bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-4 rounded-xl col-span-2
            transition-all active:scale-95"
        >
          Valider ✓
        </button>
      </div>
    </div>
  );
}
