/**
 * Type definitions for the Playwright automation framework
 */
import { Page, BrowserContext } from '@playwright/test';
/**
 * User credentials interface
 */
export interface UserCredentials {
    username: string;
    password: string;
    email?: string;
    role?: UserRole;
}
/**
 * User roles enumeration
 */
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user",
    GUEST = "guest",
    MODERATOR = "moderator"
}
/**
 * Test data interface
 */
export interface TestData {
    users: Record<string, UserCredentials>;
    urls: Record<string, string>;
    apiEndpoints: Record<string, string>;
    testConfig: TestConfig;
}
/**
 * Test configuration interface
 */
export interface TestConfig {
    baseUrl: string;
    apiBaseUrl: string;
    timeout: number;
    retries: number;
    headless: boolean;
    slowMo: number;
}
/**
 * Page object base interface
 */
export interface PageObject {
    page: Page;
    context: BrowserContext;
    navigateTo(url?: string): Promise<void>;
    waitForPageLoad(): Promise<void>;
    takeScreenshot(name: string): Promise<void>;
}
/**
 * API response interface
 */
export interface ApiResponse<T = any> {
    status: number;
    data: T;
    headers: Record<string, string>;
    success: boolean;
    message?: string;
}
/**
 * Authentication token interface
 */
export interface AuthToken {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    tokenType: string;
}
/**
 * Element selector interface
 */
export interface ElementSelector {
    selector: string;
    description: string;
    timeout?: number;
}
/**
 * Navigation options interface
 */
export interface NavigationOptions {
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
    timeout?: number;
    referer?: string;
}
/**
 * Form data interface
 */
export interface FormData {
    [fieldName: string]: string | number | boolean;
}
/**
 * Test report interface
 */
export interface TestReport {
    testName: string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    error?: string;
    screenshots?: string[];
    logs?: string[];
}
//# sourceMappingURL=index.d.ts.map