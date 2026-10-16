import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Forward /api to the Express server so the browser sees a single origin in dev (no CORS).
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
