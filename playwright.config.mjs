import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.mjs',
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
  },
  webServer: {
    command: 'node scripts/serve.mjs --port 4173',
    url: 'http://127.0.0.1:4173/examples/basic.html',
    reuseExistingServer: true,
  },
});
