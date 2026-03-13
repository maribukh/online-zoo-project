import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
 
export default defineConfig({
  root: './',
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        landing: resolve(__dirname, 'pages/landing/index.html'),
        map: resolve(__dirname, 'pages/map/index.html'),
        contact: resolve(__dirname, 'pages/contact/index.html'),
        login: resolve(__dirname, 'pages/auth/login.html'),
        register: resolve(__dirname, 'pages/auth/register.html'),
        pandaZoo: resolve(__dirname, 'pages/zoos/panda.html'),
      },
    },
  },
});
 