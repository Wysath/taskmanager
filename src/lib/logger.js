/**
 * Logging utility for development/production
 * In production, logs are automatically stripped via next.config.mjs
 */

const isDev = process.env.NODE_ENV === 'development';

export const Logger = {
  /**
   * Log message (dev only)
   */
  log: (...args) => {
    if (isDev) console.log(...args);
  },

  /**
   * Log error (always, for debugging)
   * In production, this will be kept minimal
   */
  error: (...args) => {
    if (isDev) {
      console.error(...args);
    } else if (process.env.NEXT_PUBLIC_LOG_ERRORS === 'true') {
      // Optional: Send to error tracking service in prod
      // sentry.captureException(args[0]);
    }
  },

  /**
   * Log warning (dev only)
   */
  warn: (...args) => {
    if (isDev) console.warn(...args);
  },

  /**
   * Log debug info (dev only)
   */
  debug: (...args) => {
    if (isDev) console.debug(...args);
  },
};
