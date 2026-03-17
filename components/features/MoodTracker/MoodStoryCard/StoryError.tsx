'use client'

import { RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useRouter } from '@/i18n/navigation'
import { Button } from '@/ui/button'

export function StoryError() {
  const t = useTranslations('components.MoodStoryCard.error')
  const router = useRouter()

  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <p className="text-base font-medium">{t('title')}</p>
      <p className="text-textcolor-tertiary text-sm">{t('description')}</p>
      <Button variant="secondary" size="medium" onClick={() => router.refresh()}>
        <RefreshCw size={16} />
        {t('retryCta')}
      </Button>
    </div>
  )
}
