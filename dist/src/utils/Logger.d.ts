/**
 * Logger utility class for structured logging
 *
 * Provides different log levels and formatted output for better debugging
 * and test result tracking.
 */
export declare class Logger {
    private className;
    constructor(className?: string);
    /**
     * Get formatted timestamp
     */
    private getTimestamp;
    /**
     * Format log message
     */
    private formatMessage;
    /**
     * Log info message
     */
    info(message: string): void;
    /**
     * Log warning message
     */
    warn(message: string): void;
    /**
     * Log error message
     */
    error(message: string, error?: Error): void;
    /**
     * Log debug message (only in debug mode)
     */
    debug(message: string): void;
    /**
     * Log step information for test reporting
     */
    step(stepName: string, description?: string): void;
}
//# sourceMappingURL=Logger.d.ts.map