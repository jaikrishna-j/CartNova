import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // Make sure 'path' is imported!

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // This line defines the alias for Vite
    },
  },
})
