import { getTranslations } from 'next-intl/server'

import AffirmationsList from '@/components/Affirmations/AffirmationsList'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function affirmations() {
  const t = await getTranslations('common.PageTitle')

  return (
    <>
      <PageTitle title={t('title', { title: 'affirmations' })} subtitle={t('subtitle', { subtitle: 'affirmations' })} />
      <div className="mt-6">
        <AffirmationsList />
      </div>
    </>
  )
}
