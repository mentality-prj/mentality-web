import { useTranslations } from 'next-intl'

import { Tag } from '@/ds/components/Tag'
import { ToggleGroup } from '@/ui/toggle-group'

export function FilterOptionGroup({
  value,
  options,
  onChange,
  filterKey = 'tags',
}: {
  value: string
  options: readonly string[]
  onChange: (v: string) => void
  filterKey?: 'tags' | 'categories' | 'moodLevel' | 'stressLevel' | 'week'
}) {
  const t = useTranslations('components.Filter')
  const translationKey = filterKey === 'categories' ? 'categories' : 'tags'
  return (
    <ToggleGroup type="single" value={value} onValueChange={onChange} className="flex-wrap justify-start gap-xs">
      {options.map((opt) => (
        <Tag
          text={t(`filterOptions.${translationKey}`, { tag: `${opt}` })}
          key={opt}
          value={opt}
          aria-label={`Toggle ${opt}`}
        />
      ))}
    </ToggleGroup>
  )
}
