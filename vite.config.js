import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Automatically discover all HTML entry points in Projects/*/index.html
function getProjectEntries() {
  const entries = {
    main: resolve(__dirname, 'index.html')
  };

  const projectsDir = resolve(__dirname, 'Projects');
  if (fs.existsSync(projectsDir)) {
    const folders = fs.readdirSync(projectsDir, { withFileTypes: true });
    for (const folder of folders) {
      if (folder.isDirectory()) {
        const indexPath = resolve(projectsDir, folder.name, 'index.html');
        if (fs.existsSync(indexPath)) {
          // Normalize key name for Rollup
          const entryKey = `projects/${folder.name.toLowerCase()}`;
          entries[entryKey] = indexPath;
        }
      }
    }
  }

  return entries;
}

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: getProjectEntries()
    }
  }
});
