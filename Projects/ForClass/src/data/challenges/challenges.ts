import { Difficulty } from '../../types/game';

export interface ChallengeItem {
  id: string;
  text: string;
  difficulty: Difficulty;
  category: 'words' | 'sentences' | 'hard' | 'tech' | 'classroom';
  charCount: number;
  wordCount: number;
}

export const CLASSROOM_PRESETS = [
  {
    name: 'Classroom: Spelling & Sight Words',
    difficulty: 'easy' as Difficulty,
    words: [
      'beautiful tomorrow because believe friend special necessary',
      'curiosity courage wisdom honesty kindness patience gratitude',
      'adventure journey mountain horizon whisper gentle breeze',
      'celebrate freedom library mystery dangerous impossible treasure',
      'together challenge practice improve discover succeed celebrate'
    ]
  },
  {
    name: 'Classroom: Science & STEM Terms',
    difficulty: 'medium' as Difficulty,
    words: [
      'Photosynthesis converts solar light into biochemical glucose energy.',
      'The solar system consists of eight planets orbiting the central sun.',
      'Mitochondria synthesize chemical energy required for cellular function.',
      'Plate tectonics explain continental drift earthquakes and volcanoes.',
      'Water evaporates into clouds and precipitates back to Earth as rain.'
    ]
  },
  {
    name: 'Classroom: Advanced Vocabulary',
    difficulty: 'hard' as Difficulty,
    words: [
      'Diligent academic research and rigorous scientific inquiry reveal fundamental universal truths.',
      'Eloquent discourse and thoughtful contemplation inspire profound philosophical breakthroughs.',
      'The architectural blueprint incorporated sustainable geothermal ventilation and solar arrays.',
      'Biodiversity within delicate marine ecosystems requires comprehensive environmental conservation.'
    ]
  }
];

