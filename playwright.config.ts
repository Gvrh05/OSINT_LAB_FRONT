import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:43121',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'pnpm --dir ../OSINT_LAB_BACK start:prod',
      url: 'http://127.0.0.1:43120/api/health',
      env: { PORT: '43120', FRONTEND_URL: 'http://127.0.0.1:43121', TSE_AUTOLOAD: 'false' },
      reuseExistingServer: true,
      timeout: 45_000,
    },
    {
      command: 'pnpm dev --host 127.0.0.1 --port 43121 --strictPort',
      url: 'http://127.0.0.1:43121',
      env: { VITE_API_URL: 'http://127.0.0.1:43120/api' },
      reuseExistingServer: true,
      timeout: 45_000,
    },
  ],
});
