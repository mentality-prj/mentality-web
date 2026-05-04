'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useAuth } from '@/context/AuthProvider'
import { getPolicyAudit, getPolicyMetrics } from '@/requests/decisionSupport'
import { CustomSession } from '@/types/auth'
import { PolicyAuditEntry, PolicyMetrics } from '@/types/decisionSupport'
import { Roles } from '@/types/security'

type UseAdminPolicyEngineResult = {
  metrics: PolicyMetrics | null
  audit: PolicyAuditEntry[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useAdminPolicyEngine(): UseAdminPolicyEngineResult {
  const { session: data, status } = useAuth()
  const [metrics, setMetrics] = useState<PolicyMetrics | null>(null)
  const [audit, setAudit] = useState<PolicyAuditEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestTokenRef = useRef(0)

  const refresh = useCallback(async () => {
    const token = ++requestTokenRef.current
    const session = data as CustomSession
    if (session?.user?.role !== Roles.ADMIN) {
      setMetrics(null)
      setAudit([])
      setError(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const [metricsRes, auditRes] = await Promise.all([getPolicyMetrics(session), getPolicyAudit(session)])

    if (requestTokenRef.current !== token) return

    setLoading(false)

    if ('error' in metricsRes) {
      setError(metricsRes.error)
      return
    }

    if ('error' in auditRes) {
      setError(auditRes.error)
      return
    }

    setMetrics(metricsRes.data)
    setAudit(auditRes.data)
  }, [data])

  useEffect(() => {
    if (status === 'authenticated') {
      refresh()
    } else if (status === 'unauthenticated') {
      requestTokenRef.current++
      setMetrics(null)
      setAudit([])
      setError(null)
      setLoading(false)
    }
  }, [status, refresh])

  return { metrics, audit, loading, error, refresh }
}
