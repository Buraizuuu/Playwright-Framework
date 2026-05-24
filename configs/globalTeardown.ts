import { logger } from '../utils/logger';

/**
 * Runs once after the entire test suite finishes.
 * Logs the suite end boundary.
 */
async function globalTeardown(): Promise<void> {
  logger.info('════════════════════════════════════════════════');
  logger.info('SUITE END');
  logger.info(`Timestamp : ${new Date().toISOString()}`);
  logger.info('════════════════════════════════════════════════');
}

export default globalTeardown;
