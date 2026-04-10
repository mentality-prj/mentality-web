'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale } from 'next-intl'

import { routing } from '@/i18n/routing'
import { APIUrl } from '@/requests/config'
import { performAuthRequest } from '@/requests/genericFetch'
import { CustomSession } from '@/types/auth'

import { TestAnswers } from '../helper'
import { ChoiceType, TestConfig } from '../typesTestPage'

// ─── SessionStorage helpers ──────────────────────────────────────────────────

const STORAGE_KEY_PREFIX = 'test_submission_'

function getStorageKey(testId: string, userId: string, locale: string): string {
  return `${STORAGE_KEY_PREFIX}${testId}_${userId}_${locale}`
}

interface StoredSubmission {
  submittedAt: string
  result: TestSubmissionResult
}

function loadStored(testId: string, userId: string, locale: string): StoredSubmission | null {
  try {
    const raw = sessionStorage.getItem(getStorageKey(testId, userId, locale))
    return raw ? (JSON.parse(raw) as StoredSubmission) : null
  } catch {
    return null
  }
}

function saveStored(testId: string, userId: string, locale: string, data: StoredSubmission): void {
  sessionStorage.setItem(getStorageKey(testId, userId, locale), JSON.stringify(data))
}

function clearStored(testId: string, userId: string, locale: string): void {
  sessionStorage.removeItem(getStorageKey(testId, userId, locale))
}

// ─── Score computation ────────────────────────────────────────────────────────

