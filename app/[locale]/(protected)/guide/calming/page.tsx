import { getTranslations } from 'next-intl/server'

import GuideCalmingClient from '@/components/Guide/GuideCalmingClient'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function GuideCalmingPage() {
  const t = await getTranslations('pages.Guide.calming')
  return (
    <article>
      <PageTitle title={t('title')} />
      <section className="mt-6">
        <GuideCalmingClient />
      </section>
    </article>
  )
}
