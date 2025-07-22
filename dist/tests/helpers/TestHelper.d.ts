import { Page, BrowserContext } from '@playwright/test';
/**
 * Test Helper class with common testing utilities
 *
 * Provides utility functions for:
 * - Data generation
 * - Browser manipulation
 * - File handling
 * - Test setup/teardown
 */
export declare class TestHelper {
    private static logger;
    /**
     * Generate random string
     * @param length - String length
     * @param prefix - Optional prefix
     */
    static generateRandomString(length?: number, prefix?: string): string;
    /**
     * Generate random email
     * @param domain - Email domain
     */
    static generateRandomEmail(domain?: string): string;
    /**
     * Generate random phone number
     */
    static generateRandomPhoneNumber(): string;
    /**
     * Wait for specified time
     * @param ms - Milliseconds to wait
     */
    static wait(ms: number): Promise<void>;
    /**
     * Get current timestamp
     */
    static getCurrentTimestamp(): string;
    /**
     * Create unique test identifier
     * @param testName - Test name
     */
    static createTestId(testName: string): string;
    /**
     * Setup test data directory
     * @param testId - Test identifier
     */
    static setupTestDirectory(testId: string): Promise<string>;
    /**
     * Take full page screenshot
     * @param page - Browser page
     * @param name - Screenshot name
     * @param testDir - Test directory
     */
    static takeFullPageScreenshot(page: Page, name: string, testDir?: string): Promise<string>;
    /**
     * Take element screenshot
     * @param page - Browser page
     * @param selector - Element selector
     * @param name - Screenshot name
     * @param testDir - Test directory
     */
    static takeElementScreenshot(page: Page, selector: string, name: string, testDir?: string): Promise<string>;
    /**
     * Clear browser storage
     * @param page - Browser page
     */
    static clearBrowserStorage(page: Page): Promise<void>;
    /**
     * Set local storage item
     * @param page - Browser page
     * @param key - Storage key
     * @param value - Storage value
     */
    static setLocalStorageItem(page: Page, key: string, value: string): Promise<void>;
    /**
     * Get local storage item
     * @param page - Browser page
     * @param key - Storage key
     */
    static getLocalStorageItem(page: Page, key: string): Promise<string | null>;
    /**
     * Simulate slow network
     * @param context - Browser context
     */
    static simulateSlowNetwork(context: BrowserContext): Promise<void>;
    /**
     * Simulate network offline
     * @param context - Browser context
     */
    static simulateOfflineNetwork(context: BrowserContext): Promise<void>;
    /**
     * Reset network simulation
     * @param context - Browser context
     */
    static resetNetworkSimulation(context: BrowserContext): Promise<void>;
    /**
     * Get page performance metrics
     * @param page - Browser page
     */
    static getPerformanceMetrics(page: Page): Promise<any>;
}
//# sourceMappingURL=TestHelper.d.ts.map