// ==========================================================================
// STUDENT PROJECTS SHOWCASE — MINIMALIST RUNTIME
// ==========================================================================

// Auto-discovery of all student projects in Projects/*/project.json
const projectModules = import.meta.glob('../Projects/*/project.json', { eager: true });

function parseFolderName(path) {
  const match = path.match(/\/Projects\/([^\/]+)\/project\.json$/) || path.match(/\\Projects\\([^\\]+)\\project\.json$/);
  return match ? match[1] : '';
}

function loadProjects() {
  const projects = [];

  for (const [path, module] of Object.entries(projectModules)) {
    const rawData = module.default || module;
    const folderName = parseFolderName(path) || rawData.folderName || 'Unknown_Project';

    const parts = folderName.split('_');
    const defaultStudent = parts[0] ? parts[0].replace(/([A-Z])/g, ' $1').trim() : 'Student';
    const defaultSubject = parts[1] || 'General';
    const defaultProjNum = parts[2] || 'P1';

    projects.push({
      folderName,
      studentName: rawData.studentName || defaultStudent,
      subject: rawData.subject || defaultSubject,
      projectNumber: rawData.projectNumber || defaultProjNum,
      title: rawData.title || `${rawData.studentName || defaultStudent}'s Project`,
      url: `/Projects/${folderName}/index.html`
    });
  }

  // Fallback defaults if outside Vite glob
  if (projects.length === 0) {
    projects.push(
      {
        folderName: 'Hadicha_Chemistry_P1',
        studentName: 'Hadicha Ibragimova',
        subject: 'Chemistry',
        projectNumber: 'P1',
        title: 'Quantrix Chemistry',
        url: '/Projects/Hadicha_Chemistry_P1/index.html'
      },
      {
        folderName: 'Student2_Physics_P2',
        studentName: 'Alex Chen',
        subject: 'Physics',
        projectNumber: 'P2',
        title: 'Kinematics & Pendulum Lab',
        url: '/Projects/Student2_Physics_P2/index.html'
      },
      {
        folderName: 'Malika_Biology_P1',
        studentName: 'Malika Karimova',
        subject: 'Biology',
        projectNumber: 'P1',
        title: 'Cellular Microscopy Lab',
        url: '/Projects/Malika_Biology_P1/index.html'
      }
    );
  }

  return projects;
}

const allProjects = loadProjects();
const projectsGrid = document.getElementById('projects-grid');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');

function render(filterText = '') {
  const query = filterText.toLowerCase().trim();
  const list = query
    ? allProjects.filter(p => p.studentName.toLowerCase().includes(query) || p.title.toLowerCase().includes(query) || p.folderName.toLowerCase().includes(query))
    : allProjects;

  if (list.length === 0) {
    projectsGrid.innerHTML = `
      <div class="empty-state">
        <p>No students found matching "${filterText}".</p>
      </div>
    `;
    return;
  }

  projectsGrid.innerHTML = list.map(p => `
    <a href="${p.url}" class="student-card" id="card-${p.folderName}">
      <div class="preview-container">
        <div class="preview-bar" aria-hidden="true">
          <span class="mock-dot"></span>
          <span class="mock-dot"></span>
          <span class="mock-dot"></span>
        </div>
        <div class="preview-viewport">
          <iframe 
            src="${p.url}" 
            class="preview-iframe" 
            tabindex="-1" 
            aria-hidden="true" 
            loading="lazy"
            title="Preview of ${p.studentName}'s project">
          </iframe>
        </div>
        <div class="preview-overlay">
          <span class="open-tag">
            <span>Open Project</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </span>
        </div>
      </div>

      <div class="card-content">
        <div class="student-meta">
          <h2 class="student-name">${p.studentName}</h2>
          <span class="project-subtitle">${p.title} &bull; ${p.subject} ${p.projectNumber}</span>
        </div>
        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </a>
  `).join('');
}

// Search interaction
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    render(e.target.value);
  });
}

// Theme handling
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('student_dashboard_theme', t);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
}

render();
