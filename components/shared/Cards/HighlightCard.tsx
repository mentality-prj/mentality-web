import { ReactNode } from 'react'

import { Label } from '@/ui/label'

import Card from './Card'

type Props = {
  label: string
  description?: string
  labelHtmlFor?: string
  children: ReactNode
}

export function HighlightCard({ label, description, labelHtmlFor, children }: Props) {
  return (
    <Card>
      <Label htmlFor={labelHtmlFor} className="text-sm font-semibold">
        {label}
      </Label>
      {description && <p className="text-xs text-textcolor-secondary">{description}</p>}
      {children}
    </Card>
  )
}
