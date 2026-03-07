'use client'
import { useTranslations } from 'next-intl'

import { InnerMenu } from '@/components/shared/InnerMenu'
import { iconMapSitemap } from '@/components/shared/Sitemap'
import { adminInnerMenuItems } from '@/constants/menu'

export default function AdminInnerMenu() {
  const t = useTranslations('pages.Admin')

  const items = adminInnerMenuItems.map((it) => ({
    key: it.key,
    href: it.href,
    label: t(`${it.key}.title`),
    icon: it.icon ? iconMapSitemap[it.icon] : undefined,
  }))

  return <InnerMenu items={items} />
}
