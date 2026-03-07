'use client'
import { useTranslations } from 'next-intl'

import { InnerMenu } from '@/components/shared/InnerMenu'
import { iconMapSitemap } from '@/components/shared/Sitemap'
import { myProgressInnerMenuItems } from '@/constants/menu'

export default function MyProgressInnerMenu() {
  const t = useTranslations('pages.MyProgress')

  const items = myProgressInnerMenuItems.map((it) => ({
    key: it.key,
    href: it.href,
    label: t(`${it.key}.title`),
    icon: it.icon ? iconMapSitemap[it.icon] : undefined,
  }))

  return <InnerMenu items={items} />
}
