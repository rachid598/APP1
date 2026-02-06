// Messages d'encouragement variés selon le streak

const SIMPLE_SUCCESS = [
  "Bravo !",
  "Super !",
  "Exact !",
  "Bien joué !",
  "Parfait !",
  "Correct !",
  "Oui !",
  "Nickel !"
];

const STREAK_3 = [
  "En feu ! 🔥",
  "Imbattable !",
  "Quelle vitesse !",
  "Enchaînement !",
  "Série en cours !",
  "Tu gères !"
];

const STREAK_5 = [
  "Génie des maths ! 🧠",
  "Incroyable !",
  "Record en vue !",
  "Extraordinaire !",
  "Machine ! 🤖",
  "Inarrêtable !",
  "Légendaire ! ⭐"
];

const STREAK_10 = [
  "PHÉNOMÉNAL ! 🏆",
  "MODE DIEU ! 👑",
  "SURHUMAIN ! 💎",
  "HISTORIQUE ! 🎯",
  "ÉPIQUE ! ✨"
];

function randomFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getEncouragement(streak: number): string {
  if (streak >= 10) {
    return randomFrom(STREAK_10);
  } else if (streak >= 5) {
    return randomFrom(STREAK_5);
  } else if (streak >= 3) {
    return randomFrom(STREAK_3);
  } else {
    return randomFrom(SIMPLE_SUCCESS);
  }
}

// Messages d'erreur encourageants
const ERROR_MESSAGES = [
  "Presque !",
  "Pas grave !",
  "Continue !",
  "Allez !",
  "Tu peux le faire !"
];

export function getErrorMessage(): string {
  return randomFrom(ERROR_MESSAGES);
}
