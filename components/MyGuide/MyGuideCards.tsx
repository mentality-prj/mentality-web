import { ReactNode } from 'react'

import { CustomCard } from '@/ds/components/CustomCard'
import { Card, CardContent } from '@/ds/shadcn/card'

type ExcersiseData = {
  id: string
  title: string
  icon?: ReactNode
  content: string
  category: string
}
type MyGuideProps = { excersises: ExcersiseData[] }

export const MyGuideCards = ({ excersises }: MyGuideProps) => {
  return (
    <Card className="flex w-full flex-col bg-surface-white tablet:min-w-[600px]">
      <CardContent className="grid grid-cols-1 gap-8 p-8 tablet:grid-cols-3 tablet:items-start tablet:justify-end">
        {excersises.map((excersise) => (
          <CustomCard
            key={excersise.id}
            title={excersise.title}
            text={excersise.content}
            icon={excersise.icon}
            hrefLink={`/meditation/${excersise.id}`}
            textLink={`Go  to ${excersise.category}`}
          />
        ))}
      </CardContent>
    </Card>
  )
}
