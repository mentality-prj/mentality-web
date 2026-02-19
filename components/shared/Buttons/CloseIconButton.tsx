import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/ui/button'

interface CloseIconButtonProps {
  onClick?: () => void
  className?: string
}

export default function CloseIconButton({ onClick, className = 'ml-4 h-7 w-7' }: CloseIconButtonProps) {
  const t = useTranslations('common.Buttons')

  return (
    <Button variant="iconTool" aria-label={t('close')} title={t('close')} onClick={onClick} className={className}>
      <X className="h-5 w-5" />
    </Button>
  )
}
