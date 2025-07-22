import { Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { ApiHelper } from '../../src/utils/ApiHelper';
import { UserCredentials, AuthToken } from '../../src/types';
/**
 * Authentication fixtures for test setup
 *
 * Provides pre-authenticated contexts and page objects
 * for tests that require user authentication.
 */
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
export declare const test: import("@playwright/test").TestType<import("@playwright/test").PlaywrightTestArgs & import("@playwright/test").PlaywrightTestOptions & AuthFixtures, import("@playwright/test").PlaywrightWorkerArgs & import("@playwright/test").PlaywrightWorkerOptions>;
/**
 * Authentication helper functions
 */
export declare class AuthHelper {
    /**
     * Login via API and return auth token
     * @param apiHelper - API helper instance
     * @param credentials - User credentials
     */
    static loginViaApi(apiHelper: ApiHelper, credentials: UserCredentials): Promise<AuthToken>;
    /**
     * Login via UI and return page
     * @param page - Browser page
     * @param context - Browser context
     * @param credentials - User credentials
     */
    static loginViaUI(page: Page, context: BrowserContext, credentials: UserCredentials): Promise<LoginPage>;
    /**
     * Setup authenticated browser context
     * @param browser - Browser instance
     * @param credentials - User credentials
     */
    static getAuthenticatedContext(browser: any, credentials: UserCredentials): Promise<BrowserContext>;
    /**
     * Logout via UI
     * @param page - Browser page
     */
    static logoutViaUI(page: Page): Promise<void>;
    /**
     * Logout via API
     * @param apiHelper - API helper instance
     */
    static logoutViaApi(apiHelper: ApiHelper): Promise<void>;
}
export { expect } from '@playwright/test';
//# sourceMappingURL=authFixtures.d.ts.map