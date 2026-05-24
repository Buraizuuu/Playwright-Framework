/**
 * Defines and validates required environment variables.
 *
 * WHY A SEPARATE FILE: Keeps the list of required vars in one place.
 * If a new var is added to .env.qa it must be declared here — you
 * cannot accidentally use an undefined var elsewhere in the codebase.
 */

const REQUIRED_VARS = ['BASE_URL', 'USERNAME', 'PASSWORD', 'HEADLESS', 'API_BASE_URL'] as const;

export type RequiredVar = (typeof REQUIRED_VARS)[number];

/**
 * Throws immediately if any required environment variable is missing.
 * Called once at startup from configs/env.ts — fail fast before tests run.
 */
export function validateEnv(): void {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `[Config] Missing required environment variables: ${missing.join(', ')}\n` +
        `Ensure all variables are set in your .env.qa file.`,
    );
  }
}
