'use client'
import { useTranslations } from 'next-intl'

import { InnerMenu } from '@/components/shared/InnerMenu'
import { iconMap } from '@/components/shared/Sitemap'
import { psychologicalTestsInnerMenuItems } from '@/constants/menu'

export default function PsychologicalTestsInnerMenu() {
  const t = useTranslations('pages.PsychologicalTests')

  const items = psychologicalTestsInnerMenuItems.map((it) => ({
    key: it.key,
    href: it.href,
    label: t(`${it.key}.title`),
    icon: it.icon ? iconMap[it.icon] : undefined,
  }))

  return <InnerMenu items={items} />
}
