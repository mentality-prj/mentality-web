'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'
import { useAdminCompany } from '@/context/adminCompanyContext'
import { compareRiskEventsBySeverityAndConfidence, toRiskEventViewModel } from '@/helpers/decisionSupport.helpers'

import { getMyCompany } from '@/requests/companies'
import {
  applyDecisionSupportRiskEventAction,
  applyDecisionSupportRiskEventActionAdmin,
  getDecisionSupportRiskEventOutcome,
  getDecisionSupportRiskEventOutcomeAdmin,
  getDecisionSupportRiskEvents,
  getDecisionSupportRiskEventsAdmin,
  resolveDecisionSupportRiskEvent,
  resolveDecisionSupportRiskEventAdmin,
} from '@/requests/decisionSupport'
import { CustomSession } from '@/types/auth'
import {
  DecisionSupportRiskEvent,
  ResolveRiskEventDto,
  RiskEventActionDto,
  RiskEventOutcome,
  RiskEventViewModel,
} from '@/types/decisionSupport'

type UseDecisionSupportResult = {
  companyId: string | null
  riskEvents: RiskEventViewModel[]
  loading: boolean
  error: string | null
  processingEventIds: Set<string>
  loadingOutcomeEventIds: Set<string>
  outcomeByEventId: Record<string, RiskEventOutcome | null>
  fetchRiskEventOutcome: (eventId: string) => Promise<RiskEventOutcome | null>
  applyAction: (eventId: string, dto: RiskEventActionDto) => Promise<boolean>
  resolveRisk: (eventId: string, dto: ResolveRiskEventDto) => Promise<boolean>
  refresh: () => Promise<void>
  clearError: () => void
}

