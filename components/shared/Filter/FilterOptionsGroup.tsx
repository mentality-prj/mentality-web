import { useTranslations } from 'next-intl'

import { Tag } from '@/ds/components/Tag'
import { ToggleGroup } from '@/ui/toggle-group'

type GroupProps = {
  options: readonly string[]
  filterKey?: 'tags' | 'categories' | 'moodLevel' | 'stressLevel' | 'energyLevel' | 'focusLevel' | 'week'
}

type MultiProps = GroupProps & {
  multiple: true
  value: string[]
  onChange: (values: string[]) => void
}

type SingleProps = GroupProps & {
  multiple?: false
  value: string
  onChange: (value: string) => void
}

type Props = MultiProps | SingleProps

export function FilterOptionGroup(props: Props) {
  const t = useTranslations('components.Filter')
  const translationKey = props.filterKey === 'categories' ? 'categories' : 'tags'

  const options = props.options.map((opt) => (
    <Tag
      text={t(`filterOptions.${translationKey}`, { tag: opt })}
      key={opt}
      value={opt}
      aria-label={`Toggle ${opt}`}
    />
  ))

  if (props.multiple) {
    return (
      <ToggleGroup
        type="multiple"
        value={props.value}
        onValueChange={props.onChange}
        className="flex-wrap justify-start gap-xs"
      >
        {options}
      </ToggleGroup>
    )
  }

  return (
    <ToggleGroup
      type="single"
      value={props.value}
      onValueChange={props.onChange}
      className="flex-wrap justify-start gap-xs"
    >
      {options}
    </ToggleGroup>
  )
}
