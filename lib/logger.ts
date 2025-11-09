/**
 * Simple logger utility for Next.js frontend
 * Handles both client and server side logging with environment-aware behavior
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

interface LoggerConfig {
  enabled: boolean
  minLevel: LogLevel
  sendToBackend: boolean
  isDevelopment: boolean
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

class Logger {
  private config: LoggerConfig

  constructor() {
    this.config = {
      enabled: true,
      minLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
      sendToBackend: process.env.NODE_ENV === 'production',
      isDevelopment: process.env.NODE_ENV !== 'production',
    }
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false
    const currentLevel = LOG_LEVELS[level]
    const minLevel = LOG_LEVELS[this.config.minLevel]
    return currentLevel >= minLevel
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : ''
    return `${prefix} ${message}${contextStr}`
  }

  private async sendToBackend(level: LogLevel, message: string, context?: LogContext) {
    if (!this.config.sendToBackend || typeof window === 'undefined') return

    try {
      // Send critical errors to backend
      if (level === 'error') {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            level,
            message,
            context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
          }),
        }).catch(() => {
          // Silently fail if logging endpoint is unavailable
        })
      }
    } catch {
      // Ignore logging errors
    }
  }

  debug(message: string, context?: LogContext) {
    if (!this.shouldLog('debug')) return
    if (this.config.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context))
    }
  }

  info(message: string, context?: LogContext) {
    if (!this.shouldLog('info')) return
    if (this.config.isDevelopment) {
      console.info(this.formatMessage('info', message, context))
    }
  }

  warn(message: string, context?: LogContext) {
    if (!this.shouldLog('warn')) return
    console.warn(this.formatMessage('warn', message, context))
    this.sendToBackend('warn', message, context)
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    if (!this.shouldLog('error')) return

    const errorContext = {
      ...context,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
    }

    console.error(this.formatMessage('error', message, errorContext))
    this.sendToBackend('error', message, errorContext)
  }

  // Helper for API request logging
  apiRequest(method: string, url: string, status?: number, duration?: number) {
    const message = `${method} ${url}`
    const context = { status, duration: duration ? `${duration}ms` : undefined }

    if (status && status >= 400) {
      this.error(message, undefined, context)
    } else if (this.config.isDevelopment) {
      this.debug(message, context)
    }
  }

  // Helper for user actions tracking (analytics-like)
  action(actionName: string, data?: LogContext) {
    if (this.config.isDevelopment) {
      this.info(`User action: ${actionName}`, data)
    }
  }
}

// Singleton instance
export const logger = new Logger()

// Convenience exports for common patterns
export const logError = (message: string, error?: Error | unknown, context?: LogContext) => {
  logger.error(message, error, context)
}

export const logWarning = (message: string, context?: LogContext) => {
  logger.warn(message, context)
}

export const logInfo = (message: string, context?: LogContext) => {
  logger.info(message, context)
}

export const logDebug = (message: string, context?: LogContext) => {
  logger.debug(message, context)
}
