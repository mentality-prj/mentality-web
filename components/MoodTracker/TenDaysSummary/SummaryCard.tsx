import { ReactNode } from 'react'

interface SummaryCardProps {
  title: string
  children: ReactNode
  icon: ReactNode
}

export const SummaryCard = ({ title, children, icon }: SummaryCardProps) => {
  return (
    <div className="relative flex min-h-40 w-full flex-col gap-6">
      <div className="pointer-events-none absolute right-0 top-0">{icon}</div>
      <h4>{title}</h4>
      <div className="z-10">{children}</div>
    </div>
  )
}
