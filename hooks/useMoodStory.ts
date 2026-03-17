'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'

import { getLatestMoodStory } from '@/requests/moodStory'
import { MoodStoryEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'

const POLL_INTERVAL_MS = 2_000
const POLL_TIMEOUT_MS = 8_000

export type MoodStoryState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'polling' }
  | { status: 'success'; story: MoodStoryEntity }
  | { status: 'not-ready' }
  | { status: 'error' }

type LatestMoodStoryResult = Awaited<ReturnType<typeof getLatestMoodStory>>

export function useMoodStory() {
  const { data: session, status: sessionStatus } = useSession()
  const [state, setState] = useState<MoodStoryState>({ status: 'idle' })
  const pollStartRef = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fetchIdRef = useRef(0)
  const pendingFetchRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

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

  return { state, retry }
}
