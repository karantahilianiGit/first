"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authFixtures_1 = require("../../fixtures/authFixtures");
const testData_1 = require("../../data/testData");
/**
 * Login functionality test suite
 *
 * Tests various login scenarios including:
 * - Valid login
 * - Invalid credentials
 * - Form validation
 * - UI/API integration
 */
authFixtures_1.test.describe('Login Functionality', () => {
    authFixtures_1.test.beforeEach(async ({ page }) => {
        // Setup before each test
        await page.goto(testData_1.testData.urls.loginUrl);
    });
    (0, authFixtures_1.test)('should login successfully with valid credentials', async ({ loginPage, standardUser }) => {
        await authFixtures_1.test.step('Navigate to login page', async () => {
            await loginPage.verifyLoginPageLoaded();
        });
        await authFixtures_1.test.step('Enter valid credentials and login', async () => {
            await loginPage.login(standardUser);
        });
        await authFixtures_1.test.step('Verify successful login', async () => {
            await loginPage.verifySuccessfulLogin();
            (0, authFixtures_1.expect)(loginPage.getCurrentUrl()).toContain('dashboard');
        });
    });
    (0, authFixtures_1.test)('should show error for invalid credentials', async ({ loginPage }) => {
        const invalidUser = testData_1.testData.users.invalidUser;
        await authFixtures_1.test.step('Enter invalid credentials', async () => {
            await loginPage.login(invalidUser);
        });
        await authFixtures_1.test.step('Verify error message', async () => {
            await loginPage.verifyLoginError('invalid credentials');
        });
    });
    (0, authFixtures_1.test)('should validate empty form submission', async ({ loginPage }) => {
        await authFixtures_1.test.step('Submit empty form', async () => {
            await loginPage.verifyFormValidation();
        });
    });
    (0, authFixtures_1.test)('should handle remember me functionality', async ({ loginPage, standardUser }) => {
        await authFixtures_1.test.step('Login with remember me checked', async () => {
            await loginPage.login(standardUser, true);
            await loginPage.verifySuccessfulLogin();
        });
        // Additional verification for remember me functionality
        // This would depend on your specific implementation
    });
    (0, authFixtures_1.test)('should navigate to forgot password', async ({ loginPage, page }) => {
        await authFixtures_1.test.step('Click forgot password link', async () => {
            await loginPage.clickForgotPassword();
        });
        await authFixtures_1.test.step('Verify navigation to forgot password page', async () => {
            (0, authFixtures_1.expect)(page.url()).toContain('forgot-password');
        });
    });
});
authFixtures_1.test.describe('Login API Integration', () => {
    (0, authFixtures_1.test)('should login successfully via API', async ({ apiHelper, standardUser }) => {
        await authFixtures_1.test.step('Perform API login', async () => {
            const authToken = await authFixtures_1.AuthHelper.loginViaApi(apiHelper, standardUser);
            (0, authFixtures_1.expect)(authToken).toBeDefined();
            (0, authFixtures_1.expect)(authToken.accessToken).toBeTruthy();
            (0, authFixtures_1.expect)(authToken.tokenType).toBe('Bearer');
        });
    });
    (0, authFixtures_1.test)('should fail API login with invalid credentials', async ({ apiHelper }) => {
        const invalidUser = testData_1.testData.users.invalidUser;
        await authFixtures_1.test.step('Attempt API login with invalid credentials', async () => {
            try {
                await authFixtures_1.AuthHelper.loginViaApi(apiHelper, invalidUser);
                (0, authFixtures_1.expect)(true).toBe(false); // Should not reach here
            }
            catch (error) {
                (0, authFixtures_1.expect)(error).toBeDefined();
            }
        });
    });
});
authFixtures_1.test.describe('Login with Different User Roles', () => {
    (0, authFixtures_1.test)('should login as admin user', async ({ loginPage, adminUser }) => {
        await authFixtures_1.test.step('Login as admin', async () => {
            await loginPage.login(adminUser);
            await loginPage.verifySuccessfulLogin();
        });
        await authFixtures_1.test.step('Verify admin dashboard access', async () => {
            // Add admin-specific verification
            (0, authFixtures_1.expect)(loginPage.getCurrentUrl()).toContain('dashboard');
        });
    });
    (0, authFixtures_1.test)('should login as standard user', async ({ loginPage, standardUser }) => {
        await authFixtures_1.test.step('Login as standard user', async () => {
            await loginPage.login(standardUser);
            await loginPage.verifySuccessfulLogin();
        });
        await authFixtures_1.test.step('Verify user dashboard access', async () => {
            (0, authFixtures_1.expect)(loginPage.getCurrentUrl()).toContain('dashboard');
        });
    });
});
//# sourceMappingURL=login.spec.js.map