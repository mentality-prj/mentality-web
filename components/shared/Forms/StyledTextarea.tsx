'use client'
import { ComponentProps } from 'react'

import { cn } from '@/lib/utils'
import { Textarea as BaseTextarea } from '@/ui/textarea'

interface Props extends ComponentProps<'textarea'> {
  className?: string
}

export default function StyledTextarea({ className, ...props }: Props) {
  return (
    <BaseTextarea
      className={cn(
        'w-full rounded-sm border p-3 text-sm focus:border-info focus:outline-none focus-visible:ring-info/50',
        'disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
}
