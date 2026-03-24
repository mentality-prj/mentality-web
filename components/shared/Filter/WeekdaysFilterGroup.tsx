import { useTranslations } from 'next-intl'

import { Tag } from '@/ds/components/Tag'
import { WeekValueType } from '@/mappers/weekdays.mapper'
import { ToggleGroup } from '@/ui/toggle-group'

export function WeekdaysFilterGroup({
  value,
  options,
  onChange,
}: {
  value: WeekValueType[]
  options: WeekValueType[]
  onChange: (v: WeekValueType[]) => void
}) {
  const t = useTranslations('components.Filter.filterOptions')
  return (
    <ToggleGroup type="multiple" value={value} onValueChange={onChange} className="flex-wrap justify-start gap-xs">
      {options.map((opt) => (
        <Tag text={t('tags', { tag: opt })} key={opt} value={opt} aria-label={`Toggle ${opt}`} />
      ))}
    </ToggleGroup>
  )
}
