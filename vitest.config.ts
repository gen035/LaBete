import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': '/Users/gen035/src/LaBete',
      '@': '/Users/gen035/src/LaBete',
      assets: '/Users/gen035/src/LaBete/assets',
    },
  },
  test: {
    environment: 'happy-dom',
  },
})
