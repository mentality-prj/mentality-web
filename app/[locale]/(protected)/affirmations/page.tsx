import { getTranslations } from 'next-intl/server'

import AffirmationsList from '@/components/features/Affirmations/AffirmationsList'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function affirmations() {
  const t = await getTranslations('pages.AffirmationsPage')

  return (
    <article>
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
      <div className="mt-6">
        <AffirmationsList />
      </div>
    </article>
  )
}
