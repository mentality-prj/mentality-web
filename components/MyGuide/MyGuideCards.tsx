import CardContainer from '@/components/Cards/CardContainer'
import CustomCard from '@/ds/components/CustomCard'
import { MeditationData } from '@/types/myGuige'

type MyGuideCardsProps = {
  meditations: MeditationData[]
  textLink: string
}

export function MyGuideCards({ meditations, textLink }: MyGuideCardsProps) {
  return (
    <CardContainer>
      {meditations.map((meditation) => (
        <CustomCard
          key={meditation.id}
          title={meditation.title}
          text={meditation.annotation}
          hrefLink={`/meditations/${meditation.id}`}
          textLink={textLink}
        />
      ))}
    </CardContainer>
  )
}
