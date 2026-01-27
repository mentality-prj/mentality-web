import { auth } from '@/auth'
import FavoriteButtonWrapper from '@/components/Buttons/FavoriteButtonWrapper'
import CardsList from '@/components/Cards/CardsList'
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
    <CardsList
      items={items}
      CardComponent={TipCard}
      renderTools={(a) => <FavoriteButtonWrapper itemType={ITEM_TYPE_DEFS.tips} itemId={String(a.id)} />}
      getKey={(i) => String(i.id)}
      className="space-y-4"
    />
  )
}
