import { CakemailClient } from '../client.js';
import { OutputFormatter } from './output.js';
import chalk from 'chalk';

/**
 * Smart defaults utilities for reducing required flags
 * Auto-detect resources when only one exists or remember last-used
 */

interface CachedResource {
  id: string | number;
  name?: string;
  timestamp: number;
}

// In-memory cache for session (cleared on CLI exit)
const sessionCache: {
  lastList?: CachedResource;
  lastCampaign?: CachedResource;
  lastSender?: CachedResource;
} = {};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Check if cached resource is still valid
 */
function isCacheValid(cached?: CachedResource): boolean {
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_TTL;
}

/**
 * Auto-detect list ID when only one exists
 * Returns the list ID if only one list exists, otherwise undefined
 */
export async function autoDetectList(
  client: CakemailClient,
  formatter: OutputFormatter,
  providedListId?: string | number,
  options: { silent?: boolean; useCache?: boolean } = {}
): Promise<number | undefined> {
  // If user provided a list ID, use it
  if (providedListId !== undefined) {
    const listId = typeof providedListId === 'string' ? parseInt(providedListId) : providedListId;

    // Cache it for future use
    sessionCache.lastList = {
      id: listId,
      timestamp: Date.now()
    };

    return listId;
  }

  // Check cache if enabled
  if (options.useCache && isCacheValid(sessionCache.lastList)) {
    if (!options.silent) {
      formatter.info(`Using cached list: ${sessionCache.lastList!.id}${sessionCache.lastList!.name ? ` (${sessionCache.lastList!.name})` : ''}`);
    }
    return sessionCache.lastList!.id as number;
  }

  try {
    // Fetch all lists
    const response = await client.sdk.lists.list({ per_page: 100 });
    const lists = response.data || [];

    if (lists.length === 0) {
      if (!options.silent) {
        formatter.error('No lists found. Create a list first with: cakemail lists create -n "My List"');
      }
      return undefined;
    }

    if (lists.length === 1) {
      const list = lists[0];
      const listId = list.id;

      // Cache it
      sessionCache.lastList = {
        id: listId,
        name: list.name,
        timestamp: Date.now()
      };

      if (!options.silent) {
        formatter.info(chalk.gray(`Auto-detected list: ${listId} (${list.name})`));
      }

      return listId;
    }

    // Multiple lists exist
    if (!options.silent) {
      formatter.info(chalk.yellow('Multiple lists found. Please specify --list-id <id>'));
      formatter.info(chalk.gray('Available lists:'));
      lists.slice(0, 5).forEach((list: any) => {
        formatter.info(chalk.gray(`  ${list.id}: ${list.name}`));
      });
      if (lists.length > 5) {
        formatter.info(chalk.gray(`  ... and ${lists.length - 5} more`));
      }
    }

    return undefined;
  } catch (error: any) {
    if (!options.silent) {
      formatter.error(`Failed to auto-detect list: ${error.message}`);
    }
    return undefined;
  }
}

/**
 * Auto-detect sender ID when only one verified sender exists
 */
export async function autoDetectSender(
  client: CakemailClient,
  formatter: OutputFormatter,
  providedSenderId?: string | number,
  options: { silent?: boolean; useCache?: boolean; requireConfirmed?: boolean } = {}
): Promise<string | undefined> {
  // If user provided a sender ID, use it
  if (providedSenderId !== undefined) {
    const senderId = String(providedSenderId);

    // Cache it for future use
    sessionCache.lastSender = {
      id: senderId,
      timestamp: Date.now()
    };

    return senderId;
  }

  // Check cache if enabled
  if (options.useCache && isCacheValid(sessionCache.lastSender)) {
    if (!options.silent) {
      formatter.info(`Using cached sender: ${sessionCache.lastSender!.id}${sessionCache.lastSender!.name ? ` (${sessionCache.lastSender!.name})` : ''}`);
    }
    return sessionCache.lastSender!.id as string;
  }

  try {
    // Fetch all senders
    const response = await client.sdk.senderService.listSenders({ perPage: 100 });
    const allSenders = response.data || [];

    // Filter to confirmed senders if required
    const senders = options.requireConfirmed
      ? allSenders.filter((s: any) => s.confirmed === true)
      : allSenders;

    if (senders.length === 0) {
      if (!options.silent) {
        if (options.requireConfirmed && allSenders.length > 0) {
          formatter.error('No confirmed senders found. Please confirm a sender first.');
        } else {
          formatter.error('No senders found. Create a sender first with: cakemail senders create -n "Name" -e "email@domain.com"');
        }
      }
      return undefined;
    }

    if (senders.length === 1) {
      const sender = senders[0];
      const senderId = sender.id;

      // Cache it
      sessionCache.lastSender = {
        id: senderId,
        name: sender.name,
        timestamp: Date.now()
      };

      if (!options.silent) {
        formatter.info(chalk.gray(`Auto-detected sender: ${senderId} (${sender.name} <${sender.email}>)`));
      }

      return senderId;
    }

    // Multiple senders exist
    if (!options.silent) {
      const senderType = options.requireConfirmed ? 'confirmed senders' : 'senders';
      formatter.info(chalk.yellow(`Multiple ${senderType} found. Please specify --sender-id <id>`));
      formatter.info(chalk.gray('Available senders:'));
      senders.slice(0, 5).forEach((sender: any) => {
        const confirmed = sender.confirmed ? chalk.green('✓') : chalk.gray('✗');
        formatter.info(chalk.gray(`  ${sender.id}: ${sender.name} <${sender.email}> ${confirmed}`));
      });
      if (senders.length > 5) {
        formatter.info(chalk.gray(`  ... and ${senders.length - 5} more`));
      }
    }

    return undefined;
  } catch (error: any) {
    if (!options.silent) {
      formatter.error(`Failed to auto-detect sender: ${error.message}`);
    }
    return undefined;
  }
}

/**
 * Get last used list from cache
 */
export function getLastList(): number | undefined {
  if (isCacheValid(sessionCache.lastList)) {
    return sessionCache.lastList!.id as number;
  }
  return undefined;
}

/**
 * Get last used sender from cache
 */
export function getLastSender(): string | undefined {
  if (isCacheValid(sessionCache.lastSender)) {
    return sessionCache.lastSender!.id as string;
  }
  return undefined;
}

/**
 * Clear session cache (useful for testing)
 */
export function clearCache(): void {
  sessionCache.lastList = undefined;
  sessionCache.lastCampaign = undefined;
  sessionCache.lastSender = undefined;
}

/**
 * Suggest a default value for a missing required option
 * Returns the detected value or undefined
 */
export async function suggestDefault(
  client: CakemailClient,
  formatter: OutputFormatter,
  type: 'list' | 'sender',
  options: { silent?: boolean; useCache?: boolean } = {}
): Promise<string | number | undefined> {
  switch (type) {
    case 'list':
      return autoDetectList(client, formatter, undefined, options);
    case 'sender':
      return autoDetectSender(client, formatter, undefined, options);
    default:
      return undefined;
  }
}
