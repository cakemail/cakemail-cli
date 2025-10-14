import { beforeAll } from 'vitest';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env file from project root IMMEDIATELY (before test file loads)
// This ensures credentials are available for it.skipIf() checks
config({ path: resolve(process.cwd(), '.env') });

// IMPORTANT: Capture real credentials early, before tests/setup.ts overwrites them
// Integration tests need REAL credentials, not the test defaults
const envCreds = {
  email: process.env.CAKEMAIL_EMAIL,
  password: process.env.CAKEMAIL_PASSWORD
};

/**
 * Setup for REAL API integration tests
 * These tests make actual HTTP calls to the Cakemail API
 */
beforeAll(() => {
  // Restore real credentials (tests/setup.ts sets fake defaults)
  if (envCreds.email && envCreds.password) {
    process.env.CAKEMAIL_EMAIL = envCreds.email;
    process.env.CAKEMAIL_PASSWORD = envCreds.password;
  }

  // Verify we have real test credentials
  const hasTestCreds = !!(process.env.CAKEMAIL_TEST_EMAIL && process.env.CAKEMAIL_TEST_PASSWORD);
  const hasRegularCreds = !!(process.env.CAKEMAIL_EMAIL && process.env.CAKEMAIL_PASSWORD);

  if (!hasTestCreds && !hasRegularCreds) {
    console.warn('⚠️  Integration tests require credentials:');
    console.warn('   CAKEMAIL_TEST_EMAIL + CAKEMAIL_TEST_PASSWORD');
    console.warn('   OR');
    console.warn('   CAKEMAIL_EMAIL + CAKEMAIL_PASSWORD');
    console.warn('   These tests will be skipped.');
  }

  // Use TEST credentials if available, otherwise use regular credentials
  if (process.env.CAKEMAIL_TEST_EMAIL && process.env.CAKEMAIL_TEST_PASSWORD) {
    process.env.CAKEMAIL_EMAIL = process.env.CAKEMAIL_TEST_EMAIL;
    process.env.CAKEMAIL_PASSWORD = process.env.CAKEMAIL_TEST_PASSWORD;
  }
  // If no TEST credentials, regular CAKEMAIL_EMAIL/PASSWORD will be used as-is

  // Ensure batch mode for non-interactive testing
  process.env.CAKEMAIL_BATCH_MODE = 'true';

  // Don't override NODE_ENV to 'test' - the SDK may need it for proper initialization
});
