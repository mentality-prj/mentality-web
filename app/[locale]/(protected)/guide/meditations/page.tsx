import { getTranslations } from 'next-intl/server'

import { PageTitle } from '@/ds/components/PageTitle'

export default async function GuideMeditationsPage() {
  const t = await getTranslations('pages.Guide.meditations')
  return (
    <article>
      <PageTitle title={t('title')} />
    </article>
  )
}
