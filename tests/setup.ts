import { beforeAll, afterAll } from 'vitest';
import { mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Global test setup
 *
 * This runs for all test types:
 * - PTY tests (use mock HTTP server)
 * - Integration tests (use real API, override these settings)
 */
beforeAll(() => {
  // Create temporary test config directory
  const testConfigDir = join(process.cwd(), '.test-config');
  if (!existsSync(testConfigDir)) {
    mkdirSync(testConfigDir, { recursive: true });
  }

  // Set default test environment variables
  // Note: Integration tests will override these with real credentials
  process.env.CAKEMAIL_EMAIL = 'test@example.com';
  process.env.CAKEMAIL_PASSWORD = 'test-password';
  process.env.CAKEMAIL_BATCH_MODE = 'true'; // Disable interactive prompts
  process.env.NODE_ENV = 'test';
});

// Clean up after all tests
afterAll(() => {
  // Remove test config directory
  const testConfigDir = join(process.cwd(), '.test-config');
  if (existsSync(testConfigDir)) {
    rmSync(testConfigDir, { recursive: true, force: true });
  }
});
