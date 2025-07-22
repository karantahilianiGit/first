import { Page, BrowserContext } from '@playwright/test';
import { PageObject, NavigationOptions } from '../types';
import { Logger } from '../utils/Logger';
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
export declare abstract class BasePage implements PageObject {
    page: Page;
    context: BrowserContext;
    protected url?: string | undefined;
    protected logger: Logger;
    constructor(page: Page, context: BrowserContext, url?: string | undefined);
    /**
     * Navigate to the page URL
     * @param url - Optional URL to navigate to (defaults to page URL)
     * @param options - Navigation options
     */
    navigateTo(url?: string, options?: NavigationOptions): Promise<void>;
    /**
     * Wait for page to be fully loaded
     */
    waitForPageLoad(): Promise<void>;
    /**
     * Take a screenshot of the current page
     * @param name - Screenshot name
     */
    takeScreenshot(name: string): Promise<void>;
    /**
     * Wait for element to be visible
     * @param selector - Element selector
     * @param timeout - Wait timeout (default: 10000ms)
     */
    waitForElement(selector: string, timeout?: number): Promise<void>;
    /**
     * Wait for element to be hidden
     * @param selector - Element selector
     * @param timeout - Wait timeout (default: 10000ms)
     */
    waitForElementToBeHidden(selector: string, timeout?: number): Promise<void>;
    /**
     * Click on an element
     * @param selector - Element selector
     * @param options - Click options
     */
    clickElement(selector: string, options?: {
        timeout?: number;
        force?: boolean;
    }): Promise<void>;
    /**
     * Fill input field
     * @param selector - Input selector
     * @param value - Value to fill
     * @param options - Fill options
     */
    fillInput(selector: string, value: string, options?: {
        timeout?: number;
    }): Promise<void>;
    /**
     * Get text content of an element
     * @param selector - Element selector
     * @param timeout - Wait timeout
     * @returns Element text content
     */
    getElementText(selector: string, timeout?: number): Promise<string>;
    /**
     * Check if element is visible
     * @param selector - Element selector
     * @returns True if element is visible
     */
    isElementVisible(selector: string): Promise<boolean>;
    /**
     * Get current page URL
     * @returns Current URL
     */
    getCurrentUrl(): string;
    /**
     * Get page title
     * @returns Page title
     */
    getPageTitle(): Promise<string>;
    /**
     * Scroll to element
     * @param selector - Element selector
     */
    scrollToElement(selector: string): Promise<void>;
    /**
     * Wait for and verify page title
     * @param expectedTitle - Expected page title
     * @param timeout - Wait timeout
     */
    verifyPageTitle(expectedTitle: string, timeout?: number): Promise<void>;
    /**
     * Wait for and verify URL contains text
     * @param urlPart - URL part to verify
     * @param timeout - Wait timeout
     */
    verifyUrlContains(urlPart: string, timeout?: number): Promise<void>;
    /**
     * Close the current page
     */
    closePage(): Promise<void>;
    /**
     * Reload the current page
     */
    reloadPage(): Promise<void>;
}
//# sourceMappingURL=BasePage.d.ts.map