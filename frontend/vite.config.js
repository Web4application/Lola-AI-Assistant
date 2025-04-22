import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Allows you to use '@/components/YourComponent' style imports
    },
  },
  server: {
    port: 5173,
    open: true, // Auto-opens in browser
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
