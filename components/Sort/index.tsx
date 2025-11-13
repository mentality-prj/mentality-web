import { useTranslations } from 'next-intl'

import { DropdownInput } from '@/ds/components/DropdownInput'
import { SortVerticalIcon } from '@/ds/icons/sort-vertical'

interface SortProps {
  id: string
  defaultValue: 'newest' | 'oldest'
  onValueChange: (value: 'newest' | 'oldest') => void
}

export const Sort = ({ id, defaultValue, onValueChange }: SortProps) => {
  const t = useTranslations('components.Sort')
  const itemsSort = [
    { value: 'newest', text: t('Newest') },
    { value: 'oldest', text: t('Oldest') },
  ]
  return (
    <DropdownInput
      id={id}
      label={t('Label')}
      defaultValue={defaultValue}
      onValueChange={(value) => onValueChange(value as 'newest' | 'oldest')}
      labelIcon={<SortVerticalIcon />}
      items={itemsSort}
    />
  )
}
