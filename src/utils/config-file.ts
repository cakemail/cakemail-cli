/**
 * Configuration File Management
 *
 * Handles reading/writing ~/.cakemail/config.json
 * Supports migration from .env to config file
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ProfileType, ProfileConfig, getDefaultProfile } from '../types/profile.js';

const CONFIG_DIR = path.join(os.homedir(), '.cakemail');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

/**
 * Complete configuration file schema
 */
export interface ConfigFile {
  version: string;
  profile?: ProfileType;
  auth?: {
    method?: 'password' | 'token';
    email?: string;
    token?: string; // Encrypted token
    base_url?: string;
  };
  profiles?: {
    developer?: Partial<ProfileConfig>;
    marketer?: Partial<ProfileConfig>;
    balanced?: Partial<ProfileConfig>;
    custom?: Partial<ProfileConfig>;
  };
  defaults?: {
    list_id?: number;
    sender_id?: number;
    account_id?: string;
  };
}

/**
 * Ensure config directory exists
 */
export function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  }
}

/**
 * Check if config file exists
 */
export function configFileExists(): boolean {
  return fs.existsSync(CONFIG_FILE);
}

/**
 * Load config file
 * Returns undefined if file doesn't exist
 */
export function loadConfigFile(): ConfigFile | undefined {
  if (!configFileExists()) {
    return undefined;
  }

  try {
    const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(content) as ConfigFile;
  } catch (error) {
    console.error(`Error reading config file: ${error}`);
    return undefined;
  }
}

/**
 * Save config file
 */
export function saveConfigFile(config: ConfigFile): void {
  ensureConfigDir();

  try {
    const content = JSON.stringify(config, null, 2);
    fs.writeFileSync(CONFIG_FILE, content, { mode: 0o600 });
  } catch (error) {
    throw new Error(`Failed to save config file: ${error}`);
  }
}

/**
 * Update config file (merge with existing)
 */
export function updateConfigFile(updates: Partial<ConfigFile>): void {
  const existing = loadConfigFile() || { version: '1.0' };
  const merged = mergeConfig(existing, updates);
  saveConfigFile(merged);
}

/**
 * Deep merge two config objects
 */
function mergeConfig(base: ConfigFile, updates: Partial<ConfigFile>): ConfigFile {
  return {
    ...base,
    ...updates,
    auth: updates.auth ? { ...base.auth, ...updates.auth } : base.auth,
    profiles: updates.profiles ? { ...base.profiles, ...updates.profiles } : base.profiles,
    defaults: updates.defaults ? { ...base.defaults, ...updates.defaults } : base.defaults,
  };
}

/**
 * Get current profile from config file
 */
export function getCurrentProfile(): ProfileType {
  const config = loadConfigFile();
  return config?.profile || 'balanced';
}

/**
 * Set current profile in config file
 */
export function setCurrentProfile(profile: ProfileType): void {
  updateConfigFile({ profile });
}

/**
 * Get profile configuration
 * Merges default profile with custom overrides
 */
export function getProfileConfig(profileType?: ProfileType): ProfileConfig {
  const profile = profileType || getCurrentProfile();
  const defaults = getDefaultProfile(profile);
  const config = loadConfigFile();

  // No config file, return defaults
  if (!config) {
    return defaults;
  }

  // Merge profile-specific overrides
  const profileOverrides = config.profiles?.[profile];
  const customOverrides = config.profiles?.custom;

  return mergeProfileConfig(
    defaults,
    profileOverrides || {},
    customOverrides || {}
  );
}

/**
 * Deep merge profile configurations
 */
function mergeProfileConfig(
  base: ProfileConfig,
  ...overrides: Partial<ProfileConfig>[]
): ProfileConfig {
  let result = { ...base };

  for (const override of overrides) {
    result = {
      output: { ...result.output, ...override.output },
      behavior: { ...result.behavior, ...override.behavior },
      display: { ...result.display, ...override.display },
    };
  }

  return result;
}

/**
 * Set a custom profile config value
 * Example: setProfileConfigValue('output.format', 'table')
 */
export function setProfileConfigValue(key: string, value: any): void {
  const config = loadConfigFile() || { version: '1.0' };

  if (!config.profiles) {
    config.profiles = {};
  }

  if (!config.profiles.custom) {
    config.profiles.custom = {};
  }

  // Parse nested key (e.g., "output.format")
  const parts = key.split('.');
  let target: any = config.profiles.custom;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!target[part]) {
      target[part] = {};
    }
    target = target[part];
  }

  target[parts[parts.length - 1]] = value;

  saveConfigFile(config);
}

/**
 * Reset custom profile config
 */
export function resetProfileConfig(): void {
  const config = loadConfigFile();
  if (!config) return;

  if (config.profiles) {
    delete config.profiles.custom;
  }

  saveConfigFile(config);
}

/**
 * Migrate .env to config file
 * This runs once when user first upgrades to profile system
 */
export function migrateFromEnv(): ConfigFile | undefined {
  // Check if config already exists
  if (configFileExists()) {
    return loadConfigFile();
  }

  // Try to read from .env
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    return undefined;
  }

  const config: ConfigFile = {
    version: '1.0',
    profile: 'balanced', // Default for existing users
  };

  // Read .env file
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const [key, value] = trimmed.split('=').map(s => s.trim());
    if (!key || !value) continue;

    // Remove quotes
    const cleanValue = value.replace(/^["']|["']$/g, '');

    // Map env vars to config
    if (key === 'CAKEMAIL_EMAIL' || key === 'CAKEMAIL_USERNAME') {
      if (!config.auth) config.auth = {};
      config.auth.email = cleanValue;
    } else if (key === 'CAKEMAIL_ACCESS_TOKEN') {
      if (!config.auth) config.auth = {};
      config.auth.token = cleanValue;
    } else if (key === 'CAKEMAIL_API_BASE') {
      if (!config.auth) config.auth = {};
      config.auth.base_url = cleanValue;
    } else if (key === 'CAKEMAIL_CURRENT_ACCOUNT_ID') {
      if (!config.defaults) config.defaults = {};
      config.defaults.account_id = cleanValue;
    }
  }

  // Save migrated config
  if (config.auth) {
    saveConfigFile(config);
    return config;
  }

  return undefined;
}

/**
 * Get defaults (list_id, sender_id, account_id)
 */
export function getDefaults(): { list_id?: number; sender_id?: number; account_id?: string } {
  const config = loadConfigFile();
  return {
    list_id: config?.defaults?.list_id,
    sender_id: config?.defaults?.sender_id,
    account_id: config?.defaults?.account_id,
  };
}

/**
 * Set a default value
 */
export function setDefault(key: 'list_id' | 'sender_id' | 'account_id', value: number | string): void {
  const config = loadConfigFile() || { version: '1.0' };

  if (!config.defaults) {
    config.defaults = {};
  }

  if (key === 'account_id') {
    config.defaults.account_id = value as string;
  } else {
    config.defaults[key] = value as number;
  }

  saveConfigFile(config);
}
