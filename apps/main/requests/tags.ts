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
        console.log(`Tag ${key} successfully added`)
      }
    } catch (err) {
      console.log('error', err)
    }
  }
}
