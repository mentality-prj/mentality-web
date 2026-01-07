import { getTranslations } from 'next-intl/server'

import { PageTitle } from '@/ds/components/PageTitle'

export default async function GuideTipsPage() {
  const t = await getTranslations('pages.Guide.tips')
  return (
    <article>
      <PageTitle title={t('title')} />
    </article>
  )
}
