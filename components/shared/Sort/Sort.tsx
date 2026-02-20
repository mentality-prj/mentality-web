import { ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SORT_ORDER, SortOrder } from '@/types/sort'
import { Button } from '@/ui/button'

interface SortProps {
  id: string
  value: SortOrder
  onValueChange: (value: SortOrder) => void
}

export const Sort = ({ id, value, onValueChange }: SortProps) => {
  const t = useTranslations('components.Sort')

  const toggle = () => {
    const next: SortOrder = value === SORT_ORDER.NEWEST ? SORT_ORDER.OLDEST : SORT_ORDER.NEWEST
    onValueChange(next)
  }

  return (
    <Button
      id={id}
      type="button"
      aria-label={t('label')}
      onClick={toggle}
      variant="textButton"
      size="small"
      className="px-0"
    >
      <span className="mr-2 text-sm">{value === SORT_ORDER.NEWEST ? t('newest') : t('oldest')}</span>
      {value === SORT_ORDER.NEWEST ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
    </Button>
  )
}
