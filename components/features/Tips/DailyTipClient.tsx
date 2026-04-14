import { getLocale } from 'next-intl/server'

import { FavoriteButtonWrapper } from '@/components/shared/Buttons/FavoriteButtonWrapper'
import Card from '@/components/shared/Cards/Card'
import Quote from '@/components/shared/Quote'
import { getServerSession } from '@/lib/get-server-session'
import { getTipById } from '@/requests/tips'
import { ITEM_TYPE_DEFS } from '@/types/itemTypes'
import { SupportedLanguage } from '@/types/languages'
import { Statuses } from '@/types/status.types'

interface Props {
  recommendedId?: string
}

export const DailyTipClient = async ({ recommendedId }: Props = {}) => {
  const session = await getServerSession()
  const locale = await getLocale()

  if (!recommendedId) return null

  const res = await getTipById(session, recommendedId)
  if ('error' in res) return null

  const item = res.data

  const tools = <FavoriteButtonWrapper key="favorite" itemType={ITEM_TYPE_DEFS.tips} itemId={item.id} />

  return (
    <Card type={Statuses.base} tools={tools} className="mx-0 py-0 pl-0 pr-6">
      <Quote
        className="-mt-7 pr-6"
        text={item.translations?.[locale as SupportedLanguage] ?? item.translations?.en ?? ''}
      />
    </Card>
  )
}
