import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ command }) => {
  // Determine correct base path:
  // In build mode: default to './' (relative) so all JS/CSS assets load cleanly on GitHub Pages subpaths (/content-studio/) and custom domains alike.
  // In dev mode: use '/' for Vite development server middleware.
  let base = command === 'build' ? './' : '/';
  if (process.env.BASE_PATH && process.env.BASE_PATH !== '/') {
    base = process.env.BASE_PATH;
    if (!base.endsWith('/')) base += '/';
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
