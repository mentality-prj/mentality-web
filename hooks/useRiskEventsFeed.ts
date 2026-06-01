'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from 'next-intl'

import {
  applyRiskEventAction,
  getRiskEventDetailVM,
  getRiskEventsVM,
  resolveRiskEvent,
} from '@/requests/reportingClient'
import { RiskEventActionKind, RiskEventDetailVM, RiskEventVM } from '@/types/reporting'

import { useCompanyScope } from './useCompanyScope'

type UseRiskEventsFeedResult = {
  riskEvents: RiskEventVM[]
  loading: boolean
  error: string | null
  processingEventIds: Set<string>
  loadingDetailIds: Set<string>
  detailsByEventId: Record<string, RiskEventDetailVM | null>
  refresh: () => Promise<void>
  fetchDetails: (eventId: string) => Promise<RiskEventDetailVM | null>
  applyAction: (eventId: string, dto: { actionType: RiskEventActionKind; note?: string }) => Promise<boolean>
  resolveRisk: (eventId: string, dto: { note?: string }) => Promise<boolean>
}

export function useRiskEventsFeed(preferManagerScope = false): UseRiskEventsFeedResult {
  const locale = useLocale()
  const { session, status, isSystemAdmin, resolveCompanyId, companyScopeError } = useCompanyScope()
  const [riskEvents, setRiskEvents] = useState<RiskEventVM[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processingEventIds, setProcessingEventIds] = useState<Set<string>>(new Set())
  const [loadingDetailIds, setLoadingDetailIds] = useState<Set<string>>(new Set())
  const [detailsByEventId, setDetailsByEventId] = useState<Record<string, RiskEventDetailVM | null>>({})
  const requestTokenRef = useRef(0)
  const processingEventIdsRef = useRef<Set<string>>(new Set())
  const useAdminMode = isSystemAdmin && !preferManagerScope

  const riskEventMap = useMemo(() => new Map(riskEvents.map((event) => [event.id, event])), [riskEvents])

  const setProcessing = useCallback((eventId: string, processing: boolean) => {
    if (processing) {
      processingEventIdsRef.current.add(eventId)
    } else {
      processingEventIdsRef.current.delete(eventId)
    }

    setProcessingEventIds((previous) => {
      const next = new Set(previous)
      if (processing) {
        next.add(eventId)
      } else {
        next.delete(eventId)
      }
      return next
    })
  }, [])

  const refresh = useCallback(async () => {
    if (status !== 'authenticated') return

    const token = ++requestTokenRef.current
    setLoading(true)
    setError(null)

    const companyId = await resolveCompanyId()
    if (!companyId) {
      if (requestTokenRef.current === token) {
        if (companyScopeError) {
          setError(companyScopeError)
        }
        setRiskEvents([])
        setLoading(false)
      }
      return
    }

    const result = await getRiskEventsVM({ session, companyId, admin: useAdminMode, locale })
    if (requestTokenRef.current !== token) return

    if ('error' in result) {
      setError(result.error)
      setRiskEvents([])
      setLoading(false)
      return
    }

    setRiskEvents(result.data)
    setLoading(false)
  }, [companyScopeError, locale, resolveCompanyId, session, status, useAdminMode])

  const fetchDetails = useCallback(
    async (eventId: string): Promise<RiskEventDetailVM | null> => {
      const companyId = await resolveCompanyId()
      const baseEvent = riskEventMap.get(eventId)

      if (!companyId || !baseEvent) {
        return null
      }

      setLoadingDetailIds((previous) => {
        const next = new Set(previous)
        next.add(eventId)
        return next
      })

      const result = await getRiskEventDetailVM(baseEvent, { session, companyId, admin: useAdminMode, locale })

      setLoadingDetailIds((previous) => {
        const next = new Set(previous)
        next.delete(eventId)
        return next
      })

      if ('error' in result) {
        setError(result.error)
        return null
      }

      setDetailsByEventId((previous) => ({ ...previous, [eventId]: result.data }))
      return result.data
    },
    [locale, resolveCompanyId, riskEventMap, session, useAdminMode]
  )

  const applyAction = useCallback(
    async (eventId: string, dto: { actionType: RiskEventActionKind; note?: string }): Promise<boolean> => {
      const companyId = await resolveCompanyId()
      if (!companyId || processingEventIdsRef.current.has(eventId)) {
        return false
      }

      setProcessing(eventId, true)
      const result = await applyRiskEventAction({ session, companyId, admin: useAdminMode }, eventId, dto)
      setProcessing(eventId, false)

      if ('error' in result) {
        setError(result.error)
        return false
      }

      await refresh()
      return Boolean(result.data.success)
    },
    [refresh, resolveCompanyId, session, setProcessing, useAdminMode]
  )

  const resolveRisk = useCallback(
    async (eventId: string, dto: { note?: string }): Promise<boolean> => {
      const companyId = await resolveCompanyId()
      if (!companyId || processingEventIdsRef.current.has(eventId)) {
        return false
      }

      setProcessing(eventId, true)
      const result = await resolveRiskEvent({ session, companyId, admin: useAdminMode }, eventId, dto)
      setProcessing(eventId, false)

      if ('error' in result) {
        setError(result.error)
        return false
      }

      await refresh()
      return Boolean(result.data.success)
    },
    [refresh, resolveCompanyId, session, setProcessing, useAdminMode]
  )

  useEffect(() => {
    if (status === 'authenticated') {
      refresh()
    } else if (status === 'unauthenticated') {
      requestTokenRef.current += 1
      setRiskEvents([])
      setLoading(false)
      setError(null)
      setProcessingEventIds(new Set())
      processingEventIdsRef.current = new Set()
      setLoadingDetailIds(new Set())
      setDetailsByEventId({})
    }
  }, [refresh, status])

  return {
    riskEvents,
    loading,
    error,
    processingEventIds,
    loadingDetailIds,
    detailsByEventId,
    refresh,
    fetchDetails,
    applyAction,
    resolveRisk,
  }
}
