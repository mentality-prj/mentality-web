/**
 * User feedback utilities combining logging with toast notifications
 * Use these when user needs to see the result of their action
 */

import toast from 'react-hot-toast'

import { logger } from './logger'

interface NotifyOptions {
  duration?: number
  icon?: string
}

/**
 * Show success message to user AND log for monitoring
 */
export function notifySuccess(userMessage: string, logContext?: Record<string, unknown>, options?: NotifyOptions) {
  // Log for technical monitoring
  logger.info(userMessage, logContext)

  // Show to user
  toast.success(userMessage, {
    duration: options?.duration || 3000,
    icon: options?.icon,
  })
}

/**
 * Show error message to user AND log for monitoring
 */
export function notifyError(
  userMessage: string,
  error?: Error | unknown,
  logContext?: Record<string, unknown>,
  options?: NotifyOptions
) {
  // Log for technical monitoring with full error details
  logger.error(userMessage, error, logContext)

  // Show to user (simplified message)
  toast.error(userMessage, {
    duration: options?.duration || 4000,
    icon: options?.icon,
  })
}

/**
 * Show warning message to user AND log for monitoring
 */
export function notifyWarning(userMessage: string, logContext?: Record<string, unknown>, options?: NotifyOptions) {
  // Log for technical monitoring
  logger.warn(userMessage, logContext)

  // Show to user
  toast.error(userMessage, {
    duration: options?.duration || 4000,
    icon: options?.icon || '⚠️',
  })
}

/**
 * Show info message to user (no logging, just notification)
 */
export function notifyInfo(message: string, options?: NotifyOptions) {
  toast(message, {
    duration: options?.duration || 3000,
    icon: options?.icon || 'ℹ️',
  })
}

/**
 * Show loading state with promise handling
 * Automatically shows success/error based on promise result
 */
export async function notifyPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string
    error: string
  },
  logContext?: Record<string, unknown>
): Promise<T> {
  try {
    const result = await toast.promise(promise, messages)
    logger.info(messages.success, logContext)
    return result
  } catch (error) {
    logger.error(messages.error, error, logContext)
    throw error
  }
}
