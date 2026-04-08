/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'SunbirdVideoPlayerWC',
      fileName: (format) => `sunbird-video-player-wc.${format}.js`
    },
    rollupOptions: {
      // Lit and video.js might be bundled, but generally externalize peer deps if needed
      // Here we bundle them to have a standalone web component
      external: [],
    }
  },
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
    },
    globals: true,
  }
});
