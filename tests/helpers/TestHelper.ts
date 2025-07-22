import { Page, BrowserContext } from '@playwright/test';
import { Logger } from '../../src/utils/Logger';

/**
 * Test Helper class with common testing utilities
 * 
 * Provides utility functions for:
 * - Data generation
 * - Browser manipulation
 * - File handling
 * - Test setup/teardown
 */
export class TestHelper {
  private static logger = new Logger('TestHelper');

  /**
   * Generate random string
   * @param length - String length
   * @param prefix - Optional prefix
   */
  static generateRandomString(length: number = 10, prefix: string = ''): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = prefix;
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Generate random email
   * @param domain - Email domain
   */
  static generateRandomEmail(domain: string = 'example.com'): string {
    const username = this.generateRandomString(8);
    return `${username}@${domain}`;
  }

  /**
   * Generate random phone number
   */
  static generateRandomPhoneNumber(): string {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const firstThree = Math.floor(Math.random() * 900) + 100;
    const lastFour = Math.floor(Math.random() * 9000) + 1000;
    
    return `+1${areaCode}${firstThree}${lastFour}`;
  }

  /**
   * Wait for specified time
   * @param ms - Milliseconds to wait
   */
  static async wait(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current timestamp
   */
  static getCurrentTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  /**
   * Create unique test identifier
   * @param testName - Test name
   */
  static createTestId(testName: string): string {
    const timestamp = this.getCurrentTimestamp();
    const sanitizedName = testName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    return `${sanitizedName}-${timestamp}`;
  }

  /**
   * Setup test data directory
   * @param testId - Test identifier
   */
  static async setupTestDirectory(testId: string): Promise<string> {
    const fs = require('fs').promises;
    const path = require('path');
    
    const testDir = path.join('test-results', testId);
    
    try {
      await fs.mkdir(testDir, { recursive: true });
      this.logger.info(`Test directory created: ${testDir}`);
      return testDir;
    } catch (error) {
      this.logger.error('Failed to create test directory', error as Error);
      throw error;
    }
  }

  /**
   * Take full page screenshot
   * @param page - Browser page
   * @param name - Screenshot name
   * @param testDir - Test directory
   */
  static async takeFullPageScreenshot(
    page: Page, 
    name: string, 
    testDir?: string
  ): Promise<string> {
    const timestamp = this.getCurrentTimestamp();
    const filename = `${name}-${timestamp}.png`;
    const screenshotPath = testDir ? `${testDir}/${filename}` : `screenshots/${filename}`;
    
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true 
    });
    
    this.logger.info(`Full page screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  /**
   * Take element screenshot
   * @param page - Browser page
   * @param selector - Element selector
   * @param name - Screenshot name
   * @param testDir - Test directory
   */
  static async takeElementScreenshot(
    page: Page, 
    selector: string, 
    name: string, 
    testDir?: string
  ): Promise<string> {
    const timestamp = this.getCurrentTimestamp();
    const filename = `${name}-element-${timestamp}.png`;
    const screenshotPath = testDir ? `${testDir}/${filename}` : `screenshots/${filename}`;
    
    await page.locator(selector).screenshot({ path: screenshotPath });
    
    this.logger.info(`Element screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  /**
   * Clear browser storage
   * @param page - Browser page
   */
  static async clearBrowserStorage(page: Page): Promise<void> {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Clear cookies
    const context = page.context();
    await context.clearCookies();
    
    this.logger.info('Browser storage cleared');
  }

  /**
   * Set local storage item
   * @param page - Browser page
   * @param key - Storage key
   * @param value - Storage value
   */
  static async setLocalStorageItem(page: Page, key: string, value: string): Promise<void> {
    await page.evaluate(
      ({ key, value }) => localStorage.setItem(key, value),
      { key, value }
    );
  }

  /**
   * Get local storage item
   * @param page - Browser page
   * @param key - Storage key
   */
  static async getLocalStorageItem(page: Page, key: string): Promise<string | null> {
    return await page.evaluate(
      (key) => localStorage.getItem(key),
      key
    );
  }

  /**
   * Simulate slow network
   * @param context - Browser context
   */
  static async simulateSlowNetwork(context: BrowserContext): Promise<void> {
    await context.route('**/*', (route) => {
      setTimeout(() => {
        route.continue();
      }, 1000); // 1 second delay
    });
    
    this.logger.info('Slow network simulation enabled');
  }

  /**
   * Simulate network offline
   * @param context - Browser context
   */
  static async simulateOfflineNetwork(context: BrowserContext): Promise<void> {
    await context.setOffline(true);
    this.logger.info('Offline network simulation enabled');
  }

  /**
   * Reset network simulation
   * @param context - Browser context
   */
  static async resetNetworkSimulation(context: BrowserContext): Promise<void> {
    await context.setOffline(false);
    await context.unroute('**/*');
    this.logger.info('Network simulation reset');
  }

  /**
   * Get page performance metrics
   * @param page - Browser page
   */
  static async getPerformanceMetrics(page: Page): Promise<any> {
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });
    
    this.logger.info(`Performance metrics collected: ${JSON.stringify(metrics)}`);
    return metrics;
  }
}
