import { defineConfig } from 'vite';

export default defineConfig({
  base: '/SCUOLAGUIDACRI/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
});