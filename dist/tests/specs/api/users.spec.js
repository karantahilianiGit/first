"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const ApiHelper_1 = require("../../../src/utils/ApiHelper");
const authFixtures_1 = require("../../fixtures/authFixtures");
const testData_1 = require("../../data/testData");
/**
 * Users API test suite
 *
 * Tests API endpoints for user management:
 * - Get user profile
 * - Update user information
 * - User authentication
 * - Error handling
 */
test_1.test.describe('Users API', () => {
    let apiHelper;
    test_1.test.beforeEach(async ({ request }) => {
        apiHelper = new ApiHelper_1.ApiHelper(request);
    });
    test_1.test.describe('Authenticated API calls', () => {
        test_1.test.beforeEach(async () => {
            // Authenticate before each test
            await authFixtures_1.AuthHelper.loginViaApi(apiHelper, testData_1.testData.users.standardUser);
        });
        (0, test_1.test)('should get user profile', async () => {
            await test_1.test.step('Request user profile', async () => {
                const response = await apiHelper.get('/api/profile');
                await apiHelper.validateStatus(response, 200);
                await apiHelper.validateSchema(response, ['id', 'username', 'email']);
                (0, test_1.expect)(response.data.username).toBe(testData_1.testData.users.standardUser.username);
            });
        });
        (0, test_1.test)('should update user profile', async () => {
            const updateData = {
                firstName: 'Updated',
                lastName: 'User'
            };
            await test_1.test.step('Update user profile', async () => {
                const response = await apiHelper.put('/api/profile', updateData);
                await apiHelper.validateStatus(response, 200);
                await apiHelper.validateResponseData(response, updateData);
            });
        });
        (0, test_1.test)('should get list of users (admin only)', async () => {
            // First logout and login as admin
            await authFixtures_1.AuthHelper.logoutViaApi(apiHelper);
            await authFixtures_1.AuthHelper.loginViaApi(apiHelper, testData_1.testData.users.admin);
            await test_1.test.step('Get users list', async () => {
                const response = await apiHelper.get('/api/users');
                await apiHelper.validateStatus(response, 200);
                (0, test_1.expect)(Array.isArray(response.data)).toBeTruthy();
                (0, test_1.expect)(response.data.length).toBeGreaterThan(0);
            });
        });
    });
    test_1.test.describe('Unauthenticated API calls', () => {
        (0, test_1.test)('should return 401 for protected endpoints', async () => {
            await test_1.test.step('Access protected endpoint without auth', async () => {
                const response = await apiHelper.get('/api/profile');
                await apiHelper.validateStatus(response, 401);
            });
        });
    });
    test_1.test.describe('Authentication API', () => {
        (0, test_1.test)('should authenticate user successfully', async () => {
            await test_1.test.step('Login via API', async () => {
                const response = await apiHelper.post('/api/auth/login', {
                    username: testData_1.testData.users.standardUser.username,
                    password: testData_1.testData.users.standardUser.password
                });
                await apiHelper.validateStatus(response, 200);
                await apiHelper.validateSchema(response, ['accessToken', 'tokenType', 'expiresIn']);
                (0, test_1.expect)(response.data.tokenType).toBe('Bearer');
                (0, test_1.expect)(response.data.expiresIn).toBeGreaterThan(0);
            });
        });
        (0, test_1.test)('should reject invalid credentials', async () => {
            await test_1.test.step('Login with invalid credentials', async () => {
                const response = await apiHelper.post('/api/auth/login', {
                    username: 'invalid@example.com',
                    password: 'wrongpassword'
                });
                await apiHelper.validateStatus(response, 401);
            });
        });
        (0, test_1.test)('should refresh authentication token', async () => {
            let refreshToken;
            await test_1.test.step('Login to get refresh token', async () => {
                const loginResponse = await apiHelper.post('/api/auth/login', {
                    username: testData_1.testData.users.standardUser.username,
                    password: testData_1.testData.users.standardUser.password
                });
                refreshToken = loginResponse.data.refreshToken;
                (0, test_1.expect)(refreshToken).toBeDefined();
            });
            await test_1.test.step('Refresh token', async () => {
                const response = await apiHelper.post('/api/auth/refresh', {
                    refreshToken
                });
                await apiHelper.validateStatus(response, 200);
                await apiHelper.validateSchema(response, ['accessToken', 'tokenType']);
            });
        });
    });
    test_1.test.describe('Error handling', () => {
        (0, test_1.test)('should handle malformed requests', async () => {
            await test_1.test.step('Send malformed data', async () => {
                const response = await apiHelper.post('/api/auth/login', 'invalid-json');
                await apiHelper.validateStatus(response, 400);
            });
        });
        (0, test_1.test)('should handle non-existent endpoints', async () => {
            await test_1.test.step('Access non-existent endpoint', async () => {
                const response = await apiHelper.get('/api/nonexistent');
                await apiHelper.validateStatus(response, 404);
            });
        });
    });
});
//# sourceMappingURL=users.spec.js.map