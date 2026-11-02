import { Eraser } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/ui/button'

interface ClearFiltersButtonProps {
  reset: () => void
  disabled?: boolean
}

export const ClearFiltersButton = ({ reset, disabled = false }: ClearFiltersButtonProps) => {
  const t = useTranslations('components.Filter')
  return (
    <Button type="button" variant="secondary" onClick={reset} size="small" disabled={disabled} className="pr-4">
      <Eraser />
      {t('clear')}
    </Button>
  )
}
