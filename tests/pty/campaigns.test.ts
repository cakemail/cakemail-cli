import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Server } from 'http';
import { startMockServer, stopMockServer } from '../helpers/mock-server';
import { runPTYSuccess, runPTYFailure } from '../helpers/pty-runner';

/**
 * PTY Tests for Campaigns Command
 *
 * These tests simulate a REAL user in a terminal:
 * - Real terminal (PTY)
 * - Real HTTP requests to mock server
 * - Can see colors, spinners, interactive prompts
 *
 * Run with: npm install node-pty @types/node-pty
 */
describe('campaigns commands (PTY)', () => {
  let mockServer: Server;
  let mockPort: number;

  beforeAll(async () => {
    const server = await startMockServer();
    mockServer = server.server;
    mockPort = server.port;
    console.log(`Mock server started on port ${mockPort}`);
  });

  afterAll(async () => {
    await stopMockServer(mockServer);
  });

  describe('campaigns list', () => {
    it('should list campaigns like a real user', async () => {
      const result = await runPTYSuccess(
        ['campaigns', 'list'],
        { mockServerPort: mockPort }
      );

      // Check output (can see spinners, colors, etc!)
      expect(result.exitCode).toBe(0);
      expect(result.cleanOutput).toContain('Test Campaign 1');
      expect(result.cleanOutput).toContain('Test Campaign 2');

      // Output should have shown spinner
      expect(result.output).toMatch(/Fetching campaigns/);
    });

    it('should list campaigns in JSON format', async () => {
      const result = await runPTYSuccess(
        ['-f', 'json', 'campaigns', 'list'],
        { mockServerPort: mockPort }
      );

      expect(result.exitCode).toBe(0);

      // Parse JSON output
      const json = JSON.parse(result.cleanOutput);
      expect(json.data).toHaveLength(2);
      expect(json.data[0].name).toBe('Test Campaign 1');
    });

    it('should list campaigns in table format', async () => {
      const result = await runPTYSuccess(
        ['-f', 'table', 'campaigns', 'list'],
        { mockServerPort: mockPort }
      );

      expect(result.exitCode).toBe(0);
      expect(result.cleanOutput).toContain('│'); // Table borders
      expect(result.cleanOutput).toContain('Test Campaign 1');
    });

    it('should support pagination', async () => {
      const result = await runPTYSuccess(
        ['campaigns', 'list', '--page', '1', '--limit', '10'],
        { mockServerPort: mockPort }
      );

      expect(result.exitCode).toBe(0);
    });
  });

  describe('campaigns get', () => {
    it('should get campaign by ID', async () => {
      const result = await runPTYSuccess(
        ['-f', 'json', 'campaigns', 'get', '123'],
        { mockServerPort: mockPort }
      );

      expect(result.exitCode).toBe(0);

      const json = JSON.parse(result.cleanOutput);
      expect(json.id).toBe(123);
      expect(json.name).toBe('Campaign 123');
    });

    it('should handle campaign not found', async () => {
      const result = await runPTYFailure(
        ['campaigns', 'get', '999'],
        { mockServerPort: mockPort }
      );

      expect(result.exitCode).toBe(1);
      expect(result.cleanOutput.toLowerCase()).toMatch(/not found|404|error/);
    });
  });

  describe('campaigns create', () => {
    it('should create campaign', async () => {
      const result = await runPTYSuccess(
        [
          '-f', 'json',
          'campaigns', 'create',
          '--name', 'New Campaign',
          '--list-id', '1',
          '--sender-id', '1',
          '--batch'
        ],
        { mockServerPort: mockPort }
      );

      expect(result.exitCode).toBe(0);
      expect(result.cleanOutput.toLowerCase()).toContain('created');

      // Parse the created campaign
      const lines = result.cleanOutput.split('\n');
      const jsonLine = lines.find(line => line.trim().startsWith('{'));
      expect(jsonLine).toBeDefined();

      const created = JSON.parse(jsonLine!);
      expect(created.id).toBe(123);
      expect(created.name).toBe('New Campaign');
    });

    it('should fail without required fields', async () => {
      const result = await runPTYFailure(
        ['campaigns', 'create', '--batch'],
        { mockServerPort: mockPort }
      );

      expect(result.exitCode).toBe(1);
      expect(result.cleanOutput.toLowerCase()).toMatch(/required|missing/);
    });
  });

  describe('campaigns update', () => {
    it('should update campaign name', async () => {
      const result = await runPTYSuccess(
        [
          '-f', 'json',
          'campaigns', 'update', '123',
          '--name', 'Updated Campaign'
        ],
        { mockServerPort: mockPort }
      );

      expect(result.exitCode).toBe(0);
      expect(result.cleanOutput.toLowerCase()).toContain('updated');
    });
  });

  describe('campaigns delete', () => {
    it('should delete campaign with force flag', async () => {
      const result = await runPTYSuccess(
        ['campaigns', 'delete', '123', '--force'],
        { mockServerPort: mockPort }
      );

      expect(result.exitCode).toBe(0);
      expect(result.cleanOutput.toLowerCase()).toContain('deleted');
    });
  });

  describe('output profiles', () => {
    it('should work with developer profile', async () => {
      const result = await runPTYSuccess(
        ['--profile', 'developer', 'campaigns', 'list'],
        { mockServerPort: mockPort }
      );

      expect(result.exitCode).toBe(0);
      // Developer profile defaults to JSON
      expect(() => JSON.parse(result.cleanOutput)).not.toThrow();
    });

    it('should work with marketer profile', async () => {
      const result = await runPTYSuccess(
        ['--profile', 'marketer', 'campaigns', 'list'],
        { mockServerPort: mockPort }
      );

      expect(result.exitCode).toBe(0);
    });

    it('should work with balanced profile', async () => {
      const result = await runPTYSuccess(
        ['--profile', 'balanced', 'campaigns', 'list'],
        { mockServerPort: mockPort }
      );

      expect(result.exitCode).toBe(0);
    });
  });

  describe('terminal features', () => {
    it('should show colors when enabled', async () => {
      const result = await runPTYSuccess(
        ['campaigns', 'list'],
        {
          mockServerPort: mockPort,
          enableColors: true
        }
      );

      // Should contain ANSI escape codes
      expect(result.output).toMatch(/\u001b\[\d+m/);
    });

    it('should show spinners during loading', async () => {
      const result = await runPTYSuccess(
        ['campaigns', 'list'],
        { mockServerPort: mockPort }
      );

      // Should show "Fetching campaigns..." message
      expect(result.output).toMatch(/Fetching campaigns/);
    });

    it('should handle batch mode (no colors/spinners)', async () => {
      const result = await runPTYSuccess(
        ['campaigns', 'list'],
        {
          mockServerPort: mockPort,
          enableColors: false
        }
      );

      expect(result.exitCode).toBe(0);
    });
  });
});
