import { Page } from '@playwright/test';

/**
 * Abstract base that every page object extends.
 *
 * WHY AN ABSTRACT BASE:
 * - Single place to add cross-cutting page utilities (wait helpers, scroll, etc.)
 * - Enforces consistent constructor signature across all page objects
 * - Keeps the `page` instance protected so only page objects — not tests —
 *   can reach Playwright's raw API directly
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Waits for DOM content to be loaded — use before asserting on elements. */
  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Returns the current page URL. */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
