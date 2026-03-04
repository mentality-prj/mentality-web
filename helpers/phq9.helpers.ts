'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useLocale } from 'next-intl'

import { TestAnswers } from '@/components/features/TestsQuestionnarie/helper'
import { PHQ9_CRISIS_QUESTION_INDEX, PHQ9_SEVERITY_MAP, PHQ9_TEST_CONFIG } from '@/constants/phq9'
import { getPhq9Latest, submitPhq9 } from '@/requests/phq9'
import { CustomSession } from '@/types/auth'
import { Phq9AnswerValue, Phq9ApiResponse, Phq9HistoryEntry, Phq9Severity } from '@/types/phq9'

// ─── Pure calculations ──────────────────────────────────────────────────────

export function calculatePhq9Score(answers: number[]): number {
  return answers.reduce((sum, val) => sum + val, 0)
}

export function getPhq9Severity(score: number): Phq9Severity {
  const match = PHQ9_SEVERITY_MAP.find((s) => score >= s.min && score <= s.max)
  return match?.label ?? 'severe'
}

/** Convert PHQ-9 score (0–27, higher = worse) to a 0–100 Mentality Index (higher = better) */
export function calculateMentalityIndex(score: number): number {
  return Math.round((1 - score / 27) * 100)
}

/** Number of consecutive weeks with at least one submission, counting back from the most recent. */
export function calculateStreak(history: Phq9HistoryEntry[]): number {
  if (history.length === 0) return 0

  const WEEK_MS = 7 * 24 * 60 * 60 * 1000

  const getWeekStart = (date: Date): number => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    d.setDate(diff)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  }

  const weekStarts = [...new Set(history.map((e) => getWeekStart(new Date(e.date))))].sort((a, b) => a - b)

  // Streak must end at current or previous week
  const currentWeekStart = getWeekStart(new Date())
  if (weekStarts[weekStarts.length - 1] < currentWeekStart - WEEK_MS) return 0

  let streak = 1
  for (let i = weekStarts.length - 1; i > 0; i--) {
    if (weekStarts[i as number] - weekStarts[i - 1] === WEEK_MS) streak++
    else break
  }
  return streak
}

/** Returns true if the most recent history entry is ≥5 points worse than currentScore (i.e. user improved). */
export function hasImprovedBy5(history: Phq9HistoryEntry[], currentScore: number): boolean {
  if (history.length === 0) return false
  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  // If last entry matches current score it's likely the same submission — use second-to-last
  const ref =
    sorted.length >= 2 && sorted[sorted.length - 1].score === currentScore
      ? sorted[sorted.length - 2]
      : sorted[sorted.length - 1]
  return ref.score - currentScore >= 5
}

// ─── Time helpers ────────────────────────────────────────────────────────────

export function isWithin24Hours(isoTimestamp: string): boolean {
  return Date.now() - new Date(isoTimestamp).getTime() < 24 * 60 * 60 * 1000
}

export function isWithinCurrentWeek(isoTimestamp: string): boolean {
  const then = new Date(isoTimestamp)
  const startOfWeek = new Date()
  const day = startOfWeek.getDay()
  // Monday-based week — consistent with calculateStreak
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
  startOfWeek.setDate(diff)
  startOfWeek.setHours(0, 0, 0, 0)
  return then >= startOfWeek
}

