/**
 * Interactive Prompt System
 *
 * Profile-aware prompts that adapt to user preferences:
 * - Developer profile: Skip prompts, require explicit arguments
 * - Marketer profile: Interactive prompts for missing arguments
 * - Balanced profile: Auto-detect TTY and prompt when interactive
 */

import inquirer from 'inquirer';
import { ProfileConfig } from '../types/profile.js';

/**
 * Check if we're in an interactive terminal
 */
export function isInteractive(): boolean {
  return process.stdin.isTTY === true && process.stdout.isTTY === true;
}

/**
 * Check if we're in scripting/batch mode
 * Indicators: CI environment, non-TTY, or explicit flags
 */
export function isScriptingMode(): boolean {
  // CI environment variables
  if (process.env.CI === 'true' || process.env.CONTINUOUS_INTEGRATION === 'true') {
    return true;
  }

  // Non-interactive terminal
  if (!isInteractive()) {
    return true;
  }

  // Explicit batch mode flag (can be set by commands)
  if (process.env.CAKEMAIL_BATCH_MODE === 'true') {
    return true;
  }

  return false;
}

/**
 * Determine if prompts should be shown based on profile and environment
 */
export function shouldPrompt(profileConfig?: ProfileConfig): boolean {
  // Always skip in scripting mode
  if (isScriptingMode()) {
    return false;
  }

  // No profile config - default to prompting in interactive mode
  if (!profileConfig) {
    return isInteractive();
  }

  const setting = profileConfig.behavior.interactive_prompts;

  // Explicit true/false from profile
  if (setting === true) return true;
  if (setting === false) return false;

  // 'auto' mode - prompt only if interactive
  return isInteractive();
}

/**
 * Prompt for a text input
 */
export async function promptText(
  message: string,
  options: {
    default?: string;
    required?: boolean;
    validate?: (input: string) => boolean | string;
    profileConfig?: ProfileConfig;
  } = {}
): Promise<string | undefined> {
  if (!shouldPrompt(options.profileConfig)) {
    return undefined;
  }

  const answer = await inquirer.prompt<{ value: string }>([
    {
      type: 'input',
      name: 'value',
      message,
      default: options.default,
      validate: (input: string) => {
        if (options.required && !input.trim()) {
          return 'This field is required';
        }
        if (options.validate) {
          return options.validate(input);
        }
        return true;
      }
    }
  ]);

  return answer.value;
}

/**
 * Prompt for a number input
 */
export async function promptNumber(
  message: string,
  options: {
    default?: number;
    required?: boolean;
    min?: number;
    max?: number;
    profileConfig?: ProfileConfig;
  } = {}
): Promise<number | undefined> {
  if (!shouldPrompt(options.profileConfig)) {
    return undefined;
  }

  const answer = await inquirer.prompt<{ value: number }>([
    {
      type: 'number',
      name: 'value',
      message,
      default: options.default,
      validate: (input: number) => {
        if (options.required && (input === undefined || input === null)) {
          return 'This field is required';
        }
        if (options.min !== undefined && input < options.min) {
          return `Value must be at least ${options.min}`;
        }
        if (options.max !== undefined && input > options.max) {
          return `Value must be at most ${options.max}`;
        }
        return true;
      }
    }
  ]);

  return answer.value;
}

/**
 * Prompt for a selection from a list
 */
export async function promptSelect<T = string>(
  message: string,
  choices: Array<{ name: string; value: T; description?: string }>,
  options: {
    default?: T;
    required?: boolean;
    profileConfig?: ProfileConfig;
  } = {}
): Promise<T | undefined> {
  if (!shouldPrompt(options.profileConfig)) {
    return undefined;
  }

  const answer = await inquirer.prompt<{ value: T }>([
    {
      type: 'list',
      name: 'value',
      message,
      choices: choices.map(choice => ({
        name: choice.description ? `${choice.name} - ${choice.description}` : choice.name,
        value: choice.value,
        short: choice.name
      })),
      default: options.default,
      pageSize: 10
    }
  ]);

  return answer.value;
}

