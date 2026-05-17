import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '~': '/Users/gen035/src/LaBete',
      '@': '/Users/gen035/src/LaBete',
    },
  },
  test: {
    environment: 'happy-dom',
  },
})
