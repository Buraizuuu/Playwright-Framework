import './env'; // Ensures dotenv is loaded before any module reads process.env
import { logger } from '../utils/logger';

/**
 * Runs once before the entire test suite.
 * Logs the suite start boundary so execution.log shows a clear open/close.
 */
async function globalSetup(): Promise<void> {
  logger.info('════════════════════════════════════════════════');
  logger.info('SUITE START');
  logger.info(`Timestamp : ${new Date().toISOString()}`);
  logger.info('════════════════════════════════════════════════');
}

export default globalSetup;