export const CHALLENGES: ChallengeItem[] = [
  // --- EASY: Short words & simple phrases (char count ~25-45) ---
  {
    id: 'e1',
    text: 'quick aim steady breath fire on mark',
    difficulty: 'easy',
    category: 'words',
    charCount: 37,
    wordCount: 7
  },
  {
    id: 'e2',
    text: 'fast draw high speed bullet in flight',
    difficulty: 'easy',
    category: 'words',
    charCount: 37,
    wordCount: 7
  },
  {
    id: 'e3',
    text: 'neon lights burn bright in the dark night',
    difficulty: 'easy',
    category: 'sentences',
    charCount: 41,
    wordCount: 8
  },
  {
    id: 'e4',
    text: 'keep your fingers nimble and type fast',
    difficulty: 'easy',
    category: 'sentences',
    charCount: 38,
    wordCount: 7
  },
  {
    id: 'e5',
    text: 'target locked on radar ready to engage',
    difficulty: 'easy',
    category: 'sentences',
    charCount: 38,
    wordCount: 7
  },
  {
    id: 'e6',
    text: 'silver trigger pulled with zero delay',
    difficulty: 'easy',
    category: 'sentences',
    charCount: 37,
    wordCount: 6
  },
  {
    id: 'e7',
    text: 'cyber runner sprint past the red laser',
    difficulty: 'easy',
    category: 'sentences',
    charCount: 38,
    wordCount: 7
  },
  {
    id: 'e8',
    text: 'never look back when the timer ticks down',
    difficulty: 'easy',
    category: 'sentences',
    charCount: 41,
    wordCount: 8
  },
  {
    id: 'e9',
    text: 'lock and load the chamber for the next round',
    difficulty: 'easy',
    category: 'sentences',
    charCount: 44,
    wordCount: 9
  },
  {
    id: 'e10',
    text: 'precision and rhythm will win this duel',
    difficulty: 'easy',
    category: 'sentences',
    charCount: 39,
    wordCount: 7
  },

  // --- CLASSROOM SPELLING PRESETS ---
  {
    id: 'cls_1',
    text: 'curiosity courage wisdom honesty kindness patience gratitude',
    difficulty: 'easy',
    category: 'classroom',
    charCount: 60,
    wordCount: 7
  },
  {
    id: 'cls_2',
    text: 'celebrate freedom library mystery dangerous impossible treasure',
    difficulty: 'easy',
    category: 'classroom',
    charCount: 63,
    wordCount: 7
  },
  {
    id: 'cls_3',
    text: 'together challenge practice improve discover succeed celebrate',
    difficulty: 'easy',
    category: 'classroom',
    charCount: 62,
    wordCount: 7
  },

  // --- MEDIUM: Standard English sentences (char count ~60-85) ---
  {
    id: 'm1',
    text: 'The cybernetic assassin adjusted their optical sights before pulling the hair trigger.',
    difficulty: 'medium',
    category: 'sentences',
    charCount: 88,
    wordCount: 12
  },
  {
    id: 'm2',
    text: 'A true marksman understands that speed without accuracy is merely noise in the wind.',
    difficulty: 'medium',
    category: 'sentences',
    charCount: 85,
    wordCount: 14
  },
  {
    id: 'm3',
    text: 'Lightning illuminated the ruined skyline as both combatants waited for the signal.',
    difficulty: 'medium',
    category: 'sentences',
    charCount: 82,
    wordCount: 12
  },
  {
    id: 'm4',
    text: 'High caliber ammunition whistled across the desolate arena shattering the quiet night.',
    difficulty: 'medium',
    category: 'sentences',
    charCount: 86,
    wordCount: 12
  },
  {
    id: 'm5',
    text: 'Every keystroke counts when you stand face to face with the fastest sniper in town.',
    difficulty: 'medium',
    category: 'sentences',
    charCount: 83,
    wordCount: 15
  },
  {
    id: 'm6',
    text: 'The countdown echoed in their ears as adrenaline flooded their cybernetic nervous system.',
    difficulty: 'medium',
    category: 'sentences',
    charCount: 89,
    wordCount: 13
  },
  {
    id: 'm7',
    text: 'Thermal sensors detected movement behind the steel barricade just before the blast.',
    difficulty: 'medium',
    category: 'sentences',
    charCount: 84,
    wordCount: 12
  },
  {
    id: 'm8',
    text: 'Maintaining composure under intense pressure separates champions from fallen contenders.',
    difficulty: 'medium',
    category: 'sentences',
    charCount: 88,
    wordCount: 10
  },
  {
    id: 'm9',
    text: 'The railgun capacitor charged with a rising whine of raw electromagnetic power.',
    difficulty: 'medium',
    category: 'sentences',
    charCount: 80,
    wordCount: 12
  },
  {
    id: 'm10',
    text: 'Smoke poured from the barrel as the ejected cartridge clattered across the metal floor.',
    difficulty: 'medium',
    category: 'sentences',
    charCount: 87,
    wordCount: 14
  },

  // --- CLASSROOM STEM PRESETS ---
  {
    id: 'cls_stem1',
    text: 'Photosynthesis converts solar light into biochemical glucose energy.',
    difficulty: 'medium',
    category: 'classroom',
    charCount: 68,
    wordCount: 9
  },
  {
    id: 'cls_stem2',
    text: 'Mitochondria synthesize chemical energy required for cellular function.',
    difficulty: 'medium',
    category: 'classroom',
    charCount: 71,
    wordCount: 9
  },
  {
    id: 'cls_stem3',
    text: 'Plate tectonics explain continental drift earthquakes and volcanoes.',
    difficulty: 'medium',
    category: 'classroom',
    charCount: 68,
    wordCount: 9
  },

  // --- HARD: Complex vocabulary, punctuation & longer sentences (~110-140 chars) ---
  {
    id: 'h1',
    text: 'Ballistic calculations require instantaneous compensation for atmospheric barometric pressure, Coriolis effect, and crosswind velocity.',
    difficulty: 'hard',
    category: 'hard',
    charCount: 138,
    wordCount: 16
  },
  {
    id: 'h2',
    text: 'The hyper-accelerated kinetic slug penetrated three layers of composite ceramic plating before obliterating the designated perimeter target.',
    difficulty: 'hard',
    category: 'hard',
    charCount: 141,
    wordCount: 18
  },
  {
    id: 'h3',
    text: 'Tactical superiority demands an unshakeable synchronization between optical perception, cognitive processing, and neuromuscular execution.',
    difficulty: 'hard',
    category: 'hard',
    charCount: 139,
    wordCount: 16
  },
  {
    id: 'h4',
    text: 'Subterranean corridors reverberated with explosive shockwaves as electromagnetic rail cannons exchanged relentless supersonic volleys.',
    difficulty: 'hard',
    category: 'hard',
    charCount: 135,
    wordCount: 15
  },
  {
    id: 'h5',
    text: 'Mastery over the mechanical keyboard requires disciplined finger positioning, subconscious muscle memory, and an unwavering cadence.',
    difficulty: 'hard',
    category: 'hard',
    charCount: 134,
    wordCount: 17
  },
  {
    id: 'h6',
    text: 'Oscillating frequencies within the plasma containment field threatened catastrophic thermal overload unless vented within fractions of a second.',
    difficulty: 'hard',
    category: 'hard',
    charCount: 147,
    wordCount: 18
  },
  {
    id: 'h7',
    text: 'Autonomous combat drones swarmed through fractured architecture, their infrared sensors scanning relentlessly for biological signatures.',
    difficulty: 'hard',
    category: 'hard',
    charCount: 137,
    wordCount: 16
  },
  {
    id: 'h8',
    text: 'A profound silence settled over the devastated battlefield, broken only by the intermittent crackle of damaged high-voltage conduits.',
    difficulty: 'hard',
    category: 'hard',
    charCount: 134,
    wordCount: 18
  },

  // --- TECH: Programming syntax & technical terminology (~75-105 chars) ---
  {
    id: 't1',
    text: 'const combatResult = players.reduce((winner, p) => p.effectiveWpm > winner.effectiveWpm ? p : winner);',
    difficulty: 'tech',
    category: 'tech',
    charCount: 103,
    wordCount: 14
  },
  {
    id: 't2',
    text: 'async function fireBallisticProjectile(velocity, trajectory) { await renderMuzzleFlash(); }',
    difficulty: 'tech',
    category: 'tech',
    charCount: 91,
    wordCount: 11
  },
  {
    id: 't3',
    text: 'export interface PlayerCombatStats { accuracy: number; wpm: number; totalHits: number; }',
    difficulty: 'tech',
    category: 'tech',
    charCount: 88,
    wordCount: 12
  },
  {
    id: 't4',
    text: 'window.requestAnimationFrame(() => canvasContext.drawImage(sprite, posX, posY, 64, 64));',
    difficulty: 'tech',
    category: 'tech',
    charCount: 88,
    wordCount: 9
  },
  {
    id: 't5',
    text: 'git commit -m "feat(arena): implement recoil animation and dynamic particle system"',
    difficulty: 'tech',
    category: 'tech',
    charCount: 83,
    wordCount: 10
  },
  {
    id: 't6',
    text: 'const db = await openDB("TypeOrDieDB", 1, { upgrade(db) { db.createObjectStore("profiles"); } });',
    difficulty: 'tech',
    category: 'tech',
    charCount: 98,
    wordCount: 13
  },
  {
    id: 't7',
    text: 'class ParticleSystem { constructor(x, y, color) { this.particles = []; this.active = true; } }',
    difficulty: 'tech',
    category: 'tech',
    charCount: 95,
    wordCount: 14
  },
  {
    id: 't8',
    text: 'const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); audioCtx.resume();',
    difficulty: 'tech',
    category: 'tech',
    charCount: 93,
    wordCount: 11
  }
];

