import { auth } from '@/auth'
import { FavoriteButtonWrapper } from '@/components/shared/Buttons/FavoriteButtonWrapper'
import { getAffirmationById, getRandomAffirmation } from '@/requests/affirmations'
import { ITEM_TYPE_DEFS } from '@/types/itemTypes'

import AffirmationCard from './AffirmationCard'

interface Props {
  recommendedId?: string
}

export const DailyAffirmationClient = async ({ recommendedId }: Props = {}) => {
  const session = await auth()

  let affirmation = null
  if (recommendedId) {
    const res = await getAffirmationById(session, recommendedId)
    if ('error' in res) return null
    affirmation = res.data
  } else {
    const res = await getRandomAffirmation(session)
    if ('error' in res) return null
    affirmation = res.data
  }

  if (!affirmation) return null

  const tools = <FavoriteButtonWrapper itemType={ITEM_TYPE_DEFS.affirmations} itemId={affirmation.id} />

  return <AffirmationCard item={affirmation} tools={tools} hideDate />
}
