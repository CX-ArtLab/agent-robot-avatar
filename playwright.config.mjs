import { defineConfig, devices } from '@playwright/test';

// Each checkout needs its own server, or tests pass against another checkout's
// code. A busy port stops the run; set PORT to test next to another server.
const port = process.env.PORT || 4173;

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.mjs',
  reporter: 'line',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: `node scripts/serve.mjs --port ${port}`,
    url: `http://127.0.0.1:${port}/examples/basic.html`,
    reuseExistingServer: false,
  },
});
