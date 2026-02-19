import { SquarePen } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/ui/button'

interface EditTipsButtonProps {
  onEdit?: () => void
  className?: string
}

export default function EditTipButton({ onEdit, className = '' }: EditTipsButtonProps) {
  const t = useTranslations('common.Buttons')

  return (
    <Button variant="iconTool" aria-label={t('edit')} onClick={onEdit} title={t('edit')} className={className}>
      <SquarePen size={12} />
    </Button>
  )
}
