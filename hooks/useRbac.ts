'use client'

import { useSession } from 'next-auth/react'

import { CustomSession } from '@/types/auth'
import { CompanyRole } from '@/types/rbac'

export type UseRbacResult = {
  role: CompanyRole | undefined
  can: (allowedRoles: CompanyRole[]) => boolean
  isLoading: boolean
}

export function useRbac(): UseRbacResult {
  const { data, status } = useSession()
  const session = data as CustomSession | null
  const role = session?.user?.companyRole

  function can(allowedRoles: CompanyRole[]): boolean {
    if (!role) return false
    return allowedRoles.includes(role)
  }

  return {
    role,
    can,
    isLoading: status === 'loading',
  }
}
