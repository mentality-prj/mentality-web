'use client'

import { useTranslations } from 'next-intl'

import { AdminPreviewToggle } from '@/components/phq9/AdminPreviewToggle'
import { Button } from '@/ui/button'

interface TestAdminBarProps {
  testId: string
  showFormPreview: boolean
  onToggle: (checked: boolean) => void
  onReset: () => void
}

export function TestAdminBar({ testId, showFormPreview, onToggle, onReset }: TestAdminBarProps) {
  const t = useTranslations('components.TestQuestionnaire')
  return (
    <div className="flex items-center gap-xs">
      <AdminPreviewToggle
        id={`${testId}-admin-preview`}
        checked={showFormPreview}
        onCheckedChange={onToggle}
        label={t('adminModeLabel')}
      />
      <Button variant="secondary" size="small" onClick={onReset}>
        {t('adminResetButton')}
      </Button>
    </div>
  )
}
