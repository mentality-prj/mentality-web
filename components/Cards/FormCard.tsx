'use client'
import { ReactNode } from 'react'

import { Button } from '@/ds/shadcn/button'

interface FormCardProps {
  title: ReactNode
  tools?: ReactNode
  children?: ReactNode
  className?: string
  onSubmit?: () => void
  onCancel?: () => void
  submitDisabled?: boolean
  submitLabel?: ReactNode
  cancelLabel?: ReactNode
}

export default function FormCard({
  title,
  tools,
  children,
  className = '',
  onSubmit,
  onCancel,
  submitDisabled = false,
  submitLabel,
  cancelLabel,
}: FormCardProps) {
  return (
    <div className={`rounded-2xl bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-start justify-between">
        <h3>{title}</h3>
        <div>{tools}</div>
      </div>

      <div className="mt-4">{children}</div>

      {onSubmit &&
        (onCancel && cancelLabel ? (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div>
              <Button variant="secondary" className="w-full" onClick={onCancel}>
                {cancelLabel}
              </Button>
            </div>

            <div className="flex gap-3">
              <Button variant="volume" className="flex-1" onClick={onSubmit} disabled={submitDisabled}>
                {submitLabel}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <Button variant="volume" className="w-full" onClick={onSubmit} disabled={submitDisabled}>
              {submitLabel}
            </Button>
          </div>
        ))}
    </div>
  )
}
