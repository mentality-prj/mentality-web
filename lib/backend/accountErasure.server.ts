import { APIUrl } from '@/requests/config'

import 'server-only'

const REQUEST_TIMEOUT_MS = 20_000
const UPSTREAM_PATH = '/auth/me/account-erasure'

/**
 * Dedicated server-only transport for the consent/erasure endpoint.
 * Never import into Client Components, and never send ID tokens to JS.
 */
export async function requestAccountErasureBackend(
  bearer: string,
  method: 'GET' | 'POST',
  body?: { confirmation: string; idToken: string }
): Promise<Response> {
  return fetch(`${APIUrl.trim().replace(/\/+$/, '')}${UPSTREAM_PATH}`, {
    method,
    headers: {
      Authorization: `Bearer ${bearer}`,
      ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(method === 'POST' ? { body: JSON.stringify(body) } : {}),
    redirect: 'manual',
    cache: 'no-store',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
}
