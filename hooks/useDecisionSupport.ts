'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { useAdminCompany } from '@/context/adminCompanyContext'

import { getMyCompany } from '@/requests/companies'
import {
  addressDecisionSupportRiskEvent,
  addressDecisionSupportRiskEventAdmin,
  getDecisionSupportReport,
  getDecisionSupportReportAdmin,
  getDecisionSupportRiskEvents,
  getDecisionSupportRiskEventsAdmin,
} from '@/requests/decisionSupport'
import { CustomSession } from '@/types/auth'
import { DecisionSupportReport, DecisionSupportRiskEvent } from '@/types/decisionSupport'

type UseDecisionSupportResult = {
  companyId: string | null
  report: DecisionSupportReport | null
  riskEvents: DecisionSupportRiskEvent[]
  loading: boolean
  error: string | null
  processingEventIds: Set<string>
  markAddressed: (eventId: string) => Promise<boolean>
  refresh: () => Promise<void>
}

export function useDecisionSupport(): UseDecisionSupportResult {
  const { session: data, status } = useAuth()
  const { companyId: adminCompanyId } = useAdminCompany()

  const [resolvedCompanyId, setResolvedCompanyId] = useState<string | null>(null)
  const [report, setReport] = useState<DecisionSupportReport | null>(null)
  const [riskEvents, setRiskEvents] = useState<DecisionSupportRiskEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processingEventIds, setProcessingEventIds] = useState<Set<string>>(new Set())
  const requestTokenRef = useRef(0)

  useEffect(() => {
    setResolvedCompanyId(null)
    setReport(null)
    setRiskEvents([])
    setError(null)
    setProcessingEventIds(new Set())
  }, [adminCompanyId])

  const refresh = useCallback(async () => {
    const token = ++requestTokenRef.current
    setLoading(true)
    setError(null)

    const session = data as CustomSession
    let companyId = adminCompanyId ?? resolvedCompanyId

    if (!companyId) {
      const myCompanyRes = await getMyCompany(session)
      if ('error' in myCompanyRes) {
        if (requestTokenRef.current === token) {
          setError(myCompanyRes.error)
          setLoading(false)
        }
        return
      }
      companyId = myCompanyRes.data.id
      if (requestTokenRef.current === token) {
        setResolvedCompanyId(companyId)
      }
    }

    const [reportRes, eventsRes] = await Promise.all([
      adminCompanyId ? getDecisionSupportReportAdmin(session, companyId) : getDecisionSupportReport(session, companyId),
      adminCompanyId
        ? getDecisionSupportRiskEventsAdmin(session, companyId)
        : getDecisionSupportRiskEvents(session, companyId),
    ])

    if (requestTokenRef.current !== token) return

    if ('error' in reportRes) {
      setError(reportRes.error)
      setLoading(false)
      return
    }

    if ('error' in eventsRes) {
      setError(eventsRes.error)
      setLoading(false)
      return
    }

    setReport(reportRes.data)
    setRiskEvents(eventsRes.data)
    setLoading(false)
  }, [adminCompanyId, data, resolvedCompanyId])

  useEffect(() => {
    if (status === 'authenticated') {
      refresh()
    } else if (status === 'unauthenticated') {
      setResolvedCompanyId(null)
      setReport(null)
      setRiskEvents([])
      setError(null)
      setLoading(false)
      setProcessingEventIds(new Set())
    }
  }, [status, refresh])

  const markAddressed = useCallback(
    async (eventId: string): Promise<boolean> => {
      const session = data as CustomSession
      const companyId = adminCompanyId ?? resolvedCompanyId
      if (!companyId) return false

      setProcessingEventIds((prev) => {
        const next = new Set(prev)
        next.add(eventId)
        return next
      })

      const res = adminCompanyId
        ? await addressDecisionSupportRiskEventAdmin(session, companyId, eventId, { addressed: true })
        : await addressDecisionSupportRiskEvent(session, companyId, eventId, { addressed: true })

      setProcessingEventIds((prev) => {
        const next = new Set(prev)
        next.delete(eventId)
        return next
      })

      if ('error' in res) {
        setError(res.error)
        return false
      }

      await refresh()
      return true
    },
    [adminCompanyId, data, refresh, resolvedCompanyId]
  )

  return {
    companyId: adminCompanyId ?? resolvedCompanyId,
    report,
    riskEvents,
    loading,
    error,
    processingEventIds,
    markAddressed,
    refresh,
  }
}
