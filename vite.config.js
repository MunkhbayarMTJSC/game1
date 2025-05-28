import { defineConfig } from 'vite'

export default defineConfig({
    build: {
    base: '/game1/',
    outDir: 'docs', // 🟡 build гаралтын фолдерыг docs болгов
  }
})