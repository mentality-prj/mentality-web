import { getTranslations } from 'next-intl/server'

import GuideBreathingClient from '@/components/features/Guide/GuideBreathingClient'
import { PageTitle } from '@/ds/components/PageTitle'

export default async function GuideBreathingPage() {
  const t = await getTranslations('pages.Guide.breathing')
  return (
    <article>
      <PageTitle title={t('title')} />
      <section className="mt-6">
        <GuideBreathingClient />
      </section>
    </article>
  )
}
