import { getTranslations } from 'next-intl/server'

import { PageTitle } from '@/ds/components/PageTitle'

export default async function GuideTipsPage() {
  const t = await getTranslations('pages.Guide')
  return (
    <article>
      <PageTitle title={t('title', { title: 'tips' })} subtitle={t('subtitle', { subtitle: 'tips' })} />
    </article>
  )
}
