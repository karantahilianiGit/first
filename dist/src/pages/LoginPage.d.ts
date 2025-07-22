import { Page, BrowserContext } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserCredentials } from '../types';
/**
 * Login Page Object
 *
 * Handles all login-related functionality including:
 * - User authentication
 * - Form validation
 * - Error handling
 * - Navigation after login
 *
 * @example
 * ```typescript
 * const loginPage = new LoginPage(page, context);
 * await loginPage.login({ username: 'testuser', password: 'password123' });
 * ```
 */
export declare class LoginPage extends BasePage {
    private readonly selectors;
    constructor(page: Page, context: BrowserContext);
    /**
     * Navigate to login page
     */
    navigateToLogin(): Promise<void>;
    /**
     * Verify login page is loaded
     */
    verifyLoginPageLoaded(): Promise<void>;
    /**
     * Perform user login
     * @param credentials - User credentials
     * @param rememberMe - Whether to check remember me option
     */
    login(credentials: UserCredentials, rememberMe?: boolean): Promise<void>;
    /**
     * Verify successful login by checking URL change or dashboard elements
     */
    verifySuccessfulLogin(): Promise<void>;
    /**
     * Verify login error message
     * @param expectedError - Expected error message (optional)
     */
    verifyLoginError(expectedError?: string): Promise<void>;
    /**
     * Click forgot password link
     */
    clickForgotPassword(): Promise<void>;
    /**
     * Get current error message text
     */
    getErrorMessage(): Promise<string>;
    /**
     * Clear login form
     */
    clearLoginForm(): Promise<void>;
    /**
     * Check if login button is enabled
     */
    isLoginButtonEnabled(): Promise<boolean>;
    /**
     * Verify form validation
     */
    verifyFormValidation(): Promise<void>;
}
//# sourceMappingURL=LoginPage.d.ts.map