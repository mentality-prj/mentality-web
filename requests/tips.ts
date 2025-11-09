import { logger } from '@/lib/logger'
import { notifyError, notifySuccess, notifyWarning } from '@/lib/user-feedback'
import { CustomUser } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'
import { Roles } from '@/types/security'

import { APIUrl } from './config'

export async function addTip(user: CustomUser, prompt: string, lang: SupportedLanguage) {
  let error = new Error()

  if (user && user.role === Roles.ADMIN) {
    try {
      const response = await fetch(`${APIUrl}/tips`, {
        method: 'POST',
        body: JSON.stringify({ prompt, lang }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()

        logger.warn('Failed to add tip', { status: response.status, error: errorData, lang })

        let errorMessage = 'Failed to generate tip'
        switch (response.status) {
          case 401:
            errorMessage = 'You are not authorized. Please log in.'
            error = { name: 'Unauthorized:', message: errorData.message }
            break
          case 500:
            errorMessage = 'An internal server error occurred. Please try again later.'
            error = { name: 'Server Error:', message: errorData.message }
            break
          default:
            errorMessage = errorData.message || 'Unknown error occurred'
            error = { name: 'Error:', message: errorData.message }
        }

        // Show error to user
        notifyError(errorMessage, error, { lang, status: response.status })
      } else {
        // Show success to user + log
        notifySuccess('Tip successfully generated', { lang })
      }
    } catch (err) {
      // Log error + show to user
      notifyError('Failed to generate tip. Please try again.', err, { lang })
    }
  }
}

export const getUnpablishedTips = async (user: CustomUser) => {
  if (user && user.role === Roles.ADMIN) {
    try {
      const response = await fetch(`${APIUrl}/tips/unpublished`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()

        logger.warn('Failed to get unpublished tips', { status: response.status, error: errorData })

        let errorMessage = 'Failed to load unpublished tips'
        switch (response.status) {
          case 401:
            errorMessage = 'You are not authorized. Please log in.'
            break
          case 500:
            errorMessage = 'An internal server error occurred. Please try again later.'
            break
          default:
            errorMessage = errorData.message || 'Unknown error occurred'
        }

        // Show warning to user (less critical than error)
        notifyWarning(errorMessage, { status: response.status })
      } else {
        const data = await response.json()
        logger.debug('Got unpublished tips', { count: data?.length })
        return data
      }
    } catch (err) {
      // Log error + show to user
      notifyError('Failed to load unpublished tips. Please try again.', err)
    }
  }
}
