// ==========================================================================
// STUDENT PROJECTS DASHBOARD — LOGIC & AUTO-DISCOVERY
// ==========================================================================

// 1. Dynamic Auto-Discovery of all student projects in Projects/*/project.json
const projectModules = import.meta.glob('../Projects/*/project.json', { eager: true });

function parseFolderName(path) {
  // Matches ../Projects/{FOLDER_NAME}/project.json
  const match = path.match(/\/Projects\/([^\/]+)\/project\.json$/) || path.match(/\\Projects\\([^\\]+)\\project\.json$/);
  return match ? match[1] : '';
}

function loadProjects() {
  const projects = [];

  for (const [path, module] of Object.entries(projectModules)) {
    const rawData = module.default || module;
    const folderName = parseFolderName(path) || rawData.folderName || 'Unknown_Project';

    // Parse folder convention: StudentName_Subject_ProjectNumber
    const parts = folderName.split('_');
    const defaultStudent = parts[0] ? parts[0].replace(/([A-Z])/g, ' $1').trim() : 'Student';
    const defaultSubject = parts[1] || 'General';
    const defaultProjNum = parts[2] || 'P1';

    const project = {
      folderName,
      studentName: rawData.studentName || defaultStudent,
      subject: rawData.subject || defaultSubject,
      projectNumber: rawData.projectNumber || defaultProjNum,
      title: rawData.title || `${rawData.studentName || defaultStudent}'s ${rawData.subject || defaultSubject} Project`,
      status: rawData.status || 'In Progress',
      description: rawData.description || 'Student exploratory research project and interactive web workspace.',
      lastUpdated: rawData.lastUpdated || '2026-09-13',
      tags: rawData.tags || [rawData.subject || defaultSubject],
      grade: rawData.grade || '8th Grade',
      school: rawData.school || 'MMT School',
      icon: rawData.icon || getSubjectIcon(rawData.subject || defaultSubject),
      color: (rawData.color || rawData.subject || 'chemistry').toLowerCase(),
      url: `/Projects/${folderName}/index.html`
    };

    projects.push(project);
  }

  // Fallback defaults if no glob was detected (e.g. outside Vite bundler)
  if (projects.length === 0) {
    projects.push(
      {
        folderName: 'Hadicha_Chemistry_P1',
        studentName: 'Hadicha Ibragimova',
        subject: 'Chemistry',
        projectNumber: 'P1',
        title: 'Quantrix — Interactive Chemistry Learning Suite',
        status: 'Completed',
        description: 'Interactive chemistry learning platform featuring an 118-element periodic table with real-time audio synthesis, molarity and dilution calculator, and quiz challenge.',
        lastUpdated: '2026-09-12',
        tags: ['Periodic Table', 'Solutions', 'Molarity', 'Audio Synthesis', 'Quiz Challenge'],
        grade: '8th Grade',
        school: 'MMT School',
        icon: '🧪',
        color: 'chemistry',
        url: '/Projects/Hadicha_Chemistry_P1/index.html'
      },
      {
        folderName: 'Student2_Physics_P2',
        studentName: 'Alex Chen',
        subject: 'Physics',
        projectNumber: 'P2',
        title: 'Kinematics & Harmonic Motion Lab',
        status: 'In Progress',
        description: 'Interactive Newtonian mechanics simulator with configurable planetary gravity (Earth, Moon, Mars, Jupiter), harmonic oscillation damping, and real-time mechanical energy tracking.',
        lastUpdated: '2026-09-13',
        tags: ['Kinematics', 'Gravity', 'Oscillation', 'HTML5 Canvas'],
        grade: '8th Grade',
        school: 'MMT School',
        icon: '⚡',
        color: 'physics',
        url: '/Projects/Student2_Physics_P2/index.html'
      },
      {
        folderName: 'Malika_Biology_P1',
        studentName: 'Malika Karimova',
        subject: 'Biology',
        projectNumber: 'P1',
        title: 'Cellular Organelles & Microscopy Lab',
        status: 'Completed',
        description: 'Interactive virtual microscope exploring animal and plant cell structures, organelle functions, and protein synthesis workflows.',
        lastUpdated: '2026-09-10',
        tags: ['Cell Biology', 'Organelles', 'Microscopy'],
        grade: '7th Grade',
        school: 'MMT School',
        icon: '🔬',
        color: 'biology',
        url: '/Projects/Malika_Biology_P1/index.html'
      }
    );
  }

  return projects;
}

function getSubjectIcon(subject) {
  const s = (subject || '').toLowerCase();
  if (s.includes('chem')) return '🧪';
  if (s.includes('phys')) return '⚡';
  if (s.includes('bio')) return '🔬';
  if (s.includes('math')) return '📐';
  if (s.includes('comp') || s.includes('cs') || s.includes('tech')) return '💻';
  return '📚';
}

