import inquirer from 'inquirer';
import chalk from 'chalk';
import { ProfileConfig } from '../types/profile.js';
import { shouldPrompt, isScriptingMode } from './interactive.js';

/**
 * Interactive confirmation utilities for destructive operations
 * Profile-aware: adapts behavior based on user profile settings
 */

export interface ConfirmOptions {
  message?: string;
  resourceType?: string;
  resourceId?: string | number;
  details?: string[];
  dangerLevel?: 'low' | 'medium' | 'high';
  profileConfig?: ProfileConfig;
}

/**
 * Determine if confirmation should be shown based on profile
 */
function shouldConfirm(profileConfig?: ProfileConfig): boolean {
  // Always skip in scripting mode
  if (isScriptingMode()) {
    return false;
  }

  // No profile config - default to confirming
  if (!profileConfig) {
    return true;
  }

  // Check profile setting for destructive operations
  return profileConfig.behavior.confirm_destructive;
}

/**
 * Display confirmation prompt for destructive operations
 * Returns true if user confirms, false if they cancel
 * Profile-aware: skips confirmation for developer profile
 */
export async function confirm(options: ConfirmOptions = {}): Promise<boolean> {
  const {
    message,
    resourceType,
    resourceId,
    details = [],
    dangerLevel = 'medium',
    profileConfig
  } = options;

  // Check if confirmation is needed based on profile
  if (!shouldConfirm(profileConfig)) {
    return true; // Auto-confirm for developer profile or scripting mode
  }

  // Build the confirmation message
  let confirmMessage = message;

  if (!confirmMessage && resourceType) {
    if (resourceId) {
      confirmMessage = `Delete ${resourceType} ${chalk.bold(resourceId)}?`;
    } else {
      confirmMessage = `Delete this ${resourceType}?`;
    }
  }

  if (!confirmMessage) {
    confirmMessage = 'Are you sure?';
  }

  // Show danger level indicator
  const dangerIndicators = {
    low: chalk.yellow('⚠'),
    medium: chalk.red('⚠'),
    high: chalk.red.bold('⚠⚠⚠')
  };

  console.log('');
  console.log(dangerIndicators[dangerLevel], chalk.bold('Confirmation Required'));
  console.log('');

  // Show details if provided
  if (details.length > 0) {
    console.log(chalk.gray('This will:'));
    details.forEach(detail => {
      console.log(chalk.gray(`  • ${detail}`));
    });
    console.log('');
  }

  // Show warning for high danger operations
  if (dangerLevel === 'high') {
    console.log(chalk.red.bold('⚠ WARNING: This action cannot be undone!'));
    console.log('');
  }

  // Prompt for confirmation
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: confirmMessage,
      default: false
    }
  ]);

  return answer.confirmed;
}

/**
 * Confirm deletion of a resource
 */
export async function confirmDelete(
  resourceType: string,
  resourceId: string | number,
  details?: string[],
  profileConfig?: ProfileConfig
): Promise<boolean> {
  return confirm({
    resourceType,
    resourceId,
    details,
    dangerLevel: 'medium',
    profileConfig
  });
}

/**
 * Confirm deletion with high danger level (permanent, no recovery)
 */
export async function confirmDangerousDelete(
  resourceType: string,
  resourceId: string | number,
  details?: string[],
  profileConfig?: ProfileConfig
): Promise<boolean> {
  return confirm({
    resourceType,
    resourceId,
    details,
    dangerLevel: 'high',
    profileConfig
  });
}

/**
 * Confirm a custom action
 */
export async function confirmAction(
  message: string,
  details?: string[],
  dangerLevel: 'low' | 'medium' | 'high' = 'medium',
  profileConfig?: ProfileConfig
): Promise<boolean> {
  return confirm({
    message,
    details,
    dangerLevel,
    profileConfig
  });
}

/**
 * Check if force flag is present (for backwards compatibility)
 * If force flag is present, skip confirmation
 * If not present, show interactive confirmation
 */
export async function shouldProceed(
  forceFlag: boolean,
  confirmOptions: ConfirmOptions
): Promise<boolean> {
  // If force flag is present, skip confirmation
  if (forceFlag) {
    return true;
  }

  // Otherwise show interactive confirmation
  return confirm(confirmOptions);
}
