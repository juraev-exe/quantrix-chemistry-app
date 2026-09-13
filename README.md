# 🎓 Student Projects Hub

A modern, scalable educational platform and project management dashboard designed to organize, showcase, and run student science and engineering projects.

Each student project is completely isolated in its own dedicated workspace, while the primary dashboard dynamically discovers, indexes, and presents them as visual interactive cards.

---

## 🏗️ Architecture & Project Structure

```text
Student_Projects/
├── index.html                           # Main Student Projects Dashboard UI
├── vite.config.js                       # Multi-Page (MPA) auto-discovery build config
├── package.json                         # Project metadata and dependencies
├── vercel.json                          # Vercel static & MPA routing configuration
├── src/                                 # Dashboard core assets
│   ├── dashboard.js                     # Auto-discovery, search, filters & stats
│   └── dashboard.css                    # Professional dark/light design system
│
└── Projects/                            # Isolated student project workspaces
    ├── Hadicha_Chemistry_P1/            # Hadicha Ibragimova's Quantrix Chemistry project
    │   ├── index.html                   # Chemistry app with return header
    │   ├── project.json                 # Metadata manifest
    │   └── src/                         # Self-contained modules, data, and styles
    │
    ├── Student2_Physics_P2/             # Alex Chen's Kinematics Lab simulation
    │   ├── index.html                   # Physics simulator app with return header
    │   ├── project.json                 # Metadata manifest
    │   └── src/                         # Physics simulation scripts & styles
    │
    └── Malika_Biology_P1/               # Malika Karimova's Cellular Microscopy Lab
        ├── index.html                   # Biology lab app with return header
        ├── project.json                 # Metadata manifest
        └── src/
```

---

## 📋 Naming Convention

Every student project folder inside `Projects/` strictly follows the format:

```text
Projects/StudentName_Subject_ProjectNumber/
```

**Examples:**
- `Hadicha_Chemistry_P1`
- `Student2_Physics_P2`
- `Malika_Biology_P1`

---

## ➕ How to Add a New Student Project

The dashboard is completely scalable and uses **dynamic auto-discovery**.

1. Create a new folder inside `Projects/`:
   ```bash
   mkdir Projects/YourName_Subject_P1
   ```

2. Add a `project.json` file inside that folder:
   ```json
   {
     "studentName": "Firstname Lastname",
     "subject": "Physics",
     "projectNumber": "P1",
     "title": "Project Title Here",
     "status": "In Progress",
     "description": "A concise summary of your project...",
     "tags": ["Topic 1", "Topic 2"],
     "lastUpdated": "2026-09-13"
   }
   ```

3. Add an `index.html` with your project's code and assets inside that folder.

4. Start the dev server (`npm run dev`) or build (`npm run build`). The dashboard will automatically detect and render your new card!

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+)
- [npm](https://www.npmjs.com/)

### Installation

```bash
npm install
```

### Local Development

```bash
npm run dev
```

Visit the local server in your browser (default: `http://localhost:3000`).

### Production Build

```bash
npm run build
```

---

## 🌐 Deployment

### Vercel Deployment

Deploy directly via the Vercel CLI:

```bash
npx vercel --prod
```

Or import the GitHub repository into your [Vercel Dashboard](https://vercel.com/new).

---

## 📄 License & Credits

- **School**: MMT School
- **Year**: 2026
