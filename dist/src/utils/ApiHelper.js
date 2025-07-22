"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiHelper = void 0;
const test_1 = require("@playwright/test");
const Logger_1 = require("./Logger");
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
class ApiHelper {
    request;
    logger;
    authToken;
    constructor(request) {
        this.request = request;
        this.logger = new Logger_1.Logger('ApiHelper');
    }
    /**
     * Set authentication token
     * @param token - Authentication token
     */
    setAuthToken(token) {
        this.authToken = token;
        this.logger.info('Authentication token set');
    }
    /**
     * Get authorization headers
     */
    getAuthHeaders() {
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
    async get(endpoint, params, headers) {
        this.logger.info(`GET request to: ${endpoint}`);
        const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
        const response = await this.request.get(url, {
            headers: {
                ...this.getAuthHeaders(),
                ...headers
            }
        });
        return await this.processResponse(response);
    }
    /**
     * Make POST request
     * @param endpoint - API endpoint
     * @param data - Request body data
     * @param headers - Additional headers
     */
    async post(endpoint, data, headers) {
        this.logger.info(`POST request to: ${endpoint}`);
        const response = await this.request.post(endpoint, {
            data,
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders(),
                ...headers
            }
        });
        return await this.processResponse(response);
    }
    /**
     * Make PUT request
     * @param endpoint - API endpoint
     * @param data - Request body data
     * @param headers - Additional headers
     */
    async put(endpoint, data, headers) {
        this.logger.info(`PUT request to: ${endpoint}`);
        const response = await this.request.put(endpoint, {
            data,
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders(),
                ...headers
            }
        });
        return await this.processResponse(response);
    }
    /**
     * Make PATCH request
     * @param endpoint - API endpoint
     * @param data - Request body data
     * @param headers - Additional headers
     */
    async patch(endpoint, data, headers) {
        this.logger.info(`PATCH request to: ${endpoint}`);
        const response = await this.request.patch(endpoint, {
            data,
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders(),
                ...headers
            }
        });
        return await this.processResponse(response);
    }
    /**
     * Make DELETE request
     * @param endpoint - API endpoint
     * @param headers - Additional headers
     */
    async delete(endpoint, headers) {
        this.logger.info(`DELETE request to: ${endpoint}`);
        const response = await this.request.delete(endpoint, {
            headers: {
                ...this.getAuthHeaders(),
                ...headers
            }
        });
        return await this.processResponse(response);
    }
    /**
     * Process API response
     * @param response - Playwright API response
     */
    async processResponse(response) {
        const status = response.status();
        const headers = response.headers();
        let data;
        try {
            data = await response.json();
        }
        catch {
            data = await response.text();
        }
        const apiResponse = {
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
    async validateStatus(response, expectedStatus) {
        (0, test_1.expect)(response.status).toBe(expectedStatus);
        this.logger.info(`Status validation passed: ${expectedStatus}`);
    }
    /**
     * Validate response contains data
     * @param response - API response
     * @param expectedData - Expected data properties
     */
    async validateResponseData(response, expectedData) {
        for (const [key, value] of Object.entries(expectedData)) {
            (0, test_1.expect)(response.data[key]).toBe(value);
        }
        this.logger.info('Response data validation passed');
    }
    /**
     * Validate response schema
     * @param response - API response
     * @param requiredFields - Required fields in response
     */
    async validateSchema(response, requiredFields) {
        for (const field of requiredFields) {
            const hasProperty = Object.prototype.hasOwnProperty.call(response.data, field);
            (0, test_1.expect)(hasProperty).toBe(true);
        }
        this.logger.info('Response schema validation passed');
    }
    /**
     * Login and get authentication token
     * @param loginEndpoint - Login API endpoint
     * @param credentials - User credentials
     */
    async authenticate(loginEndpoint, credentials) {
        this.logger.info('Authenticating user');
        const response = await this.post(loginEndpoint, credentials);
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
    clearAuth() {
        this.authToken = undefined;
        this.logger.info('Authentication token cleared');
    }
}
exports.ApiHelper = ApiHelper;
//# sourceMappingURL=ApiHelper.js.map