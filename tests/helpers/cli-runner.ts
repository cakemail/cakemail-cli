import { execa, type ExecaReturnValue } from 'execa';
import stripAnsi from 'strip-ansi';
import { join } from 'path';

export interface CLIResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  rawStdout: string;
  rawStderr: string;
}

export interface CLIOptions {
  stdin?: string;
  env?: Record<string, string>;
  cwd?: string;
  timeout?: number;
}

/**
 * Execute the CLI with given arguments
 */
export async function runCLI(
  args: string[],
  options: CLIOptions = {}
): Promise<CLIResult> {
  const cliPath = join(process.cwd(), 'dist', 'cli.js');

  const env = {
    // Inherit process environment (for credentials)
    ...process.env,
    // Default test environment
    CAKEMAIL_BATCH_MODE: 'true',
    FORCE_COLOR: '0', // Disable colors for easier testing
    // Override with custom env
    ...options.env
  };

  try {
    const result: ExecaReturnValue = await execa('node', [cliPath, ...args], {
      env,
      input: options.stdin,
      cwd: options.cwd || process.cwd(),
      timeout: options.timeout || 30000,
      reject: false, // Don't throw on non-zero exit
      all: true
    });

    return {
      exitCode: result.exitCode,
      stdout: stripAnsi(result.stdout),
      stderr: stripAnsi(result.stderr),
      rawStdout: result.stdout,
      rawStderr: result.stderr
    };
  } catch (error: any) {
    // Handle execution errors (timeout, etc.)
    return {
      exitCode: error.exitCode || 1,
      stdout: error.stdout ? stripAnsi(error.stdout) : '',
      stderr: error.stderr ? stripAnsi(error.stderr) : error.message,
      rawStdout: error.stdout || '',
      rawStderr: error.stderr || error.message
    };
  }
}

/**
 * Run CLI and expect success
 */
export async function runCLISuccess(
  args: string[],
  options: CLIOptions = {}
): Promise<CLIResult> {
  const result = await runCLI(args, options);
  if (result.exitCode !== 0) {
    throw new Error(
      `CLI command failed with exit code ${result.exitCode}\n` +
      `Command: cakemail ${args.join(' ')}\n` +
      `Stderr: ${result.stderr}`
    );
  }
  return result;
}

/**
 * Run CLI and expect failure
 */
export async function runCLIFailure(
  args: string[],
  options: CLIOptions = {}
): Promise<CLIResult> {
  const result = await runCLI(args, options);
  if (result.exitCode === 0) {
    throw new Error(
      `CLI command succeeded when failure was expected\n` +
      `Command: cakemail ${args.join(' ')}\n` +
      `Stdout: ${result.stdout}`
    );
  }
  return result;
}

/**
 * Parse JSON output from CLI
 */
export function parseJSONOutput(stdout: string): any {
  try {
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`Failed to parse CLI output as JSON:\n${stdout}`);
  }
}

/**
 * Setup test environment
 */
export function setupTestEnv(): void {
  // Build the CLI before running tests
  // This should be done once before all tests
}

/**
 * Cleanup test environment
 */
export function cleanupTestEnv(): void {
  // Clean up any test artifacts
}
