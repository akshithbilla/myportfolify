import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'https://lake.onrender.com', // Make sure this is your actual backend port
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
