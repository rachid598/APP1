import type { Difficulty, WrongAnswer } from '../types';

export interface SessionBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface SessionStats {
  score: number;
  totalQuestions: number;
  wrongAnswers: WrongAnswer[];
  maxStreak: number;
  difficulty: Difficulty;
  totalTimeSpent: number; // en secondes
  averageResponseTime: number; // en secondes
}

// Calcule les badges gagnés pendant cette session
export function getSessionBadges(stats: SessionStats): SessionBadge[] {
  const badges: SessionBadge[] = [];
  const accuracy = stats.totalQuestions > 0
    ? (stats.score / stats.totalQuestions) * 100
    : 0;

  // Éclair ⚡ - Moyenne de réponse < 2s
  if (stats.averageResponseTime < 2 && stats.score >= 5) {
    badges.push({
      id: 'lightning',
      name: 'Éclair',
      icon: '⚡',
      description: 'Réponses ultra-rapides (< 2s)'
    });
  }

  // Sniper 🎯 - 100% de précision (minimum 5 réponses)
  if (accuracy === 100 && stats.score >= 5) {
    badges.push({
      id: 'sniper',
      name: 'Sniper',
      icon: '🎯',
      description: '100% de précision'
    });
  }

  // Persévérant 💪 - A fini le niveau Expert
  if (stats.difficulty === 'expert' && stats.score >= 3) {
    badges.push({
      id: 'perseverant',
      name: 'Persévérant',
      icon: '💪',
      description: 'A joué en mode Expert'
    });
  }

  // Comète 🌟 - Streak de 10+
  if (stats.maxStreak >= 10) {
    badges.push({
      id: 'comet',
      name: 'Comète',
      icon: '🌟',
      description: 'Série de 10+ réponses'
    });
  }

  // Marathonien 🏃 - 20+ réponses correctes
  if (stats.score >= 20) {
    badges.push({
      id: 'marathon',
      name: 'Marathonien',
      icon: '🏃',
      description: '20+ bonnes réponses'
    });
  }

  // Calculateur mental 🧠 - 15+ réponses en mode difficile/expert
  if ((stats.difficulty === 'hard' || stats.difficulty === 'expert') && stats.score >= 15) {
    badges.push({
      id: 'mental_calc',
      name: 'Calculateur',
      icon: '🧠',
      description: '15+ en mode difficile'
    });
  }

  // Parfait 💎 - Aucune erreur + 10+ réponses
  if (stats.wrongAnswers.length === 0 && stats.score >= 10) {
    badges.push({
      id: 'perfect',
      name: 'Parfait',
      icon: '💎',
      description: 'Aucune erreur, 10+ réponses'
    });
  }

  return badges;
}

// Messages de félicitations basés sur la performance
export function getPerformanceMessage(stats: SessionStats): { title: string; subtitle: string } {
  const accuracy = stats.totalQuestions > 0
    ? (stats.score / stats.totalQuestions) * 100
    : 0;

  if (accuracy === 100 && stats.score >= 10) {
    return {
      title: 'EXTRAORDINAIRE ! 🏆',
      subtitle: 'Performance parfaite !'
    };
  }

  if (accuracy >= 90) {
    return {
      title: 'Excellent ! ⭐',
      subtitle: 'Tu maîtrises le calcul mental !'
    };
  }

  if (accuracy >= 70) {
    return {
      title: 'Très bien ! 👏',
      subtitle: 'Continue comme ça !'
    };
  }

  if (accuracy >= 50) {
    return {
      title: 'Bien joué ! 👍',
      subtitle: 'Tu progresses !'
    };
  }

  return {
    title: 'Courage ! 💪',
    subtitle: 'Entraîne-toi encore !'
  };
}
