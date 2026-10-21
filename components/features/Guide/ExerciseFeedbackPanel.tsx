'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'
import { Routes } from '@/constants/routes'
import type { MoodAction } from '@/helpers/moodNextStep'
import { Link } from '@/i18n/navigation'
import { clearExerciseFeedback, saveExerciseFeedback } from '@/requests/exerciseFeedback'

type Props = {
  category: MoodAction
  initialHelpful: boolean | null
  loadFailed?: boolean
}

/**
 * Only a voluntary categorical answer. This does not record a completion,
 * derive medical effectiveness or submit diary/check-in data.
 */
export function ExerciseFeedbackPanel({ category, initialHelpful, loadFailed = false }: Props) {
  const t = useTranslations('components.ExercisesForRecovery.feedback')
  const { session } = useAuth()
  const [helpful, setHelpful] = useState<boolean | null>(initialHelpful)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<'saved' | 'cleared' | 'failed' | 'login' | null>(null)

  const submit = async (answer: boolean | null) => {
    if (saving) return
    if (!session?.user) {
      setMessage('login')
      return
    }
    setSaving(true)
    setMessage(null)
    try {
      const result =
        answer === null
          ? await clearExerciseFeedback(session, category)
          : await saveExerciseFeedback(session, category, answer)
      if ('error' in result) {
        setMessage('failed')
      } else {
        setHelpful(answer)
        setMessage(answer === null ? 'cleared' : 'saved')
      }
    } catch {
      setMessage('failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section
      aria-labelledby={`exercise-feedback-${category}`}
      className="mt-6 rounded-xl border border-current/10 p-4"
    >
      <h2 id={`exercise-feedback-${category}`} className="text-base font-semibold">
        {t('title')}
      </h2>
      <p className="mt-1 text-sm text-textcolor-secondary">{t('description')}</p>
      <div className="mt-3 flex flex-wrap gap-sm" role="group" aria-label={t('title')}>
        {([true, false] as const).map((answer) => (
          <button
            type="button"
            key={String(answer)}
            aria-pressed={helpful === answer}
            disabled={saving}
            onClick={() => void submit(answer)}
            className={[
              'min-h-11 rounded-xl border px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50',
              helpful === answer ? 'border-primary bg-primary/10' : 'border-current/20 hover:bg-black/5',
            ].join(' ')}
          >
            {t(answer ? 'helpful' : 'notHelpful')}
          </button>
        ))}
      </div>
      {helpful !== null && (
        <button
          type="button"
          disabled={saving}
          onClick={() => void submit(null)}
          className="mt-3 min-h-11 text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
        >
          {t('clear')}
        </button>
      )}
      <p className="mt-2 text-xs text-textcolor-secondary">{t('privacyNote')}</p>
      <p
        aria-live="polite"
        role={loadFailed && !message && !saving ? 'alert' : 'status'}
        className="mt-2 text-sm text-textcolor-secondary"
      >
        {saving ? t('saving') : message ? t(message) : loadFailed ? t('loadFailed') : helpful !== null ? t('previouslySaved') : ''}
      </p>
      {helpful !== null && (
        <Link
          href={Routes.MYPROGRESS}
          className="mt-3 inline-flex min-h-11 w-fit items-center text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {t('progressLink')}
        </Link>
      )}
    </section>
  )
}
