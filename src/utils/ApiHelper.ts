import { APIRequestContext, expect } from '@playwright/test';
import { ApiResponse, AuthToken } from '../types';
import { Logger } from './Logger';

/**
 * API Helper class for handling API requests and responses
 * 
 * Provides utilities for:
 * - Making HTTP requests
 * - Authentication handling
 * - Response validation
 * - Error handling
 * 
 * @example
 * ```typescript
 * const apiHelper = new ApiHelper(request);
 * const response = await apiHelper.get('/api/users');
 * await apiHelper.validateResponse(response, 200);
 * ```
 */
export class ApiHelper {
  private logger: Logger;
  private authToken?: AuthToken;

  constructor(private request: APIRequestContext) {
    this.logger = new Logger('ApiHelper');
  }

  /**
   * Set authentication token
   * @param token - Authentication token
   */
  setAuthToken(token: AuthToken): void {
    this.authToken = token;
    this.logger.info('Authentication token set');
  }

  /**
   * Get authorization headers
   */
  private getAuthHeaders(): Record<string, string> {
    if (!this.authToken) {
      return {};
    }
    
    return {
      'Authorization': `${this.authToken.tokenType} ${this.authToken.accessToken}`
    };
  }

  /**
   * Make GET request
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @param headers - Additional headers
   */
  async get<T = any>(
    endpoint: string, 
    params?: Record<string, string>,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    this.logger.info(`GET request to: ${endpoint}`);
    
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    
    const response = await this.request.get(url, {
      headers: {
        ...this.getAuthHeaders(),
        ...headers
      }
    });

    return await this.processResponse<T>(response);
  }

  /**
   * Make POST request
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param headers - Additional headers
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    this.logger.info(`POST request to: ${endpoint}`);
    
    const response = await this.request.post(endpoint, {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...headers
      }
    });

    return await this.processResponse<T>(response);
  }

  /**
   * Make PUT request
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param headers - Additional headers
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    this.logger.info(`PUT request to: ${endpoint}`);
    
    const response = await this.request.put(endpoint, {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...headers
      }
    });

    return await this.processResponse<T>(response);
  }

  /**
   * Make PATCH request
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param headers - Additional headers
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    this.logger.info(`PATCH request to: ${endpoint}`);
    
    const response = await this.request.patch(endpoint, {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...headers
      }
    });

    return await this.processResponse<T>(response);
  }

  /**
   * Make DELETE request
   * @param endpoint - API endpoint
   * @param headers - Additional headers
   */
  async delete<T = any>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    this.logger.info(`DELETE request to: ${endpoint}`);
    
    const response = await this.request.delete(endpoint, {
      headers: {
        ...this.getAuthHeaders(),
        ...headers
      }
    });

    return await this.processResponse<T>(response);
  }

  /**
   * Process API response
   * @param response - Playwright API response
   */
  private async processResponse<T>(response: any): Promise<ApiResponse<T>> {
    const status = response.status();
    const headers = response.headers();
    
    let data: T;
    try {
      data = await response.json();
    } catch {
      data = await response.text() as T;
    }

    const apiResponse: ApiResponse<T> = {
      status,
      data,
      headers,
      success: status >= 200 && status < 300
    };

    this.logger.info(`Response status: ${status}`);
    
    return apiResponse;
  }

  /**
   * Validate response status
   * @param response - API response
   * @param expectedStatus - Expected status code
   */
  async validateStatus<T>(response: ApiResponse<T>, expectedStatus: number): Promise<void> {
    expect(response.status).toBe(expectedStatus);
    this.logger.info(`Status validation passed: ${expectedStatus}`);
  }

  /**
   * Validate response contains data
   * @param response - API response
   * @param expectedData - Expected data properties
   */
  async validateResponseData<T>(response: ApiResponse<T>, expectedData: Partial<T>): Promise<void> {
    for (const [key, value] of Object.entries(expectedData)) {
      expect((response.data as any)[key]).toBe(value);
    }
    this.logger.info('Response data validation passed');
  }

  /**
   * Validate response schema
   * @param response - API response
   * @param requiredFields - Required fields in response
   */
  async validateSchema<T>(response: ApiResponse<T>, requiredFields: string[]): Promise<void> {
    for (const field of requiredFields) {
      const hasProperty = Object.prototype.hasOwnProperty.call(response.data, field);
      expect(hasProperty).toBe(true);
    }
    this.logger.info('Response schema validation passed');
  }

  /**
   * Login and get authentication token
   * @param loginEndpoint - Login API endpoint
   * @param credentials - User credentials
   */
  async authenticate(loginEndpoint: string, credentials: Record<string, string>): Promise<AuthToken> {
    this.logger.info('Authenticating user');
    
    const response = await this.post<AuthToken>(loginEndpoint, credentials);
    
    if (!response.success) {
      throw new Error(`Authentication failed: ${response.status}`);
    }

    this.setAuthToken(response.data);
    this.logger.info('Authentication successful');
    
    return response.data;
  }

  /**
   * Clear authentication token
   */
  clearAuth(): void {
    this.authToken = undefined;
    this.logger.info('Authentication token cleared');
  }
}
