export class ArcadeAnnouncer {
  private enabled: boolean = true;
  private voice: SpeechSynthesisVoice | null = null;
  private rate: number = 1.05;
  private pitch: number = 0.9;
  private volume: number = 0.85;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.selectVoice();
      };
      this.selectVoice();
    }
  }

  private selectVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prefer English voices with clear enunciation
    const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('David')));
    this.voice = preferred || voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public speak(text: string, priority: boolean = false) {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (priority) {
      window.speechSynthesis.cancel();
    }

    try {
      const utter = new SpeechSynthesisUtterance(text);
      if (this.voice) utter.voice = this.voice;
      utter.rate = this.rate;
      utter.pitch = this.pitch;
      utter.volume = this.volume;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn('Speech synthesis error', e);
    }
  }

  // --- Specific Game Callouts ---

  public announceRoundStart(round: number, p1Name: string, p2Name: string) {
    if (round === 1) {
      this.speak(`Round one. ${p1Name} versus ${p2Name}. Engage!`, true);
    } else {
      this.speak(`Round ${round}. Fight!`, true);
    }
  }

  public announceHandover(p2Name: string) {
    this.speak(`Player one finished. Step up, ${p2Name}!`, true);
  }

  public announceCriticalHit(shooterName: string, damage: number) {
    const lines = [
      `Critical headshot by ${shooterName}! ${damage} damage!`,
      `Devastating impact! ${shooterName} strikes for ${damage}!`,
      `Direct hit! Lethal shot by ${shooterName}!`
    ];
    this.speak(lines[Math.floor(Math.random() * lines.length)], true);
  }

  public announceWinner(winnerName: string, streak?: number) {
    if (streak && streak >= 3) {
      this.speak(`Unstoppable! ${winnerName} is on a ${streak} game win streak!`, true);
    } else {
      this.speak(`Victory! ${winnerName} wins the match!`, true);
    }
  }

  public announceBossDamage(studentName: string, damage: number) {
    this.speak(`${studentName} blasts the Boss for ${damage} damage!`, true);
  }

  public announceBossDefeat() {
    this.speak(`Target obliterated! The class has defeated the Megabot Boss!`, true);
  }
}

export const announcer = new ArcadeAnnouncer();

