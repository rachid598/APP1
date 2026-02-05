import type { Badge, GameStats } from '../types';

export const BADGES: Badge[] = [
  {
    id: 'first_game',
    name: 'Première partie',
    description: 'Jouer sa première partie',
    icon: '🎮',
    condition: (stats) => stats.totalGames >= 1
  },
  {
    id: 'perfect_10',
    name: 'Sans faute',
    description: 'Faire 10 bonnes réponses d\'affilée',
    icon: '⭐',
    condition: (stats) => stats.bestStreak >= 10
  },
  {
    id: 'streak_25',
    name: 'En feu !',
    description: 'Faire 25 bonnes réponses d\'affilée',
    icon: '🔥',
    condition: (stats) => stats.bestStreak >= 25
  },
  {
    id: 'streak_50',
    name: 'Inarrêtable',
    description: 'Faire 50 bonnes réponses d\'affilée',
    icon: '💎',
    condition: (stats) => stats.bestStreak >= 50
  },
  {
    id: 'games_10',
    name: 'Habitué',
    description: 'Jouer 10 parties',
    icon: '🏅',
    condition: (stats) => stats.totalGames >= 10
  },
  {
    id: 'games_50',
    name: 'Assidu',
    description: 'Jouer 50 parties',
    icon: '🏆',
    condition: (stats) => stats.totalGames >= 50
  },
  {
    id: 'games_100',
    name: 'Champion',
    description: 'Jouer 100 parties',
    icon: '👑',
    condition: (stats) => stats.totalGames >= 100
  },
  {
    id: 'addition_master',
    name: 'Maître Addition',
    description: 'Jouer 20 parties en addition',
    icon: '➕',
    condition: (stats) => stats.gamesPerOperation.addition >= 20
  },
  {
    id: 'multiplication_master',
    name: 'Maître Multiplication',
    description: 'Jouer 20 parties en multiplication',
    icon: '✖️',
    condition: (stats) => stats.gamesPerOperation.multiplication >= 20
  },
  {
    id: 'division_master',
    name: 'Maître Division',
    description: 'Jouer 20 parties en division',
    icon: '➗',
    condition: (stats) => stats.gamesPerOperation.division >= 20
  },
  {
    id: 'expert_player',
    name: 'Expert',
    description: 'Jouer 10 parties en mode Expert',
    icon: '🧠',
    condition: (stats) => stats.gamesPerDifficulty.expert >= 10
  },
  {
    id: 'perfect_games_5',
    name: 'Perfectionniste',
    description: 'Faire 5 parties parfaites',
    icon: '💯',
    condition: (stats) => stats.perfectGames >= 5
  },
  {
    id: 'correct_500',
    name: 'Calculateur',
    description: 'Répondre correctement à 500 questions',
    icon: '🧮',
    condition: (stats) => stats.totalCorrect >= 500
  }
];

export function getUnlockedBadges(_stats: GameStats, unlockedIds: string[]): Badge[] {
  return BADGES.filter(badge => unlockedIds.includes(badge.id));
}

export function checkNewBadges(stats: GameStats, currentUnlocked: string[]): Badge[] {
  const newBadges: Badge[] = [];

  BADGES.forEach(badge => {
    if (!currentUnlocked.includes(badge.id) && badge.condition(stats)) {
      newBadges.push(badge);
    }
  });

  return newBadges;
}
