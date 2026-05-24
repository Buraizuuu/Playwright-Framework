import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the OrangeHRM Dashboard page.
 * Extends BasePage — inherits `page`, `waitForPageLoad()`, `getCurrentUrl()`.
 */
export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Verifies the user has landed on the dashboard after a successful login.
   * Uses a URL pattern match so the assertion survives minor URL changes
   * (e.g. query strings) while still failing if the user is not on the
   * dashboard at all.
   */
  async verifyDashboardLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard\/index/);
  }
}
