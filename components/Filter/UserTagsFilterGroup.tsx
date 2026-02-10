import { Tag } from '@/ds/components/Tag'
import { ToggleGroup } from '@/ds/shadcn/toggle-group'
import { UserTag } from '@/types/tags'

export function UserTagsFilterGroup({
  value,
  tags,
  onChange,
}: {
  value: string
  tags: UserTag[]
  onChange: (v: string) => void
}) {
  return (
    <ToggleGroup type="single" value={value} onValueChange={onChange} className="flex-wrap justify-start gap-2">
      {tags.map((tag) => (
        <Tag text={tag.name || tag.key} key={tag.key} value={tag.key} aria-label={`Toggle ${tag.name || tag.key}`} />
      ))}
    </ToggleGroup>
  )
}
