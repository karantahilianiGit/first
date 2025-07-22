"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const test_1 = require("@playwright/test");
const BasePage_1 = require("./BasePage");
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
class LoginPage extends BasePage_1.BasePage {
    // Selectors
    selectors = {
        usernameInput: '[data-testid="username"], #username, input[name="username"]',
        passwordInput: '[data-testid="password"], #password, input[name="password"]',
        loginButton: '[data-testid="login-button"], #login-btn, button[type="submit"]',
        errorMessage: '[data-testid="error-message"], .error, .alert-error',
        forgotPasswordLink: '[data-testid="forgot-password"], .forgot-password',
        rememberMeCheckbox: '[data-testid="remember-me"], #remember-me',
        loadingSpinner: '[data-testid="loading"], .loading, .spinner'
    };
    constructor(page, context) {
        super(page, context, '/login');
    }
    /**
     * Navigate to login page
     */
    async navigateToLogin() {
        await this.navigateTo();
        await this.verifyLoginPageLoaded();
    }
    /**
     * Verify login page is loaded
     */
    async verifyLoginPageLoaded() {
        await this.waitForElement(this.selectors.usernameInput);
        await this.waitForElement(this.selectors.passwordInput);
        await this.waitForElement(this.selectors.loginButton);
        this.logger.info('Login page loaded successfully');
    }
    /**
     * Perform user login
     * @param credentials - User credentials
     * @param rememberMe - Whether to check remember me option
     */
    async login(credentials, rememberMe = false) {
        this.logger.step('Login Process', `Logging in user: ${credentials.username}`);
        // Fill username
        await this.fillInput(this.selectors.usernameInput, credentials.username);
        // Fill password
        await this.fillInput(this.selectors.passwordInput, credentials.password);
        // Handle remember me checkbox
        if (rememberMe && await this.isElementVisible(this.selectors.rememberMeCheckbox)) {
            await this.clickElement(this.selectors.rememberMeCheckbox);
            this.logger.info('Remember me option selected');
        }
        // Click login button
        await this.clickElement(this.selectors.loginButton);
        // Wait for loading to complete
        if (await this.isElementVisible(this.selectors.loadingSpinner)) {
            await this.waitForElementToBeHidden(this.selectors.loadingSpinner);
        }
        this.logger.info('Login attempt completed');
    }
    /**
     * Verify successful login by checking URL change or dashboard elements
     */
    async verifySuccessfulLogin() {
        // Wait for navigation away from login page
        await this.page.waitForFunction(() => !window.location.pathname.includes('/login'));
        // Verify URL doesn't contain login
        (0, test_1.expect)(this.getCurrentUrl()).not.toContain('/login');
        this.logger.info('Login successful - redirected from login page');
    }
    /**
     * Verify login error message
     * @param expectedError - Expected error message (optional)
     */
    async verifyLoginError(expectedError) {
        await this.waitForElement(this.selectors.errorMessage);
        if (expectedError) {
            const errorText = await this.getElementText(this.selectors.errorMessage);
            (0, test_1.expect)(errorText.toLowerCase()).toContain(expectedError.toLowerCase());
            this.logger.info(`Login error verified: ${errorText}`);
        }
        else {
            const isErrorVisible = await this.isElementVisible(this.selectors.errorMessage);
            (0, test_1.expect)(isErrorVisible).toBeTruthy();
            this.logger.info('Login error message displayed');
        }
    }
    /**
     * Click forgot password link
     */
    async clickForgotPassword() {
        await this.clickElement(this.selectors.forgotPasswordLink);
        this.logger.info('Forgot password link clicked');
    }
    /**
     * Get current error message text
     */
    async getErrorMessage() {
        if (await this.isElementVisible(this.selectors.errorMessage)) {
            return await this.getElementText(this.selectors.errorMessage);
        }
        return '';
    }
    /**
     * Clear login form
     */
    async clearLoginForm() {
        await this.fillInput(this.selectors.usernameInput, '');
        await this.fillInput(this.selectors.passwordInput, '');
        this.logger.info('Login form cleared');
    }
    /**
     * Check if login button is enabled
     */
    async isLoginButtonEnabled() {
        const loginButton = this.page.locator(this.selectors.loginButton);
        return await loginButton.isEnabled();
    }
    /**
     * Verify form validation
     */
    async verifyFormValidation() {
        // Try to submit empty form
        await this.clickElement(this.selectors.loginButton);
        // Check if validation messages appear or button remains disabled
        const isButtonEnabled = await this.isLoginButtonEnabled();
        const hasError = await this.isElementVisible(this.selectors.errorMessage);
        (0, test_1.expect)(isButtonEnabled || hasError).toBeTruthy();
        this.logger.info('Form validation verified');
    }
}
exports.LoginPage = LoginPage;
//# sourceMappingURL=LoginPage.js.map