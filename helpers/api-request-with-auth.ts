import { signOut } from 'next-auth/react'

import type { CustomSession } from '@/types/auth'

import { apiRequest, ApiRequestOptions, ApiWrapperResult } from './api-wrapper'

export async function apiRequestWithAuth<T>(
  session: CustomSession | null,
  url: string,
  options?: ApiRequestOptions,
  opts?: { autoSignOutOn401?: boolean }
): Promise<ApiWrapperResult<T>> {
  const result = await apiRequest<T>(session, url, options)
  const shouldAutoSignOut = opts?.autoSignOutOn401 ?? true
  if (shouldAutoSignOut && result.error?.status === 401) {
    signOut()
  }
  return result
}
