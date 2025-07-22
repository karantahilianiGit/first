# Getting Started Guide

This guide will help you set up and start using the Playwright Automation Framework with Page Object Model pattern.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Git** (for version control)

## Step 1: Project Setup

### Clone and Install

```bash
# Clone the repository
git clone <your-repository-url>
cd playwright-automation-framework

# Install dependencies
npm install

# Install Playwright browsers
npm run test:install

# Build the project
npm run build
```

### Verify Installation

```bash
# Run a simple test to verify everything works
npm run test:chrome -- --grep "should login successfully"
```

## Step 2: Understanding the Framework Structure

### Key Components

1. **Page Objects** (`src/pages/`) - Encapsulate page functionality
2. **Utilities** (`src/utils/`) - Helper classes for API, logging, etc.
3. **Types** (`src/types/`) - TypeScript interfaces and types
4. **Test Specs** (`tests/specs/`) - Actual test files
5. **Fixtures** (`tests/fixtures/`) - Test setup and teardown
6. **Test Data** (`tests/data/`) - Centralized test data

### Framework Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Test Specs    │───▶│  Page Objects   │───▶│   Web Pages     │
│                 │    │                 │    │                 │
│ • Auth Tests    │    │ • BasePage      │    │ • Login Page    │
│ • API Tests     │    │ • LoginPage     │    │ • Dashboard     │
│ • E2E Tests     │    │ • HomePage      │    │ • Profile Page  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Fixtures      │    │   Utilities     │
│                 │    │                 │
│ • Auth Setup    │    │ • ApiHelper     │
│ • Data Setup    │    │ • Logger        │
│ • User Context  │    │ • TestHelper    │
└─────────────────┘    └─────────────────┘
```

## Step 3: Configuration

### Environment Setup

Create a `.env` file in your project root:

```env
# Application URLs
BASE_URL=https://your-app.com
API_BASE_URL=https://api.your-app.com

# Test Configuration
HEADLESS=true
SLOW_MO=0
TEST_TIMEOUT=30000
TEST_RETRIES=2

# Test Credentials
TEST_USERNAME=test@example.com
TEST_PASSWORD=password123
ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=adminpass123

# Browser Settings
BROWSER=chromium
VIEWPORT_WIDTH=1280
VIEWPORT_HEIGHT=720

# Debug Settings
DEBUG=false
TRACE_ON_FAILURE=true
VIDEO_ON_FAILURE=true
SCREENSHOT_ON_FAILURE=true
```

### Update Test Data

Edit `tests/data/testData.ts` to match your application:

```typescript
export const testData: TestData = {
  users: {
    admin: {
      username: process.env.ADMIN_USERNAME || 'admin@yourapp.com',
      password: process.env.ADMIN_PASSWORD || 'AdminPass123!',
      email: 'admin@yourapp.com',
      role: UserRole.ADMIN
    },
    standardUser: {
      username: process.env.TEST_USERNAME || 'user@yourapp.com',
      password: process.env.TEST_PASSWORD || 'UserPass123!',
      email: 'user@yourapp.com',
      role: UserRole.USER
    }
  },
  urls: {
    baseUrl: process.env.BASE_URL || 'https://yourapp.com',
    loginUrl: '/login',
    dashboardUrl: '/dashboard',
    // Add your application URLs
  },
  apiEndpoints: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    users: '/api/users',
    // Add your API endpoints
  }
};
```

## Step 4: Writing Your First Page Object

### Create a New Page Object

Create `src/pages/DashboardPage.ts`:

```typescript
import { Page, BrowserContext, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  // Define element selectors
  private readonly selectors = {
    welcomeMessage: '[data-testid="welcome-message"]',
    userMenu: '[data-testid="user-menu"]',
    logoutButton: '[data-testid="logout-button"]',
    navigationMenu: '[data-testid="nav-menu"]',
    profileLink: '[data-testid="profile-link"]'
  };

  constructor(page: Page, context: BrowserContext) {
    super(page, context, '/dashboard');
  }

  /**
   * Navigate to dashboard and verify it's loaded
   */
  async navigateToDashboard(): Promise<void> {
    await this.navigateTo();
    await this.verifyDashboardLoaded();
  }

  /**
   * Verify dashboard page is loaded
   */
  async verifyDashboardLoaded(): Promise<void> {
    await this.waitForElement(this.selectors.welcomeMessage);
    await this.verifyPageTitle('Dashboard');
    this.logger.info('Dashboard page loaded successfully');
  }

  /**
   * Get welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.getElementText(this.selectors.welcomeMessage);
  }

  /**
   * Click user menu
   */
  async clickUserMenu(): Promise<void> {
    await this.clickElement(this.selectors.userMenu);
    this.logger.info('User menu clicked');
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await this.clickUserMenu();
    await this.clickElement(this.selectors.logoutButton);
    this.logger.info('User logout initiated');
  }

  /**
   * Navigate to profile page
   */
  async goToProfile(): Promise<void> {
    await this.clickElement(this.selectors.profileLink);
    await this.verifyUrlContains('/profile');
  }
}
```

## Step 5: Writing Your First Test

### Create a Test File

Create `tests/specs/e2e/dashboard.spec.ts`:

```typescript
import { test, expect } from '../../fixtures/authFixtures';
import { DashboardPage } from '../../../src/pages/DashboardPage';
import { testData } from '../../data/testData';

