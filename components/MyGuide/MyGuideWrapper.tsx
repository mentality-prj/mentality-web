import { getTranslations } from 'next-intl/server'

import { getMeditations } from '@/actions/meditations.actions'
import { MyGuideTabs } from '@/components/MyGuide/MyGuideTabs'

export default async function MyGuideWrapper() {
  const t = await getTranslations('Guide')
  const meditations = await getMeditations()

  const categories = [
    { key: 'All', label: t('Tabs.All') },
    { key: 'meditations', label: t('Tabs.meditations') },
    { key: 'breathing', label: t('Tabs.breathing') },
    { key: 'calming', label: t('Tabs.calming') },
  ]

  return <MyGuideTabs meditations={meditations} categories={categories} textLink={t('textLink')} />
}
