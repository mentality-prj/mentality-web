import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'

import { Routes } from '../constants/routes'

export const CookiesKeys = Object.freeze({
  UserName: 'user-name',
  UserEmail: 'user-email',
  UserRole: 'user-role',
  IsAIAuthorized: 'isAIAuthorized',
})

export const cookiesOptions: Partial<ResponseCookie> = {
  httpOnly: false, // Available only on the server
  secure: process.env.NODE_ENV === 'production', // Used only over HTTPS
  path: Routes.MAIN, // Path where cookie is available
  sameSite: 'strict',
  //maxAge: 60 * 60 * 24, // Expiration date (1 day)
}

type CookieType = { [key: string]: string }

export async function saveCookies(cookiesData: CookieType[]) {
  for (const cookie of cookiesData) {
    const [key, value] = Object.entries(cookie)[0]
    cookies().set(key, value, cookiesOptions)
  }
}

export async function clearAllCookies() {
  for (const [, value] of Object.entries(CookiesKeys)) {
    cookies().delete(value)
  }
}