export function getCustomTeacherChallenges(): ChallengeItem[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem('type_or_die_custom_words');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: { text: string; difficulty?: Difficulty }, idx: number) => ({
          id: 'custom_word_' + idx,
          text: item.text.trim(),
          difficulty: item.difficulty || 'medium',
          category: 'classroom' as const,
          charCount: item.text.trim().length,
          wordCount: item.text.trim().split(/\s+/).length
        }));
      }
    }
  } catch (e) {
    console.warn('Failed reading custom teacher words', e);
  }
  return [];
}

/**
 * Get two balanced, distinct challenges for a round of the specified difficulty.
 */
export function getBalancedChallengePair(difficulty: Difficulty): [ChallengeItem, ChallengeItem] {
  const customWords = getCustomTeacherChallenges().filter(c => c.difficulty === difficulty);
  const pool = [...customWords, ...CHALLENGES.filter(c => c.difficulty === difficulty)];

  if (pool.length < 2) {
    return [CHALLENGES[0], CHALLENGES[1]];
  }

  // Shuffle pool
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const first = shuffled[0];

  let second = shuffled[1];
  let minDiff = Math.abs(second.charCount - first.charCount);

  for (let i = 2; i < shuffled.length; i++) {
    const candidate = shuffled[i];
    if (candidate.id === first.id) continue;
    const diff = Math.abs(candidate.charCount - first.charCount);
    if (diff < minDiff) {
      second = candidate;
      minDiff = diff;
    }
  }

  return [first, second];
}
