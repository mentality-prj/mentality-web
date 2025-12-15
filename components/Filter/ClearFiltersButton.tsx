import { useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'

interface ClearFiltersButtonProps {
  reset: () => void
  hasActiveFilters: boolean
  sort: 'newest' | 'oldest'
}

export const ClearFiltersButton = ({ reset, hasActiveFilters, sort }: ClearFiltersButtonProps) => {
  const t = useTranslations('components.Filter')
  return (
    <Button variant="linkButton" onClick={reset} disabled={!hasActiveFilters && sort === 'newest'}>
      {t('clear')}
    </Button>
  )
}
