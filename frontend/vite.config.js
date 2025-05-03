// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite';

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   build: {
//     outDir: 'dist',
//     assetsDir: 'assets',       // Compiled assets will go to /dist/assets
//     emptyOutDir: true,        // Clears dist folder on rebuild
//     rollupOptions: {
//       input: './index.html',  // Simplified entry point
//     },
//   },
//   base: '/',                 // Changed from './' to '/' for Vercel
//   publicDir: 'public',       // Serves static files from /public
//   assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg'], // Explicit asset types
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsDir: '', // Remove assets subdirectory
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash].[ext]'
      }
    }
  },
  base: '/',
  publicDir: 'public'
});