test.describe('Dashboard Functionality', () => {
  
  test.beforeEach(async ({ authenticatedPage }) => {
    // Test starts with authenticated user
    await authenticatedPage.goto('/dashboard');
  });

  test('should display welcome message', async ({ authenticatedPage, standardUser }) => {
    const dashboardPage = new DashboardPage(authenticatedPage, authenticatedPage.context());
    
    await test.step('Verify dashboard is loaded', async () => {
      await dashboardPage.verifyDashboardLoaded();
    });

    await test.step('Check welcome message', async () => {
      const welcomeMessage = await dashboardPage.getWelcomeMessage();
      expect(welcomeMessage).toContain('Welcome');
    });
  });

  test('should navigate to profile page', async ({ authenticatedPage }) => {
    const dashboardPage = new DashboardPage(authenticatedPage, authenticatedPage.context());
    
    await test.step('Navigate to profile', async () => {
      await dashboardPage.goToProfile();
    });

    await test.step('Verify profile page loaded', async () => {
      expect(authenticatedPage.url()).toContain('/profile');
    });
  });

  test('should logout successfully', async ({ authenticatedPage }) => {
    const dashboardPage = new DashboardPage(authenticatedPage, authenticatedPage.context());
    
    await test.step('Perform logout', async () => {
      await dashboardPage.logout();
    });

    await test.step('Verify logout redirect', async () => {
      await authenticatedPage.waitForURL('**/login');
      expect(authenticatedPage.url()).toContain('/login');
    });
  });
});
```

## Step 6: Writing API Tests

### Create an API Test

Create `tests/specs/api/dashboard.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../../src/utils/ApiHelper';
import { AuthHelper } from '../../fixtures/authFixtures';
import { testData } from '../../data/testData';

test.describe('Dashboard API', () => {
  let apiHelper: ApiHelper;

  test.beforeEach(async ({ request }) => {
    apiHelper = new ApiHelper(request);
    // Authenticate for API tests
    await AuthHelper.loginViaApi(apiHelper, testData.users.standardUser);
  });

  test('should get dashboard data', async () => {
    await test.step('Request dashboard data', async () => {
      const response = await apiHelper.get('/api/dashboard');
      
      await apiHelper.validateStatus(response, 200);
      await apiHelper.validateSchema(response, ['user', 'stats', 'notifications']);
    });
  });

  test('should update user preferences', async () => {
    const preferences = {
      theme: 'dark',
      language: 'en',
      notifications: true
    };

    await test.step('Update preferences', async () => {
      const response = await apiHelper.put('/api/user/preferences', preferences);
      
      await apiHelper.validateStatus(response, 200);
      await apiHelper.validateResponseData(response, preferences);
    });
  });
});
```

## Step 7: Running Tests

### Basic Test Execution

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:auth
npm run test:api
npm run test:e2e

# Run tests with specific browser
npm run test:chrome
npm run test:firefox

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui
```

### Advanced Test Execution

```bash
# Run tests matching a pattern
npx playwright test --grep "dashboard"

# Run tests in a specific file
npx playwright test tests/specs/auth/login.spec.ts

# Run tests with specific number of workers
npx playwright test --workers=2

# Run tests with custom timeout
npx playwright test --timeout=60000

# Run tests and generate report
npm test && npm run test:report
```

## Step 8: Debugging and Troubleshooting

### Debug Mode

```bash
# Run specific test in debug mode
npx playwright test tests/specs/auth/login.spec.ts --debug

# Run test with headed browser
npx playwright test --headed --slowMo=1000
```

### UI Mode (Interactive Testing)

```bash
npm run test:ui
```

### Common Issues and Solutions

#### 1. Element Not Found

```typescript
// ❌ Bad - No waiting
await page.click('#button');

// ✅ Good - Wait for element
await this.waitForElement('#button');
await this.clickElement('#button');
```

#### 2. Flaky Tests Due to Timing

```typescript
// ❌ Bad - Hard wait
await this.wait(3000);

// ✅ Good - Wait for condition
await this.page.waitForLoadState('networkidle');
await this.waitForElement('[data-testid="content-loaded"]');
```

#### 3. Authentication Issues

```typescript
// ✅ Use fixtures for authenticated tests
test('protected page', async ({ authenticatedPage }) => {
  // Page is already authenticated
});
```

## Step 9: Best Practices

### 1. Page Object Design

- Keep page objects focused on a single page/component
- Use data-testid attributes for reliable selectors
- Implement proper waiting strategies
- Add meaningful logging and error messages

### 2. Test Organization

```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
  });

  test('should do something specific', async ({ fixtures }) => {
    await test.step('Step 1 description', async () => {
      // Test step implementation
    });

    await test.step('Step 2 description', async () => {
      // Test step implementation
    });
  });
});
```

### 3. Data Management

- Use centralized test data
- Environment-specific configurations
- Avoid hardcoded values
- Use data generators for dynamic data

### 4. Error Handling

```typescript
try {
  await loginPage.login(credentials);
  await loginPage.verifySuccessfulLogin();
} catch (error) {
  await loginPage.takeScreenshot('login-error');
  this.logger.error('Login failed', error);
  throw error;
}
```

## Step 10: CI/CD Integration

### GitHub Actions Setup

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npm test
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## Next Steps

1. **Customize the framework** for your specific application
2. **Add more page objects** for your application pages
3. **Create comprehensive test suites** for your features
4. **Set up CI/CD pipelines** for automated testing
5. **Add performance testing** capabilities
6. **Implement visual regression testing**

## Getting Help

- Check the [API Reference](API_REFERENCE.md) for detailed documentation
- Review existing test examples in `tests/specs/`
- Create issues in the repository for bugs or feature requests
- Consult the [Playwright documentation](https://playwright.dev/) for advanced features

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://martinfowler.com/bliki/PageObject.html)
- [Test Automation Best Practices](https://playwright.dev/docs/best-practices)
