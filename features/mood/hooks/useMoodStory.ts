'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/context/AuthProvider'

import { getAffirmationById } from '@/requests/affirmations'
import { getLatestMoodStory } from '@/requests/moodStory'
import { getTipById } from '@/requests/tips'
import { AffirmationEntity, MoodStoryEntity, TipEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

const POLL_INTERVAL_MS = 3_000
const POLL_TIMEOUT_MS = 60_000

export type MoodStoryState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'polling' }
  | { status: 'success'; story: MoodStoryEntity }
  | { status: 'not-ready' }
  | { status: 'error' }

export type RecommendedItems = {
  affirmation?: AffirmationEntity
  tip?: TipEntity
}

type LatestMoodStoryResult = Awaited<ReturnType<typeof getLatestMoodStory>>

export function useMoodStory() {
  const { session, status: sessionStatus } = useAuth()
  const [state, setState] = useState<MoodStoryState>({ status: 'idle' })
  const [recommended, setRecommended] = useState<RecommendedItems>({})
  const [recommendedLoading, setRecommendedLoading] = useState(false)
  const pollStartRef = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fetchIdRef = useRef(0)
  const fetchRecommendedIdRef = useRef(0)
  const pendingFetchRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const fetchRecommended = useCallback(
    async (story: MoodStoryEntity) => {
      const id = ++fetchRecommendedIdRef.current

      if (!session) {
        setRecommended({})
        setRecommendedLoading(false)
        return
      }

      const { recommendedAffirmationId, recommendedTipId } = story
      if (!recommendedAffirmationId && !recommendedTipId) {
        setRecommended({})
        setRecommendedLoading(false)
        return
      }
      setRecommendedLoading(true)
      const typedSession = session as CustomSession

      try {
        const [affirmationResult, tipResult] = await Promise.all([
          recommendedAffirmationId ? getAffirmationById(typedSession, recommendedAffirmationId) : null,
          recommendedTipId ? getTipById(typedSession, recommendedTipId) : null,
        ])

        if (id !== fetchRecommendedIdRef.current) return

        const items: RecommendedItems = {}
        if (affirmationResult && 'data' in affirmationResult) items.affirmation = affirmationResult.data
        if (tipResult && 'data' in tipResult) items.tip = tipResult.data

        setRecommended(items)
      } finally {
        if (id === fetchRecommendedIdRef.current) {
          setRecommendedLoading(false)
        }
      }
    },
    [session]
  )

  const fetchStory = useCallback(
    async (isPolling = false) => {
      if (!session) {
        if (sessionStatus === 'loading') {
          pendingFetchRef.current = true
          if (!isPolling) setState({ status: 'loading' })
        } else {
          setState({ status: 'error' })
        }
        return
      }

      const id = ++fetchIdRef.current

      if (!isPolling) {
        setState({ status: 'loading' })
        pollStartRef.current = null
      }

      const result: LatestMoodStoryResult = await getLatestMoodStory(session as CustomSession)

      if (id !== fetchIdRef.current) return

      if ('error' in result) {
        const httpStatus = result.status
        if (httpStatus === 404) {
          if (pollStartRef.current === null) pollStartRef.current = Date.now()
          if (Date.now() - pollStartRef.current < POLL_TIMEOUT_MS) {
            setState({ status: 'polling' })
            timerRef.current = setTimeout(() => fetchStory(true), POLL_INTERVAL_MS)
          } else {
            pollStartRef.current = null
            setState({ status: 'not-ready' })
          }
          return
        }
        setState({ status: 'error' })
        return
      }

      const story = result.data
      if (!story || story.screens.length === 0) {
        setState({ status: 'not-ready' })
        return
      }

      pollStartRef.current = null
      setState({ status: 'success', story })
    },
    [session, sessionStatus]
  )

  const retry = useCallback(() => {
    clearTimer()
    pollStartRef.current = null
    fetchRecommendedIdRef.current += 1
    setRecommended({})
    setRecommendedLoading(false)
    fetchStory(false)
  }, [clearTimer, fetchStory])

  useEffect(() => {
    if (sessionStatus === 'authenticated' && session && pendingFetchRef.current) {
      pendingFetchRef.current = false
      fetchStory(false)
    }
  }, [sessionStatus, session, fetchStory])

  useEffect(() => {
    if (pendingFetchRef.current && sessionStatus === 'unauthenticated') {
      pendingFetchRef.current = false
      clearTimer()
      setState({ status: 'error' })
    }
  }, [sessionStatus, clearTimer])

  useEffect(() => {
    return clearTimer
  }, [clearTimer])

  return { state, retry, fetchRecommended, recommended, recommendedLoading }
}