function computeLocalScore<T extends ChoiceType>(test: TestConfig<T>, answers: TestAnswers): number {
  if (test.type === 'checkbox') {
    const checkboxTest = test as TestConfig<'checkbox'>
    return checkboxTest.questions.reduce((sum, q) => {
      if (!answers[q.id]) return sum
      const weight = checkboxTest.groupWeights?.[q.group] ?? 1
      return sum + weight
    }, 0)
  }
  return (test as TestConfig<'radio'>).questions.reduce(
    (sum, q) => sum + ((answers[q.id] as number | undefined) ?? 0),
    0
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TestSubmissionResult {
  score: number
  label: string
  submittedAt: string
  /** Summary/recommendation text extracted from the API response (e.g. aiSummary, recommendation) */
  summaryText?: string
  /** Alert/crisis text extracted from the API response (e.g. crisisNotice) */
  alertText?: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeLabelFromMapping<T extends ChoiceType>(test: TestConfig<T>, score: number): string {
  return test.resultMapping.find(({ min, max }) => score >= min && score <= max)?.label ?? ''
}

function extractLocalizedField(raw: Record<string, unknown>, key: string, locale: string): string | undefined {
  const val = raw[key as string]
  if (typeof val === 'string' && val.length > 0) return val
  if (val !== null && typeof val === 'object') {
    const map = val as Record<string, unknown>
    const localized = map[locale as string]
    if (typeof localized === 'string' && localized.length > 0) return localized
    const fallback = map[routing.defaultLocale]
    if (typeof fallback === 'string' && fallback.length > 0) return fallback
  }
  return undefined
}

function buildResultFromRaw<T extends ChoiceType>(
  test: TestConfig<T>,
  raw: Record<string, unknown>,
  locale: string
): TestSubmissionResult {
  const score = typeof raw.score === 'number' ? raw.score : 0
  const submittedAt = typeof raw.submittedAt === 'string' ? raw.submittedAt : new Date().toISOString()
  return {
    score,
    label: computeLabelFromMapping(test, score),
    submittedAt,
    summaryText: test.summaryField ? extractLocalizedField(raw, test.summaryField, locale) : undefined,
    alertText: test.alertField ? extractLocalizedField(raw, test.alertField, locale) : undefined,
  }
}

export interface UseTestPageFormReturn {
  step: number
  setStep: React.Dispatch<React.SetStateAction<number>>
  answers: TestAnswers
  setAnswers: React.Dispatch<React.SetStateAction<TestAnswers>>
  isSubmitting: boolean
  result: TestSubmissionResult | null
  isCooldown: boolean
  error: string | null
  resultRef: React.RefObject<HTMLDivElement | null>
  handleReset: () => void
  submitAnswers: (finalAnswers: TestAnswers) => Promise<void>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTestPageForm<T extends ChoiceType>(test: TestConfig<T>, userId: string): UseTestPageFormReturn {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<TestAnswers>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<TestSubmissionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const resultRef = useRef<HTMLDivElement | null>(null)
  const { data: session } = useSession()
  const locale = useLocale()

  // Rehydrate from sessionStorage; fall back to fetching /latest from backend.
  // The storage key includes locale so switching languages always fetches a fresh result.
  useEffect(() => {
    if (!userId || !test.apiEndpoint) return
    const stored = loadStored(test.id, userId, locale)
    if (stored) {
      setResult(stored.result)
      return
    }
    if (!session?.user) return
    void performAuthRequest<Record<string, unknown>>(session as CustomSession, `${APIUrl}/${test.apiEndpoint}/latest`, {
      method: 'GET',
    }).then((res) => {
      if ('error' in res || !res.data) return
      const result = buildResultFromRaw(test, res.data, locale)
      setResult(result)
      saveStored(test.id, userId, locale, { submittedAt: result.submittedAt, result })
    })
    /*
    DEPENDENCY ARRAY NOTE:
    The current dependency array includes `test` (an object), which is constructed inline
    in the parent page component. On every render, the test object is recreated with a new
    reference, even though its properties are identical. This causes the effect to re-run
    unnecessarily, potentially triggering multiple API calls for the same test.

    RECOMMENDATION: Replace `test` with specific primitives: [test.id, test.apiEndpoint, session, userId]
    This ensures the effect only re-runs if the test ID or endpoint actually changes, not just
    because the object reference changed. This pattern is more precise and avoids potential
    infinite fetch loops during hot reload or client-side re-renders.
    */
  }, [test, session, userId, locale])

  const submitAnswers = async (finalAnswers: TestAnswers) => {
    // ── Local-only mode: no backend ──────────────────────────────────────────
    if (!test.apiEndpoint) {
      const score = computeLocalScore(test, finalAnswers)
      const mapping = test.resultMapping.find(({ min, max }) => score >= min && score <= max)
      setResult({ score, label: mapping?.label ?? '', submittedAt: new Date().toISOString() })
      return
    }

    // ── API mode ─────────────────────────────────────────────────────────────
    setIsSubmitting(true)
    setError(null)

    try {
      if (!session?.user) throw new Error('UNEXPECTED_ERROR')

      const answersPayload = test.questions.map((q) => finalAnswers[q.id] ?? (test.type === 'checkbox' ? false : 0))

      const res = await performAuthRequest<Record<string, unknown>>(
        session as CustomSession,
        `${APIUrl}/${test.apiEndpoint}`,
        { method: 'POST', body: { answers: answersPayload } as Record<string, unknown> }
      )

      if ('error' in res || !res.data) {
        // Map HTTP 429 to a dedicated RATE_LIMITED error for downstream handling
        if ('status' in res && res.status === 429) {
          throw new Error('RATE_LIMITED')
        }
        throw new Error('error' in res ? (res as { error: string }).error : 'SUBMISSION_FAILED')
      }
      const data = buildResultFromRaw(test, res.data, locale)

      setResult(data)
      if (userId) saveStored(test.id, userId, locale, { submittedAt: data.submittedAt, result: data })
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
    setStep(0)
    if (userId && test.apiEndpoint) {
      routing.locales.forEach((l) => clearStored(test.id, userId, l))
    }
  }

  const cooldownMs = (test.cooldownDays ?? 1) * 24 * 60 * 60 * 1000
  const isCooldown =
    result !== null && !!result.submittedAt && Date.now() - new Date(result.submittedAt).getTime() < cooldownMs

  return {
    step,
    setStep,
    answers,
    setAnswers,
    isSubmitting,
    result,
    isCooldown,
    error,
    resultRef,
    handleReset,
    submitAnswers,
  }
}
