'use client'

import { useState, useTransition } from 'react'
import { RefreshCw, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { regenerateMoodStoryAction } from '@/actions/regenerateMoodStory'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/ui/button'
import { notifyError } from '@/utils/toast'

export function MoodStoryAdminBar() {
  const t = useTranslations('components.MoodStoryCard.admin')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    try {
      const result = await regenerateMoodStoryAction()
      if (!result.success) {
        notifyError(result.error ?? t('regenerateError'))
        return
      }
      startTransition(() => {
        router.refresh()
      })
    } catch {
      notifyError(t('regenerateError'))
    } finally {
      setIsRegenerating(false)
    }
  }

  const busy = isPending || isRegenerating

  return (
    <div className="flex gap-1">
      <Button
        variant="iconTool"
        onClick={handleRegenerate}
        disabled={busy}
        aria-label={t('regenerateCta')}
        title={t('regenerateCta')}
      >
        <Sparkles size={14} className={isRegenerating ? 'animate-pulse' : ''} />
      </Button>
      <Button
        variant="iconTool"
        onClick={handleRefresh}
        disabled={busy}
        aria-label={t('refreshCta')}
        title={t('refreshCta')}
      >
        <RefreshCw size={14} className={isPending ? 'animate-spin' : ''} />
      </Button>
    </div>
  )
}
