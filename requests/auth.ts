import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'
import { UserEntity, ValidateUserDto } from '@/types/api-responses'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

async function rawPost<T = unknown>(url: string, body: unknown): Promise<{ data?: T; error?: string }> {
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    })
    if (!resp.ok) {
      let message = resp.statusText
      try {
        const j = await resp.json()
        message = (j && (j.message || j.error)) || message
      } catch {}
      return { error: message }
    }
    const data = (await resp.json()) as T
    return { data }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Network error' }
  }
}

export async function validateToken(dto: ValidateUserDto) {
  const url = `${APIUrl}/auth/validate-token`
  const { data, error } = await rawPost<UserEntity>(url, dto)
  if (error) {
    logger.error('Auth validate-token failed', { error })
    return { error }
  }
  return { data }
}

export async function getCurrentUser(session: CustomSession | null) {
  const url = `${APIUrl}/auth/me`
  const res = await performAuthRequest<UserEntity>(session, url, { method: 'GET' })
  if ('error' in res) return { error: res.error }
  return { data: res.data }
}
