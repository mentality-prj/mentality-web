import { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/ds/shadcn/card'

interface SummaryCardProps {
  title: string
  children: ReactNode
  icon: ReactNode
}

export const SummaryCard = ({ title, children, icon }: SummaryCardProps) => {
  return (
    <Card className="relative flex h-full flex-col border-outline-secondary shadow-none">
      <div className="pointer-events-none absolute right-0 top-4">{icon}</div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="z-10 mt-auto">{children}</CardContent>
    </Card>
  )
}
