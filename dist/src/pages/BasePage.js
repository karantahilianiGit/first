"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePage = void 0;
const test_1 = require("@playwright/test");
const Logger_1 = require("../utils/Logger");
/**
 * Base Page Object class that provides common functionality for all page objects
 *
 * This class implements the Page Object Model pattern and provides:
 * - Common navigation methods
 * - Element interaction utilities
 * - Waiting mechanisms
 * - Screenshot capabilities
 * - Logging functionality
 *
 * @example
 * ```typescript
 * class LoginPage extends BasePage {
 *   constructor(page: Page, context: BrowserContext) {
 *     super(page, context, '/login');
 *   }
 * }
 * ```
 */
class BasePage {
    page;
    context;
    url;
    logger;
    constructor(page, context, url) {
        this.page = page;
        this.context = context;
        this.url = url;
        this.logger = new Logger_1.Logger(this.constructor.name);
    }
    /**
     * Navigate to the page URL
     * @param url - Optional URL to navigate to (defaults to page URL)
     * @param options - Navigation options
     */
    async navigateTo(url, options) {
        const targetUrl = url || this.url;
        if (!targetUrl) {
            throw new Error('No URL provided for navigation');
        }
        this.logger.info(`Navigating to: ${targetUrl}`);
        await this.page.goto(targetUrl, {
            waitUntil: options?.waitUntil || 'networkidle',
            timeout: options?.timeout || 30000
        });
        await this.waitForPageLoad();
    }
    /**
     * Wait for page to be fully loaded
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
        this.logger.info('Page loaded successfully');
    }
    /**
     * Take a screenshot of the current page
     * @param name - Screenshot name
     */
    async takeScreenshot(name) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${name}-${timestamp}.png`;
        await this.page.screenshot({
            path: `screenshots/${filename}`,
            fullPage: true
        });
        this.logger.info(`Screenshot saved: ${filename}`);
    }
    /**
     * Wait for element to be visible
     * @param selector - Element selector
     * @param timeout - Wait timeout (default: 10000ms)
     */
    async waitForElement(selector, timeout = 10000) {
        await this.page.waitForSelector(selector, {
            state: 'visible',
            timeout
        });
    }
    /**
     * Wait for element to be hidden
     * @param selector - Element selector
     * @param timeout - Wait timeout (default: 10000ms)
     */
    async waitForElementToBeHidden(selector, timeout = 10000) {
        await this.page.waitForSelector(selector, {
            state: 'hidden',
            timeout
        });
    }
    /**
     * Click on an element
     * @param selector - Element selector
     * @param options - Click options
     */
    async clickElement(selector, options) {
        this.logger.info(`Clicking element: ${selector}`);
        await this.waitForElement(selector, options?.timeout);
        await this.page.click(selector, options);
    }
    /**
     * Fill input field
     * @param selector - Input selector
     * @param value - Value to fill
     * @param options - Fill options
     */
    async fillInput(selector, value, options) {
        this.logger.info(`Filling input ${selector} with: ${value}`);
        await this.waitForElement(selector, options?.timeout);
        await this.page.fill(selector, value);
    }
    /**
     * Get text content of an element
     * @param selector - Element selector
     * @param timeout - Wait timeout
     * @returns Element text content
     */
    async getElementText(selector, timeout) {
        await this.waitForElement(selector, timeout);
        const text = await this.page.textContent(selector);
        return text || '';
    }
    /**
     * Check if element is visible
     * @param selector - Element selector
     * @returns True if element is visible
     */
    async isElementVisible(selector) {
        try {
            return await this.page.isVisible(selector);
        }
        catch {
            return false;
        }
    }
    /**
     * Get current page URL
     * @returns Current URL
     */
    getCurrentUrl() {
        return this.page.url();
    }
    /**
     * Get page title
     * @returns Page title
     */
    async getPageTitle() {
        return await this.page.title();
    }
    /**
     * Scroll to element
     * @param selector - Element selector
     */
    async scrollToElement(selector) {
        await this.page.locator(selector).scrollIntoViewIfNeeded();
    }
    /**
     * Wait for and verify page title
     * @param expectedTitle - Expected page title
     * @param timeout - Wait timeout
     */
    async verifyPageTitle(expectedTitle, timeout = 10000) {
        await (0, test_1.expect)(this.page).toHaveTitle(expectedTitle, { timeout });
        this.logger.info(`Page title verified: ${expectedTitle}`);
    }
    /**
     * Wait for and verify URL contains text
     * @param urlPart - URL part to verify
     * @param timeout - Wait timeout
     */
    async verifyUrlContains(urlPart, timeout = 10000) {
        await (0, test_1.expect)(this.page).toHaveURL(new RegExp(urlPart), { timeout });
        this.logger.info(`URL verified to contain: ${urlPart}`);
    }
    /**
     * Close the current page
     */
    async closePage() {
        await this.page.close();
        this.logger.info('Page closed');
    }
    /**
     * Reload the current page
     */
    async reloadPage() {
        await this.page.reload();
        await this.waitForPageLoad();
        this.logger.info('Page reloaded');
    }
}
exports.BasePage = BasePage;
//# sourceMappingURL=BasePage.js.map