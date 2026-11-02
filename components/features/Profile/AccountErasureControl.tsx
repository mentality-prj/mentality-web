'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import { authService } from '@/lib/auth'
import { fetchAccountErasureAvailability, submitAccountErasureRequest } from '@/requests/auth'

type Availability = {
  available: boolean
  status: 'not_requested' | 'erasure_in_progress'
  scope: 'dzvin_app_only'
}

const CONFIRMATION = 'DELETE MY ACCOUNT'

/**
 * No destructive browser-side API tokens: the BFF reads HttpOnly tokens,
 * verifies the server session and forwards a fresh signed Zitadel ID token.
 */
export function AccountErasureControl() {
  const t = useTranslations('pages.Profile.erasure')
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [understood, setUnderstood] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    void fetchAccountErasureAvailability()
      .then((result) => {
        if ('error' in result) throw new Error('unavailable')
        if (!cancelled) setAvailability(result.data)
      })
      .catch(() => {
        if (!cancelled) setMessage(t('statusUnavailable'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [t])

  async function submitErasure() {
    if (!understood || confirmation !== CONFIRMATION || submitting) return
    setSubmitting(true)
    setMessage('')
    try {
      const result = await submitAccountErasureRequest()
      if ('data' in result && result.data.status === 'erasure_in_progress') {
        setSubmitted(true)
        // Next's route removed ONLY the Dzvin HttpOnly auth cookie.
        // Do not trigger provider-wide logout for a shared Zitadel identity.
        setMessage(t('requested'))
        return
      }
      setMessage('error' in result && result.status === 401 ? t('freshAuthRequired') : t('requestUnavailable'))
    } catch {
      setMessage(t('requestUnavailable'))
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-lg border border-border bg-background-alt p-4 text-sm text-textcolor-primary"
      >
        {message}
      </div>
    )
  }

  return (
    <section aria-labelledby="dzvin-erasure-heading" className="space-y-4">
      <div className="space-y-2">
        <h2 id="dzvin-erasure-heading" className="text-lg font-semibold text-textcolor-primary">
          {t('title')}
        </h2>
        <p className="text-sm text-textcolor-secondary">{t('description')}</p>
        <p className="text-xs text-textcolor-secondary">{t('identityScope')}</p>
      </div>

      {loading ? (
        <p role="status" className="text-sm text-textcolor-secondary">
          {t('checking')}
        </p>
      ) : !availability?.available ? (
        <p
          role="status"
          className="rounded-lg border border-border bg-background-alt p-3 text-sm text-textcolor-secondary"
        >
          {message || t('notAvailable')}
        </p>
      ) : (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => void authService.reauthenticateForErasure()}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-textcolor-primary hover:bg-background-alt"
          >
            {t('reauthenticate')}
          </button>
          <label className="flex items-start gap-3 text-sm text-textcolor-primary">
            <input
              type="checkbox"
              checked={understood}
              onChange={(event) => setUnderstood(event.target.checked)}
              className="mt-1"
            />
            <span>{t('understand')}</span>
          </label>
          <label className="block space-y-2 text-sm text-textcolor-primary">
            <span>{t('typeConfirmation', { phrase: CONFIRMATION })}</span>
            <input
              type="text"
              value={confirmation}
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => setConfirmation(event.target.value)}
              className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-textcolor-primary"
              aria-label={t('confirmationLabel')}
            />
          </label>
          <button
            type="button"
            disabled={submitting || !understood || confirmation !== CONFIRMATION}
            onClick={() => void submitErasure()}
            className="rounded-lg bg-error px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? t('submitting') : t('submit')}
          </button>
        </div>
      )}
      {message && availability?.available && (
        <p role="alert" className="text-sm text-textcolor-primary">
          {message}
        </p>
      )}
    </section>
  )
}
