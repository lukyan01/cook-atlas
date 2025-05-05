import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/insert': 'http://localhost:3000',
      '/delete': 'http://localhost:3000',
      '/update': 'http://localhost:3000',
    }
  }
})
