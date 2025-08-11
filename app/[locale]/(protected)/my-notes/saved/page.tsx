import { useTranslations } from 'next-intl'

import { SavedList } from '@/components/SavedList'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageTitle } from '@/components/ui/PageTitle'

export default function SavedPage() {
  const t = useTranslations('AffirmationsPage')
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        currentPage={'Збережене'}
        breadcrumbList={[{ title: `${t('ThoughtsList.title')}`, href: '/my-notes' }]}
      />
      <PageTitle title="Збережене" subtitle="Твої улюблені поради та афірмації" />
      <SavedList />
    </div>
  )
}
