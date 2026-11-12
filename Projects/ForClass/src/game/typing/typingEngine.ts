import { calculateWpm, calculateAccuracy, calculateEffectiveWpm } from './wpm';

export type CharStatus = 'correct' | 'incorrect' | 'cursor' | 'pending';

export interface EvaluatedChar {
  char: string;
  expectedChar: string;
  status: CharStatus;
}

export interface TypingEngineState {
  targetText: string;
  typedText: string;
  mistakes: number;
  totalKeystrokes: number;
  startTime: number | null;
  endTime: number | null;
  isCompleted: boolean;
  isExpired: boolean;
  wpm: number;
  accuracy: number;
  effectiveWpm: number;
  elapsedSeconds: number;
}

export class TypingEngine {
  private targetText: string;
  private typedText: string = '';
  private mistakes: number = 0;
  private totalKeystrokes: number = 0;
  private startTime: number | null = null;
  private endTime: number | null = null;
  private isCompleted: boolean = false;
  private isExpired: boolean = false;

  constructor(targetText: string) {
    this.targetText = targetText;
  }

  public reset(newTargetText?: string) {
    if (newTargetText !== undefined) {
      this.targetText = newTargetText;
    }
    this.typedText = '';
    this.mistakes = 0;
    this.totalKeystrokes = 0;
    this.startTime = null;
    this.endTime = null;
    this.isCompleted = false;
    this.isExpired = false;
  }

  public handleKeyInput(key: string, now: number = Date.now()): { changed: boolean; isError: boolean } {
    if (this.isCompleted || this.isExpired) {
      return { changed: false, isError: false };
    }

    if (!this.startTime) {
      this.startTime = now;
    }

    if (key === 'Backspace') {
      if (this.typedText.length > 0) {
        this.typedText = this.typedText.slice(0, -1);
        return { changed: true, isError: false };
      }
      return { changed: false, isError: false };
    }

    // Only process single printable characters
    if (key.length !== 1) {
      return { changed: false, isError: false };
    }

    // Don't type beyond the challenge length
    if (this.typedText.length >= this.targetText.length) {
      return { changed: false, isError: false };
    }

    const expectedChar = this.targetText[this.typedText.length];
    const isError = key !== expectedChar;

    this.totalKeystrokes++;
    if (isError) {
      this.mistakes++;
    }

    this.typedText += key;

    // Check completion
    if (this.typedText.length === this.targetText.length) {
      this.isCompleted = true;
      this.endTime = now;
    }

    return { changed: true, isError };
  }

  public expire(now: number = Date.now()) {
    if (!this.isCompleted) {
      this.isExpired = true;
      this.endTime = now;
    }
  }

  public getState(now: number = Date.now()): TypingEngineState {
    const elapsedMs = this.startTime
      ? (this.endTime ?? now) - this.startTime
      : 0;
    const elapsedSeconds = Math.max(0.1, elapsedMs / 1000);

    let correctChars = 0;
    for (let i = 0; i < this.typedText.length; i++) {
      if (this.typedText[i] === this.targetText[i]) {
        correctChars++;
      }
    }

    const wpm = this.startTime ? calculateWpm(correctChars, elapsedSeconds) : 0;
    const accuracy = this.totalKeystrokes > 0
      ? calculateAccuracy(correctChars, this.totalKeystrokes)
      : 100;
    const effectiveWpm = calculateEffectiveWpm(wpm, accuracy);

    return {
      targetText: this.targetText,
      typedText: this.typedText,
      mistakes: this.mistakes,
      totalKeystrokes: this.totalKeystrokes,
      startTime: this.startTime,
      endTime: this.endTime,
      isCompleted: this.isCompleted,
      isExpired: this.isExpired,
      wpm,
      accuracy,
      effectiveWpm,
      elapsedSeconds: Math.round(elapsedSeconds * 10) / 10
    };
  }

  public getEvaluatedChars(): EvaluatedChar[] {
    const chars: EvaluatedChar[] = [];
    const len = this.targetText.length;

    for (let i = 0; i < len; i++) {
      const expectedChar = this.targetText[i];
      if (i < this.typedText.length) {
        const typedChar = this.typedText[i];
        chars.push({
          char: typedChar,
          expectedChar,
          status: typedChar === expectedChar ? 'correct' : 'incorrect'
        });
      } else if (i === this.typedText.length) {
        chars.push({
          char: '',
          expectedChar,
          status: 'cursor'
        });
      } else {
        chars.push({
          char: '',
          expectedChar,
          status: 'pending'
        });
      }
    }
    return chars;
  }
}

