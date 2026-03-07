'use client'

import { useTranslations } from 'next-intl'

import { InnerMenu } from '@/components/shared/InnerMenu'
import { iconMapSitemap } from '@/components/shared/Sitemap'
import { mentalGamesInnerMenuItems } from '@/constants/menu'

export function MentalGamesInnerMenu() {
  const t = useTranslations('pages.MentalGames')

  const items = mentalGamesInnerMenuItems.map((item) => ({
    key: item.key,
    href: item.href,
    label: t(`${item.key}.title`),
    icon: item.icon ? iconMapSitemap[item.icon] : undefined,
  }))

  return <InnerMenu items={items} />
}
