'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { useAuth } from '@/context/AuthProvider'
import type { MoodAction } from '@/helpers/moodNextStep'
import { Link } from '@/i18n/navigation'
import { clearExerciseFeedback, saveExerciseFeedback } from '@/requests/exerciseFeedback'
import { Button } from '@/ui/button'

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
    <section aria-labelledby={`exercise-feedback-${category}`} className="border-current/10 mt-6 rounded-xl border p-4">
      <h2 id={`exercise-feedback-${category}`} className="text-base font-semibold">
        {t('title')}
      </h2>
      <p className="mt-1 text-sm text-textcolor-secondary">{t('description')}</p>
      <div className="mt-3 flex flex-wrap gap-sm" role="group" aria-label={t('title')}>
        {([true, false] as const).map((answer) => (
          <Button
            type="button"
            variant="secondary"
            size="medium"
            key={String(answer)}
            aria-pressed={helpful === answer}
            disabled={saving}
            onClick={() => void submit(answer)}
            className={`min-h-11 disabled:opacity-50 ${helpful === answer ? 'border-primary bg-primary/10' : ''}`}
          >
            {t(answer ? 'helpful' : 'notHelpful')}
          </Button>
        ))}
      </div>
      {helpful !== null && (
        <Button
          type="button"
          variant="linkButton"
          size="medium"
          disabled={saving}
          onClick={() => void submit(null)}
          className="mt-3 min-h-11 disabled:opacity-50"
        >
          {t('clear')}
        </Button>
      )}
      <p className="mt-2 text-xs text-textcolor-secondary">{t('privacyNote')}</p>
      <p
        aria-live="polite"
        role={loadFailed && !message && !saving ? 'alert' : 'status'}
        className="mt-2 text-sm text-textcolor-secondary"
      >
        {saving
          ? t('saving')
          : message
            ? t(message)
            : loadFailed
              ? t('loadFailed')
              : helpful !== null
                ? t('previouslySaved')
                : ''}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        {helpful !== null && (
          <Link
            href={Routes.MYPROGRESS}
            className="inline-flex min-h-11 w-fit items-center text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t('progressLink')}
          </Link>
        )}
        <Link
          href={Routes.MYDAY}
          className="inline-flex min-h-11 w-fit items-center text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {t('returnToMyDay')}
        </Link>
      </div>
    </section>
  )
}