function getInitials(name) {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// State
let allProjects = loadProjects();
let currentSearch = '';
let currentSubject = 'all';
let currentStatus = 'all';
let currentSort = 'recent';

// DOM Elements
const projectsGrid = document.getElementById('projects-grid');
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
const statusSelect = document.getElementById('status-filter');
const sortSelect = document.getElementById('sort-filter');
const chipButtons = document.querySelectorAll('.chip-btn');
const themeToggle = document.getElementById('theme-toggle');

// Stat Elements
const statTotal = document.getElementById('stat-total');
const statCompleted = document.getElementById('stat-completed');
const statProgress = document.getElementById('stat-progress');
const statSubjects = document.getElementById('stat-subjects');

function updateStats() {
  const total = allProjects.length;
  const completed = allProjects.filter(p => p.status.toLowerCase() === 'completed').length;
  const inProgress = allProjects.filter(p => p.status.toLowerCase().includes('progress')).length;
  const subjectsSet = new Set(allProjects.map(p => p.subject.toLowerCase()));

  if (statTotal) statTotal.textContent = total;
  if (statCompleted) statCompleted.textContent = completed;
  if (statProgress) statProgress.textContent = inProgress;
  if (statSubjects) statSubjects.textContent = subjectsSet.size;
}

function renderProjects() {
  // 1. Filter
  let filtered = allProjects.filter(p => {
    // Subject filter
    if (currentSubject !== 'all' && p.subject.toLowerCase() !== currentSubject.toLowerCase()) {
      return false;
    }
    // Status filter
    if (currentStatus !== 'all' && !p.status.toLowerCase().replace(/\s+/g, '').includes(currentStatus.toLowerCase())) {
      return false;
    }
    // Text search
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      const matchName = p.studentName.toLowerCase().includes(q);
      const matchSubject = p.subject.toLowerCase().includes(q);
      const matchId = p.folderName.toLowerCase().includes(q) || p.projectNumber.toLowerCase().includes(q);
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTags = p.tags && p.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchSubject && !matchId && !matchTitle && !matchDesc && !matchTags) {
        return false;
      }
    }
    return true;
  });

  // 2. Sort
  filtered.sort((a, b) => {
    if (currentSort === 'recent') {
      return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    }
    if (currentSort === 'name') {
      return a.studentName.localeCompare(b.studentName);
    }
    if (currentSort === 'subject') {
      return a.subject.localeCompare(b.subject);
    }
    return 0;
  });

  // 3. Render
  if (filtered.length === 0) {
    projectsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title">No matching student projects found</h3>
        <p class="empty-desc">Try modifying your search keywords or resetting your subject filter.</p>
      </div>
    `;
    return;
  }

  projectsGrid.innerHTML = filtered.map(p => {
    const isCompleted = p.status.toLowerCase() === 'completed';
    const statusClass = isCompleted ? 'completed' : 'inprogress';
    const statusLabel = isCompleted ? 'Completed' : 'In Progress';
    const initials = getInitials(p.studentName);
    const colorKey = p.subject.toLowerCase();

    return `
      <article class="project-card" data-project="${p.folderName}">
        <div class="card-accent-bar ${colorKey}"></div>
        <div class="card-body">
          <div class="card-meta-top">
            <span class="badge-subject ${colorKey}">
              <span>${p.icon}</span> ${p.subject}
            </span>
            <span class="status-pill ${statusClass}">
              <span class="status-dot"></span>
              ${statusLabel}
            </span>
          </div>

          <div class="student-profile">
            <div class="student-avatar" title="${p.studentName}">${initials}</div>
            <div class="student-name-group">
              <span class="student-name">${p.studentName}</span>
              <span class="folder-convention-id">${p.folderName}</span>
            </div>
          </div>

          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description}</p>

          <div class="project-tags">
            <span class="tag-chip" style="font-weight: 600; color: var(--primary-accent);">${p.projectNumber}</span>
            ${p.tags.map(tag => `<span class="tag-chip">${tag}</span>`).join('')}
          </div>

          <div class="card-footer">
            <span class="last-updated">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Updated ${p.lastUpdated}
            </span>
            <a href="${p.url}" class="open-project-btn" id="open-${p.folderName}">
              <span>Open Project</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Event Listeners
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    if (searchClear) {
      searchClear.style.display = currentSearch ? 'block' : 'none';
    }
    renderProjects();
  });
}

if (searchClear) {
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    currentSearch = '';
    searchClear.style.display = 'none';
    searchInput.focus();
    renderProjects();
  });
}

// Subject chip clicks
chipButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    chipButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSubject = btn.dataset.subject || 'all';
    renderProjects();
  });
});

if (statusSelect) {
  statusSelect.addEventListener('change', (e) => {
    currentStatus = e.target.value;
    renderProjects();
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderProjects();
  });
}

// Theme handling
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('student_dashboard_theme', theme);
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
}

// Keyboard shortcut '/' to search
window.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  }
});

// Initialize
const savedTheme = localStorage.getItem('student_dashboard_theme') || 'dark';
applyTheme(savedTheme);
updateStats();
renderProjects();
