'use server'
import { cookies } from 'next/headers'

export const createAuthCookie = () => {
  cookies().set('userAuth', 'myToken', { secure: true })
}

export const deleteAuthCookie = () => {
  cookies().delete('userAuth')
}
