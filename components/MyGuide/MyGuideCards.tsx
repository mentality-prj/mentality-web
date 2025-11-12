import { CustomCard } from '@/ds/components/CustomCard'
import { Button } from '@/ds/shadcn/button'
import { Card, CardContent } from '@/ds/shadcn/card'

type CardData = {
  id: string
  title: string
  icon?: React.ReactNode
  content: string
  category: string
}
type MyGuideProps = { cards: CardData[] }

export const MyGuideCards = ({ cards }: MyGuideProps) => {
  return (
    <Card className="flex w-full flex-col bg-surface-white tablet:min-w-[600px]">
      <CardContent className="grid grid-cols-1 gap-8 p-8 tablet:grid-cols-3 tablet:items-start tablet:justify-end">
        {cards.map((card) => (
          <CustomCard key={card.id} variant="smallWithChildren" title={card.title} icon={card.icon}>
            <div>{card.content}</div>
            <Button variant="textButton" className="flex justify-self-end">
              Button
            </Button>
          </CustomCard>
        ))}
      </CardContent>
    </Card>
  )
}
