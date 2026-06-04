import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-client-package',
      closeBundle() {
        const src = 'client-package.json';
        const dest = '.catalyst-dist/client-package.json';
        if (existsSync(src)) {
          copyFileSync(src, dest);
        }
      },
    },
  ],
  base: '/app/',
  build: {
    outDir: '.catalyst-dist',
  },
})
