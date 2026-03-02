import { Phq9ApiResponse, Phq9HistoryEntry, Phq9SubmitPayload } from '@/types/phq9'

import { APPUrl } from './config'

export async function submitPhq9(
  payload: Phq9SubmitPayload
): Promise<{ data?: Phq9ApiResponse; error?: string; status?: number }> {
  const res = await fetch(`${APPUrl}/phq9`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body: { message?: string } = await res.json().catch(() => ({}))
    return { status: res.status, error: body?.message ?? 'Submission failed. Please try again.' }
  }

  const data: Phq9ApiResponse = await res.json()
  return { data }
}

export async function getPhq9Latest(): Promise<{ data?: Phq9ApiResponse | null; error?: string }> {
  const res = await fetch(`${APPUrl}/phq9/latest`)

  if (!res.ok) {
    return { error: 'Failed to fetch latest result.' }
  }

  const data: Phq9ApiResponse | null = await res.json()
  return { data }
}

export async function getPhq9History(): Promise<{ data?: Phq9HistoryEntry[]; error?: string }> {
  const res = await fetch(`${APPUrl}/phq9/history`)

  if (!res.ok) {
    return { error: 'Failed to fetch history.' }
  }

  const data: Phq9HistoryEntry[] = await res.json()
  return { data }
}
