# Playwright Automation Framework

A comprehensive Playwright automation framework built with TypeScript, implementing the Page Object Model (POM) pattern for scalable and maintainable test automation.

## 🚀 Features

- **Page Object Model (POM)** - Organized and maintainable test structure
- **TypeScript Support** - Type safety and better IDE support
- **Multi-browser Testing** - Chrome, Firefox, Safari, and mobile browsers
- **API Testing** - Comprehensive API testing utilities
- **Authentication Handling** - Built-in authentication fixtures
- **Comprehensive Reporting** - HTML, JSON, and JUnit reports
- **CI/CD Ready** - Configured for continuous integration
- **Parallel Execution** - Fast test execution with parallel workers
- **Screenshot & Video** - Automatic capture on failures
- **Environment Management** - Support for multiple environments

## 📁 Project Structure

```
playwright-automation-framework/
├── src/                          # Source code
│   ├── pages/                   # Page Object classes
│   │   ├── BasePage.ts         # Base page object
│   │   └── LoginPage.ts        # Login page object
│   ├── utils/                   # Utility classes
│   │   ├── ApiHelper.ts        # API testing utilities
│   │   └── Logger.ts           # Logging utility
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts            # Common interfaces and types
│   └── config/                  # Configuration files
├── tests/                       # Test files
│   ├── specs/                  # Test specifications
│   │   ├── auth/               # Authentication tests
│   │   ├── api/                # API tests
│   │   └── e2e/                # End-to-end tests
│   ├── fixtures/               # Test fixtures
│   │   └── authFixtures.ts     # Authentication fixtures
│   ├── helpers/                # Test helper functions
│   │   └── TestHelper.ts       # Common test utilities
│   └── data/                   # Test data
│       └── testData.ts         # Centralized test data
├── docs/                       # Documentation
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Package configuration
```

## 🛠️ Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd playwright-automation-framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run test:install
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in UI mode (interactive)
npm run test:ui

# Run specific test suite
npm run test:auth      # Authentication tests
npm run test:api       # API tests
npm run test:e2e       # End-to-end tests

# Run tests on specific browser
npm run test:chrome    # Chrome only
npm run test:firefox   # Firefox only
npm run test:safari    # Safari only
npm run test:mobile    # Mobile browsers

# Run tests in parallel
npm run test:parallel

# Debug tests
npm run test:debug
```

### Writing Your First Test

1. **Create a page object** (e.g., `src/pages/HomePage.ts`):

```typescript
import { Page, BrowserContext } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private readonly selectors = {
    searchInput: '[data-testid="search-input"]',
    searchButton: '[data-testid="search-button"]',
    results: '[data-testid="search-results"]'
  };

  constructor(page: Page, context: BrowserContext) {
    super(page, context, '/');
  }

  async search(query: string): Promise<void> {
    await this.fillInput(this.selectors.searchInput, query);
    await this.clickElement(this.selectors.searchButton);
    await this.waitForElement(this.selectors.results);
  }
}
```

2. **Create a test** (e.g., `tests/specs/search.spec.ts`):

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';

test.describe('Search Functionality', () => {
  test('should search successfully', async ({ page, context }) => {
    const homePage = new HomePage(page, context);
    
    await homePage.navigateTo();
    await homePage.search('playwright automation');
    
    expect(await homePage.isElementVisible('[data-testid="search-results"]')).toBeTruthy();
  });
});
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
BASE_URL=https://your-app.com
API_BASE_URL=https://api.your-app.com
TEST_USERNAME=test@example.com
TEST_PASSWORD=password123
HEADLESS=true
SLOW_MO=0
```

### Playwright Configuration

The framework is configured in `playwright.config.ts`. Key settings:

- **Browsers**: Chrome, Firefox, Safari, Mobile
- **Parallel execution**: Enabled by default
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

## 📚 API Documentation

### Base Page Object

The `BasePage` class provides common functionality:

- **Navigation**: `navigateTo()`, `waitForPageLoad()`
- **Element Interaction**: `clickElement()`, `fillInput()`, `getElementText()`
- **Waiting**: `waitForElement()`, `waitForElementToBeHidden()`
- **Screenshots**: `takeScreenshot()`
- **Validation**: `verifyPageTitle()`, `verifyUrlContains()`

### API Helper

The `ApiHelper` class provides API testing utilities:

- **HTTP Methods**: `get()`, `post()`, `put()`, `patch()`, `delete()`
- **Authentication**: `authenticate()`, `setAuthToken()`
- **Validation**: `validateStatus()`, `validateResponseData()`, `validateSchema()`

### Authentication Fixtures

Pre-configured fixtures for authentication:

- `loginPage`: Login page object
- `apiHelper`: API helper instance
- `authenticatedPage`: Pre-authenticated page
- `authenticatedContext`: Pre-authenticated context
- `adminUser`, `standardUser`: User credentials

## 📊 Reporting

### HTML Report
```bash
npm run test:report
```

### Test Results
- HTML reports: `playwright-report/`
- JSON results: `test-results.json`
- JUnit XML: `test-results.xml`
- Screenshots: `test-results/`

## 🔍 Debugging

### Debug Mode
```bash
npm run test:debug
```

### UI Mode
```bash
npm run test:ui
```

### Screenshots and Videos
- Screenshots are automatically taken on test failures
- Videos are recorded for failed tests
- Traces are captured on first retry

## 🧪 Test Patterns

### Page Object Model

```typescript
// Page Object
export class LoginPage extends BasePage {
  async login(credentials: UserCredentials): Promise<void> {
    await this.fillInput('[data-testid="username"]', credentials.username);
    await this.fillInput('[data-testid="password"]', credentials.password);
    await this.clickElement('[data-testid="login-button"]');
  }
}

// Test
test('should login successfully', async ({ page, context }) => {
  const loginPage = new LoginPage(page, context);
  await loginPage.login(testData.users.admin);
});
```

### API Testing

```typescript
test('should get user profile', async ({ request }) => {
  const apiHelper = new ApiHelper(request);
  await apiHelper.authenticate('/api/auth/login', credentials);
  
  const response = await apiHelper.get('/api/profile');
  await apiHelper.validateStatus(response, 200);
  await apiHelper.validateSchema(response, ['id', 'username', 'email']);
});
```

### Using Fixtures

```typescript
import { test } from '../fixtures/authFixtures';

test('should access protected page', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard');
  // Test already authenticated
});
```

## 🚀 CI/CD Integration

### GitHub Actions

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:install
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📈 Best Practices

### 1. Page Objects
- Keep page objects focused on a single page/component
- Use data-testid attributes for reliable selectors
- Implement proper waiting strategies

### 2. Test Organization
- Group related tests in describe blocks
- Use meaningful test descriptions
- Keep tests independent and atomic

### 3. Data Management
- Use centralized test data
- Environment-specific configurations
- Avoid hardcoded values

### 4. Error Handling
- Implement proper error messages
- Use meaningful assertions
- Handle async operations correctly

## 🔧 Customization

### Adding New Page Objects

1. Create a new page object extending `BasePage`
2. Define element selectors
3. Implement page-specific methods
4. Add proper TypeScript types

### Adding New Test Suites

1. Create test files in appropriate directories
2. Use proper fixtures for setup
3. Follow naming conventions
4. Add to CI/CD pipeline

### Environment Configuration

1. Update `testData.ts` for new environments
2. Add environment variables
3. Update Playwright config if needed

## �� Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For questions and support:
- Create an issue in the repository
- Check the documentation
- Review existing test examples

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/) - Modern web testing framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Page Object Model](https://martinfowler.com/bliki/PageObject.html) - Design pattern for test automation
