import { auth } from '@/auth'
import FavoriteButtonWrapper from '@/components/shared/Buttons/FavoriteButtonWrapper'
import { ADMIN_PAGE_SIZE } from '@/constants/pagination'
import { getAffirmations, getUnpublishedAffirmations } from '@/requests/affirmations'
import { ITEM_TYPE_DEFS } from '@/types/itemTypes'

import AffirmationCard from './AffirmationCard'

interface Props {
  fetchUnpublished?: boolean
  page?: number
}

export default async function AffirmationsList({ fetchUnpublished = false, page = 1 }: Props) {
  const session = await auth()

  const res = fetchUnpublished
    ? await getUnpublishedAffirmations(session, page, ADMIN_PAGE_SIZE)
    : await getAffirmations(session, page, ADMIN_PAGE_SIZE)

  if ('error' in res) return null

  const items = res.data?.items ?? []

  return (
    <div className="space-y-4">
      <ul className="grid grid-cols-1 items-stretch gap-sm sm:grid-cols-2 lg:grid-cols-4">
        {items.map((a) => {
          const tools = <FavoriteButtonWrapper itemType={ITEM_TYPE_DEFS.affirmations} itemId={String(a.id)} />
          return (
            <li key={String(a.id)} className="h-full flex-1">
              <AffirmationCard item={a} tools={tools} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
