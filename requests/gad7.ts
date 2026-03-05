import { CustomSession } from '@/types/auth'
import { Gad7ApiResponse, Gad7HistoryEntry, Gad7SubmitPayload } from '@/types/gad7'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

export async function submitGad7(
  session: CustomSession | null,
  payload: Gad7SubmitPayload
): Promise<{ data?: Gad7ApiResponse; error?: string }> {
  const res = await performAuthRequest<Gad7ApiResponse>(session, `${APIUrl}/gad7`, {
    method: 'POST',
    body: payload as unknown as Record<string, unknown>,
  })
  if ('error' in res) {
    return { error: res.status === 429 ? 'RATE_LIMITED' : res.error }
  }
  return { data: res.data }
}

export async function getGad7Latest(
  session: CustomSession | null
): Promise<{ data?: Gad7ApiResponse | null; error?: string }> {
  const res = await performAuthRequest<Gad7ApiResponse | null>(session, `${APIUrl}/gad7/latest`, {
    method: 'GET',
  })
  return 'error' in res ? { error: res.error } : { data: res.data }
}

export async function getGad7History(): Promise<Gad7HistoryEntry[]> {
  // Server-side only — uses auth headers directly
  const { getAuthHeaders } = await import('@/actions/getAuthHeaders')
  const headers = await getAuthHeaders()
  const res = await fetch(`${APIUrl}/gad7/history`, { headers, cache: 'no-store' })
  if (!res.ok) throw new Error(`GAD-7 history fetch failed: ${res.status}`)
  return res.json() as Promise<Gad7HistoryEntry[]>
}
