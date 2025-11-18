import { useTranslations } from 'next-intl'

import { SavedList } from '@/components/SavedList'
import { PageTitle } from '@/ds/components/PageTitle'
import { Breadcrumbs } from '@/ds/components/Breadcrumbs'

export default function SavedPage() {
  const t = useTranslations()
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        currentPage={t('AffirmationsPage.title')}
        breadcrumbList={[{ title: `${t('AffirmationsPage.ThoughtsList.title')}`, href: '/my-notes' }]}
      />
      <PageTitle title={t('SavedPage.title')} subtitle={t('SavedPage.subtitle')} />
      <SavedList />
    </div>
  )
}
