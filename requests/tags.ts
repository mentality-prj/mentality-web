import { auth } from '@/auth'
import { CustomSession } from '@/types/auth'

import { APIUrl } from './config'

export async function addTag(tagName: string) {
  const session = (await auth()) as CustomSession

  if (session.user && session.user.role === 'admin') {
    try {
      const response = await fetch(`${APIUrl}/tags`, {
        method: 'POST',
        body: JSON.stringify({ name: tagName }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()

        // debt: add logger
        switch (response.status) {
          case 401:
            // You are not authorized. Please log in.
            session.error = { message: 'Unauthorized:', error: errorData.message }
            break
          case 500:
            // 'An internal server error occurred. Please try again later.'
            session.error = { message: 'Server Error:', error: errorData.message }
            break
          default:
            // Unknown Error
            session.error = { message: 'Error:', error: errorData.message }
        }
      } else {
        console.log(`Tag ${tagName} successfully added`)
      }
    } catch (error) {
      console.log('error', error)
    }
  }
}
