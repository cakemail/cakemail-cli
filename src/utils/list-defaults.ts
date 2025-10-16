/**
 * Apply profile-based defaults for list commands
 *
 * For marketer profile (compact format):
 * - Default to 20 items per page
 * - Default to descending order by ID (newest first)
 */

import { ProfileConfig } from '../types/profile.js';

export interface ListOptions {
  limit?: string;
  page?: string;
  sort?: string;
  [key: string]: any;
}

export interface ListParams {
  per_page?: number;
  page?: number;
  sort?: string;
  [key: string]: any;
}

/**
 * Apply profile-based defaults to list parameters
 *
 * @param options - Command line options
 * @param profileConfig - Current profile configuration
 * @returns API parameters with defaults applied
 */
export function applyListDefaults(
  options: ListOptions,
  profileConfig?: ProfileConfig
): ListParams {
  const params: ListParams = {};

  // Apply limit with profile default
  if (options.limit) {
    params.per_page = parseInt(options.limit);
  } else if (profileConfig?.output.format === 'compact') {
    // Marketer profile default: 25 items (half of API default of 50)
    params.per_page = 25;
  }

  // Apply page if provided
  if (options.page) {
    params.page = parseInt(options.page);
  }

  // Apply sort with profile default
  if (options.sort) {
    params.sort = options.sort;
  } else if (profileConfig?.output.format === 'compact') {
    // Marketer profile default: descending by created_on (newest first)
    // Note: -id doesn't work, but -created_on does
    params.sort = '-created_on';
  }

  return params;
}

/**
 * Get next page hint for pagination footer
 */
export function getNextPageCommand(currentCommand: string, currentPage?: number): string {
  const page = (currentPage || 1) + 1;
  // If command already has --page, replace it
  if (currentCommand.includes('--page')) {
    return currentCommand.replace(/--page\s+\d+/, `--page ${page}`);
  }
  // Otherwise append it
  return `${currentCommand} --page ${page}`;
}
