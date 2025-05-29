import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/game1/', // 🔵 GitHub repo-н нэртэй тааруулах (эсвэл root path)
  build: {
    outDir: 'docs',      // 🔵 GitHub Pages-д зориулж `docs` фолдерт build хийнэ
    emptyOutDir: true,   // 🔵 Build хийх бүрт docs фолдерыг цэвэрлэнэ
    assetsDir: 'assets', // 🔵 Assets-ийг тусдаа хадгалах (default: 'assets')
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 🔵 '@/something' гэж бичиж болох alias
    }
  },
  publicDir: 'public', // 🔵 public хавтсанд байгаа бүх файл root-т хуулна (favicon, audio, images гэх мэт)
})