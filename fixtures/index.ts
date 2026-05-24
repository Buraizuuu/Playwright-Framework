import { test as base, type TestInfo } from '@playwright/test';
import { logger } from '../utils/logger';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { ApiClient } from '../api/clients/ApiClient';

/**
 * WHY FIXTURES:
 * - Page objects are created once per test and injected via Playwright's
 *   dependency-injection system — no manual `new` calls in test files.
 * - The `testLogger` auto-fixture wraps EVERY test automatically.
 *   It logs start/end, pass/fail, and duration without any test-file boilerplate.
 * - `auto: true` means it runs even if the test doesn't list it — zero
 *   maintenance as the test suite grows.
 */

type TestFixtures = {
  loginPage:     LoginPage;
  dashboardPage: DashboardPage;
  apiClient:     ApiClient;
  /** Auto-applied lifecycle logger — do not list in tests explicitly. */
  testLogger: void;
};

export const test = base.extend<TestFixtures>({
  // ─── Auto logger fixture ───────────────────────────────────────────────────
  // Wraps every test: logs TEST START before, then TEST PASS/FAIL + duration after.
  // testInfo.status is set by Playwright once the test body finishes,
  // so it is reliably available in the teardown block below.
  testLogger: [
    async ({}, use, testInfo) => {
      const startTime = Date.now();
      logger.info(`TEST START : ${testInfo.title}`);

      await use();

      const duration = Date.now() - startTime;
      const passed = testInfo.status === testInfo.expectedStatus;

      if (passed) {
        logger.info(`TEST PASS  : ${testInfo.title} | ${duration}ms`);
      } else {
        const message = testInfo.error?.message ?? 'Unknown error';
        logger.error(`TEST FAIL  : ${testInfo.title} | ${duration}ms | ${message}`);
        if (testInfo.error?.stack) {
          logger.error(`STACK TRACE:\n${testInfo.error.stack}`);
        }
      }
    },
    { auto: true }, // Applied to every test in the suite automatically
  ],

  // ─── Page object fixtures ──────────────────────────────────────────────────
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  // ─── API client fixture ────────────────────────────────────────────────────
  // Wraps Playwright's built-in `request` fixture with our ApiClient.
  // Attaches the last request context to testInfo so it appears in the HTML report.
  apiClient: async ({ request }, use, testInfo: TestInfo) => {
    const client = new ApiClient(request, logger);

    await use(client);

    const ctx = client.lastContext;

    if (ctx) {
      await testInfo.attach('api-request-context', {
        body:        JSON.stringify(ctx),
        contentType: 'application/json',
      });
    }
  },
});

// Re-export expect so test files only need one import
export { expect } from '@playwright/test';
