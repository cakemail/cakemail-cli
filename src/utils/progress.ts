import ora, { Ora } from 'ora';
import chalk from 'chalk';

/**
 * Progress indicator utilities for long-running operations
 */

export interface ProgressConfig {
  text: string;
  prefixText?: string;
}

export interface PollingConfig {
  checkInterval?: number; // milliseconds between checks
  maxAttempts?: number;   // max polling attempts before timeout
  onCheck?: (attempt: number) => void;
}

export interface BatchProgressConfig {
  total: number;
  current: number;
  operation: string;
}

/**
 * Simple spinner for basic operations (existing pattern)
 */
export function createSpinner(text: string): Ora {
  return ora(text).start();
}

/**
 * Progress indicator for async operations with polling
 * Use for exports, imports, and other async tasks
 */
export class PollingProgress {
  private spinner: Ora;
  private startTime: number;
  private attempts: number = 0;
  private config: Required<PollingConfig>;

  constructor(initialText: string, config: PollingConfig = {}) {
    this.config = {
      checkInterval: config.checkInterval || 2000,
      maxAttempts: config.maxAttempts || 30,
      onCheck: config.onCheck || (() => {}),
    };

    this.spinner = ora(initialText).start();
    this.startTime = Date.now();
  }

  /**
   * Update progress text during polling
   */
  update(text: string): void {
    this.attempts++;
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    this.spinner.text = `${text} ${chalk.gray(`(${elapsed}s, attempt ${this.attempts})`)}`;
    this.config.onCheck(this.attempts);
  }

  /**
   * Check if max attempts reached
   */
  isTimeout(): boolean {
    return this.attempts >= this.config.maxAttempts;
  }

  /**
   * Get check interval
   */
  getInterval(): number {
    return this.config.checkInterval;
  }

  /**
   * Mark as successful
   */
  succeed(text?: string): void {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    this.spinner.succeed(`${text || this.spinner.text} ${chalk.gray(`(${elapsed}s)`)}`);
  }

  /**
   * Mark as failed
   */
  fail(text?: string): void {
    this.spinner.fail(text || this.spinner.text);
  }

  /**
   * Stop without status
   */
  stop(): void {
    this.spinner.stop();
  }
}

/**
 * Progress indicator for batch operations
 * Use for bulk tagging, multiple deletes, etc.
 */
export class BatchProgress {
  private spinner: Ora;
  private total: number;
  private current: number = 0;
  private operation: string;
  private startTime: number;
  private failures: number = 0;

  constructor(config: BatchProgressConfig) {
    this.total = config.total;
    this.current = config.current || 0;
    this.operation = config.operation;
    this.startTime = Date.now();

    this.spinner = ora(this.formatText()).start();
  }

  private formatText(): string {
    const percentage = this.total > 0 ? Math.round((this.current / this.total) * 100) : 0;
    const bar = this.createProgressBar(percentage);
    return `${this.operation} ${bar} ${this.current}/${this.total} ${chalk.gray(`(${percentage}%)`)}`;
  }

  private createProgressBar(percentage: number): string {
    const width = 20;
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    return chalk.cyan('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
  }

  /**
   * Increment progress
   */
  increment(count: number = 1): void {
    this.current = Math.min(this.current + count, this.total);
    this.spinner.text = this.formatText();
  }

  /**
   * Record a failure
   */
  recordFailure(): void {
    this.failures++;
  }

  /**
   * Mark as complete
   */
  complete(successMessage?: string): void {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const message = successMessage || this.operation;

    if (this.failures > 0) {
      this.spinner.warn(
        `${message} completed with ${this.failures} error${this.failures > 1 ? 's' : ''} ` +
        chalk.gray(`(${elapsed}s)`)
      );
    } else {
      this.spinner.succeed(
        `${message} completed successfully ` +
        chalk.gray(`(${this.total} items, ${elapsed}s)`)
      );
    }
  }

  /**
   * Mark as failed
   */
  fail(errorMessage?: string): void {
    this.spinner.fail(errorMessage || `${this.operation} failed`);
  }

  /**
   * Stop without status
   */
  stop(): void {
    this.spinner.stop();
  }
}

/**
 * Multi-step progress indicator
 * Use for operations with distinct phases
 */
export class MultiStepProgress {
  private spinner: Ora;
  private steps: string[];
  private currentStep: number = 0;
  private startTime: number;

  constructor(steps: string[]) {
    this.steps = steps;
    this.startTime = Date.now();
    this.spinner = ora(this.formatText()).start();
  }

  private formatText(): string {
    const step = this.steps[this.currentStep];
    const progress = `${this.currentStep + 1}/${this.steps.length}`;
    return `${step} ${chalk.gray(`[${progress}]`)}`;
  }

  /**
   * Move to next step
   */
  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.spinner.text = this.formatText();
    }
  }

  /**
   * Update current step text
   */
  updateStepText(text: string): void {
    this.steps[this.currentStep] = text;
    this.spinner.text = this.formatText();
  }

  /**
   * Mark as complete
   */
  complete(finalMessage?: string): void {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    this.spinner.succeed(`${finalMessage || 'All steps completed'} ${chalk.gray(`(${elapsed}s)`)}`);
  }

  /**
   * Mark as failed
   */
  fail(errorMessage?: string): void {
    this.spinner.fail(errorMessage || `Failed at step ${this.currentStep + 1}`);
  }

  /**
   * Stop without status
   */
  stop(): void {
    this.spinner.stop();
  }
}

/**
 * Helper to wait with a delay (for polling)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Poll an async operation until complete
 * @param checkFn Function that returns status: { complete: boolean, status?: string, progress?: number }
 * @param config Polling configuration
 */
export async function pollUntilComplete<T>(
  checkFn: () => Promise<{ complete: boolean; status?: string; data?: T }>,
  initialText: string,
  config: PollingConfig = {}
): Promise<T> {
  const progress = new PollingProgress(initialText, config);

  while (true) {
    await sleep(progress.getInterval());

    try {
      const result = await checkFn();

      if (result.complete) {
        progress.succeed(result.status || 'Operation completed');
        return result.data as T;
      }

      if (progress.isTimeout()) {
        progress.fail('Operation timed out');
        throw new Error('Operation timed out');
      }

      progress.update(result.status || initialText);
    } catch (error: any) {
      progress.fail('Operation failed');
      throw error;
    }
  }
}
