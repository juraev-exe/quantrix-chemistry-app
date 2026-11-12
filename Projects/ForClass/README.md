# TYPE OR DIE | Local Multiplayer Typing Shooter

A competitive, local two-player typing shooter arcade game. Two snipers duel on one computer and one monitor, using their keyboard typing speed and accuracy as weapons. The player with the higher effective typing speed lands a shot on their opponent until health drops to zero.

Works **100% offline** with zero external cloud accounts, APIs, or database dependencies.

---

## 🎮 Game Overview

- **Platform**: Modern Desktop Web Browsers (Chrome, Firefox, Safari, Edge)
- **Controls**: Physical Computer Keyboard
- **Players**: 2 Players (Local Turn-Based Alternating Shootout) + Solo Practice Mode
- **Persistence**: IndexedDB (Profiles, Match Records, Hall of Fame) + LocalStorage (Settings)

---

## 🚀 Quick Start

### 1. Development Mode
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build
```bash
npm run build
npm run preview
```

### 3. Running Automated Tests
```bash
npm test
```

---

## 🎯 Gameplay Mechanics

### The Alternating Turn Loop
1. **3-Second Countdown**: Prepares Player 1.
2. **Player 1 Turn**: Player 1 types the tactical challenge. Live character highlighting shows green (correct) and red (error). Backspace is fully supported; copy-paste is strictly disabled.
3. **Confidential Handover**: When Player 1 finishes, their performance metrics are **sealed and hidden**. The keyboard is passed to Player 2.
4. **Player 2 Turn**: Player 2 receives an equivalent challenge matched by difficulty tier and word length.
5. **The Shootout**: Both metrics are revealed. The superior sniper discharges their animated rifle, bullet travels across the 2D canvas, particles explode on impact, and damage is deducted from the loser's health bar.

### Effective WPM & Damage Calculations
- **Effective WPM**:
  $$\text{Effective WPM} = \text{Raw WPM} \times \left(\frac{\text{Accuracy \%}}{100}\right)$$
- **Damage Formula**:
  $$\text{Base Damage} = 10$$
  $$\text{Bonus Damage} = \min\left(25, \text{round}\left((\text{Winner Eff. WPM} - \text{Loser Eff. WPM}) \times 0.5\right)\right)$$
  $$\text{Total Damage} = \text{Base Damage} + \text{Bonus Damage} \quad (\text{Min: } 10 \text{ HP}, \text{ Max: } 35 \text{ HP})$$
- **Critical Hits**: High damage hits ($\ge 24$ HP) trigger an arcade screen shake, loud metallic chimes, and heavy sparks.

---

## 🕹️ Game Modes

1. **Quick Duel**: 100 HP deathmatch. First player to eliminate the opponent wins.
2. **Best of 3**: Win 2 rounds to claim match victory.
3. **Best of 5**: Tournament marathon. First to win 3 rounds wins.
4. **Sudden Death**: Starting HP is 1. One successful shot eliminates the opponent immediately.
5. **Practice Range**: Solo speed and accuracy drills with instant feedback and challenge re-rolling.
6. **Custom Match**: Configure Starting HP (50-200), Time Limits (15s-60s), Damage Multipliers (0.5x-2.0x), and Rounds to Win.

---

## 🏛️ Architecture & Technologies

```
src/
  ├── components/          # Reusable UI components (Header, CRTOverlay)
  ├── data/
  │   ├── challenges/      # Easy, Medium, Hard, and Tech typing prompts
  │   ├── characters/      # 6 Cyberpunk character archetypes & avatars
  │   └── weapons/         # 5 Weapon types with custom muzzle flashes and speeds
  ├── database/
  │   ├── indexedDB.ts     # Native promise-based IndexedDB storage
  │   ├── profiles.ts      # Player profile CRUD and lifetime statistics
  │   ├── matches.ts       # Full match history recording
  │   └── backup.ts        # Full JSON Export and Import backup engine
  ├── game/
  │   ├── audio/           # Web Audio API procedural synthesizer (gunshot, hits, UI)
  │   ├── canvas/          # HTML5 Canvas 2D scene, procedural sprites & particles
  │   ├── combat/          # Combat engine & damage calculations
  │   └── typing/          # Typing engine, real-time WPM, accuracy & backspace logic
  ├── hooks/               # useSettings custom hook
  ├── screens/             # MainMenu, Arena, Registration, Leaderboard, History, Stats, etc.
  ├── types/               # Strict TypeScript interface definitions
  └── tests/               # Vitest unit & integration test suites
```

---

## 🛡️ Offline & Persistence Guarantees

- **Zero Cloud Footprint**: Works completely offline without server calls.
- **Service Worker (`sw.js`)**: Caches all essential assets for instantaneous loading.
- **Data Portability**: Full JSON export and import in System Settings allows migrating or backing up all player records and match telemetry anytime.