/**
 * Prompt for multiple selections from a list
 */
export async function promptMultiSelect<T = string>(
  message: string,
  choices: Array<{ name: string; value: T; description?: string; checked?: boolean }>,
  options: {
    required?: boolean;
    profileConfig?: ProfileConfig;
  } = {}
): Promise<T[] | undefined> {
  if (!shouldPrompt(options.profileConfig)) {
    return undefined;
  }

  const answer = await inquirer.prompt<{ value: T[] }>([
    {
      type: 'checkbox',
      name: 'value',
      message,
      choices: choices.map(choice => ({
        name: choice.description ? `${choice.name} - ${choice.description}` : choice.name,
        value: choice.value,
        short: choice.name,
        checked: choice.checked ?? false
      })),
      validate: (input: T[]) => {
        if (options.required && input.length === 0) {
          return 'You must select at least one option';
        }
        return true;
      },
      pageSize: 10
    }
  ]);

  return answer.value;
}

/**
 * Prompt for yes/no confirmation
 */
export async function promptConfirm(
  message: string,
  options: {
    default?: boolean;
    profileConfig?: ProfileConfig;
  } = {}
): Promise<boolean> {
  if (!shouldPrompt(options.profileConfig)) {
    // In non-interactive mode, default to false for safety
    return options.default ?? false;
  }

  const answer = await inquirer.prompt<{ value: boolean }>([
    {
      type: 'confirm',
      name: 'value',
      message,
      default: options.default ?? false
    }
  ]);

  return answer.value;
}

/**
 * Prompt for password/secret input (hidden)
 */
export async function promptPassword(
  message: string,
  options: {
    required?: boolean;
    validate?: (input: string) => boolean | string;
    profileConfig?: ProfileConfig;
  } = {}
): Promise<string | undefined> {
  if (!shouldPrompt(options.profileConfig)) {
    return undefined;
  }

  const answer = await inquirer.prompt<{ value: string }>([
    {
      type: 'password',
      name: 'value',
      message,
      mask: '*',
      validate: (input: string) => {
        if (options.required && !input) {
          return 'This field is required';
        }
        if (options.validate) {
          return options.validate(input);
        }
        return true;
      }
    }
  ]);

  return answer.value;
}

/**
 * Show a loading spinner (profile-aware)
 */
export interface Spinner {
  start(text?: string): void;
  stop(text?: string): void;
  succeed(text?: string): void;
  fail(text?: string): void;
  text: string;
}

/**
 * Create a profile-aware spinner
 * Returns a real spinner for profiles with show_progress enabled,
 * otherwise returns a no-op spinner
 */
export function createSpinner(
  initialText: string,
  profileConfig?: ProfileConfig
): Spinner {
  const shouldShow = profileConfig?.behavior.show_progress ?? true;

  if (!shouldShow || !isInteractive()) {
    // No-op spinner for scripting mode or when progress is disabled
    return {
      start: () => {},
      stop: () => {},
      succeed: () => {},
      fail: () => {},
      text: initialText
    };
  }

  // Import ora dynamically to avoid loading it when not needed
  let ora: any;
  try {
    ora = require('ora');
  } catch {
    // ora not available, use no-op
    return {
      start: () => {},
      stop: () => {},
      succeed: () => {},
      fail: () => {},
      text: initialText
    };
  }

  const spinner = ora(initialText);
  return {
    start: (text?: string) => {
      if (text) spinner.text = text;
      spinner.start();
    },
    stop: (text?: string) => {
      if (text) spinner.text = text;
      spinner.stop();
    },
    succeed: (text?: string) => {
      if (text) spinner.text = text;
      spinner.succeed();
    },
    fail: (text?: string) => {
      if (text) spinner.text = text;
      spinner.fail();
    },
    get text() { return spinner.text; },
    set text(value: string) { spinner.text = value; }
  };
}
