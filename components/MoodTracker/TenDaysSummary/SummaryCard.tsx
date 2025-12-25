import { ReactNode } from 'react'

interface SummaryCardProps {
  title: string
  children: ReactNode
  icon: ReactNode
}

export const SummaryCard = ({ title, children, icon }: SummaryCardProps) => {
  return (
    <div className="relative flex h-full flex-col border-outline-secondary p-6 shadow-none">
      <div className="pointer-events-none absolute right-0 top-4">{icon}</div>
      <div className="p-0">
        <div>{title}</div>
      </div>
      <div className="z-10 mt-8 p-0">{children}</div>
    </div>
  )
}