export function useDecisionSupport(): UseDecisionSupportResult {
  const { session: data, status } = useAuth()
  const { companyId: adminCompanyId } = useAdminCompany()
  const locale = useLocale()

  const [resolvedCompanyId, setResolvedCompanyId] = useState<string | null>(null)
  const [riskEventsRaw, setRiskEventsRaw] = useState<DecisionSupportRiskEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processingEventIds, setProcessingEventIds] = useState<Set<string>>(new Set())
  const [loadingOutcomeEventIds, setLoadingOutcomeEventIds] = useState<Set<string>>(new Set())
  const [outcomeByEventId, setOutcomeByEventId] = useState<Record<string, RiskEventOutcome | null>>({})
  const requestTokenRef = useRef(0)
  const outcomeStaleTokenRef = useRef(0)
  const outcomeRequestByEventIdRef = useRef<Map<string, Promise<RiskEventOutcome | null>>>(new Map())
  const processingRefSet = useRef<Set<string>>(new Set())
  const resolvedCompanyIdRef = useRef<string | null>(null)

  const riskEvents = useMemo<RiskEventViewModel[]>(
    () =>
      riskEventsRaw.map((event) => toRiskEventViewModel(event, locale)).sort(compareRiskEventsBySeverityAndConfidence),
    [riskEventsRaw, locale]
  )

  const setEventProcessing = useCallback((eventId: string, processing: boolean) => {
    setProcessingEventIds((prev) => {
      const next = new Set(prev)
      if (processing) {
        next.add(eventId)
      } else {
        next.delete(eventId)
      }
      return next
    })
  }, [])

  useEffect(() => {
    requestTokenRef.current++
    outcomeStaleTokenRef.current++
    outcomeRequestByEventIdRef.current.clear()
    processingRefSet.current.clear()
    resolvedCompanyIdRef.current = null
    setResolvedCompanyId(null)
    setRiskEventsRaw([])
    setOutcomeByEventId({})
    setError(null)
    setLoading(false)
    setProcessingEventIds(new Set())
    setLoadingOutcomeEventIds(new Set())
  }, [adminCompanyId])

  const refresh = useCallback(async () => {
    const token = ++requestTokenRef.current
    setLoading(true)
    setError(null)

    const session = data as CustomSession
    let companyId = adminCompanyId ?? resolvedCompanyIdRef.current

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
        resolvedCompanyIdRef.current = companyId
        setResolvedCompanyId(companyId)
      }
    }

    const eventsRes = adminCompanyId
      ? await getDecisionSupportRiskEventsAdmin(session, companyId)
      : await getDecisionSupportRiskEvents(session, companyId)

    if (requestTokenRef.current !== token) return

    if ('error' in eventsRes) {
      setError(eventsRes.error)
      setLoading(false)
      return
    }

    setRiskEventsRaw(eventsRes.data)
    setLoading(false)
  }, [adminCompanyId, data])

  const fetchRiskEventOutcome = useCallback(
    async (eventId: string): Promise<RiskEventOutcome | null> => {
      const session = data as CustomSession
      const companyId = adminCompanyId ?? resolvedCompanyIdRef.current
      if (!companyId) return null

      const inFlight = outcomeRequestByEventIdRef.current.get(eventId)
      if (inFlight) {
        return inFlight
      }

      const requestPromise = (async () => {
        const staleToken = outcomeStaleTokenRef.current

        setLoadingOutcomeEventIds((prev) => {
          const next = new Set(prev)
          next.add(eventId)
          return next
        })

        setError(null)

        try {
          const res = adminCompanyId
            ? await getDecisionSupportRiskEventOutcomeAdmin(session, companyId, eventId)
            : await getDecisionSupportRiskEventOutcome(session, companyId, eventId)

          if (outcomeStaleTokenRef.current !== staleToken) return null

          if ('error' in res) {
            setError(res.error)
            return null
          }

          setOutcomeByEventId((prev) => ({ ...prev, [eventId]: res.data }))
          return res.data
        } finally {
          setLoadingOutcomeEventIds((prev) => {
            const next = new Set(prev)
            next.delete(eventId)
            return next
          })
        }
      })()

      outcomeRequestByEventIdRef.current.set(eventId, requestPromise)

      try {
        return await requestPromise
      } finally {
        if (outcomeRequestByEventIdRef.current.get(eventId) === requestPromise) {
          outcomeRequestByEventIdRef.current.delete(eventId)
        }
      }
    },
    [adminCompanyId, data]
  )

  useEffect(() => {
    if (status === 'authenticated') {
      refresh()
    } else if (status === 'unauthenticated') {
      requestTokenRef.current++
      outcomeStaleTokenRef.current++
      outcomeRequestByEventIdRef.current.clear()
      processingRefSet.current.clear()
      resolvedCompanyIdRef.current = null
      setResolvedCompanyId(null)
      setRiskEventsRaw([])
      setOutcomeByEventId({})
      setError(null)
      setLoading(false)
      setProcessingEventIds(new Set())
      setLoadingOutcomeEventIds(new Set())
    }
  }, [status, refresh])

  const applyAction = useCallback(
    async (eventId: string, dto: RiskEventActionDto): Promise<boolean> => {
      const session = data as CustomSession
      const companyId = adminCompanyId ?? resolvedCompanyIdRef.current
      if (!companyId) return false
      if (processingRefSet.current.has(eventId)) return false
      processingRefSet.current.add(eventId)

      setEventProcessing(eventId, true)
      setError(null)

      const res = adminCompanyId
        ? await applyDecisionSupportRiskEventActionAdmin(session, companyId, eventId, dto)
        : await applyDecisionSupportRiskEventAction(session, companyId, eventId, dto)

      processingRefSet.current.delete(eventId)
      setEventProcessing(eventId, false)

      if ('error' in res) {
        setError(res.error)
        return false
      }

      await Promise.all([refresh(), fetchRiskEventOutcome(eventId)])
      return true
    },
    [adminCompanyId, data, fetchRiskEventOutcome, refresh, setEventProcessing]
  )

  const resolveRisk = useCallback(
    async (eventId: string, dto: ResolveRiskEventDto): Promise<boolean> => {
      const session = data as CustomSession
      const companyId = adminCompanyId ?? resolvedCompanyIdRef.current
      if (!companyId) return false
      if (processingRefSet.current.has(eventId)) return false
      processingRefSet.current.add(eventId)

      setEventProcessing(eventId, true)
      setError(null)

      const res = adminCompanyId
        ? await resolveDecisionSupportRiskEventAdmin(session, companyId, eventId, dto)
        : await resolveDecisionSupportRiskEvent(session, companyId, eventId, dto)

      processingRefSet.current.delete(eventId)
      setEventProcessing(eventId, false)

      if ('error' in res) {
        setError(res.error)
        return false
      }

      await Promise.all([refresh(), fetchRiskEventOutcome(eventId)])
      return true
    },
    [adminCompanyId, data, fetchRiskEventOutcome, refresh, setEventProcessing]
  )

  return {
    companyId: adminCompanyId ?? resolvedCompanyId,
    riskEvents,
    loading,
    error,
    processingEventIds,
    loadingOutcomeEventIds,
    outcomeByEventId,
    fetchRiskEventOutcome,
    applyAction,
    resolveRisk,
    refresh,
    clearError: () => setError(null),
  }
}
