import { logger } from '@/lib/logger'
import { notifyError, notifySuccess } from '@/lib/user-feedback'
import { CustomUser } from '@/types/auth'
import { Roles } from '@/types/security'
import { Tag } from '@/types/tags'

import { APIUrl } from './config'

export async function addTag(user: CustomUser, tag: Tag) {
  let error = new Error()

  const { key, translations } = tag

  if (user && user.role === Roles.ADMIN) {
    try {
      const response = await fetch(`${APIUrl}/tags`, {
        method: 'POST',
        body: JSON.stringify({ key, translations }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()

        logger.warn('Failed to add tag', { status: response.status, error: errorData, key })

        let errorMessage = 'Failed to add tag'
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
        notifyError(errorMessage, error, { key, status: response.status })
      } else {
        // Show success to user + log
        notifySuccess(`Tag "${key}" successfully added`, { key })
      }
    } catch (err) {
      // Log error + show to user
      notifyError('Failed to add tag. Please try again.', err, { key })
    }
  }
}
