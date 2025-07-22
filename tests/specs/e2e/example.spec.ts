import { test, expect } from '@playwright/test';
import { BasePage } from '../../../src/pages/BasePage';

/**
 * Example test to verify framework setup
 */
test.describe('Framework Verification', () => {
  
  test('should verify basic page functionality', async ({ page, context }) => {
    const basePage = new BasePage(page, context, 'https://example.com');
    
    await test.step('Navigate to example page', async () => {
      await basePage.navigateTo();
    });

    await test.step('Verify page title', async () => {
      const title = await basePage.getPageTitle();
      expect(title).toContain('Example');
    });

    await test.step('Verify URL', async () => {
      expect(basePage.getCurrentUrl()).toContain('example.com');
    });
  });

  test('should verify screenshot functionality', async ({ page, context }) => {
    const basePage = new BasePage(page, context, 'https://example.com');
    
    await basePage.navigateTo();
    await basePage.takeScreenshot('example-page');
    
    // Test passes if no errors are thrown
    expect(true).toBe(true);
  });
});
