import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface CakemailConfig {
  accessToken?: string;  // Pre-existing token (optional)
  email?: string;
  password?: string;
  baseURL?: string;
}

export class CakemailClient {
  private client: AxiosInstance;
  private accessToken?: string;
  private refreshToken?: string;
  private config: CakemailConfig;

  constructor(config: CakemailConfig) {
    this.config = config;
    this.accessToken = config.accessToken;
    const baseURL = config.baseURL || process.env.CAKEMAIL_API_BASE || 'https://api.cakemail.dev';

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(async (config) => {
      if (!this.accessToken) {
        await this.authenticate();
      }

      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }

      return config;
    });

    // Add response interceptor to handle token expiration
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && this.refreshToken) {
          try {
            await this.refreshAccessToken();
            // Retry the original request
            return this.client.request(error.config);
          } catch (refreshError) {
            // Refresh failed, try to re-authenticate
            if (this.config.email && this.config.password) {
              await this.authenticate();
              return this.client.request(error.config);
            }
            throw refreshError;
          }
        }
        throw error;
      }
    );
  }

  private async authenticate(): Promise<void> {
    if (!this.config.email || !this.config.password) {
      throw new Error('Email and password are required for authentication');
    }

    try {
      // OAuth2 Password Grant requires application/x-www-form-urlencoded
      // URLSearchParams will automatically encode special characters like +
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('username', this.config.email);
      params.append('password', this.config.password);

      const response = await axios.post(`${this.client.defaults.baseURL}/token`, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      const message = error.response?.data?.message || error.message;

      // Show more helpful error for common issues
      if (detail && Array.isArray(detail)) {
        const errors = detail.map((e: any) => `${e.loc.join('.')}: ${e.msg}`).join(', ');
        throw new Error(`Authentication failed: ${errors}`);
      }

      throw new Error(`Authentication failed: ${message}`);
    }
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('refresh_token', this.refreshToken);

      const response = await axios.post(`${this.client.defaults.baseURL}/token`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      this.accessToken = response.data.access_token;
      if (response.data.refresh_token) {
        this.refreshToken = response.data.refresh_token;
      }
    } catch (error: any) {
      throw new Error(`Token refresh failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          `API Error (${error.response.status}): ${
            error.response.data?.message ||
            error.response.data?.error ||
            error.response.statusText
          }`
        );
      }
      throw error;
    }
  }

  // Convenience methods for common HTTP verbs
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }
}