export function formatSubmissionDate(isoTimestamp: string, locale = 'en'): string {
  return new Date(isoTimestamp).toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── SessionStorage helpers ──────────────────────────────────────────────────

const STORAGE_KEY_PREFIX = 'phq9_last_submission_'
const getStorageKey = (userId: string): string => `${STORAGE_KEY_PREFIX}${userId}`

interface StoredSubmission {
  submittedAt: string
  result: Phq9ApiResponse
}

export function loadStoredSubmission(userId: string): StoredSubmission | null {
  try {
    const raw = sessionStorage.getItem(getStorageKey(userId))
    return raw ? (JSON.parse(raw) as StoredSubmission) : null
  } catch {
    return null
  }
}

export function saveSubmission(userId: string, submission: StoredSubmission): void {
  sessionStorage.setItem(getStorageKey(userId), JSON.stringify(submission))
}

export function clearSubmission(userId: string): void {
  sessionStorage.removeItem(getStorageKey(userId))
}

// ─── Answers helpers ─────────────────────────────────────────────────────────

/** Convert Record<questionId, number> → ordered Phq9AnswerValue[] for API payload */
export function answersRecordToArray(answers: TestAnswers): Phq9AnswerValue[] {
  return PHQ9_TEST_CONFIG.questions.map((q) => {
    const raw = answers[q.id]
    // Only accept finite numbers; default to 0 otherwise
    if (typeof raw !== 'number' || !Number.isFinite(raw)) {
      return 0 as Phq9AnswerValue
    }
    // Clamp to valid PHQ-9 range [0, 3]
    const clamped = Math.max(0, Math.min(3, raw))
    return clamped as Phq9AnswerValue
  })
}

/** All 9 questions answered */
export function isPhq9Complete(answers: TestAnswers): boolean {
  return PHQ9_TEST_CONFIG.questions.every((q) => answers[q.id] !== undefined)
}

/** Q9 (index 8) > 0 → crisis notice should be shown */
export function hasCrisisAnswer(answers: number[]): boolean {
  return (answers.at(PHQ9_CRISIS_QUESTION_INDEX) ?? 0) > 0
}

// ─── usePhq9Form — all state + submission logic ──────────────────────────────

export interface UsePhq9FormReturn {
  answers: TestAnswers
  isSubmitting: boolean
  result: Phq9ApiResponse | null
  error: string | null
  lastSubmittedAt: string | null
  resultRef: React.RefObject<HTMLDivElement | null>
  allAnswered: boolean
  canSubmit: boolean
  isCompletedThisWeek: boolean
  formattedLastSubmission: string | null
  handleChange: (questionId: string, value: number | boolean) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleReset: () => void
}

export function usePhq9Form(userId: string): UsePhq9FormReturn {
  const [answers, setAnswers] = useState<TestAnswers>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<Phq9ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastSubmittedAt, setLastSubmittedAt] = useState<string | null>(null)
  const resultRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const { data: session } = useSession()
  const locale = useLocale()

  useEffect(() => {
    const stored = loadStoredSubmission(userId)
    if (stored) {
      setResult(stored.result)
      setLastSubmittedAt(stored.submittedAt)
      return
    }

    // No sessionStorage — fetch latest from backend (e.g. fresh browser session)
    if (!session?.user) {
      // Avoid triggering unauthorized requests while the session is loading or absent
      return
    }
    getPhq9Latest(session as CustomSession)
      .then(({ data }) => {
        if (data) {
          setResult(data)
          setLastSubmittedAt(data.submittedAt)
          saveSubmission(userId, { submittedAt: data.submittedAt, result: data })
        }
      })
      .catch(() => {})
  }, [session, userId])

  const handleChange = (questionId: string, value: number | boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const allAnswered = isPhq9Complete(answers)
  const canSubmit =
    !!session?.user &&
    allAnswered &&
    !isSubmitting &&
    !result &&
    (lastSubmittedAt ? !isWithin24Hours(lastSubmittedAt) : true)
  const isCompletedThisWeek = lastSubmittedAt ? isWithinCurrentWeek(lastSubmittedAt) : false
  const formattedLastSubmission = lastSubmittedAt ? formatSubmissionDate(lastSubmittedAt, locale) : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    if (!session?.user) {
      setError('UNEXPECTED_ERROR')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const { data, error } = await submitPhq9(session as CustomSession, { answers: answersRecordToArray(answers) })

      if (error || !data) {
        throw new Error(error ?? 'SUBMISSION_FAILED')
      }

      setResult(data)
      setLastSubmittedAt(data.submittedAt)
      saveSubmission(userId, { submittedAt: data.submittedAt, result: data })
      router.refresh()

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'UNEXPECTED_ERROR')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setAnswers({})
    setError(null)
    setLastSubmittedAt(null)
    clearSubmission(userId)
  }

  return {
    answers,
    isSubmitting,
    result,
    error,
    lastSubmittedAt,
    resultRef,
    allAnswered,
    canSubmit,
    isCompletedThisWeek,
    formattedLastSubmission,
    handleChange,
    handleSubmit,
    handleReset,
  }
}
