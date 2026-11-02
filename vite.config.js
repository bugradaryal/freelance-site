import { defineConfig } from 'vite'

// Özel alan adı (bugradaryal.xyz) kullanıldığı için base '/' olmalı.
// Eğer sadece kullanici.github.io/repo-adi üzerinden yayınlarsan base: '/repo-adi/' yap.
export default defineConfig({
  base: '/freelancer/',
  build: { outDir: 'dist/freelancer' },
  server: { open: true },
})