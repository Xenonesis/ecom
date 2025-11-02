/**
 * Error logging and monitoring utilities
 * Can be integrated with services like Sentry, LogRocket, or custom logging
 */

interface ErrorContext {
  userId?: string;
  userEmail?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  [key: string]: unknown;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private readonly environment: string;

  private constructor() {
    this.environment = process.env.NODE_ENV || 'development';
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * Log an error with context
   */
  logError(error: Error, context?: Partial<ErrorContext>): void {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString(),
      environment: this.environment,
      ...context,
    };

    // In development, log to console
    if (this.environment === 'development') {
      console.error('🔴 Error logged:', errorData);
    }

    // In production, send to monitoring service
    if (this.environment === 'production') {
      this.sendToMonitoring(errorData);
    }

    // Store in local storage for debugging (client-side only)
    if (globalThis.window !== undefined) {
      this.storeErrorLocally(errorData);
    }
  }

  /**
   * Log a warning
   */
  logWarning(message: string, context?: Partial<ErrorContext>): void {
    const warningData = {
      message,
      timestamp: new Date().toISOString(),
      severity: 'medium' as const,
      environment: this.environment,
      ...context,
    };

    if (this.environment === 'development') {
      console.warn('⚠️ Warning logged:', warningData);
    }

    if (this.environment === 'production') {
      this.sendToMonitoring(warningData);
    }
  }

  /**
   * Log an info message
   */
  logInfo(message: string, context?: Record<string, unknown>): void {
    const infoData = {
      message,
      timestamp: new Date().toISOString(),
      environment: this.environment,
      ...context,
    };

    if (this.environment === 'development') {
      console.info('ℹ️ Info logged:', infoData);
    }
  }

  /**
   * Send error data to monitoring service
   */
  private sendToMonitoring(data: unknown): void {
    // Integration with Sentry, LogRocket, or custom backend can be added here
    // Example: Sentry.captureException(data)
    
    // For now, store in a queue for batch sending
    if (globalThis.window !== undefined) {
      const queue = this.getErrorQueue();
      queue.push(data);
      localStorage.setItem('error_queue', JSON.stringify(queue.slice(-50))); // Keep last 50
    }
  }

  /**
   * Store error locally for debugging
   */
  private storeErrorLocally(data: unknown): void {
    try {
      const errors = this.getLocalErrors();
      errors.push(data);
      localStorage.setItem('app_errors', JSON.stringify(errors.slice(-20))); // Keep last 20
    } catch {
      // Storage might be full or unavailable
    }
  }

  /**
   * Get locally stored errors
   */
  getLocalErrors(): unknown[] {
    if (globalThis.window === undefined) return [];
    
    try {
      const stored = localStorage.getItem('app_errors');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get error queue for batch sending
   */
  private getErrorQueue(): unknown[] {
    if (globalThis.window === undefined) return [];
    
    try {
      const stored = localStorage.getItem('error_queue');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear local error storage
   */
  clearLocalErrors(): void {
    if (globalThis.window !== undefined) {
      localStorage.removeItem('app_errors');
      localStorage.removeItem('error_queue');
    }
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metricName: string, value: number, context?: Record<string, unknown>): void {
    const performanceData = {
      metric: metricName,
      value,
      timestamp: new Date().toISOString(),
      ...context,
    };

    if (this.environment === 'development') {
      console.log('📊 Performance metric:', performanceData);
    }

    // Send to analytics service in production
    if (this.environment === 'production') {
      this.sendToMonitoring(performanceData);
    }
  }
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance();

// Global error handler for unhandled errors
if (globalThis.window !== undefined) {
  globalThis.window.addEventListener('error', (event) => {
    errorLogger.logError(event.error || new Error(event.message), {
      severity: 'high',
      url: globalThis.window.location.href,
      userAgent: navigator.userAgent,
    });
  });

  // Handle unhandled promise rejections
  globalThis.window.addEventListener('unhandledrejection', (event) => {
    errorLogger.logError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      {
        severity: 'high',
        url: globalThis.window.location.href,
        userAgent: navigator.userAgent,
      }
    );
  });
}
