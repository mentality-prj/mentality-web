import { logger } from '@/lib/logger'
import type { UserEntity, ValidateUserDto } from '@/types/api-responses'
import type { AuthTokens, CustomSession, UserAI } from '@/types/auth'

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

type AuthExchangeResponse = {
  access_token: string
  id_token: string
  refresh_token?: string
  expires_in: number
}

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

export async function validateToken(dto: ValidateUserDto) {
  const url = `${getAuthApiBaseUrl()}/auth/validate-token`
  const result = await rawJsonRequest<UserEntity>(url, { method: 'POST', body: dto })

  if ('error' in result) {
    logger.error('Auth validate-token failed', { error: result.error, status: result.status })
    return { error: result.error }
  }

  return { data: result.data }
}

export async function getCurrentUser(session: CustomSession | null) {
  const url = `${getAuthApiBaseUrl()}/auth/me`
  const res = await performAuthRequest<UserEntity>(session, url, { method: 'GET' })
  if ('error' in res) return { error: res.error }
  return { data: res.data }
}

export async function validateAccessToken(accessToken: string): Promise<{ data: UserAI } | { error: string }> {
  const result = await rawJsonRequest<UserAI>(`${getAuthApiBaseUrl()}/auth/validate-token`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if ('error' in result) {
    logger.error('Auth access-token validation failed', { error: result.error, status: result.status })
    return { error: result.error }
  }

  if (!result.data?._id) {
    logger.error('Auth access-token validation returned invalid payload')
    return { error: 'Invalid user payload' }
  }

  return { data: result.data }
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

export async function storeAuthTokens(
  tokens: AuthTokens
): Promise<{ data: { ok: boolean } } | { error: string; status?: number }> {
  const result = await rawJsonRequest<{ ok: boolean }>('/api/auth/token', {
    method: 'POST',
    body: tokens,
  })

  if ('error' in result) {
    logger.error('Auth token store failed', { error: result.error, status: result.status })
    return result
  }

  return { data: result.data }
}

export async function fetchStoredAuthTokens(): Promise<AuthTokens | null> {
  const result = await rawJsonRequest<AuthTokens | null>('/api/auth/token', { method: 'GET' })

  if ('error' in result) {
    return null
  }

  return result.data
}

export async function deleteStoredAuthTokens(): Promise<void> {
  const result = await rawJsonRequest<{ ok: boolean }>('/api/auth/token', { method: 'DELETE' })

  if ('error' in result) {
    logger.warn('Auth token delete failed', { error: result.error, status: result.status })
  }
}
