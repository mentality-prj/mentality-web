import { getLocale } from 'next-intl/server'

import { auth } from '@/auth'
import { FavoriteButtonWrapper } from '@/components/shared/Buttons/FavoriteButtonWrapper'
import Card from '@/components/shared/Cards/Card'
import Quote from '@/components/shared/Quote'
import { Routes } from '@/constants/routes'
import { getTips } from '@/requests/tips'
import { ITEM_TYPE_DEFS } from '@/types/itemTypes'
import { SupportedLanguage } from '@/types/languages'
import { Statuses } from '@/types/status.types'

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
    <Card type={Statuses.base} tools={tools} link={Routes.GUIDETIPS} className="mx-0 py-0 pl-0 pr-6">
      <Quote text={item.translations?.[locale as SupportedLanguage] ?? item.translations?.en ?? ''} />
    </Card>
  )
}
