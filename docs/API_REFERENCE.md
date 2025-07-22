# API Reference

This document provides detailed information about all public APIs, functions, and components in the Playwright Automation Framework.

## Table of Contents

- [Base Classes](#base-classes)
- [Page Objects](#page-objects)
- [Utilities](#utilities)
- [Types and Interfaces](#types-and-interfaces)
- [Test Fixtures](#test-fixtures)
- [Helper Functions](#helper-functions)

## Base Classes

### BasePage

The foundation class for all page objects implementing the Page Object Model pattern.

#### Constructor

```typescript
constructor(page: Page, context: BrowserContext, url?: string)
```

**Parameters:**
- `page: Page` - Playwright page instance
- `context: BrowserContext` - Playwright browser context
- `url?: string` - Optional page URL

#### Methods

##### `navigateTo(url?: string, options?: NavigationOptions): Promise<void>`

Navigate to the page URL.

**Parameters:**
- `url?: string` - Optional URL to navigate to (defaults to page URL)
- `options?: NavigationOptions` - Navigation options

**Example:**
```typescript
await loginPage.navigateTo('/login');
await loginPage.navigateTo('https://example.com', { waitUntil: 'networkidle' });
```

##### `waitForPageLoad(): Promise<void>`

Wait for page to be fully loaded.

**Example:**
```typescript
await page.goto('/dashboard');
await basePage.waitForPageLoad();
```

##### `takeScreenshot(name: string): Promise<void>`

Take a screenshot of the current page.

**Parameters:**
- `name: string` - Screenshot name

**Example:**
```typescript
await basePage.takeScreenshot('dashboard-loaded');
```

##### `clickElement(selector: string, options?: ClickOptions): Promise<void>`

Click on an element.

**Parameters:**
- `selector: string` - Element selector
- `options?: ClickOptions` - Click options

**Example:**
```typescript
await basePage.clickElement('[data-testid="submit-button"]');
await basePage.clickElement('#menu-button', { force: true });
```

##### `fillInput(selector: string, value: string, options?: FillOptions): Promise<void>`

Fill input field.

**Parameters:**
- `selector: string` - Input selector
- `value: string` - Value to fill
- `options?: FillOptions` - Fill options

**Example:**
```typescript
await basePage.fillInput('#username', 'testuser');
await basePage.fillInput('[name="password"]', 'password123');
```

##### `getElementText(selector: string, timeout?: number): Promise<string>`

Get text content of an element.

**Parameters:**
- `selector: string` - Element selector
- `timeout?: number` - Wait timeout

**Returns:** `Promise<string>` - Element text content

**Example:**
```typescript
const title = await basePage.getElementText('h1');
const errorMessage = await basePage.getElementText('.error-message');
```

##### `isElementVisible(selector: string): Promise<boolean>`

Check if element is visible.

**Parameters:**
- `selector: string` - Element selector

**Returns:** `Promise<boolean>` - True if element is visible

**Example:**
```typescript
const isVisible = await basePage.isElementVisible('[data-testid="success-message"]');
if (isVisible) {
  // Handle success case
}
```

##### `verifyPageTitle(expectedTitle: string, timeout?: number): Promise<void>`

Wait for and verify page title.

**Parameters:**
- `expectedTitle: string` - Expected page title
- `timeout?: number` - Wait timeout

**Example:**
```typescript
await basePage.verifyPageTitle('Dashboard - MyApp');
```

##### `verifyUrlContains(urlPart: string, timeout?: number): Promise<void>`

Wait for and verify URL contains text.

**Parameters:**
- `urlPart: string` - URL part to verify
- `timeout?: number` - Wait timeout

**Example:**
```typescript
await basePage.verifyUrlContains('/dashboard');
```

## Page Objects

### LoginPage

Handles all login-related functionality.

#### Constructor

```typescript
constructor(page: Page, context: BrowserContext)
```

#### Methods

##### `navigateToLogin(): Promise<void>`

Navigate to login page and verify it's loaded.

**Example:**
```typescript
const loginPage = new LoginPage(page, context);
await loginPage.navigateToLogin();
```

##### `login(credentials: UserCredentials, rememberMe?: boolean): Promise<void>`

Perform user login.

**Parameters:**
- `credentials: UserCredentials` - User credentials
- `rememberMe?: boolean` - Whether to check remember me option

**Example:**
```typescript
await loginPage.login({
  username: 'test@example.com',
  password: 'password123'
}, true);
```

##### `verifySuccessfulLogin(): Promise<void>`

Verify successful login by checking URL change.

**Example:**
```typescript
await loginPage.login(credentials);
await loginPage.verifySuccessfulLogin();
```

##### `verifyLoginError(expectedError?: string): Promise<void>`

Verify login error message.

**Parameters:**
- `expectedError?: string` - Expected error message (optional)

**Example:**
```typescript
await loginPage.login(invalidCredentials);
await loginPage.verifyLoginError('Invalid credentials');
```

##### `getErrorMessage(): Promise<string>`

Get current error message text.

**Returns:** `Promise<string>` - Error message text

**Example:**
```typescript
const errorText = await loginPage.getErrorMessage();
console.log('Login error:', errorText);
```

## Utilities

### ApiHelper

Handles API requests and responses with authentication support.

#### Constructor

```typescript
constructor(request: APIRequestContext)
```

#### Methods

##### `setAuthToken(token: AuthToken): void`

Set authentication token.

**Parameters:**
- `token: AuthToken` - Authentication token

**Example:**
```typescript
const authToken = await apiHelper.authenticate('/api/login', credentials);
apiHelper.setAuthToken(authToken);
```

##### `get<T>(endpoint: string, params?: Record<string, string>, headers?: Record<string, string>): Promise<ApiResponse<T>>`

Make GET request.

**Parameters:**
- `endpoint: string` - API endpoint
- `params?: Record<string, string>` - Query parameters
- `headers?: Record<string, string>` - Additional headers

**Returns:** `Promise<ApiResponse<T>>` - API response

**Example:**
```typescript
const response = await apiHelper.get<User>('/api/users/123');
const users = await apiHelper.get<User[]>('/api/users', { page: '1', limit: '10' });
```

##### `post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>>`

Make POST request.

**Parameters:**
- `endpoint: string` - API endpoint
- `data?: any` - Request body data
- `headers?: Record<string, string>` - Additional headers

**Returns:** `Promise<ApiResponse<T>>` - API response

**Example:**
```typescript
const response = await apiHelper.post<User>('/api/users', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

##### `validateStatus<T>(response: ApiResponse<T>, expectedStatus: number): Promise<void>`

Validate response status.

**Parameters:**
- `response: ApiResponse<T>` - API response
- `expectedStatus: number` - Expected status code

**Example:**
```typescript
const response = await apiHelper.get('/api/users');
await apiHelper.validateStatus(response, 200);
```

##### `validateResponseData<T>(response: ApiResponse<T>, expectedData: Partial<T>): Promise<void>`

Validate response contains data.

**Parameters:**
- `response: ApiResponse<T>` - API response
- `expectedData: Partial<T>` - Expected data properties

**Example:**
```typescript
await apiHelper.validateResponseData(response, {
  id: 123,
  name: 'John Doe'
});
```

##### `authenticate(loginEndpoint: string, credentials: Record<string, string>): Promise<AuthToken>`

Login and get authentication token.

**Parameters:**
- `loginEndpoint: string` - Login API endpoint
- `credentials: Record<string, string>` - User credentials

**Returns:** `Promise<AuthToken>` - Authentication token

**Example:**
```typescript
const token = await apiHelper.authenticate('/api/auth/login', {
  username: 'test@example.com',
  password: 'password123'
});
```

### Logger

Structured logging utility for better debugging and test result tracking.

#### Constructor

```typescript
constructor(className: string = 'Logger')
```

#### Methods

##### `info(message: string): void`

Log info message.

**Example:**
```typescript
logger.info('User logged in successfully');
```

##### `warn(message: string): void`

Log warning message.

**Example:**
```typescript
logger.warn('Slow network detected');
```

##### `error(message: string, error?: Error): void`

Log error message.

**Parameters:**
- `message: string` - Error message
- `error?: Error` - Optional error object

**Example:**
```typescript
logger.error('Failed to login', new Error('Network timeout'));
```

##### `step(stepName: string, description?: string): void`

Log step information for test reporting.

**Parameters:**
- `stepName: string` - Step name
- `description?: string` - Optional step description

**Example:**
```typescript
logger.step('Login Process', 'Entering user credentials');
```

### TestHelper

Common testing utilities for data generation and browser manipulation.

#### Static Methods

##### `generateRandomString(length?: number, prefix?: string): string`

Generate random string.

**Parameters:**
- `length?: number` - String length (default: 10)
- `prefix?: string` - Optional prefix

**Returns:** `string` - Random string

**Example:**
```typescript
const randomId = TestHelper.generateRandomString(8, 'user_');
const randomText = TestHelper.generateRandomString();
```

##### `generateRandomEmail(domain?: string): string`

Generate random email.

**Parameters:**
- `domain?: string` - Email domain (default: 'example.com')

**Returns:** `string` - Random email

**Example:**
```typescript
const email = TestHelper.generateRandomEmail();
const corpEmail = TestHelper.generateRandomEmail('company.com');
```

##### `takeFullPageScreenshot(page: Page, name: string, testDir?: string): Promise<string>`

Take full page screenshot.

**Parameters:**
- `page: Page` - Browser page
- `name: string` - Screenshot name
- `testDir?: string` - Test directory

**Returns:** `Promise<string>` - Screenshot path

**Example:**
```typescript
const screenshotPath = await TestHelper.takeFullPageScreenshot(page, 'error-state');
```

##### `clearBrowserStorage(page: Page): Promise<void>`

Clear browser storage (localStorage, sessionStorage, cookies).

**Parameters:**
- `page: Page` - Browser page

**Example:**
```typescript
await TestHelper.clearBrowserStorage(page);
```

## Types and Interfaces

### UserCredentials

User credentials interface.

```typescript
interface UserCredentials {
  username: string;
  password: string;
  email?: string;
  role?: UserRole;
}
```

### ApiResponse

API response interface.

```typescript
interface ApiResponse<T = any> {
  status: number;
  data: T;
  headers: Record<string, string>;
  success: boolean;
  message?: string;
}
```

### AuthToken

Authentication token interface.

```typescript
interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}
```

### TestData

Test data interface.

```typescript
interface TestData {
  users: Record<string, UserCredentials>;
  urls: Record<string, string>;
  apiEndpoints: Record<string, string>;
  testConfig: TestConfig;
}
```

## Test Fixtures

### Authentication Fixtures

Pre-configured fixtures for authentication testing.

#### Available Fixtures

- `loginPage: LoginPage` - Login page object
- `apiHelper: ApiHelper` - API helper instance
- `authenticatedPage: Page` - Pre-authenticated page
- `authenticatedContext: BrowserContext` - Pre-authenticated context
- `adminUser: UserCredentials` - Admin user credentials
- `standardUser: UserCredentials` - Standard user credentials

#### Usage

```typescript
import { test } from '../fixtures/authFixtures';

test('should access protected page', async ({ authenticatedPage, standardUser }) => {
  await authenticatedPage.goto('/dashboard');
  // Page is already authenticated as standardUser
});
```

## Helper Functions

### AuthHelper

Static helper functions for authentication.

#### `loginViaApi(apiHelper: ApiHelper, credentials: UserCredentials): Promise<AuthToken>`

Login via API and return auth token.

**Example:**
```typescript
const token = await AuthHelper.loginViaApi(apiHelper, credentials);
```

#### `loginViaUI(page: Page, context: BrowserContext, credentials: UserCredentials): Promise<LoginPage>`

Login via UI and return login page.

**Example:**
```typescript
const loginPage = await AuthHelper.loginViaUI(page, context, credentials);
```

#### `getAuthenticatedContext(browser: any, credentials: UserCredentials): Promise<BrowserContext>`

Setup authenticated browser context.

**Example:**
```typescript
const context = await AuthHelper.getAuthenticatedContext(browser, credentials);
```

## Error Handling

All methods include proper error handling and meaningful error messages. Errors are logged using the Logger utility and include stack traces for debugging.

### Common Error Patterns

```typescript
try {
  await loginPage.login(credentials);
} catch (error) {
  logger.error('Login failed', error);
  throw error; // Re-throw for test failure
}
```

## Best Practices

1. **Always use TypeScript types** for better IDE support and error catching
2. **Use data-testid attributes** for reliable element selection
3. **Implement proper waiting** for dynamic content
4. **Handle errors gracefully** with meaningful messages
5. **Use fixtures** for common test setup
6. **Keep page objects focused** on single page/component
7. **Centralize test data** for maintainability

## Examples

See the `tests/specs/` directory for comprehensive examples of using all APIs and patterns described in this reference.
