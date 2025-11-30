import { useTranslations } from 'next-intl'

import { ToggleGroup, ToggleGroupItem } from '@/ds/shadcn/toggle-group'
import { cn } from '@/lib/utils'

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
        <ToggleGroupItem
          key={opt}
          value={opt}
          aria-label={`Toggle ${opt}`}
          className={cn(
            "max-h-[22px] rounded-xs bg-secondary px-3 py-1 text-xs/[14px] text-textcolor-secondary data-[state='on']:bg-primary data-[state='on']:text-reversed"
          )}
        >
          {t(`${opt}Tag`)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
