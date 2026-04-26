'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useAuth } from '@/context/AuthProvider'
import { getRiskEventEvidence } from '@/requests/decisionSupport'
import { RiskAssociationEvidenceEntity } from '@/types/decisionSupport'

type UseRiskEventEvidenceResult = {
  evidence: RiskAssociationEvidenceEntity | null
  loading: boolean
  error: string | null
}

export function useRiskEventEvidence(companyId: string, eventId: string): UseRiskEventEvidenceResult {
  const { session: data, status } = useAuth()
  const [evidence, setEvidence] = useState<RiskAssociationEvidenceEntity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestTokenRef = useRef(0)

  const fetchEvidence = useCallback(async () => {
    const token = ++requestTokenRef.current

    if (!companyId || !eventId) {
      if (requestTokenRef.current === token) {
        setEvidence(null)
        setError(null)
        setLoading(false)
      }
      return
    }

    setLoading(true)
    setError(null)

    const res = await getRiskEventEvidence(data, companyId, eventId)

    if (requestTokenRef.current !== token) return

    if ('error' in res) {
      setEvidence(null)
      setError(res.error)
    } else {
      setEvidence(res.data)
    }

    setLoading(false)
  }, [data, companyId, eventId])

  useEffect(() => {
    if (status === 'authenticated') fetchEvidence()
    else if (status === 'unauthenticated') {
      requestTokenRef.current += 1
      setEvidence(null)
      setError(null)
      setLoading(false)
    }
  }, [fetchEvidence, status])

  return { evidence, loading, error }
}
