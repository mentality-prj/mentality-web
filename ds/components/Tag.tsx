import { ComponentProps } from 'react'

import { ToggleGroupItem } from '@/ds/shadcn/toggle-group'
import { cn } from '@/lib/utils'

interface TagProps extends ComponentProps<typeof ToggleGroupItem> {
  text: string
}

export const Tag = ({ text, ...props }: TagProps) => {
  const baseClasses = 'whitespace-nowrap rounded px-3 py-1 text-xs/[14px] max-h-[22px]'
  const defaultClasses = 'bg-background-muted text-textcolor-primary'
  const hoverClasses = 'hover:bg-primary-hover hover:text-reversed'
  const focusClasses =
    'focus:outline-none focus-visible:bg-primary-focus focus-visible:ring-1 focus-visible:ring-offset-4 focus-visible:ring-primary-focus'
  const activeClasses = 'active:bg-primary-pressed'
  const toggleClasses =
    'data-[state="on"]:bg-primary data-[state="on"]:text-reversed data-[state="on"]:focus-visible:bg-primary-focus'

  return (
    <ToggleGroupItem
      className={cn(baseClasses, defaultClasses, hoverClasses, focusClasses, activeClasses, toggleClasses)}
      {...props}
    >
      {text}
    </ToggleGroupItem>
  )
}
