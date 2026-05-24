import { defineConfig, devices } from '@playwright/test';
import { config } from './configs/env';

export default defineConfig({
  testDir: './tests',

  // All Playwright-managed artifacts (screenshots, traces, videos) land here.
  // This is Playwright's default, but being explicit removes any ambiguity.
  outputDir: 'test-results',

  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  forbidOnly: !!process.env.CI,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  globalSetup: './configs/globalSetup',
  globalTeardown: './configs/globalTeardown',

  use: {
    headless: config.headless,

    // On failure: capture screenshot, keep trace, keep video.
    // All three are embedded/linked automatically in the HTML report.
    screenshot: 'only-on-failure',
    trace:      'retain-on-failure',
    video:      'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
