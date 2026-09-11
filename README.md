# ⚛️ Quantrix — Chemistry App

An interactive educational chemistry application designed for 7th and 8th-grade students.

Created by **Hadicha Ibragimova**, student at **MMT School**.

---

## ✨ Features

- **Interactive Periodic Table**: All 118 chemical elements arranged in standard periodic layout with color-coded elemental groups.
- **Audio Synthesizer**: Each element triggers a unique harmonic tone scaled to its atomic number using the browser's native Web Audio API.
- **Element Inspector**: Instant access to atomic number, atomic mass, symbol, name, and classification.
- **Calculator**: Fast arithmetic tool for chemistry problem-solving and percent calculations.
- **Solution Concentration Tool**: Instant mass/volume percentage calculation with input validation.
- **Responsive & Modern UI**: Built with dark mode aesthetics, glassmorphism, smooth animations, and Google Fonts (Outfit & Inter).

---

## 🛠️ Project Structure

```text
├── index.html               # Main HTML entry point
├── package.json             # NPM dependencies and development scripts
├── vite.config.js           # Vite build tooling configuration
├── vercel.json              # Vercel deployment configuration
├── .gitignore               # Git ignored patterns
└── src/
    ├── main.js              # Application bootstrapper and navigation controller
    ├── style.css            # Design system, CSS variables, and layout
    ├── data/
    │   └── elements.js      # Complete 118-element periodic dataset
    └── modules/
        ├── audio.js         # Web Audio API sound generator
        ├── calculator.js    # Arithmetic calculator logic
        ├── concentration.js # Solution concentration calculator
        └── periodicTable.js # Periodic table grid and element card
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

```bash
npm install
```

### Local Development

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Visit the local server in your browser (typically `http://localhost:3000`).

### Production Build

Compile and optimize assets into `dist/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🌐 Deployment to Vercel

### Option 1: Automatic Deployment via GitHub (Recommended)
1. Push this repository to GitHub.
2. Log into [Vercel](https://vercel.com).
3. Click **Add New Project** -> **Import Git Repository**.
4. Select `quantrix-chemistry-app`.
5. Vercel will automatically detect **Vite** and configure the build command (`npm run build`) and output directory (`dist`).
6. Click **Deploy**.

### Option 2: CLI Deployment
```bash
npx vercel
```
Follow the interactive prompts to link your Vercel account and deploy.

---

## 📄 License & Credits

- **Project Lead**: Hadicha Ibragimova (MMT School)
- **Year**: 2026
