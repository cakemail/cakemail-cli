import { spawn, IPty } from 'node-pty';
import { join } from 'path';
import stripAnsi from 'strip-ansi';

export interface PTYOptions {
  mockServerPort: number;
  email?: string;
  password?: string;
  timeout?: number;
  enableColors?: boolean;
  onData?: (data: string) => void;
  interactive?: boolean;
}

export interface PTYResult {
  output: string;
  cleanOutput: string; // Output with ANSI codes stripped
  exitCode: number;
  pty: IPty;
}

/**
 * Run CLI command with PTY (real terminal simulation)
 *
 * This simulates a REAL user typing commands in a terminal.
 * Perfect for testing:
 * - Interactive prompts
 * - Colors and formatting
 * - Spinners and progress bars
 * - Terminal-specific behavior
 */
export async function runCLIWithPTY(
  args: string[],
  options: PTYOptions
): Promise<PTYResult> {
  const cliPath = join(process.cwd(), 'dist', 'cli.js');

  const env: Record<string, string> = {
    // Point to mock server
    CAKEMAIL_API_BASE: `http://localhost:${options.mockServerPort}`,

    // Credentials
    CAKEMAIL_EMAIL: options.email || 'test@example.com',
    CAKEMAIL_PASSWORD: options.password || 'test-password',

    // Batch mode unless interactive
    ...(options.interactive ? {} : { CAKEMAIL_BATCH_MODE: 'true' }),

    // Terminal settings
    TERM: options.enableColors ? 'xterm-256color' : 'dumb',
    FORCE_COLOR: options.enableColors ? '1' : '0',

    // Inherit other env vars
    ...process.env,
  };

  const pty = spawn('node', [cliPath, ...args], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.cwd(),
    env
  });

  let output = '';

  // Collect output
  pty.onData((data) => {
    output += data;
    options.onData?.(data);
  });

  // Wait for exit or timeout
  const exitCode = await new Promise<number>((resolve, reject) => {
    pty.onExit(({ exitCode }) => {
      resolve(exitCode);
    });

    // Timeout
    const timeout = options.timeout || 10000;
    setTimeout(() => {
      pty.kill();
      reject(new Error(`PTY timeout after ${timeout}ms`));
    }, timeout);
  });

  return {
    output,
    cleanOutput: stripAnsi(output),
    exitCode,
    pty
  };
}

/**
 * Run CLI and expect success (exit code 0)
 */
export async function runPTYSuccess(
  args: string[],
  options: PTYOptions
): Promise<PTYResult> {
  const result = await runCLIWithPTY(args, options);

  if (result.exitCode !== 0) {
    throw new Error(
      `CLI command failed with exit code ${result.exitCode}\n` +
      `Command: cakemail ${args.join(' ')}\n` +
      `Output:\n${result.cleanOutput}`
    );
  }

  return result;
}

/**
 * Run CLI and expect failure (exit code !== 0)
 */
export async function runPTYFailure(
  args: string[],
  options: PTYOptions
): Promise<PTYResult> {
  const result = await runCLIWithPTY(args, options);

  if (result.exitCode === 0) {
    throw new Error(
      `CLI command succeeded when failure was expected\n` +
      `Command: cakemail ${args.join(' ')}\n` +
      `Output:\n${result.cleanOutput}`
    );
  }

  return result;
}

/**
 * Simulate interactive user input
 *
 * @example
 * ```typescript
 * const interaction = createInteraction([
 *   { prompt: 'List name:', response: 'My List\r' },
 *   { prompt: 'Language:', response: 'en\r' },
 *   { prompt: 'Confirm?', response: 'y\r' }
 * ]);
 *
 * const result = await runCLIWithPTY(['lists', 'create'], {
 *   mockServerPort,
 *   interactive: true,
 *   onData: interaction.handler
 * });
 * ```
 */
export function createInteraction(steps: Array<{ prompt: string; response: string }>) {
  let currentStep = 0;
  let pty: IPty | null = null;

  return {
    handler: (data: string) => {
      if (currentStep >= steps.length) return;

      const step = steps[currentStep];
      if (data.includes(step.prompt)) {
        // Wait a bit to simulate real user thinking
        setTimeout(() => {
          pty?.write(step.response);
          currentStep++;
        }, 100);
      }
    },

    setPty: (p: IPty) => {
      pty = p;
    },

    isComplete: () => currentStep >= steps.length
  };
}
