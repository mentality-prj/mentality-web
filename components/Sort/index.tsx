import { useTranslations } from 'next-intl'

import { DropdownInput } from '@/ds/components/DropdownInput'
import { SortVerticalIcon } from '@/ds/icons/sort-vertical'

interface SortProps {
  id: string
  value: 'newest' | 'oldest'
  onValueChange: (value: 'newest' | 'oldest') => void
}

export const Sort = ({ id, value, onValueChange }: SortProps) => {
  const t = useTranslations('components.Sort')
  const itemsSort = [
    { value: 'newest', text: t('Newest') },
    { value: 'oldest', text: t('Oldest') },
  ]
  return (
    <DropdownInput
      key={value}
      id={id}
      label={t('Label')}
      defaultValue={value}
      onValueChange={(value) => onValueChange(value as 'newest' | 'oldest')}
      labelIcon={<SortVerticalIcon />}
      items={itemsSort}
    />
  )
}
