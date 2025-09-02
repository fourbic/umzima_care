import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      // Prevent the fingerprint icon from being included in the build
      external: ['lucide-react/dist/esm/icons/fingerprint.js'],
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy all /openmrs requests to the gateway
      '/openmrs': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
});