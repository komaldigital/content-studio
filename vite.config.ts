import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Determine correct base path: default to '/' for local dev and Cloud Run, or custom BASE_PATH for GitHub Pages
  let base = '/';
  if (process.env.BASE_PATH && process.env.BASE_PATH !== '/') {
    base = process.env.BASE_PATH;
    if (!base.endsWith('/')) base += '/';
    if (!base.startsWith('/') && !base.startsWith('.')) base = '/' + base;
  } else if (process.env.GITHUB_REPOSITORY && process.env.GITHUB_ACTIONS) {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    if (repo && repo.toLowerCase() === `${owner.toLowerCase()}.github.io`) {
      base = '/';
    } else if (repo) {
      base = `/${repo}/`;
    }
  }

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
