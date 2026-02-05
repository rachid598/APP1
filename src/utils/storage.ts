import type { GameStats } from '../types';
import { DEFAULT_STATS } from '../types';

const STATS_KEY = 'calcul-mental-stats';
const BADGES_KEY = 'calcul-mental-badges';
const SOUND_KEY = 'calcul-mental-sound';
const ZEN_KEY = 'calcul-mental-zen';

export function loadStats(): GameStats {
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      return { ...DEFAULT_STATS, ...JSON.parse(saved) };
    }
  } catch {
    // Erreur de parsing
  }
  return { ...DEFAULT_STATS };
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Erreur de stockage
  }
}

export function loadUnlockedBadges(): string[] {
  try {
    const saved = localStorage.getItem(BADGES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Erreur de parsing
  }
  return [];
}

export function saveUnlockedBadges(badges: string[]): void {
  try {
    localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
  } catch {
    // Erreur de stockage
  }
}

export function loadSoundPreference(): boolean {
  try {
    const saved = localStorage.getItem(SOUND_KEY);
    return saved !== 'false';
  } catch {
    return true;
  }
}

export function saveSoundPreference(enabled: boolean): void {
  try {
    localStorage.setItem(SOUND_KEY, String(enabled));
  } catch {
    // Erreur de stockage
  }
}

export function loadZenMode(): boolean {
  try {
    const saved = localStorage.getItem(ZEN_KEY);
    return saved === 'true';
  } catch {
    return false;
  }
}

export function saveZenMode(enabled: boolean): void {
  try {
    localStorage.setItem(ZEN_KEY, String(enabled));
  } catch {
    // Erreur de stockage
  }
}
