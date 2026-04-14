'use client'

import { Root as SwitchRoot, Thumb as SwitchThumb } from '@radix-ui/react-switch'
import { ClipboardCheck, FileText } from 'lucide-react'

import { cn } from '@/lib/utils'

interface AdminPreviewToggleProps {
  id?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
}

export function AdminPreviewToggle({ id, checked, onCheckedChange, label }: AdminPreviewToggleProps) {
  return (
    <div className="flex items-center gap-xs">
      <SwitchRoot
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn(
          'relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:bg-textcolor-muted data-[state=unchecked]:bg-primary',
          'hover:data-[state=unchecked]:opacity-90'
        )}
      >
        <SwitchThumb
          className={cn(
            'pointer-events-none relative flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md',
            'ring-0 transition-transform duration-200',
            'data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0'
          )}
        >
          <span
            className={cn(
              'absolute transition-opacity duration-150',
              checked ? 'opacity-0' : 'text-primary opacity-100'
            )}
          >
            <ClipboardCheck size={12} aria-hidden />
          </span>
          <span
            className={cn(
              'absolute transition-opacity duration-150',
              checked ? 'text-textcolor-muted opacity-100' : 'opacity-0'
            )}
          >
            <FileText size={12} aria-hidden />
          </span>
        </SwitchThumb>
      </SwitchRoot>

      {label && (
        <label htmlFor={id} className="cursor-pointer select-none text-sm text-textcolor-secondary">
          {label}
        </label>
      )}
    </div>
  )
}
