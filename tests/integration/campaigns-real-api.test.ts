import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { runCLI, runCLISuccess, parseJSONOutput } from '../helpers/cli-runner';
import './setup-integration';

/**
 * REAL API INTEGRATION TESTS
 *
 * These tests make actual HTTP requests to the Cakemail API.
 * They test the full end-to-end flow including:
 * - Authentication
 * - Real HTTP requests
 * - Actual data creation/modification
 * - Real API responses
 *
 * Requirements:
 * - CAKEMAIL_TEST_EMAIL environment variable
 * - CAKEMAIL_TEST_PASSWORD environment variable
 * - Valid Cakemail test account
 *
 * Note: These tests are slower than mocked tests but provide
 * real confidence that the CLI works with the actual API.
 */

const hasCredentials = () => {
  // Check for test credentials first, then fall back to regular credentials
  const hasTestCreds = !!(process.env.CAKEMAIL_TEST_EMAIL && process.env.CAKEMAIL_TEST_PASSWORD);
  const hasRegularCreds = !!(process.env.CAKEMAIL_EMAIL && process.env.CAKEMAIL_PASSWORD);
  return hasTestCreds || hasRegularCreds;
};

describe('campaigns (REAL API)', () => {
  let testCampaignId: number | null = null;
  let testListId: number | null = null;
  let testSenderId: number | null = null;

  beforeAll(async () => {
    if (!hasCredentials()) {
      console.warn('⚠️  Skipping integration tests - no credentials provided');
      return;
    }

    // Get or create a test list (force JSON output for parsing)
    const listsResult = await runCLI(['-f', 'json', 'lists', 'list', '--limit', '1']);
    if (listsResult.exitCode === 0) {
      const lists = parseJSONOutput(listsResult.stdout);
      if (lists.data && lists.data.length > 0) {
        testListId = lists.data[0].id;
      }
    }

    // Get or create a test sender (force JSON output for parsing)
    const sendersResult = await runCLI(['-f', 'json', 'senders', 'list', '--limit', '1']);
    if (sendersResult.exitCode === 0) {
      const senders = parseJSONOutput(sendersResult.stdout);
      if (senders.data && senders.data.length > 0) {
        testSenderId = senders.data[0].id;
      }
    }
  });

  afterAll(async () => {
    // Clean up: delete test campaign if it was created
    if (testCampaignId) {
      await runCLI(['campaigns', 'delete', testCampaignId.toString(), '--force']);
    }
  });

  it.skipIf(!hasCredentials())('should list campaigns from real API', async () => {
    const result = await runCLISuccess(['-f', 'json', 'campaigns', 'list', '--limit', '5']);

    expect(result.exitCode).toBe(0);
    const output = parseJSONOutput(result.stdout);
    expect(output).toHaveProperty('data');
    expect(Array.isArray(output.data)).toBe(true);
  });

  it.skipIf(!hasCredentials())('should list campaigns in table format', async () => {
    const result = await runCLISuccess(['-f', 'table', 'campaigns', 'list', '--limit', '5']);

    expect(result.exitCode).toBe(0);
    // Table output should contain borders
    expect(result.stdout).toContain('│');
  });

  it.skipIf(!hasCredentials())('should support pagination', async () => {
    const result = await runCLISuccess([
      '-f', 'json',
      'campaigns', 'list',
      '--page', '1',
      '--limit', '2'
    ]);

    expect(result.exitCode).toBe(0);
    const output = parseJSONOutput(result.stdout);
    expect(output.data.length).toBeLessThanOrEqual(2);
  });

  it.skipIf(!hasCredentials() || !testListId || !testSenderId)(
    'should create, update, and delete a campaign',
    async () => {
      const campaignName = `Test Campaign ${Date.now()}`;

      // 1. Create campaign
      const createResult = await runCLISuccess([
        '-f', 'json',
        'campaigns', 'create',
        '--name', campaignName,
        '--list-id', testListId!.toString(),
        '--sender-id', testSenderId!.toString(),
        '--batch'
      ]);

      expect(createResult.exitCode).toBe(0);
      expect(createResult.stdout.toLowerCase()).toContain('created');

      // Extract campaign ID from output
      const lines = createResult.stdout.split('\n');
      const jsonLine = lines.find(line => line.trim().startsWith('{'));
      expect(jsonLine).toBeDefined();

      const created = JSON.parse(jsonLine!);
      testCampaignId = created.id;
      expect(testCampaignId).toBeDefined();
      expect(created.name).toBe(campaignName);

      // 2. Get campaign details
      const getResult = await runCLISuccess(['-f', 'json', 'campaigns', 'get', testCampaignId!.toString()]);
      const fetched = parseJSONOutput(getResult.stdout);
      expect(fetched.id).toBe(testCampaignId);
      expect(fetched.name).toBe(campaignName);

      // 3. Update campaign
      const updatedName = `Updated Campaign ${Date.now()}`;
      const updateResult = await runCLISuccess([
        '-f', 'json',
        'campaigns', 'update', testCampaignId!.toString(),
        '--name', updatedName
      ]);

      expect(updateResult.exitCode).toBe(0);
      expect(updateResult.stdout.toLowerCase()).toContain('updated');

      // 4. Verify update
      const getUpdatedResult = await runCLISuccess(['-f', 'json', 'campaigns', 'get', testCampaignId!.toString()]);
      const updated = parseJSONOutput(getUpdatedResult.stdout);
      expect(updated.name).toBe(updatedName);

      // 5. Delete campaign
      const deleteResult = await runCLISuccess([
        '-f', 'json',
        'campaigns', 'delete', testCampaignId!.toString(),
        '--force'
      ]);

      expect(deleteResult.exitCode).toBe(0);
      expect(deleteResult.stdout.toLowerCase()).toContain('deleted');

      testCampaignId = null; // Mark as cleaned up
    },
    { timeout: 60000 } // 60 second timeout for full lifecycle
  );

  it.skipIf(!hasCredentials())('should handle non-existent campaign gracefully', async () => {
    const result = await runCLI(['campaigns', 'get', '99999999']);

    expect(result.exitCode).toBe(1);
    // The API returns a 400 error for non-existent campaigns
    expect(result.stderr.toLowerCase()).toMatch(/error|400/);
  });

  it.skipIf(!hasCredentials())('should work with different output profiles', async () => {
    // Test developer profile
    const devResult = await runCLISuccess([
      '--profile', 'developer',
      'campaigns', 'list',
      '--limit', '1'
    ]);
    expect(devResult.exitCode).toBe(0);

    // Test marketer profile
    const marketerResult = await runCLISuccess([
      '--profile', 'marketer',
      'campaigns', 'list',
      '--limit', '1'
    ]);
    expect(marketerResult.exitCode).toBe(0);

    // Test balanced profile
    const balancedResult = await runCLISuccess([
      '--profile', 'balanced',
      'campaigns', 'list',
      '--limit', '1'
    ]);
    expect(balancedResult.exitCode).toBe(0);
  });
});
