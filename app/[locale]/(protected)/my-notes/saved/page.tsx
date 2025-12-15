import { useTranslations } from 'next-intl'

import { SavedList } from '@/components/SavedList'
import { Breadcrumbs } from '@/ds/components/Breadcrumbs'
import { PageTitle } from '@/ds/components/PageTitle'

export default function SavedPage() {
  const t = useTranslations('common')
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        currentPage={t('PageTitle.title', { title: 'saved' })}
        breadcrumbList={[{ title: `${t('Breadcrumbs.breadcrumbsList', { title: 'saved' })}`, href: '/my-notes' }]}
      />
      <PageTitle
        title={t('PageTitle.title', { title: 'saved' })}
        subtitle={t('PageTitle.subtitle', { subtitle: 'saved' })}
      />
      <SavedList />
    </div>
  )
}
