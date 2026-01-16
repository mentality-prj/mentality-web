import { auth } from '@/auth'
import FavoriteButtonWrapper from '@/components/Buttons/FavoriteButtonWrapper'
import { getAffirmations } from '@/requests/affirmations'
import type { LocalAffirmation } from '@/types/api-responses'
import { ITEM_TYPE_DEFS } from '@/types/itemTypes'

import AffirmationCard from './AffirmationCard'

const DailyAffirmationClient = async () => {
  const session = await auth()

  const res = await getAffirmations(session, 1, 1)
  if ('error' in res) return null

  const items = res.data?.items ?? []
  const localItem = items && items.length > 0 ? (items[0] as LocalAffirmation) : null

  if (!localItem) return null

  const tools = <FavoriteButtonWrapper itemType={ITEM_TYPE_DEFS.affirmations} itemId={localItem.id} />

  return <AffirmationCard item={localItem} tools={tools} />
}

export default DailyAffirmationClient
