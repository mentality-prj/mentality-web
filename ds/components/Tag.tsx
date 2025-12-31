import { ComponentProps } from 'react'

import { ToggleGroupItem } from '@/ds/shadcn/toggle-group'

interface TagProps extends ComponentProps<typeof ToggleGroupItem> {
  text: string
}

export const Tag = ({ text, ...props }: TagProps) => {
  return (
    <ToggleGroupItem
      className="hover:text-reversed focus-visible:bg-primary-focus focus-visible:ring-primary-focus active:bg-primary-pressed data-[state='on']:text-reversed data-[state='on']:focus-visible:bg-primary-focus max-h-[22px] rounded-xs bg-secondary px-3 py-1 text-xs/[14px] text-textcolor-secondary hover:bg-primary-hover focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-4 data-[state='on']:bg-primary"
      {...props}
    >
      {text}
    </ToggleGroupItem>
  )
}
