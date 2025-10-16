import { config } from 'dotenv';
import { CakemailConfig } from '../client.js';
import { authenticateInteractively } from './auth.js';
import { ProfileType, ProfileConfig, OutputFormat } from '../types/profile.js';
import {
  loadConfigFile,
  getProfileConfig,
  getCurrentProfile,
  migrateFromEnv,
  ConfigFile
} from './config-file.js';

// Load .env from current working directory (fallback for backward compatibility)
config({ path: process.cwd() + '/.env' });

// Re-export types for backward compatibility
export type { OutputFormat, ProfileType, ProfileConfig };

export interface FullConfig extends CakemailConfig {
  outputFormat?: OutputFormat;
  currentAccountId?: string;
  profile?: ProfileType;
  profileConfig?: ProfileConfig;
  refreshToken?: string;
  expiresIn?: number;
}

export async function getConfig(required: boolean = true, interactive: boolean = true): Promise<FullConfig> {
  // Try to load from config file first
  let configFile = loadConfigFile();

  // If no config file exists, try to migrate from .env
  if (!configFile) {
    configFile = migrateFromEnv();
  }

  // Load credentials from config file or .env
  let accessToken = configFile?.auth?.access_token || configFile?.auth?.token || process.env.CAKEMAIL_ACCESS_TOKEN;
  let refreshToken = configFile?.auth?.refresh_token;
  let expiresIn = configFile?.auth?.expires_in;
  let email = configFile?.auth?.email || process.env.CAKEMAIL_EMAIL || process.env.CAKEMAIL_USERNAME;
  let password = process.env.CAKEMAIL_PASSWORD; // Password not stored in config (security)
  const baseURL = configFile?.auth?.base_url || process.env.CAKEMAIL_API_BASE;
  const currentAccountId = configFile?.defaults?.account_id || process.env.CAKEMAIL_CURRENT_ACCOUNT_ID || undefined;

  // Load profile configuration
  const profile = getCurrentProfile();
  const profileConfig = getProfileConfig(profile);

  // Output format priority: env var > profile config > default
  const outputFormat = (process.env.CAKEMAIL_OUTPUT_FORMAT as OutputFormat) || profileConfig.output.format;

  // If credentials are missing and interactive mode is enabled, prompt the user
  if (required && !accessToken && (!email || !password)) {
    if (interactive) {
      // Interactive authentication flow
      const credentials = await authenticateInteractively();
      email = credentials.email;
      password = credentials.password;

      // Reload config file (it was updated by auth flow)
      configFile = loadConfigFile();

      // Reload .env to get any updates from authentication (backward compatibility)
      config({ path: process.cwd() + '/.env', override: true });
    } else {
      throw new Error(
        'Missing credentials. Set CAKEMAIL_ACCESS_TOKEN or (CAKEMAIL_EMAIL and CAKEMAIL_PASSWORD) in environment variables, .env file, or run authentication'
      );
    }
  }

  return {
    accessToken,
    refreshToken,
    expiresIn,
    email,
    password,
    baseURL,
    outputFormat,
    currentAccountId,
    profile,
    profileConfig,
  };
}

/**
 * Synchronous version of getConfig for backwards compatibility
 * Use this only when you're certain credentials are already set
 */
export function getConfigSync(required: boolean = true): FullConfig {
  // Try to load from config file first
  let configFile = loadConfigFile();

  // If no config file exists, try to migrate from .env
  if (!configFile) {
    configFile = migrateFromEnv();
  }

  // Load credentials from config file or .env
  const accessToken = configFile?.auth?.access_token || configFile?.auth?.token || process.env.CAKEMAIL_ACCESS_TOKEN;
  const refreshToken = configFile?.auth?.refresh_token;
  const expiresIn = configFile?.auth?.expires_in;
  const email = configFile?.auth?.email || process.env.CAKEMAIL_EMAIL || process.env.CAKEMAIL_USERNAME;
  const password = process.env.CAKEMAIL_PASSWORD; // Password not stored in config (security)
  const baseURL = configFile?.auth?.base_url || process.env.CAKEMAIL_API_BASE;
  const currentAccountId = configFile?.defaults?.account_id || process.env.CAKEMAIL_CURRENT_ACCOUNT_ID || undefined;

  // Load profile configuration
  const profile = getCurrentProfile();
  const profileConfig = getProfileConfig(profile);

  // Output format priority: env var > profile config > default
  const outputFormat = (process.env.CAKEMAIL_OUTPUT_FORMAT as OutputFormat) || profileConfig.output.format;

  if (required && !accessToken && (!email || !password)) {
    throw new Error(
      'Missing credentials. Set CAKEMAIL_ACCESS_TOKEN or (CAKEMAIL_EMAIL and CAKEMAIL_PASSWORD) in environment variables, .env file, or run authentication'
    );
  }

  return {
    accessToken,
    refreshToken,
    expiresIn,
    email,
    password,
    baseURL,
    outputFormat,
    currentAccountId,
    profile,
    profileConfig,
  };
}
