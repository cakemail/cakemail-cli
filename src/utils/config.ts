import { config } from 'dotenv';
import { CakemailConfig } from '../client.js';

// Load .env from current working directory
config({ path: process.cwd() + '/.env' });

export type OutputFormat = 'json' | 'table' | 'compact';

export interface FullConfig extends CakemailConfig {
  outputFormat?: OutputFormat;
}

export function getConfig(required: boolean = true): FullConfig {
  const accessToken = process.env.CAKEMAIL_ACCESS_TOKEN;
  const email = process.env.CAKEMAIL_EMAIL || process.env.CAKEMAIL_USERNAME;
  const password = process.env.CAKEMAIL_PASSWORD;
  const baseURL = process.env.CAKEMAIL_API_BASE;
  const outputFormat = (process.env.CAKEMAIL_OUTPUT_FORMAT || 'json') as OutputFormat;

  if (required && !accessToken && (!email || !password)) {
    throw new Error(
      'Missing credentials. Set CAKEMAIL_ACCESS_TOKEN or (CAKEMAIL_EMAIL and CAKEMAIL_PASSWORD) in environment variables or .env file'
    );
  }

  return {
    accessToken,
    email,
    password,
    baseURL,
    outputFormat,
  };
}
