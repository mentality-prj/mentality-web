import { CustomUser } from '@/types/auth'

import { APIUrl } from './config'

export async function addTag(user: CustomUser, tagName: string) {
  let error = new Error()

  if (user && user.role === 'admin') {
    try {
      const response = await fetch(`${APIUrl}/tags`, {
        method: 'POST',
        body: JSON.stringify({ name: tagName }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()

        // debt: add logger
        switch (response.status) {
          case 401:
            // You are not authorized. Please log in.
            error = { name: 'Unauthorized:', message: errorData.message }
            break
          case 500:
            // 'An internal server error occurred. Please try again later.'
            error = { name: 'Server Error:', message: errorData.message }
            break
          default:
            // Unknown Error
            error = { name: 'Error:', message: errorData.message }
        }

        if (error) {
          console.log('addTag error', error)
        }
      } else {
        console.log(`Tag ${tagName} successfully added`)
      }
    } catch (err) {
      console.log('error', err)
    }
  }
}
