import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/sunbird-video-player.ts',
      formats: ['es'],
      fileName: 'sunbird-video-player-wc-lit'
    }
  }
});
