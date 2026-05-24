import dotenv from 'dotenv';
import path from 'path';
import { validateEnv } from './validation';

/**
 * WHY CENTRALISED ENV LOADING:
 * - dotenv.config() is called exactly once, here.
 * - No other file touches process.env directly.
 * - Consumers import `config` and get a fully-typed object.
 * - Validation runs at import time — tests fail immediately with a
 *   clear message if the .env.qa file is misconfigured.
 */
// `override: true` ensures .env.qa values always win over OS-level
// environment variables. On Windows, USERNAME is a reserved system variable
// that would otherwise shadow the value set in .env.qa.
dotenv.config({ path: path.resolve(process.cwd(), '.env.qa'), override: true });

// Fail fast — throws before any test runs if vars are missing
validateEnv();

/**
 * Typed, centralised configuration object.
 * Import this instead of reading process.env anywhere else.
 */
export const config = {
  baseUrl:    process.env.BASE_URL     as string,
  username:   process.env.USERNAME     as string,
  password:   process.env.PASSWORD     as string,
  // Convert the string "false"/"true" to a proper boolean
  headless:   process.env.HEADLESS?.toLowerCase() === 'true',
  // API base URL — ApiClient prepends this to every endpoint path.
  // Stored without a trailing slash; endpoints must start with '/'.
  apiBaseUrl: process.env.API_BASE_URL as string,
} as const;

export type Config = typeof config;
