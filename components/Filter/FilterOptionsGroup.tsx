import { useTranslations } from 'next-intl'

import { Tag } from '@/ds/components/Tag'
import { ToggleGroup } from '@/ds/shadcn/toggle-group'

export function FilterOptionGroup({
  value,
  options,
  onChange,
}: {
  value: string
  options: readonly string[]
  onChange: (v: string) => void
}) {
  const t = useTranslations('AffirmationsPage')
  return (
    <ToggleGroup type="single" value={value} onValueChange={onChange} className="flex-wrap justify-start gap-2">
      {options.map((opt) => (
        <Tag text={t(`${opt}Tag`)} key={opt} value={opt} aria-label={`Toggle ${opt}`} />
      ))}
    </ToggleGroup>
  )
}
