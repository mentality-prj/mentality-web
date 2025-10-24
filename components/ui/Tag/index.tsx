import { ToggleGroupItem } from '@/ds/shadcn/toggle-group'

interface TagProps {
  text: string
  value: string
}

export const Tag = ({ text, value }: TagProps) => {
  return (
    <ToggleGroupItem
      className="bg-tag-surfaceLightPurple rounded-xs px-3 py-1 text-textcolor-secondary hover:bg-primary-hover hover:text-reversed focus:outline-none focus-visible:bg-primary-focus focus-visible:ring-1 focus-visible:ring-primary-focus focus-visible:ring-offset-4 active:bg-primary-pressed data-[state='on']:bg-primary data-[state='on']:text-reversed data-[state='on']:focus-visible:bg-primary-focus"
      value={value}
    >
      {text}
    </ToggleGroupItem>
  )
}
