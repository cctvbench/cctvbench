import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    // Repo tooling outside src (git hooks) is tested too
    include: ['src/**/*.test.ts', '.githooks/**/*.test.ts'],
    passWithNoTests: true,
  },
});
