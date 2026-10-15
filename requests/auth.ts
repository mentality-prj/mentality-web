import { logger } from '@/lib/logger'
import type { UserEntity } from '@/types/api-responses'
import type { BrowserAuthSession, CustomSession, CustomUser } from '@/types/auth'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

type RawJsonRequestResult<T> = { data: T } | { error: string; status?: number }

type AuthExchangeRequest =
  | {
      grantType: 'authorization_code'
      code: string
      codeVerifier: string
    }
  | {
      grantType: 'refresh_token'
    }

type AuthExchangeResponse = BrowserAuthSession

function getAuthApiBaseUrl() {
  return APIUrl.trim().replace(/\/+$/, '')
}

function extractRequestErrorMessage(payload: unknown, fallbackMessage: string): string {
  if (!payload || typeof payload !== 'object') {
    return fallbackMessage
  }

  if ('message' in payload && typeof payload.message === 'string') {
    return payload.message
  }

  if ('error' in payload && typeof payload.error === 'string') {
    return payload.error
  }

  return fallbackMessage
}

async function rawJsonRequest<T = unknown>(
  url: string,
  options: {
    method: 'GET' | 'POST' | 'DELETE'
    body?: unknown
    headers?: HeadersInit
  }
): Promise<RawJsonRequestResult<T>> {
  try {
    const headers = new Headers(options.headers)

    if (options.body !== undefined) {
      headers.set('Content-Type', 'application/json')
    }

    const resp = await fetch(url, {
      method: options.method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body ?? {}),
    })

    if (!resp.ok) {
      let message = resp.statusText
      try {
        const j = await resp.json()
        message = extractRequestErrorMessage(j, message)
      } catch {}

      return { error: message, status: resp.status }
    }

    const data = (await resp.json()) as T

    return { data }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Network error' }
  }
}

export async function getCurrentUser(session: CustomSession | null) {
  const url = `${getAuthApiBaseUrl()}/auth/me`
  const res = await performAuthRequest<UserEntity>(session, url, { method: 'GET' })
  if ('error' in res) return { error: res.error }
  return { data: res.data }
}

export async function exchangeAuthTokens(
  request: AuthExchangeRequest
): Promise<{ data: AuthExchangeResponse } | { error: string; status?: number }> {
  const result = await rawJsonRequest<AuthExchangeResponse>('/api/auth/exchange', {
    method: 'POST',
    body: request,
  })

  if ('error' in result) {
    logger.error('Auth exchange failed', { error: result.error, grantType: request.grantType, status: result.status })
    return result
  }

  return { data: result.data }
}

export async function fetchStoredAuthTokens(): Promise<BrowserAuthSession | null> {
  const result = await rawJsonRequest<BrowserAuthSession | null>('/api/auth/token', { method: 'GET' })
  if ('error' in result) {
    if (result.status === 401) return null
    throw new Error('Session metadata temporarily unavailable')
  }
  return result.data
}

/** Only verified user attributes reach browser state; never JWTs. */
export async function fetchAuthenticatedUser(): Promise<CustomUser | null> {
  const result = await rawJsonRequest<CustomUser>('/api/auth/session', { method: 'GET' })
  if ('error' in result) {
    if (result.status === 401 || result.status === 403) return null
    throw new Error('Session verification temporarily unavailable')
  }
  return result.data
}

export async function deleteStoredAuthTokens(): Promise<void> {
  const result = await rawJsonRequest<{ ok: boolean }>('/api/auth/token', { method: 'DELETE' })

  if ('error' in result) {
    logger.warn('Auth token delete failed', { error: result.error, status: result.status })
  }
}
