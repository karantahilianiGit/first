"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
/**
 * Logger utility class for structured logging
 *
 * Provides different log levels and formatted output for better debugging
 * and test result tracking.
 */
class Logger {
    className;
    constructor(className = 'Logger') {
        this.className = className;
    }
    /**
     * Get formatted timestamp
     */
    getTimestamp() {
        return new Date().toISOString();
    }
    /**
     * Format log message
     */
    formatMessage(level, message) {
        return `[${this.getTimestamp()}] [${level}] [${this.className}] ${message}`;
    }
    /**
     * Log info message
     */
    info(message) {
        console.log(this.formatMessage('INFO', message));
    }
    /**
     * Log warning message
     */
    warn(message) {
        console.warn(this.formatMessage('WARN', message));
    }
    /**
     * Log error message
     */
    error(message, error) {
        console.error(this.formatMessage('ERROR', message));
        if (error) {
            console.error(error.stack);
        }
    }
    /**
     * Log debug message (only in debug mode)
     */
    debug(message) {
        if (process.env.DEBUG === 'true') {
            console.debug(this.formatMessage('DEBUG', message));
        }
    }
    /**
     * Log step information for test reporting
     */
    step(stepName, description) {
        const message = description ? `${stepName}: ${description}` : stepName;
        console.log(this.formatMessage('STEP', message));
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map