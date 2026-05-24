import { expect, Page } from '@playwright/test';
import { config } from '../configs/env';
import { BasePage } from './BasePage';

/**
 * Page Object for the OrangeHRM Login page.
 *
 * WHY PRIVATE LOCATORS AS PROPERTIES:
 * - Defined once; reused by multiple methods.
 * - If a selector changes, it changes in exactly one place.
 * - Tests never touch raw selectors — only call named methods.
 */
export class LoginPage extends BasePage {
  // ─── Locators ───────────────────────────────────────────────────────────────
  private readonly usernameInput = this.page.locator('input[name="username"]');
  private readonly passwordInput = this.page.locator('input[name="password"]');
  private readonly loginButton = this.page.locator('button[type="submit"]');
  private readonly alertMessage = this.page.locator('.oxd-alert-content-text');

  constructor(page: Page) {
    super(page);
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  /** Navigates to the login URL defined in .env.qa */
  async navigate(): Promise<void> {
    await this.page.goto(config.baseUrl);
    await this.waitForPageLoad();
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Composite method: fills both credentials and clicks submit.
   * Tests that only need a fast path call this instead of the three
   * individual methods.
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  // ─── Assertions ─────────────────────────────────────────────────────────────

  /** Asserts the browser is still on the login page (failed login check). */
  async verifyLoginPageDisplayed(): Promise<void> {
    await expect(this.page).toHaveURL(/auth\/login/);
  }

  /** Asserts the alert banner contains the expected error text. */
  async verifyErrorMessage(expectedText: string): Promise<void> {
    await expect(this.alertMessage).toContainText(expectedText);
  }
}
