'use client'

import { RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useRouter } from '@/i18n/navigation'
import { Button } from '@/ui/button'

export function MoodStoryAdminBar() {
  const t = useTranslations('components.MoodStoryCard.admin')
  const router = useRouter()

  return (
    <Button variant="secondary" size="small" onClick={() => router.refresh()}>
      <RefreshCw size={14} />
      {t('refreshCta')}
    </Button>
  )
}
