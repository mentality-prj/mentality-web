import { signOut } from 'next-auth/react'

import type { CustomSession } from '@/types/auth'

import { apiRequest, ApiRequestOptions } from './api-wrapper'

export async function apiRequestWithAuth<T>(
  session: CustomSession | null,
  url: string,
  options?: ApiRequestOptions
): Promise<{ data?: T; headers?: Headers; error?: unknown }> {
  const result = await apiRequest<T>(session, url, options)
  if (result.error?.status === 401) {
    signOut()
  }
  return result
}
