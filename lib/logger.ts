/**
 * Universal logger utility
 * Provides structured logging for both client and server-side operations
 *
 * Server-side: Full structured logging with timestamps and JSON metadata
 * Client-side: Simplified console logging with [LEVEL] prefix
 *
 * Note: Client-side logs are simplified to avoid cluttering the browser console.
 * In production, consider implementing a log level filter or disabling client-side
 * logging entirely by checking process.env.NODE_ENV.
 */

const isServer = typeof window === 'undefined'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogMetadata {
  [key: string]: unknown
}

class Logger {
  private formatMessage(level: LogLevel, message: string, metadata?: LogMetadata): string {
    const timestamp = new Date().toISOString()
    const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`
  }

  info(message: string, metadata?: LogMetadata): void {
    if (isServer) {
      console.log(this.formatMessage('info', message, metadata))
    } else {
      if (metadata) {
        console.log(`[INFO] ${message}`, metadata)
      } else {
        console.log(`[INFO] ${message}`)
      }
    }
  }

  warn(message: string, metadata?: LogMetadata): void {
    if (isServer) {
      console.warn(this.formatMessage('warn', message, metadata))
    } else if (metadata) {
      console.warn(`[WARN] ${message}`, metadata)
    } else {
      console.warn(`[WARN] ${message}`)
    }
  }

  error(message: string, metadata?: LogMetadata | Error): void {
    if (metadata instanceof Error) {
      if (isServer) {
        console.error(
          this.formatMessage('error', message, {
            error: metadata.message,
            stack: metadata.stack,
          })
        )
      } else {
        console.error(`[ERROR] ${message}`, metadata)
      }
    } else {
      if (isServer) {
        console.error(this.formatMessage('error', message, metadata))
      } else if (metadata) {
        console.error(`[ERROR] ${message}`, metadata)
      } else {
        console.error(`[ERROR] ${message}`)
      }
    }
  }

  debug(message: string, metadata?: LogMetadata): void {
    if (process.env.NODE_ENV === 'development') {
      if (isServer) {
        console.debug(this.formatMessage('debug', message, metadata))
      } else if (metadata) {
        console.debug(`[DEBUG] ${message}`, metadata)
      } else {
        console.debug(`[DEBUG] ${message}`)
      }
    }
  }
}

export const logger = new Logger()
export default logger
