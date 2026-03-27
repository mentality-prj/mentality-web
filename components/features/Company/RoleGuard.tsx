'use client'

import { ReactNode } from 'react'

import { useRbac } from '@/hooks/useRbac'
import { CompanyRole } from '@/types/rbac'

type RoleGuardProps = {
  allowedRoles: CompanyRole[]
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { can, isLoading } = useRbac()

  if (isLoading) return null
  if (!can(allowedRoles)) return <>{fallback}</>
  return <>{children}</>
}
