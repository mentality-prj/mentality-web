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
          console.log('addTip error', error)
        }
      } else {
        console.log(`Tip successfully generated`)
      }
    } catch (err) {
      console.log('error', err)
    }
  }
}

export const getUnpablishedTips = async (user: CustomUser) => {
  let error = new Error()

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
          console.log('addTip error', error)
        }
      } else {
        const data = await response.json()
        console.log('RESPONSE: ', data)
        return data
      }
    } catch (err) {
      console.log('error', err)
    }
  }
}
