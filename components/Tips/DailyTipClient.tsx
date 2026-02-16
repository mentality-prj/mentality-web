import { getLocale } from 'next-intl/server'

import { auth } from '@/auth'
import Card from '@/components/Cards/Card'
import Quote from '@/components/Quote'
import { getTips } from '@/requests/tips'
import { ITEM_TYPE_DEFS } from '@/types/itemTypes'
import { SupportedLanguage } from '@/types/languages'
import { Statuses } from '@/types/status.types'

import FavoriteButtonWrapper from '../Buttons/FavoriteButtonWrapper'

export const DailyTipClient = async () => {
  const session = await auth()
  const locale = await getLocale()

  const res = await getTips(session, 1, 1)
  if ('error' in res) return null

  const items = res.data?.items ?? []
  const item = items.length > 0 ? items[0] : null
  if (!item) return null

  const tools = <FavoriteButtonWrapper key="favorite" itemType={ITEM_TYPE_DEFS.tips} itemId={item.id} />

  return (
    <Card type={Statuses.base} tools={tools}>
      <Quote text={item.translations?.[locale as SupportedLanguage] ?? item.translations?.en ?? ''} />
    </Card>
  )
}
