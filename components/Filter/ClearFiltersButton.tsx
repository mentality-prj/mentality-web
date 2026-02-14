import { Eraser } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'

interface ClearFiltersButtonProps {
  reset: () => void
}

export const ClearFiltersButton = ({ reset }: ClearFiltersButtonProps) => {
  const t = useTranslations('components.Filter')
  return (
    <Button variant="secondary" onClick={reset} size="small" className="pr-4">
      <Eraser />
      {t('clear')}
    </Button>
  )
}
