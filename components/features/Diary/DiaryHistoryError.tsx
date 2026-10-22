'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

/** A failed owner-scoped read is not evidence of an empty diary. */
export function DiaryHistoryError() {
  const router = useRouter()
  const t = useTranslations('pages.Diary')

  return (
    <section role="alert" className="rounded-2xl border border-[var(--outline-secondary)] bg-white p-6">
      <p className="text-sm text-textcolor-secondary">{t('historyError')}</p>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="mt-3 min-h-11 rounded-xl border border-[var(--outline-secondary)] px-4 py-2 text-sm font-medium text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {t('retryHistory')}
      </button>
    </section>
  )
}
