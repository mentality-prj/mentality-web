'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { SectionCard } from '@/ds/components/SectionCard'
import { Button } from '@/ui/button'

/** A failed owner-scoped read is not evidence of an empty diary. */
export function DiaryHistoryError() {
  const router = useRouter()
  const t = useTranslations('pages.Diary')

  return (
    <section role="alert">
      <SectionCard className="border-outline-secondary rounded-2xl border p-6">
        <p className="text-sm text-textcolor-secondary">{t('historyError')}</p>
        <Button
          type="button"
          variant="secondary"
          size="medium"
          onClick={() => router.refresh()}
          className="mt-3 min-h-11"
        >
          {t('retryHistory')}
        </Button>
      </SectionCard>
    </section>
  )
}
