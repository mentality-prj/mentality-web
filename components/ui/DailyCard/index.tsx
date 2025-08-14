import { DailyCardProps } from '@/types/dailyCard'

import { DefaultCard } from './DefaultCard'
import { SecondaryCard } from './SecondaryCard'

export const DailyCard: React.FC<DailyCardProps> = (props) => {
  switch (props.variant) {
    case 'secondary':
      return <SecondaryCard {...props} />
    case 'default':
    default:
      return <DefaultCard {...props} />
  }
}
