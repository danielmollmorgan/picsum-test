import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  // If you want to keep running your existing tests in Node.js, uncomment the next line.
  // 'vite.config.ts',
  {
    extends: 'vite.config.ts',
    test: {
      include: [
        '**/*.unit.{test,spec}.ts',
      ],
      name: 'unit',
      environment: 'node',
    },
  },
  {
    extends: 'vite.config.ts',
    test: {
      include: [
        '**/*.browser.{test,spec}.tsx',
      ],
      environment: 'jsdom',
      name: 'browser',
      browser: {
        enabled: true,
        provider: 'playwright',
        instances: [
          { browser: 'chromium' },
        ],
      },
    },
  },
])
