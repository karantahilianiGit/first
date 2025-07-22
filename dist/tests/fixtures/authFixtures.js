"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expect = exports.AuthHelper = exports.test = void 0;
const test_1 = require("@playwright/test");
const LoginPage_1 = require("../../src/pages/LoginPage");
const ApiHelper_1 = require("../../src/utils/ApiHelper");
const testData_1 = require("../data/testData");
/**
 * Extended test with authentication fixtures
 */
exports.test = test_1.test.extend({
    // Login page fixture
    loginPage: async ({ page, context }, use) => {
        const loginPage = new LoginPage_1.LoginPage(page, context);
        await use(loginPage);
    },
    // API helper fixture
    apiHelper: async ({ request }, use) => {
        const apiHelper = new ApiHelper_1.ApiHelper(request);
        await use(apiHelper);
    },
    // Admin user fixture
    adminUser: async ({}, use) => {
        await use(testData_1.testData.users.admin);
    },
    // Standard user fixture
    standardUser: async ({}, use) => {
        await use(testData_1.testData.users.standardUser);
    },
    // Authenticated page fixture (logs in as standard user)
    authenticatedPage: async ({ browser, standardUser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        // Navigate to login and authenticate
        const loginPage = new LoginPage_1.LoginPage(page, context);
        await loginPage.navigateToLogin();
        await loginPage.login(standardUser);
        await loginPage.verifySuccessfulLogin();
        await use(page);
        await context.close();
    },
    // Authenticated context fixture
    authenticatedContext: async ({ browser, standardUser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        // Perform login to get authenticated context
        const loginPage = new LoginPage_1.LoginPage(page, context);
        await loginPage.navigateToLogin();
        await loginPage.login(standardUser);
        await loginPage.verifySuccessfulLogin();
        await page.close();
        await use(context);
        await context.close();
    }
});
/**
 * Authentication helper functions
 */
class AuthHelper {
    /**
     * Login via API and return auth token
     * @param apiHelper - API helper instance
     * @param credentials - User credentials
     */
    static async loginViaApi(apiHelper, credentials) {
        return await apiHelper.authenticate(testData_1.testData.apiEndpoints.login, {
            username: credentials.username,
            password: credentials.password
        });
    }
    /**
     * Login via UI and return page
     * @param page - Browser page
     * @param context - Browser context
     * @param credentials - User credentials
     */
    static async loginViaUI(page, context, credentials) {
        const loginPage = new LoginPage_1.LoginPage(page, context);
        await loginPage.navigateToLogin();
        await loginPage.login(credentials);
        await loginPage.verifySuccessfulLogin();
        return loginPage;
    }
    /**
     * Setup authenticated browser context
     * @param browser - Browser instance
     * @param credentials - User credentials
     */
    static async getAuthenticatedContext(browser, credentials) {
        const context = await browser.newContext();
        const page = await context.newPage();
        await this.loginViaUI(page, context, credentials);
        await page.close();
        return context;
    }
    /**
     * Logout via UI
     * @param page - Browser page
     */
    static async logoutViaUI(page) {
        // Add logout logic here based on your application
        // Example: await page.click('[data-testid="logout-button"]');
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
    }
    /**
     * Logout via API
     * @param apiHelper - API helper instance
     */
    static async logoutViaApi(apiHelper) {
        await apiHelper.post(testData_1.testData.apiEndpoints.logout);
        apiHelper.clearAuth();
    }
}
exports.AuthHelper = AuthHelper;
var test_2 = require("@playwright/test");
Object.defineProperty(exports, "expect", { enumerable: true, get: function () { return test_2.expect; } });
//# sourceMappingURL=authFixtures.js.map