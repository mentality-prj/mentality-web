import { getLocale, getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { FavoriteButtonWrapper } from '@/components/shared/Buttons/FavoriteButtonWrapper'
import Card from '@/components/shared/Cards/Card'
import Quote from '@/components/shared/Quote'
import { Link } from '@/i18n/navigation'
import { getTips } from '@/requests/tips'
import { ITEM_TYPE_DEFS } from '@/types/itemTypes'
import { SupportedLanguage } from '@/types/languages'
import { Statuses } from '@/types/status.types'

export const DailyTipClient = async () => {
  const t = await getTranslations('components.DailyCard')
  const session = await auth()
  const locale = await getLocale()

  const res = await getTips(session, 1, 1)
  if ('error' in res) return null

  const items = res.data?.items ?? []
  const item = items.length > 0 ? items[0] : null
  if (!item) return null

  const tools = (
    <FavoriteButtonWrapper
      className="absolute right-6 top-2 z-20"
      key="favorite"
      itemType={ITEM_TYPE_DEFS.tips}
      itemId={item.id}
    />
  )

  return (
    <Card className="relative" type={Statuses.base} tools={tools}>
      <Link className="absolute inset-0 z-0" href="/guide/tips" title={t('linkText', { type: 'tip' })} />
      <Quote text={item.translations?.[locale as SupportedLanguage] ?? item.translations?.en ?? ''} />
    </Card>
  )
}
