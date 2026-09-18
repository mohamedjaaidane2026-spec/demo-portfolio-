import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    // The dev server sits behind a proxy whose hostname is assigned at runtime,
    // so the Host header can't be known ahead of time. Dev-only setting.
    allowedHosts: true,
  },
})
