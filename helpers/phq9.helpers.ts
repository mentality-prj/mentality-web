'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { TestAnswers } from '@/components/features/TestsQuestionnarie/helper'
import { PHQ9_CRISIS_QUESTION_INDEX, PHQ9_SEVERITY_MAP, PHQ9_TEST_CONFIG } from '@/constants/phq9'
import { getPhq9Latest, submitPhq9 } from '@/requests/phq9'
import { Phq9ApiResponse, Phq9HistoryEntry, Phq9Severity } from '@/types/phq9'

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
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  return then >= startOfWeek
}

export function formatSubmissionDate(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── SessionStorage helpers ──────────────────────────────────────────────────

const STORAGE_KEY = 'phq9_last_submission'

interface StoredSubmission {
  submittedAt: string
  result: Phq9ApiResponse
}

export function loadStoredSubmission(): StoredSubmission | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredSubmission) : null
  } catch {
    return null
  }
}

export function saveSubmission(submission: StoredSubmission): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(submission))
}

export function clearSubmission(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}

// ─── Answers helpers ─────────────────────────────────────────────────────────

/** Convert Record<questionId, number> → ordered number[] for API payload */
export function answersRecordToArray(answers: TestAnswers): number[] {
  return PHQ9_TEST_CONFIG.questions.map((q) => (answers[q.id] as number | undefined) ?? 0)
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

  useEffect(() => {
    const stored = loadStoredSubmission()
    if (stored) {
      setResult(stored.result)
      setLastSubmittedAt(stored.submittedAt)
      return
    }

    // No sessionStorage — fetch latest from backend (e.g. fresh browser session)
    getPhq9Latest()
      .then(({ data }) => {
        if (data) {
          setResult(data)
          setLastSubmittedAt(data.submittedAt)
          saveSubmission({ submittedAt: data.submittedAt, result: data })
        }
      })
      .catch(() => {})
  }, [])

  const handleChange = (questionId: string, value: number | boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const allAnswered = isPhq9Complete(answers)
  const canSubmit =
    allAnswered && !isSubmitting && !result && (lastSubmittedAt ? !isWithin24Hours(lastSubmittedAt) : true)
  const isCompletedThisWeek = lastSubmittedAt ? isWithinCurrentWeek(lastSubmittedAt) : false
  const formattedLastSubmission = lastSubmittedAt ? formatSubmissionDate(lastSubmittedAt) : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setIsSubmitting(true)
    setError(null)

    try {
      const { data, status, error } = await submitPhq9({ answers: answersRecordToArray(answers) })

      if (status === 429) {
        throw new Error('429')
      }

      if (error || !data) {
        throw new Error(error ?? 'Submission failed. Please try again.')
      }

      setResult(data)
      setLastSubmittedAt(data.submittedAt)
      saveSubmission({ submittedAt: data.submittedAt, result: data })
      router.refresh()

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setAnswers({})
    setError(null)
    setLastSubmittedAt(null)
    clearSubmission()
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
