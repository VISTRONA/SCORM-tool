import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      // Repo-level shared contracts (course schema, sample course).
      '@shared': path.resolve(import.meta.dirname, '../shared'),
    },
  },
  server: {
    // Allow importing from ../shared, which sits outside the Vite root.
    fs: { allow: ['..'] },
  },
})
