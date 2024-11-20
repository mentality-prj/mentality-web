import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'

export const cookiesKeys = Object.freeze({
  UserName: 'user-name',
  UserEmail: 'user-email',
  UserRole: 'user-role',
})

export const cookiesOptions: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  sameSite: 'strict',
}

type CookieType = { [key: string]: string }

export function saveCookies(cookiesData: CookieType[]) {
  for (const cookie of cookiesData) {
    const [key, value] = Object.entries(cookie)[0]
    cookies().set(key, value, cookiesOptions)
  }
}

export function clearAllCookies() {
  for (const [, value] of Object.entries(cookiesKeys)) {
    cookies().delete(value)
  }
}
