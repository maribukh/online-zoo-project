import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/online-zoo-project/' : '/',
  build: {
    outDir: 'dist',

    rollupOptions: {
      input: {
        main: 'index.html',
        landing: 'pages/landing/index.html',
        map: 'pages/map/index.html',
        panda: 'pages/zoos/panda.html',
        gorilla: 'pages/zoos/gorilla.html',
        eagle: 'pages/zoos/eagle.html',
        lemur: 'pages/zoos/lemur.html',
        contact: 'pages/contact/index.html',
        login: 'pages/auth/login.html',
        register: 'pages/auth/register.html',
      },
    },
  },
}));
