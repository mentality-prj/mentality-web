import { Tag } from '@/ds/components/Tag'
import { UserTag } from '@/types/tags'
import { ToggleGroup } from '@/ui/toggle-group'

export function UserTagsFilterGroup({
  value,
  tags,
  onChange,
}: {
  value: string[]
  tags: UserTag[]
  onChange: (v: string[]) => void
}) {
  return (
    <ToggleGroup type="multiple" value={value} onValueChange={onChange} className="flex-wrap justify-start gap-xs">
      {tags.map((tag) => (
        <Tag text={tag.name || tag.key} key={tag.key} value={tag.key} aria-label={`Toggle ${tag.name || tag.key}`} />
      ))}
    </ToggleGroup>
  )
}
