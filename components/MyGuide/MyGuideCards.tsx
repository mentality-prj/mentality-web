import { CustomCard } from '@/ds/components/CustomCard'
import { CustomLink } from '@/ds/components/CustomLink'
import { Card, CardContent } from '@/ds/shadcn/card'

type ExcersiseData = {
  id: string
  title: string
  icon?: React.ReactNode
  content: string
  category: string
}
type MyGuideProps = { excersises: ExcersiseData[] }

export const MyGuideCards = ({ excersises }: MyGuideProps) => {
  return (
    <Card className="flex w-full flex-col bg-surface-white tablet:min-w-[600px]">
      <CardContent className="grid grid-cols-1 gap-8 p-8 tablet:grid-cols-3 tablet:items-start tablet:justify-end">
        {excersises.map((excersise) => (
          <CustomCard key={excersise.id} variant="smallWithChildren" title={excersise.title} icon={excersise.icon}>
            <div>{excersise.content}</div>
            <CustomLink key={excersise.id} href={`/meditation/${excersise.id}`} className="flex justify-self-end">
              Go to {excersise.category}
            </CustomLink>
          </CustomCard>
        ))}
      </CardContent>
    </Card>
  )
}
