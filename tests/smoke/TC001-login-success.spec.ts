import { config } from '../../configs/env';
import { test } from '../../fixtures';
import { logger } from '../../utils/logger';

test.describe('Authentication', () => {
  test('[Login] should allow user access with valid credentials', async ({ loginPage, dashboardPage }) => {
    await loginPage.navigate();
    await loginPage.login(config.username, config.password);
    await dashboardPage.verifyDashboardLoaded();

    logger.info(`Authenticated as "${config.username}"`);
  });
});
