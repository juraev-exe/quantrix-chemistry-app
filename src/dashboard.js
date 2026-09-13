// ==========================================================================
// STUDENT PROJECTS SHOWCASE — MINIMALIST RUNTIME
// ==========================================================================

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

    projects.push({
      folderName,
      studentName: rawData.studentName || defaultStudent,
      url: `/Projects/${folderName}/index.html`
    });
  }

  // Fallback if no glob loaded
  if (projects.length === 0) {
    projects.push({
      folderName: 'Hadicha_Chemistry_P1',
      studentName: 'Hadicha Ibragimova',
      url: '/Projects/Hadicha_Chemistry_P1/index.html'
    });
  }

  return projects;
}

const allProjects = loadProjects();
const projectsGrid = document.getElementById('projects-grid');
const themeToggle = document.getElementById('theme-toggle');

function render() {
  if (!projectsGrid) return;

  projectsGrid.innerHTML = allProjects.map(p => `
    <a href="${p.url}" class="student-card" id="card-${p.folderName}">
      <div class="preview-wrap">
        <div class="preview-viewport">
          <iframe 
            src="${p.url}" 
            class="preview-iframe" 
            tabindex="-1" 
            aria-hidden="true" 
            loading="lazy"
            title="Preview of ${p.studentName}">
          </iframe>
        </div>
        <div class="preview-overlay">
          <span class="open-badge">
            <span>Open</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </span>
        </div>
      </div>

      <div class="card-bottom">
        <h2 class="student-name">${p.studentName}</h2>
        <svg class="card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </a>
  `).join('');
}

// Theme Handling
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
