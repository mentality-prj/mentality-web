import { getTranslations } from 'next-intl/server'

import TipsListClient from '@/components/features/Tips/TipsListClient'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function GuideTipsPage() {
  const t = await getTranslations('pages.Guide.tips')
  return (
    <article>
      <PageTitle title={t('title')} />
      <section className="mt-6">
        <TipsListClient />
      </section>
    </article>
  )
}
