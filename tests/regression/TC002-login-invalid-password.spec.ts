import { config } from '../../configs/env';
import { test } from '../../fixtures';
import { logger } from '../../utils/logger';

const INVALID_PASSWORD = 'InvalidPassword123';

test.describe('Authentication', () => {
  test('[Login] should display an error when credentials are invalid', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(config.username, INVALID_PASSWORD);

    await loginPage.verifyLoginPageDisplayed();
    await loginPage.verifyErrorMessage('Invalid credentials');

    logger.warn(`Authentication failed for "${config.username}" — invalid credentials`);
  });
});
