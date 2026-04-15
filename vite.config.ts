import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Use base path only for production (GitHub Pages). Dev serves from root.
  base: process.env.NODE_ENV === 'production' ? '/mcp-forge-lab/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
