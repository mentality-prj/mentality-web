import { CustomSession } from '@/types/auth'
import { Phq9ApiResponse, Phq9HistoryEntry, Phq9SubmitPayload } from '@/types/phq9'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

export async function submitPhq9(
  session: CustomSession | null,
  payload: Phq9SubmitPayload
): Promise<{ data?: Phq9ApiResponse; error?: string }> {
  const res = await performAuthRequest<Phq9ApiResponse>(session, `${APIUrl}/phq9`, {
    method: 'POST',
    body: payload as unknown as Record<string, unknown>,
  })
  if ('error' in res) {
    return { error: res.status === 429 ? 'RATE_LIMITED' : res.error }
  }
  return { data: res.data }
}

export async function getPhq9Latest(
  session: CustomSession | null
): Promise<{ data?: Phq9ApiResponse | null; error?: string }> {
  const res = await performAuthRequest<Phq9ApiResponse | null>(session, `${APIUrl}/phq9/latest`, {
    method: 'GET',
  })
  return 'error' in res ? { error: res.error } : { data: res.data }
}

export async function getPhq9History(
  session: CustomSession | null
): Promise<{ data?: Phq9HistoryEntry[]; error?: string }> {
  const res = await performAuthRequest<Phq9HistoryEntry[]>(session, `${APIUrl}/phq9/history`, {
    method: 'GET',
  })
  return 'error' in res ? { error: res.error } : { data: res.data ?? [] }
}
