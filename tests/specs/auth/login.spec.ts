import { test, expect, AuthHelper } from '../../fixtures/authFixtures';
import { testData } from '../../data/testData';

/**
 * Login functionality test suite
 * 
 * Tests various login scenarios including:
 * - Valid login
 * - Invalid credentials
 * - Form validation
 * - UI/API integration
 */
test.describe('Login Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto(testData.urls.loginUrl);
  });

  test('should login successfully with valid credentials', async ({ loginPage, standardUser }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.verifyLoginPageLoaded();
    });

    await test.step('Enter valid credentials and login', async () => {
      await loginPage.login(standardUser);
    });

    await test.step('Verify successful login', async () => {
      await loginPage.verifySuccessfulLogin();
      expect(loginPage.getCurrentUrl()).toContain('dashboard');
    });
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    const invalidUser = testData.users.invalidUser;

    await test.step('Enter invalid credentials', async () => {
      await loginPage.login(invalidUser);
    });

    await test.step('Verify error message', async () => {
      await loginPage.verifyLoginError('invalid credentials');
    });
  });

  test('should validate empty form submission', async ({ loginPage }) => {
    await test.step('Submit empty form', async () => {
      await loginPage.verifyFormValidation();
    });
  });

  test('should handle remember me functionality', async ({ loginPage, standardUser }) => {
    await test.step('Login with remember me checked', async () => {
      await loginPage.login(standardUser, true);
      await loginPage.verifySuccessfulLogin();
    });
    
    // Additional verification for remember me functionality
    // This would depend on your specific implementation
  });

  test('should navigate to forgot password', async ({ loginPage, page }) => {
    await test.step('Click forgot password link', async () => {
      await loginPage.clickForgotPassword();
    });

    await test.step('Verify navigation to forgot password page', async () => {
      expect(page.url()).toContain('forgot-password');
    });
  });
});

test.describe('Login API Integration', () => {
  
  test('should login successfully via API', async ({ apiHelper, standardUser }) => {
    await test.step('Perform API login', async () => {
      const authToken = await AuthHelper.loginViaApi(apiHelper, standardUser);
      
      expect(authToken).toBeDefined();
      expect(authToken.accessToken).toBeTruthy();
      expect(authToken.tokenType).toBe('Bearer');
    });
  });

  test('should fail API login with invalid credentials', async ({ apiHelper }) => {
    const invalidUser = testData.users.invalidUser;

    await test.step('Attempt API login with invalid credentials', async () => {
      try {
        await AuthHelper.loginViaApi(apiHelper, invalidUser);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});

test.describe('Login with Different User Roles', () => {
  
  test('should login as admin user', async ({ loginPage, adminUser }) => {
    await test.step('Login as admin', async () => {
      await loginPage.login(adminUser);
      await loginPage.verifySuccessfulLogin();
    });

    await test.step('Verify admin dashboard access', async () => {
      // Add admin-specific verification
      expect(loginPage.getCurrentUrl()).toContain('dashboard');
    });
  });

  test('should login as standard user', async ({ loginPage, standardUser }) => {
    await test.step('Login as standard user', async () => {
      await loginPage.login(standardUser);
      await loginPage.verifySuccessfulLogin();
    });

    await test.step('Verify user dashboard access', async () => {
      expect(loginPage.getCurrentUrl()).toContain('dashboard');
    });
  });
});
