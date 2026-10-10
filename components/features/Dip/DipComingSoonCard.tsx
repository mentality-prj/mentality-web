import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  title: string
  description: string
  badge?: string
}

export function DipComingSoonCard({ icon, title, description, badge }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background-alt px-8 py-12 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-textcolor-secondary">
        {icon}
      </div>
      <div className="flex items-center justify-center gap-2">
        <h3 className="text-base font-semibold text-textcolor-primary">{title}</h3>
        {badge ? (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{badge}</span>
        ) : null}
      </div>
      <p className="mx-auto mt-2 max-w-sm text-sm text-textcolor-secondary">{description}</p>
    </div>
  )
}
