import { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/ds/shadcn/card'

interface SummaryCardProps {
  title: string
  children: ReactNode
  icon: ReactNode
}

export const SummaryCard = ({ title, children, icon }: SummaryCardProps) => {
  return (
    <Card className="relative flex h-full flex-col border-outline-secondary p-4 shadow-none">
      <div className="pointer-events-none absolute right-0 top-4">{icon}</div>
      <CardHeader className="p-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="z-10 mt-auto p-0">{children}</CardContent>
    </Card>
  )
}
