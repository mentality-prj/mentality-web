import { ComponentProps, ReactNode } from 'react'
import { X } from 'lucide-react'

import { ToggleGroupItem } from '@/ui/toggle-group'
import { cn } from '@/lib/utils'
import { Statuses, StatusType } from '@/types/status.types'

interface BaseTagProps {
  children?: ReactNode
  text?: string
  type?: StatusType
  className?: string
}

interface ToggleTagProps extends BaseTagProps, Omit<ComponentProps<typeof ToggleGroupItem>, 'children' | 'type'> {
  value: string // Required for ToggleGroupItem
  onRemove?: never
  onClick?: never
}

interface ClickableTagProps extends BaseTagProps {
  onClick: () => void
  onRemove?: never
  value?: never
}

interface RemovableTagProps extends BaseTagProps {
  text: string
  onRemove: (text: string) => void
  onClick?: never
  value?: never
}

interface StaticTagProps extends BaseTagProps {
  onClick?: never
  onRemove?: never
  value?: never
}

type TagProps = ToggleTagProps | ClickableTagProps | RemovableTagProps | StaticTagProps

export const Tag = ({ children, text, type = 'tag', className, ...props }: TagProps) => {
  const content = text || children

  // When used inside ToggleGroup (has value prop)
  if ('value' in props && props.value !== undefined) {
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
        className={cn(baseClasses, defaultClasses, hoverClasses, focusClasses, activeClasses, toggleClasses, className)}
        {...(props as ComponentProps<typeof ToggleGroupItem>)}
      >
        {content}
      </ToggleGroupItem>
    )
  }

  const base = `whitespace-nowrap rounded px-3 py-1 text-xs ${Statuses[type as StatusType]}`

  // When used as clickable button
  if ('onClick' in props && props.onClick) {
    const hoverClass = 'hover:bg-accent-soft hover:text-accent-foreground'
    return (
      <button
        type="button"
        onClick={props.onClick}
        className={cn(base, hoverClass, 'transition-colors', className)}
        style={{ textShadow: 'none' }}
      >
        {content}
      </button>
    )
  }

  // When used with remove functionality
  if ('onRemove' in props && props.onRemove) {
    const rawRemovalText = text ?? (typeof content === 'string' ? content : '')
    const removalText = (typeof rawRemovalText === 'string' ? rawRemovalText.trim() : '') || 'tag'
    return (
      <span className={cn('inline-flex items-center gap-1', base, className)}>
        <span>{content}</span>
        <button
          type="button"
          aria-label={removalText ? `remove-${removalText}` : 'remove-tag'}
          title="Remove"
          onClick={() => props.onRemove(removalText)}
          className="icon-tool-text -mr-1 p-0"
        >
          <X size={12} />
        </button>
      </span>
    )
  }

  // Static display only
  return <span className={cn(base, className)}>{content}</span>
}
