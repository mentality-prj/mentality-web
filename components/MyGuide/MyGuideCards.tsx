import { CustomCard } from '@/ds/components/CustomCard'
import { Card, CardContent } from '@/ds/shadcn/card'
import { MeditationData } from '@/types/myGuige'

type MyGuideCardsProps = {
  meditations: MeditationData[]
  textLink: string
}

export function MyGuideCards({ meditations, textLink }: MyGuideCardsProps) {
  return (
    <Card className="flex w-full flex-col bg-surface-white tablet:min-w-[600px]">
      <CardContent className="grid grid-cols-1 gap-8 p-8 tablet:grid-cols-3 tablet:items-start tablet:justify-end">
        {meditations.map((meditation) => (
          <CustomCard
            key={meditation.id}
            title={meditation.title}
            text={meditation.annotation}
            hrefLink={`/meditations/${meditation.id}`}
            textLink={textLink}
          />
        ))}
      </CardContent>
    </Card>
  )
}
