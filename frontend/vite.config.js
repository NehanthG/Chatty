import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import daisyui from 'daisyui'

export default defineConfig({
  plugins: [
    react(),
    daisyui
  ]
})
