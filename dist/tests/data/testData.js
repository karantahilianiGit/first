"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleFormData = exports.getEnvironmentConfig = exports.environments = exports.testData = void 0;
const types_1 = require("../../src/types");
/**
 * Test data configuration
 *
 * Centralized location for all test data including:
 * - User credentials
 * - Test URLs
 * - API endpoints
 * - Configuration settings
 */
exports.testData = {
    users: {
        admin: {
            username: 'admin@example.com',
            password: 'Admin123!',
            email: 'admin@example.com',
            role: types_1.UserRole.ADMIN
        },
        standardUser: {
            username: 'user@example.com',
            password: 'User123!',
            email: 'user@example.com',
            role: types_1.UserRole.USER
        },
        invalidUser: {
            username: 'invalid@example.com',
            password: 'wrongpassword',
            email: 'invalid@example.com',
            role: types_1.UserRole.GUEST
        },
        testUser1: {
            username: 'testuser1@example.com',
            password: 'TestUser123!',
            email: 'testuser1@example.com',
            role: types_1.UserRole.USER
        },
        testUser2: {
            username: 'testuser2@example.com',
            password: 'TestUser123!',
            email: 'testuser2@example.com',
            role: types_1.UserRole.USER
        }
    },
    urls: {
        baseUrl: process.env.BASE_URL || 'https://example.com',
        loginUrl: '/login',
        dashboardUrl: '/dashboard',
        profileUrl: '/profile',
        settingsUrl: '/settings',
        apiDocsUrl: '/api/docs'
    },
    apiEndpoints: {
        auth: '/api/auth',
        login: '/api/auth/login',
        logout: '/api/auth/logout',
        refresh: '/api/auth/refresh',
        users: '/api/users',
        profile: '/api/profile',
        settings: '/api/settings'
    },
    testConfig: {
        baseUrl: process.env.BASE_URL || 'https://example.com',
        apiBaseUrl: process.env.API_BASE_URL || 'https://api.example.com',
        timeout: parseInt(process.env.TEST_TIMEOUT || '30000'),
        retries: parseInt(process.env.TEST_RETRIES || '2'),
        headless: process.env.HEADLESS !== 'false',
        slowMo: parseInt(process.env.SLOW_MO || '0')
    }
};
/**
 * Environment-specific configuration
 */
exports.environments = {
    development: {
        baseUrl: 'http://localhost:3000',
        apiBaseUrl: 'http://localhost:3001/api'
    },
    staging: {
        baseUrl: 'https://staging.example.com',
        apiBaseUrl: 'https://api-staging.example.com'
    },
    production: {
        baseUrl: 'https://example.com',
        apiBaseUrl: 'https://api.example.com'
    }
};
/**
 * Get environment-specific configuration
 * @param env - Environment name
 */
function getEnvironmentConfig(env = 'development') {
    return exports.environments[env] || exports.environments.development;
}
exports.getEnvironmentConfig = getEnvironmentConfig;
/**
 * Sample form data for testing
 */
exports.sampleFormData = {
    userRegistration: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        phoneNumber: '+1234567890',
        dateOfBirth: '1990-01-01'
    },
    contactForm: {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message for automation testing.'
    },
    searchQueries: [
        'automation',
        'playwright',
        'testing',
        'typescript',
        'e2e testing'
    ]
};
//# sourceMappingURL=testData.js.map