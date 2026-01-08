import { getTranslations } from 'next-intl/server'

import { PageTitle } from '@/ds/components/PageTitle'

export default async function GuidePage() {
  const t = await getTranslations('pages.Guide')
  return (
    <article>
      <PageTitle title={t('title')} subtitle={t('subtitle')} />
    </article>
  )
}
