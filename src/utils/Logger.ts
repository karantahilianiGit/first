/**
 * Logger utility class for structured logging
 * 
 * Provides different log levels and formatted output for better debugging
 * and test result tracking.
 */
export class Logger {
  private className: string;

  constructor(className: string = 'Logger') {
    this.className = className;
  }

  /**
   * Get formatted timestamp
   */
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Format log message
   */
  private formatMessage(level: string, message: string): string {
    return `[${this.getTimestamp()}] [${level}] [${this.className}] ${message}`;
  }

  /**
   * Log info message
   */
  info(message: string): void {
    console.log(this.formatMessage('INFO', message));
  }

  /**
   * Log warning message
   */
  warn(message: string): void {
    console.warn(this.formatMessage('WARN', message));
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error): void {
    console.error(this.formatMessage('ERROR', message));
    if (error) {
      console.error(error.stack);
    }
  }

  /**
   * Log debug message (only in debug mode)
   */
  debug(message: string): void {
    if (process.env.DEBUG === 'true') {
      console.debug(this.formatMessage('DEBUG', message));
    }
  }

  /**
   * Log step information for test reporting
   */
  step(stepName: string, description?: string): void {
    const message = description ? `${stepName}: ${description}` : stepName;
    console.log(this.formatMessage('STEP', message));
  }
}
