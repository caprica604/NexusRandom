import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Env variables are no longer manually exposed via define.
  // The VITE_ prefix variables are handled automatically by Vite if needed,
  // but for security, we are now using a backend route for the API key.
})