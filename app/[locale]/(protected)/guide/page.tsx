import { getTranslations } from 'next-intl/server'

import { PageTitle } from '@/ds/components/PageTitle'

export default async function GuidePage() {
  const t = await getTranslations('pages.Guide')
  return (
    <article>
      <PageTitle title={t('title', { title: 'guide' })} subtitle={t('subtitle', { subtitle: 'guide' })} />
    </article>
  )
}
