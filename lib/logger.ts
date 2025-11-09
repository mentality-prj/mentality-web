/**
 * Server-side logger utility
 * Provides structured logging for server-side operations
 */

// Enforce server-side usage
if (typeof window !== 'undefined') {
  throw new Error('Logger can only be used on the server side')
}

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
    console.log(this.formatMessage('info', message, metadata))
  }

  warn(message: string, metadata?: LogMetadata): void {
    console.warn(this.formatMessage('warn', message, metadata))
  }

  error(message: string, metadata?: LogMetadata | Error): void {
    if (metadata instanceof Error) {
      console.error(
        this.formatMessage('error', message, {
          error: metadata.message,
          stack: metadata.stack,
        })
      )
    } else {
      console.error(this.formatMessage('error', message, metadata))
    }
  }

  debug(message: string, metadata?: LogMetadata): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, metadata))
    }
  }
}

export const logger = new Logger()
export default logger
