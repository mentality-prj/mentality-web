'use client'

import { useTransition } from 'react'
import { RefreshCw, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { regenerateMoodStoryAction } from '@/actions/regenerateMoodStory'
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

  const handleRegenerate = () => {
    startTransition(async () => {
      await regenerateMoodStoryAction()
      router.refresh()
    })
  }

  return (
    <div className="flex gap-1">
      <Button
        variant="iconTool"
        onClick={handleRegenerate}
        disabled={isPending}
        aria-label={t('regenerateCta')}
        title={t('regenerateCta')}
      >
        <Sparkles size={14} className={isPending ? 'animate-pulse' : ''} />
      </Button>
      <Button
        variant="iconTool"
        onClick={handleRefresh}
        disabled={isPending}
        aria-label={t('refreshCta')}
        title={t('refreshCta')}
      >
        <RefreshCw size={14} className={isPending ? 'animate-spin' : ''} />
      </Button>
    </div>
  )
}
