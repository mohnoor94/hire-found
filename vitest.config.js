import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['admin/__tests__/**/*.test.js'],
  },
  resolve: {
    alias: {
      'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js': path.resolve(__dirname, 'admin/__tests__/__mocks__/firebase-firestore.js'),
      '../../js/firebase-config.js': path.resolve(__dirname, 'admin/__tests__/__mocks__/firebase-config.js'),
    },
  },
});
