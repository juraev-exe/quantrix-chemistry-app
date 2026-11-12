import { describe, it, expect } from 'vitest';
import { TypingEngine } from '../game/typing/typingEngine';

describe('Typing Engine: Core Logic & Evaluation', () => {
  it('initializes with target text and empty typed text', () => {
    const engine = new TypingEngine('quick shot');
    const state = engine.getState();
    expect(state.targetText).toBe('quick shot');
    expect(state.typedText).toBe('');
    expect(state.isCompleted).toBe(false);
    expect(state.mistakes).toBe(0);
  });

  it('correctly records keystrokes and marks typos', () => {
    const engine = new TypingEngine('aim');
    const t0 = 1000;

    // Correct 'a'
    const res1 = engine.handleKeyInput('a', t0);
    expect(res1.changed).toBe(true);
    expect(res1.isError).toBe(false);

    // Incorrect 'x' (expected 'i')
    const res2 = engine.handleKeyInput('x', t0 + 100);
    expect(res2.changed).toBe(true);
    expect(res2.isError).toBe(true);

    const state = engine.getState(t0 + 200);
    expect(state.typedText).toBe('ax');
    expect(state.mistakes).toBe(1);
    expect(state.totalKeystrokes).toBe(2);
  });

  it('handles backspace correctly', () => {
    const engine = new TypingEngine('aim');
    engine.handleKeyInput('a');
    engine.handleKeyInput('x'); // typo
    expect(engine.getState().typedText).toBe('ax');

    const backRes = engine.handleKeyInput('Backspace');
    expect(backRes.changed).toBe(true);
    expect(engine.getState().typedText).toBe('a');

    // Type correct 'i' and 'm'
    engine.handleKeyInput('i');
    engine.handleKeyInput('m');
    expect(engine.getState().isCompleted).toBe(true);
  });

  it('generates accurate character status breakdown', () => {
    const engine = new TypingEngine('fire');
    engine.handleKeyInput('f'); // correct
    engine.handleKeyInput('x'); // incorrect

    const evals = engine.getEvaluatedChars();
    expect(evals[0]).toEqual({ char: 'f', expectedChar: 'f', status: 'correct' });
    expect(evals[1]).toEqual({ char: 'x', expectedChar: 'i', status: 'incorrect' });
    expect(evals[2]).toEqual({ char: '', expectedChar: 'r', status: 'cursor' });
    expect(evals[3]).toEqual({ char: '', expectedChar: 'e', status: 'pending' });
  });

  it('detects completion and prevents typing after completion or expiration', () => {
    const engine = new TypingEngine('go');
    engine.handleKeyInput('g');
    engine.handleKeyInput('o');
    expect(engine.getState().isCompleted).toBe(true);

    // Further input ignored
    const extra = engine.handleKeyInput('!');
    expect(extra.changed).toBe(false);
  });
});

