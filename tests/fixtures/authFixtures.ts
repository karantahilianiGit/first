import { test as base, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { ApiHelper } from '../../src/utils/ApiHelper';
import { testData } from '../data/testData';
import { UserCredentials, AuthToken } from '../../src/types';

/**
 * Authentication fixtures for test setup
 * 
 * Provides pre-authenticated contexts and page objects
 * for tests that require user authentication.
 */

// Extend base test with custom fixtures
type AuthFixtures = {
  loginPage: LoginPage;
  apiHelper: ApiHelper;
  authenticatedPage: Page;
  authenticatedContext: BrowserContext;
  adminUser: UserCredentials;
  standardUser: UserCredentials;
};

/**
 * Extended test with authentication fixtures
 */
export const test = base.extend<AuthFixtures>({
  // Login page fixture
  loginPage: async ({ page, context }, use) => {
    const loginPage = new LoginPage(page, context);
    await use(loginPage);
  },

  // API helper fixture
  apiHelper: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request);
    await use(apiHelper);
  },

  // Admin user fixture
  adminUser: async ({}, use) => {
    await use(testData.users.admin);
  },

  // Standard user fixture
  standardUser: async ({}, use) => {
    await use(testData.users.standardUser);
  },

  // Authenticated page fixture (logs in as standard user)
  authenticatedPage: async ({ browser, standardUser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to login and authenticate
    const loginPage = new LoginPage(page, context);
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
    const loginPage = new LoginPage(page, context);
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
export class AuthHelper {
  /**
   * Login via API and return auth token
   * @param apiHelper - API helper instance
   * @param credentials - User credentials
   */
  static async loginViaApi(apiHelper: ApiHelper, credentials: UserCredentials): Promise<AuthToken> {
    return await apiHelper.authenticate(testData.apiEndpoints.login, {
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
  static async loginViaUI(
    page: Page, 
    context: BrowserContext, 
    credentials: UserCredentials
  ): Promise<LoginPage> {
    const loginPage = new LoginPage(page, context);
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
  static async getAuthenticatedContext(
    browser: any, 
    credentials: UserCredentials
  ): Promise<BrowserContext> {
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
  static async logoutViaUI(page: Page): Promise<void> {
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
  static async logoutViaApi(apiHelper: ApiHelper): Promise<void> {
    await apiHelper.post(testData.apiEndpoints.logout);
    apiHelper.clearAuth();
  }
}

export { expect } from '@playwright/test';
