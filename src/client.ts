import { CakemailClient as SDK, CakemailClientConfig } from '@cakemail-org/cakemail-sdk';

export interface CakemailConfig {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  email?: string;
  password?: string;
  baseURL?: string;
}

/**
 * Wrapper around the official Cakemail SDK
 * Provides backward compatibility with our CLI while using the SDK
 */
export class CakemailClient {
  public sdk: SDK;
  private config: CakemailConfig;

  constructor(config: CakemailConfig) {
    this.config = config;

    // The SDK supports either access token OR email/password
    if (!config.accessToken && (!config.email || !config.password)) {
      throw new Error('Either accessToken or email/password is required for authentication');
    }

    const sdkConfig: CakemailClientConfig = {
      baseURL: config.baseURL || process.env.CAKEMAIL_API_BASE || 'https://api.cakemail.dev',
    };

    // Use access token if available, otherwise use email/password
    if (config.accessToken) {
      sdkConfig.accessToken = config.accessToken;
      if (config.refreshToken) sdkConfig.refreshToken = config.refreshToken;
      if (config.expiresIn) sdkConfig.expiresIn = config.expiresIn;
    } else {
      sdkConfig.email = config.email;
      sdkConfig.password = config.password;
    }

    this.sdk = new SDK(sdkConfig);
  }

  /**
   * Legacy method for backward compatibility with our commands
   * Routes to appropriate SDK resource methods
   */
  async get<T = any>(url: string, config?: { params?: any }): Promise<T> {
    // The SDK handles all requests through resources
    // This is for backward compatibility - we'll migrate commands to use SDK resources directly
    throw new Error('Direct HTTP methods deprecated - use SDK resources (client.sdk.campaigns, client.sdk.lists, etc.)');
  }

  async post<T = any>(url: string, data?: any): Promise<T> {
    throw new Error('Direct HTTP methods deprecated - use SDK resources (client.sdk.campaigns, client.sdk.lists, etc.)');
  }

  async patch<T = any>(url: string, data?: any): Promise<T> {
    throw new Error('Direct HTTP methods deprecated - use SDK resources (client.sdk.campaigns, client.sdk.lists, etc.)');
  }

  async delete<T = any>(url: string): Promise<T> {
    throw new Error('Direct HTTP methods deprecated - use SDK resources (client.sdk.campaigns, client.sdk.lists, etc.)');
  }
}
