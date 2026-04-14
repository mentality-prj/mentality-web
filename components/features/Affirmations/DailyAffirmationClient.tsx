import { FavoriteButtonWrapper } from '@/components/shared/Buttons/FavoriteButtonWrapper'
import { getServerSession } from '@/lib/get-server-session'
import { getAffirmationById } from '@/requests/affirmations'
import { ITEM_TYPE_DEFS } from '@/types/itemTypes'

import AffirmationCard from './AffirmationCard'

interface Props {
  recommendedId?: string
}

export const DailyAffirmationClient = async ({ recommendedId }: Props = {}) => {
  const session = await getServerSession()

  if (!recommendedId) return null

  const res = await getAffirmationById(session, recommendedId)
  if ('error' in res) return null
  const affirmation = res.data

  if (!affirmation) return null

  const tools = <FavoriteButtonWrapper itemType={ITEM_TYPE_DEFS.affirmations} itemId={affirmation.id} />

  return <AffirmationCard item={affirmation} tools={tools} hideDate />
}
