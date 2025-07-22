import { APIRequestContext } from '@playwright/test';
import { ApiResponse, AuthToken } from '../types';
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
export declare class ApiHelper {
    private request;
    private logger;
    private authToken?;
    constructor(request: APIRequestContext);
    /**
     * Set authentication token
     * @param token - Authentication token
     */
    setAuthToken(token: AuthToken): void;
    /**
     * Get authorization headers
     */
    private getAuthHeaders;
    /**
     * Make GET request
     * @param endpoint - API endpoint
     * @param params - Query parameters
     * @param headers - Additional headers
     */
    get<T = any>(endpoint: string, params?: Record<string, string>, headers?: Record<string, string>): Promise<ApiResponse<T>>;
    /**
     * Make POST request
     * @param endpoint - API endpoint
     * @param data - Request body data
     * @param headers - Additional headers
     */
    post<T = any>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>>;
    /**
     * Make PUT request
     * @param endpoint - API endpoint
     * @param data - Request body data
     * @param headers - Additional headers
     */
    put<T = any>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>>;
    /**
     * Make PATCH request
     * @param endpoint - API endpoint
     * @param data - Request body data
     * @param headers - Additional headers
     */
    patch<T = any>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>>;
    /**
     * Make DELETE request
     * @param endpoint - API endpoint
     * @param headers - Additional headers
     */
    delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>>;
    /**
     * Process API response
     * @param response - Playwright API response
     */
    private processResponse;
    /**
     * Validate response status
     * @param response - API response
     * @param expectedStatus - Expected status code
     */
    validateStatus<T>(response: ApiResponse<T>, expectedStatus: number): Promise<void>;
    /**
     * Validate response contains data
     * @param response - API response
     * @param expectedData - Expected data properties
     */
    validateResponseData<T>(response: ApiResponse<T>, expectedData: Partial<T>): Promise<void>;
    /**
     * Validate response schema
     * @param response - API response
     * @param requiredFields - Required fields in response
     */
    validateSchema<T>(response: ApiResponse<T>, requiredFields: string[]): Promise<void>;
    /**
     * Login and get authentication token
     * @param loginEndpoint - Login API endpoint
     * @param credentials - User credentials
     */
    authenticate(loginEndpoint: string, credentials: Record<string, string>): Promise<AuthToken>;
    /**
     * Clear authentication token
     */
    clearAuth(): void;
}
//# sourceMappingURL=ApiHelper.d.ts.map