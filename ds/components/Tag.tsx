import { ComponentProps } from 'react'

import { ToggleGroupItem } from '@/ds/shadcn/toggle-group'

interface TagProps extends ComponentProps<typeof ToggleGroupItem> {
  text: string
}

export const Tag = ({ text, ...props }: TagProps) => {
  return (
    <ToggleGroupItem
      className="max-h-[22px] rounded-xs bg-secondary px-3 py-1 text-xs/[14px] text-textcolor-secondary hover:bg-primary-hover hover:text-reversed focus:outline-none focus-visible:bg-primary-focus focus-visible:ring-1 focus-visible:ring-primary-focus focus-visible:ring-offset-4 active:bg-primary-pressed data-[state='on']:bg-primary data-[state='on']:text-reversed data-[state='on']:focus-visible:bg-primary-focus"
      {...props}
    >
      {text}
    </ToggleGroupItem>
  )
}
