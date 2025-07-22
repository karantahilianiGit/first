import { TestData } from '../../src/types';
/**
 * Test data configuration
 *
 * Centralized location for all test data including:
 * - User credentials
 * - Test URLs
 * - API endpoints
 * - Configuration settings
 */
export declare const testData: TestData;
/**
 * Environment-specific configuration
 */
export declare const environments: {
    development: {
        baseUrl: string;
        apiBaseUrl: string;
    };
    staging: {
        baseUrl: string;
        apiBaseUrl: string;
    };
    production: {
        baseUrl: string;
        apiBaseUrl: string;
    };
};
/**
 * Get environment-specific configuration
 * @param env - Environment name
 */
export declare function getEnvironmentConfig(env?: string): {
    baseUrl: string;
    apiBaseUrl: string;
} | {
    baseUrl: string;
    apiBaseUrl: string;
} | {
    baseUrl: string;
    apiBaseUrl: string;
};
/**
 * Sample form data for testing
 */
export declare const sampleFormData: {
    userRegistration: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
        phoneNumber: string;
        dateOfBirth: string;
    };
    contactForm: {
        name: string;
        email: string;
        subject: string;
        message: string;
    };
    searchQueries: string[];
};
//# sourceMappingURL=testData.d.ts.map