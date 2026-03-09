import { CustomSession } from '@/types/auth'
import { K10ApiResponse, K10HistoryEntry, K10SubmitPayload } from '@/types/k10'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

/**
 * K10 API request utilities
 *
 * These functions provide type-safe wrappers around performAuthRequest for K10 endpoints.
 * They handle session context and error responses uniformly.
 *
 * DEAD CODE WARNING:
 * These functions are currently UNUSED in the TestPageGenerator flow. The useTestPageForm hook
 * constructs API calls directly via performAuthRequest using the apiEndpoint from TestConfig,
 * rather than calling these utilities. This creates:
 * - Duplicate logic for API requests (here vs. in useTestPageForm)
 * - Inconsistent patterns (tested functions vs. direct hook calls)
 * - Maintenance burden if K10 endpoints change
 *
 * TODO: Either:
 * 1. Refactor useTestPageForm to use submitK10, getK10Latest, getK10History, or
 * 2. Remove these functions and document the pattern of using performAuthRequest directly in hooks
 */

export async function submitK10(
  session: CustomSession | null,
  payload: K10SubmitPayload
): Promise<{ data?: K10ApiResponse; error?: string }> {
  const res = await performAuthRequest<K10ApiResponse>(session, `${APIUrl}/k10`, {
    method: 'POST',
    body: payload as unknown as Record<string, unknown>,
  })
  if ('error' in res) {
    return { error: res.status === 429 ? 'RATE_LIMITED' : res.error }
  }
  return { data: res.data }
}

export async function getK10Latest(
  session: CustomSession | null
): Promise<{ data?: K10ApiResponse | null; error?: string }> {
  const res = await performAuthRequest<K10ApiResponse | null>(session, `${APIUrl}/k10/latest`, {
    method: 'GET',
  })
  return 'error' in res ? { error: res.error } : { data: res.data }
}

export async function getK10History(
  session: CustomSession | null
): Promise<{ data?: K10HistoryEntry[]; error?: string }> {
  const res = await performAuthRequest<K10HistoryEntry[]>(session, `${APIUrl}/k10/history`, {
    method: 'GET',
  })
  return 'error' in res ? { error: res.error } : { data: res.data ?? [] }
}
