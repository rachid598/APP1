import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, Operation, Difficulty, WrongAnswer, Badge, GameStats } from './types';
import { generateQuestion, getTimeBonus, getInitialTime } from './utils/MathEngine';
import { SoundSystem, vibrate } from './utils/SoundSystem';
import { checkNewBadges } from './utils/badges';
import {
  loadStats,
  saveStats,
  loadUnlockedBadges,
  saveUnlockedBadges,
  loadSoundPreference,
  saveSoundPreference,
  loadZenMode,
  saveZenMode
} from './utils/storage';
import { HomeScreen } from './components/HomeScreen';
import { DifficultyScreen } from './components/DifficultyScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { BadgesScreen } from './components/BadgesScreen';

function App() {
  const [stats, setStats] = useState<GameStats>(loadStats);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(loadUnlockedBadges);
  const [soundEnabled, setSoundEnabled] = useState(loadSoundPreference);
  const [zenMode, setZenMode] = useState(loadZenMode);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  // Response time tracking
  const questionStartTime = useRef<number>(Date.now());
  const totalResponseTime = useRef<number>(0);

  const [gameState, setGameState] = useState<GameState>({
    screen: 'home',
    operation: 'addition',
    difficulty: 'easy',
    score: 0,
    totalQuestions: 0,
    currentQuestion: null,
    timeLeft: 60,
    streak: 0,
    maxStreak: 0,
    zenMode: loadZenMode(),
    wrongAnswers: [],
    lastAnswerCorrect: null
  });

  // Sync sound system with preference
  useEffect(() => {
    SoundSystem.enabled = soundEnabled;
  }, [soundEnabled]);

  // Handle operation selection
  const handleSelectOperation = useCallback((operation: Operation) => {
    setGameState(prev => ({
      ...prev,
      screen: 'difficulty',
      operation
    }));
  }, []);

  // Handle difficulty selection and start game
  const handleSelectDifficulty = useCallback((difficulty: Difficulty) => {
    const question = generateQuestion(gameState.operation, difficulty);
    // Reset response time tracking
    questionStartTime.current = Date.now();
    totalResponseTime.current = 0;

    setGameState(prev => ({
      ...prev,
      screen: 'game',
      difficulty,
      score: 0,
      totalQuestions: 0,
      currentQuestion: question,
      timeLeft: getInitialTime(difficulty),
      streak: 0,
      maxStreak: 0,
      wrongAnswers: [],
      lastAnswerCorrect: null,
      zenMode
    }));
  }, [gameState.operation, zenMode]);

  // Handle answer submission
  const handleAnswer = useCallback((answer: number) => {
    const { currentQuestion, difficulty, operation } = gameState;
    if (!currentQuestion) return;

    // Track response time
    const responseTime = (Date.now() - questionStartTime.current) / 1000;
    totalResponseTime.current += responseTime;
    questionStartTime.current = Date.now(); // Reset for next question

    const isCorrect = answer === currentQuestion.answer;

    setGameState(prev => {
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newMaxStreak = Math.max(prev.maxStreak, newStreak);
      const newWrongAnswers: WrongAnswer[] = isCorrect
        ? prev.wrongAnswers
        : [...prev.wrongAnswers, {
            question: currentQuestion.display,
            userAnswer: answer,
            correctAnswer: currentQuestion.answer
          }];

      // Time bonus for correct answers
      let newTimeLeft = prev.timeLeft;
      if (isCorrect && !prev.zenMode) {
        newTimeLeft = Math.min(prev.timeLeft + getTimeBonus(difficulty), getInitialTime(difficulty) + 10);
      }

      // Play sounds and vibrate
      if (isCorrect) {
        SoundSystem.playCorrect();
        if (newStreak >= 5 && newStreak % 5 === 0) {
          SoundSystem.playStreak();
          vibrate([50, 50, 50]);
        }
      } else {
        SoundSystem.playWrong();
        vibrate(100);
      }

      const newQuestion = generateQuestion(operation, difficulty);

      return {
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        totalQuestions: prev.totalQuestions + 1,
        currentQuestion: newQuestion,
        timeLeft: newTimeLeft,
        streak: newStreak,
        maxStreak: newMaxStreak,
        wrongAnswers: newWrongAnswers,
        lastAnswerCorrect: isCorrect
      };
    });
  }, [gameState]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    SoundSystem.playGameOver();
    vibrate([100, 50, 100]);

    const { score, maxStreak, wrongAnswers, operation, difficulty } = gameState;
    const isPerfect = wrongAnswers.length === 0 && score > 0;

    // Update stats
    const newStats: GameStats = {
      ...stats,
      totalGames: stats.totalGames + 1,
      totalCorrect: stats.totalCorrect + score,
      totalWrong: stats.totalWrong + wrongAnswers.length,
      bestStreak: Math.max(stats.bestStreak, maxStreak),
      perfectGames: isPerfect ? stats.perfectGames + 1 : stats.perfectGames,
      gamesPerOperation: {
        ...stats.gamesPerOperation,
        [operation]: stats.gamesPerOperation[operation] + 1
      },
      gamesPerDifficulty: {
        ...stats.gamesPerDifficulty,
        [difficulty]: stats.gamesPerDifficulty[difficulty] + 1
      },
      totalTime: stats.totalTime + getInitialTime(difficulty)
    };

    setStats(newStats);
    saveStats(newStats);

    // Check for new badges
    const newlyUnlocked = checkNewBadges(newStats, unlockedBadges);
    if (newlyUnlocked.length > 0) {
      SoundSystem.playBadge();
      vibrate([100, 50, 100, 50, 100]);
      const newUnlockedIds = [...unlockedBadges, ...newlyUnlocked.map(b => b.id)];
      setUnlockedBadges(newUnlockedIds);
      saveUnlockedBadges(newUnlockedIds);
      setNewBadges(newlyUnlocked);
    } else {
      setNewBadges([]);
    }

    setGameState(prev => ({
      ...prev,
      screen: 'result'
    }));
  }, [gameState, stats, unlockedBadges]);

  // Handle timer tick
  const handleTick = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      timeLeft: prev.timeLeft - 1
    }));
  }, []);

  // Toggle sound
  const handleToggleSound = useCallback(() => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    saveSoundPreference(newValue);
    SoundSystem.enabled = newValue;
  }, [soundEnabled]);

  // Toggle zen mode
  const handleToggleZen = useCallback(() => {
    const newValue = !zenMode;
    setZenMode(newValue);
    saveZenMode(newValue);
  }, [zenMode]);

  // Navigation
  const handleGoHome = useCallback(() => {
    setGameState(prev => ({ ...prev, screen: 'home' }));
  }, []);

  const handleGoBack = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      screen: prev.screen === 'difficulty' ? 'home' : 'home'
    }));
  }, []);

  const handleShowBadges = useCallback(() => {
    setGameState(prev => ({ ...prev, screen: 'badges' }));
  }, []);

  const handlePlayAgain = useCallback(() => {
    handleSelectDifficulty(gameState.difficulty);
  }, [gameState.difficulty, handleSelectDifficulty]);

  // Render current screen
  switch (gameState.screen) {
    case 'home':
      return (
        <HomeScreen
          onSelectOperation={handleSelectOperation}
          onShowBadges={handleShowBadges}
          zenMode={zenMode}
          onToggleZen={handleToggleZen}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          totalGames={stats.totalGames}
          bestStreak={stats.bestStreak}
        />
      );

    case 'difficulty':
      return (
        <DifficultyScreen
          operation={gameState.operation}
          onSelectDifficulty={handleSelectDifficulty}
          onBack={handleGoBack}
        />
      );

    case 'game':
      return gameState.currentQuestion ? (
        <GameScreen
          question={gameState.currentQuestion}
          difficulty={gameState.difficulty}
          score={gameState.score}
          timeLeft={gameState.timeLeft}
          streak={gameState.streak}
          zenMode={gameState.zenMode}
          lastAnswerCorrect={gameState.lastAnswerCorrect}
          onAnswer={handleAnswer}
          onTimeUp={handleTimeUp}
          onTick={handleTick}
        />
      ) : null;

    case 'result':
      const avgResponseTime = gameState.totalQuestions > 0
        ? totalResponseTime.current / gameState.totalQuestions
        : 0;
      return (
        <ResultScreen
          score={gameState.score}
          totalQuestions={gameState.totalQuestions}
          maxStreak={gameState.maxStreak}
          wrongAnswers={gameState.wrongAnswers}
          newBadges={newBadges}
          difficulty={gameState.difficulty}
          averageResponseTime={avgResponseTime}
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoHome}
        />
      );

    case 'badges':
      return (
        <BadgesScreen
          unlockedBadges={unlockedBadges}
          onBack={handleGoHome}
        />
      );

    default:
      return null;
  }
}

export default App;
