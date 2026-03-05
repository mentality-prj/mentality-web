'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale } from 'next-intl'

import {
  GAD7_HIGH_SCORE_THRESHOLD,
  GAD7_LEVEL_MAP,
  GAD7_RESUBMIT_COOLDOWN_MS,
  GAD7_TOTAL_QUESTIONS,
} from '@/constants/gad7'
import { getGad7Latest, submitGad7 } from '@/requests/gad7'
import { CustomSession } from '@/types/auth'
import { Gad7AnswerValue, Gad7ApiResponse, Gad7Level } from '@/types/gad7'

// ─── Pure calculations ──────────────────────────────────────────────────────

export function calculateGad7Score(answers: number[]): number {
  return answers.reduce((sum, val) => sum + val, 0)
}

export function getGad7Level(score: number): Gad7Level {
  const match = GAD7_LEVEL_MAP.find((s) => score >= s.min && score <= s.max)
  return match?.label ?? 'severe'
}

export function isHighAnxiety(score: number): boolean {
  return score >= GAD7_HIGH_SCORE_THRESHOLD
}

export function isWithin30Days(isoTimestamp: string): boolean {
  return Date.now() - new Date(isoTimestamp).getTime() < GAD7_RESUBMIT_COOLDOWN_MS
}

export function formatGad7Date(isoTimestamp: string, locale = 'en'): string {
  return new Date(isoTimestamp).toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

// ─── SessionStorage helpers ──────────────────────────────────────────────────

const STORAGE_KEY_PREFIX = 'gad7_last_submission_'
const getStorageKey = (userId: string): string => `${STORAGE_KEY_PREFIX}${userId}`

interface StoredGad7Submission {
  submittedAt: string
  result: Gad7ApiResponse
}

export function loadStoredGad7Submission(userId: string): StoredGad7Submission | null {
  try {
    const raw = sessionStorage.getItem(getStorageKey(userId))
    return raw ? (JSON.parse(raw) as StoredGad7Submission) : null
  } catch {
    return null
  }
}

export function saveGad7Submission(userId: string, submission: StoredGad7Submission): void {
  sessionStorage.setItem(getStorageKey(userId), JSON.stringify(submission))
}

export function clearGad7Submission(userId: string): void {
  sessionStorage.removeItem(getStorageKey(userId))
}

// ─── useGad7Form — step-by-step state + submission logic ────────────────────

/** step: 0..N-1 = questions, N = result */
export type Gad7Step = number

export interface UseGad7FormReturn {
  step: Gad7Step
  answers: (Gad7AnswerValue | null)[]
  isSubmitting: boolean
  result: Gad7ApiResponse | null
  error: string | null
  lastSubmittedAt: string | null
  resultRef: React.RefObject<HTMLDivElement | null>
  isCompletedRecently: boolean
  formattedLastSubmission: string | null
  handleAnswer: (value: Gad7AnswerValue) => void
  /** Set an answer at a specific index without auto-advancing (used in admin preview) */
  setAnswerAt: (index: number, value: Gad7AnswerValue) => void
  /** Submit with an explicit answers snapshot (used in admin preview) */
  submitAllAnswers: (latestAnswers: (Gad7AnswerValue | null)[]) => Promise<void>
  goBack: () => void
  handleReset: () => void
}

export function useGad7Form(userId: string): UseGad7FormReturn {
  const [step, setStep] = useState<Gad7Step>(0)
  const [answers, setAnswers] = useState<(Gad7AnswerValue | null)[]>(Array(GAD7_TOTAL_QUESTIONS).fill(null))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<Gad7ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastSubmittedAt, setLastSubmittedAt] = useState<string | null>(null)
  const resultRef = useRef<HTMLDivElement | null>(null)
  const { data: session } = useSession()
  const locale = useLocale()

  // Rehydrate from sessionStorage / fetch latest on mount
  useEffect(() => {
    const stored = loadStoredGad7Submission(userId)
    if (stored) {
      setResult(stored.result)
      setLastSubmittedAt(stored.submittedAt)
      setStep(GAD7_TOTAL_QUESTIONS)
      return
    }

    if (!session?.user) return

    getGad7Latest(session as CustomSession)
      .then(({ data }) => {
        if (data) {
          setResult(data)
          setLastSubmittedAt(data.submittedAt)
          saveGad7Submission(userId, { submittedAt: data.submittedAt, result: data })
          setStep(GAD7_TOTAL_QUESTIONS)
        }
      })
      .catch(() => {})
  }, [session, userId])

  const doSubmit = async (answersToSend: (Gad7AnswerValue | null)[]) => {
    setIsSubmitting(true)
    setError(null)

    try {
      if (!session?.user) throw new Error('UNEXPECTED_ERROR')

      const payload = answersToSend.map((a) => (a ?? 0) as Gad7AnswerValue)
      const { data, error: submitError } = await submitGad7(session as CustomSession, { answers: payload })

      if (submitError || !data) throw new Error(submitError ?? 'SUBMISSION_FAILED')

      setResult(data)
      setLastSubmittedAt(data.submittedAt)
      saveGad7Submission(userId, { submittedAt: data.submittedAt, result: data })
      setStep(GAD7_TOTAL_QUESTIONS)

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'UNEXPECTED_ERROR')
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitAllAnswers = (latestAnswers: (Gad7AnswerValue | null)[]) => doSubmit(latestAnswers)

  const setAnswerAt = (index: number, value: Gad7AnswerValue) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleAnswer = async (value: Gad7AnswerValue) => {
    const newAnswers = [...answers]
    newAnswers[step as number] = value
    setAnswers(newAnswers)

    const nextStep = (step as number) + 1
    await new Promise((r) => setTimeout(r, 250))
    // Advance to next question, or to the submit step (GAD7_TOTAL_QUESTIONS)
    setStep(nextStep)
  }

  const handleReset = () => {
    setResult(null)
    setAnswers(Array(GAD7_TOTAL_QUESTIONS).fill(null))
    setError(null)
    setLastSubmittedAt(null)
    setStep(0)
    clearGad7Submission(userId)
  }

  const goBack = () => {
    setStep((prev) => Math.max(0, (prev as number) - 1))
  }

  const isCompletedRecently = lastSubmittedAt ? isWithin30Days(lastSubmittedAt) : false
  const formattedLastSubmission = lastSubmittedAt ? formatGad7Date(lastSubmittedAt, locale) : null

  return {
    step,
    answers,
    isSubmitting,
    result,
    error,
    lastSubmittedAt,
    resultRef,
    isCompletedRecently,
    formattedLastSubmission,
    handleAnswer,
    setAnswerAt,
    submitAllAnswers,
    goBack,
    handleReset,
  }
}
