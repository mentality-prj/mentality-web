import { auth } from '@/auth'
import FavoriteButtonWrapper from '@/components/Buttons/FavoriteButtonWrapper'
import { PAGE_SIZE } from '@/constants/pagination'
import { getTips, getUnpublishedTips } from '@/requests/tips'
import { ITEM_TYPE_DEFS } from '@/types/itemTypes'

import TipCard from './TipCard'

interface Props {
  fetchUnpublished?: boolean
  page?: number
}

export default async function TipsList({ fetchUnpublished = false, page = 1 }: Props) {
  const session = await auth()

  const res = fetchUnpublished
    ? await getUnpublishedTips(session, page, PAGE_SIZE)
    : await getTips(session, page, PAGE_SIZE)
  if ('error' in res) return null

  const items = res.data?.items ?? []

  return (
    <div className="space-y-4">
      <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => {
          const tools = <FavoriteButtonWrapper itemType={ITEM_TYPE_DEFS.tips} itemId={String(a.id)} />
          return (
            <li key={String(a.id)} className="h-full flex-1">
              <TipCard item={a} tools={tools} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
