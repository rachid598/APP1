class SoundSystemClass {
  private audioContext: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3): void {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch {
      // Audio non supporté
    }
  }

  playCorrect(): void {
    // Notes ascendantes joyeuses
    this.playTone(523.25, 0.1); // Do
    setTimeout(() => this.playTone(659.25, 0.1), 100); // Mi
    setTimeout(() => this.playTone(783.99, 0.15), 200); // Sol
  }

  playWrong(): void {
    // Son de buzz d'erreur
    this.playTone(200, 0.3, 'sawtooth', 0.2);
  }

  playBadge(): void {
    // Fanfare pour les badges
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2), i * 150);
    });
  }

  playStreak(): void {
    // Son de streak
    this.playTone(440, 0.1);
    setTimeout(() => this.playTone(554.37, 0.1), 80);
    setTimeout(() => this.playTone(659.25, 0.15), 160);
  }

  playTick(): void {
    // Tick de compte à rebours
    this.playTone(800, 0.05, 'square', 0.1);
  }

  playGameOver(): void {
    // Son de fin de partie
    this.playTone(392, 0.2);
    setTimeout(() => this.playTone(349.23, 0.2), 200);
    setTimeout(() => this.playTone(329.63, 0.3), 400);
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export const SoundSystem = new SoundSystemClass();

// Vibration helper
export function vibrate(pattern: number | number[]): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}
