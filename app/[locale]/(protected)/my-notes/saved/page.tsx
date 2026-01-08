import { useTranslations } from 'next-intl'

import { SavedList } from '@/components/SavedList'
import { Breadcrumbs } from '@/ds/components/Breadcrumbs'
import { PageTitle } from '@/ds/components/PageTitle'

export default function SavedPage() {
  const t = useTranslations()
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        currentPage={t('pages.SavedPage.title')}
        breadcrumbList={[
          { title: `${t('common.Breadcrumbs.breadcrumbsList', { title: 'saved' })}`, href: '/my-notes' },
        ]}
      />
      <PageTitle title={t('pages.SavedPage.title')} subtitle={t('pages.SavedPage.subtitle')} />
      <SavedList />
    </div>
  )
}
