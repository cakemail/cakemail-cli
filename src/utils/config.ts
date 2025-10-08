import 'dotenv/config';
import { CakemailConfig } from '../client.js';

export function getConfig(required: boolean = true): CakemailConfig {
  const accessToken = process.env.CAKEMAIL_ACCESS_TOKEN;
  const email = process.env.CAKEMAIL_EMAIL || process.env.CAKEMAIL_USERNAME;
  const password = process.env.CAKEMAIL_PASSWORD;
  const baseURL = process.env.CAKEMAIL_API_BASE;

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
  };
}
