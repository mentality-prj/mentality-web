import { getTranslations } from 'next-intl/server'

import GuideMeditationsClient from '@/components/features/Guide/GuideMeditationsClient'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function GuideMeditationsPage() {
  const t = await getTranslations('pages.Guide.meditations')
  return (
    <article>
      <PageTitle title={t('title')} />
      <section className="mt-6">
        <GuideMeditationsClient />
      </section>
    </article>
  )
}
