'use client'

import { useTransition } from 'react'
import { RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useRouter } from '@/i18n/navigation'
import { Button } from '@/ui/button'

export function MoodStoryAdminBar() {
  const t = useTranslations('components.MoodStoryCard.admin')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <Button variant="secondary" size="small" onClick={handleRefresh} disabled={isPending}>
      <RefreshCw size={14} className={isPending ? 'animate-spin' : ''} />
      {t('refreshCta')}
    </Button>
  )
}
