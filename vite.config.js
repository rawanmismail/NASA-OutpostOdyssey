import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5173, strictPort: true },
  build: { rollupOptions: { output: { manualChunks(id) { if (id.includes('node_modules/three/')) return 'three'; if (/node_modules\/(react|react-dom|scheduler)\//.test(id.replaceAll('\\','/'))) return 'react'; } } } }
});
