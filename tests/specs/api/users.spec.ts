import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../../src/utils/ApiHelper';
import { AuthHelper } from '../../fixtures/authFixtures';
import { testData } from '../../data/testData';

/**
 * Users API test suite
 * 
 * Tests API endpoints for user management:
 * - Get user profile
 * - Update user information
 * - User authentication
 * - Error handling
 */
test.describe('Users API', () => {
  let apiHelper: ApiHelper;

  test.beforeEach(async ({ request }) => {
    apiHelper = new ApiHelper(request);
  });

  test.describe('Authenticated API calls', () => {
    test.beforeEach(async () => {
      // Authenticate before each test
      await AuthHelper.loginViaApi(apiHelper, testData.users.standardUser);
    });

    test('should get user profile', async () => {
      await test.step('Request user profile', async () => {
        const response = await apiHelper.get('/api/profile');
        
        await apiHelper.validateStatus(response, 200);
        await apiHelper.validateSchema(response, ['id', 'username', 'email']);
        
        expect(response.data.username).toBe(testData.users.standardUser.username);
      });
    });

    test('should update user profile', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'User'
      };

      await test.step('Update user profile', async () => {
        const response = await apiHelper.put('/api/profile', updateData);
        
        await apiHelper.validateStatus(response, 200);
        await apiHelper.validateResponseData(response, updateData);
      });
    });

    test('should get list of users (admin only)', async () => {
      // First logout and login as admin
      await AuthHelper.logoutViaApi(apiHelper);
      await AuthHelper.loginViaApi(apiHelper, testData.users.admin);

      await test.step('Get users list', async () => {
        const response = await apiHelper.get('/api/users');
        
        await apiHelper.validateStatus(response, 200);
        expect(Array.isArray(response.data)).toBeTruthy();
        expect(response.data.length).toBeGreaterThan(0);
      });
    });
  });

  test.describe('Unauthenticated API calls', () => {
    test('should return 401 for protected endpoints', async () => {
      await test.step('Access protected endpoint without auth', async () => {
        const response = await apiHelper.get('/api/profile');
        await apiHelper.validateStatus(response, 401);
      });
    });
  });

  test.describe('Authentication API', () => {
    test('should authenticate user successfully', async () => {
      await test.step('Login via API', async () => {
        const response = await apiHelper.post('/api/auth/login', {
          username: testData.users.standardUser.username,
          password: testData.users.standardUser.password
        });

        await apiHelper.validateStatus(response, 200);
        await apiHelper.validateSchema(response, ['accessToken', 'tokenType', 'expiresIn']);
        
        expect(response.data.tokenType).toBe('Bearer');
        expect(response.data.expiresIn).toBeGreaterThan(0);
      });
    });

    test('should reject invalid credentials', async () => {
      await test.step('Login with invalid credentials', async () => {
        const response = await apiHelper.post('/api/auth/login', {
          username: 'invalid@example.com',
          password: 'wrongpassword'
        });

        await apiHelper.validateStatus(response, 401);
      });
    });

    test('should refresh authentication token', async () => {
      let refreshToken: string;

      await test.step('Login to get refresh token', async () => {
        const loginResponse = await apiHelper.post('/api/auth/login', {
          username: testData.users.standardUser.username,
          password: testData.users.standardUser.password
        });

        refreshToken = loginResponse.data.refreshToken;
        expect(refreshToken).toBeDefined();
      });

      await test.step('Refresh token', async () => {
        const response = await apiHelper.post('/api/auth/refresh', {
          refreshToken
        });

        await apiHelper.validateStatus(response, 200);
        await apiHelper.validateSchema(response, ['accessToken', 'tokenType']);
      });
    });
  });

  test.describe('Error handling', () => {
    test('should handle malformed requests', async () => {
      await test.step('Send malformed data', async () => {
        const response = await apiHelper.post('/api/auth/login', 'invalid-json');
        await apiHelper.validateStatus(response, 400);
      });
    });

    test('should handle non-existent endpoints', async () => {
      await test.step('Access non-existent endpoint', async () => {
        const response = await apiHelper.get('/api/nonexistent');
        await apiHelper.validateStatus(response, 404);
      });
    });
  });
});
